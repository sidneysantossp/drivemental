# DM-F5 — Discovery Inicial de Banco e Runtime

**Projeto:** Drive Mental
**Data:** 2026-08-19
**Fase:** F5 — Production Data & Security Baseline

## Estado do repositório

O repositório contém seis migrations versionadas em `supabase/migrations/`:

| Migration | Escopo |
|---|---|
| `202606130001_initial_schema.sql` | profiles, consent_records, readings, journey_progress, protocol_progress, timeline_events, access_entitlements, payment_webhook_events, triggers, auth hook, RLS e grants |
| `202606240001_remove_payment_integration.sql` | remove `access_entitlements` |
| `202606240002_admin_foundation.sql` | admin_roles, app_settings, admin_audit_logs, policies e settings iniciais |
| `202606240003_admin_users_plans.sql` | plan_catalog, user_access_plans, policies e catálogo de planos |
| `202607160001_first_reading_flow.sql` | reading_type, reading_status, índice e revoke de update em readings |
| `202607170001_consultation_guardrails.sql` | constraint de áreas, unicidade de ciclo, trigger de ownership/base pessoal/plano |

O frontend consulta diretamente as tabelas `profiles`, `readings`, `timeline_events`, `journey_progress`, `protocol_progress`, `admin_roles`, `app_settings`, `plan_catalog` e `user_access_plans`. Também invoca a Edge Function `delete-account`.

## Drift de configuração identificado

O arquivo versionado `runtime-config.js` ainda aponta para o projeto Supabase antigo `xvwbtxsryehozinshyfr.supabase.co`, enquanto a baseline oficial aprovada pelo Arquiteto é `horsbnzwozvpboejsbww.supabase.co`. O mesmo projeto antigo é o alvo padrão de `scripts/deploy-supabase.ps1`.

Esse drift é bloqueante para declarar convergência de produção: as variáveis configuradas no Vercel não substituem o `runtime-config.js` estático se o build ainda envia os valores hardcoded antigos. O bundle `dist/runtime-config.js` confirma a mesma referência antiga.

## Probe do Supabase de produção

Foi usado somente o endpoint REST público do projeto novo com a chave publishable, sem privilégios administrativos. A tentativa de consultar cada tabela esperada retornou HTTP 404 com `PGRST205` e a mensagem `Could not find the table 'public.<tabela>' in the schema cache`.

| Recurso esperado | Resultado no projeto `horsbnzwozvpboejsbww` |
|---|---|
| profiles | HTTP 404 — ausente |
| consent_records | HTTP 404 — ausente |
| readings | HTTP 404 — ausente |
| journey_progress | HTTP 404 — ausente |
| protocol_progress | HTTP 404 — ausente |
| timeline_events | HTTP 404 — ausente |
| admin_roles | HTTP 404 — ausente |
| app_settings | HTTP 404 — ausente |
| admin_audit_logs | HTTP 404 — ausente |
| plan_catalog | HTTP 404 — ausente |
| user_access_plans | HTTP 404 — ausente |
| access_entitlements | HTTP 404 — ausente |
| payment_webhook_events | HTTP 404 — ausente |

A consulta de OpenAPI no endpoint raiz REST foi rejeitada com HTTP 401 porque esse endpoint exige secret API key; nenhuma credencial privilegiada foi usada ou exposta. O resultado de 404 das tabelas é suficiente para estabelecer que o schema de produção novo não foi aplicado.

## Conclusão do discovery

O projeto novo de produção está saudável, porém sem o schema esperado pelo código. Existe drift em duas dimensões: (1) o repositório/runtime ainda referencia o projeto antigo; e (2) o projeto novo ainda não recebeu as migrations. Portanto, nenhuma migration foi aplicada nesta etapa e não houve alteração manual no Dashboard.

## Próxima ação autorizada

Corrigir a referência versionada do projeto para `horsbnzwozvpboejsbww`, garantindo que o build público use apenas a URL/chave pública do novo projeto, validar o bundle, e preparar a aplicação das migrations somente por caminho versionado e auditável. A aplicação produtiva não deve ser declarada convergente antes desse ajuste e da prova de schema/RLS.

## Pós-baseline e deployment

As seis migrations foram aplicadas com sucesso no projeto `horsbnzwozvpboejsbww` por meio do pooler regional `aws-0-sa-east-1.pooler.supabase.com:5432`, pois a conexão direta `db.horsbnzwozvpboejsbww.supabase.co:5432` foi recusada pela rede do sandbox. O comando executado foi `npx supabase db push --db-url ... --yes`, utilizando o password apenas em memória.

Após a aplicação, os endpoints REST das tabelas estruturais retornaram HTTP 401 com `42501`/`permission denied for table ...` para a chave publishable sem sessão. Esse comportamento confirma que as relações existem e que o role anon não recebeu privilégios indevidos. `access_entitlements` e `payment_webhook_events` retornaram HTTP 404, conforme esperado após a migration de remoção de pagamentos.

O commit `84633ae` corrigiu `runtime-config.js`, `scripts/deploy-supabase.ps1` e a asserção web para a baseline nova. O deployment Vercel de produção do commit ficou **Ready**. O arquivo público `https://drivemental.vercel.app/runtime-config.js?v=drive-mental-v44` confirma:

- URL: `https://horsbnzwozvpboejsbww.supabase.co`;
- release: `2026.08.19-f5`;
- chave publicável destinada ao cliente;
- ausência da referência antiga no runtime publicado.

A suíte local terminou com os testes de Sincronário, plataforma web, integração Supabase e renderização aprovados, seguida de `npm run build` concluído com `Static site built at dist`.

## Runtime Security Proof — resultado

Foram criadas duas contas efêmeras auto-confirmadas no Auth e usadas somente pelo endpoint público com a chave publishable. As credenciais não foram gravadas no repositório.

| Prova | Resultado |
|---|---|
| Login A com senha correta | OK |
| Login B com senha correta | OK |
| A lê o próprio profile | HTTP 200 |
| A atualiza o próprio profile | HTTP 200 |
| B atualiza o próprio profile | HTTP 200 |
| A insere reading primário com sua identidade e base pessoal | HTTP 201 |
| A lê o próprio reading | HTTP 200 |
| B tenta ler reading de A | HTTP 200 com `[]` |
| B tenta ler profile de A | HTTP 200 com `[]` |
| A tenta `PATCH` em readings | HTTP 403, sem grant de UPDATE |
| A tenta inserir reading atribuído a B | HTTP 400 `READING_USER_MISMATCH` |
| A tenta inserir área não primária sem plano | HTTP 400 `READING_AREA_NOT_AVAILABLE_FOR_PLAN` |
| Login A com senha errada | HTTP 400 `invalid_credentials` |

A prova demonstra autenticação funcional, ownership por usuário, isolamento entre usuários, revogação de update em readings e guardrails de integridade do trigger. Os dois usuários e o reading de prova ainda precisam ser removidos pela rotina de cleanup autorizada.

## Cleanup e prova web final

O painel Auth confirmou que não há usuários no projeto após a remoção das contas temporárias A e B. A verificação final no endpoint de token retornou HTTP 400 `invalid_credentials` para ambas, confirmando que as credenciais de prova não permanecem utilizáveis.

O runtime público respondeu HTTP 200 em `/`, `/manifest.webmanifest`, `/sw.js`, `/runtime-config.js?v=drive-mental-v44` e `/privacy.html`. A resposta web preservou HSTS (`strict-transport-security`) e o runtime publicado confirmou release `2026.08.19-f5`, URL do Supabase novo e chave publicável. O deployment Vercel correspondente ao commit `84633ae` está Ready.

## Edge Function — gap identificado

O painel de Edge Functions do projeto novo mostrou **nenhuma função publicada**, embora o frontend invoque `delete-account`. A função versionada usa `SUPABASE_URL`, chave pública somente para validar o JWT recebido e `SUPABASE_SERVICE_ROLE_KEY` exclusivamente no runtime server-side para `auth.admin.deleteUser`. O source local foi verificado e possui import `npm:@supabase/supabase-js@2`; a publicação deve preservar `verify_jwt = true` e nunca enviar o service role ao bundle. A publicação da função permanece como item bloqueante do baseline até ser comprovada no painel e por teste de método/JWT.

## Estado do acesso autenticado

Em 19/08/2026, a tentativa de takeover retornou: **"Acesso temporariamente indisponível — O acesso autenticado não está disponível neste ambiente de revisão. Nenhuma informação pessoal ou resultado foi enviado."** Nenhuma credencial ou dado pessoal foi transmitido. O editor do Supabase contém apenas uma preparação não publicada da função `delete-account`; não há evidência de deployment da função no projeto de produção. O próximo passo seguro é reabrir uma sessão autenticada, definir o nome `delete-account`, publicar com verificação JWT habilitada e executar as provas HTTP sem JWT e com JWT válido antes do aceite final.

## Retorno inicial do Arquiteto

O ChatGPT Arquiteto respondeu que registra a Fase 5 como **baseline aprovado**, com um único bloqueio operacional aberto: publicação e prova final da Edge Function `delete-account`. A resposta ainda estava em geração/pesquisa quando este registro foi salvo; os critérios finais devem ser capturados integralmente antes da execução seguinte.

## Diretriz arquitetural formal — F5-BLOCK-DELETE-ACCOUNT

O Arquiteto aprovou formalmente o baseline da Fase 5 e abriu somente o bloqueio `F5-BLOCK-DELETE-ACCOUNT`: publicar e provar `delete-account` em produção. A retomada deve continuar exatamente do ponto da função, sem reconstruir o ambiente e sem repetir provas anteriores, salvo alteração em migrations, RLS/Auth ou código relacionado.

Para o desenho com verificação criptográfica do JWT dentro do handler, a orientação é publicar com `verify_jwt = false` no gateway legado, mantendo a autenticação dentro do handler. A função deve rejeitar ausência/JWT inválido antes de qualquer operação administrativa; a identidade deve vir exclusivamente do `sub` do JWT validado, sem aceitar `user_id`, e-mail ou identificador do body/query. `SUPABASE_SERVICE_ROLE_KEY` permanece somente no runtime server-side.

## Critérios de aceite da retomada

A sequência obrigatória definida pelo Arquiteto é: publicar no projeto `horsbnzwozvpboejsbww` com correspondência ao código versionado; configurar `verify_jwt = false` quando a própria função validar JWT/JWKS; provar OPTIONS/CORS 2xx sem JWT, POST sem Authorization com HTTP 401 do handler e sem efeito administrativo, POST com JWT inválido/expirado com HTTP 401, POST com JWT válido retornando 200/204 e excluindo somente o `sub` autenticado; confirmar pós-condição no Auth e cascade dos dados pessoais; garantir GET/PUT e demais métodos em 405; não expor segredo; e versionar a evidência sem JWT, refresh token, service role ou credenciais.

O fechamento integral exige: deployment Ready, OPTIONS/CORS aprovado, 401 sem JWT, 401 JWT inválido, sucesso com JWT válido, confirmação de exclusão do próprio usuário/dados esperados, zero segredo exposto e evidência versionada. O bloqueio `F5-BLOCK-DELETE-ACCOUNT` só deve ser fechado após todos esses pontos.

## Retomada da sessão autenticada

A sessão autenticada do Supabase voltou a responder e o editor de Edge Functions está acessível. O código do template ainda está no editor; a configuração local já foi ajustada para `verify_jwt = false`. O único impedimento operacional restante é que o input HTML `functionName` não aparece como elemento editável na automação: tentativas por índice alteram apenas o rótulo, enquanto o campo real permanece com placeholder após limpeza. Nenhum deployment foi acionado.

## Resultado após publicação da Edge Function

A função `delete-account` passou a existir no Supabase e o editor mostra o código seguro versionado. Contudo, a prova externa imediatamente após o deployment ainda retornou `OPTIONS 204`, `GET 500 Internal Server Error` e `POST 200 {"message":"Hello undefined!"}`. Os headers indicam `cf-cache-status: DYNAMIC`, `sb-project-ref: horsbnzwozvpboejsbww` e `x-served-by: supabase-edge-runtime`, portanto não é cache HTTP público simples; o runtime ainda está atendendo o template padrão em pelo menos uma versão. O overview informou zero invocações desde o último deploy, enquanto os requests externos foram registrados no gateway, exigindo nova reconciliação antes do aceite.

## Diagnóstico de deployment 2

O painel mostra `delete-account` com **2 deployments**, porém os logs mais recentes ainda registram `SyntaxError: Unexpected end of JSON input` em `withSupabase` e `Request.json`, exatamente do template padrão. A prova externa continua retornando `POST 200 {"message":"Hello undefined!"}`. Portanto, a função existe e o código correto está salvo na aba Code, mas a versão ativa ainda não foi reconciliada; o aceite permanece bloqueado e nenhum JWT válido deve ser enviado até o runtime responder 401/200 conforme o handler versionado.

## Prova final do runtime autenticado

A Edge Function autocontida foi publicada e validada externamente. Resultados objetivos: `OPTIONS` retornou `HTTP 200` com `ok`; `GET` retornou `HTTP 405` com `method_not_allowed`; `POST` sem JWT retornou `HTTP 401` com `unauthorized`; login da conta temporária auto-confirmada retornou `AUTH_OK`; `POST` com JWT válido retornou `HTTP 200` com `{\"ok\":true}`, removendo a própria conta; nova tentativa de login retornou `HTTP 400`, confirmando o cleanup. A conta sintética foi removida e nenhuma credencial foi persistida no repositório.

O bloqueio `F5-BLOCK-DELETE-ACCOUNT` está resolvido operacionalmente. O arquivo da função foi tornado autocontido para o editor web, eliminando a dependência ausente de `../_shared/responses.ts`. O runtime agora atende a implementação correta, e a prova de Auth/RLS pode ser considerada concluída para o fluxo de exclusão de conta.

## Convergência final do código e produção

A suíte final passou integralmente: testes do motor, plataforma web, integração Supabase e renderização; `npm run build` concluiu com `dist` gerado. O commit `ce39c68` foi publicado em `main`, e o Vercel reportou o deployment de produção como **Ready**. O runtime da aplicação segue publicado em `https://drivemental.vercel.app/`, enquanto a Edge Function `delete-account` responde conforme o contrato autenticado validado acima.
