# Checklist de lancamento

Atualizado em 13 de junho de 2026.

## Pronto para beta publico

- [x] Dashboard simplificado com foco em Hoje.
- [x] Resultado, protocolo e jornada de 30 dias responsivos.
- [x] PWA instalavel e rotas diretas configuradas.
- [x] Dados locais com backup, restauracao e exclusao completa.
- [x] Consentimento local versionado.
- [x] Politica de Privacidade e Termos de Uso para a fase beta.
- [x] Planos pagos identificados como indisponiveis.
- [x] Cabecalhos de seguranca em servidor local, Netlify e Vercel.
- [x] Configuracao explicita `local-beta`.
- [x] Testes automatizados dos motores e das telas.

## Obrigatorio antes de contas reais

- [ ] Definir dominio oficial e identidade juridica do controlador.
- [x] Escolher Supabase Auth e PostgreSQL.
- [ ] Criar projetos Supabase de homologacao e producao.
- [x] Preparar migracao, RLS e Edge Functions.
- [ ] Implementar confirmacao de e-mail e recuperacao de senha.
- [ ] Implementar exportacao e exclusao de dados no servidor.
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
- [ ] Ativar `billingMode` somente depois da homologacao.

## Metodologia

- [ ] Formalizar a decisao de produto para nascidos em `29/02`.
- [ ] Concluir validacao separada de Onda Encantada, Castelo e Harmonica.
- [ ] Manter Familia Terrestre e Oraculo identificados como validacao separada.
- [ ] Reexecutar comparadores e registrar novo hash a cada alteracao do motor.

## Operacao

- [x] Iniciar repositorio Git e workflow de validacao.
- [ ] Criar repositorio remoto no GitHub e proteger a branch `main`.
- [ ] Configurar ambiente de homologacao.
- [ ] Configurar monitoramento de erros sem conteudo privado.
- [ ] Configurar alerta de indisponibilidade e rotina de backup.
- [ ] Testar navegadores, celulares e instalacao PWA no dominio oficial.
- [ ] Executar revisao juridica final dos documentos.
