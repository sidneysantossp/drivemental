# GitHub

## Estado no projeto

- repositorio Git local iniciado na branch `main`;
- workflow `.github/workflows/ci.yml` criado;
- Dependabot configurado para GitHub Actions;
- arquivos de ambiente, cache do Supabase e capturas de QA ignorados.

## Criar o repositorio remoto

O GitHub CLI nao esta instalado nesta maquina. Crie um repositorio vazio no
GitHub, sem README ou `.gitignore`, e execute:

```powershell
git remote add origin https://github.com/SEU_USUARIO/drive-astral.git
git push -u origin main
```

O workflow executara `npm test` em cada push e pull request.

## Protecao recomendada da branch

- exigir pull request para `main`;
- exigir o check `test`;
- bloquear force push;
- exigir revisao antes de merge;
- conceder ao workflow apenas `contents: read`;
- armazenar segredos somente em GitHub Environments ou no Supabase.

Nenhuma chave `service_role`, senha do banco ou segredo da Hotmart deve ser
adicionada ao repositorio.
