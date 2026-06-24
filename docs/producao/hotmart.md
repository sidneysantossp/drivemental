# Hotmart ou provedor semelhante

## Fluxo adotado

1. O usuario cria e confirma a conta no Drive Astral.
2. No Perfil, abre o checkout externo.
3. Usa no checkout o mesmo e-mail da conta.
4. A Hotmart envia o evento para a Edge Function do Supabase.
5. A funcao valida o segredo, evita eventos duplicados e atualiza
   `access_entitlements`.
6. O frontend consulta a liberacao usando RLS.

## Endpoint

```text
https://SEU_PROJECT_REF.supabase.co/functions/v1/payment-webhook?hottok=SEU_SEGREDO
```

Se o provedor permitir cabecalho personalizado, prefira enviar o segredo em
`x-hotmart-hottok` em vez da URL.

## Eventos

Cadastre os eventos equivalentes a:

- compra aprovada ou completa;
- assinatura ativada ou renovada;
- cancelamento;
- reembolso;
- chargeback.

Os nomes recebidos devem ser conferidos com uma entrega real de homologacao. O
adaptador atual reconhece os nomes comuns registrados em
`supabase/functions/payment-webhook/index.ts`.

## Regras de seguranca

- a liberacao nunca e feita pelo navegador;
- somente a Edge Function utiliza `service_role`;
- o payload bruto nao e salvo;
- o e-mail e usado apenas para localizar a conta e salvo no evento como hash;
- o identificador do produto precisa existir em `PAYMENT_PRODUCT_PLAN_MAP`;
- eventos repetidos retornam sucesso sem conceder acesso novamente.

## Limitacao conhecida

Se a compra usar outro e-mail, o evento fica com status `pending_user`. Antes do
lancamento comercial, defina um atendimento para conciliacao manual ou implemente
um fluxo de reivindicacao de compra com verificacao da transacao.

Documentacao oficial:

- https://developers.hotmart.com/docs/pt-BR/
