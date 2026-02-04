# 📧 Auto Email - Sistema de Automação e Rastreamento (v3.0)

O **Auto Email** é uma solução completa de Mail Merge (envio em massa) integrada ao Google Sheets. Ele permite enviar e-mails personalizados, com anexos e formatação HTML, diretamente da sua planilha, oferecendo um sistema profissional de Rastreamento de Abertura (Pixel) em tempo real.

**Desenvolvedor:** Ademir Varjão  
**Versão Atual:** 3.0

---

## 🚀 Novidades da Versão 3.0

* **🖼️ Pixel Interno:** O rastreamento agora usa um pixel embutido (sem dependência externa).
* **⚙️ Configuração Flexível:** A URL do Web App pode ser lida de `Script Properties` (com fallback no `CONFIG`).
* **📄 Aba de Dados Opcional:** Permite configurar uma aba fixa de dados com `ABA_DADOS`.
* **🧼 Nomes de Templates Seguros:** Sanitização e timestamp ao salvar templates no Drive.
* **📎 Limites de Anexos:** Controle básico de tamanho por arquivo e total de anexos no painel.
* **✅ Assinatura com Feedback:** Mensagens claras quando a API do Gmail não estiver habilitada.

---

## 🚀 Funcionalidades Principais

### 📨 Envio e Personalização
* **Substituição de Variáveis:** Personalize cada e-mail com dados da planilha (ex: `Olá {{ Nome }}, o valor é {{ Valor }}`).
* **Editor HTML Rico:** Formate textos, insira links, cores e alinhe parágrafos facilmente.
* **Imagens Inline:** Suporte completo para imagens no corpo do e-mail (com redimensionamento automático e conversão para CID para evitar bloqueios).
* **Múltiplos Destinatários:** Suporta múltiplos e-mails na mesma célula (separados por vírgula ou ponto e vírgula) e Cópia (CC) global.

### 📎 Anexos e Arquivos
* **Upload de Anexos:** Envie PDFs, documentos ou imagens como anexo para toda a lista.
* **Importação de Assinatura:** Puxa automaticamente a assinatura configurada no seu Gmail principal.

### 📊 Gestão e Rastreamento
* **Rastreamento de Leitura (Pixel):** Saiba exatamente quem abriu o e-mail e quando.
* **Relatórios Automáticos:**
    * Gera a aba `📊 Relatório de Envios` com resumo de sucessos e falhas.
    * Gera a aba `📊 Rastreamento Detalhado` que atualiza o status para "LIDO / ABERTO" em tempo real.
* **Respeito a Filtros:** O sistema envia apenas para as linhas visíveis na planilha.
* **Templates Salvos:** Crie, salve, carregue e edite modelos de e-mail para uso recorrente.

---

## 🛠️ Instalação Passo a Passo

Para que o sistema funcione 100% (especialmente o rastreamento e o armazenamento no Drive), siga estes passos:

### 1. Configuração do Script
1.  Abra sua planilha no Google Sheets.
2.  No menu superior, vá em **Extensões > Apps Script**.
3.  **Arquivo de Código:**
    * Apague qualquer código que esteja no arquivo `Código.gs` (ou `Code.gs`).
    * Copie o conteúdo do arquivo `main` (versão 3.0) deste projeto e cole lá.
    * ⚠️ **Importante:** Na linha 16 do código, altere `NOME_REMETENTE: 'JR Contabilidade'` para o seu nome.
    * (Opcional) Defina `ABA_DADOS` caso queira fixar a aba de dados.
4.  **Arquivo de Painel:**
    * Clique no `+` (sinal de mais) ao lado de "Arquivos" > **HTML**.
    * Nomeie o arquivo exatamente como `Painel`.
    * Copie o conteúdo do arquivo `Painel.html` atualizado deste projeto e cole dentro deste novo arquivo.

### 2. Ativação do Rastreamento (Deployment)
Para que o pixel de rastreamento funcione, o script precisa ser publicado na web:

1.  Dentro do editor de Apps Script, clique no botão azul **Implantar** (canto superior direito) > **Nova implantação**.
2.  Clique no ícone de engrenagem (Configurações) e escolha **App da Web**.
3.  Preencha exatamente assim:
    * **Descrição:** Auto Email v3.0
    * **Executar como:** Eu (seu e-mail).
    * **Quem pode acessar:** Qualquer pessoa (Isso é obrigatório para o pixel carregar sem login).
4.  Clique em **Implantar**.
5.  O Google pedirá permissão. Clique em **Autorizar acesso**, escolha sua conta e, se aparecer "App não verificado", clique em **Avançado > Acessar (nome do projeto)**.
    * *Nota:* A versão 3.0 pode ler a URL também de `Script Properties` (chave `URL_WEB_APP`). Troque a URL do código pela URL da implantação para funcionar.

---

## 📋 Como Utilizar

### 1. Preparação da Planilha
* Sua planilha deve ter uma linha de cabeçalho na linha 1.
* **Coluna Obrigatória:** Você deve ter uma coluna chamada `Email`, `E-mail` ou `E mail`.
* Dados: Preencha as linhas abaixo com os dados dos clientes.

### 2. Abrindo o Sistema
1.  Atualize a página da planilha (F5).
2.  Aguarde alguns segundos até aparecer o menu **Auto Email** na barra superior.
3.  Clique em **Auto Email > 📧 Abrir Painel de Envio**.

### 3. Criando e Salvando Templates
* Escreva seu e-mail, insira imagens e formate como quiser.
* Clique em **"+ Novo"** para salvar um novo modelo.
* Se o template tiver muitas imagens, ele será salvo automaticamente na pasta `Templates AutoEmail (Sistema)` no seu Google Drive.
* Para editar, carregue um template, faça as mudanças e clique no ícone de **Disquete (Salvar)** que aparecerá ao lado do botão "+ Novo".

### 4. Teste e Envio
* Clique em **🧪 Enviar Teste** para mandar uma cópia para você mesmo.
* Se estiver tudo certo, clique em **Disparar Emails**.

---

## ❓ Solução de Problemas (Troubleshooting)

**1. Erro "A entrada contém mais que o limite máximo de 50000 caracteres"**
* **Solução:** Certifique-se de que está usando a **versão 3.0** do arquivo `main`. Esta versão salva templates grandes no Drive automaticamente para evitar esse erro.

**2. O Rastreamento não está marcando como "Lido"**
* Verifique se implantou como **App da Web** e definiu o acesso como **"Qualquer pessoa"**.

**3. As variáveis `{{ Nome }}` não são substituídas**
* Verifique se o nome do cabeçalho na planilha é exatamente igual ao que está entre chaves (diferencia maiúsculas de minúsculas).

**4. Limites de Envio (Gmail)**
* Contas Gmail gratuitas (@gmail.com): ~500 e-mails/dia.
* Contas Google Workspace (empresariais): ~2.000 e-mails/dia.

---

## 📝 Licença
Este projeto é de uso restrito, disponibilizado somente mediante a autorização do desenvolvedor.
**Desenvolvido por Ademir Varjão.**
