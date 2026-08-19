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

## Resultado final pós-merge

O PR P0 de reancoragem foi mergeado na `main` como commit `2d19f03fa1803f529f121e8ae673644ce4a4edb1`. O workflow `Validate Drive Astral` `32308986781` concluiu com sucesso: `Pre-deploy gate` e `Post-deploy runtime gate` passaram, incluindo testes, build, migration/schema validation, security sanity, deployment status, smoke test e runtime proof.

A prova pós-merge `bash scripts/release-runtime-proof.sh` passou novamente contra a produção, com `GET_405`, `OPTIONS_200`, `POST_NO_JWT_401`, correlação por request ID e scan de segredos limpo. O dry-run do backup reportou `project_ref=qgvlkpaociypyxduvsqm`, `credentials_source=SUPABASE_DB_URL_environment_only` e proteção `umask_077_and_directory_mode_700`.

## Registro do Architect após o checkpoint P0

O Architect aprovou o P0 de reancoragem no commit `2d19f03fa1803f529f121e8ae673644ce4a4edb1`. A F6.9/rebaseline pós-migração ainda não está integralmente encerrada. Permanecem três provas a fechar antes do encerramento final da Fase 6: (1) prova Auth autenticada no novo projeto; (2) decisão/evidência de que a recuperabilidade está efetivamente disponível no projeto de destino; (3) atualização da identidade de release, pois o runtime ainda anuncia `2026.08.19-f5`.

O Architect confirmou que esses pontos não impedem iniciar P1, mas devem ser encerrados antes do fechamento final. Nenhuma alteração metodológica Dreamspell/13 Luas foi autorizada ou realizada.

## F6.4 — Governança efetiva da main

A consulta à API do GitHub confirmou proteção efetiva em `main`: `strict=true`, checks obrigatórios `Pre-deploy gate` e `Post-deploy runtime gate`, enforcement para administradores habilitado, `allow_force_pushes=false` e `allow_deletions=false`. Não há rulesets adicionais.

`required_approving_review_count=0` e `require_code_owner_reviews=false`, compatível com a ressalva arquitetural de não criar deadlock quando não há outro revisor habilitado. A governança efetiva atende checks obrigatórios, PR operacional e proteção contra force push/exclusão.

## F6.5–F6.7 — Evidência de finalização

O drift de `src/domain/sincronario/core/*` e `tests/core-engine.test.js` foi formalmente classificado em `docs/dm-f6-drift-classification.md` como **preservar como trabalho futuro fora do baseline**. O núcleo isolado tem API, constantes e testes próprios, mas não integra o frontend, o `npm test`, o CI ou o bundle publicado; suas fórmulas e hipóteses não possuem aceitação metodológica equivalente ao engine versionado. Nenhum arquivo do drift será integrado nesta fase.

A prova `scripts/dm-f6-observability-local-proof.sh` passou com `GET_405`, `POST_500_configuration_invalid`, request ID ecoado/exposto e logs estruturados redigidos. A produção continua sendo provada de forma não destrutiva com `GET 405`, `POST sem JWT 401` e request ID; o 5xx controlado é exercitado somente localmente sem credenciais.

Os três runbooks operacionais exigidos estão versionados no workspace: `deployment-rollback-runbook.md`, `migration-database-incident-runbook.md` e `incident-response-runbook.md`. Cada um define gatilho, responsável, passos operacionais, validação pós-ação, escalonamento e regras de não exposição de PII/segredos.

## F6.9 — Recuperabilidade efetiva no plano novo

A área Database → Backups do projeto canônico mostra **Database Backups** com execução diária aproximada à meia-noite da região, um ponto físico listado em `19 Aug 2026 20:47:58 (+0000)` e ação `Restore`. O painel também informa explicitamente que objetos armazenados via Storage API não são incluídos, pois o banco contém somente seus metadados. A decisão operacional pode, portanto, evoluir de “somente procedimento lógico externo” para **backup gerenciado diário do banco + runbook lógico externo como defesa complementar**, sem assumir que Storage/Auth/secrets/integrações estejam cobertos pelo dump.

## F6.9 — Estado Auth no destino

A área Authentication → Users do projeto canônico carregou com a mensagem **No users in your project** na tabela. O rodapé exibiu `Total: 10 users (estimated)`, mas nenhum registro de usuário foi apresentado na superfície consultada; esse contador foi tratado como estimativa não suficiente para selecionar uma conta de teste. Não foi criado usuário nem executada operação de escrita. A prova Auth autenticada no novo projeto permanece pendente e requer uma conta de teste temporária com limpeza autorizada, ou uma decisão explícita do Architect sobre um método seguro equivalente.

## F6.8 — Decisões de hardening de delete-account

A matriz `docs/dm-f6-edge-hardening-evaluation.md` fecha a avaliação sem nova exclusão autenticada: CORS wildcard permanece nesta fase com risco residual documentado; request ID está implementado, sanitizado, ecoado e exposto; repetição é segura porque a identidade deriva exclusivamente do JWT e não há chave persistida necessária; rate limiting não será criado dentro da função nesta fase e fica como follow-up de camada apropriada; logs sensíveis são proibidos e cobertos por prova local. A prova autenticada aceita da Fase 5 não foi repetida porque a lógica de autenticação/exclusão não foi modificada.

A operação de prova Auth temporária foi confirmada pelo operador após a autorização do Architect. Antes da criação, o painel continuou mostrando a tabela sem usuários visíveis; nenhum dado foi criado até este ponto.

## F6.9 — Prova Auth pós-migração

A prova controlada autorizada passou no projeto canônico: login inicial da conta sintética retornou `200`; chamada `delete-account` com JWT válido retornou `200`; nova tentativa de login após a autoexclusão retornou `400`. O request ID foi enviado e verificado localmente. A conta temporária foi criada com confirmação automática, usada somente no teste e removida pela própria função; nenhum token, senha, UID ou PII foi versionado ou incluído no reporte.

Após a prova, a lista Authentication → Users voltou a exibir **No users in your project**; nenhum usuário temporário permanece visível no destino. O contador estimado do painel não foi usado como evidência de registros.
