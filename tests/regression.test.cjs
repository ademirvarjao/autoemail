const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { test } = require('node:test');
const vm = require('node:vm');

const root = join(__dirname, '..');
const main = readFileSync(join(root, 'main'), 'utf8');
const painel = readFileSync(join(root, 'painel'), 'utf8');
const script = painel.match(/<script>([\s\S]*?)<\/script>/)[1];

function backend(overrides = {}) {
  const context = vm.createContext({ console: { error() {} }, ...overrides });
  vm.runInContext(main, context, { filename: 'main' });
  return context;
}

function templateBackend({ failWrite = false } = {}) {
  const events = [];
  const rows = [
    ['Nome', 'Assunto', 'Conteudo', 'Data Atualização'],
    ['Nome', 'Assunto real', 'DRIVE:old', '']
  ];
  const sheet = {
    getDataRange: () => ({ getValues: () => rows }),
    getRange: () => ({ setValues(values) {
      events.push('write');
      if (failWrite) throw new Error('Falha de gravação');
      rows[1] = values[0];
    } })
  };
  const context = backend({
    SpreadsheetApp: { getActiveSpreadsheet: () => ({ getSheetByName: () => sheet }) },
    DriveApp: { getFileById: () => ({
      setTrashed: () => events.push('trash'),
      getBlob: () => ({ getDataAsString: () => '<p>Template real</p>' })
    }) }
  });
  return { context, events };
}

test('backend e script do painel têm sintaxe válida', () => {
  assert.doesNotThrow(() => new vm.Script(main));
  assert.doesNotThrow(() => new vm.Script(script));
});

test('template chamado Nome não é confundido com o cabeçalho', () => {
  const { context } = templateBackend();
  const result = context.carregarTemplateEspecifico('Nome');
  assert.equal(result.success, true);
  assert.equal(result.assunto, 'Assunto real');
  assert.equal(result.corpo, '<p>Template real</p>');
});

test('arquivo antigo só é descartado após salvar a substituição', () => {
  const { context, events } = templateBackend();
  assert.equal(context.salvarNovoTemplate('Nome', 'Nome', 'Assunto', '<p>Novo</p>').success, true);
  assert.deepEqual(events, ['write', 'trash']);
});

test('falha na gravação preserva o arquivo antigo no Drive', () => {
  const { context, events } = templateBackend({ failWrite: true });
  assert.equal(context.salvarNovoTemplate('Nome', 'Nome', 'Assunto', '<p>Novo</p>').success, false);
  assert.deepEqual(events, ['write']);
});

test('importação não declara sucesso quando o salvamento falha', () => {
  const context = backend();
  let calls = 0;
  context.salvarNovoTemplate = () => (++calls === 1
    ? { success: true }
    : { success: false, message: 'Sem espaço' });
  const result = context.importarTemplatesGeral([
    { nome: 'A', corpo: 'A' }, { nome: 'B', corpo: 'B' }, { nome: 'C', corpo: 'C' }
  ]);
  assert.equal(result.success, false);
  assert.match(result.message, /1 templates importados antes da falha/);
  assert.match(result.message, /Sem espaço/);
  assert.equal(calls, 2);
});

test('importação aceita templates válidos e ignora registros inválidos sem quebrar', () => {
  const context = backend();
  const saved = [];
  context.salvarNovoTemplate = (...args) => { saved.push(args); return { success: true }; };
  const result = context.importarTemplatesGeral([
    null, {}, { nome: 4, corpo: 'inválido' }, { nome: ' ', corpo: 'inválido' },
    { nome: 'A', assunto: 'Teste', corpo: '<p>A</p>' }
  ]);
  assert.equal(result.success, true);
  assert.match(result.message, /^1 templates/);
  assert.deepEqual(saved, [['A', 'A', 'Teste', '<p>A</p>']]);
  assert.equal(context.importarTemplatesGeral({}).success, false);
});

test('personalização mantém valores, zero, HTML e fallback de variáveis', () => {
  const context = backend();
  assert.equal(context.personalizarTexto(
    '<p>{{ Nome }}: {{Saldo}} {{desconhecida}}</p>', ['Nome', 'Saldo'], ['Ana', 0]
  ), '<p>Ana: 0 </p>');
});

test('variáveis com nomes herdados de Object não vazam propriedades', () => {
  const context = backend();
  assert.equal(context.personalizarTexto('{{constructor}}/{{__proto__}}', ['Nome'], ['Ana']), '/');
  assert.equal(context.personalizarTexto('{{__proto__}}', ['__proto__'], ['Valor']), 'Valor');
});

function frontend() {
  const readers = [];
  const alerts = [];
  const nodes = [];
  const container = { innerHTML: '', appendChild: node => nodes.push(node) };
  const context = vm.createContext({
    window: {}, console,
    alert: message => alerts.push(message),
    document: {
      getElementById: () => container,
      createElement: () => ({
        innerHTML: '', label: { textContent: '' },
        querySelector() { return this.label; }
      })
    },
    FileReader: class {
      constructor() { readers.push(this); }
      readAsDataURL() {}
    }
  });
  vm.runInContext(script, context, { filename: 'painel-script' });
  return { context, readers, alerts, nodes };
}

const MB = 1024 * 1024;
const file = (name, size) => ({ name, size: size * MB, type: 'application/pdf' });
const complete = reader => reader.onload({ target: { result: 'data:application/pdf;base64,QQ==' } });
const stateOf = context => vm.runInContext('state', context);

test('limite total de anexos é respeitado antes de leituras assíncronas terminarem', () => {
  const { context, readers, alerts } = frontend();
  const input = { files: [file('a', 8), file('b', 8), file('c', 8)], value: 'arquivos' };
  context.handleFileSelect(input);
  assert.equal(readers.length, 2);
  assert.equal(stateOf(context).totalSizeBytes, 16 * MB);
  readers.forEach(complete);
  assert.equal(stateOf(context).anexos.length, 2);
  assert.equal(stateOf(context).totalSizeBytes, 16 * MB);
  assert.equal(alerts.length, 1);
  assert.equal(input.value, '');
});

test('erro ou cancelamento de leitura libera o tamanho reservado', () => {
  const { context, readers, alerts } = frontend();
  context.handleFileSelect({ files: [file('a', 10), file('b', 10)] });
  readers[0].onerror();
  readers[1].onabort();
  assert.equal(stateOf(context).totalSizeBytes, 0);
  assert.equal(stateOf(context).anexos.length, 0);
  assert.equal(alerts.length, 2);
});

test('erro síncrono de leitura também libera a reserva', () => {
  const { context } = frontend();
  context.FileReader = class { readAsDataURL() { throw new Error('Falha'); } };
  context.handleFileSelect({ files: [file('a', 10)] });
  assert.equal(stateOf(context).totalSizeBytes, 0);
});

test('limite individual permanece em 10 MB e remoção desconta o tamanho', () => {
  const { context, readers, alerts } = frontend();
  context.handleFileSelect({ files: [file('grande', 11), file('normal', 10)] });
  assert.equal(readers.length, 1);
  assert.equal(alerts.length, 1);
  complete(readers[0]);
  context.removerAnexo(0);
  assert.equal(stateOf(context).totalSizeBytes, 0);
  assert.equal(stateOf(context).anexos.length, 0);
});

test('nome de anexo é exibido como texto e não como HTML executável', () => {
  const { context, readers, nodes } = frontend();
  const name = '<img src=x onerror=alert(1)>.pdf';
  context.handleFileSelect({ files: [file(name, 1)] });
  complete(readers[0]);
  assert.equal(nodes[0].label.textContent, name);
  assert.equal(nodes[0].innerHTML.includes(name), false);
});

test('falha ao carregar variáveis usa o tratamento de erro existente', () => {
  const { context } = frontend();
  let failureHandler;
  context.google = { script: { run: {
    withSuccessHandler() { return this; },
    withFailureHandler(handler) { failureHandler = handler; return this; },
    getVariaveisDisponiveis() {}
  } } };
  context.carregarVariaveis();
  assert.equal(failureHandler, context.handleError);
});
