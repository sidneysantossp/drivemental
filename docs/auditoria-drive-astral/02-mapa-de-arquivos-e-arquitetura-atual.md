# 02 - Mapa de arquivos e arquitetura atual

## Tecnologia

- Aplicacao web estatica.
- JavaScript puro no navegador.
- CSS puro.
- Servidor local Node.js sem dependencias externas.
- Fontes carregadas do Google Fonts.
- Sem framework front-end.
- Sem banco de dados.
- Sem autenticacao.
- Sem API de negocio.
- Sem IA.

## Arquivos do projeto

| Arquivo | Responsabilidade | Regra de negocio | Conteudo interpretativo | Calculo | Riscos |
|---|---|---:|---:|---:|---|
| `package.json` | Define nome do projeto e script `npm start`. | Nao | Nao | Nao | Baixo: sem scripts de teste/build. |
| `server.js` | Servidor HTTP local para arquivos estaticos. | Nao | Nao | Nao | Baixo: fallback sempre serve `index.html`. |
| `index.html` | Estrutura HTML base e carregamento de fontes/CSS/JS. | Nao | Nao | Nao | Medio: depende de Google Fonts externo. |
| `app.js` | Estado, navegacao, componentes, telas, textos e historico local. | Sim, minima | Sim | Nao, exceto data atual do relatorio | Critico: mistura interface, textos e dados. |
| `styles.css` | Tokens visuais, layout, animacoes e responsividade. | Nao | Nao | Nao | Baixo: contem apenas apresentacao. |
| `driveastral-server.out.log` | Log gerado ao iniciar o servidor local. | Nao | Nao | Nao | Baixo: atualmente nao contem dados pessoais. |
| `driveastral-server.err.log` | Log de erro do servidor local. | Nao | Nao | Nao | Baixo: atualmente vazio. |

## Componentes atuais em `app.js`

| Componente/funcao | Responsabilidade |
|---|---|
| `CosmicBackground` | Moldura visual comum e fundo cosmico. |
| `AppHeader` | Cabecalho das telas internas. |
| `AstralEmblem` | Simbolo visual de meditacao. |
| `AstralHeader` | Titulo principal da tela inicial. |
| `GoldenDivider` | Ornamento visual. |
| `GoldenCard` | Card visual. |
| `GoldenInput` | Campo visual com icone. |
| `CosmicThemeSelector` | Seletor entre Financas e Relacionamentos. |
| `PrimaryEnergyButton` | Botao principal. |
| `EmptyState` | Estado vazio da tela inicial. |
| `BottomNavigation` | Navegacao inferior. |
| `HomeScreen` | Tela inicial e formulario. |
| `ChakraBodyMap` | Ilustracao visual dos chakras. |
| `ChakraCard` | Card de cada chakra. |
| `ChakrasScreen` | Tela do mapa dos 7 chakras. |
| `ProtocolSection` | Card de secao do protocolo. |
| `ProtocolStep` | Card de etapa do protocolo. |
| `ProtocolScreen` | Tela de protocolo diario. |
| `HistoryScreen` | Tela de historico. |
| `ProfileScreen` | Tela de perfil. |
| `render` | Seleciona a tela a ser renderizada. |
| `bindEvents` | Liga eventos de navegacao, formulario e campos. |

## Rotas atuais

As rotas nao usam URL. Elas sao controladas pelo campo `state.route` no navegador.

| Rota interna | Tela |
|---|---|
| `home` | Inicio |
| `chakras` | Mapa dos 7 Chakras |
| `protocol` | Protocolo Diario |
| `history` | Historico |
| `profile` | Perfil |

## Fluxo atual

```text
Usuario abre app
-> app.js carrega estado de localStorage
-> renderiza home
-> usuario informa nome, data e tema
-> ao enviar, app valida campos preenchidos
-> cria resumo generico com data atual
-> salva nome, data, tema e historico no localStorage
-> redireciona para tela de chakras
```

## Arquitetura atual

```text
index.html
  -> app.js
       -> estado em memoria
       -> localStorage
       -> componentes/telas
  -> styles.css

server.js
  -> serve arquivos estaticos
```

## Observacao principal

A aplicacao atual e uma base visual. O arquivo `app.js` concentra tudo que existe de produto, texto, estado e comportamento. Isso devera ser separado antes de implementar qualquer regra real do Sincronario.
