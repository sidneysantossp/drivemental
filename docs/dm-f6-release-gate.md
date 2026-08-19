# Fase 6 — Release Gate e Evidências Finais

**Commit de implementação:** `ece7092`
**Deployment Vercel:** Production, GitHub deployment `success`
**URL do deployment:** `https://drivemental-1e5zdd8np-admsuisso-1633s-projects.vercel.app`
**Alias validado:** `https://drivemental.vercel.app/`
**Data:** 19 de agosto de 2026

## Gate pré-deploy

O gate local passou com `npm test`, `npm run build`, `scripts/migration-schema-check.sh` e `scripts/security-sanity-check.sh`. A suíte validou os testes de engine, plataforma web, integração Supabase e renderização da aplicação. O build estático foi regenerado com sucesso. O check de migrations confirmou seis migrations versionadas, timestamps únicos e configuração crítica válida. O security sanity escaneou 12 artefatos públicos e não encontrou padrões de credencial privilegiada ou caminhos de segredo versionados.

O workflow `.github/workflows/ci.yml` agora separa `predeploy` e `postdeploy`. Pull requests executam o gate pré-deploy; pushes para `main` e execuções manuais executam também o check do deployment Production e o runtime proof. O post-deploy consulta o status formal do deployment associado ao SHA no GitHub e só prossegue quando ele está `success`.

## Gate pós-deploy

| Controle | Resultado |
|---|---|
| Commit em `main` | `ece7092` |
| Deployment Production associado ao SHA | encontrado |
| Estado formal GitHub/Vercel | `success` |
| Runtime base | `https://drivemental.vercel.app/` |
| Assets `/`, `/manifest.webmanifest`, `/sw.js`, `/runtime-config.js` | 200 |
| Headers HSTS, CSP, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, X-Frame-Options | presentes |
| Runtime `environment`/`authMode`/`release` | `production` / `supabase` / `2026.08.19-f5` |
| Guardrails Edge Function | `GET 405`, `OPTIONS 200`, `POST sem JWT 401` |
| Secret scan dos corpos públicos | clear |

O runtime proof terminou com `runtime_proof=passed`. Nenhuma operação destrutiva autenticada foi executada no post-deploy gate; a exclusão autenticada já havia sido validada e limpa na Fase 5.

## Recuperabilidade

O procedimento lógico foi versionado em `scripts/backup-supabase.sh`, `scripts/restore-supabase.sh` e `scripts/verify-backup-bundle.sh`, com runbook em `docs/producao/backup-recovery-runbook.md`. A prova segura usou dois bancos PostgreSQL efêmeros locais: o dump foi gerado, os hashes foram verificados, duas linhas e um índice foram restaurados no alvo isolado, e uma tentativa contra o identificador do projeto de produção foi recusada pelo guardrail. Resultado registrado: `safe_restore_proof=passed`, `row_count=2`, `production_guard=passed`.

O controle é uma recuperação lógica do schema `public`. Auth, Storage, objetos binários, secrets, domínio e configurações externas permanecem fora do escopo automático e estão explicitamente declarados no runbook. O RPO inicial documentado é de 24 horas e o RTO alvo para o banco público em alvo isolado é de 4 horas.

## Arquivos de evidência

| Evidência | Arquivo |
|---|---|
| Headers e PWA pós-deploy | `docs/dm-f6-http-proof.md` |
| Prova segura de backup/restore | `docs/dm-f6-backup-proof.txt` |
| Runtime proof inicial | `docs/dm-f6-release-runtime-proof.txt` |
| Runbook de backup e recuperação | `docs/producao/backup-recovery-runbook.md` |
| Workflow pré/pós-deploy | `.github/workflows/ci.yml` |
