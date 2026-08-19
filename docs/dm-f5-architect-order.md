# DM-F5 — Ordem Arquitetural e Evidências do Arquiteto

**Data de captura:** 2026-08-19
**Projeto:** Drive Mental / Mental Saúde
**Conversação de origem:** Validação da Fase 4, projeto Mental Saúde

## Decisão formal

A Fase 4 — Produção e Runtime Proof foi formalmente **APROVADA** pelo ChatGPT Arquiteto. O gate **F4 → F5 está LIBERADO**.

A infraestrutura produtiva oficial ficou definida como:

| Camada | Recurso |
|---|---|
| Frontend de produção | `https://drivemental.vercel.app/` |
| Backend Supabase de produção | `https://horsbnzwozvpboejsbww.supabase.co` |
| Região do banco | South America (São Paulo), `sa-east-1` |
| Projeto Supabase | `drivemental`, ID `horsbnzwozvpboejsbww` |
| Variáveis de cliente | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` |

O Arquiteto registrou que a anon key pode existir no frontend, mas `service_role`, secrets administrativos e credenciais equivalentes nunca podem ser enviados ao bundle Vite/browser. A fronteira de segurança do acesso direto pelo cliente é **RLS + policies**.

## Ordem da Fase 5 — Production Data & Security Baseline

A Fase 5 deve materializar o modelo de dados em produção e provar a segurança do Supabase, sem iniciar novas features, redesign, conteúdo, analytics, monetização ou otimizações de UX, e sem alterar a metodologia astrológica.

1. Executar discovery do banco antes de alterar produção. Comparar migrations do repositório, schema esperado pelo código atual, schema existente em produção, tabelas, views, functions, triggers, enums, policies, uso de `auth.users` e dependências do frontend em `.from(...)`, RPCs e funções server-side. Não criar tabelas manualmente pelo Dashboard.
2. Definir migrations versionadas como única fonte de verdade. Toda alteração estrutural deve estar no repositório antes da aplicação em produção; não são permitidos schema/policies apenas no Dashboard, SQL produtivo sem migration correspondente ou correções manuais não registradas.
3. Aplicar somente as migrations necessárias e comprovar convergência repository → production, sem refatorações oportunistas.
4. Fechar o perímetro RLS para cada tabela exposta, verificando RLS, anon, autenticado, isolamento entre usuários e operações INSERT/SELECT/UPDATE/DELETE, sempre com least privilege.
5. Auditar identidade e ownership, demonstrando `auth.uid() = owner_id` ou mecanismo equivalente tecnicamente justificado.
6. Auditar secrets e bundle frontend, procurando `service_role`, senha do banco, JWT signing secret, access tokens administrativos, secrets de terceiros, credenciais hardcoded e `.env` versionado. Qualquer segredo privilegiado no bundle é bloqueante.
7. Executar Runtime Security Proof: operação legítima, bloqueio sem autenticação quando aplicável, usuário A acessando seus dados, tentativa A→B bloqueada, acesso direto com anon key respeitando RLS e ausência de privilégios administrativos no browser.

## Critérios de aceite

A Fase 5 só será concluída com evidência de: schema correspondente às migrations; ausência de drift não documentado; RLS em todas as superfícies aplicáveis; matriz de policies; nenhum segredo privilegiado no frontend; testes positivos e negativos de autorização; aplicação continuando funcional; e relatório contendo comandos/SQL executados, arquivos alterados e provas de runtime.

## Entregável obrigatório

Produzir **DM-F5-001 — Production Data & Security Baseline Report**, contendo estado encontrado, drift, migrations aplicadas, inventário de tabelas/RLS, matriz role × operação × recurso, evidências de autorização, auditoria de secrets, arquivos/commits, estado final do runtime e riscos/pendências.

## Status operacional

Fase 4 encerrada formalmente. Fase 5 autorizada para execução imediata.
