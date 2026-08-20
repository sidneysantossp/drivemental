## Objetivo

Implementar a diretriz arquitetural de observabilidade persistente para F7-LIFECYCLE-001-DIAG. A query diagnóstica passa a ser somente o gatilho inicial; o estado opt-in fica preso à aba por `sessionStorage`, atravessa a normalização do router e é limpo no logout.

## Alterações

O bootstrap aceita `?f7diag=1` e, por compatibilidade controlada, o marcador legado `?dm_lifecycle_diag=1`. Quando ativado, grava somente um booleano de habilitação em `sessionStorage`. O buffer mantém apenas eventos fechados, statuses e flags booleanas sanitizadas. A query pode desaparecer após a normalização da rota sem desmontar o observador.

O painel continua anexado ao shell raiz da aplicação, fora do componente de consulta. O logout limpa o latch, o buffer e o painel. A opção `?f7diag=0` também limpa ambos os itens de sessão.

## Regressões

O harness verifica que o latch é ativado, o buffer sanitizado persiste, a rota pode perder a query sem perder o painel e o logout remove o diagnóstico. Também mantém a regressão de sessão vazia → conta cloud completa → reidratação → consulta válida e o controle de perfil incompleto bloqueado.

## Limites arquiteturais

Não há criação de conta, reautenticação, mudança de senha, injeção de token, migration, schema, RLS, RPC, Edge Function, service-role no frontend ou alteração do motor Dreamspell/13 Luas. A conta B e `delete-account/cascade` permanecem preservados/bloqueados até a classificação A–G.

## Validação

- `git diff --check`
- `npm test`
- Seis conjuntos de testes locais aprovados.

## Próximo passo

Após o deploy, reusar uma sessão B legítima se existir. Se não existir, usar somente o fluxo Magic Link/OTP do Supabase para a conta B existente com `shouldCreateUser=false`, sem reset de senha e sem registrar e-mail, OTP, token ou sessão. Em seguida, capturar a cadeia A–G sanitizada.
