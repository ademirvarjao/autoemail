# 📧 Auto Email — v3.3.0

Automação de e-mails personalizados integrada ao Google Sheets, desenvolvida por **Ademir Varjão**. O projeto usa Google Apps Script para compor mensagens HTML, gerenciar templates, enviar mensagens pelo Gmail em lotes retomáveis e registrar os resultados na planilha.

**Versão:** 3.3.0 · **Atualização:** 16/11/2026

**Licença proprietária:** todos os direitos reservados. Uso somente mediante autorização prévia e expressa, por escrito, de Ademir Varjão. Consulte [LICENSE](LICENSE).

> **Importante:** o rastreamento de abertura é um mecanismo legado com limitações técnicas. Não comprova leitura nem garante a detecção de aberturas. A publicação do Web App não elimina essas limitações.

## Índice

- [Funcionalidades](#funcionalidades)
- [Arquivos do projeto](#arquivos-do-projeto)
- [Requisitos](#requisitos)
- [Instalação e configuração](#instalação-e-configuração)
- [Como usar](#como-usar)
- [Lotes, retomada e cancelamento](#lotes-retomada-e-cancelamento)
- [Rastreamento e limitações](#rastreamento-e-limitações)
- [Dados, privacidade e segurança](#dados-privacidade-e-segurança)
- [Atualização de uma instalação existente](#atualização-de-uma-instalação-existente)
- [Solução de problemas](#solução-de-problemas)
- [Testes](#testes)
- [Histórico de versões](#histórico-de-versões)
- [Direitos autorais e licença](#direitos-autorais-e-licença)

## Funcionalidades

### Composição e envio

- Editor HTML com formatação de texto, cores, alinhamento, listas e links.
- Personalização do assunto e do corpo com variáveis, como `{{ Nome }}` e `{{ Valor }}`.
- Inserção de imagens, ajuste manual de largura e conversão das imagens em Base64 para imagens inline via CID no envio. A exibição ainda depende do cliente de e-mail.
- Múltiplos destinatários por célula, separados por vírgula ou ponto e vírgula: o primeiro vai em **Para** e os demais em **CC**.
- CC global aplicado a cada mensagem.
- Anexos compartilhados por todas as mensagens do disparo: até **10 MB por arquivo** e **20 MB no total**, conforme os limites locais do painel. Limites adicionais do Google ainda se aplicam, inclusive para imagens inline.
- Importação da assinatura da conta Gmail principal, mediante ativação do serviço avançado Gmail.
- Pré-visualização com navegação entre registros e envio de teste para um endereço informado.

### Templates e relatórios

- Criação, atualização, carregamento, renomeação e exclusão de templates.
- Exportação seletiva e importação em JSON. A importação substitui templates com o mesmo nome.
- Armazenamento híbrido: conteúdo HTML com mais de **45.000 caracteres** é salvo no Drive; os demais templates ficam na planilha.
- Relatório consolidado de envios e registros individuais de rastreamento quando há uma URL configurada.
- Processamento em lotes, com verificação de cota, progresso salvo, retomada e cancelamento.

## Arquivos do projeto

| Arquivo | Finalidade |
| --- | --- |
| `main` | Código do servidor Google Apps Script; copiar para um arquivo `.gs`. |
| `painel` | HTML, CSS e JavaScript da interface; copiar para o arquivo HTML chamado `painel` no Apps Script. |
| `LICENSE` | Condições de uso e reserva de direitos autorais. |
| `tests/*.test.cjs` | Testes automatizados com simulação dos serviços Google. |
| `tests/browser-preview.cjs` | Teste opcional do preview em Chromium. |

Os arquivos `main` e `painel` não têm extensão neste repositório. Não é necessário renomeá-los para copiar o conteúdo ao editor do Apps Script. Os testes não devem ser copiados para lá.

## Requisitos

- Autorização de uso concedida pelo titular, nos termos de [LICENSE](LICENSE).
- Conta Google com acesso ao Sheets, Gmail, Drive e Apps Script, sujeita às políticas da organização.
- Planilha com cabeçalho na primeira linha e coluna de e-mail.
- Permissões solicitadas pelo Apps Script para os serviços utilizados.
- Serviço avançado **Gmail API**, somente para importar a assinatura.
- Implantação como **App da Web** com acesso sem login, caso seja utilizado o endpoint legado de rastreamento e a organização permita essa configuração.

O projeto é instalado manualmente no Apps Script vinculado à planilha. Não há aplicação Node.js de produção nem publicação automática a partir deste repositório.

## Instalação e configuração

### 1. Preparar a planilha

1. Crie uma aba de dados, preferencialmente chamada **Contatos**.
2. Coloque os cabeçalhos na linha 1.
3. Inclua uma coluna chamada `Email`, `E-mail` ou `E mail`.
4. Preencha as linhas seguintes com os contatos e os dados de personalização.

Exemplo:

| Nome | Email | Empresa | Valor |
| --- | --- | --- | --- |
| Ana | ana@example.com | Empresa Exemplo | 150,00 |
| Bruno | bruno@example.com; financeiro@example.com | Outra Empresa | 200,00 |

### 2. Instalar os arquivos

1. Abra **Extensões > Apps Script** na planilha.
2. Em `Código.gs` ou `Code.gs`, substitua o conteúdo pelo arquivo [`main`](main). Evite manter outras cópias das mesmas funções no projeto.
3. Adicione um arquivo **HTML**, nomeie-o exatamente como **painel** e cole o conteúdo de [`painel`](painel).
4. Salve o projeto.

### 3. Revisar o objeto `CONFIG`

O objeto está no início de `main`:

| Propriedade | Padrão atual | Orientação |
| --- | --- | --- |
| `ABA_DADOS` | `Contatos` | Nome da aba de contatos. Se estiver vazio ou a aba não existir, o código usa a aba ativa; confira-a antes de abrir o painel. |
| `NOME_REMETENTE` | `JR Contabilidade` | Substitua pelo nome de exibição desejado. Isso não troca a conta Gmail remetente. |
| `DELAY_ENVIO_MS` | `1500` | Pausa entre mensagens, em milissegundos. |
| `TAMANHO_LOTE` | `20` | Máximo de registros por chamada de processamento. |
| `TEMPO_LOTE_MS` | `60000` | Orçamento de tempo verificado entre registros; não interrompe uma chamada ao Google já em execução. |
| `MISSING_VAR_FALLBACK` | Texto vazio | Substituição usada quando uma variável não corresponde a um cabeçalho. |
| `URL_WEB_APP` | URL presente no código | Configure o endereço da implantação desta instalação. Não reutilize a URL de outra planilha. |

Os nomes das abas de templates, relatório e rastreamento também estão em `CONFIG`. Evite alterá-los após começar a usar o sistema, pois o código procura os dados pelos nomes configurados.

A propriedade de script `URL_WEB_APP`, quando preenchida, tem prioridade sobre `CONFIG.URL_WEB_APP`. Para operar sem URL de rastreamento, deixe **ambos** vazios; uma propriedade vazia não desativa um endereço presente em `CONFIG`.

### 4. Autorizar e abrir o painel

1. Volte à planilha e recarregue a página.
2. Acesse **Auto Email > 📧 Abrir Painel de Envio**.
3. Se o Google solicitar autorização, revise as permissões e prossiga somente se confiar no código e tiver autorização para usá-lo. Em contas corporativas, pode ser necessária a liberação do administrador.
4. Se o menu ainda não aparecer, execute `onOpen` no editor do Apps Script e recarregue a planilha.

### 5. Habilitar a importação de assinatura — opcional

No editor do Apps Script, abra **Serviços > +**, adicione **Gmail API** e mantenha o identificador `Gmail`. Dependendo da configuração do projeto Google Cloud, pode ser necessário habilitar a API também nesse projeto. Sem esse serviço, o envio continua disponível, mas a importação da assinatura apresenta uma orientação de erro.

### 6. Publicar o endpoint legado de rastreamento — opcional

Leia primeiro [Rastreamento e limitações](#rastreamento-e-limitações).

1. Acesse **Implantar > Nova implantação > App da Web**.
2. Use uma descrição como **Auto Email v3.3.0**.
3. Configure **Executar como: Eu**, usando a conta autorizada responsável pela implantação.
4. Configure **Quem pode acessar: Qualquer pessoa**, se essa opção for permitida pela organização. O endpoint precisa receber requisições sem login.
5. Implante e copie a URL terminada em `/exec` para a propriedade de script `URL_WEB_APP` ou para `CONFIG.URL_WEB_APP`.
6. Se você alterou o código após implantar, publique uma nova versão na implantação existente.

O item **🛠️ Configurar Rastreamento (1ª vez)** do menu mostra a URL configurada; ele não realiza a implantação nem comprova que o pixel funciona nos clientes de e-mail.

## Como usar

### 1. Selecionar os contatos

Confira a aba de dados antes de abrir o painel. O sistema respeita linhas ocultas por um **filtro comum do Google Sheets** usando `isRowHiddenByFilter`.

**Atenção:** linhas ocultas manualmente não são excluídas pelo código. Não presuma suporte a visualizações de filtro; valide a seleção antes do envio. A confirmação do painel conta linhas, não endereços individuais.

### 2. Compor e personalizar

Preencha o assunto e o corpo. Use os chips de variáveis ou digite, por exemplo:

```text
Olá {{ Nome }},
O valor referente à empresa {{ Empresa }} é {{ Valor }}.
```

A correspondência ignora maiúsculas/minúsculas e espaços nas extremidades. Prefira cabeçalhos únicos e nomes consistentes; acentos, pontuação e espaços internos podem fazer diferença. Variáveis não encontradas usam o fallback configurado. Datas são personalizadas como `dd/MM/yyyy`; outros valores seguem a leitura da planilha, não necessariamente sua formatação visual.

Adicione anexos, imagens e assinatura conforme necessário. Aguarde a leitura dos anexos terminar antes de enviar. Para redimensionar uma imagem inserida, clique nela e informe uma largura, como `300px` ou `50%`.

### 3. Gerenciar templates

- **+ Novo:** solicita um nome e salva assunto e corpo. Usar um nome já existente atualiza o template correspondente.
- **Salvar alterações:** o botão de disquete atualiza o template carregado.
- **Carregar, renomear e excluir:** passe o mouse sobre um template para acessar os ícones.
- **Exportar:** marque os templates desejados e baixe `templates_autoemail.json`.
- **Importar:** selecione um JSON exportado pelo sistema e confirme a substituição de nomes existentes. A operação não é transacional: se ocorrer uma falha, templates importados antes dela permanecem salvos.

Templates armazenam **nome, assunto e corpo HTML**; não incluem os anexos do painel nem o CC global. A exportação JSON também não inclui esses itens.

### 4. Visualizar, testar e enviar

1. Use a aba **Visualizar** e as setas para revisar assunto, destinatários da linha e corpo personalizado. O campo CC do preview mostra os destinatários adicionais daquela célula, não o CC global.
2. Clique em **🧪 Enviar Teste**, confirme o endereço e confira o resultado. O teste usa a primeira linha visível para personalização, inclui os anexos/imagens atuais e não aplica o CC global nem o pixel do disparo.
3. Clique em **Disparar Emails**, revise a confirmação e inicie.
4. Mantenha o painel aberto para encadear os lotes seguintes.

A verificação inicial de cota inclui os destinatários válidos de cada linha e seus CCs. Ela é repetida antes de cada mensagem. Outros limites do Google podem interromper o processamento mesmo com cota diária disponível.

## Lotes, retomada e cancelamento

O padrão é de até **20 registros por lote**, com orçamento de **60 segundos** verificado entre os registros. Não há gatilho de envio em segundo plano.

- A primeira chamada salva uma cópia dos dados selecionados, assunto, corpo, CC, anexos e imagens inline. Alterações posteriores na planilha, nos filtros ou no editor **não afetam o envio pendente**.
- Um lote já iniciado pode terminar mesmo após o painel ser fechado. Novos lotes dependem de o painel permanecer aberto ou de uma retomada posterior.
- Reabra o painel com a **mesma conta e na mesma planilha**. Um diálogo oferece a retomada. Se recusar, outro diálogo permite cancelar ou manter o envio salvo.
- Um novo disparo não substitui silenciosamente o trabalho pendente.
- O bloqueio por usuário impede processamento simultâneo desse usuário no mesmo projeto. Ele **não impede que pessoas diferentes iniciem campanhas distintas para a mesma lista**.
- Se a cota estiver insuficiente, o trabalho fica pausado. Retome quando houver cota.
- Cancelar interrompe o restante da campanha, mas não desfaz mensagens já enviadas.

### Tentativas com resultado incerto

Antes de chamar o Gmail, o sistema salva um marcador de tentativa. Se ocorrer uma interrupção entre essa chamada e a confirmação do progresso, pode não ser possível saber se o Google aceitou a mensagem.

Nesse caso, a tentativa é sinalizada como **incerta** e **não é reenviada automaticamente**: a retomada a ignora para reduzir o risco de duplicação. Confira a pasta **Enviados** antes de decidir por um envio manual. Não há garantia de entrega exatamente uma vez entre serviços independentes.

### Relatórios

- **📊 Relatório de Envios:** resumo ao concluir ou cancelar o trabalho, incluindo sucessos, falhas e avisos. A contagem de falhas também pode incluir tentativas incertas; leia os detalhes. Em um cancelamento, registros não processados são informados no detalhe, sem serem contados automaticamente como falhas.
- **📊 Rastreamento Detalhado:** registros individuais quando há URL configurada e o registro é bem-sucedido. Receber uma requisição reconhecida pode atualizar o status para **LIDO / ABERTO**, sujeito às limitações abaixo.

Até dez avisos curtos são mantidos no checkpoint/relatório; resultados incertos têm prioridade sobre avisos de rastreamento. Uma falha ao registrar o rastreamento não converte uma mensagem já enviada em falha de envio. Se o relatório final falhar, o progresso salvo permite tentar sua conclusão sem reenviar as mensagens processadas.

## Rastreamento e limitações

O Web App legado retorna `HtmlOutput` contendo uma imagem em Base64. Essa resposta é **HTML**, não um arquivo binário `image/gif`. Usar esse endereço no `src` de uma imagem de e-mail não garante que clientes ou proxies requisitem ou aceitem o recurso.

- O mecanismo foi mantido por compatibilidade, sem prometer suporte binário que a plataforma não oferece diretamente.
- A instalação registra o ID da planilha ao iniciar um disparo e usa bloqueio para serializar atualizações de abertura.
- O marcador no e-mail tem dimensões de 1 × 1 px, sem `display:none`. Isso não resolve o tipo HTML da resposta.
- Uma correção completa exige um endpoint que responda bytes de imagem e encaminhe o evento com autenticação adequada. Este projeto **não inclui esse serviço externo**.
- Mesmo com um endpoint de imagem adequado, bloqueio de imagens, cache, proxies, scanners e recursos de privacidade podem esconder aberturas ou gerar registros automáticos.
- O identificador é **por mensagem**, incluindo seus CCs, não por destinatário. Não é possível determinar qual pessoa daquela mensagem abriu o e-mail.

**Ausência de registro não prova ausência de leitura; um registro também não comprova leitura humana.**

## Dados, privacidade e segurança

### Armazenamento

| Dados | Local e retenção |
| --- | --- |
| Templates | Aba oculta `💾 Meus Templates`; corpos HTML grandes ficam na pasta `Templates AutoEmail (Sistema)` do Drive. |
| Campanha pendente | Arquivo `AutoEmail_Envio_<id>.json` no Drive de quem iniciou o envio, com contatos, conteúdo e anexos em Base64. |
| Progresso da campanha | Propriedades de usuário do Apps Script, com chave separada por planilha. |
| Histórico | Abas de relatório e rastreamento na planilha, até remoção pelo responsável. |

O código não cria compartilhamento público dos snapshots. Não compartilhe, altere ou exclua esses arquivos durante uma campanha. Na conclusão ou no cancelamento, o snapshot é enviado à **lixeira**, não excluído definitivamente. Campanhas abandonadas permanecem salvas até retomada ou cancelamento. Se a limpeza falhar, remova o arquivo residual manualmente após conferir a conclusão.

Uma aba oculta **não é um controle de acesso**. Gerencie as permissões da planilha e do Drive. Dados de templates, relatórios e contatos ficam sujeitos a essas permissões; o checkpoint privado não torna a planilha inteira privada.

### Conteúdo e responsabilidade de uso

- O preview usa `sandbox="allow-same-origin"`, sem `allow-scripts`, e uma política CSP. Mantém o ajuste de altura, imagens e estilos, mas bloqueia scripts/eventos, formulários, pop-ups e navegação da página principal.
- Esse isolamento se aplica ao **preview**, não é uma sanitização universal do editor. Importe templates e assinaturas somente de fontes confiáveis. Scripts e formulários não fazem parte da composição de e-mail suportada.
- Imagens e estilos remotos podem gerar requisições de rede. O painel também referencia a biblioteca de ícones Material Icons do Google Fonts.
- Use somente listas de contatos com base legal apropriada, respeitando a LGPD, as políticas do Google e as regras da organização. Defina retenção, acesso e descarte dos dados, inclusive na lixeira.
- CC expõe os endereços aos demais destinatários daquela mensagem; o sistema não oferece envio em CCO.

## Atualização de uma instalação existente

1. Conclua ou cancele campanhas pendentes antes de substituir o código. Preserve os templates e dados importantes conforme sua política de backup.
2. Atualize **`main` e `painel` juntos** no Apps Script. Não misture versões do servidor e da interface.
3. Revise o `CONFIG`, preservando os nomes das abas existentes e usando a URL correta da instalação. Não sobrescreva inadvertidamente configurações personalizadas com os valores do repositório.
4. Se houver Web App, acesse **Implantar > Gerenciar implantações**, edite a implantação e publique uma **nova versão**, mantendo a URL configurada quando aplicável.
5. Recarregue a planilha, reautorize os serviços se solicitado e verifique **Sobre**, que deve mostrar **3.3.0**.
6. Valide com poucos contatos controlados: variáveis, filtro, CC, anexo, imagem, teste e fechamento/reabertura do painel.

**Um merge no GitHub não atualiza a instalação no Apps Script.**

## Solução de problemas

| Problema | O que verificar |
| --- | --- |
| Menu não aparece | Recarregue a planilha; confirme que o script está vinculado a ela e execute `onOpen`, se necessário. |
| Coluna de e-mail não encontrada | Use `Email`, `E-mail` ou `E mail` na linha 1 da aba selecionada. |
| Nenhuma linha disponível ou dados incorretos | Confira `ABA_DADOS`, a aba ativa e o filtro comum. Ocultação manual não exclui linhas. |
| Variável não substituída | Confira o nome do cabeçalho, acentos, pontuação e espaços internos. Variável ausente usa o fallback. |
| Importação da assinatura falha | Adicione o serviço avançado Gmail API, com identificador `Gmail`, e revise as permissões. |
| Leitura de anexos pendente | Aguarde terminar ou selecione novamente os arquivos que falharam. Respeite os limites locais e os do Google. |
| Template grande não salva ou não carrega | Confira as permissões do Drive e a existência do arquivo associado. Não exclua os arquivos da pasta de templates manualmente. |
| Cota insuficiente | Considere todos os destinatários e CCs por mensagem. A cota do Apps Script pode diferir da cota da interface do Gmail. Aguarde sua renovação e retome o trabalho. |
| Envio interrompido | Reabra o painel com a mesma conta e planilha; retome o checkpoint. Não inicie outro disparo para tentar substituir o anterior. |
| Resultado incerto | Confira o registro indicado e a pasta Enviados. A tentativa não será reenviada automaticamente. |
| Snapshot removido ou inacessível | A retomada depende dele. Se não puder restaurá-lo, use o cancelamento oferecido ao reabrir o painel e confira os enviados antes de criar nova campanha. |
| Status de abertura não muda | Confira URL e implantação, mas considere a resposta HTML e as limitações dos clientes. O status não é prova de leitura. |

## Testes

### Testes automatizados sem serviços reais

Com uma versão atual do Node.js que suporte `node:test` (validados com Node.js 22):

```sh
node --test tests/*.test.cjs
```

Os testes simulam serviços Google e cobrem templates, importação, personalização, anexos, cota, lotes, falhas, retomada, cancelamento, rastreamento e preservação da marcação/CSS. Não enviam mensagens reais e não substituem a validação integrada no Apps Script.

### Teste opcional de preview em Chromium

Requer bibliotecas de sistema compatíveis com Chromium:

```sh
npm install --no-save --package-lock=false playwright-core@1.65.1 @sparticuz/chromium@153.0.0
node tests/browser-preview.cjs
```

Verifica bloqueio de scripts/eventos e formulários, imagens, estilos, altura automática e recuperação após erro. São dependências **locais de teste**; não as copie para o Apps Script. Caso o navegador não inicie por falta de uma biblioteca nativa, prepare o ambiente de teste antes de executar novamente.

## Histórico de versões

### 3.3.0 — 16/11/2026

- Consolida as correções e melhorias incorporadas após a versão 3.2.
- Envio em lotes com snapshot, checkpoint, retomada, cancelamento e proteção contra reenvio automático de tentativas incertas.
- Cálculo de cota incluindo destinatários adicionais e CC por mensagem.
- Preview isolado com sandbox/CSP, preservando a apresentação da interface.
- Correções em templates, importação, variáveis e controle assíncrono de anexos.
- Registro de abertura com identificação explícita da planilha e bloqueio de atualizações concorrentes, sem apresentar o endpoint HTML como um pixel binário funcional.
- Documentação revisada, versão alinhada ao painel e ao servidor e licença proprietária explícita.

### 3.2 — versão anterior

- Importação/exportação de templates em JSON, exportação seletiva e renomeação de templates.

### 3.0 — recursos anteriores

- Templates grandes armazenados no Drive, sanitização de nomes de arquivos e URL de rastreamento configurável por propriedades do script.
- Handler legado de rastreamento com imagem embutida em HTML, sujeito às limitações documentadas.

## Direitos autorais e licença

**Copyright © 2026 Ademir Varjão. Todos os direitos reservados.**

Este projeto é **proprietário** e não é disponibilizado sob uma licença de código aberto. Sua disponibilização ou visibilidade em um repositório não concede, por si só, autorização de uso.

Qualquer utilização, reprodução, modificação, distribuição, sublicenciamento, comercialização ou disponibilização como serviço depende de **autorização prévia e expressa, por escrito, de Ademir Varjão**, ressalvadas as permissões obrigatórias previstas em lei e os direitos de terceiros. Uma autorização vale somente no escopo e nas condições concedidos pelo titular.

Consulte o texto completo em [LICENSE](LICENSE). As referências a produtos, bibliotecas e serviços de terceiros não transferem seus direitos ao titular deste projeto; esses itens permanecem sujeitos às respectivas condições e políticas.
