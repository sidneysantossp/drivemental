# Divergencias encontradas

## Resultado acumulado

```text
113 comparacoes executadas.
113 correspondencias exatas.
0 divergencias contra expected preenchido.
```

Na Fase A2, as duas fontes externas concordaram entre si em todos os 96 casos
regulares novos. O motor tambem coincidiu com os 96 resultados somente quando
o comparador foi executado ao final.

## Casos sem comparacao conclusiva

| Casos | Quantidade | Classificacao | Motivo |
|---|---:|---|---|
| 29/02 | 3 | `SOURCE_CONFLICT` | Representacao especial versus Kin anterior |
| Entradas invalidas | 4 | `PENDING_VALIDATION` | Contrato externo nao equivalente |

Nao foi encontrada evidencia de:

- `MOTOR_ERROR`;
- `SPECIAL_DATE_RULE_ERROR`;
- `TIMEZONE_ERROR`;
- divergencia numerica de Kin em data regular.

As diferencas de texto entre o ingles das fontes e o portugues do Drive Astral
foram classificadas como `TRANSLATION_DIFFERENCE`. Os numeros de Kin, selo e
tom, assim como a cor, permaneceram concordantes.

## Regra de registro

Uma divergencia futura deve guardar expected, actual, fontes, evidencia, causa
possivel, impacto, severidade e recomendacao. Nenhuma divergencia pode ser
resolvida alterando silenciosamente o `expected`.
