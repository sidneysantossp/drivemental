# F7 — Organizational Go-Live Readiness

**Projeto:** Drive Mental
**Fase:** F7 — Go-live controlado, ciclo de vida de dados e operação real
**Estado técnico:** `F7 TECHNICAL RELEASE CANDIDATE — PROMOTED / APPROVED`
**Estado de lançamento público:** `BLOCKED BY ORGANIZATIONAL/LEGAL & BACKUP EVIDENCE`

## 1. Objetivo e limite deste documento

Este documento prepara o próximo checkpoint de prontidão organizacional após a promoção técnica do F7 RC. Ele separa evidência já produzida pelo sistema de decisões que dependem do responsável organizacional, jurídico ou operacional. Nenhum campo decisório é preenchido por inferência técnica.

O beta técnico/controlado permanece autorizado. Este documento **não autoriza** campanha pública, aquisição aberta deliberada, cobrança, declaração de go-live público ou descomissionamento do projeto Supabase antigo.

A matriz técnica de retenção, controlador e canal continua sendo a referência de análise AS-IS e de decisões necessárias: [`dm-f7.2-retention-controller-channel-matrix.md`](./dm-f7.2-retention-controller-channel-matrix.md).

## 2. Estado formal já aceito

| Controle | Estado aceito | Limite atual |
|---|---|---|
| F7.1.2 ownership/RLS | **APROVADA** | Nenhuma nova alteração de schema/RLS é necessária neste checkpoint |
| F7.2-EXPORT-001 | **RESOLVED** | `Baixar backup local` mantém escopo parcial e honesto; exportação sincronizada integral continua P1 futura |
| F7.2-DELETE-001 | **RESOLVED** | Nenhuma repetição destrutiva de conta é necessária |
| F7.3 admin auditability | **CONCLUÍDA** | Auditoria de mutações administrativas permanece ativa |
| F7-LEGACY-SUPABASE-001 | **RESOLVED / READY FOR FUTURE DECOMMISSION DECISION** | O projeto antigo permanece preservado como contingência |
| SLO/monitoramento técnico | **APROVADO como baseline provisório** | Ownership operacional e percentuais formais continuam pendentes |
| F7.2-RETENTION-001 | **OPEN** | Depende de decisões organizacionais e jurídicas reais |
| F7-BACKUP-PROD-001 | **EXECUTION REPORTED / VERIFICATION PENDING** | Falta evidência sanitizada suficiente para `verification=passed` |

## 3. Decisões organizacionais requeridas

A tabela abaixo deve ser preenchida pelo responsável competente. O agente técnico não deve completar os campos com suposições, modelos jurídicos ou valores padrão.

| Decisão | Resposta aprovada pelo responsável | Evidência sanitizada esperada | Estado |
|---|---|---|---|
| Entidade controladora formal | **PENDENTE — preencher fora do agente técnico** | Registro ou aprovação interna correspondente | OPEN |
| Situação do encarregado e contato | **PENDENTE — preencher fora do agente técnico** | Nome institucional ou função e canal aprovado, sem dados desnecessários | OPEN |
| Bases legais por finalidade e categoria | **PENDENTE — preencher fora do agente técnico** | Matriz aprovada pelo responsável jurídico/organizacional | OPEN |
| Períodos de retenção por categoria | **PENDENTE — preencher fora do agente técnico** | Tabela aprovada, incluindo conta, perfil, leituras, consentimentos, auditoria e logs técnicos | OPEN |
| Tratamento de backups e cópias locais | **PENDENTE — preencher fora do agente técnico** | Regra aprovada para cópia local, armazenamento externo e exclusão/expiração | OPEN |
| Fornecedores, transferências e contratos | **PENDENTE — preencher fora do agente técnico** | Inventário e aprovação operacional/jurídica | OPEN |
| Canal operacional de direitos | **PENDENTE — preencher fora do agente técnico** | Canal que recebe, registra, autentica, classifica, responde e encerra solicitações | OPEN |
| Texto final de Privacy/Terms | **PENDENTE — preencher fora do agente técnico** | Versão aprovada e referência de publicação | OPEN |
| Responsável por incidentes | **PENDENTE — decisão operacional** | Nome institucional/função e escala de responsabilidade | OPEN |
| Canal de escalonamento | **PENDENTE — decisão operacional** | Canal aprovado e procedimento de escalonamento | OPEN |
| Retenção efetiva de logs | **PENDENTE — decisão operacional** | Configuração/contrato aplicável e responsável por revisão | OPEN |
| Aprovação formal dos objetivos SLO | **PENDENTE — decisão operacional** | Registro de aprovação dos percentuais como objetivos, não SLA comercial | OPEN |

## 4. Prova sintética do canal de direitos

A prova só deve ser executada depois que o canal real, o responsável e o processo forem definidos. Até lá, não criar um canal fictício nem registrar dados pessoais em repositório ou checkpoint.

Quando autorizada pelo responsável, a prova deve usar uma testemunha sintética e relatar apenas metadados sanitizados, seguindo esta sequência:

| Etapa | Resultado mínimo esperado | Evidência permitida no checkpoint |
|---|---|---|
| Solicitação recebida | Pedido aceito pelo canal definido | Timestamp sanitizado e identificador não reversível |
| Triagem | Solicitação classificada | Categoria e status, sem conteúdo pessoal |
| Verificação de identidade | Identidade verificada pelo procedimento aprovado | Resultado booleano e método abstrato |
| Tratamento | Pedido encaminhado ao responsável correto | Status operacional e tempo decorrido |
| Resposta | Resposta emitida pelo canal aprovado | Resultado e timestamp sanitizados |
| Encerramento | Caso fechado com trilha mínima | Status final e retenção conforme decisão aprovada |

O agente técnico não deve escolher o canal, a base legal, o prazo de resposta ou o prazo de retenção.

## 5. Evidência sanitizada do backup de produção

O controle `F7-BACKUP-PROD-001` só pode mudar para verificado quando o operador ou mecanismo responsável fornecer os metadados mínimos do runbook, sem dump, hash real, nome de arquivo, connection string, conteúdo, credenciais ou dados pessoais.

| Campo | Valor esperado | Estado |
|---|---|---|
| `logical_backup_execution` | `confirmed` | PENDENTE |
| `production_source` | `confirmed` | PENDENTE |
| `runbook_version` | Versão usada pelo operador | PENDENTE |
| `bundle_verification` | `passed` | PENDENTE |
| `manifest_verification` | `passed` | PENDENTE |
| `secret_scan` | `clear` | PENDENTE |
| `external_storage` | `confirmed` | PENDENTE |
| `restore_target` | `not_production` | PENDENTE |
| `pii_or_credentials_in_evidence` | `false` | PENDENTE |

A evidência deve permanecer sanitizada e não deve ser anexada ao repositório. O runbook operacional é [`dm-f7-logical-backup-runbook.md`](./dm-f7-logical-backup-runbook.md).

## 6. Critério de fechamento do gate

O gate organizacional somente poderá ser solicitado para fechamento quando houver, simultaneamente, decisões aprovadas para controlador, encarregado/canal, bases legais, retenção, fornecedores/transferências e textos públicos; prova sanitizada do canal de direitos; evidência sanitizada verificável do backup; e ownership operacional com escalonamento, retenção de logs e aprovação dos objetivos SLO.

Até que esses itens sejam preenchidos e verificados, a classificação obrigatória permanece:

> **F7 TECHNICAL RELEASE CANDIDATE — APPROVED** para beta técnico/controlado.
> **PUBLIC GO-LIVE — BLOCKED BY ORGANIZATIONAL/LEGAL & BACKUP EVIDENCE.**

## 7. Restrições preservadas

O projeto Supabase antigo permanece preservado e não deve receber novas escritas ou migrations. A conta legada congelada não deve ser manipulada. A testemunha preservada não deve ser excluída ou reutilizada fora de prova autorizada. Nenhuma mudança metodológica Dreamspell/13 Luas, nenhuma alteração de schema/RLS fora de escopo, nenhuma mudança de billing e nenhuma decisão jurídica deve ser inferida neste checkpoint.

## Referências internas

- [`dm-f7-final-technical-checkpoint.md`](./dm-f7-final-technical-checkpoint.md)
- [`dm-f7.2-retention-controller-channel-matrix.md`](./dm-f7.2-retention-controller-channel-matrix.md)
- [`dm-f7-logical-backup-runbook.md`](./dm-f7-logical-backup-runbook.md)
- [`dm-f7-slo-monitoring-baseline.md`](./dm-f7-slo-monitoring-baseline.md)
