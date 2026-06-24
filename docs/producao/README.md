# Preparacao para producao

## Estado atual

A aplicacao ja aponta para o projeto Supabase informado e esta com
`authMode: "supabase"` no frontend. A chave publica anon pode ficar no
navegador; a chave `service_role` continua proibida no codigo e deve ser
mantida apenas no ambiente seguro do Supabase.

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
- O frontend usa `authMode: "supabase"` e depende da migracao, Auth, SMTP,
  exclusao de conta e testes de autorizacao no projeto remoto.
- O frontend esta em `billingMode: "external-checkout"`, mas os botoes de
  compra so abrem checkout quando as URLs reais forem preenchidas.
- A origem da API deve ser adicionada ao `connect-src` da politica CSP no
  servidor, Netlify e Vercel.

## Ordem de implantacao

1. Criar o repositorio remoto no GitHub.
2. Provisionar um projeto Supabase de homologacao.
3. Aplicar a migracao e publicar as Edge Functions.
4. Configurar Auth, URLs de redirecionamento e SMTP.
5. Executar testes de isolamento entre usuarios.
6. Publicar homologacao e testar `billingMode: "external-checkout"` sem URLs de
   compra ate a Hotmart estar homologada.
7. Validar exclusao, exportacao, recuperacao e backups.
8. Somente depois configurar pagamentos e producao.

## Bloqueios externos

Para concluir a integracao real ainda sao necessarios:

- dominio oficial;
- migracao aplicada no Supabase remoto;
- Edge Functions publicadas no Supabase remoto;
- produtos, URLs de checkout e webhook na Hotmart;
- definicao dos planos, precos, impostos e politica de cancelamento;
- identificacao juridica do controlador para a politica de privacidade.
