# 07 - Auditoria de dados e privacidade

## Dados coletados atualmente

| Dado | Coletado? | Onde aparece | Onde e armazenado |
|---|---:|---|---|
| Nome | Sim | Inicio, Perfil, Historico | `localStorage` |
| Data de nascimento | Sim | Inicio, Perfil | `localStorage` |
| Tema escolhido | Sim | Inicio, Perfil, Historico | `localStorage` |
| Historico de consultas | Sim | Historico | `localStorage` |
| Pergunta/intencao atual | Nao | Nao existe campo | Nao armazenado |
| Horario de nascimento | Nao | Nao existe campo | Nao armazenado |
| Cidade/fuso | Nao | Nao existe campo | Nao armazenado |
| Registros emocionais | Nao | Nao existe campo | Nao armazenado |
| Autenticacao | Nao | Nao existe | Nao armazenado |
| Dados enviados a IA | Nao | Nao existe IA | Nao armazenado |

## Chave de armazenamento

O app usa:

```text
drive-astral-state
```

Campos persistidos:

```json
{
  "name": "...",
  "birth": "...",
  "theme": "...",
  "history": []
}
```

## Fluxo de dados atual

```text
Usuario digita nome/data
-> app.js atualiza estado em memoria
-> saveState grava no localStorage
-> submit adiciona relatorio generico no historico
-> saveState grava novamente
```

## Retencao e exclusao

| Tema | Estado atual |
|---|---|
| Prazo de retencao | Indefinido. Permanece enquanto o navegador mantiver localStorage. |
| Exclusao pelo usuario | Nao ha botao ou fluxo. |
| Consentimento | Nao ha. |
| Politica de Privacidade | Nao ha. |
| Termos de uso | Nao ha. |
| Protecao criptografica | Nao ha. |
| Backend | Nao ha. |

## Logs

Os logs atuais do servidor local nao registram dados pessoais. Eles mostram apenas a mensagem de inicializacao ou erros do servidor.

## Riscos LGPD

- Data de nascimento e nome sao dados pessoais.
- Futuramente, intencoes, perguntas e registros podem revelar dados sensiveis de vida pessoal.
- Nao ha consentimento claro.
- Nao ha fluxo para excluir dados.
- Nao ha explicacao de uso de IA porque IA ainda nao existe.
- Nao ha separacao entre dados minimos e dados opcionais.

## Recomendacoes sem implementacao nesta etapa

1. Criar aviso de consentimento antes da coleta.
2. Criar Politica de Privacidade.
3. Criar Termos de Uso.
4. Permitir limpar dados locais.
5. Quando houver backend, permitir exclusao de conta e dados.
6. Minimizar envio de dados para IA.
7. Registrar claramente o que e calculado e o que e interpretado.
