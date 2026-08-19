# F6.6 — Observabilidade mínima e correlação segura

**Superfície:** Edge Function `delete-account`
**Escopo:** correlação localizada, logs estruturados redigidos e provas não destrutivas
**Decisão:** implementar request ID sem alterar a lógica de autenticação ou exclusão

## Contrato observável

Cada request recebe um `X-Request-ID`. Se o cliente enviar `x-request-id`, ele só é reutilizado quando corresponde ao padrão ASCII seguro de 1 a 128 caracteres; caso contrário, a função gera um UUID novo. O mesmo valor é devolvido na resposta e exposto ao browser por `Access-Control-Expose-Headers`.

A função emite um único evento estruturado por resposta, contendo somente `service`, `event`, `request_id`, `method` e `status`. O contrato proíbe registrar `Authorization`, cookies, payloads, IDs de usuário, e-mails, senhas, tokens, detalhes de erro remoto ou qualquer corpo pessoal. Não há logging do JWT nem do identificador de usuário derivado.

| Evento | Status | Como correlacionar |
|---|---:|---|
| `preflight` | 200 | request ID no header e no evento |
| `method_not_allowed` | 405 | request ID no header e no evento |
| `unauthorized` | 401 | request ID no header e no evento |
| `configuration_invalid` | 500 | request ID no header e no evento; sem chamada Supabase |
| `account_deletion_failed` | 500 | request ID no header e no evento; sem detalhes do erro |
| `account_deleted` | 200 | request ID no header e no evento |

## Evidências

A prova local `scripts/dm-f6-observability-local-proof.sh` iniciou a mesma função com todos os segredos ausentes e demonstrou:

- `OPTIONS` → 200;
- `GET` → 405;
- `POST` → 500 controlado por `function_configuration_invalid`;
- request ID enviado pelo cliente foi ecoado e exposto via CORS;
- logs estruturados continham apenas campos operacionais e não continham padrões de autorização, cookie, token, senha, user ID ou e-mail.

A prova de produção permanece não destrutiva: o runtime proof verifica `OPTIONS 200`, `GET 405`, `POST sem JWT 401`, correlação de request ID e ausência de padrões privilegiados nos corpos públicos. A prova com JWT válido e exclusão autenticada permanece aceita da Fase 5 e não foi repetida, pois a lógica de autenticação/exclusão não foi modificada.

A correlação entre release/SHA e runtime é feita pelo workflow: o `predeploy` valida a mudança, `release-deployment-check.sh` exige deployment Production `success` para o SHA e `release-runtime-proof.sh` executa os probes públicos no alias. Um 5xx sintético não é provocado em produção; o caminho controlado é validado em ambiente local sem credenciais.
