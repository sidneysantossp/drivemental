# Runbook de Rollback de Deployment — Drive Mental

**Escopo:** Vercel Production e código versionado
**Responsável primário:** mantenedor autorizado do repositório
**Escalonamento:** responsável técnico/ChatGPT Arquiteto quando houver impacto de dados, Auth ou metodologia
**Regra:** nenhum rollback deve alterar migrations ou dados de produção sem decisão explícita

## Gatilhos

Acionar este runbook quando o deployment publicado causar erro 5xx, falha de boot, regressão de autenticação/PWA, violação de CSP, falha do runtime proof, indisponibilidade relevante ou comportamento funcional comprovadamente incorreto. Um Vercel **Ready** não é aprovação suficiente: o gate de runtime deve passar.

## Sequência de decisão

| Etapa | Ação | Critério de saída |
|---|---|---|
| 1. Confirmar | Registrar SHA, URL, horário UTC, sintomas, status HTTP e alcance do impacto sem coletar PII. | Incidente classificado e release identificada. |
| 2. Conter | Pausar merge/deploys adicionais e preservar logs/provas redigidas. | Nenhuma nova release agrava o incidente. |
| 3. Escolher | Se a falha é exclusiva do deployment, selecionar o último deployment Production conhecido como saudável. Se envolve migration/dados, parar e usar o runbook de migration/database incident. | Plano de rollback sem operação destrutiva. |
| 4. Executar | No Vercel, usar a ação de rollback/redeploy do deployment saudável ou reverter o commit via PR. A `main` protegida exige checks obrigatórios; não usar force push. | Deployment anterior publicado. |
| 5. Validar | Rodar `npm test`, `npm run build`, predeploy gate, deployment status check e runtime proof. Verificar `/`, manifest, service worker, runtime-config, headers e guardrails da Edge Function. | Todos os gates passam. |
| 6. Encerrar | Registrar causa, SHA antigo/novo, horário, evidências, impacto e ação preventiva. | Arquiteto/responsável aceita o encerramento. |

## Rollback de código

A reversão de código deve ser feita por PR revert ou por novo commit corretivo. O histórico Git não deve ser reescrito. Se a causa estiver em configuração Vercel, a correção deve ser versionada em `vercel.json` e passar pelo mesmo gate. O commit saudável não deve ser considerado seguro apenas por histórico: deve passar novamente pelo smoke e runtime proof.

## Validação pós-ação

A validação mínima é `tests → build → migrations/schema check → security sanity → deployment → smoke test → runtime proof`. Para a aplicação, os endpoints públicos devem retornar 200, os headers de hardening devem permanecer presentes, o runtime deve indicar ambiente de produção e a Edge Function deve continuar retornando `GET 405`, `OPTIONS 200` e `POST sem JWT 401`. Não repetir exclusão autenticada salvo mudança na lógica correspondente.

## Escalonamento

Escalar imediatamente quando houver perda ou corrupção de dados, falha de RLS/Auth, exposição de segredo/PII, migration já aplicada com efeito incorreto, indisponibilidade superior ao objetivo operacional, ou qualquer impacto metodológico no Sincronário/13 Luas. Em caso de segredo exposto, interromper a análise do payload, revogar/rotacionar o segredo pelo procedimento seguro e não registrá-lo em issue, commit ou log.
