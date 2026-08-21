# Checkpoint técnico final — F7 / go-live controlado

**Data:** 21 de agosto de 2026
**Projeto canônico:** Drive Mental / Supabase ativo
**Escopo:** somente estado técnico sanitizado; não contém credenciais, connection strings, hashes, UUIDs, e-mails, payloads ou conteúdo de usuário.

## Estado formal dos gates

| Gate | Estado | Evidência/limite |
|---|---|---|
| `F7.1.2` ownership/RLS | **APROVADO** | Isolamento próprio/cruzado, grants, DML e rollback confirmados anteriormente |
| `F7.2-EXPORT-001` | **RESOLVED** | Produto descreve corretamente `Baixar backup local`; exportação sincronizada integral permanece capacidade P1 futura |
| `F7.2-DELETE-001` | **RESOLVED** | Self-delete normal de D, Auth ausente, dados user-owned reconciliados a zero, C intacta e nenhuma referência órfã observada |
| `F7.3` admin auditability | **CONCLUÍDA** | Migration autorizada aplicada; função security definer e três triggers ativos; write → audit log → revert → segundo log confirmado |
| `F7.2-RETENTION-001` | **ABERTO / BLOCKED BY ORGANIZATIONAL & LEGAL DECISION** | Controlador, bases legais, prazos, encarregado/canal e retenção efetiva ainda não foram definidos pelo responsável competente; não foram inferidos pela equipe técnica |
| `F7-LEGACY-STATE-001` B | **RISCO LEGADO CONHECIDO, SEM MANIPULAÇÃO** | B permanece congelada; o Arquiteto autorizou manter essa classificação se o lifecycle continuar íntegro e houver comportamento seguro para eventual perfil incompleto |

## SLO e monitoramento

O baseline de SLO/monitoramento foi **aprovado para o beta controlado** como objetivos operacionais provisórios, não como SLA ou compromisso comercial. Ele define disponibilidade proposta, SEV-1/2/3, interpretação de 401/403/405, investigação de 5xx, correlação por request ID, bloqueio por mismatch SHA/deployment/runtime, fontes Vercel/GitHub/Supabase e critérios de abertura/encerramento.

A Edge Function mantém request ID seguro e logs redigidos. O runtime proof público cobre headers, assets, release, ausência de padrões privilegiados e os guardrails `OPTIONS 200`, `GET 405` e `POST sem JWT 401`. Responsável por incidentes, canal de escalonamento, retenção efetiva de logs e aprovação organizacional dos percentuais continuam pendentes.

## Scan do Supabase antigo

O scan final foi somente leitura e não acessou nem alterou o projeto antigo. Não foram encontradas referências operacionais no código/configuração ativa auditada; as ocorrências remanescentes estão em documentação histórica e evidências raw da migração anterior. O projeto antigo permanece preservado como contingência. Classificação: `F7-LEGACY-SUPABASE-001: RESOLVED — no active dependency found; historical references retained.`

## Testes e build

A execução local de `npm test` passou em todos os contratos: engines Dreamspell/13 Moons, plataforma web, integração Supabase e renderização do app. `npm run build` também passou e gerou `dist`. O runtime-config gerado continua declarando release `2026.08.19-f6`, ambiente de produção e modo Supabase. A promoção final ainda depende dos gates CI/deploy/runtime da referência que será publicada em `main`.

## Backup lógico real

O operador informou que executou o procedimento de backup fora do repositório. A pedido do operador, nenhum arquivo, hash, nome de bundle, tamanho, connection string ou conteúdo foi enviado nesta sessão. Portanto, o estado correto é **operador declarou execução; evidência sanitizada não anexada e verificação não independente nesta sessão**. Não declarar `verification=passed` com base apenas nessa declaração; o artefato externo deve permanecer privado e ser validado pelo runbook quando necessário.

## Decisão de go-live

O beta controlado pode continuar com a redação pública honesta e os objetivos operacionais provisórios aprovados. O **go-live público/comercial permanece bloqueado** por `F7.2-RETENTION-001` e pelo limite de evidência do backup lógico nesta sessão. Nenhuma mudança de metodologia Dreamspell/13 Luas, schema/RLS fora do escopo, billing, owner, B ou C foi executada nesta etapa.

## Próxima sequência autorizada

A sequência técnica permanece: manter a decisão organizacional de retenção pendente; preservar a evidência do backup fora do repositório; realizar, quando autorizado, a validação sanitizada do bundle; manter SLO/monitoramento; confirmar a referência Git final, CI, predeploy, deployment, postdeploy e runtime proof; então solicitar ao Arquiteto a decisão final de go-live.

## Achado adicional — `F7-RETENTION-FK-001`

A inspeção read-only confirmou que `public.app_settings.updated_by` referencia `auth.users(id)` com `ON DELETE NO ACTION`. A consulta de uso agregado encontrou 4 configurações e zero linhas com `updated_by` preenchido; consequentemente, zero referências apontam para admin ativo e zero linhas apontam para usuário sem role admin ativa. O comportamento de schema permanece documentado como decisão futura, sem alteração de schema ou dados, e não produz impacto operacional nas configurações atuais.

O achado não altera a classificação dos gates: `F7.2-RETENTION-001` continua aberto por decisão organizacional/legal e a evidência verificável do backup continua ausente nesta sessão.

## Runtime proof público

O runtime proof somente leitura passou contra a produção com release esperado `2026.08.19-f6`. Foram aprovados os assets home/manifest/service worker/runtime-config, headers de segurança, ambiente production, modo Supabase, guardrails da Edge Function (`GET 405`, `OPTIONS 200`, `POST sem JWT 401`), eco/exposição CORS do request ID e secret scan público. Nenhum request ID, chave ou corpo foi incluído no checkpoint.

O arquivo não possuía bit executável; a prova foi executada explicitamente via Bash, sem alterar permissões ou conteúdo versionado.

## CI final observado

A consulta somente leitura ao GitHub Actions encontrou execuções concluídas com `success` para a `main`, para a branch da correção F7.2 e para a branch da correção F7.3. O runtime proof público também passou. Esses sinais não substituem a decisão do Arquiteto nem removem os bloqueios de retenção/controlador/canal e de evidência verificável do backup.

## F7 Technical Release Candidate

O workflow final da `main` foi observado como concluído com `success` no SHA `48d41cef755d2807540f8c781405e9ba0ee75276`. Os jobs `Pre-deploy gate` e `Post-deploy runtime gate` ficaram `completed/success`. O runtime proof público correspondente passou com a release esperada `2026.08.19-f6`, validando assets, headers, guardrails da Edge Function, correlação e secret scan.

Classificação arquitetural atual: `F7 TECHNICAL RELEASE CANDIDATE — APPROVED`. Isso **não equivale a go-live público**. Os bloqueios que permanecem explícitos são:

| Bloqueio | Estado |
|---|---|
| `F7.2-RETENTION-001` | Aberto por decisão organizacional/legal: controlador, encarregado, bases legais, retenção, fornecedores/transferências e canal de direitos ainda não aprovados |
| `F7-BACKUP-PROD-001` | Evidência sanitizada verificável do primeiro backup lógico real não anexada nesta sessão; operador declarou execução, mas não se deve marcar `verification=passed` sem confirmação segura |
| Ownership operacional | Responsável por incidentes, escalonamento, retenção efetiva de logs e aprovação formal dos percentuais SLO ainda pendentes |
| `F7-RETENTION-FK-001` | `app_settings.updated_by` é `NO ACTION`; 4 settings atuais e zero referências preenchidas; sem impacto atual, nenhuma alteração autorizada |

Não são autorizados por este RC: campanha pública, aquisição aberta deliberada, cobrança, decommission do projeto Supabase antigo, mudança metodológica ou declaração de go-live concluído.

## Promoção F7 RC concluída

A identidade autorizada `2026.08.21-f7-rc1` foi aplicada exclusivamente por PR protegido. O PR de release foi squash-mergeado na `main`, gerando o SHA final `0ab2528ebc04d69e54963ef83e9a1453376a7cdc`. O workflow de `main` concluiu com sucesso: `Pre-deploy gate` e `Post-deploy runtime gate` verdes, incluindo deployment Production e runtime proof. Uma execução independente do runtime proof após o deployment passou com `expected_release=2026.08.21-f7-rc1`, assets críticos, guardrails, correlação e secret scan aprovados.

A classificação continua sendo `F7 TECHNICAL RELEASE CANDIDATE — APPROVED` para beta técnico/controlado, não go-live público. Permanecem `F7.2-RETENTION-001` aberto, `F7-BACKUP-PROD-001` como execution reported/verification pending e ownership operacional pendente.

## Decisão arquitetural após promoção F7 RC

O Arquiteto registrou formalmente `F7 TECHNICAL RELEASE CANDIDATE — PROMOTED / APPROVED` com release `2026.08.21-f7-rc1`, baseline SHA `0ab2528ebc04d69e54963ef83e9a1453376a7cdc`, PR #21, `Pre-deploy gate=PASS`, `Production deployment=SUCCESS`, `Post-deploy runtime gate=PASS` e `Runtime proof independente=PASS`.

A correlação release → SHA → deployment → runtime foi declarada fechada. Assets PWA, headers, Supabase canônico, guardrails de delete-account, request ID, secret scan, ausência do diagnóstico F7 e texto de backup local foram aceitos. O Arquiteto registrou `F7 POST-DEPLOY GATE — CLOSED / GREEN` e informou que não é necessária nova promoção técnica neste momento.

Estado autorizado: beta técnico/controlado continua permitido. Go-live público/comercial permanece bloqueado por `F7.2-RETENTION-001`, `F7-BACKUP-PROD-001` e ownership/SLO organizacional. Permanecem proibidos campanha pública, aquisição aberta deliberada, cobrança, decommission do Supabase antigo, mudança metodológica e declaração de go-live concluído. O projeto Supabase antigo deve continuar preservado.

O próximo gate é Organizational Go-Live Readiness: resolver decisões organizacionais/jurídicas e fornecer evidência sanitizada de backup, sem o agente inferir controlador, encarregado, bases legais, prazos de retenção ou canal de direitos.
