# Metodologia do Drive Mental para o Sincronário das 13 Luas

## Escopo e identidade

Este documento registra a metodologia estudada a partir do vídeo "Sincronário
das 13 Luas", apresentado por Vânia Temporini, e sua tradução inicial para o
Drive Mental.

O Drive Mental mantém identidade própria. O uso desta referência metodológica
não torna o aplicativo oficial, licenciado ou endossado pela apresentadora. O
produto não utiliza nome, imagem ou voz de terceiros como elemento de
representação oficial.

## Base metodológica registrada

A metodologia estudada utiliza:

- ano solar iniciado em 26 de julho;
- 13 Luas de 28 dias;
- 25 de julho como Dia Fora do Tempo;
- matriz de 260 Kins;
- Kin pessoal;
- Kin do dia;
- sete plasmas diários;
- sequência de chakras associada aos plasmas;
- quatro semanas cromáticas por Lua;
- Onda Encantada com 13 posições;
- soma e redução de Kins para sincronização;
- comparação de datas importantes para observar padrões.

O aplicativo apresenta essas informações como coordenadas de navegação
simbólica. Elas não determinam acontecimentos.

## Separação de responsabilidades

### Cálculo

São dados produzidos por regras determinísticas:

- Kin, selo, tom, cor e assinatura;
- Lua e dia da Lua;
- semana cromática;
- plasma e chakra associados ao dia;
- número e posição da Onda Encantada;
- soma e redução do Kin pessoal com o Kin do dia.

O motor de Kin permanece em `src/domain/sincronario/engine.js`. O calendário das
13 Luas não altera esse arquivo.

### Interpretação

É a explicação editorial e revisável dos dados calculados. A versão inicial é
identificada como `v0.1`, evita afirmações absolutas e não diagnostica estados
individuais de chakras.

### Aplicação prática

É a contextualização das coordenadas na área escolhida pelo usuário. A área não
participa de nenhuma fórmula. Ela altera somente o texto de aplicação e a ação
prática sugerida.

## Estado de implementação

### Implementado

- motor validado de Kin para datas regulares;
- bloqueio de `29/02`;
- calendário separado das 13 Luas;
- 13 Luas e seus conteúdos iniciais `v0.1`;
- Dia Fora do Tempo em `25/07`;
- quatro semanas cromáticas;
- sequência dos sete plasmas e chakras;
- posição estrutural na Onda Encantada;
- sincronização diária pela soma e redução de Kins;
- função estrutural de Kin harmônico para uso futuro;
- coordenadas de nascimento e do dia;
- aplicação prática por área;
- transparência entre cálculo, interpretação e aplicação.

### Parcialmente validado

- Kin, selo, tom, cor e assinatura possuem validação externa parcial já
  documentada em `docs/validacao-motor`;
- Onda Encantada é apresentada somente como posição estrutural em grupos de 13;
- conteúdos das Luas, semanas e práticas são uma base editorial inicial
  revisável.

### Ainda requer validação externa

- aprofundamentos interpretativos das 13 Luas;
- significados avançados da Onda Encantada;
- usos ampliados da soma de Kins entre pessoas ou grupos;
- correlações históricas na futura Linha do Tempo Cósmica;
- qualquer interpretação individual do estado de um chakra.

## Regras de calendário

- `26/07` inicia a Lua Magnética, dia 1.
- Cada Lua possui 28 dias.
- O ciclo possui 13 Luas, totalizando 364 dias.
- `25/07` é o Dia Fora do Tempo e não pertence a uma Lua.
- `29/02` permanece fora da geração automática de leitura.
- Dias posteriores a `29/02` em anos bissextos desconsideram esse dia na
  progressão das 13 Luas.

## Plasmas e chakras

| Posição | Plasma | Chakra associado |
| --- | --- | --- |
| 1 | Dali | Coroa |
| 2 | Seli | Raiz |
| 3 | Gama | Terceiro Olho |
| 4 | Kali | Sacral |
| 5 | Alfa | Laríngeo |
| 6 | Limi | Plexo Solar |
| 7 | Silio | Cardíaco |

A associação indica uma coordenada do ciclo. Não significa que o chakra esteja
bloqueado, ferido, drenado, hiperativo ou em qualquer estado clínico.

## Semanas cromáticas

| Dias | Semana | Função prática |
| --- | --- | --- |
| 1 a 7 | Vermelha | conhecimento, início e estudo |
| 8 a 14 | Branca | refinamento, preparo e escolha |
| 15 a 21 | Azul | ação, transformação e realização |
| 22 a 28 | Amarela | florescimento, partilha e entrega |

## Onda Encantada

A estrutura inicial divide os 260 Kins em 20 ondas consecutivas de 13 posições.
O aplicativo mostra número da onda, posição, tom, Kin inicial e Kin final. Não
atribui, nesta etapa, interpretação profunda a cada onda.

## Sincronização pessoal com o dia

O Kin pessoal e o Kin do dia são somados. Quando a soma ultrapassa 260, são
subtraídos ciclos de 260 até o resultado retornar ao intervalo de 1 a 260.

Exemplos:

- `68 + 133 = 201`;
- `236 + 133 = 369`, reduzido para `109`.

O resultado é chamado de "Kin de navegação do dia" ou "ponto de sincronização
com o dia". Não é uma previsão.

## Arquitetura futura

### Harmônica entre pessoas

`calculateHarmonicKin([kinA, kinB, ...])` soma e reduz Kins para observar a
frequência matemática gerada por um par ou grupo. Não representa compatibilidade
amorosa e ainda não aparece na interface principal.

### Linha do Tempo Cósmica

Uma futura funcionalidade poderá registrar datas importantes e calcular, para
cada uma:

- Lua e dia da Lua;
- plasma e chakra;
- Kin;
- onda e posição;
- semana cromática;
- relação com o Kin pessoal.

Essa etapa está somente preparada na arquitetura e documentada. Não há interface
completa nem armazenamento específico para esses eventos.

## Limites de uso

O conteúdo não é previsão absoluta, diagnóstico médico ou psicológico,
recomendação financeira, orientação jurídica, promessa de cura ou garantia de
prosperidade. Nenhum checkout, assinatura ou relatório pago integra esta etapa.
