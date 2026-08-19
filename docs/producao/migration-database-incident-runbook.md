# Runbook de Incidente de Migration/Database — Drive Mental

**Escopo:** migrations Supabase, schema, RLS e dados persistidos
**Responsável primário:** mantenedor autorizado do banco/repositório
**Escalonamento:** responsável técnico/ChatGPT Arquiteto
**Princípio:** preservar evidências e evitar restauração destrutiva em produção como primeira resposta

## Gatilhos

Acionar quando uma migration falhar, uma migration aplicada produzir erro de schema, RLS bloquear uma operação válida, houver divergência entre migrations e produção, ocorrer erro de integridade, ou o runtime indicar comportamento incompatível com o schema.

## Sequência operacional

| Etapa | Ação | Critério de saída |
|---|---|---|
| 1. Congelar | Pausar merge e deploy; não reaplicar cegamente a migration; preservar SHA, nome da migration, timestamp UTC e mensagem redigida. | Estado não se agrava. |
| 2. Classificar | Distinguir falha de aplicação, falha de schema, falha de RLS, corrupção lógica e indisponibilidade. Não incluir dados pessoais na classificação. | Severidade e responsável definidos. |
| 3. Comparar | Comparar `supabase/migrations/` versionado com o estado esperado e, quando autorizado, executar diff somente leitura. | Lacuna conhecida sem alterar produção. |
| 4. Corrigir | Preferir migration forward-fix idempotente, revisada e testada em alvo isolado. Não editar uma migration já aplicada para “corrigir o histórico”. | Correção reproduzível e revisada. |
| 5. Recuperar | Se houver dano de dados, preservar produção e usar o bundle lógico externo/runbook de recovery em projeto isolado. A decisão de restaurar produção exige autorização específica. | Dados recuperáveis em alvo seguro ou incidente escalado. |
| 6. Validar | Rodar schema check, testes, RLS/Auth proofs não destrutivos, smoke e runtime proof. | Todos os checks passam sem regressão. |
| 7. Encerrar | Registrar causa, migration, SHA, impacto, correção e prevenção. | Aceite do responsável técnico. |

## Tratamento por tipo

**Migration não aplicada.** Corrigir a migration em branch, testar em banco descartável e aplicar somente após o predeploy gate. O nome e o timestamp da migration devem permanecer únicos e a migration original deve continuar imutável se já tiver sido aplicada em algum ambiente.

**Migration parcialmente aplicada.** Consultar o estado real somente leitura, identificar objetos criados e preparar um forward-fix idempotente. Não executar `DROP`, `TRUNCATE` ou alteração destrutiva por tentativa sem plano aprovado.

**Falha de RLS/Auth.** Interromper operações de escrita, reproduzir com usuários de teste isolados e verificar ownership/A→B isolation. Não desabilitar RLS como atalho. Se houver risco de exposição, tratar como incidente de segurança.

**Divergência de dados.** Não usar o bundle lógico como prova de integridade por si só. Calcular hashes/contagens agregadas, preservar o original e escalar a decisão de restauração. Dados Auth, Storage, secrets e objetos binários exigem procedimentos próprios.

## Validação pós-ação

O destino deve apresentar as migrations reconciliadas, RLS habilitado nas tabelas críticas, índices/triggers esperados e smoke funcional sem PII. O resultado deve registrar apenas nomes de objetos, status, contagens agregadas e hashes. A branch `main` protegida e os checks obrigatórios devem permanecer ativos.

## Escalonamento

Escalar quando houver perda de dados, possibilidade de acesso cruzado, impacto em Auth, alteração metodológica, indisponibilidade persistente, falha de backup/restauração ou necessidade de mudar de plano Supabase. Nenhum segredo de conexão ou conteúdo de tabela deve entrar em issue, commit ou reporte.
