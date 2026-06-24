# Plataforma web do Drive Astral

## Estado atual

A primeira base de produção web é local-first:

- aplicativo responsivo;
- PWA instalável;
- service worker com navegação offline;
- armazenamento local versionado;
- exportação e importação de backup;
- página inicial de privacidade;
- configuração para Netlify e Vercel.

Os motores do Sincronário permanecem independentes da infraestrutura web.

## Publicação

### Netlify

1. Conectar o repositório.
2. Não configurar comando de build.
3. Definir o diretório de publicação como a raiz do projeto.
4. Ativar HTTPS no domínio.

O arquivo `netlify.toml` já configura o fallback das rotas.

### Vercel

1. Importar o repositório como projeto.
2. Selecionar “Other” como framework.
3. Não configurar comando de build.
4. Publicar a raiz do projeto.

O arquivo `vercel.json` preserva os arquivos estáticos e direciona rotas do app para `index.html`.

## Limite desta fase

Os dados ainda pertencem a um único navegador. O backup reduz o risco de perda, mas não substitui contas e sincronização.

## Próxima fase após validação

1. Definir autenticação.
2. Criar API e banco de dados.
3. Sincronizar leituras e eventos com consentimento.
4. Adicionar métricas de produto sem enviar conteúdo privado das leituras.
5. Atualizar a política de privacidade e os termos.
6. Somente depois avaliar pagamentos e empacotamento com Capacitor.
