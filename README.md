# 📧 Auto Email - Sistema de Automação e Rastreamento

Sistema profissional de envio de e-mails em massa (Mail Merge) integrado ao Google Sheets e Gmail, agora com **Rastreamento de Abertura em Tempo Real**.

Desenvolvido para facilitar cobranças, comunicados e marketing, permitindo personalização avançada e controle total sobre quem leu suas mensagens.

---

## 🚀 Funcionalidades Principais

* **Envio Personalizado:** Substituição automática de variáveis (ex: `{{ Nome }}`, `{{ Valor }}`) no corpo e no assunto.
* **Editor HTML Visual:** Crie e formate e-mails com facilidade, sem precisar saber código.
* **Gestão de Templates:** Salve seus modelos de e-mail favoritos para reutilizar depois.
* **Anexos Múltiplos:** Envie arquivos PDF, imagens ou documentos junto com o e-mail.
* **Cópia (CC) Automática:** Defina e-mails em cópia global ou por linha.
* **🆕 Rastreamento de Leitura (Pixel):** Saiba exatamente **quem abriu** o e-mail e **quando**.
* **🆕 Relatórios Detalhados:**
    * `📊 Relatório de Envios`: Resumo geral de sucesso/falha.
    * `📊 Rastreamento Detalhado`: Lista individual com status de leitura em tempo real.

---

## 🛠️ Instalação e Configuração

### 1. Preparar a Planilha
1. Abra sua planilha no Google Sheets.
2. Vá em **Extensões** > **Apps Script**.
3. Copie o código do arquivo `main.js` (ou `Code.gs`) deste projeto e cole no editor.
4. Crie um arquivo HTML no editor chamado `Painel.html` e cole o código do painel (frontend).

### 2. Ativar o Rastreamento (⚠️ Passo Obrigatório)
Para que a confirmação de leitura funcione, você precisa publicar o script como um App da Web:

1. No editor de script, clique no botão azul **Implantar** (canto superior direito) > **Nova implantação**.
2. Clique no ícone de engrenagem e selecione **App da Web**.
3. Preencha as configurações:
    * **Descrição:** `Auto Email Rastreamento`
    * **Executar como:** `Eu` (seu e-mail).
    * **Quem pode acessar:** `Qualquer pessoa` (Essencial para o pixel funcionar).
4. Clique em **Implantar** e autorize o acesso.
5. Pronto! Não é preciso copiar a URL, o sistema detecta automaticamente.

---

## 📋 Como Usar

1.  **Organize seus Dados:**
    * Na primeira linha da planilha, coloque os cabeçalhos (ex: `Nome`, `Email`, `Vencimento`).
    * **Importante:** Deve haver uma coluna com o nome `Email`, `E-mail` ou `E mail`.

2.  **Abra o Painel:**
    * Atualize a planilha (F5).
    * No menu superior, clique em **Auto Email** > **📧 Abrir Painel de Envio**.

3.  **Escreva e Envie:**
    * Escreva seu e-mail usando o editor.
    * Use variáveis clicando nos botões acima do editor (ex: `{{ Nome }}`).
    * Faça um **Teste de Envio** para seu próprio e-mail.
    * Clique em **Enviar E-mails** para disparar para toda a lista filtrada/visível.

4.  **Acompanhe os Resultados:**
    * Após o envio, uma nova aba `📊 Rastreamento Detalhado` será criada.
    * Acompanhe por lá quem já abriu (o status mudará para **LIDO / ABERTO** em azul).

---

## ❓ Perguntas Frequentes

**O rastreamento é 100% preciso?**
O rastreamento usa uma tecnologia padrão de mercado (pixel invisível). Ele funciona na maioria dos casos, mas pode não marcar como "Lido" se:
* O destinatário bloquear o carregamento de imagens no e-mail.
* O destinatário usar apenas o modo "texto simples".

**Posso filtrar para quem enviar?**
Sim! O sistema respeita os filtros da planilha. Se você filtrar a planilha para mostrar apenas 5 pessoas, o e-mail será enviado apenas para essas 5.

**Existe limite de envio?**
Sim, o Google impõe limites diários (geralmente 500 e-mails/dia para contas @gmail.com gratuitas e 2.000/dia para contas Google Workspace pagas).

---

## 👨‍💻 Desenvolvedor
Projeto mantido e atualizado por **Ademir Varjão**.
