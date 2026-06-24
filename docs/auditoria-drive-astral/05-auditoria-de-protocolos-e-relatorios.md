# 05 - Auditoria de protocolos e relatorios

## Resultado da auditoria

Os protocolos e relatorios atuais sao estaticos ou genericos. Eles nao dependem de Kin, data de nascimento, Kin do dia, historico, fuso, pergunta do usuario ou motor matematico.

## Protocolo diario atual

O protocolo esta todo no componente `ProtocolScreen` em `app.js`.

| Secao | Tipo | Personalizacao | Origem |
|---|---|---:|---|
| Objetivo do Protocolo | Texto fixo | Nao | `app.js` |
| Pilares do Protocolo | Lista fixa | Nao | `app.js` |
| Manha - Raiz + Coronario | Texto fixo | Nao | `app.js` |
| Dia - Plexo Solar | Texto fixo | Nao | `app.js` |
| Noite - Coracao | Texto fixo | Nao | `app.js` |
| Regras de Ouro | Lista fixa | Nao | `app.js` |
| Frase final | Texto fixo | Nao | `app.js` |

## Fluxo atual do protocolo

```text
Usuario toca em Protocolo
-> state.route = "protocol"
-> ProtocolScreen renderiza textos fixos
-> nenhum dado do usuario e consultado
-> nenhum registro diario e salvo
```

## Relatorio/historico atual

Ao enviar o formulario inicial:

```text
tema = estado atual do seletor
data = data atual do dispositivo
summary = "Sintonia [tema] criada para [nome]..."
status = "Ativo"
salvar em state.history
persistir em localStorage
```

## Classificacao de resultados

| Resultado exibido | Tela | Classificacao | Origem | Regra utilizada | Confiabilidade | Problema |
|---|---|---|---|---|---|---|
| Objetivo do protocolo | Protocolo | Interpretado | Texto fixo | Nenhuma | Baixa para personalizacao | Conteudo igual para todos |
| Pilares | Protocolo | Interpretado | Lista fixa | Nenhuma | Media como conteudo editorial | Sem fonte/revisao |
| Etapa Manha | Protocolo | Interpretado | Texto fixo | Nenhuma | Baixa para personalizacao | Sugere prioridade chakra sem calculo |
| Etapa Dia | Protocolo | Interpretado | Texto fixo | Nenhuma | Baixa para personalizacao | Nao usa tema/Kin |
| Etapa Noite | Protocolo | Interpretado | Texto fixo | Nenhuma | Baixa para personalizacao | Nao usa historico |
| Resumo do historico | Historico | Interpretado/generico | Template no submit | Nome e tema do usuario | Baixa | ORIGEM NAO IDENTIFICADA para chakras priorizados |
| Registro permanente | Historico | Armazenado localmente | localStorage | Insercao no array `history` | Baixa | Nao ha conta/backend |

## Riscos

- O usuario pode acreditar que o protocolo foi personalizado quando ele e fixo.
- O texto "chakra raiz e plexo solar priorizados" nao tem regra de suporte.
- Nao ha versionamento dos protocolos.
- Nao ha registro diario de pratica.
- Nao ha validacao de conteudo sensivel ou inadequado.

## Recomendacao futura

O protocolo de sete dias deve ser gerado por uma combinacao de:

1. Resultado calculado do motor.
2. Area escolhida pelo usuario.
3. Kin do dia.
4. Base de conhecimento revisada.
5. Registro diario do usuario.

Antes disso, o app deve deixar claro quando o protocolo e uma pratica geral e quando e personalizado.
