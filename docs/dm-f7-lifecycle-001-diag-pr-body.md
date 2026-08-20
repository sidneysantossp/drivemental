## Objetivo

Adicionar instrumentação diagnóstica sanitizada para localizar a perda de estado em `F7-LIFECYCLE-001`, conforme diretiva do Arquiteto. O diagnóstico é opt-in por `dm_lifecycle_diag=1` e não altera o comportamento do runtime normal.

## O que foi alterado

A camada Supabase agora pode enviar ao cliente somente estados booleanos e classes fechadas para Auth, consulta do perfil, presença dos campos de origem e mapeamento da conta. O cliente registra a aplicação da conta autenticada, o estado após aplicação e a validade da base pessoal. Um painel temporário, visível apenas com a flag diagnóstica, mostra somente esses estados sanitizados.

Foi adicionada uma regressão determinística no harness de `app-render` para validar a presença do painel, a validade booleana da base e a ausência de valores de conta no snapshot diagnóstico. O plano de diagnóstico versionado documenta o contrato e os limites.

## Limites

Não há migration, RPC, Edge Function, mudança de RLS, alteração de schema, uso de service-role no frontend, operação destrutiva, alteração do motor Dreamspell/13 Luas ou mudança de cálculo. O sink diagnóstico é nulo fora da flag opt-in e falhas de telemetria não interrompem o fluxo funcional.

## Validação

- `git diff --check`
- `npm test`
- Todos os testes locais passaram, incluindo engine, Supabase integration e app render.

## Próximo passo

Após o merge e deploy, reproduzir o bug com logout/login novo da conta B e registrar apenas o painel sanitizado. Se a camada E/F/G for identificada, a correção localizada fica autorizada conforme a diretiva arquitetural; se surgir indício de RLS/consulta, nenhuma policy será alterada sem nova decisão.
