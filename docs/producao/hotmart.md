# Checkout externo

## Fluxo adotado

1. O usuario escolhe um plano no site.
2. A plataforma abre uma pagina externa de checkout, como Hotmart ou Kiwify.
3. Todo pagamento, parcelamento, reembolso e nota fiscal fica fora do Drive Mental.
4. Apos a confirmacao do pagamento, o usuario recebe por e-mail o usuario e a senha de acesso.
5. O Drive Mental apenas autentica a pessoa com as credenciais recebidas.

## O que nao sera integrado

- Nao havera webhook de pagamento no Supabase.
- Nao havera liberacao automatica de plano dentro do frontend.
- Nao serao recebidos dados financeiros, status de compra, cartao ou assinatura.
- Nao sera necessario salvar eventos de pagamento no banco da plataforma.

## Configuracao do frontend

Preencha apenas URLs publicas de checkout em `runtime-config.js`:

```js
checkoutUrls: {
  monthly: "https://pay.hotmart.com/SEU_CHECKOUT",
  guided: "https://pay.kiwify.com.br/SEU_CHECKOUT",
}
```

Se usar Kiwify como provedor principal, altere tambem:

```js
paymentProvider: "kiwify"
```

## Operacao de acesso

O acesso pago deve ser criado fora do fluxo da plataforma, pelo processo
operacional definido no provedor de venda ou pelo atendimento. O e-mail enviado
ao comprador precisa conter:

- URL de acesso do Drive Mental;
- usuario ou e-mail de login;
- senha inicial ou link de definicao de senha;
- canal de suporte para problemas de acesso.

## Cuidados

- Mantenha os textos do checkout alinhados aos Termos de Uso.
- Nao prometa liberacao automatica se o acesso for manual.
- Tenha um processo para troca de senha e reenvio de acesso.
- Rotacione credenciais compartilhadas durante configuracao.
