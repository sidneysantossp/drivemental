## Objetivo

Fechar a lacuna observada no próprio diagnóstico F7-LIFECYCLE-001-DIAG: a flag opt-in era removida por `updateLocationForState()` durante a inicialização Supabase, impedindo a leitura do painel sanitizado após a transição para `/app/consulta`.

## Alterações

A flag `dm_lifecycle_diag=1` é preservada nas URLs geradas pelo roteador enquanto o modo diagnóstico está ativo. Fora da URL opt-in, o comportamento permanece inalterado e nenhum painel é renderizado.

O harness de `app-render` agora simula uma sessão sem estado local, conta cloud completa, leitura inicial cloud, reidratação assíncrona e chegada à consulta. O teste exige que a base pessoal seja válida e que o painel sanitizado permaneça observável após `updateUrl`. Também existe um caso de controle em que o perfil realmente incompleto continua inválido e a consulta permanece protegida.

## Limites arquiteturais

Esta é uma correção de observabilidade do diagnóstico, não uma classificação A–G do defeito de lifecycle. Não há migration, schema, RLS, RPC, Edge Function, service-role no frontend, operação destrutiva ou alteração no motor Dreamspell/13 Luas.

## Validação

- `git diff --check`
- `npm test`
- Todos os seis conjuntos de testes locais passaram.

## Próximo passo

Após publicação, repetir a sessão B existente quando uma autenticação autorizada estiver disponível, capturar somente os estados booleanos/classes e classificar A–G. O gate delete-account/cascade continua bloqueado até Auth, profile, estado, base, consulta e regressão estarem comprovados.
