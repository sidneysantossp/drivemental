# Decisao metodologica para 29/02

## Escopo

Este documento separa o problema de representacao de `29/02` da validacao das
datas regulares. Nenhuma regra nova foi implementada na Fase A2.

Datas analisadas:

- `1988-02-29`;
- `2000-02-29`;
- `2024-02-29`.

## Fontes consultadas

| Fonte | Tipo de evidencia |
|---|---|
| Law of Time - 13 Moon Calendar FAQ | Regra metodologica oficial |
| MayanKin Daily Tzolkin | Pagina e JavaScript publico |
| Galactic Ark Dreamspell Kin Calculator | Pagina e JavaScript publico |

## Resultados observados

| Data | Law of Time | MayanKin | Galactic Ark |
|---|---|---:|---:|
| 1988-02-29 | `0.0 Hunab Ku`, sem Kin ordinario | Kin 251 | Kin 251 |
| 2000-02-29 | `0.0 Hunab Ku`, sem Kin ordinario | Kin 211 | Kin 211 |
| 2024-02-29 | `0.0 Hunab Ku`, sem Kin ordinario | Kin 131 | Kin 131 |

MayanKin substitui internamente o dia 29 pelo dia 28 antes de calcular.
Galactic Ark remove `29/02` da sequencia das 13 Luas, mas o calculador direto
retorna o Kin anterior para a entrada.

## Ponto de concordancia

As tres fontes indicam que `29/02` nao avanca a sequencia regular. Em todos os
anos analisados, `01/03` avanca somente um Kin em relacao a `28/02`.

## Conflito

O conflito e de representacao:

- a fonte metodologica oficial trata o dia como especial e sem Kin ordinario;
- as duas calculadoras publicas exibem o Kin do dia anterior.

Por isso, os tres casos permanecem:

```text
SOURCE_CONFLICT
```

O campo `expected` permanece vazio.

## Impacto no app

O motor atual retorna `fora_da_contagem` e nao cria um Kin regular. Uma mudanca
para repetir o Kin anterior afetaria:

- resultado principal;
- historico;
- relatorios;
- protocolos dependentes do Kin;
- assinatura e componentes derivados.

Esse impacto exige uma decisao de produto e metodologia antes de qualquer
alteracao.

## Protecao atual no produto

A consolidacao pos-validacao implementou uma barreira antes da chamada ao
motor:

- `29/02` e reconhecido como data civil valida em ano bissexto;
- a leitura automatica e bloqueada;
- nenhum registro e criado no historico;
- `28/02` e `01/03` nao sao usados como substitutos;
- a interface explica que a pendencia e metodologica, nao um erro de data.

Mensagem curta:

```text
29 de fevereiro possui regra especial e ainda nao esta disponivel nesta versao.
```

Complemento:

```text
Voce podera continuar quando a regra metodologica de 29/02 for definida no Drive Mental.
```

## Alternativas

1. Manter `0.0 Hunab Ku` sem Kin ordinario, como o motor atual.
2. Retornar o Kin anterior, seguindo a representacao das calculadoras.
3. Retornar um estado especial e, separadamente, informar o Kin anterior apenas
   como referencia de continuidade.
4. Bloquear o calculo de `29/02` ate a decisao definitiva.

## Recomendacao provisoria

Manter a alternativa 4 na experiencia atual e a alternativa 1 como referencia
metodologica documental, sem promover o comportamento do motor a `expected`.
A alternativa 3 pode ser avaliada futuramente porque preserva o estado especial
e explica a continuidade mostrada pelas calculadoras.

Esta recomendacao nao autoriza alteracao do motor.

## Estado

```text
PENDING_METHOD_DECISION
SOURCE_CONFLICT
Motor integral ainda nao aprovado.
```
