📧 Auto Email - Sistema de Automação de Emails
Versão: 2.1

Autor: Ademir Varjão

O Auto Email é uma solução robusta baseada em Google Apps Script para envio de emails em massa e personalizados diretamente do Google Sheets. Ele oferece um painel visual moderno para edição de emails, gestão de templates e controle de envios, funcionando como um "Mail Merge" avançado.

🚀 Funcionalidades Principais
Editor Rico (WYSIWYG): Interface visual para criar emails com formatação (negrito, itálico, listas), inserção de imagens e limpeza de formatação.

Personalização com Variáveis: Utilize dados da sua planilha (ex: {{Nome}}, {{Empresa}}) para personalizar o assunto e o corpo de cada email enviado.

Gestão de Templates: Salve, carregue e exclua modelos de email para reutilização futura. Os templates são armazenados em uma aba oculta dedicada.

Envio Inteligente:

Filtros: O sistema respeita os filtros da planilha, enviando emails apenas para as linhas visíveis.

CC Global: Defina um email em cópia (CC) para todos os disparos.

Anexos: Suporte para múltiplos anexos de arquivos locais.

Importação de Assinatura: Importe automaticamente sua assinatura configurada no Gmail.

Relatórios Automáticos: Gera logs detalhados de sucesso e falha em uma aba "📊 Relatório de Envios".

Modo de Visualização (Preview): Visualize exatamente como cada destinatário receberá o email antes de enviar.

🛠️ Instalação
Abra uma planilha do Google Sheets.

Vá em Extensões > Apps Script.

Crie dois arquivos no editor:

Code.gs (ou main.gs): Cole o conteúdo do código do servidor (backend).

Painel.html: Cole o conteúdo do código HTML/Frontend. Importante: O arquivo deve se chamar exatamente Painel para que o script o reconheça.

Salve o projeto e recarregue a planilha.

O menu "Auto Email" aparecerá na barra superior.

📋 Como Usar
1. Preparando a Planilha
A primeira linha da sua planilha deve conter os cabeçalhos (ex: Nome, Email, Cargo).

É obrigatório ter uma coluna com o nome "Email" ou "E-mail" para identificar os destinatários.

Aplique filtros na planilha se desejar enviar apenas para um grupo específico. O script ignorará linhas ocultas.

2. Painel de Envio
Acesse Auto Email > Abrir Painel de Envio.

Editor: Escreva seu email. Use os botões de formatação ou insira variáveis clicando nas "chips" na barra lateral.

Anexos: Clique em "Anexar Arquivo(s)" na barra lateral para fazer upload de arquivos do seu computador.

Templates:

Para salvar: Clique em + Novo, defina um nome e o template atual será salvo.

Para carregar: Clique no ícone de pasta (📂) ao lado do nome do template.

3. Disparo
🧪 Teste: Envia o email atual para um endereço de sua escolha para validação.

🚀 Enviar: Inicia o envio em massa para todas as linhas visíveis da planilha. Uma barra de progresso mostrará o andamento.

⚙️ Estrutura de Arquivos
Abas do Sistema: O script cria automaticamente duas abas de gerenciamento (não apague ou renomeie):

💾 Meus Templates: Armazena seus modelos salvos.

📊 Relatório de Envios: Histórico de todos os processos de envio.

💻 Tecnologias
Backend: Google Apps Script.

Frontend: HTML5, CSS3 (Variáveis CSS, Flexbox), JavaScript (Vanilla).

UI: Design responsivo inspirado no Material Design.

Gerado automaticamente com base na análise do código fonte.
