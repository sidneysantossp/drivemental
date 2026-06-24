# Versao congelada do motor

## Identificacao

- Snapshot interno: `drive-astral-engine-snapshot-2026-06-06-2118`.
- Criado em: `2026-06-06 21:18:04 -03:00`.
- Motor: `drive-astral-sincronario-engine`.
- Versao declarada: `0.4.0`.
- Metodo declarado: `dreamspell-wizard-count`.
- Repositorio Git: ausente. A pasta atual nao contem `.git`.
- Finalidade: reproducao tecnica do estado; nao e prova de correcao.

## Arquivos responsaveis

- `src/domain/sincronario/engine.js`: calculos matematicos e derivados.
- `src/domain/sincronario/knowledge.js`: textos interpretativos; nao calcula Kin.
- `app.js`: injeta data de nascimento, data corrente e area no motor.
- `tests/sincronario-engine.test.js`: testes internos do motor.
- `tests/app-render.test.js`: testes internos da integracao e renderizacao.

## Integridade do motor congelado

SHA-256 de `src/domain/sincronario/engine.js`:

```text
617686B2CBD2CB8D0DFA87B525835831D29E2B0E54D99E8CB31F989D6B79D961
```

Este hash deve permanecer igual durante a fase de preenchimento da validacao.

## Funcoes exportadas

- `calculate(input)`.
- `calculateKinForDate(dateValue)`.
- `calculateOracleForKin(kin)`.
- `calculateEarthFamilyForSeal(sealNumber)`.
- `calculateRelationshipForKins(personalKin, dailyKin)`.
- `formatDateOnly(date)`.
- `constants`, contendo versao, metodo, ancora, tons, selos, castelos e familias.

## Regras atualmente declaradas

- Kin por ancora e contagem Dreamspell.
- 29 de fevereiro fora da contagem regular.
- Selo por modulo 20.
- Tom por modulo 13.
- Assinatura por cor, tom e selo.
- Onda Encantada por grupo de 13.
- Castelo por faixa de 52.
- Harmonica por grupo de 4.
- Familia Terrestre por tabela de selo.
- Oraculo de Destino.
- Relacao entre Kin pessoal e Kin do dia.

## Testes existentes

- Ancora e datas imediatamente anterior e posterior.
- Datas bissextas e 29 de fevereiro.
- Entrada de data invalida.
- Contrato do motor.
- Familia Terrestre.
- Oraculo e relacoes entre Kins.
- Determinismo e intervalos em uma lista de datas.
- Integracao do app, historico, resultado e telas.

Esses testes sao internos. Os valores abaixo foram produzidos pelo motor
congelado e nao podem ser usados como `expected` da validacao externa.

## Resultados atualmente produzidos

| Data | Kin | Status | Selo | Tom | Assinatura/erro |
|---|---:|---|---:|---:|---|
| 1900-01-01 | 53 | calculado | 13 | 1 | Vermelho Magnetico Caminhante do Ceu |
| 1900-02-28 | 111 | calculado | 11 | 7 | Azul Ressonante Macaco |
| 1910-06-15 | 228 | calculado | 8 | 7 | Amarelo Ressonante Estrela |
| 1920-02-29 |  | fora_da_contagem |  |  | LEAP_DAY_0_0_HUNAB_KU |
| 1933-07-26 | 84 | calculado | 4 | 6 | Amarelo Ritmico Semente |
| 1940-02-29 |  | fora_da_contagem |  |  | LEAP_DAY_0_0_HUNAB_KU |
| 1950-12-31 | 207 | calculado | 7 | 12 | Azul Cristal Mao |
| 1960-02-29 |  | fora_da_contagem |  |  | LEAP_DAY_0_0_HUNAB_KU |
| 1970-01-01 | 123 | calculado | 3 | 6 | Azul Ritmico Noite |
| 1980-02-29 |  | fora_da_contagem |  |  | LEAP_DAY_0_0_HUNAB_KU |
| 1987-07-25 | 33 | calculado | 13 | 7 | Vermelho Ressonante Caminhante do Ceu |
| 1987-07-26 | 34 | calculado | 14 | 8 | Branco Galactico Mago |
| 1987-07-27 | 35 | calculado | 15 | 9 | Azul Solar Aguia |
| 1988-02-28 | 251 | calculado | 11 | 4 | Azul Autoexistente Macaco |
| 1988-02-29 |  | fora_da_contagem |  |  | LEAP_DAY_0_0_HUNAB_KU |
| 1988-03-01 | 252 | calculado | 12 | 5 | Amarelo Entonado Humano |
| 1992-02-29 |  | fora_da_contagem |  |  | LEAP_DAY_0_0_HUNAB_KU |
| 1996-06-25 | 168 | calculado | 8 | 12 | Amarelo Cristal Estrela |
| 2000-02-29 |  | fora_da_contagem |  |  | LEAP_DAY_0_0_HUNAB_KU |
| 2012-12-21 | 207 | calculado | 7 | 12 | Azul Cristal Mao |
| 2020-02-29 |  | fora_da_contagem |  |  | LEAP_DAY_0_0_HUNAB_KU |
| 2024-02-29 |  | fora_da_contagem |  |  | LEAP_DAY_0_0_HUNAB_KU |
| 2026-02-30 |  | invalido |  |  | DATE_INVALID |
| 2026-06-05 | 178 | calculado | 18 | 9 | Branco Solar Espelho |
| 2032-02-29 |  | fora_da_contagem |  |  | LEAP_DAY_0_0_HUNAB_KU |
| 2100-02-28 | 51 | calculado | 11 | 12 | Azul Cristal Macaco |

## Estado do projeto

Aplicacao estatica mobile-first servida por Node.js, com estado local no
navegador. O motor esta separado da interface, mas o projeto nao possui
controle de versao Git nesta pasta.

## Limitacoes conhecidas

- As Fases A1 e A2 preencheram 113 expectativas comparaveis; sete casos
  permanecem sem `expected`.
- Horario nao participa do calculo.
- O fuso recebido no contrato nao altera a data informada.
- 29 de fevereiro possui regra oficial documentada, mas tres conflitos de
  representacao entre fontes seguem pendentes de decisao metodologica.
- Chakra relacionado e ciclos pessoais nao estao implementados.
- Onda, Castelo, Harmonica, Familia e Oraculo ainda carecem de matriz externa.
- Traducao e ordem dos nomes em portugues ainda precisam de fonte editorial.
