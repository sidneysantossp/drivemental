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
