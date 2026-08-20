# F7-LIFECYCLE-001-DIAG — Plano de instrumentação sanitizada

## Objetivo

Identificar em qual estágio a base pessoal se perde após logout/login, sem registrar nome, e-mail, UUID, data, área, payload, JWT, mensagem de erro bruta ou qualquer dado pessoal. A instrumentação será acessível somente quando a URL contiver `dm_lifecycle_diag=1`; no runtime normal não haverá painel nem sink ativo.

## Pipeline observado

| Estágio | Saída permitida |
|---|---|
| Auth | `auth_get_user_status`, `authenticated_user_present` |
| Consulta de perfil | `profile_query_status`, `profile_row_present` |
| Campos de origem | `source_birth_present`, `source_primary_area_present` |
| Mapeamento | `mapped_account_present`, `mapped_birth_present`, `mapped_primary_area_present` |
| Aplicação | `apply_authenticated_account_called`, `state_account_present`, `state_birth_present`, `state_primary_area_present` |
| Consulta | `consultation_base_valid` |

Os valores permitidos são booleanos e classes fechadas, como `success`, `error`, `not_run` e `skipped`. Não serão emitidos valores de campos, identificadores, e-mails, textos de erro ou conteúdo de leitura.

## Critérios

A reprodução será feita com a conta técnica B em sessão Auth nova, preservando A e B e sem executar delete-account. Se o diagnóstico apontar claramente para uma camada E/F/G conforme a diretiva do Arquiteto, a correção localizada nessa camada fica autorizada com teste de regressão. Se apontar para RLS/consulta (B/C), nenhuma policy será alterada; o achado será reportado ao Arquiteto.

## Limites

Não haverá migration, RPC, Edge Function nova, mudança de RLS, alteração do motor Dreamspell/13 Luas, mudança de schema, uso de service-role no frontend ou operação destrutiva. A instrumentação será publicada por PR com CI verde.
