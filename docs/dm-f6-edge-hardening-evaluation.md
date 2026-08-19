# F6.8 — Avaliação final do hardening de `delete-account`

**Escopo:** avaliação autorizada sem repetir a exclusão autenticada da Fase 5
**Baseline funcional:** `bc4b33c`
**Mudança localizada nesta finalização:** request/correlation ID e logs estruturados redigidos

| Controle | Estado/decisão | Justificativa e prova |
|---|---|---|
| CORS wildcard | **Manter nesta fase, com risco residual documentado.** | A função exige Bearer JWT validado no handler; CORS não concede autoridade e a operação não usa autenticação por cookie. O wildcard evita quebra durante a futura configuração do domínio, preview controlado e mudança de alias. O risco residual é permitir que qualquer origem leia respostas de quem já possui um JWT; isso deve ser reavaliado quando o domínio canônico estiver ativo. O preflight, os métodos e headers permitidos continuam explícitos. |
| Request ID | **Implementado.** | `X-Request-ID` sanitizado/gerado, ecoado na resposta e exposto por CORS; logs estruturados carregam somente serviço, evento, request ID, método e status. Prova local e runtime proof verificam echo/exposição. |
| Idempotência | **Comportamento seguro confirmado; chave persistida não necessária nesta fase.** | A exclusão deriva o UID exclusivamente do JWT validado. Depois de uma exclusão bem-sucedida, uma nova autenticação da conta não é possível conforme a prova F5; chamadas repetidas não podem escolher outro usuário nem repetir a exclusão com identidade autenticada válida. Não foi introduzida tabela ou body de idempotência para não alterar a lógica de produto. |
| Rate limiting | **Não implementar dentro da função nesta fase; risco residual e follow-up registrados.** | A função não expõe operação sem autenticação nem permite escolher `user_id`; requests sem JWT terminam em 401. O abuso residual é consumo de invocações com tokens inválidos. A proteção deve ser avaliada na camada Supabase/Vercel/WAF quando houver requisito de volume e limiar operacional observável. A decisão não bloqueia o fechamento desta fase, mas permanece item de hardening futuro. |
| Logs sensíveis | **Proibidos e cobertos por contrato.** | O código não registra Authorization, cookies, payloads, user IDs, e-mails, senhas, tokens ou detalhes de erro remoto. A prova local falha se esses padrões aparecerem nos logs. |

## Não regressão

A autenticação, a derivação de identidade e a chamada administrativa não foram alteradas. A função continua com `verify_jwt = false`, validação dentro do handler e exclusão exclusivamente do `userData.user.id`. A prova autenticada da Fase 5 permanece a evidência de sucesso; nesta finalização não foi repetida operação destrutiva porque a lógica correspondente não foi modificada.

## Critério de reavaliação

Quando `drivemental.com.br` estiver configurado como domínio canônico, revisar a decisão de CORS e substituir o wildcard por allow-list de origens efetivamente usadas, com preflight e runtime proof. Se métricas mostrarem volume anômalo de 401, avaliar rate limiting na camada apropriada sem colocar estado de limitação dentro da função de exclusão. Qualquer mudança nessas decisões abre um novo conjunto de testes e deployment.
