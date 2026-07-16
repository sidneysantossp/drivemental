# Kit de validacao externa do motor

## Situacao

Fase A2 e consolidacao pos-validacao executadas em 2026-06-07.

O motor matematico do Drive Mental continua congelado. Nenhuma formula, regra
de Kin ou tratamento matematico de data foi alterado.

Status oficial:

```text
Motor aprovado parcialmente para datas regulares.
29/02 pendente de decisao metodologica.
Motor integral ainda nao aprovado.
```

## Resultado acumulado

| Metrica | Quantidade |
|---|---:|
| Casos totais | 120 |
| Casos com `expected` antes da Fase A2 | 17 |
| Casos analisados na Fase A2 | 100 |
| Novos casos com `expected` na Fase A2 | 96 |
| Total atual de casos com `expected` | 113 |
| Total atual de casos pendentes | 7 |
| Correspondencias exatas | 113 |
| Divergencias | 0 |
| Conflitos de fonte | 3 |
| Aguardando segunda fonte | 0 |
| Entradas invalidas tratadas pelo motor | 5 |

Os sete casos sem `expected` sao:

- tres datas `29/02` em `SOURCE_CONFLICT / PENDING_METHOD_DECISION`;
- quatro entradas invalidas sem contrato externo equivalente nas duas
  calculadoras aceitas.

## Escopo aprovado parcialmente

Para datas civis validas que nao sejam `29/02`, o produto pode calcular
automaticamente:

- Kin;
- selo;
- tom;
- cor;
- assinatura;
- relacoes basicas ja cobertas pelos testes existentes.

Os 113 casos comparaveis incluem 112 datas com Kin e uma entrada civil
impossivel com `expected` externo. Familia Terrestre, Oraculo, Onda Encantada,
Castelo, Harmonica e demais componentes avancados mantem status separado.

## Protecao de produto

Nascimentos em `29/02` nao geram leitura automatica. A interface informa que a
data e valida, mas depende de decisao metodologica. O app nao substitui a data
por `28/02` ou `01/03` e nao inventa um Kin.

Datas impossiveis recebem uma mensagem diferente:

```text
Informe uma data de nascimento valida.
```

## Fontes usadas

1. MayanKin Daily Tzolkin: Kin/data, selo, tom, cor e assinatura.
2. Galactic Ark Dreamspell Kin Calculator: segunda fonte independente para os
   mesmos campos.
3. Law of Time - 13 Moon Calendar FAQ: base metodologica para `29/02`, sem uso
   como fonte de resultado por data.

Calculators Ocean permanece rejeitado como fonte de Kin e nao foi usado para
preencher nenhum `expected` da Fase A2.

## Evidencia da Fase A2

As duas fontes aceitas usam algoritmos publicos diferentes:

- MayanKin publica uma contagem por ano, mes e dia com anos de 365 dias.
- Galactic Ark publica uma contagem por dia juliano, ancora independente e
  remocao explicita de `29/02`.

Os dois algoritmos foram transcritos separadamente em
`tests/apply-sincronario-phase-a2-evidence.js`. Eles concordaram nos 96 casos
regulares pendentes. O script nao importa o motor do Drive Mental.

## Integridade do motor

SHA-256 atual de `src/domain/sincronario/engine.js`:

```text
617686B2CBD2CB8D0DFA87B525835831D29E2B0E54D99E8CB31F989D6B79D961
```

O valor e identico ao snapshot congelado.

## Como executar

```text
npm.cmd run validation:generate
npm.cmd run validation:a1
npm.cmd run validation:a2
npm.cmd run validation:policy
npm.cmd run validation:compare
npm.cmd test
```

`validation:generate` apaga o preenchimento existente. Para reconstruir o
estado atual, execute A1, A2 e `validation:policy` nessa ordem antes do
comparador.

## Documentos de consolidacao

- `12-status-de-aprovacao-do-motor.md`;
- `13-politica-de-uso-em-producao.md`.

As pendencias sao a decisao metodologica de `29/02`, os quatro contratos
externos de entrada invalida e a validacao externa dos componentes derivados.
