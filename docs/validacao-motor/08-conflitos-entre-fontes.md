# Conflitos entre fontes

## Conflitos por caso

Os unicos conflitos da matriz continuam sendo:

- `1988-02-29`;
- `2000-02-29`;
- `2024-02-29`.

| Fonte | Resultado observado |
|---|---|
| Law of Time FAQ | `0.0 Hunab Ku`, sem Kin ordinario |
| MayanKin | Substitui 29/02 por 28/02 e exibe o Kin anterior |
| Galactic Ark | Exclui 29/02 da sequencia, mas o calculador direto exibe o Kin anterior |

Os Kins exibidos pelas calculadoras sao:

| Data | MayanKin | Galactic Ark | Law of Time |
|---|---:|---:|---|
| 1988-02-29 | 251 | 251 | sem Kin ordinario |
| 2000-02-29 | 211 | 211 | sem Kin ordinario |
| 2024-02-29 | 131 | 131 | sem Kin ordinario |

Decisao: manter `expected` vazio e `SOURCE_CONFLICT` ate uma decisao
metodologica explicita.

## Fase A2

- Casos regulares cruzados entre MayanKin e Galactic Ark: 96.
- Conflitos de Kin entre essas fontes: 0.
- Casos aguardando segunda fonte: 0.
- Conflitos resolvidos por alteracao do motor: 0.

## Calculators Ocean

A contradicao interna documentada na Fase A1 permanece. A fonte continua
rejeitada para Kin e nao foi usada na Fase A2.

## Documento de decisao

O impacto e as alternativas para `29/02` estao em
`docs/validacao-motor/11-decisao-metodologica-29-02.md`.
