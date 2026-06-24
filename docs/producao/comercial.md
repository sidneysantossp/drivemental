# Preparacao comercial

## Estado atual

`billingMode` esta configurado como `external-checkout`. Enquanto as URLs reais
da Hotmart nao forem preenchidas em `runtime-config.js`, os botoes comerciais
permanecem sem destino de compra. A liberacao de acesso acontece somente pelo
webhook no Supabase.

## Decisoes obrigatorias antes da cobranca

1. Nome e identificador interno de cada plano.
2. Preco, moeda, periodicidade e eventual periodo de teste.
3. Limites de consultas e recursos incluidos.
4. Politica de renovacao, cancelamento, reembolso e inadimplencia.
5. Impostos, emissao fiscal e identificacao da empresa vendedora.
6. Provedor de pagamento e paises atendidos.
7. Canal de suporte e prazo de resposta.

## Requisitos tecnicos

- checkout externo acessado somente depois da criacao da conta;
- webhooks assinados e idempotentes;
- nenhum segredo do provedor no frontend;
- estado de acesso derivado do banco, nunca de `localStorage`;
- portal para cancelamento e atualizacao do meio de pagamento;
- testes de renovacao, falha, estorno, cancelamento e reativacao;
- trilha de auditoria sem armazenar dados completos de cartao;
- ambiente de homologacao separado do ambiente real.

## Criterio para ativacao

As URLs de checkout so devem ser preenchidas depois que os requisitos legais e
tecnicos estiverem aprovados e o fluxo completo tiver sido testado com transacoes
de homologacao.
