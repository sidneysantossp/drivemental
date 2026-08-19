# DM-F6 — Auditoria AS-IS, Hardening Operacional e Release Gate

**Projeto:** Drive Mental  
**Baseline auditado:** `bc4b33c` — `docs: close phase 5 runtime proof`  
**Ambiente:** produção Vercel + Supabase `horsbnzwozvpboejsbww`  
**Data da auditoria:** 19 de agosto de 2026  
**Modo de execução:** somente leitura; nenhuma migration, política RLS, configuração de produção, segredo ou código funcional foi alterado durante esta etapa.

## 1. Mandato e conclusão executiva

A Fase 6 recebeu do ChatGPT Arquiteto o objetivo de transformar o baseline funcional aprovado em uma operação observável, recuperável e disciplinada, sem refatoração cosmética nem evolução funcional do Sincronário/13 Luas. A ordem de execução foi explicitamente AS-IS: primeiro inventariar e diagnosticar; somente depois aplicar as mudanças estritamente necessárias para fechar as lacunas comprovadas.

A auditoria confirma que a Fase 5 permanece fechada e que o commit `bc4b33c` está publicado em produção com deployment Vercel **Ready**. O principal risco operacional encontrado não está na lógica de exclusão de conta, que preserva os controles já provados, mas na diferença entre controles declarados no código e controles efetivamente observados em produção. Em particular, o Vercel respondeu com HSTS, porém não apresentou CSP, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` ou `X-Frame-Options`, embora esses headers estejam declarados em `vercel.json` e sejam exigidos pelos testes de fonte.

Também foi constatado que a observabilidade ainda é parcial: o painel da Edge Function possui métricas e informou 14 invocações desde o último deployment, 0% de 5xx, 70% de 4xx e nenhum erro nas últimas 24 horas, enquanto o painel de Logs do Vercel não exibiu request logs no período consultado. O projeto Supabase está no plano Free, sem backups de projeto incluídos. O workflow de CI executa testes, build e verificações de existência, mas ainda não executa schema check real, security sanity, smoke test ou runtime proof, e a branch `main` não está protegida.

## 2. Inventário do baseline

| Superfície | Estado observado | Evidência AS-IS |
|---|---|---|
| Código e branch | `main` aponta para `bc4b33c071b8008146f87832799980bacbfa6967`; GitHub CI para esse SHA terminou com sucesso. | `docs/dm-f6-github-governance.raw.txt`; [workflow CI](https://github.com/sidneysantossp/drivemental/blob/main/.github/workflows/ci.yml) |
| Deploy web | Vercel Production para `bc4b33c` em estado **Ready**; retenção de deployments habilitada. | `docs/dm-f6-vercel-evidence.txt`; [deployments Vercel](https://vercel.com/admsuisso-1633s-projects/drivemental/deployments) |
| Superfícies públicas | `/`, `/manifest.webmanifest`, `/sw.js`, `/runtime-config.js`, `/privacy.html` e `/terms.html` retornaram HTTP 200. | `docs/dm-f6-runtime-smoke.raw.txt` |
| Roteamento SPA | Caminho inexistente retornou HTTP 200 com `index.html`, devido ao fallback SPA em `vercel.json`; estados de rota são controlados no cliente por `app.js`. | `docs/dm-f6-method-probes.raw.txt`; `app.js` |
| Estados autenticados | O cliente usa Supabase Auth para cadastro, login, logout, recuperação e alteração de senha. Dashboard, onboarding, jornada, protocolo, mapa de chakras, ciclo energético, ação do dia, perfil e áreas administrativas são estados client-side protegidos por sessão e consultas RLS. | `supabase-client.js`; `app.js` |
| Edge Function | Existe uma única função publicada, `delete-account`, com três deployments registrados e URL de produção ativa. | Painel Supabase; `docs/dm-f6-vercel-evidence.txt` |
| Banco e RLS | As seis migrations versionadas do baseline de Fase 5 permanecem no repositório; Auth/RLS/ownership e cleanup foram aceitos no registro da Fase 5. | `docs/dm-f5-discovery.md`; `supabase/migrations/` |
| Runtime público | `runtime-config.js` informa `environment: "production"`, release `2026.08.19-f5`, `authMode: "supabase"`, Supabase oficial e somente chave publicável. | `docs/dm-f6-runtime-smoke.raw.txt`; `runtime-config.js` |
| Pipeline | CI atual executa `npm test`, `npm run build` e verificações estáticas de arquivos/configuração. | `.github/workflows/ci.yml` |

### 2.1 Drift local de versionamento

O workspace local contém arquivos não rastreados, incluindo `src/domain/sincronario/core/engine.js`, `constants.js`, `index.js`, `tests/core-engine.test.js`, `tests/run-core-tests.js` e documentação do motor. Esses arquivos não pertencem ao tree versionado do commit `bc4b33c`; portanto, os testes locais relacionados a esse material não constituem evidência do CI nem do deployment de produção. O frontend versionado continua referenciando os engines `src/domain/sincronario/engine.js` e `thirteen-moons-engine.js`.

Esse ponto é um **drift de baseline**, não uma autorização para adicionar arquivos automaticamente. A correção proposta é reconciliar com o Arquiteto quais arquivos pertencem ao baseline técnico, versionar somente o conjunto aprovado ou remover os artefatos locais, e então repetir a cadeia de testes a partir de uma árvore Git limpa.

## 3. Matriz de controle AS-IS

| Controle arquitetural | Estado atual comprovado | Lacuna ou risco | Correção proposta após autorização | Prova necessária |
|---|---|---|---|---|
| Identidade reprodutível do baseline | `bc4b33c` é o deployment Production/Ready e o CI desse SHA terminou com sucesso. | O workspace local tem arquivos não rastreados relevantes, o que pode produzir falsa confiança em testes locais. | Limpar/reconciliar a árvore Git e registrar a decisão sobre o motor isolado e seus testes. | `git status` limpo, `git ls-tree` do SHA, CI executado no conteúdo efetivamente publicado. |
| Superfícies públicas | Assets principais retornam 200; fallback de rota desconhecida retorna 200 com SPA. | Não há distinção HTTP entre rota inexistente e shell SPA; isso pode mascarar caminhos inválidos em monitoramento. | Manter se for comportamento intencional ou restringir fallback a rotas aprovadas, sem mudança funcional não justificada. | Smoke test de rotas válidas e inválidas; decisão registrada. |
| Autenticação | Auth usa `signUp`, `signInWithPassword`, `signOut`, recuperação e `updateUser`; funções de dados chamam `auth.getUser()`. | Não há evidência de limite de requisições ou correlação de falhas no cliente. | Adicionar apenas controles operacionais necessários, preferencialmente em camada gerenciada ou Edge Function. | Testes de falha de Auth, resposta segura e ausência de token/PII em logs. |
| Exclusão de conta | `verify_jwt = false`; handler valida JWT, deriva o próprio `sub`, restringe método e usa service role apenas no runtime server-side. Provas F5: OPTIONS 200, GET 405, POST sem JWT 401, JWT inválido 401, JWT válido 200 e cleanup. | CORS da função usa `Access-Control-Allow-Origin: *`; não há request ID ou política de idempotência explicitamente documentada. | Avaliar allowlist de origem e contrato de repetição, preservando o não aceite de identificador arbitrário. | Preflight da origem oficial, métodos, repetição segura, erros sem segredo e exclusão somente do sujeito autenticado. |
| RLS e ownership | Migrations usam `auth.uid()` e a Fase 5 provou isolamento A→B, ownership e guardrails. | Não há schema check automatizado no CI contra o projeto remoto atual. | Adicionar check não destrutivo de migrations/schema ou artefato de schema esperado. | Migrações aplicadas/convergentes, teste de acesso anônimo, ownership e isolamento. |
| Segredos no frontend | Scan do runtime e dos bundles não encontrou service role, chave privada ou JWT; `runtime-config.js` expõe somente URL/chave publicável e flags públicas. | Não existe security sanity automatizado no CI; a verificação atual é majoritariamente textual. | Criar scan determinístico para padrões de segredo e bloquear o gate em caso positivo, sem imprimir valores. | Scan em source, `dist` e artefatos publicados; resultado redigido. |
| Headers HTTP/browser | `vercel.json`, `netlify.toml` e `server.js` declaram CSP, Permissions-Policy, HSTS, X-Content-Type-Options, Referrer-Policy e X-Frame-Options. | Em produção, os probes observaram HSTS, mas não observaram CSP, X-Content-Type-Options, Referrer-Policy, Permissions-Policy ou X-Frame-Options. A configuração-fonte não equivale à prova efetiva. | Corrigir a aplicação dos headers no Vercel ou ajustar a configuração de forma compatível com o runtime real; não ampliar CSP sem necessidade. | `curl -D -` em `/`, assets, páginas legais e função; aprovação explícita por header. |
| Observabilidade frontend | UI converte falhas Auth e Supabase em mensagens controladas; existe `console.error` no login com código, status e mensagem do erro. | Não há request ID, sink central, alerta ou prova de que mensagens de SDK nunca contenham PII em produção. | Sanitizar/estruturar eventos e definir retenção/alerta; evitar logging de e-mail, payload ou token. | Falhas de frontend/Auth/Supabase com logs redigidos e correlação por release. |
| Observabilidade Vercel | Painel Logs disponível, com filtros por status, rota, método e deployment. | No período consultado, não houve request logs e os contadores Warning/Error/Fatal estavam em zero; “Enable My Logs” e “Enable Has Traces” aparecem como controles não habilitados/confirmados. | Definir a fonte mínima de logs e alertas compatível com o plano; registrar decisão se a ausência de logs for aceitável para site estático. | Caminho feliz, erro controlado e 5xx sintético em ambiente seguro, sem PII. |
| Observabilidade Edge Function | Supabase informou 14 invocações desde o último deployment, 0% de 5xx, 70% de 4xx, nenhum erro em 24h, média 35 ms e máximo 710 ms. | Métricas existem, mas não há procedimento versionado de consulta, alerta ou retenção. | Documentar consulta/alerta e classificação de 4xx esperados versus 5xx operacionais. | Dashboard ou exportação redigida; prova de erro controlado e ausência de 5xx. |
| Recuperabilidade web | Vercel mantém histórico de deployments e retenção habilitada; o projeto tem commits reprodutíveis. | Não existe runbook versionado para rollback Vercel, reversão de código ou decisão de incidente. | Criar runbook com rollback por deployment anterior, reversão Git e critérios de abortar release. | Simulação não destrutiva ou inspeção documentada de rollback; nenhum rollback de produção sem autorização. |
| Recuperabilidade banco | A interface Supabase informa que o plano Free não inclui backups de projeto; o menu oferece Point in time/Restore to new project, mas mostra Upgrade. | Não há backup gerenciado disponível no plano atual e não existe estratégia externa comprovada de backup/restauração. | Documentar limitação, exportação/backup externo autorizado e restauração em projeto novo/homologação; avaliar upgrade apenas como decisão arquitetural. | Artefato de backup em ambiente seguro, hash, procedimento de restauração não destrutivo e responsável. |
| Migrations | Script PowerShell lê senha por variável de ambiente, redige argumentos exibidos e executa `supabase db push`; seis migrations estão versionadas. | Script não possui rollback, snapshot, schema check pós-aplicação ou bloqueio de release por drift remoto. | Acrescentar passos de verificação e bloqueios sem armazenar segredos; nunca automatizar rollback destrutivo. | Migration/schema check, diff esperado e plano de reversão por migration. |
| Branch governance | CI de `bc4b33c` foi concluído com sucesso; permissões do workflow são `contents: read`. | GitHub respondeu `Branch not protected` e não há rulesets. Merge, force-push e aprovação não estão obrigatoriamente bloqueados. | Configurar proteção de `main`/ruleset com aprovação e check obrigatório, após autorização explícita. | Consulta GitHub API mostrando regra aplicada e PR de teste controlado. |
| Release gate | Existe `npm test` + `npm run build` + checks de existência/configuração. | Faltam migrations/schema check, security sanity, deployment verification, smoke test e runtime proof no CI. | Implementar o gate mínimo: `tests → build → migrations/schema check → security sanity → deployment → smoke test → runtime proof`. | Execução completa em SHA único, artefatos redigidos e falha bloqueando aprovação. |
| Idempotência e rate limit | Leituras e exclusão são chamadas via Supabase; exclusão usa o usuário do JWT e não aceita `user_id` no body como autoridade. | Não há evidência sistemática de rate limit nem contrato explícito para chamadas repetidas de operações sensíveis. | Definir escopo mínimo de idempotência/rate limit sem alterar a lógica metodológica. | Repetição sem efeito indevido, teste de concorrência controlado e resposta segura. |

## 4. Evidências técnicas coletadas

Os probes AS-IS foram realizados sem JWT válido e sem payload capaz de alterar dados. O domínio público respondeu HTTP 200 para a home, manifest, service worker, runtime config e páginas legais. `POST` e `PUT` na home responderam 405, enquanto `OPTIONS` respondeu 204. A rota inexistente respondeu 200 com o shell SPA, confirmando o fallback configurado.

A Edge Function, usando somente a chave pública obtida em memória do runtime, respondeu `GET → 405`, `OPTIONS → 200` com `ok`, `POST sem JWT → 401 unauthorized` e `POST com JWT inválido → 401` com erro controlado. Não foi criado nem excluído usuário durante a auditoria F6; a prova de JWT válido e cleanup permanece a evidência já aceita da Fase 5.

O scan dos bodies públicos não encontrou padrões de service role, chave privada ou JWT completo. O runtime identificou release `2026.08.19-f5`. Os arquivos brutos de evidência são `dm-f6-runtime-smoke.raw.txt`, `dm-f6-method-probes.raw.txt`, `dm-f6-git-integrity-2.raw.txt`, `dm-f6-github-governance.raw.txt` e `dm-f6-recovery-docs.raw.txt`; eles devem ser revisados para versionamento somente depois da decisão sobre o formato final de evidência e sobre a inclusão de metadados de ambiente.

## 5. Prioridade recomendada das lacunas

| Prioridade | Lacuna | Justificativa |
|---|---|---|
| P0 | Headers de segurança declarados não comprovados no Vercel | Controle de browser é diretamente observável e a divergência pode deixar o frontend sem CSP e outras proteções. |
| P0 | Ausência de backup gerenciado no plano Free | Recuperação de banco não está disponível como capacidade operacional comprovada. |
| P1 | Release gate incompleto | O CI atual pode aprovar uma release sem schema check, security sanity ou smoke/runtime proof. |
| P1 | Branch `main` sem proteção | O baseline pode ser alterado sem PR/revisão/check obrigatório. |
| P1 | Observabilidade Vercel e logging central não comprovados | Erros de frontend/static deployment podem não gerar evidência ou alerta utilizável. |
| P1 | Drift local de arquivos essenciais não rastreados | Testes locais podem cobrir material que não está no commit/deployment auditado. |
| P2 | Runbook de rollback, migration failure e incidente ausente | A recuperação depende de conhecimento tácito e não de procedimento verificável. |
| P2 | CORS wildcard e idempotência/rate limit da Edge Function | O fluxo está funcionalmente protegido, mas pode ser endurecido sem alterar a metodologia. |

## 6. Limite desta etapa

A matriz acima é diagnóstico, não autorização de implementação. Nenhum header, migration, RLS policy, branch rule, segredo, backup, domínio ou código funcional foi alterado como parte da auditoria. A próxima decisão requerida é a autorização do Arquiteto sobre quais lacunas devem ser fechadas primeiro e quais mudanças são aceitáveis sem reabrir a Fase 5.

## Referências

[1]: https://github.com/sidneysantossp/drivemental/blob/main/.github/workflows/ci.yml "Workflow CI versionado"
[2]: https://github.com/sidneysantossp/drivemental/blob/main/vercel.json "Configuração Vercel versionada"
[3]: https://github.com/sidneysantossp/drivemental/blob/main/supabase/config.toml "Configuração Supabase versionada"
[4]: https://drivemental.vercel.app/ "Runtime público Drive Mental"
[5]: https://horsbnzwozvpboejsbww.supabase.co/functions/v1/delete-account "Edge Function delete-account"
[6]: https://vercel.com/admsuisso-1633s-projects/drivemental/deployments "Deployments Vercel"
[7]: https://supabase.com/dashboard/project/horsbnzwozvpboejsbww/functions/delete-account "Overview da Edge Function no Supabase"
[8]: https://supabase.com/dashboard/project/horsbnzwozvpboejsbww/database/backups/scheduled "Backups do banco no Supabase"
