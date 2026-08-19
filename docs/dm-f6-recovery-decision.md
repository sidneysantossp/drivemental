# F6.9 — Decisão de recuperabilidade pós-migração

**Projeto canônico:** `qgvlkpaociypyxduvsqm`
**Data da verificação:** 2026-08-19
**Decisão:** manter duas camadas de proteção: backup gerenciado diário do banco e backup lógico externo versionado/operacional, sem declarar PITR habilitado.

## Evidência observada

A área **Database → Backups → Scheduled backups** do projeto canônico informa backups diários aproximadamente à meia-noite da região e exibiu um ponto físico disponível em 19 Aug 2026 20:47:58 (+0000), com ação de restore. A mesma superfície informa que objetos do Storage API não são incluídos nos backups de banco.

| Camada | Estado | Limite operacional |
|---|---|---|
| Backup gerenciado do banco | Disponível diariamente; ponto físico observado no painel | Não cobre objetos binários do Storage API; Auth, secrets e integrações exigem procedimento próprio |
| Backup lógico externo | Mantido no runbook e nos scripts `backup-supabase.sh`/`restore-supabase.sh` | Depende de `SUPABASE_DB_URL` fornecida somente pelo ambiente autorizado |
| PITR | Não declarado como habilitado | Não houve mudança de compute, add-on ou plano; a fase não autoriza upgrade pago |
| Restore | Procedimento documentado e prova local isolada aprovada | Restore em produção exige autorização específica e não foi executado |

## RPO/RTO e operação

O RPO operacional permanece limitado pelo intervalo do backup gerenciado diário até que o operador autorizado confirme uma política mais frequente. O RTO continua dependente da seleção de um ponto de backup ou bundle lógico íntegro, da restauração em projeto isolado e da validação de schema, RLS/Auth, smoke e runtime antes de qualquer decisão sobre produção.

O primeiro backup lógico real de produção continua sendo uma obrigação operacional do operador autorizado. Nenhuma credencial foi solicitada, exposta ou incluída nesta evidência; a prova realizada nesta fase foi de procedimento e de disponibilidade do backup gerenciado, não uma exportação adicional de dados.
