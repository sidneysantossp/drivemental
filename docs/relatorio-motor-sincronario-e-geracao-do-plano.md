# Relatório técnico — motor sincronário e geração do plano no Drive Mental

## 1. Objetivo

Este relatório descreve como o Drive Mental transforma a data de nascimento, a data atual e o tema escolhido pelo usuário em:

- coordenadas matemáticas do Sincronário;
- uma leitura textual contextualizada;
- um protocolo diário;
- uma jornada de 30 dias.

O documento também separa o que é cálculo, conteúdo editorial e regra comercial, além de registrar lacunas importantes antes de evoluir a geração do plano.

## 2. Resumo executivo

O sistema atual não usa IA para gerar a leitura ou o plano. Tudo é produzido no navegador por funções JavaScript determinísticas e por tabelas editoriais versionadas.

Fluxo resumido:

1. O onboarding salva a data de nascimento e o tema principal no perfil.
2. Em uma consulta, o motor calcula o Kin pessoal e o Kin do dia.
3. Outros módulos calculam as 13 Luas, semana cromática, plasma, chakra estrutural, Onda Encantada e a sincronização entre os Kins.
4. Uma base editorial aplica essas coordenadas ao tema escolhido.
5. A leitura completa é congelada em um snapshot e salva no histórico/Supabase.
6. O protocolo diário reutiliza o mantra, a pergunta e a prática da leitura.
7. A jornada de 30 dias combina um roteiro fixo de cinco fases com a área e a prática da leitura.

Ponto crítico: concluir o onboarding não gera a leitura nem a jornada automaticamente. O onboarding apenas atualiza `profiles.birth_date`, `profiles.primary_area_id` e marca o perfil como completo por consequência desses campos. A leitura é criada depois, quando `submitAlignment()` executa uma consulta. Portanto, se o produto pretende criar o plano imediatamente após o onboarding, esse encadeamento ainda não existe.

Outro ponto crítico: “plano” possui dois significados no código:

- plano comercial: `free`, `premium` ou `mentor`, controlado por acesso administrativo/comercial;
- plano de desenvolvimento: a jornada personalizada de 30 dias, montada no frontend.

O motor sincronário não escolhe nem concede plano comercial.

## 3. Entradas utilizadas

### 3.1 Onboarding

O onboarding coleta e preserva:

- nome já associado à conta;
- data de nascimento (`birth` / `birth_date`);
- área principal (`selectedAreaId` / `primary_area_id`).

Áreas internas aceitas:

- `general`;
- `purpose`;
- `work-prosperity`;
- `love-relationships`;
- `challenges-blocks`;
- `energy-spirituality`;
- `decisions-cycles`.

A área não participa das fórmulas do Kin. Ela serve exclusivamente para escolher a camada editorial de aplicação.

### 3.2 Consulta

`calculateReading(birthDate, focusArea)` acrescenta:

- data atual local, formatada como `YYYY-MM-DD`;
- timezone lógico `date-only`;
- tema selecionado.

## 4. Pipeline completo

```text
Data de nascimento + tema
        |
        v
Validação de data
        |
        v
Motor Kin v0.4.0
  - Kin pessoal
  - Kin do dia
  - selo, tom, assinatura
  - Onda, Castelo, Harmônica, Família Terrestre
  - Oráculo
  - relação pessoal x dia
        |
        v
Motor de coordenadas v0.1.0
  - 13 Luas
  - semana cromática
  - plasma e chakra do ciclo
  - posição na Onda
  - Kin de sincronização
        |
        v
Base editorial v0.8.0 / conteúdo por área v0.3
  - síntese
  - pergunta de reflexão
  - prática diária
        |
        v
Snapshot da leitura
        |
        +--> Histórico / Supabase
        +--> Protocolo diário
        +--> Jornada de 30 dias
```

## 5. Motor principal de Kin

Arquivo: `src/domain/sincronario/engine.js`.

Contrato atual:

- versão: `0.4.0`;
- método: `dreamspell-wizard-count`;
- âncora: `1987-07-26` = Kin 34, Branco Galáctico Mago;
- ciclo: 260 posições.

### 5.1 Cálculo do Kin

1. A data é interpretada em UTC, sem horário.
2. Calcula-se a diferença de dias em relação à âncora.
3. Os dias 29 de fevereiro dentro do intervalo são removidos da progressão.
4. O resultado é reduzido ao intervalo de 1 a 260.

Fórmula equivalente:

```text
dias_sincronarios = dias_civis_desde_1987_07_26 - dias_29_02_no_intervalo
kin = modulo_positivo(34 - 1 + dias_sincronarios, 260) + 1
```

### 5.2 Selo, tom e assinatura

```text
tom = ((kin - 1) mod 13) + 1
selo = ((kin - 1) mod 20) + 1
assinatura = cor_do_selo + nome_do_tom + nome_do_selo
```

O código contém tabelas fixas com os 13 tons e os 20 selos.

### 5.3 Derivações adicionais

- Onda Encantada: grupos sequenciais de 13 Kins.
- Castelo: cinco faixas de 52 Kins.
- Harmônica: grupos sequenciais de quatro Kins.
- Família Terrestre: tabela fixa baseada no selo.
- Oráculo: Destino, Guia, Análogo, Antípoda e Oculto.

O Oráculo usa complementos e deslocamentos de selo/tom codificados no motor. Esses componentes são derivados matematicamente, mas possuem status de validação externa separado do cálculo básico de Kin.

### 5.4 Relação entre Kin pessoal e Kin do dia

O motor compara:

- distância no ciclo de 260;
- distância de selo no ciclo de 20;
- distância de tom no ciclo de 13;
- mesmo Kin;
- mesmo selo;
- mesmo tom;
- mesma cor;
- mesma Família Terrestre;
- presença do Kin diário no Oráculo pessoal.

Prioridade do rótulo final:

1. mesmo Kin;
2. ponto do Oráculo;
3. mesmo selo;
4. mesmo tom;
5. mesma cor;
6. mesma Família Terrestre;
7. somente distância no ciclo.

## 6. Motor das 13 Luas

Arquivo: `src/domain/sincronario/thirteen-moons-engine.js`.

Contrato atual: versão `0.1.0`.

Regras:

- o anel solar começa em 26 de julho;
- são 13 Luas de 28 dias, totalizando 364 dias;
- 25 de julho é o Dia Fora do Tempo;
- 29 de fevereiro fica fora da contagem;
- cada Lua é dividida em quatro semanas cromáticas de sete dias;
- os sete plasmas se repetem semanalmente.

Semanas:

| Dias da Lua | Semana |
|---|---|
| 1–7 | Vermelha |
| 8–14 | Branca |
| 15–21 | Azul |
| 22–28 | Amarela |

Plasmas e associação estrutural:

| Posição | Plasma | Chakra |
|---:|---|---|
| 1 | Dali | Coroa |
| 2 | Seli | Raiz |
| 3 | Gama | Terceiro Olho |
| 4 | Kali | Sacral |
| 5 | Alfa | Laríngeo |
| 6 | Limi | Plexo Solar |
| 7 | Silio | Cardíaco |

Essa associação não diagnostica bloqueio, ferida, hiperatividade ou condição clínica/energética do chakra.

## 7. Sincronização diária

Arquivo: `src/domain/sincronario/synchronization-engine.js`.

O Kin pessoal e o Kin do dia são somados e reduzidos ao intervalo 1–260:

```text
soma = kin_pessoal + kin_do_dia
kin_de_navegacao = ((soma - 1) mod 260) + 1
```

Exemplos cobertos por testes:

- `68 + 133 = 201`;
- `236 + 133 = 369`, reduzido para `109`.

O resultado é uma coordenada simbólica chamada Kin de navegação/sincronização. Não é previsão.

Existe também `calculateHarmonicKin([kins])`, mas seu uso principal ainda está preparado para arquitetura futura.

## 8. Camada de coordenadas

Arquivo: `src/domain/sincronario/coordinates-engine.js`.

Essa camada agrega, para nascimento e dia atual:

- resultado das 13 Luas;
- posição estrutural na Onda Encantada;
- sincronização entre Kin pessoal e diário.

Ela não altera os resultados do motor principal; apenas enriquece o objeto da leitura.

## 9. Como o texto personalizado é gerado

Arquivos:

- `src/domain/sincronario/knowledge.js`;
- `src/domain/sincronario/area-knowledge.js`;
- `src/domain/sincronario/area-application-knowledge.js`.

Versões:

- base de conhecimento: `0.8.0`;
- conteúdo por área: `area-knowledge-v0.3`;
- aplicação por área: `area-application-v0.3`.

Não há chamada para ChatGPT ou qualquer modelo de IA. A seleção textual funciona por tabelas e regras:

1. Normaliza o ID da área.
2. Lê Lua, semana, plasma, chakra, Kin de navegação, selo e tom diários.
3. Seleciona textos editoriais específicos para a combinação área + Lua + semana + plasma.
4. Monta uma síntese concatenando quatro blocos:
   - tradução da Lua para a área;
   - tradução da semana para a área;
   - tradução do plasma/chakra para a área;
   - tradução do Kin de navegação.
5. Escolhe uma pergunta usando:

```text
indice = (numero_da_lua + numero_da_semana + numero_do_plasma)
         mod quantidade_de_perguntas_da_area
```

6. Escolhe a prática diária pela semana cromática.

Se faltarem coordenadas, usa textos gerais de fallback baseados em assinatura, selo, tom, Kin do dia e relação diária.

Consequência: usuários com a mesma área e as mesmas coordenadas do dia recebem o mesmo texto. A data de nascimento afeta o mapa pessoal e a sincronização, mas a maior parte da aplicação prática atual é escolhida pelas coordenadas do dia e pela área.

## 10. Snapshot e persistência

Ao executar uma consulta válida, `createReadingHistoryEntry()` cria um snapshot `history-snapshot-v2` contendo:

- entrada original;
- Kin, assinatura, selo, tom e Família Terrestre pessoais;
- Kin, assinatura, selo e tom do dia;
- relações derivadas;
- coordenadas completas;
- síntese, pergunta e prática;
- versões do motor e do conteúdo;
- cópia integral da leitura.

No Supabase, a tabela `readings` guarda:

- usuário;
- chave de idempotência;
- área;
- datas de nascimento e leitura;
- versões;
- payload JSON completo.

O snapshot evita que uma leitura antiga mude quando o conteúdo editorial ou o motor forem atualizados.

## 11. Como o protocolo diário é criado

Função: `protocolMoments()` em `app.js`.

O protocolo possui três blocos fixos:

- manhã: mantra da área;
- dia: prática diária proveniente da leitura;
- noite: pergunta de reflexão proveniente da leitura.

Portanto, somente partes específicas são personalizadas. A estrutura, os títulos, a respiração, as instruções de foco e o fechamento são templates fixos.

O progresso diário é salvo primeiro no `localStorage` e sincronizado na tabela `protocol_progress` quando há Supabase.

## 12. Como a jornada de 30 dias é criada

Função: `journeyPlan()` em `app.js`.

A jornada possui 30 itens distribuídos em cinco fases fixas:

| Fase | Dias | Função |
|---|---:|---|
| Observar | 7 | reconhecer o momento |
| Organizar | 7 | criar prioridade, limites e ordem |
| Agir | 7 | executar passos concretos |
| Sustentar | 7 | manter constância e ritmo |
| Integrar | 2 | fechar e preparar o próximo ciclo |

Cada dia contém mantra e ação previamente escritos no código.

Personalização atual:

- todos os dias carregam o título da área da leitura;
- o dia 1 substitui o mantra padrão pelo mantra da área;
- o dia 1 substitui a ação padrão pela prática sugerida na leitura;
- os dias 2 a 30 usam mantras e ações genéricos das cinco fases.

Logo, a jornada não é atualmente um plano profundamente calculado para cada usuário. Ela é um roteiro editorial fixo de 30 dias, contextualizado principalmente no primeiro dia e identificado pela área selecionada.

O contexto da jornada é identificado por:

```text
readingId + personalKin + areaId + readingDate
```

O progresso é salvo localmente e em `journey_progress`.

## 13. O que acontece exatamente após o onboarding

### Implementado hoje

1. Valida data e área.
2. Atualiza o perfil no Supabase.
3. Redireciona para o dashboard.
4. Uma leitura anterior é carregada se já existir no histórico.

### Não implementado hoje

- criar automaticamente a primeira leitura no submit do onboarding;
- salvar automaticamente um registro em `readings` no onboarding;
- iniciar automaticamente `journey_progress` no onboarding;
- gerar um plano diferente para cada combinação completa de Kin, tom, selo, Lua e área;
- usar respostas comportamentais, metas, disponibilidade, dificuldades ou preferências;
- adaptar os dias 2–30 a check-ins do usuário;
- atribuir automaticamente plano comercial pago.

## 14. Estado de validação metodológica

Segundo `docs/validacao-motor`:

- 120 casos totais;
- 113 casos com resultado externo esperado;
- 113 correspondências exatas;
- zero divergências nos casos comparáveis;
- três conflitos de fonte em datas 29/02;
- quatro entradas inválidas sem equivalente externo;
- motor aprovado parcialmente para datas regulares;
- motor integral ainda não aprovado.

O nascimento em 29/02 é bloqueado pelo produto e não recebe substituição automática por 28/02 ou 01/03.

Kin, selo, tom, cor e assinatura possuem a validação externa mais forte. Oráculo, Família Terrestre, Onda, Castelo, Harmônica e significados editoriais possuem status de validação separado.

## 15. Riscos e limitações para a evolução do plano

### Alta prioridade

1. Onboarding e criação da leitura estão desacoplados.
2. A jornada se apresenta como personalizada, mas 29 de 30 dias são majoritariamente genéricos.
3. A data atual influencia fortemente a prática; refazer a consulta em outro dia pode mudar o contexto e criar uma nova jornada.
4. A área altera texto, não cálculo.
5. Não existem objetivos mensuráveis, disponibilidade, restrições ou check-ins usados para adaptar o plano.

### Prioridade metodológica

1. Definir formalmente quais coordenadas podem influenciar cada tipo de recomendação.
2. Revisar a validade editorial das traduções de Lua, semana, plasma e chakra.
3. Manter separação explícita entre dado calculado, interpretação e recomendação.
4. Não apresentar chakra do dia como diagnóstico individual.
5. Resolver ou manter bloqueada a política de 29/02.

### Prioridade técnica

1. Decidir se a primeira leitura deve ser criada dentro do onboarding.
2. Criar uma versão formal do gerador de jornada, separada da renderização em `app.js`.
3. Persistir o plano gerado como snapshot versionado, não apenas regenerá-lo no frontend.
4. Adicionar testes específicos para os 30 dias e para mudanças de versão.
5. Definir política de regeneração quando área, leitura ou conteúdo editorial mudarem.

## 16. Perguntas recomendadas para avaliação no ChatGPT

Ao enviar este relatório, peça uma avaliação separada em quatro dimensões:

1. **Correção metodológica:** as fórmulas e associações estão coerentes com a metodologia pretendida?
2. **Personalização real:** quais entradas adicionais são necessárias para que o plano deixe de ser apenas um template contextualizado?
3. **Arquitetura:** como separar motor matemático, interpretação, recomendação e persistência do plano?
4. **Segurança de produto:** quais textos podem induzir o usuário a interpretar simbolismo como diagnóstico, previsão ou promessa?

Prompt sugerido:

> Avalie o relatório abaixo como especialista em arquitetura de software, sistemas determinísticos de recomendação e desenho responsável de produtos de autoconhecimento. Separe sua análise em: (1) correção e rastreabilidade do cálculo, (2) qualidade e profundidade da personalização, (3) riscos metodológicos e de comunicação, (4) proposta de arquitetura para gerar e versionar um plano individual após o onboarding. Não assuma como cientificamente validadas as interpretações simbólicas. Diferencie claramente cálculo, conteúdo editorial e recomendação.

## 17. Arquivos centrais auditados

- `app.js`;
- `supabase-client.js`;
- `src/domain/sincronario/engine.js`;
- `src/domain/sincronario/thirteen-moons-engine.js`;
- `src/domain/sincronario/kin-cycle-engine.js`;
- `src/domain/sincronario/synchronization-engine.js`;
- `src/domain/sincronario/coordinates-engine.js`;
- `src/domain/sincronario/knowledge.js`;
- `src/domain/sincronario/area-knowledge.js`;
- `src/domain/sincronario/area-application-knowledge.js`;
- `supabase/migrations/202606130001_initial_schema.sql`;
- `tests/sincronario-engine.test.js`;
- `tests/thirteen-moons-engine.test.js`;
- `docs/validacao-motor/README.md`.
