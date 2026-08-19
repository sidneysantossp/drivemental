# Runbook de Resposta a Incidentes — Drive Mental

**Escopo:** disponibilidade, segurança, Auth/RLS, dados, Edge Functions, Vercel e PWA
**Responsável primário:** mantenedor operacional autorizado
**Escalonamento:** responsável técnico e ChatGPT Arquiteto conforme severidade
**Objetivo:** conter, diagnosticar, recuperar e aprender sem expor PII ou credenciais

## Classificação

| Severidade | Exemplo | Resposta inicial |
|---|---|---|
| SEV-1 | exposição de segredo/PII, acesso cruzado, corrupção de dados ou indisponibilidade ampla | conter imediatamente, congelar releases, escalar ao Arquiteto e preservar evidências redigidas |
| SEV-2 | falha de Auth/RLS, Edge Function 5xx persistente, regressão PWA ou erro de migration sem corrupção confirmada | pausar deploy, abrir incidente técnico, executar rollback/runbook específico |
| SEV-3 | erro localizado, 4xx esperado acima do padrão, degradação sem impacto amplo | registrar, correlacionar por release/request ID e corrigir no fluxo normal |

## Gatilho e triagem

O incidente começa quando um alerta, usuário, log, runtime proof ou painel indicar uma falha relevante. Registrar em UTC: horário, ambiente, SHA/deployment, superfície afetada, status HTTP, request ID quando disponível, severidade inicial e operador. Não copiar headers `Authorization`, cookies, JWTs, refresh tokens, senhas, service role, payloads pessoais ou conteúdo integral de leitura.

## Sequência de resposta

| Fase | Ação | Evidência mínima |
|---|---|---|
| Detectar | Confirmar se é reprodução, 4xx esperado ou falha real. | endpoint, status, release/SHA e request ID redigidos |
| Conter | Pausar merges/deploys; revogar segredo somente se exposição for confirmada; aplicar rollback quando indicado. | horário e ação, sem valor secreto |
| Diagnosticar | Consultar Vercel/Supabase logs e runtime proof por janela; comparar com último deployment saudável. | eventos estruturados e métricas agregadas |
| Recuperar | Executar rollback de deployment ou migration/database runbook; manter produção intacta quando restore destrutivo não for necessário. | SHA anterior, resultado dos checks |
| Validar | Executar tests, build, schema/security checks, smoke e runtime proof. | saída curada e hashes |
| Comunicar | Reportar impacto, estado, mitigação e próximo checkpoint ao responsável técnico/Arquiteto. | mensagem sem PII/segredos |
| Encerrar | Confirmar estabilidade, causa provável, follow-up e prevenção. | relatório final e ação rastreável |

## Controles de segurança

Se houver suspeita de segredo exposto, não continuar a investigação usando o valor. Interromper a coleta, revogar/rotacionar pelo canal seguro, revisar acesso e verificar histórico Git/logs. Se houver suspeita de acesso cruzado, bloquear a superfície de escrita e reproduzir ownership/RLS em contas isoladas. Se houver dados potencialmente comprometidos, limitar o relatório a categorias e contagens; não exportar linhas pessoais.

## Critérios de encerramento

O incidente só pode ser encerrado quando o serviço estiver estável no deployment identificado, os gates obrigatórios passarem, os endpoints críticos responderem conforme o contrato, não houver segredo/PII nos artefatos coletados, a causa provável estiver registrada e houver decisão sobre prevenção ou aceitação do risco residual. Incidentes SEV-1 e SEV-2 exigem revisão do responsável técnico/ChatGPT Arquiteto antes do encerramento.

## Retenção e evidências

Evidências devem ser armazenadas em local privado, com acesso restrito e retenção compatível com a política operacional definida pelo responsável. O repositório Git deve conter apenas runbooks, contratos, resultados curados e hashes; nunca logs brutos com dados pessoais ou credenciais. O request ID é um correlator operacional, não uma autorização para registrar o conteúdo do request.
