# Inventário de reancoragem da Fase 6

## Escopo

Objetivo: localizar referências ao projeto Supabase antigo `horsbnzwozvpboejsbww` e separar documentação histórica de controles operacionais que precisam apontar ao destino canônico `qgvlkpaociypyxduvsqm`.

## Achados iniciais

| Grupo | Arquivos/áreas observadas | Classificação preliminar |
|---|---|---|
| Runtime atual | `runtime-config.js` e `dist/runtime-config.js` | Destino novo já aplicado; validar novamente após o próximo build. |
| Gate de runtime | `.github/workflows/ci.yml` | Já corrigido no PR #6 para o endpoint novo; confirmar no tree da main e no próximo gate. |
| Evidência da migração | `docs/dm-migration-destination-evidence.txt`, `docs/dm-migration-destination.sql` | Nova evidência; manter destino novo. |
| Ordem e descoberta históricas da Fase 5 | `docs/dm-f5-architect-order.md`, `docs/dm-f5-discovery.md` | Referências históricas; não reescrever fatos passados, mas anexar uma nota de supersessão/canonicalização para evitar uso operacional indevido. |
| AS-IS da Fase 6 | `docs/dm-f6-asis.md` e arquivos `.raw.txt` | Diagnóstico histórico do baseline antigo; preservar como histórico e adicionar reancoragem explícita nos documentos ativos. |
| Backup/recuperação | `docs/dm-f6-backup-validation.txt`, `scripts/backup-supabase.sh`, runbooks e inventários | Controle operacional; precisa usar o destino novo ou receber parâmetro explícito, sem versionar credenciais. |
| Scripts de deploy | `scripts/deploy-supabase.ps1` e referências extraídas nos inventários | Controle operacional potencialmente perigoso; reancorar somente o project ref padrão, mantendo senha fora do repositório. |
| Probes documentados | `docs/dm-f6-method-probes.raw.txt` | Evidência histórica; manter os fatos do antigo e acrescentar a prova equivalente do novo. |
| Snapshot/artefatos gerados | `dist/` e relatórios `.raw.txt` | Não tratar como autoridade operacional; atualizar apenas os artefatos versionados/ativos exigidos pelo Architect. |

## Regra de classificação

Uma referência antiga em uma evidência histórica não deve ser apagada, porque descreve o estado real no momento da auditoria. Uma referência antiga em script, workflow, configuração de deploy, runbook ativo ou variável padrão deve ser reancorada para `qgvlkpaociypyxduvsqm` antes de retomar a Fase 6.

## Restrições

Nenhuma credencial, token, senha ou dado pessoal será incluído na matriz. A classificação do drift do motor (`src/domain/sincronario/core/engine.js` e `tests/core-engine.test.js`) permanece separada e não será resolvida automaticamente nesta etapa.

## Controles ativos confirmados

| Arquivo | Referência antiga | Ação autorizada |
|---|---|---|
| `scripts/backup-supabase.sh` | Default `SUPABASE_PROJECT_REF` | Alterar para `qgvlkpaociypyxduvsqm`; continuar exigindo `SUPABASE_DB_URL` fora do repositório. |
| `scripts/restore-supabase.sh` | `PRODUCTION_REF` usado no bloqueio | Alterar para `qgvlkpaociypyxduvsqm`; manter bloqueio por ref e por domínio Vercel. |
| `scripts/release-runtime-proof.sh` | Default de `DM_DELETE_ACCOUNT_URL` | Alterar para o endpoint da Edge Function no destino novo. |
| `scripts/dm-f6-safe-restore-proof.sh` | Nome local `horsbnzwozvpboejsbww` no alvo bloqueado | Trocar por um identificador local neutro (`dm_f6_production_guard`) para não sugerir que o teste local é o banco remoto. |
| `scripts/deploy-supabase.ps1` | Default `ProjectRef` | Alterar para o destino novo; senha continua somente em variável de ambiente. |
| `docs/producao/backup-recovery-runbook.md` | Projeto, export e caminho de bundle | Alterar para o destino novo e atualizar a regra de projeto canônico. |
| `docs/producao/supabase.md` | Exemplos de CLI e `runtime-config.js` apontando para projeto anterior | Alterar para o destino novo e marcar o Edge Function deploy como já publicado. |
| `.github/workflows/ci.yml` | Endpoint do runtime gate | Já reancorado no PR #6; confirmar no `main`. |

## Referências históricas preservadas

`docs/dm-f5-architect-order.md`, `docs/dm-f5-discovery.md`, `docs/dm-f6-asis.md`, `docs/dm-f6-vercel-evidence.txt` e os arquivos `*.raw.txt` registram estados e decisões anteriores. Eles não devem ser falsificados por substituição silenciosa. Será adicionada uma nota explícita de supersessão/canonicalização nos documentos ativos da Fase 6; fatos históricos permanecerão identificáveis.

## Fora do escopo desta correção

O script `scripts/update-runtime-config-from-new-supabase.sh` é um helper one-off de migração e não é uma fonte de configuração de produção; sua referência antiga será marcada como lógica histórica ou tornada parametrizada, mas não será usada como autoridade operacional. O drift do motor Dreamspell/13 Luas permanece classificado separadamente, sem integração automática.

### Correção da classificação do safe restore proof

A ocorrência no `scripts/dm-f6-safe-restore-proof.sh` não é um destino de restauração real; é uma string de teste usada para acionar o bloqueio de produção. Ela foi reancorada diretamente para `qgvlkpaociypyxduvsqm`, preservando a prova de que o restore recusa o project ref canônico.

## Validação P0 após reancoragem

A prova `bash scripts/backup-supabase.sh --dry-run` informou `project_ref=qgvlkpaociypyxduvsqm` e continuou exigindo `SUPABASE_DB_URL` somente no ambiente. O `bash scripts/release-runtime-proof.sh` passou contra `https://drivemental.vercel.app`, validando release `2026.08.19-f5`, assets públicos, headers, scan de segredos, correlação por `x-request-id` e os guardrails `GET 405`, `OPTIONS 200` e `POST sem JWT 401` no endpoint do destino novo.

A prova `bash scripts/dm-f6-safe-restore-proof.sh` passou em PostgreSQL efêmero local com `row_count=2`, `control_value=restore-proof-ok` e `production_guard=passed`. Nenhuma restauração foi executada no Supabase remoto.

A prova externa solicitada pelo Architect retornou HTTP 200 para `/`, `/privacy.html` e `/runtime-config.js`. Nas três superfícies foram observados `Strict-Transport-Security`, `Content-Security-Policy`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` e `X-Frame-Options`; o runtime-config retornou `application/javascript`.
