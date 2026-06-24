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
npx supabase functions deploy payment-webhook
npx supabase functions deploy delete-account
```

A migracao `supabase/migrations/202606130001_initial_schema.sql` cria as tabelas,
triggers e politicas RLS. Nao crie tabelas publicas sem RLS.

## 3. Configurar segredos

```powershell
npx supabase secrets set PAYMENT_WEBHOOK_SECRET=SEGREDO_FORTE
npx supabase secrets set PAYMENT_PRODUCT_PLAN_MAP='{"ID_PRODUTO_MENSAL":"monthly","ID_PRODUTO_GUIADO":"guided"}'
```

`SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` sao disponibilizados no ambiente
das Edge Functions. A chave `service_role` nunca deve ser colocada no frontend.

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
- plano liberado aparece apenas para o comprador correto.

Referencias oficiais:

- https://supabase.com/docs/guides/auth/passwords
- https://supabase.com/docs/guides/database/postgres/row-level-security
- https://supabase.com/docs/guides/functions
