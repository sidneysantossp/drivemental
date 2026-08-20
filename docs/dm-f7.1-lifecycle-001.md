# F7-LIFECYCLE-001 — Reidratação de conta após nova sessão

**Estado:** correção localizada implementada em branch de PR; aguardando CI/revisão e deploy controlado.
**Autorização:** decisão arquitetural registrada no checkpoint F7.1.2.
**Data:** 20/08/2026.

## Achado

Após logout/login e carregamento do estado cloud, a rota `Nova consulta` podia exibir que a base pessoal não foi localizada, embora o perfil e a primeira leitura da conta estivessem disponíveis. O guardrail da consulta depende de `persistedPersonalBase()`, que exige `state.account.birth`, `state.account.primaryAreaId` e um Kin calculável.

O achado foi classificado pelo Arquiteto como **P0 de lifecycle**, código `F7-LIFECYCLE-001 — P0 / REIDRATAÇÃO DE CONTA APÓS NOVA SESSÃO`. Não foi classificado como falha de RLS, schema ou metodologia.

## Correção autorizada

Ao entrar na rota `home` (`/app/consulta`), o cliente reconsulta `getAccount()` e aplica somente os campos autoritativos da conta no estado de renderização: `account`, `name`, `birth` e `primaryAreaId`. A consulta é executada apenas em modo Supabase e enquanto a sessão permanece autenticada.

Em caso de indisponibilidade, o guardrail existente continua visível. Não foi adicionado fallback local, não foi ocultada a ausência de base e não foi alterado o contrato de `getAccount()`.

## Limites preservados

A alteração não modifica o motor Dreamspell/13 Luas, cálculos de Kin, selos, tons, ondas encantadas, schema, migrations, políticas RLS, Edge Function `delete-account`, billing ou projeto Supabase antigo.

## Validação

O baseline local completo passou:

- `sincronario-engine tests passed`;
- `thirteen-moons-engine tests passed`;
- `cosmic-timeline tests passed`;
- `web-platform tests passed`;
- `supabase integration tests passed`;
- `app-render tests passed`;
- `git diff --check` sem erro.

Foi adicionada uma regressão determinística para confirmar que o mapeamento autoritativo preenche `state.account.birth`, `state.account.primaryAreaId`, `state.birth` e `state.selectedAreaId` sem fallback local.

## Próxima prova controlada

Após CI e deploy aprovado, repetir a entrada da conta B em `/app/consulta`, confirmar que a base pessoal é apresentada e executar a matriz mínima de operações RLS. Somente depois registrar contagens agregadas e executar a prova autorizada de `delete-account`/cascatas, mantendo a conta B funcional durante a exclusão da conta A.
