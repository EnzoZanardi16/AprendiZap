# AprendiZap — HTML e CSS

Projeto baseado nos dois prints enviados do Figma Aprendizap.
O arquivo principal é `dist/index.html`. Na versão ZIP, ele está na pasta principal.

## Como abrir

1. Extraia o arquivo ZIP inteiro.
2. Abra `index.html` no Chrome, Edge ou Firefox.
3. Use o menu para navegar. Mantenha as páginas, o CSS, o JavaScript e a pasta `assets` juntos.

Não é necessário instalar bibliotecas, executar comandos ou ter uma conexão com a internet para abrir o projeto baixado.

## Arquivos

| Arquivo | Conteúdo |
| --- | --- |
| `index.html` | Início, apresentação, indicadores, depoimentos, disciplinas, professores, chamadas, perguntas frequentes e blog. |
| `professores.html` | Quatro perfis, horários, formação e metodologia. |
| `disciplinas.html` | Dez disciplinas com descrição, nível, modalidade e vagas ilustrativas. |
| `solicitar.html` | Formulário de solicitação de reforço. |
| `voluntario.html` | Formulário de professor voluntário. |
| `blog.html` | Onze artigos com filtros e leitura na própria página. |
| `style.css` | Todas as cores, fontes, layouts e regras para celular. |
| `script.js` | Menu móvel, filtros, links diretos e revisão dos formulários. |
| `assets/` | Três imagens ilustrativas geradas para o projeto. |

## Como editar

- **Textos:** abra o arquivo HTML correspondente e altere o texto entre as tags.
- **Cores:** altere as variáveis dentro de `:root`, no começo de `style.css`.
- **Imagens:** substitua os arquivos em `assets` e ajuste o atributo `src` ou o `background-image` no CSS.
- **Professores e disciplinas:** os cartões são HTML comum. Ao alterar um cartão filtrável, atualize também seus atributos `data-search`, `data-subject`, `data-level` e `data-modality`.
- **Especialidades dos professores:** se mudar as disciplinas, atualize o objeto `specialties` de `script.js` para que o formulário mantenha as opções compatíveis.
- **Responsividade:** as regras estão no final de `style.css`, dentro de `@media`.

## O que funciona

- Navegação entre as seis páginas usando links relativos.
- Layouts adaptados para computador, tablet e celular.
- Filtros de texto sem distinção de acentos, disciplina, nível, modalidade e tema.
- Perguntas frequentes, metodologias e artigos com `details` e `summary`.
- Preenchimento de disciplina e professor pelos botões dos cartões.
- Validação de campos obrigatórios e de e-mail.
- Revisão das informações digitadas na própria página, sem envio.
- Navegação por teclado, foco visível, rótulos e opção de reduzir movimento.

## Limitações importantes

Este é um **protótipo de interface**, com HTML e CSS e um JavaScript pequeno para as interações. Não há banco de dados, autenticação, envio de e-mails, armazenamento ou cadastro real. Os formulários são habilitados somente quando o script que impede o envio está pronto.

Os nomes, perfis, vagas, depoimentos e indicadores são exemplos. As três imagens foram criadas com geração de imagens e são ilustrativas. Os prompts e o método estão em `IMAGENS.md`.

A referência disponível foi um print reduzido com todas as telas. Por isso, o projeto reproduz sua estrutura, paleta e proposta visual, com aproximações nos textos, nas medidas, no logotipo e nas imagens. Não é uma exportação exata do arquivo Figma.

## Verificações

Foram verificadas a sintaxe JavaScript, a estrutura CSS, os arquivos de imagem, a presença de rótulos e identificadores, os links locais e os destinos de navegação. As regras responsivas foram revisadas no código. A prévia de navegador deste ambiente não estava disponível para este projeto estático; não houve teste visual automatizado em navegador.

A busca também oferece uma integração opcional com WebMCP, quando o navegador a suporta. Navegadores comuns a ignoram. Não houve contexto WebMCP disponível para testar essa integração.
