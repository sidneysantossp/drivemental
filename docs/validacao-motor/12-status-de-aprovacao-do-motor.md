# Status de aprovacao do motor

## Status oficial

```text
MOTOR AINDA NAO APROVADO INTEGRALMENTE.
```

Decisao operacional:

```text
Motor aprovado parcialmente para datas regulares.
29/02 pendente de decisao metodologica.
Motor integral ainda nao aprovado.
```

## Base da decisao

| Metrica | Quantidade |
|---|---:|
| Casos totais | 120 |
| Casos com `expected` | 113 |
| Correspondencias exatas | 113 |
| Divergencias comparaveis | 0 |
| Conflitos de 29/02 | 3 |
| Pendencias totais | 7 |

Dos 113 casos comparaveis, 112 confirmam Kin por data e um confirma a rejeicao
de uma data civil impossivel.

## Status parcial por componente

| Componente | Status | Observacao |
|---|---|---|
| Kin em data regular | APROVADO PARCIALMENTE | Duas fontes externas concordantes |
| Selo | APROVADO PARCIALMENTE | Derivado do Kin e confirmado nas fontes |
| Tom | APROVADO PARCIALMENTE | Derivado do Kin e confirmado nas fontes |
| Cor | APROVADO PARCIALMENTE | Confirmada nas fontes |
| Assinatura | APROVADO PARCIALMENTE | Convencao textual normalizada |
| Relacoes basicas | USO CONTROLADO | Cobertas pelos testes existentes; nao usar como diagnostico |
| Datas invalidas | TRATAMENTO VALIDADO | Cinco casos rejeitados pelo app; quatro ainda sem contrato externo equivalente |
| Datas 29/02 | NAO APROVADAS | `SOURCE_CONFLICT / PENDING_METHOD_DECISION` |
| Familia Terrestre | VALIDACAO SEPARADA | Nao incluida na aprovacao parcial externa |
| Oraculo | VALIDACAO SEPARADA | Nao incluido na aprovacao parcial externa |
| Onda Encantada | VALIDACAO PENDENTE | Nao incluida na aprovacao parcial externa |
| Castelo | VALIDACAO PENDENTE | Nao incluido na aprovacao parcial externa |
| Harmonica | VALIDACAO PENDENTE | Nao incluida na aprovacao parcial externa |
| Estado individual dos chakras | NAO CALCULADO | O app apresenta apenas conteudo reflexivo geral |

## Limite da aprovacao

A aprovacao parcial nao autoriza declarar o motor inteiro como correto. Ela
autoriza somente o uso controlado dos campos basicos para datas regulares,
conforme a politica de producao.

## Integridade

SHA-256 de `src/domain/sincronario/engine.js`:

```text
617686B2CBD2CB8D0DFA87B525835831D29E2B0E54D99E8CB31F989D6B79D961
```

O hash permanece igual ao snapshot congelado.
