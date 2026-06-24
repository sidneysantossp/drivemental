# Regras especiais de data

## Entrada civil

O motor recebe uma data civil estrita em `YYYY-MM-DD`. As cinco entradas
invalidas da matriz retornaram status interno `invalido` e erro de validacao.

Somente `2026-02-30` possui `expected` externo da Fase A1. As outras quatro
entradas permanecem pendentes porque MayanKin e Galactic Ark usam controles
separados de dia, mes e ano e nao publicam o mesmo contrato de texto bruto.

## 29 de fevereiro

Comportamento atual do motor congelado:

- retorna `fora_da_contagem`;
- nao retorna Kin regular;
- emite `LEAP_DAY_0_0_HUNAB_KU`;
- nao avanca a sequencia entre `28/02` e `01/03`.

Evidencia externa:

- Law of Time define `29/02` como `0.0 Hunab Ku`, fora do Kin ordinario.
- MayanKin substitui `29/02` por `28/02` e exibe o Kin anterior.
- Galactic Ark exclui `29/02` da grade das 13 Luas, mas o calculador direto
  tambem exibe o Kin anterior.

As fontes concordam que o dia nao avanca a sequencia, mas divergem na
representacao do resultado. Os casos `1988-02-29`, `2000-02-29` e
`2024-02-29` permanecem com `expected` vazio e `SOURCE_CONFLICT`.

A analise completa esta em
`docs/validacao-motor/11-decisao-metodologica-29-02.md`.

## Vizinhancas bissextas

As duas fontes aceitas concordaram em:

- `1988-02-28` Kin 251 e `1988-03-01` Kin 252;
- `2000-02-28` Kin 211 e `2000-03-01` Kin 212;
- `2024-02-28` Kin 131 e `2024-03-01` Kin 132;
- `2026-02-28` Kin 81 e `2026-03-01` Kin 82.

## Anos seculares

A regra gregoriana distingue:

- 1900: ano comum;
- 2000: ano bissexto;
- 2100: ano comum.

As duas fontes concordaram nas datas vizinhas presentes na matriz.

## Horario e fuso

Horario e fuso permanecem fora do calculo atual. A Fase A2 validou apenas a
data civil informada, sem conversao de instante.
