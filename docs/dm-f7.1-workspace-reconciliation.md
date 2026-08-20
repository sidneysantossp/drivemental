# F7.1 — Reconciliação do workspace antes da correção

**Data:** 20/08/2026
**Escopo:** somente reconciliação local antes da correção autorizada F7-LIFECYCLE-001.

| Superfície | Estado observado |
|---|---|
| `origin/main` | `5a3a8444c68bb6d113ba281cbffd6d48ef8b9b40` — baseline F6 aprovado/publicado |
| Branch local | `fix/f6-reanchor-destination` |
| `HEAD` local | `ea56a0f2db866cd69b293a2e3cbe00dd4b0e9d97` |
| Relação local/main | A branch local contém o merge de reconciliação e está à frente do ponteiro de `origin/main` para o trabalho local; não é o destino de produção até PR/CI/deploy |
| Working tree | Possui alteração rastreada em `docs/dm-f6-finalization-evidence.md` e diversos artefatos não rastreados históricos/evidenciais; não foram modificados arquivos de runtime nesta reconciliação |
| Baseline funcional | A correção F7-LIFECYCLE-001 ainda não foi aplicada |

## Limites

Os arquivos não rastreados incluem documentação e artefatos de fases anteriores, além de arquivos locais do engine/testes. Eles não serão automaticamente incluídos no PR da correção. O PR deverá conter somente a alteração localizada autorizada e seus testes/artefatos diretamente relacionados, preservando o engine Dreamspell/13 Luas, o schema, o RLS e o `delete-account`.

Nenhuma operação de produção foi executada nesta reconciliação. A produção continua apontando para a release `2026.08.19-f6` no SHA aprovado da `main`.
