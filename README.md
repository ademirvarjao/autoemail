📧 Auto Email - Sistema de Automação e Rastreamento (v3.2)
O Auto Email é uma solução completa de Mail Merge (envio em massa) integrada ao Google Sheets. Ele permite enviar e-mails personalizados, com anexos e formatação HTML, diretamente da sua planilha, oferecendo um sistema profissional de Rastreamento de Abertura (Pixel) em tempo real.

Desenvolvedor: Ademir Varjão

Versão Atual: 3.2

🚀 Novidades das Versões 3.x
📥 Importação e Exportação (JSON) [v3.2]: Faça backups leves ou migre seus templates entre contas/planilhas exportando os dados em formato .json.

☑️ Exportação Seletiva [v3.2]: Utilize as caixas de seleção (checkboxes) na barra lateral para exportar apenas os templates que desejar.

✏️ Renomear Templates [v3.2]: Novo botão de lápis na aba lateral que permite alterar o nome de templates salvos de forma rápida e direta.

🖼️ Pixel Interno [v3.0]: O rastreamento agora usa um pixel embutido (sem dependência externa).

⚙️ Configuração Flexível [v3.0]: A URL do Web App pode ser lida de Script Properties (com fallback no CONFIG).

🧼 Nomes de Templates Seguros [v3.0]: Sanitização e timestamp ao salvar templates no Drive.

🚀 Funcionalidades Principais
📨 Envio e Personalização
Substituição de Variáveis: Personalize cada e-mail com dados da planilha (ex: Olá {{ Nome }}, o valor é {{ Valor }}).

Editor HTML Rico: Formate textos, insira links, cores e alinhe parágrafos facilmente.

Imagens Inline: Suporte completo para imagens no corpo do e-mail (com redimensionamento automático e conversão para CID para evitar bloqueios).

Múltiplos Destinatários: Suporta múltiplos e-mails na mesma célula (separados por vírgula ou ponto e vírgula) e Cópia (CC) global.

📎 Anexos e Arquivos
Upload de Anexos: Envie PDFs, documentos ou imagens como anexo para toda a lista (com travas de limite de tamanho).

Importação de Assinatura: Puxa automaticamente a assinatura configurada no seu Gmail principal.

📊 Gestão e Rastreamento
Rastreamento de Leitura (Pixel): Saiba exatamente quem abriu o e-mail e quando.

Relatórios Automáticos:

Gera a aba 📊 Relatório de Envios com resumo de sucessos e falhas.

Gera a aba 📊 Rastreamento Detalhado que atualiza o status para "LIDO / ABERTO" em tempo real.

Respeito a Filtros: O sistema envia apenas para as linhas visíveis na planilha.

Gestão de Templates Avançada: Crie, salve, carregue, exclua, renomeie, importe e exporte (em JSON) modelos de e-mail para uso recorrente.

🛠️ Instalação Passo a Passo
Para que o sistema funcione 100% (especialmente o rastreamento e o armazenamento no Drive), siga estes passos:

1. Configuração do Script
Abra sua planilha no Google Sheets.

No menu superior, vá em Extensões > Apps Script.

Arquivo de Código:

Apague qualquer código que esteja no arquivo Código.gs (ou Code.gs).

Copie o conteúdo do arquivo main (versão 3.2) deste projeto e cole lá.

⚠️ Importante: Na aba de variáveis iniciais, altere NOME_REMETENTE: 'JR Contabilidade' para o seu nome.

(Opcional) Defina ABA_DADOS caso queira fixar a aba de dados padrão.

Arquivo de Painel:

Clique no + (sinal de mais) ao lado de "Arquivos" > HTML.

Nomeie o arquivo exatamente como painel (letras minúsculas).

Copie o conteúdo do arquivo painel.html atualizado deste projeto e cole dentro deste novo arquivo.

2. Ativação do Rastreamento (Deployment)
Para que o pixel de rastreamento funcione, o script precisa ser publicado na web:

Dentro do editor de Apps Script, clique no botão azul Implantar (canto superior direito) > Nova implantação.

Clique no ícone de engrenagem (Configurações) e escolha App da Web.

Preencha exatamente assim:

Descrição: Auto Email v3.2

Executar como: Eu (seu e-mail).

Quem pode acessar: Qualquer pessoa (Isso é obrigatório para o pixel carregar sem login).

Clique em Implantar.

O Google pedirá permissão. Clique em Autorizar acesso, escolha sua conta e, se aparecer "App não verificado", clique em Avançado > Acessar (nome do projeto).

Nota: Copie a URL do Web App gerada e insira no seu código na variável URL_WEB_APP do objeto CONFIG.

📋 Como Utilizar
1. Preparação da Planilha
Sua planilha deve ter uma linha de cabeçalho na linha 1.

Coluna Obrigatória: Você deve ter uma coluna chamada Email, E-mail ou E mail.

Dados: Preencha as linhas abaixo com os dados dos contatos.

2. Abrindo o Sistema
Atualize a página da planilha (F5).

Aguarde alguns segundos até aparecer o menu Auto Email na barra superior.

Clique em Auto Email > 📧 Abrir Painel de Envio.

3. Criando, Editando e Exportando Templates
Insira o "Nome do Template", escreva seu e-mail, adicione imagens e formate como preferir.

Clique em "+ Novo" para salvar o modelo. Se for um arquivo HTML longo (com muitas imagens inseridas), ele irá automaticamente para a sua conta do Google Drive para poupar espaço da planilha.

Renomear e Excluir: Na aba de templates, passe o mouse sobre o template salvo e clique no ícone de lápis (editar nome) ou na lixeira (excluir).

Exportar e Importar: Para fazer backup ou trocar de planilha, marque as caixinhas dos templates desejados e clique em 📤 Exportar. Um arquivo .json será baixado. Para carregar modelos, basta clicar em 📥 Importar e selecionar este mesmo arquivo.

4. Teste e Envio
Clique em 🧪 Enviar Teste para mandar uma cópia para o seu próprio e-mail preenchido com os dados da primeira linha.

Se estiver tudo certo, clique em Disparar Emails para realizar o envio em massa para as linhas visíveis.

❓ Solução de Problemas (Troubleshooting)
1. Erro "A entrada contém mais que o limite máximo de 50000 caracteres"

Solução: A partir da versão 3.0, templates grandes são salvos no Drive automaticamente para evitar esse erro. Confirme se as permissões do Drive foram aceitas durante a execução.

2. O Rastreamento não está marcando como "Lido"

Verifique se implantou como App da Web, definiu o acesso como "Qualquer pessoa" e adicionou a URL gerada na variável URL_WEB_APP no código.

3. As variáveis {{ Nome }} não são substituídas

Verifique se o nome do cabeçalho na planilha é exatamente igual ao que está entre chaves (o sistema tenta ignorar espaços e maiúsculas/minúsculas para facilitar, mas evite caracteres especiais nas colunas).

4. Limites de Envio (Gmail)

Contas Gmail gratuitas (@gmail.com): ~500 e-mails/dia.

Contas Google Workspace (empresariais): ~2.000 e-mails/dia.

📝 Licença
Este projeto é de uso restrito, disponibilizado somente mediante a autorização do desenvolvedor.
Desenvolvido por Ademir Varjão.
