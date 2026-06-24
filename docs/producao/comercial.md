# Preparacao comercial

## Estado atual

`billingMode` esta configurado como `external-checkout`. Enquanto as URLs reais
da Hotmart, Kiwify ou checkout equivalente nao forem preenchidas em
`runtime-config.js`, os botoes comerciais permanecem sem destino de compra. A
plataforma nao processa pagamentos e nao recebe webhook comercial.

## Decisoes obrigatorias antes da cobranca

1. Nome e identificador interno de cada plano.
2. Preco, moeda, periodicidade e eventual periodo de teste.
3. Limites de consultas e recursos incluidos.
4. Politica de renovacao, cancelamento, reembolso e inadimplencia.
5. Impostos, emissao fiscal e identificacao da empresa vendedora.
6. Provedor de pagamento e paises atendidos.
7. Canal de suporte e prazo de resposta.
8. Processo de envio de usuario e senha apos pagamento.

## Requisitos tecnicos

- checkout externo acessado em nova aba, sem dados financeiros na plataforma;
- nenhum segredo do provedor no frontend;
- acesso entregue por e-mail apos pagamento confirmado;
- portal para cancelamento e atualizacao do meio de pagamento;
- testes de compra, e-mail de acesso, login, troca de senha e suporte;
- trilha operacional fora da plataforma para compras e cancelamentos;
- ambiente de homologacao separado do ambiente real.

## Criterio para ativacao

As URLs de checkout so devem ser preenchidas depois que os requisitos legais,
textos comerciais e processo de envio de acesso estiverem aprovados.
