# 09 - Arquitetura recomendada

## Objetivo

Separar claramente calculo, conteudo, interpretacao, interface, historico e monetizacao.

## Diagrama textual

```text
Entrada do usuario
  -> validacao de dados
  -> motor matematico
  -> resultado estruturado
  -> base de conhecimento
  -> assistente interpretativo
  -> validacao de seguranca/consistencia
  -> interface
  -> historico do usuario
  -> camada comercial, quando aplicavel
```

## Camadas propostas

### 1. Motor matematico

Responsavel somente por calculos deterministicos.

Exemplos de modulos:

```text
src/domain/sincronario/
  engine.ts
  seals.ts
  tones.ts
  oracle.ts
  wavespell.ts
  castles.ts
  date-utils.ts
  types.ts
```

Regras:

- Nao usar IA.
- Nao acessar interface.
- Nao acessar localStorage.
- Receber entrada estruturada.
- Retornar JSON estruturado.
- Registrar versao do motor.
- Ter testes automatizados.

### 2. Base de conhecimento

Responsavel por significados, interpretacoes e praticas.

```text
src/knowledge/
  seals.json
  tones.json
  areas.json
  practices.json
  protocols.json
  sources.md
```

Regras:

- Conteudo com fonte.
- Conteudo revisado.
- Versionamento.
- Campos separados por area da vida.

### 3. Assistente interpretativo

Responsavel por combinar:

- resultado do motor;
- area escolhida;
- intencao/pergunta;
- Kin do dia;
- historico;
- base de conhecimento.

Regras:

- Nunca inventar calculo.
- Citar quais entradas foram usadas.
- Validar formato de resposta.
- Marcar resultado como interpretado ou inferido.

### 4. Interface

Responsavel por telas, componentes, navegacao e feedback visual.

```text
src/ui/
  components/
  screens/
  styles/
```

Regras:

- Nao conter formulas do Sincronario.
- Nao conter textos interpretativos longos hardcoded.
- Consumir dados estruturados.

### 5. Historico do usuario

Responsavel por consultas, registros, praticas e evolucao.

```text
src/storage/
  user-profile.ts
  readings.ts
  daily-journal.ts
```

Regras:

- Consentimento.
- Exclusao de dados.
- Minimizacao.
- Separar historico local e historico remoto.

### 6. Camada comercial

Futura camada para:

- relatorio avulso;
- checkout;
- assinatura;
- permissao de acesso;
- recibos;
- reembolso;
- limites do plano gratuito.

Nao deve ser implementada antes do motor validado.

## Fluxo recomendado para experiencia gratuita

```text
Formulario
-> normalizar data/fuso
-> calcular mapa pessoal
-> calcular Kin do dia
-> buscar textos base
-> montar leitura gratuita
-> salvar resultado classificado
-> exibir ao usuario
```

## Classificacao obrigatoria de cada saida

Todo campo exibido deve carregar metadado:

- `calculado`
- `derivado`
- `interpretado`
- `informado_pelo_usuario`
- `inferido`
- `nao_implementado`
- `origem_nao_identificada`

Isso permite transparencia e auditoria.
