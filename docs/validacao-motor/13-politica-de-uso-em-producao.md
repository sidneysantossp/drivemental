# Politica de uso em producao

## Objetivo

Esta politica define o uso seguro do motor apos a validacao externa. Ela nao
altera formulas e nao amplia o escopo comercial do produto.

## Uso automatico permitido

O app pode gerar automaticamente uma leitura quando:

- a data civil e valida;
- a data nao e `29/02`;
- o resultado basico possui Kin regular.

Campos autorizados no escopo parcial:

- Kin pessoal;
- selo;
- tom;
- cor;
- assinatura;
- relacoes matematicas basicas ja cobertas pelos testes existentes.

## Uso que exige aviso ou validacao separada

O app nao deve apresentar como integralmente validado:

- Familia Terrestre;
- Oraculo;
- Onda Encantada;
- Castelo;
- Harmonica;
- qualquer outro calculo avancado sem evidencia externa especifica;
- estado individual, bloqueio, excesso ou deficiencia de chakras.

Quando esses elementos forem exibidos, devem permanecer identificados como
calculos ou associacoes com validacao separada, sem equivaler a diagnostico.

## Usos proibidos

O resultado nao pode ser usado como:

- diagnostico medico ou psicologico;
- recomendacao financeira;
- orientacao juridica;
- decisao clinica;
- avaliacao objetiva do estado individual dos chakras;
- substituto de atendimento profissional.

## Politica para 29/02

`29/02` e uma data civil valida em anos bissextos, mas permanece
metodologicamente pendente no Sincronario adotado.

O produto deve:

- bloquear a geracao automatica da leitura;
- manter `SOURCE_CONFLICT / PENDING_METHOD_DECISION`;
- nao chamar a data de invalida;
- nao substituir por `28/02`;
- nao substituir por `01/03`;
- nao atribuir um Kin inventado;
- nao criar entrada no historico.

Mensagem curta:

```text
29 de fevereiro possui regra especial e ainda nao esta disponivel nesta versao.
```

Mensagem explicativa:

```text
A data 29 de fevereiro possui tratamento especial no Sincronario das 13 Luas.

Algumas fontes atribuem um Kin ao dia 29/02, enquanto a referencia metodologica utilizada pelo Drive Astral trata essa data como 0.0 Hunab Ku, exigindo uma decisao especifica.

Para evitar uma leitura incorreta, esta versao ainda nao gera automaticamente leituras para nascidos em 29/02.

Voce podera continuar quando a regra metodologica de 29/02 for definida no Drive Astral.
```

## Politica para data invalida

Datas civis impossiveis ou textos fora do contrato nao geram leitura.

Mensagem:

```text
Informe uma data de nascimento valida.
```

Essa mensagem nunca deve ser usada para um `29/02` civilmente valido.

## Transparencia na leitura

A secao `Como esta leitura foi criada` deve informar:

```text
O calculo do Kin, selo, tom, cor e assinatura foi validado externamente para datas regulares. Datas de 29 de fevereiro seguem regra especial e ainda nao sao processadas automaticamente nesta versao.
```

O SHA-256 e demais detalhes de integridade permanecem somente na documentacao
tecnica.

## Monitoramento

Qualquer alteracao futura em formula, ancora, tratamento de data ou campos
aprovados exige:

1. novo hash do motor;
2. nova execucao do comparador;
3. revisao dos casos afetados;
4. atualizacao desta politica;
5. decisao explicita de aprovacao.
