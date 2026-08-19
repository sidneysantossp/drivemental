# F6.1 — Prova HTTP pós-deploy

**Deployment verificado:** `673d130` em Production/Ready
**Base pública:** `https://drivemental.vercel.app/`
**Data da coleta:** 19 de agosto de 2026, UTC

## Headers e superfícies públicas

| Superfície | Status | Content-Type observado | Headers de hardening | Secret scan |
|---|---:|---|---|---|
| `/` | 200 | `text/html; charset=utf-8` | HSTS, CSP, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, X-Frame-Options | clear |
| `/manifest.webmanifest` | 200 | `application/manifest+json` | presentes | clear |
| `/sw.js` | 200 | `application/javascript` | presentes; não regressou | clear |
| `/runtime-config.js` | 200 | `application/javascript` | presentes | clear |
| `/privacy.html` | 200 | `text/html; charset=utf-8` | presentes | clear |
| `/terms.html` | 200 | `text/html; charset=utf-8` | presentes | clear |
| rota inexistente SPA | 200 | `text/html; charset=utf-8` | presentes; fallback preservado | clear |

Os corpos públicos foram inspecionados somente por padrões de credencial privilegiada e JWT completo; nenhum valor sensível foi encontrado. A alteração efetiva foi a substituição de `routes` legado por `rewrites` com prioridade do filesystem, mantendo o shell SPA e fazendo os headers globais chegarem aos assets publicados.

## Edge Function `delete-account`

| Método/prova | Status | Resultado |
|---|---:|---|
| `OPTIONS` com CORS | 200 | `ok` |
| `GET` | 405 | `method_not_allowed` |
| `POST` sem JWT, com chave pública | 401 | `unauthorized` |

Nenhuma prova destrutiva autenticada foi executada nesta etapa. A validação anterior da Fase 5 permanece a evidência da exclusão autenticada e da limpeza de usuário.

## Runtime configuration

O runtime publicado continua em `environment: "production"`, `authMode: "supabase"` e release `2026.08.19-f5`. O smoke test foi executado por `scripts/release-runtime-proof.sh` e terminou com `runtime_proof=passed`.
