# 08 - Problemas e riscos

## Tabela de riscos

| Severidade | Problema | Local | Evidencia | Impacto | Recomendacao | Esforco |
|---|---|---|---|---|---|---|
| Critico | Motor do Sincronario inexistente | Projeto inteiro | Nao ha funcoes de Kin/selo/tom/oraculo | Produto nao sustenta promessa central | Especificar e implementar motor separado | Alto |
| Critico | Data de nascimento nao e usada para calculo | `app.js` | Campo `birth` e salvo, mas nao processado | Usuario pode acreditar em personalizacao inexistente | Ligar formulario ao motor real apos validacao | Medio |
| Critico | Resumo menciona chakras priorizados sem regra | `app.js` submit | Texto fixa raiz e plexo solar | Resultado sem origem clara | Remover ou substituir apenas apos regra validada | Baixo |
| Critico | Ausencia de consentimento e exclusao de dados | `app.js`/produto | Nome e data salvos em localStorage | Risco de privacidade/LGPD | Criar fluxo de consentimento e limpar dados | Medio |
| Alto | Protocolos fixos podem parecer personalizados | `ProtocolScreen` | Textos nao usam dados do usuario | Perda de confianca | Rotular como pratica geral ate motor existir | Baixo |
| Alto | Chakras nao possuem estado calculado ou autoavaliado | `ChakrasScreen` | Lista estatica | Nao ha diagnostico individual | Definir regra ou questionario antes de estados | Medio |
| Alto | Falta de testes automatizados | Projeto inteiro | Nenhum script de teste | Regras futuras podem quebrar silenciosamente | Criar suite antes/depois do motor | Medio |
| Medio | Tudo esta concentrado em `app.js` | `app.js` | Estado, textos, telas e regras no mesmo arquivo | Dificulta evolucao | Separar modulos por dominio | Medio |
| Medio | Sem versionamento de conteudo | `app.js` | Textos hardcoded | Nao da para auditar mudancas | Criar base de conhecimento versionada | Medio |
| Medio | Sem backend/autenticacao | Projeto inteiro | Apenas localStorage | Relatorio nao e permanente entre dispositivos | Planejar backend para MVP pago | Alto |
| Medio | Dependencia externa de fontes | `index.html` | Google Fonts | Privacidade/performance/offline | Considerar fontes locais no produto final | Baixo |
| Baixo | Logs locais gerados pelo servidor | `driveastral-server.*.log` | Arquivos de runtime | Ruido no projeto | Ignorar ou adicionar limpeza/gitignore futuramente | Baixo |

## Riscos de confianca

O maior risco nao e tecnico, e de confianca. Se o app aparentar entregar leitura personalizada sem motor validado, o usuario pode gostar do visual mas nao confiar no produto recorrente.

## Riscos de negocio

- Checkout antes do motor validado pode vender curiosidade, nao recorrencia.
- Assinatura sem uso diario real tende a baixa retencao.
- Relatorios estaticos sao faceis de copiar por concorrentes.

## Riscos juridicos e de linguagem

- Evitar "diagnostico" como promessa principal.
- Evitar alegacoes medicas, financeiras ou terapeuticas.
- Usar termos como leitura, mapa, orientacao, reflexao, pratica e alinhamento.
