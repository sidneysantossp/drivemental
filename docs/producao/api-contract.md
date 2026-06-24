# Contrato inicial da API

Todas as rotas, exceto saude, exigem token de acesso valido. O backend deriva o
usuario do token e nunca aceita `user_id` enviado pelo frontend como criterio de
autorizacao.

## Rotas

### `GET /v1/health`

Retorna estado da API, banco e identificador da versao.

### `GET /v1/me`

Retorna perfil, versoes de consentimento e nivel de acesso.

### `PUT /v1/me`

Atualiza nome, data de nascimento e area principal. Campos inesperados sao
rejeitados.

### `DELETE /v1/me`

Inicia exclusao da conta e invalida sessoes. A resposta informa o protocolo e o
prazo aplicavel.

### `GET /v1/export`

Gera exportacao dos dados pessoais em JSON.

### `POST /v1/consents`

Registra tipo do documento, versao e instante de aceite.

### `GET|POST /v1/readings`

Lista ou cria leituras. O backend valida a entrada e salva a versao do motor,
base de conhecimento e resultado completo.

### `GET|PUT /v1/journey-progress`

Consulta ou atualiza inicio da jornada e dias concluidos.

### `GET|PUT /v1/protocol-progress/:date`

Consulta ou atualiza os momentos concluidos em uma data.

### `GET|POST|DELETE /v1/timeline-events`

Gerencia eventos pessoais, sempre limitados ao usuario autenticado.

## Requisitos transversais

- validacao de esquema em todas as entradas;
- limite de requisicoes por usuario e IP;
- logs sem nome, data de nascimento, texto de leitura ou token;
- identificador de requisicao em respostas e logs;
- idempotencia em criacao de leitura e exclusao;
- testes que provem que um usuario nao acessa registros de outro;
- paginacao para historico e linha do tempo;
- datas em ISO 8601 e armazenamento em UTC quando houver horario.
