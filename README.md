# 📧 Auto Email - Sistema de Automação e Rastreamento (v3.2)

O **Auto Email** é uma solução completa de Mail Merge (envio em massa) integrada ao Google Sheets. Ele permite enviar e-mails personalizados, com anexos e formatação HTML, diretamente da sua planilha, incluindo registros de envio e um mecanismo de rastreamento de abertura com as limitações descritas abaixo.

**Desenvolvedor:** Ademir Varjão  
**Versão Atual:** 3.2

---

## 🚀 Novidades das Versões 3.x

* **📥 Importação e Exportação (JSON) [v3.2]:** Faça backups leves ou migre seus templates entre contas/planilhas exportando os dados em formato `.json`.
* **☑️ Exportação Seletiva [v3.2]:** Utilize as caixas de seleção (checkboxes) na barra lateral para exportar apenas os templates que desejar.
* **✏️ Renomear Templates [v3.2]:** Novo botão de lápis na aba lateral que permite alterar o nome de templates salvos de forma rápida e direta.
* **🖼️ Pixel Interno [v3.0]:** O handler legado inclui uma imagem embutida em HTML. Isso não equivale a servir um GIF binário; veja as limitações abaixo.
* **⚙️ Configuração Flexível [v3.0]:** A URL do Web App pode ser lida de `Script Properties` (com fallback no `CONFIG`).
* **🧼 Nomes de Templates Seguros [v3.0]:** Sanitização e timestamp ao salvar templates no Drive.

---

## 🚀 Funcionalidades Principais

### 📨 Envio e Personalização
* **Substituição de Variáveis:** Personalize cada e-mail com dados da planilha (ex: `Olá {{ Nome }}, o valor é {{ Valor }}`).
* **Editor HTML Rico:** Formate textos, insira links, cores e alinhe parágrafos facilmente.
* **Imagens Inline:** Suporte completo para imagens no corpo do e-mail (com redimensionamento automático e conversão para CID para evitar bloqueios).
* **Múltiplos Destinatários:** Suporta múltiplos e-mails na mesma célula (separados por vírgula ou ponto e vírgula) e Cópia (CC) global.

### 📎 Anexos e Arquivos
* **Upload de Anexos:** Envie PDFs, documentos ou imagens como anexo para toda a lista (com travas de limite de tamanho).
* **Importação de Assinatura:** Puxa automaticamente a assinatura configurada no seu Gmail principal.

### 📊 Gestão e Rastreamento
* **Rastreamento de Leitura (Pixel):** Registra requisições recebidas pelo endpoint; não é uma comprovação de leitura nem identifica qual destinatário em CC abriu a mensagem.
* **Relatórios Automáticos:**
  * Gera a aba `📊 Relatório de Envios` com resumo de sucessos e falhas.
  * Gera a aba `📊 Rastreamento Detalhado` que atualiza o status para "LIDO / ABERTO" em tempo real.
* **Respeito a Filtros:** O sistema envia apenas para as linhas visíveis na planilha.
* **Gestão de Templates Avançada:** Crie, salve, carregue, exclua, renomeie, importe e exporte (em JSON) modelos de e-mail para uso recorrente.

---

## 🛠️ Instalação Passo a Passo

Para configurar o sistema e o armazenamento no Drive, siga estes passos. A implantação do Web App não elimina as limitações de rastreamento descritas abaixo:

### 1. Configuração do Script
1. Abra sua planilha no Google Sheets.
2. No menu superior, vá em **Extensões > Apps Script**.
3. **Arquivo de Código:**
   * Apague qualquer código que esteja no arquivo `Código.gs` (ou `Code.gs`).
   * Copie o conteúdo do arquivo `main` (versão 3.2) deste projeto e cole lá.
   * ⚠️ **Importante:** Na aba de variáveis iniciais, altere `NOME_REMETENTE: 'JR Contabilidade'` para o seu nome.
   * (Opcional) Defina `ABA_DADOS` caso queira fixar a aba de dados padrão.
4. **Arquivo de Painel:**
   * Clique no `+` (sinal de mais) ao lado de "Arquivos" > **HTML**.
   * Nomeie o arquivo exatamente como `painel` (letras minúsculas).
   * Copie o conteúdo do arquivo `painel` atualizado deste projeto e cole dentro deste novo arquivo.

### 2. Ativação do Rastreamento (Deployment)
Para disponibilizar o endpoint legado de rastreamento, publique o script na web:

1. Dentro do editor de Apps Script, clique no botão azul **Implantar** (canto superior direito) > **Nova implantação**.
2. Clique no ícone de engrenagem (Configurações) e escolha **App da Web**.
3. Preencha exatamente assim:
   * **Descrição:** Auto Email v3.2
   * **Executar como:** Eu (seu e-mail).
   * **Quem pode acessar:** Qualquer pessoa (para que a requisição não exija login).
4. Clique em **Implantar**.
5. O Google pedirá permissão. Clique em **Autorizar acesso**, escolha sua conta e, se aparecer "App não verificado", clique em **Avançado > Acessar (nome do projeto)**.
   * *Nota:* Copie a URL do Web App **desta planilha** e insira na variável `URL_WEB_APP` do objeto `CONFIG` (ou na propriedade de script de mesmo nome). Não reutilize o endereço de outra instalação.

---

## 📋 Como Utilizar

### 1. Preparação da Planilha
* Sua planilha deve ter uma linha de cabeçalho na linha 1.
* **Coluna Obrigatória:** Você deve ter uma coluna chamada `Email`, `E-mail` ou `E mail`.
* Dados: Preencha as linhas abaixo com os dados dos contatos.

### 2. Abrindo o Sistema
1. Atualize a página da planilha (F5).
2. Aguarde alguns segundos até aparecer o menu **Auto Email** na barra superior.
3. Clique em **Auto Email > 📧 Abrir Painel de Envio**.

### 3. Criando, Editando e Exportando Templates
* Insira o "Nome do Template", escreva seu e-mail, adicione imagens e formate como preferir.
* Clique em **"+ Novo"** para salvar o modelo. Se for um arquivo HTML longo (com muitas imagens inseridas), ele irá automaticamente para a sua conta do Google Drive para poupar espaço da planilha.
* **Renomear e Excluir:** Na aba de templates, passe o mouse sobre o template salvo e clique no ícone de lápis (editar nome) ou na lixeira (excluir).
* **Exportar e Importar:** Para fazer backup ou trocar de planilha, marque as caixinhas dos templates desejados e clique em **📤 Exportar**. Um arquivo `.json` será baixado. Para carregar modelos, basta clicar em **📥 Importar** e selecionar este mesmo arquivo.

### 4. Teste e Envio
* Clique em **🧪 Enviar Teste** para mandar uma cópia para o seu próprio e-mail preenchido com os dados da primeira linha.
* Se estiver tudo certo, clique em **Disparar Emails** para realizar o envio em massa para as linhas visíveis.

---

## 🛡️ Revisão das melhorias e operação segura

### Envio em lotes com retomada
* O botão **Disparar Emails** continua o mesmo. O painel encadeia lotes de até 20 registros e cerca de 60 segundos; não há gatilho executando em segundo plano.
* Ao fechar o painel, o lote já iniciado pode terminar, mas novos lotes só começam quando o painel estiver aberto. Reabra-o na mesma conta para **retomar**, **manter salvo** ou **cancelar** o envio pelos diálogos existentes.
* A primeira chamada cria um snapshot com as linhas visíveis naquele momento, assunto, corpo, CC, anexos e imagens inline. Alterações posteriores na planilha, filtros ou editor **não** afetam esse envio pendente.
* O snapshot `AutoEmail_Envio_<id>.json` fica no Drive de quem iniciou o envio, sem compartilhamento criado pelo código. O checkpoint fica em propriedades privadas do usuário, separado por planilha. Não mova, compartilhe ou exclua esse arquivo enquanto o envio estiver pendente: ele contém dados de destinatários e anexos.
* Conclusão/cancelamento manda o snapshot para a **lixeira** (não é exclusão definitiva). Um envio abandonado permanece salvo até ser retomado ou cancelado; a retenção deve seguir a política de dados de sua organização. Em uma falha de limpeza, remova o arquivo residual manualmente depois de conferir a conclusão.
* Há bloqueio por usuário para evitar lotes simultâneos do mesmo trabalho. Ele não impede que **duas pessoas diferentes** iniciem campanhas distintas para a mesma lista.
* Antes do envio ao Gmail é salvo um marcador de tentativa. Se houver interrupção entre a chamada ao Gmail e a confirmação do checkpoint, o resultado fica **incerto**: na retomada, essa mensagem será **ignorada**, nunca reenviada automaticamente. Confira a pasta **Enviados** antes de decidir por um envio manual. Não há promessa de entrega exatamente uma vez entre dois serviços independentes.
* Uma falha no registro de rastreamento não transforma uma mensagem já enviada em falha de envio. Avisos são incluídos no resultado e no relatório (até dez detalhes, truncados para caber nas propriedades). A coluna de falhas também inclui resultados incertos, explicitados no detalhe.
* Falhas de cota pausam o trabalho. Retome apenas quando houver cota. Mensagens já enviadas não são desfeitas por cancelamento. A confirmação inicial continua mostrando a quantidade de linhas; a trava do servidor conta todos os destinatários, incluindo CC.

### Pré-visualização isolada, sem mudar o desenho
* O iframe usa `sandbox="allow-same-origin"`, **sem** `allow-scripts`. Isso mantém a medição automática da altura, mas bloqueia scripts/eventos, formulários, pop-ups e navegação da página principal.
* Uma política de conteúdo (CSP) impede conteúdo ativo aninhado. Imagens e estilos continuam permitidos para preservar a apresentação do e-mail; imagens remotas ainda podem gerar requisições de rede.
* Esse isolamento é do **preview**, não um sanitizador universal do editor. Importe templates e assinaturas somente de fontes confiáveis. HTML ativo (scripts/formulários) não faz parte das funcionalidades de composição de e-mail suportadas.

### Rastreamento: limite real da plataforma
* O Web App do Apps Script retorna `HtmlOutput` ou `TextOutput`; embutir Base64 em um HTML **não** muda seu tipo para `image/gif`. Não foi introduzido um MIME inexistente nem um redirecionamento que a plataforma não suporta.
* O endpoint legado foi mantido por compatibilidade. O registro agora identifica explicitamente a planilha do envio e serializa atualizações concorrentes de abertura. O pixel no e-mail mantém 1 × 1 px sem `display:none`, mas isso **não resolve** a resposta HTML.
* Uma correção completa do transporte exige um endpoint capaz de responder bytes de imagem e encaminhar o evento de forma autenticada para o registro. Isso adiciona infraestrutura, credenciais e decisões de privacidade; **não foi criado nem contratado serviço externo** nesta revisão.
* Mesmo com um endpoint de imagem, bloqueio de imagens, cache, proxies, scanners e recursos de privacidade podem ocultar aberturas ou gerar registros automáticos. O ID atual é por mensagem (incluindo CC), não por pessoa.

### Atualizar e validar a instalação
1. Atualize **os dois arquivos**, `main` e `painel`, juntos no Apps Script. Não inicie campanhas com versões diferentes do painel e do servidor.
2. Atualize a versão da implantação do Web App e confirme a URL configurada. O merge no repositório não atualiza automaticamente o Apps Script.
3. Reautorize os serviços se o Google solicitar. Faça primeiro um teste com poucos contatos controlados, com CC, anexo, imagem, filtro e fechamento/reabertura do painel.

### Testes locais
```sh
node --test tests/*.test.cjs
```
Os testes simulam os serviços Google: cota, envio, Drive, checkpoints, falhas, retomada e cancelamento. Incluem também verificação do CSS e da marcação original (exceto os atributos invisíveis de segurança do iframe).

Teste opcional em Chromium (requer bibliotecas de sistema compatíveis com Chromium):
```sh
npm install --no-save --package-lock=false playwright-core@1.65.1 @sparticuz/chromium@153.0.0
node tests/browser-preview.cjs
```
Ele verifica isolamento de scripts e formulários, imagens, estilos, altura automática e recuperação do preview após erro. Essas dependências são só de teste e não precisam ser copiadas para o Apps Script.

---

## ❓ Solução de Problemas (Troubleshooting)

**1. Erro "A entrada contém mais que o limite máximo de 50000 caracteres"**
* **Solução:** A partir da versão 3.0, templates grandes são salvos no Drive automaticamente para evitar esse erro. Confirme se as permissões do Drive foram aceitas durante a execução.

**2. O Rastreamento não está marcando como "Lido"**
* O handler legado retorna HTML, não um GIF binário. Alguns clientes/proxies podem não requisitar ou não aceitar esse recurso. Ausência de registro não significa ausência de leitura.
* Verifique se implantou como **App da Web**, definiu o acesso como **"Qualquer pessoa"** e adicionou a URL gerada na variável `URL_WEB_APP` no código.

**3. As variáveis `{{ Nome }}` não são substituídas**
* Verifique se o nome do cabeçalho na planilha é exatamente igual ao que está entre chaves (o sistema tenta ignorar espaços e maiúsculas/minúsculas para facilitar, mas evite caracteres especiais nas colunas).

**4. Limites de Envio (Gmail)**
* A cota do Apps Script pode ser diferente da cota de envio da interface do Gmail e varia conforme o tipo e a situação da conta. O sistema consulta `MailApp.getRemainingDailyQuota()` no início e antes de cada mensagem.
* O cálculo inclui os destinatários adicionais da célula e o CC global em **cada** mensagem. Outros limites (por mensagem, frequência e tamanho) ainda podem causar uma pausa.

---

## 📝 Licença
Este projeto é de uso restrito, disponibilizado somente mediante a autorização do desenvolvedor.  
**Desenvolvido por Ademir Varjão.**
