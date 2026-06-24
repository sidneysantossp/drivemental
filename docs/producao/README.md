# Preparacao para producao

## Estado atual

A aplicacao continua em modo `local-beta` enquanto as chaves publicas do
Supabase nao forem preenchidas. O codigo para contas sincronizadas ja esta
preparado e e ativado com `authMode: "supabase"`.

## Arquitetura alvo

1. Codigo e validacao continua no GitHub.
2. Frontend estatico servido por CDN com HTTPS.
3. Supabase Auth com confirmacao de e-mail e recuperacao de senha.
4. Supabase PostgreSQL com RLS para perfis, leituras e progresso.
5. Supabase Edge Functions para exclusao e webhook de pagamento.
6. Hotmart ou provedor semelhante como checkout externo.
6. Monitoramento de disponibilidade e erros sem registrar o conteudo privado
   das leituras.

## Regras de configuracao

- `runtime-config.js` contem apenas configuracao publica.
- Segredos ficam no ambiente do backend e seguem `.env.example`.
- O frontend somente muda para `authMode: "supabase"` quando migracao, Auth,
  SMTP, exclusao de conta e testes de autorizacao estiverem ativos.
- O frontend somente muda para `billingMode: "external-checkout"` quando checkout,
  cancelamento, webhooks e reconciliacao estiverem validados.
- A origem da API deve ser adicionada ao `connect-src` da politica CSP no
  servidor, Netlify e Vercel.

## Ordem de implantacao

1. Criar o repositorio remoto no GitHub.
2. Provisionar um projeto Supabase de homologacao.
3. Aplicar a migracao e publicar as Edge Functions.
4. Configurar Auth, URLs de redirecionamento e SMTP.
5. Executar testes de isolamento entre usuarios.
6. Publicar homologacao com `billingMode: "disabled"`.
7. Validar exclusao, exportacao, recuperacao e backups.
8. Somente depois configurar pagamentos e producao.

## Bloqueios externos

Para concluir a integracao real ainda sao necessarios:

- dominio oficial;
- projeto e chaves publicas do Supabase;
- repositorio remoto no GitHub;
- produto e webhook na Hotmart;
- definicao dos planos, precos, impostos e politica de cancelamento;
- identificacao juridica do controlador para a politica de privacidade.
