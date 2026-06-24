# Metodologia atualmente adotada

## Identificacao

O app pretende usar Dreamspell / Sincronario das 13 Luas, identificado no
codigo como `dreamspell-wizard-count`.

Esta declaracao descreve o que o motor implementa hoje. Ela nao confirma que as
regras estejam corretas.

## Dreamspell e calendario maia tradicional

Dreamspell/Sincronario e um sistema moderno associado a Jose e Lloydine
Arguelles. Ele usa uma matriz de 260 combinacoes de 20 selos e 13 tons.

O calendario maia tradicional e seus ciclos historicos nao devem ser tratados
como sinonimos automaticos de Dreamspell. Ferramentas que informam apenas
"Tzolkin" podem adotar correlacoes ou convencoes diferentes.

Qualquer fonte externa deve declarar compatibilidade com Dreamspell antes de
ser usada na matriz.

**COMPATIBILIDADE DREAMSPELL CONFIRMADA NAS FONTES DAS FASES A1 E A2**

## Ancora atual

- Data: `1987-07-26`.
- Kin: `34`.
- Assinatura: `Branco Galactico Mago`.

O motor usa essa ancora para contar dias para frente ou para tras.

**CONFIRMADA EM DUAS FONTES INDEPENDENTES NAS FASES A1 E A2**

## Avanco diario atual

Para datas regulares, o motor:

1. calcula a distancia civil em dias ate a ancora;
2. remove os dias 29 de fevereiro encontrados no intervalo;
3. avanca ou retrocede no ciclo de 260 Kins;
4. deriva selo por modulo 20 e tom por modulo 13.

**CONFIRMADO EM 112 DATAS REGULARES NAS FASES A1 E A2**

## Regra atual de 29 de fevereiro

O dia 29 de fevereiro retorna `fora_da_contagem` com aviso
`LEAP_DAY_0_0_HUNAB_KU`. Ele nao recebe Kin regular e nao avanca a contagem.

**REGRA OFICIAL CONFIRMADA; REPRESENTACAO AINDA EM SOURCE_CONFLICT**

## Fuso horario

O contrato aceita um texto de fuso, mas o calculo recebe uma data civil
`YYYY-MM-DD` e nao converte instantes entre fusos. O fuso e metadado no estado
atual.

**FORA DO ESCOPO DA FASE A1**

## Horario de nascimento

O horario nao e coletado nem usado. O motor opera apenas com data civil.

**FORA DO ESCOPO DA FASE A1**

## Convencao de nomes em portugues

O motor usa nomes sem acentos no dado tecnico, por exemplo:

```text
Branco Planetario Enlacador de Mundos
```

A ordem e:

```text
Cor + Tom + Selo
```

Exemplo alternativo nao usado pelo motor:

```text
Enlacador de Mundos Planetario Branco
```

A traducao, capitalizacao, acentuacao e ordem editorial precisam ser conferidas
com uma referencia escolhida pelo produto.

**NUMEROS CONFIRMADOS; TRADUCAO EDITORIAL AINDA PENDENTE**

## Pontos ainda nao confirmados

- Resolucao da representacao de 29 de fevereiro.
- Traducao, acentuacao e ordem editorial de selos e tons.
- Familia Terrestre.
- Oraculo.
- Onda Encantada.
- Castelo.
- Harmonica.
- Escopo correto para horario e fuso.
- Contrato externo equivalente para quatro entradas invalidas.
