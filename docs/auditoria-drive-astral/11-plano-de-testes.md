# 11 - Plano de testes

## Objetivo

Criar uma base de testes para o futuro motor matematico do Sincronario. Nenhum resultado esperado de Kin deve ser inventado. Ate que exista fonte validada, os resultados ficam como `PENDENTE_VALIDACAO`.

## Tipos de teste

- Unitarios: cada regra isolada.
- Integracao: motor completo com entrada estruturada.
- Regressao: casos conhecidos e validados.
- Contrato: formato JSON de saida.
- Datas: calendario comum, bissexto e limites.
- Fuso: diferentes fusos e datas proximas da meia-noite.
- Invalidos: entradas ausentes, mal formatadas ou impossiveis.
- Consistencia: mesma entrada gera mesma saida.

## Casos base propostos

Todos os `expected_status` abaixo devem permanecer pendentes ate validacao por fonte confiavel.

| ID | Data | Hora | Fuso | Categoria | expected_status |
|---|---|---|---|---|---|
| C001 | 1900-01-01 | 12:00 | UTC | ano antigo | PENDENTE_VALIDACAO |
| C002 | 1900-02-28 | 12:00 | UTC | nao bissexto | PENDENTE_VALIDACAO |
| C003 | 1900-03-01 | 12:00 | UTC | pos fevereiro | PENDENTE_VALIDACAO |
| C004 | 1910-06-15 | 12:00 | America/Sao_Paulo | comum | PENDENTE_VALIDACAO |
| C005 | 1920-02-29 | 12:00 | UTC | bissexto | PENDENTE_VALIDACAO |
| C006 | 1920-03-01 | 00:01 | UTC | pos bissexto | PENDENTE_VALIDACAO |
| C007 | 1933-07-26 | 12:00 | UTC | data de referencia a validar | PENDENTE_VALIDACAO |
| C008 | 1940-02-29 | 23:59 | America/Sao_Paulo | bissexto noite | PENDENTE_VALIDACAO |
| C009 | 1945-05-08 | 12:00 | Europe/London | comum | PENDENTE_VALIDACAO |
| C010 | 1950-12-31 | 23:59 | UTC | virada de ano | PENDENTE_VALIDACAO |
| C011 | 1951-01-01 | 00:01 | UTC | inicio de ano | PENDENTE_VALIDACAO |
| C012 | 1955-04-12 | 12:00 | America/New_York | comum | PENDENTE_VALIDACAO |
| C013 | 1960-02-29 | 12:00 | America/Sao_Paulo | bissexto | PENDENTE_VALIDACAO |
| C014 | 1961-02-28 | 12:00 | America/Sao_Paulo | nao bissexto | PENDENTE_VALIDACAO |
| C015 | 1964-02-29 | 00:01 | UTC | bissexto madrugada | PENDENTE_VALIDACAO |
| C016 | 1968-07-26 | 12:00 | UTC | data de referencia a validar | PENDENTE_VALIDACAO |
| C017 | 1969-07-20 | 20:17 | UTC | horario especifico | PENDENTE_VALIDACAO |
| C018 | 1970-01-01 | 00:00 | UTC | epoch | PENDENTE_VALIDACAO |
| C019 | 1972-02-29 | 12:00 | Asia/Tokyo | bissexto fuso leste | PENDENTE_VALIDACAO |
| C020 | 1975-12-31 | 23:30 | America/Los_Angeles | virada fuso oeste | PENDENTE_VALIDACAO |
| C021 | 1976-01-01 | 00:30 | America/Los_Angeles | inicio fuso oeste | PENDENTE_VALIDACAO |
| C022 | 1980-02-29 | 12:00 | UTC | bissexto | PENDENTE_VALIDACAO |
| C023 | 1984-02-29 | 23:59 | America/Sao_Paulo | bissexto noite | PENDENTE_VALIDACAO |
| C024 | 1988-02-29 | 00:01 | Pacific/Auckland | bissexto fuso leste | PENDENTE_VALIDACAO |
| C025 | 1990-01-15 | 12:00 | America/Sao_Paulo | comum | PENDENTE_VALIDACAO |
| C026 | 1991-07-26 | 12:00 | America/Sao_Paulo | data de referencia a validar | PENDENTE_VALIDACAO |
| C027 | 1992-02-29 | 12:00 | America/Sao_Paulo | bissexto | PENDENTE_VALIDACAO |
| C028 | 1993-12-31 | 23:59 | UTC | virada | PENDENTE_VALIDACAO |
| C029 | 1994-01-01 | 00:01 | UTC | inicio | PENDENTE_VALIDACAO |
| C030 | 1995-06-25 | 12:00 | America/Sao_Paulo | comum | PENDENTE_VALIDACAO |
| C031 | 1996-02-29 | 12:00 | America/Sao_Paulo | bissexto | PENDENTE_VALIDACAO |
| C032 | 1996-06-25 | 12:00 | America/Sao_Paulo | exemplo do app | PENDENTE_VALIDACAO |
| C033 | 1997-06-25 | 12:00 | America/Sao_Paulo | comum | PENDENTE_VALIDACAO |
| C034 | 1998-06-25 | 12:00 | America/Sao_Paulo | comum | PENDENTE_VALIDACAO |
| C035 | 1999-12-31 | 23:59 | America/Sao_Paulo | virada | PENDENTE_VALIDACAO |
| C036 | 2000-01-01 | 00:01 | America/Sao_Paulo | seculo bissexto | PENDENTE_VALIDACAO |
| C037 | 2000-02-29 | 12:00 | UTC | seculo bissexto | PENDENTE_VALIDACAO |
| C038 | 2001-02-28 | 12:00 | UTC | nao bissexto | PENDENTE_VALIDACAO |
| C039 | 2002-03-01 | 12:00 | UTC | comum | PENDENTE_VALIDACAO |
| C040 | 2003-07-26 | 12:00 | UTC | data de referencia a validar | PENDENTE_VALIDACAO |
| C041 | 2004-02-29 | 12:00 | America/New_York | bissexto | PENDENTE_VALIDACAO |
| C042 | 2005-10-10 | 10:10 | America/Sao_Paulo | horario especifico | PENDENTE_VALIDACAO |
| C043 | 2006-06-06 | 06:06 | UTC | horario especifico | PENDENTE_VALIDACAO |
| C044 | 2007-07-07 | 07:07 | Asia/Tokyo | horario especifico | PENDENTE_VALIDACAO |
| C045 | 2008-02-29 | 12:00 | Pacific/Auckland | bissexto | PENDENTE_VALIDACAO |
| C046 | 2009-12-31 | 23:59 | America/Los_Angeles | virada fuso oeste | PENDENTE_VALIDACAO |
| C047 | 2010-01-01 | 00:01 | America/Los_Angeles | inicio fuso oeste | PENDENTE_VALIDACAO |
| C048 | 2011-11-11 | 11:11 | UTC | horario especifico | PENDENTE_VALIDACAO |
| C049 | 2012-02-29 | 12:00 | America/Sao_Paulo | bissexto | PENDENTE_VALIDACAO |
| C050 | 2012-12-21 | 12:00 | UTC | data sensivel | PENDENTE_VALIDACAO |
| C051 | 2013-01-01 | 12:00 | UTC | comum | PENDENTE_VALIDACAO |
| C052 | 2014-07-26 | 12:00 | UTC | data de referencia a validar | PENDENTE_VALIDACAO |
| C053 | 2015-06-30 | 23:59 | UTC | fim de mes | PENDENTE_VALIDACAO |
| C054 | 2016-02-29 | 12:00 | UTC | bissexto | PENDENTE_VALIDACAO |
| C055 | 2016-03-01 | 00:01 | UTC | pos bissexto | PENDENTE_VALIDACAO |
| C056 | 2017-02-28 | 23:59 | America/Sao_Paulo | nao bissexto | PENDENTE_VALIDACAO |
| C057 | 2018-07-26 | 12:00 | America/Sao_Paulo | data de referencia a validar | PENDENTE_VALIDACAO |
| C058 | 2019-12-31 | 23:59 | UTC | virada | PENDENTE_VALIDACAO |
| C059 | 2020-01-01 | 00:01 | UTC | inicio | PENDENTE_VALIDACAO |
| C060 | 2020-02-29 | 12:00 | America/Sao_Paulo | bissexto | PENDENTE_VALIDACAO |
| C061 | 2020-07-26 | 12:00 | America/Sao_Paulo | data de referencia a validar | PENDENTE_VALIDACAO |
| C062 | 2021-02-28 | 12:00 | UTC | nao bissexto | PENDENTE_VALIDACAO |
| C063 | 2021-03-01 | 12:00 | UTC | pos fevereiro | PENDENTE_VALIDACAO |
| C064 | 2022-07-26 | 12:00 | UTC | data de referencia a validar | PENDENTE_VALIDACAO |
| C065 | 2023-07-25 | 23:59 | America/Sao_Paulo | vespera referencia | PENDENTE_VALIDACAO |
| C066 | 2023-07-26 | 00:01 | America/Sao_Paulo | data de referencia a validar | PENDENTE_VALIDACAO |
| C067 | 2024-02-28 | 12:00 | UTC | pre bissexto | PENDENTE_VALIDACAO |
| C068 | 2024-02-29 | 12:00 | UTC | bissexto | PENDENTE_VALIDACAO |
| C069 | 2024-03-01 | 12:00 | UTC | pos bissexto | PENDENTE_VALIDACAO |
| C070 | 2024-07-26 | 12:00 | America/Sao_Paulo | data de referencia a validar | PENDENTE_VALIDACAO |
| C071 | 2025-01-01 | 00:00 | UTC | inicio ano | PENDENTE_VALIDACAO |
| C072 | 2025-07-26 | 12:00 | UTC | data de referencia a validar | PENDENTE_VALIDACAO |
| C073 | 2025-12-31 | 23:59 | UTC | virada | PENDENTE_VALIDACAO |
| C074 | 2026-01-01 | 00:01 | UTC | inicio ano | PENDENTE_VALIDACAO |
| C075 | 2026-06-05 | 12:00 | America/Sao_Paulo | data atual desta auditoria | PENDENTE_VALIDACAO |
| C076 | 2026-07-26 | 12:00 | America/Sao_Paulo | data de referencia a validar | PENDENTE_VALIDACAO |
| C077 | 2027-02-28 | 12:00 | UTC | nao bissexto | PENDENTE_VALIDACAO |
| C078 | 2027-03-01 | 12:00 | UTC | pos fevereiro | PENDENTE_VALIDACAO |
| C079 | 2028-02-29 | 12:00 | UTC | bissexto futuro | PENDENTE_VALIDACAO |
| C080 | 2028-07-26 | 12:00 | UTC | data de referencia a validar | PENDENTE_VALIDACAO |
| C081 | 2029-12-31 | 23:59 | Pacific/Auckland | virada fuso leste | PENDENTE_VALIDACAO |
| C082 | 2030-01-01 | 00:01 | Pacific/Auckland | inicio fuso leste | PENDENTE_VALIDACAO |
| C083 | 2030-07-26 | 12:00 | UTC | data de referencia a validar | PENDENTE_VALIDACAO |
| C084 | 2031-06-15 | 12:00 | America/New_York | comum | PENDENTE_VALIDACAO |
| C085 | 2032-02-29 | 12:00 | UTC | bissexto futuro | PENDENTE_VALIDACAO |
| C086 | 2033-03-01 | 12:00 | UTC | comum | PENDENTE_VALIDACAO |
| C087 | 2034-07-26 | 12:00 | UTC | data de referencia a validar | PENDENTE_VALIDACAO |
| C088 | 2035-12-31 | 23:59 | UTC | virada | PENDENTE_VALIDACAO |
| C089 | 2036-02-29 | 12:00 | America/Sao_Paulo | bissexto futuro | PENDENTE_VALIDACAO |
| C090 | 2040-02-29 | 12:00 | UTC | bissexto futuro | PENDENTE_VALIDACAO |
| C091 | 2044-02-29 | 12:00 | UTC | bissexto futuro | PENDENTE_VALIDACAO |
| C092 | 2048-02-29 | 12:00 | UTC | bissexto futuro | PENDENTE_VALIDACAO |
| C093 | 2050-07-26 | 12:00 | UTC | data de referencia a validar | PENDENTE_VALIDACAO |
| C094 | 2099-12-31 | 23:59 | UTC | fim de seculo | PENDENTE_VALIDACAO |
| C095 | 2100-02-28 | 12:00 | UTC | seculo nao bissexto | PENDENTE_VALIDACAO |
| C096 | 2100-03-01 | 12:00 | UTC | pos seculo nao bissexto | PENDENTE_VALIDACAO |
| C097 | INVALID | 12:00 | UTC | entrada invalida | ERRO_ESPERADO |
| C098 | 2026-13-01 | 12:00 | UTC | mes invalido | ERRO_ESPERADO |
| C099 | 2026-02-30 | 12:00 | UTC | dia invalido | ERRO_ESPERADO |
| C100 | 2026-06-05 | 25:00 | UTC | hora invalida | ERRO_ESPERADO |

## Testes de contrato

Cada resultado do motor deve validar:

- Presenca de `engine.version`.
- Presenca de `rules_applied`.
- Presenca de `warnings`.
- Presenca de `validation_errors`.
- Tipo numerico para Kin quando implementado.
- Status explicito para campos nao implementados.

## Testes de consistencia

Para cada caso valido:

```text
resultado_a = calcular(entrada)
resultado_b = calcular(entrada)
assert resultado_a == resultado_b
```

## Criterio para aprovar o motor

1. Todos os casos validados devem passar.
2. Entradas invalidas devem falhar com erro claro.
3. Nenhum calculo pode depender de IA.
4. Toda formula deve ter `rule_id` e fonte.
