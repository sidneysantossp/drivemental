# 03 - Auditoria do motor de calculo

## Resultado da auditoria

Nao existe motor de calculo do Sincronario das 13 Luas no projeto atual.

A data de nascimento e capturada no formulario, salva no estado e exibida no perfil, mas nao e usada para calcular Kin, selo, tom, cor, assinatura galactica ou qualquer ciclo.

## Calculos localizados

| Regra localizada | Arquivo | Entrada | Procedimento | Saida | Deterministico | Fonte validada | Teste |
|---|---|---|---|---|---:|---:|---:|
| Data do relatorio no historico | `app.js` | Data/hora atual do dispositivo | `new Date()` + `Intl.DateTimeFormat("pt-BR")` | Data formatada do relatorio | Parcial, depende do relogio local | Nao se aplica | Nao |

## Itens esperados do Sincronario

| Item | Status atual | Observacao |
|---|---|---|
| Kin de nascimento | Nao implementado | REGRA SEM FONTE VALIDADA |
| Kin do dia | Nao implementado | REGRA SEM FONTE VALIDADA |
| Selo solar | Nao implementado | REGRA SEM FONTE VALIDADA |
| Tom galactico | Nao implementado | REGRA SEM FONTE VALIDADA |
| Cor | Nao implementado | REGRA SEM FONTE VALIDADA |
| Assinatura galactica | Nao implementado | REGRA SEM FONTE VALIDADA |
| Oraculo do Destino | Nao implementado | REGRA SEM FONTE VALIDADA |
| Guia | Nao implementado | REGRA SEM FONTE VALIDADA |
| Analogo | Nao implementado | REGRA SEM FONTE VALIDADA |
| Antipoda | Nao implementado | REGRA SEM FONTE VALIDADA |
| Oculto | Nao implementado | REGRA SEM FONTE VALIDADA |
| Onda Encantada | Nao implementado | REGRA SEM FONTE VALIDADA |
| Castelo | Nao implementado | REGRA SEM FONTE VALIDADA |
| Harmonica | Nao implementado | REGRA SEM FONTE VALIDADA |
| Familia Terrestre | Nao implementado | REGRA SEM FONTE VALIDADA |
| Chakra relacionado ao mapa | Nao implementado | REGRA SEM FONTE VALIDADA |
| Ciclos pessoais | Nao implementado | REGRA SEM FONTE VALIDADA |

## Pseudocodigo do comportamento atual

```text
ao enviar formulario:
  nome = campo nome
  data_nascimento = campo data

  se nome ou data_nascimento estiver vazio:
    exibir aviso
    parar

  tema = Financas ou Relacionamentos
  data_relatorio = data atual do dispositivo
  resumo = texto generico com nome e tema

  salvar no historico local
  navegar para mapa de chakras
```

## Tratamento de datas

| Aspecto | Estado atual |
|---|---|
| Data de nascimento | Capturada por input `type="date"`, sem parse semantico. |
| Horario de nascimento | Nao coletado. |
| Fuso horario | Nao coletado. |
| Cidade/local | Nao coletado. |
| Data atual | Usada apenas para carimbar o historico. |
| Ano bissexto | Nao tratado. |
| 29 de fevereiro | Nao tratado. |
| Meia-noite | Nao tratado. |

## Inconsistencias

- O app sugere leitura energetica personalizada, mas nao usa a data de nascimento em nenhum calculo.
- O resumo do historico menciona chakras priorizados, mas essa prioridade nao e calculada.
- A tela de chakras e acessada apos o formulario como se houvesse resultado, mas o conteudo e estatico.

## Criterio para avancar

Nao avancar para checkout, relatorio pago ou assinatura ate que o motor matematico seja especificado, implementado e testado com fontes validadas.
