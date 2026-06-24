# Criterios de aprovacao

## Conclusao da Fase A2

| Criterio da fase | Resultado |
|---|---|
| Pelo menos 60 novos casos analisados | Atendido: 100 |
| Casos com evidencia suficiente receberam `expected` | Atendido: 96 |
| Todo novo `expected` possui duas fontes externas | Atendido |
| Nenhum `expected` veio do motor | Atendido |
| Casos 29/02 separados | Atendido: 3 `SOURCE_CONFLICT` |
| Documento metodologico de 29/02 criado | Atendido |
| Comparador executado | Atendido |
| Nenhuma formula alterada | Atendido |

Decisao da etapa:

```text
Fase A2 aprovada com pendencias.
```

As pendencias nao invalidam a execucao da fase, mas impedem a aprovacao final
do motor.

## Aprovacao final do motor

O motor somente podera ser aprovado quando:

1. A decisao metodologica de `29/02` estiver formalmente escolhida.
2. Os quatro contratos de entrada invalida tiverem referencia externa
   equivalente ou forem explicitamente aceitos como teste interno.
3. Familia Terrestre, Oraculo, Onda Encantada, Castelo e Harmonica tiverem
   cobertura externa suficiente ou forem retirados do escopo de aprovacao.
4. Horario e fuso forem tratados ou formalmente declarados fora do escopo.
5. Toda divergencia critica futura estiver resolvida.
6. A reproducao independente dos resultados continuar possivel.

## Decisao atual do motor

```text
Motor ainda nao aprovado.
Validacao externa em andamento.
```

O resultado numerico de Kin, selo, tom e cor e forte: 112 datas regulares
confirmadas por duas fontes e zero divergencias. A aprovacao permanece bloqueada
pelas decisoes metodologicas e pelos componentes ainda nao cobertos.
