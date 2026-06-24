# Checklist de lancamento

Atualizado em 24 de junho de 2026.

## Pronto para beta publico

- [x] Dashboard simplificado com foco em Hoje.
- [x] Resultado, protocolo e jornada de 30 dias responsivos.
- [x] PWA instalavel e rotas diretas configuradas.
- [x] Dados locais com backup, restauracao e exclusao completa.
- [x] Consentimento local versionado.
- [x] Politica de Privacidade e Termos de Uso para a fase beta.
- [x] Planos pagos preparados para checkout externo.
- [x] Cabecalhos de seguranca em servidor local, Netlify e Vercel.
- [x] Configuracao explicita `production` com Supabase publico.
- [x] Testes automatizados dos motores e das telas.

## Obrigatorio antes de contas reais

- [ ] Definir dominio oficial e identidade juridica do controlador.
- [x] Escolher Supabase Auth e PostgreSQL.
- [x] Criar projeto Supabase inicial.
- [x] Preparar migracao, RLS e Edge Functions.
- [x] Implementar confirmacao de e-mail e recuperacao de senha no frontend.
- [x] Implementar exclusao de dados no servidor via Edge Function.
- [ ] Homologar configuracao de Auth, e-mail e URLs no painel Supabase.
- [ ] Aplicar migracao no Supabase remoto.
- [ ] Publicar Edge Functions no Supabase remoto.
- [x] Preparar script de deploy do Supabase sem gravar segredos no repositorio.
- [ ] Testar isolamento de dados entre usuarios.
- [ ] Definir politica de backup, retencao e resposta a incidentes.
- [ ] Atualizar a Politica de Privacidade com operadores e bases legais reais.

## Obrigatorio antes de cobranca

- [ ] Definir empresa vendedora, precos, moeda e impostos.
- [ ] Definir limites e beneficios de cada plano.
- [ ] Aprovar cancelamento, reembolso e inadimplencia.
- [x] Definir Hotmart ou checkout externo equivalente.
- [x] Preparar webhook assinado e idempotente no Supabase.
- [ ] Criar produtos, URLs de checkout e webhook na Hotmart.
- [ ] Testar renovacao, falha, estorno, cancelamento e reativacao.
- [x] Ativar `billingMode` externo sem URLs reais de checkout.

## Metodologia

- [ ] Formalizar a decisao de produto para nascidos em `29/02`.
- [ ] Concluir validacao separada de Onda Encantada, Castelo e Harmonica.
- [ ] Manter Familia Terrestre e Oraculo identificados como validacao separada.
- [ ] Reexecutar comparadores e registrar novo hash a cada alteracao do motor.

## Operacao

- [x] Iniciar repositorio Git e workflow de validacao.
- [x] Criar repositorio remoto no GitHub.
- [ ] Proteger a branch `main`.
- [ ] Configurar ambiente de homologacao.
- [ ] Configurar monitoramento de erros sem conteudo privado.
- [ ] Configurar alerta de indisponibilidade e rotina de backup.
- [ ] Testar navegadores, celulares e instalacao PWA no dominio oficial.
- [ ] Executar revisao juridica final dos documentos.
