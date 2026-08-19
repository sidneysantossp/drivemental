# Fase 6 Finalization — F6.4–F6.9

Este PR fecha os controles restantes da Fase 6 e o rebaseline pós-migração sem integrar o drift do motor nem alterar a lógica metodológica do Sincronário/13 Luas.

## Controles fechados

| Controle | Evidência e decisão |
|---|---|
| **F6.4 — Governança da main** | Proteção efetiva confirmada via API: `Pre-deploy gate` e `Post-deploy runtime gate` obrigatórios, checks estritos, enforcement para administradores, force push bloqueado e exclusão bloqueada. Revisão obrigatória permanece em zero para evitar deadlock do único operador. |
| **F6.5 — Drift do motor** | `src/domain/sincronario/core/*` e `tests/core-engine.test.js` foram classificados como **preservar como trabalho futuro fora do baseline**. Nenhum arquivo do drift foi integrado ao bundle, CI, Vercel ou Supabase. |
| **F6.6 — Observabilidade** | Request ID sanitizado/gerado, ecoado e exposto por CORS; logs estruturados sem tokens, Authorization, cookies, PII ou payloads. Prova local: `GET 405`, `POST 500` controlado, request ID correlacionável e redaction aprovada. |
| **F6.7 — Runbooks** | Versionados os runbooks de rollback de deployment, incidente de migration/database e resposta a incidentes, todos com gatilho, responsável, sequência, validação pós-ação e escalonamento. |
| **F6.8 — Hardening de delete-account** | CORS wildcard mantido nesta fase com risco residual documentado; request ID implementado; idempotência segura confirmada sem estado adicional; rate limiting mantido como follow-up da camada apropriada; logs sensíveis proibidos. A exclusão autenticada não foi repetida fora da prova de migração autorizada. |
| **F6.9 — Rebaseline pós-migração** | Guardrails operacionais apontam ao projeto canônico novo e continuam protegendo o projeto antigo como contingência. Backup gerenciado diário observado no painel, com limite de Storage documentado; PITR não foi declarado nem habilitado. Prova Auth temporária no novo projeto passou com login `200`, autoexclusão `200` e novo login `400`; nenhum artefato sensível foi salvo. |
| **Identidade de release** | Runtime e gate passam a exigir `2026.08.19-f6`, correlacionável ao SHA/deployment do merge final. |

## Validações previstas pelo gate

A sequência obrigatória permanece `npm test` → `npm run build` → predeploy gate → deployment Production associado ao SHA → postdeploy gate → runtime proof. O runtime proof deve validar a identidade `2026.08.19-f6`, assets públicos, headers, request ID e os contratos `OPTIONS 200`, `GET 405` e `POST sem JWT 401`.

Nenhuma credencial, JWT, refresh token, senha, service-role key, e-mail de operador ou dado pessoal é incluído neste PR. O primeiro backup lógico real de produção continua obrigação operacional do operador autorizado.
