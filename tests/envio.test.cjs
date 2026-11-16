const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { test } = require('node:test');
const vm = require('node:vm');
const main = readFileSync(join(__dirname, '..', 'main'), 'utf8');

function setup(count = 3, quota = 100) {
  const user = new Map();
  const script = new Map();
  const files = new Map();
  const sent = [];
  const reports = [];
  const tracking = [];
  let uuid = 0;
  let held = false;
  let lockedOut = false;
  let failSend = false;
  let failReport = false;
  let failTracking = false;
  let failCheckpoint = false;
  let tick = 0;
  let now = 0;
  const properties = map => ({
    getProperty: key => map.get(key) || null,
    setProperty(key, value) {
      if (map === user && failCheckpoint && JSON.parse(value).sucesso > 0) throw new Error('Checkpoint indisponível');
      map.set(key, value);
    },
    deleteProperty: key => map.delete(key)
  });
  const ss = { getId: () => 'sheet-1' };
  const lock = {
    tryLock() { if (held || lockedOut) return false; held = true; return true; },
    releaseLock() { held = false; }
  };
  class Clock extends Date { static now() { now += tick; return now; } }
  const ctx = vm.createContext({
    Date: Clock,
    console: { error() {} },
    SpreadsheetApp: { getActiveSpreadsheet: () => ss },
    PropertiesService: { getUserProperties: () => properties(user), getScriptProperties: () => properties(script) },
    LockService: { getUserLock: () => lock },
    MailApp: { getRemainingDailyQuota: () => quota },
    Utilities: {
      getUuid: () => 'id-' + (++uuid), sleep() {},
      base64Decode: value => value, newBlob: (...args) => args,
      formatDate: () => '16/11/2026'
    },
    Session: { getScriptTimeZone: () => 'UTC' },
    DriveApp: {
      createFile(blob) {
        assert.ok(Array.isArray(blob), 'Usa blob em vez da sobrecarga textual limitada a 10 MB');
        const [content, type, name] = blob;
        const id = 'file-' + files.size;
        const file = { content, name, type, trashed: false, getId: () => id,
          getBlob: () => ({ getDataAsString: () => content }),
          setTrashed(value) { this.trashed = value; } };
        files.set(id, file);
        return file;
      },
      getFileById: id => { if (!files.has(id)) throw new Error('Snapshot removido'); return files.get(id); }
    },
    GmailApp: { sendEmail(...args) {
      if (failSend) throw new Error('Falha de rede ou cota');
      sent.push(args);
      quota -= 1 + (args[3].cc ? args[3].cc.split(',').length : 0);
    } }
  });
  vm.runInContext(main, ctx);
  ctx.getSheetDataComFiltro = () => [['Email', 'Nome'], ...Array.from({ length: count }, (_, i) => [`a${i}@example.com`, `Pessoa ${i}`])];
  ctx.registrarLogBatch = (...args) => { if (failReport) throw new Error('Relatório indisponível'); reports.push(args); };
  ctx.registrarEnvioIndividual = (...args) => { if (failTracking) throw new Error('Rastreamento indisponível'); tracking.push(args); };
  const start = (cc = '', attachments = [], images = []) => ctx.executarEnvioEmMassa('<p>{{Nome}}</p>', 'Olá {{Nome}}', cc, attachments, images);
  return { ctx, user, script, files, sent, reports, tracking, start,
    setQuota: value => { quota = value; },
    setLock: value => { lockedOut = value; },
    setFailSend: value => { failSend = value; },
    setFailReport: value => { failReport = value; },
    setFailTracking: value => { failTracking = value; },
    setFailCheckpoint: value => { failCheckpoint = value; },
    setTick: value => { tick = value; }
  };
}

test('cota considera CC em cada mensagem e cancela antes de criar snapshot', () => {
  const env = setup(2, 5);
  const r = env.start('cc1@example.com;cc2@example.com');
  assert.equal(r.success, false);
  assert.match(r.message, /Necessários.*6/);
  assert.equal(env.sent.length, 0);
  assert.equal(env.files.size, 0);
});

test('destinatários múltiplos, CC deduplicado e inválidos usam a mesma regra na cota e envio', () => {
  const env = setup(1, 3);
  env.ctx.getSheetDataComFiltro = () => [['Email'], ['a@example.com; b@example.com; inválido']];
  assert.equal(env.start('b@example.com;c@example.com').success, true);
  assert.equal(env.sent.length, 1);
  assert.equal(env.sent[0][0], 'a@example.com');
  assert.equal(env.sent[0][3].cc, 'b@example.com,c@example.com');
});

test('lotes retomam do cursor, sem reler a planilha e sem duplicar destinatários', () => {
  const env = setup(45);
  let r = env.start();
  assert.equal(r.pending, true);
  assert.equal(r.processados, 20);
  env.ctx.getSheetDataComFiltro = () => { throw new Error('Não deve reler a planilha'); };
  r = env.ctx.continuarEnvioEmMassa(r.jobId);
  assert.equal(r.processados, 40);
  r = env.ctx.continuarEnvioEmMassa(r.jobId);
  assert.equal(r.pending, undefined);
  assert.equal(env.sent.length, 45);
  assert.equal(new Set(env.sent.map(args => args[0])).size, 45);
  assert.equal(env.reports.length, 1);
  assert.equal(env.user.size, 0);
  assert.equal([...env.files.values()][0].trashed, true);
});

test('HTML, assunto, anexos e imagens CID permanecem personalizados em cada lote', () => {
  const env = setup(21);
  const r = env.start('', [{ data: 'QQ==', name: 'a.pdf', type: 'application/pdf' }], [{ data: 'QQ==', cid: 'img1', type: 'image/png' }]);
  env.ctx.continuarEnvioEmMassa(r.jobId);
  assert.equal(env.sent[20][1], 'Olá Pessoa 20');
  assert.match(env.sent[20][3].htmlBody, /<p>Pessoa 20<\/p>/);
  assert.equal(env.sent[20][3].attachments[0][2], 'a.pdf');
  assert.equal(env.sent[20][3].inlineImages.img1[2], 'img1');
});

test('datas mantêm o formato dd/MM/yyyy no snapshot JSON', () => {
  const env = setup(1);
  env.ctx.getSheetDataComFiltro = vm.runInContext("() => [['Email', 'Nome'], ['a@example.com', new Date('2026-11-16')]]", env.ctx);
  env.start();
  assert.equal(env.sent[0][1], 'Olá 16/11/2026');
});

test('bloqueio impede processamento concorrente', () => {
  const env = setup();
  env.setLock(true);
  assert.equal(env.start().success, false);
  assert.equal(env.files.size, 0);
  assert.equal(env.sent.length, 0);
});

test('um novo disparo não substitui envio pendente', () => {
  const env = setup(21);
  const r = env.start();
  const second = env.start();
  assert.equal(second.paused, true);
  assert.equal(second.jobId, r.jobId);
  assert.equal(env.files.size, 1);
  assert.equal(env.sent.length, 20);
});

test('cota é revalidada na retomada sem avançar o cursor', () => {
  const env = setup(21);
  const r = env.start();
  env.setQuota(0);
  const pause = env.ctx.continuarEnvioEmMassa(r.jobId);
  assert.equal(pause.paused, true);
  assert.equal(pause.processados, 20);
  assert.equal(env.sent.length, 20);
  env.setQuota(1);
  env.ctx.continuarEnvioEmMassa(r.jobId);
  assert.equal(env.sent.length, 21);
});

test('interrupção dentro da chamada Gmail fica incerta e nunca é reenviada automaticamente', () => {
  const env = setup(3);
  env.setFailSend(true);
  const r = env.start();
  assert.equal(r.paused, true);
  assert.equal(env.ctx.getEnvioPendente().paused, true);
  assert.match(env.ctx.getEnvioPendente().message, /resultado incerto/);
  env.setFailSend(false);
  const end = env.ctx.continuarEnvioEmMassa(r.jobId);
  assert.equal(end.success, true);
  assert.deepEqual(env.sent.map(args => args[0]), ['a1@example.com', 'a2@example.com']);
  assert.equal(env.reports[0][3], 1);
});

test('falha de checkpoint após aceitação do Gmail não permite reenvio', () => {
  const env = setup(3);
  env.setFailCheckpoint(true);
  assert.equal(env.start().success, false);
  assert.equal(env.sent.length, 1);
  const pending = env.ctx.getEnvioPendente();
  env.setFailCheckpoint(false);
  env.ctx.continuarEnvioEmMassa(pending.jobId);
  assert.deepEqual(env.sent.map(args => args[0]), ['a0@example.com', 'a1@example.com', 'a2@example.com']);
  assert.equal(env.reports[0][2], 2); // Primeira mensagem permanece incerta no checkpoint.
  assert.equal(env.reports[0][3], 1);
});

test('falha no rastreamento não altera sucesso nem causa reenvio', () => {
  const env = setup(2);
  env.setFailTracking(true);
  const r = env.start();
  assert.equal(r.success, true);
  assert.equal(env.sent.length, 2);
  assert.equal(env.reports[0][2], 2);
  assert.equal(env.reports[0][3], 0);
  assert.match(r.message, /falhou o registro/);
});

test('falha no relatório final permite retomar sem mandar os emails novamente', () => {
  const env = setup(2);
  env.setFailReport(true);
  assert.equal(env.start().success, false);
  const pending = env.ctx.getEnvioPendente();
  env.setFailReport(false);
  assert.equal(env.ctx.continuarEnvioEmMassa(pending.jobId).success, true);
  assert.equal(env.sent.length, 2);
  assert.equal(env.reports.length, 1);
});

test('prazo de lote também interrompe antes de atingir o limite de mensagens', () => {
  const env = setup(10);
  env.setTick(31000);
  const r = env.start();
  assert.equal(r.pending, true);
  assert.equal(r.processados, 1);
});

test('cancelamento mantém enviados e limpa snapshot/checkpoint', () => {
  const env = setup(21);
  const r = env.start();
  assert.equal(env.ctx.cancelarEnvioEmMassa(r.jobId).success, true);
  assert.equal(env.sent.length, 20);
  assert.equal(env.user.size, 0);
  assert.equal([...env.files.values()][0].trashed, true);
  assert.equal(env.ctx.continuarEnvioEmMassa(r.jobId).success, false);
});

test('id incorreto não continua nem cancela trabalho de outro contexto', () => {
  const env = setup(21);
  const r = env.start();
  assert.equal(env.ctx.continuarEnvioEmMassa('outro').success, false);
  assert.equal(env.ctx.cancelarEnvioEmMassa('outro').success, false);
  assert.equal(env.ctx.getEnvioPendente().jobId, r.jobId);
});

test('ausência de cabeçalho Email é detectada antes de criar trabalho', () => {
  const env = setup(1);
  env.ctx.getSheetDataComFiltro = () => [['Nome'], ['Ana']];
  assert.equal(env.start().success, false);
  assert.equal(env.files.size, 0);
});

test('linhas sem email válido entram no relatório como falha e não consomem cota', () => {
  const env = setup(1, 0);
  env.ctx.getSheetDataComFiltro = () => [['Email'], ['inválido']];
  assert.equal(env.start().success, true);
  assert.equal(env.sent.length, 0);
  assert.equal(env.reports[0][3], 1);
});

test('URL com query preserva parâmetros e não esconde o pixel com display:none', () => {
  const env = setup(1);
  env.script.set('URL_WEB_APP', 'https://example.com/exec?origem=teste');
  env.start();
  assert.match(env.sent[0][3].htmlBody, /\?origem=teste&amp;id=/);
  assert.equal(env.sent[0][3].htmlBody.includes('display:none'), false);
  assert.equal(env.script.get('RASTREAMENTO_PLANILHA_ID'), 'sheet-1');
});

test('doGet mantém resposta HTML legada sem presumir suporte binário inexistente', () => {
  const env = setup(0);
  let opens = 0;
  env.ctx.registrarAbertura = () => opens++;
  env.ctx.HtmlService = { createHtmlOutput: html => html };
  assert.match(env.ctx.doGet(), /data:image\/gif;base64,/);
  env.ctx.doGet({ parameter: { id: 'teste' } });
  assert.equal(opens, 1);
});

test('snapshot removido não impede cancelamento e liberação do checkpoint', () => {
  const env = setup(21);
  const r = env.start();
  env.files.clear();
  assert.equal(env.ctx.cancelarEnvioEmMassa(r.jobId).success, true);
  assert.equal(env.user.size, 0);
  assert.equal(env.sent.length, 20);
});

test('avisos Unicode ficam limitados e checkpoint cabe em UserProperties', () => {
  const env = setup(1);
  const job = { avisos: [] };
  for (let i = 0; i < 100; i++) env.ctx.avisoEnvio_(job, '😀'.repeat(300));
  assert.equal(job.avisos.length, 10);
  assert.ok(Buffer.byteLength(JSON.stringify(job), 'utf8') < 7000);
});

test('registro de abertura usa planilha explícita, preserva primeira leitura e libera lock', () => {
  const writes = [];
  let released = false;
  const sheet = {
    getLastRow: () => 2,
    getRange(row, col) {
      if (col === 8) return { createTextFinder: () => ({ matchEntireCell: () => ({ findNext: () => ({ getRow: () => 2 }) }) }) };
      return { getValue: () => 'Primeira leitura',
        setValue(value) { writes.push([col, value]); return this; },
        setBackground() { return this; }
      };
    }
  };
  const ctx = vm.createContext({
    LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() { released = true; } }) },
    PropertiesService: { getScriptProperties: () => ({ getProperty: () => 'sheet-1' }) },
    SpreadsheetApp: { openById(id) { assert.equal(id, 'sheet-1'); return { getSheetByName: () => sheet }; } },
    Utilities: { formatDate: () => 'Agora' },
    Session: { getScriptTimeZone: () => 'UTC' }
  });
  vm.runInContext(main, ctx);
  ctx.registrarAbertura('tracking-id');
  assert.equal(released, true);
  assert.deepEqual(writes, [[7, 'Agora'], [5, 'LIDO / ABERTO']]);
});
