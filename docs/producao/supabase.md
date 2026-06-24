# Supabase

## 1. Criar e configurar o projeto

1. Use o projeto Supabase informado para homologacao inicial.
2. Em Authentication, mantenha e-mail e senha habilitados.
3. Ative confirmacao de e-mail.
4. Configure o Site URL e os Redirect URLs para o dominio final e localhost.
5. Configure SMTP proprio antes do lancamento publico.

## 2. Aplicar banco e funcoes

Com a Supabase CLI autenticada:

```powershell
npx supabase link --project-ref jjnmxkfumiwoeyyregzb
npx supabase db push
npx supabase functions deploy delete-account
```

Ou use o script do projeto:

```powershell
$env:SUPABASE_DB_PASSWORD="SENHA_DO_BANCO"
.\scripts\deploy-supabase.ps1
```

Para aplicar apenas as migrations do banco, sem publicar Edge Functions:

```powershell
$env:SUPABASE_DB_PASSWORD="SENHA_DO_BANCO"
.\scripts\deploy-supabase.ps1 -SkipFunctions
```

A migracao inicial ja foi aplicada no projeto remoto em 24 de junho de 2026. A
migration `202606240001_remove_payment_integration.sql` remove as tabelas da
integracao antiga de pagamento. O deploy da Edge Function de exclusao ainda
depende de `npx supabase login` com uma conta que tenha permissao de owner/editor
no projeto.

A migracao `supabase/migrations/202606130001_initial_schema.sql` cria as tabelas,
triggers e politicas RLS. Nao crie tabelas publicas sem RLS.

## 3. Configurar segredos

Nao ha segredo de pagamento para configurar no Supabase. `SUPABASE_URL` e
`SUPABASE_SERVICE_ROLE_KEY` sao usados apenas pela Edge Function de exclusao de
conta. A chave `service_role` nunca deve ser colocada no frontend.

## 4. Ativar o frontend

Edite `runtime-config.js` no ambiente publicado:

```js
authMode: "supabase",
supabaseUrl: "https://jjnmxkfumiwoeyyregzb.supabase.co",
supabasePublishableKey: "chave anon/public do projeto",
```

A publishable key pode estar no navegador porque o acesso aos dados e protegido
pelas politicas RLS. A chave administrativa nao pode estar no navegador.

## 5. Validar antes de producao

- cadastro e confirmacao de e-mail;
- login e logout;
- recuperacao e alteracao de senha;
- usuario A nao acessa dados do usuario B;
- leituras, jornada, protocolo e eventos sincronizam;
- exclusao remove o usuario do Auth e as linhas relacionadas;

Referencias oficiais:

- https://supabase.com/docs/guides/auth/passwords
- https://supabase.com/docs/guides/database/postgres/row-level-security
- https://supabase.com/docs/guides/functions
