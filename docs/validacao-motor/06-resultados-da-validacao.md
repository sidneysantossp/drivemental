# Resultados da validacao

## Resultado acumulado apos a Fase A2

O comparador foi executado em 2026-06-07 contra o motor congelado.

| Metrica | Quantidade |
|---|---:|
| Casos totais | 120 |
| Casos com `expected` antes da Fase A2 | 17 |
| Casos analisados na Fase A2 | 100 |
| Novos casos com `expected` na Fase A2 | 96 |
| Total atual com `expected` | 113 |
| Kins esperados preenchidos | 112 |
| Pendentes | 7 |
| Correspondencias exatas | 113 |
| Divergencias | 0 |
| Conflitos | 3 |
| Aguardando segunda fonte | 0 |
| Entradas invalidas tratadas corretamente | 5 |

## Cobertura nova por categoria

| Categoria | Novos `expected` |
|---|---:|
| Datas regulares | 59 |
| Mudancas de mes | 12 |
| Mudancas de ano | 8 |
| Anos bissextos | 10 |
| Vizinhancas de 29/02 | 2 |
| Datas antigas ou futuras | 5 |
| Total | 96 |

## Pendencias

| Grupo | Quantidade | Estado |
|---|---:|---|
| Datas 29/02 | 3 | `SOURCE_CONFLICT` |
| Entradas invalidas sem contrato externo equivalente | 4 | `PENDING_VALIDATION` |

Nenhum caso ficou em `pending_second_source`.

## Resultado do comparador

Todos os 96 novos `expected` coincidiram com o resultado atual do motor. Essa
comparacao ocorreu somente depois do preenchimento externo. O campo `actual`
nao foi usado para produzir nenhum `expected`.

Artefatos:

- `tests/fixtures/sincronario-reference-cases.json`;
- `tests/fixtures/sincronario-validation-sources.json`;
- `tests/fixtures/sincronario-validation-results.json`;
- `docs/validacao-motor/05-matriz-de-validacao.csv`.

## Decisao

```text
Fase A2 aprovada com pendencias.
Motor ainda nao aprovado.
Validacao externa em andamento.
```
