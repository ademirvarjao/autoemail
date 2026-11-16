const assert = require('node:assert/strict');
const { readFileSync, existsSync } = require('node:fs');
const { join } = require('node:path');
const { test } = require('node:test');
const vm = require('node:vm');

const root = join(__dirname, '..');
const main = readFileSync(join(root, 'main'), 'utf8');
const painel = readFileSync(join(root, 'painel'), 'utf8');
const readme = readFileSync(join(root, 'README.md'), 'utf8');
const license = readFileSync(join(root, 'LICENSE'), 'utf8');
const version = main.match(/@version (\d+\.\d+\.\d+)/)?.[1];

test('versão semântica alinhada entre servidor, painel, README e implantação documentada', () => {
  assert.ok(version, 'Servidor deve declarar uma versão major.minor.patch');
  assert.ok(painel.includes(`// Auto Email v${version}`));
  assert.ok(readme.startsWith(`# 📧 Auto Email — v${version}\n`));
  assert.ok(readme.includes(`**Versão:** ${version}`));
  assert.ok(readme.includes(`Auto Email v${version}`));
  assert.ok(readme.includes(`### ${version} —`));
});

test('Sobre mostra versão, data atualizada e aviso de direitos reservados', () => {
  const alerts = [];
  const context = vm.createContext({ window: {}, alert: text => alerts.push(text) });
  vm.runInContext(painel.match(/<script>([\s\S]*?)<\/script>/)[1], context);
  context.mostrarSobre();
  const date = main.match(/@updated (\d{4})-(\d{2})-(\d{2})/);
  assert.ok(date);
  assert.equal(alerts.length, 1);
  assert.ok(alerts[0].startsWith(`Auto Email v${version}\n`));
  assert.ok(alerts[0].includes(`${date[3]}/${date[2]}/${date[1]}`));
  assert.match(alerts[0], /Ademir Varjão/);
  assert.match(alerts[0], /Todos os direitos reservados/);
  assert.match(alerts[0], /autorização prévia e expressa, por escrito/);
});

test('licença e avisos reservam direitos ao titular e exigem autorização expressa', () => {
  for (const content of [main, painel, readme, license]) {
    assert.match(content, /2026 Ademir Varjão/);
    assert.match(content, /Todos os direitos reservados/);
    assert.match(content, /autorização prévia e expressa,[\s\S]*?por escrito/);
  }
  assert.match(license, /não é disponibilizado sob uma licença de código\naberto/);
  assert.match(license, /permissões obrigatórias previstas na legislação aplicável/);
  assert.match(license, /direitos de seus respectivos titulares/);
});

test('links locais do README apontam para arquivos existentes', () => {
  for (const match of readme.matchAll(/\]\(([^)#]+)\)/g)) {
    const target = match[1];
    if (/^https?:\/\//.test(target)) continue;
    assert.ok(existsSync(join(root, target)), `Link inexistente: ${target}`);
  }
});
