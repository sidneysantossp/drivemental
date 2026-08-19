# Evidência de finalização F6 — Drive Mental

**Escopo:** fechamento dos controles F6.4–F6.9 após a migração para o Supabase canônico `qgvlkpaociypyxduvsqm`.
**Data:** 2026-08-19.
**Regra metodológica:** nenhum cálculo Dreamspell/13 Luas, fixture aceito ou comportamento funcional foi alterado.

## Estado dos controles

| Controle | Resultado | Evidência curada |
|---|---|---|
| F6.4 Governança da main | Aprovado | Consulta efetiva à proteção da branch: checks pre/post obrigatórios, strict, admins enforced, force push e exclusão bloqueados; revisão zero por ausência de segundo revisor habilitado. |
| F6.5 Drift | Aprovado | `docs/dm-f6-drift-classification.md`; decisão: preservar como trabalho futuro fora do baseline. |
| F6.6 Observabilidade | Aprovado | `docs/dm-f6-observability.md` e `docs/dm-f6-observability-proof.txt`; request ID ecoado/exposto, 4xx esperado e 5xx controlado localmente com redaction. |
| F6.7 Runbooks | Aprovado | `docs/producao/deployment-rollback-runbook.md`, `migration-database-incident-runbook.md` e `incident-response-runbook.md`. |
| F6.8 delete-account | Aprovado | `docs/dm-f6-edge-hardening-evaluation.md`; CORS, request ID, idempotência, rate limiting e logs sensíveis avaliados explicitamente. |
| F6.9 Rebaseline | Aprovado | Guardrails reancorados; backup gerenciado diário observado no projeto novo; Auth temporário validado e removido; release atualizado para `2026.08.19-f6`. |

## Prova Auth de migração

Uma conta sintética temporária foi criada no projeto canônico com confirmação automática, usada somente para validar o novo domínio de confiança e removida pela própria operação autorizada. Os resultados curados foram: login inicial `200`; `delete-account` autenticado da própria conta `200`; tentativa de novo login após a exclusão `400`. Nenhum token, senha, UID, endereço de operador ou dado pessoal foi salvo.

## Recuperabilidade

O painel Database → Backups do projeto canônico exibiu backup físico diário e ponto disponível em `19 Aug 2026 20:47:58 (+0000)`. A decisão de recovery está em `docs/dm-f6-recovery-decision.md`: manter backup gerenciado diário do banco e backup lógico externo complementar; não declarar PITR; tratar Storage, Auth, secrets e integrações como superfícies com procedimentos próprios. O primeiro backup lógico real de produção continua uma obrigação do operador autorizado.

## Identidade de release

`runtime-config.js`, `scripts/release-runtime-proof.sh` e `.github/workflows/ci.yml` foram alinhados ao identificador `2026.08.19-f6`. O gate final deve exigir que release, deployment Production e SHA esperado sejam consistentes.

## Segurança da evidência

Nenhuma credencial, JWT, refresh token, senha, service-role key, payload ou PII foi incluída. A prova autenticada foi única, controlada e destrutiva somente sobre a conta temporária autorizada.
