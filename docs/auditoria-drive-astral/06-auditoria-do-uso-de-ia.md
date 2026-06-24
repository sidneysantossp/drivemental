# 06 - Auditoria do uso de IA

## Resultado da auditoria

Nao foram encontradas chamadas de inteligencia artificial no projeto atual.

## Busca realizada

Foram verificados termos e padroes relacionados a:

- `fetch`
- `XMLHttpRequest`
- `OpenAI`
- `Anthropic`
- `prompt`
- `model`
- `api`
- `process.env`
- chamadas externas em JavaScript

## Achados

| Item | Estado |
|---|---|
| IA para calcular Kin | Nao existe |
| IA para determinar chakras | Nao existe |
| IA para interpretar resultados | Nao existe |
| IA para criar protocolos | Nao existe |
| IA para responder perguntas | Nao existe |
| IA para gerar relatorios | Nao existe |
| Validacao de resposta de IA | Nao existe |
| Custo de IA | Nao aplicavel |

## Chamadas externas nao-IA

O `index.html` carrega fontes do Google Fonts:

```text
https://fonts.googleapis.com
https://fonts.gstatic.com
```

Isso nao e IA, mas e uma dependencia externa e deve ser considerada em privacidade/performance.

## Risco futuro

Quando IA for adicionada, ela nao deve calcular Kin, selo, tom, oraculo ou ciclos. A IA deve receber resultado estruturado ja calculado e apenas combinar conteudo revisado, intencao e historico dentro de limites claros.

## Regras recomendadas para IA futura

- Nunca usar IA como motor matematico.
- Validar o formato de retorno.
- Registrar versao do prompt.
- Separar prompts por caso de uso.
- Nao enviar dados pessoais alem do necessario.
- Permitir auditoria de quais campos foram usados.
- Marcar respostas como interpretativas, nao como calculos.
