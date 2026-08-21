# F7-LEGACY-STATE-001 — comportamento operacional para perfil incompleto

**Estado:** risco legado conhecido, sem manipulação da conta congelada
**Classificação:** P1 de compatibilidade legada; não reproduzido no lifecycle atual
**Escopo:** somente comportamento operacional e orientação de recuperação

## Objetivo

Registrar o comportamento esperado caso um perfil legado incompleto volte a ser encontrado em operação. Este documento não altera a conta congelada, não cria dados de teste, não modifica o motor Dreamspell/13 Luas e não autoriza qualquer cálculo alternativo.

## Fluxo obrigatório

O sistema e a operação devem seguir esta sequência:

| Etapa | Comportamento obrigatório | Proibição associada |
|---|---|---|
| Detectar | Identificar que o perfil não possui uma base mínima válida para a jornada | Não preencher silenciosamente o perfil nem assumir valores ausentes |
| Bloquear cálculo | Não calcular resultados com uma base inválida ou incompleta | Não gerar Kin, selo, tom, onda encantada ou qualquer saída metodológica por fallback |
| Orientar recuperação | Informar ao usuário como completar ou recuperar os dados necessários por fluxo legítimo | Não pedir credenciais, tokens ou dados fora do fluxo normal |
| Reavaliar | Após a recuperação válida, permitir nova tentativa pelo fluxo normal | Não alterar resultados históricos nem contornar RLS/autorização |
| Registrar recorrência | Se o mesmo padrão reaparecer de forma recorrente, registrar incidente sanitizado para investigação | Não incluir e-mail, UUID, payload, Kin ou conteúdo pessoal no relatório |

## Critério de segurança

A ausência de uma base válida deve produzir uma interrupção segura e orientativa, nunca um cálculo aproximado. O sistema deve preferir informar que a jornada não pode ser calculada até a complementação válida dos dados necessários.

Nenhuma mudança de engine, tabela, política RLS, conta de testemunha ou conta congelada é necessária para este registro operacional. Se uma implementação futura for proposta, ela deverá passar por revisão arquitetural separada e preservar integralmente a metodologia existente.

## Relato sanitizado de incidente recorrente

Quando aplicável, o registro mínimo deve conter somente:

| Campo | Conteúdo permitido |
|---|---|
| `incident_class` | Categoria abstrata do perfil incompleto |
| `surface` | Superfície funcional afetada |
| `detected_at` | Timestamp sanitizado |
| `release` | Identidade pública da release |
| `request_correlation` | Indicador sanitizado, sem o valor do request ID |
| `user_data_included` | Sempre `false` no relatório |
| `methodology_changed` | Sempre `false` neste fluxo |
| `action` | `blocked_and_guided_recovery` |

## Restrições preservadas

A conta legada congelada continua sem qualquer alteração. O ciclo de vida atualmente aprovado permanece a evidência principal. Este documento é apenas um runbook de comportamento seguro para eventual recorrência e não constitui prova de reprodução do caso legado.

## Referência

A classificação e a orientação foram derivadas do checkpoint técnico F7 e da decisão arquitetural que autorizou documentar `detectar → não calcular com base inválida → orientar recuperação/complementação → registrar incidente se recorrente` sem manipular a conta congelada.
