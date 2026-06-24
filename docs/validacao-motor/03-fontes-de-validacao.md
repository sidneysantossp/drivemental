# Fontes de validacao

O cadastro estruturado esta em:

```text
tests/fixtures/sincronario-validation-sources.json
```

## Fontes aceitas para Kin por data

| ID | Fonte | Metodo observado | Estado |
|---|---|---|---|
| SOURCE-004 | MayanKin Daily Tzolkin | Ano/mes/dia, sem avancar em 29/02 | reviewed_compatible |
| SOURCE-007 | Galactic Ark Dreamspell Kin Calculator | Dia juliano, ancora independente, remocao de 29/02 | reviewed_compatible |

As duas fontes declaram compatibilidade com Dreamspell / Sincronario das 13
Luas e publicam o codigo usado pelo calculador.

## Cobertura

- Fase A1: concordancia em 16 datas regulares.
- Fase A2: concordancia em 96 novas datas regulares.
- Total: 112 datas com Kin externo confirmado pelas duas fontes.
- Divergencias de Kin entre as duas fontes em datas regulares: 0.
- Casos aguardando segunda fonte: 0.

Foram cobertas datas entre `1850-01-15` e `2100-03-01`, incluindo mudancas de
mes, mudancas de ano, anos bissextos e anos seculares nao bissextos.

## Evidencia por caso

Cada novo caso da Fase A2 registra:

- `sourceId` e `sourceName`;
- `consultedAt`;
- `inputDate`;
- Kin, selo, tom, cor e assinatura informados pela fonte;
- URL exata do codigo publico;
- nota de reproducao.

Familia Terrestre, Oraculo, Onda Encantada, Castelo, Harmonica e chakra
permanecem nulos porque nao foram validados especificamente nesta fase.

## Fonte metodologica

`SOURCE-001`, Law of Time - 13 Moon Calendar FAQ, continua sendo usada para a
regra especial de `29/02`. Ela nao fornece um resultado de Kin por data e nao
foi usada para preencher `expected`.

## Fonte rejeitada

`SOURCE-008`, Calculators Ocean, permanece rejeitada para Kin por contradicao
entre o texto e o codigo publicado. Ela nao foi usada para preencher
`expected` na Fase A2.

## Regras de uso

- Exigir compatibilidade declarada com Dreamspell.
- Exigir duas fontes aceitas concordantes para preencher Kin.
- Registrar a data pesquisada e a evidencia individual.
- Nao promover `actual` do motor para `expected`.
- Manter campos nao confirmados como `null`.
- Registrar conflitos sem escolher uma fonte silenciosamente.
