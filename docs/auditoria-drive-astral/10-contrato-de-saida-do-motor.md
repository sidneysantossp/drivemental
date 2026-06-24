# 10 - Contrato de saida do motor

## Objetivo

Definir um formato padrao para o futuro motor matematico. Este contrato ainda nao esta implementado.

## Principios

- A mesma entrada deve gerar sempre a mesma saida.
- A IA nao participa do calculo.
- Cada campo informa seu status e origem.
- Campos sem fonte validada ficam como pendentes.
- Erros de validacao sao explicitos.

## Exemplo de JSON

```json
{
  "engine": {
    "name": "drive-astral-sincronario-engine",
    "version": "0.1.0-pending",
    "method": "PENDENTE_FONTE_VALIDADA",
    "status": "nao_implementado"
  },
  "input": {
    "birth_date": {
      "value": "1996-06-25",
      "timezone": "America/Sao_Paulo",
      "source": "informado_pelo_usuario",
      "status": "valido"
    },
    "current_date": {
      "value": "2026-06-05",
      "timezone": "America/Sao_Paulo",
      "source": "sistema",
      "status": "valido"
    }
  },
  "personal_map": {
    "kin": {
      "value": null,
      "classification": "calculado",
      "status": "nao_implementado",
      "rule_id": null
    },
    "signature": {
      "value": null,
      "classification": "derivado",
      "status": "nao_implementado",
      "rule_id": null
    },
    "seal": {
      "number": null,
      "name": null,
      "color": null,
      "classification": "calculado",
      "status": "nao_implementado",
      "rule_id": null
    },
    "tone": {
      "number": null,
      "name": null,
      "classification": "calculado",
      "status": "nao_implementado",
      "rule_id": null
    },
    "oracle": {
      "destiny": null,
      "guide": null,
      "analog": null,
      "antipode": null,
      "occult": null,
      "classification": "calculado",
      "status": "nao_implementado"
    },
    "wavespell": {
      "value": null,
      "classification": "calculado",
      "status": "nao_implementado"
    },
    "castle": {
      "value": null,
      "classification": "calculado",
      "status": "nao_implementado"
    },
    "harmonic": {
      "value": null,
      "classification": "calculado",
      "status": "nao_implementado"
    },
    "earth_family": {
      "value": null,
      "classification": "calculado",
      "status": "nao_implementado"
    },
    "related_chakra": {
      "value": null,
      "classification": "derivado",
      "status": "pendente_fonte_validada"
    }
  },
  "daily": {
    "kin_of_day": {
      "value": null,
      "classification": "calculado",
      "status": "nao_implementado"
    },
    "relationship_to_personal_kin": {
      "value": null,
      "classification": "derivado",
      "status": "nao_implementado"
    }
  },
  "cycles": [],
  "rules_applied": [],
  "warnings": [
    {
      "code": "ENGINE_NOT_IMPLEMENTED",
      "message": "Motor matematico ainda nao implementado."
    }
  ],
  "validation_errors": []
}
```

## Campos obrigatorios

| Campo | Obrigatorio | Classificacao |
|---|---:|---|
| `engine.version` | Sim | Metadado |
| `input.birth_date` | Sim para mapa pessoal | Informado pelo usuario |
| `input.current_date` | Sim para Kin do dia | Sistema |
| `personal_map.kin` | Sim quando motor existir | Calculado |
| `personal_map.seal` | Sim quando motor existir | Calculado |
| `personal_map.tone` | Sim quando motor existir | Calculado |
| `daily.kin_of_day` | Sim para uso diario | Calculado |
| `rules_applied` | Sim | Auditoria |
| `warnings` | Sim | Auditoria |
| `validation_errors` | Sim | Validacao |

## Status permitidos

- `valido`
- `invalido`
- `calculado`
- `derivado`
- `nao_implementado`
- `pendente_fonte_validada`
- `origem_nao_identificada`

## Proxima decisao

Antes da implementacao, aprovar o metodo, a fonte e os exemplos validados que determinarao os resultados esperados.
