📧 Auto Email - Sistema de Automação e Rastreamento (v2.4)
O Auto Email é uma solução completa de Mail Merge (envio em massa) integrada ao Google Sheets. Ele permite enviar e-mails personalizados, com anexos e formatação HTML, diretamente da sua planilha, oferecendo um sistema profissional de Rastreamento de Abertura (Pixel) em tempo real.

Desenvolvedor: Ademir Varjão Versão Atual: 2.4

🚀 Funcionalidades Principais
📨 Envio e Personalização
Substituição de Variáveis: Personalize cada e-mail com dados da planilha (ex: Olá {{ Nome }}, o valor é {{ Valor }}).

Editor HTML Rico: Formate textos (negrito, cor, listas), insira links e imagens diretamente no corpo do e-mail.

Imagens Inline: Suporte completo para imagens no corpo do e-mail (com redimensionamento automático para evitar erros no Outlook/Gmail).

Múltiplos Destinatários: Suporta múltiplos e-mails na mesma célula (separados por vírgula ou ponto e vírgula) e Cópia (CC) global.

📎 Anexos e Arquivos
Upload de Anexos: Envie PDFs, documentos ou imagens como anexo para toda a lista.

Importação de Assinatura: Puxa automaticamente a assinatura configurada no seu Gmail principal.

📊 Gestão e Rastreamento
Rastreamento de Leitura (Pixel): Saiba exatamente quem abriu o e-mail e quantas vezes.

Relatórios Automáticos:

Gera a aba 📊 Relatório de Envios com resumo de sucessos e falhas.

Gera a aba 📊 Rastreamento Detalhado que atualiza o status para "LIDO / ABERTO" em tempo real.

Respeito a Filtros: O sistema envia apenas para as linhas visíveis na planilha. Se você filtrar a planilha, o envio obedece o filtro.

Templates Salvos: Crie, salve, carregue e edite modelos de e-mail para uso recorrente.

🛠️ Instalação Passo a Passo
Para que o sistema funcione 100% (especialmente o rastreamento), siga estes passos:

1. Configuração do Script
Abra sua planilha no Google Sheets.

No menu superior, vá em Extensões > Apps Script.

Arquivo de Código:

Apague qualquer código que esteja no arquivo Código.gs (ou Code.gs).

Copie o conteúdo do arquivo main deste projeto e cole lá.

⚠️ Importante: Na linha 16 do código, altere NOME_REMETENTE: 'JR Contabilidade' para o seu nome ou da sua empresa.

Arquivo de Painel:

Clique no + (sinal de mais) ao lado de "Arquivos" > HTML.

Nomeie o arquivo exatamente como Painel.

Copie o conteúdo do arquivo painel deste projeto e cole dentro deste novo arquivo.

2. Ativação do Rastreamento (Deployment)
Para que o pixel de rastreamento funcione, o script precisa ser publicado na web:

Dentro do editor de Apps Script, clique no botão azul Implantar (canto superior direito) > Nova implantação.

Clique no ícone de engrenagem (Configurações) e escolha App da Web.

Preencha exatamente assim:

Descrição: Auto Email v2.4

Executar como: Eu (seu e-mail).

Quem pode acessar: Qualquer pessoa (Isso é obrigatório para o pixel carregar sem login).

Clique em Implantar.

O Google pedirá permissão. Clique em Autorizar acesso, escolha sua conta e, se aparecer "App não verificado", clique em Avançado > Acessar (nome do projeto).

Pronto! Pode fechar a janela da URL (o script a detecta automaticamente).

📋 Como Utilizar
1. Preparação da Planilha
Sua planilha deve ter uma linha de cabeçalho na linha 1.

Coluna Obrigatória: Você deve ter uma coluna chamada Email, E-mail ou E mail.

Dados: Preencha as linhas abaixo com os dados dos clientes.

2. Abrindo o Sistema
Atualize a página da planilha (F5).

Aguarde alguns segundos até aparecer o menu Auto Email na barra superior.

Clique em Auto Email > 📧 Abrir Painel de Envio.

3. Criando o E-mail
Variáveis: Clique nos botões cinza (ex: {{ Nome }}) para inserir dados da planilha no texto.

Anexos: Use o botão "Adicionar Arquivo" para anexar PDFs ou imagens.

Imagens no Corpo: Você pode colar imagens (Ctrl+V) ou usar o botão de imagem. Clique na imagem para redimensionar.

4. Teste e Envio
Clique em 🧪 Enviar Teste para mandar uma cópia para você mesmo (o teste usa os dados da 1ª linha da planilha).

Se estiver tudo certo, clique em Disparar Emails.

O sistema pedirá confirmação e mostrará o progresso.

⚙️ Configurações Avançadas
No início do arquivo main.gs (ou Code.gs), você pode alterar as configurações globais na constante CONFIG:

JavaScript

const CONFIG = {
  // ...
  NOME_REMETENTE: 'Seu Nome Aqui', // Nome que aparece para quem recebe
  DELAY_ENVIO_MS: 1500,            // Pausa entre envios (evita bloqueio do Gmail)
  // ...
};
❓ Solução de Problemas (Troubleshooting)
1. O Rastreamento não está marcando como "Lido"

Verifique se você implantou como App da Web.

Verifique se a permissão de acesso foi definida como "Qualquer pessoa". Se estiver como "Apenas eu", o pixel não carrega para o destinatário.

Lembre-se: Se o destinatário não baixar as imagens do e-mail, o rastreamento não funciona.

2. As variáveis {{ Nome }} não são substituídas

Verifique se o nome do cabeçalho na planilha é exatamente igual ao que está entre chaves (diferencia maiúsculas de minúsculas e espaços).

Use os botões de "chips" no painel lateral para garantir a grafia correta.

3. Erro "Google hasn't verified this app"

Isso é normal em scripts pessoais. Clique em "Advanced" (Avançado) e depois em "Go to... (unsafe)" para prosseguir.

4. Limites de Envio

Contas Gmail gratuitas (@gmail.com): ~500 e-mails/dia.

Contas Google Workspace (empresariais): ~2.000 e-mails/dia.

📝 Licença
Este projeto (sua versão recente e anteriores) é de uso restrito, disponibilizado somente mediante a autorização do desenvolvedor. Desenvolvido por Ademir Varjão.
