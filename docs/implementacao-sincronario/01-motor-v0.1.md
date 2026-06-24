# Motor do Sincronario - implementacao v0.1

## Estado

Primeira implementacao iniciada apos a auditoria.

## O que foi implementado

- Modulo separado em `src/domain/sincronario/engine.js`.
- Calculo deterministico de Kin pelo metodo `dreamspell-wizard-count`.
- Ancora do metodo: `1987-07-26` como Kin 34, Branco Galactico Mago.
- Politica de 29 de fevereiro: `0.0 Hunab Ku`, fora da contagem regular.
- Derivacao de selo por modulo 20.
- Derivacao de tom por modulo 13.
- Assinatura derivada de cor + tom + selo.
- Onda encantada inicial por grupo de 13.
- Castelo por faixa de 52 Kin.
- Harmonica por grupo de 4 Kin.
- Contrato JSON com classificacoes e status.
- Testes automatizados de ancora, regressao basica, leap day, invalidos e contrato.

## O que ainda nao foi implementado

- Ciclos pessoais.
- Chakra relacionado por regra validada.
- Interpretacoes personalizadas avancadas.
- IA interpretativa.

## Fontes usadas para esta decisao

- Law of Time e materiais relacionados citam 26/07/1987 como Kin 34, White Galactic Wizard, inicio do Dreamspell Count.
- Fontes de calendario Dreamspell descrevem 13 tons, 20 selos e o ciclo de 260 Kin.
- Fontes sobre Dreamspell mencionam que 29/02 e tratado como dia fora da contagem regular.

## Observacao de produto

Esta implementacao ja permite substituir a ausencia total de calculo por um motor versionado e testado. Mesmo assim, a etapa de validacao com fontes escolhidas pelo produto continua necessaria antes de monetizacao.

## Atualizacao v0.2.0

Foi implementado o Oraculo do Destino completo:

- Destino.
- Guia.
- Analogo.
- Antipoda.
- Oculto.

Regras adicionadas:

- Guia por deslocamento de selo conforme tom galactico.
- Analogo por complemento de selo 19.
- Antipoda por deslocamento de 10 selos.
- Oculto por complemento de selo 21 e complemento de tom 14.

O Perfil passou a exibir um card compacto do Oraculo quando ha leitura calculada.

## Atualizacao v0.3.0

Foi implementada a Familia Terrestre derivada do selo solar.

Tabela usada:

- Polar: Serpente, Cachorro, Aguia, Sol.
- Cardinal: Dragao, Enlacador de Mundos, Macaco, Guerreiro.
- Core: Vento, Mao, Humano, Terra.
- Signal: Noite, Estrela, Caminhante do Ceu, Espelho.
- Gateway: Semente, Lua, Mago, Tormenta.

Regras adicionadas:

- Familia Terrestre por tabela de selo solar.
- Campo `personal_map.earth_family` no contrato retornado pelo motor.
- Exibicao de Familia no card "Mapa Galactico Inicial" do Perfil.

Base tecnica usada:

- Law of Time - Rainbow Science Primer: `https://www.lawoftime.org/rainbow-bridge/rainbow-science.html`
- Law of Time - Exploring the Synchronic Order Level 1: `https://lawoftime.org/lawoftime/level1.html`

## Atualizacao v0.4.0

Foi implementada a relacao entre Kin pessoal e Kin do dia.

Campos adicionados:

- `daily.earth_family`, derivado do selo do Kin do dia.
- `daily.relationship_to_personal_kin`, com relacao estrutural entre o mapa pessoal e o dia corrente.

O calculo da relacao considera:

- Distancia do Kin do dia em relacao ao Kin pessoal no ciclo de 260.
- Distancia de selo no ciclo de 20.
- Distancia de tom no ciclo de 13.
- Coincidencia de Kin, selo, tom, cor e Familia Terrestre.
- Coincidencia do Kin do dia com algum ponto do Oraculo pessoal: Destino, Guia, Analogo, Antipoda ou Oculto.

Ordem de prioridade do resumo (`value`):

1. Mesmo Kin pessoal.
2. Ponto do Oraculo pessoal.
3. Mesmo selo solar.
4. Mesmo tom galactico.
5. Mesma cor.
6. Mesma Familia Terrestre.
7. Distancia calculada no ciclo.

O Perfil passou a exibir o card "Energia do Dia" com Kin do dia, selo, tom, resumo da relacao e distancia no ciclo.

Base tecnica usada: esta etapa nao adiciona uma nova regra cosmologica externa; ela deriva relacoes estruturais a partir de regras ja implementadas no motor v0.1-v0.3.

## Atualizacao v0.5.0

Foi implementada a Base de Conhecimento inicial em modulo separado:

- Arquivo: `src/domain/sincronario/knowledge.js`.
- Nome: `drive-astral-sincronario-knowledge-base`.
- Versao: `0.5.0`.

Esta camada nao altera o motor matematico. O motor permanece responsavel por calculo; a base de conhecimento recebe a leitura calculada e adiciona orientacoes textuais estruturadas.

Campos adicionados pela base:

- `knowledge_base`, com versao, status, fontes e regras editoriais aplicadas.
- `input.focus_area`, derivado do tema escolhido pelo usuario.
- `guidance.personal`, com potencial, ponto de atencao, pergunta e pratica.
- `guidance.daily`, com foco do Kin do dia, relacao com o Kin pessoal, pergunta e pratica.
- `guidance.safety_note`, deixando claro que o conteudo e reflexivo e simbolico.

Areas iniciais:

- Geral.
- Financas.
- Relacionamentos.

Regras adicionadas:

- `seal-tone-guidance-template-v0.5`.
- `daily-guidance-template-v0.5`.
- `focus-area-guidance-v0.5`.
- `relationship-guidance-copy-v0.5`.

O app passou a carregar `knowledge.js` e a exibir o card "Leitura Inicial" apos a sintonia, na tela de resultado.

Base tecnica usada: textos deterministas derivados das palavras-chave de selo, tom, Kin do dia e relacao diaria ja calculadas pelo motor. Nao ha IA em tempo de execucao.

## Atualizacao v0.6.0

Foi conectada a experiencia gratuita real ao motor e a base de conhecimento.

Mudancas no app:

- Campo de intencao da consulta no formulario inicial.
- Seletor de area com Geral, Financas e Relacionamentos.
- Consentimento explicito para salvar nome, data, intencao, leitura e historico no navegador.
- Tela pos-sintonia com Resultado Calculado, Leitura Inicial, Intencao Declarada e Transparencia.
- Transparencia separando calculado, interpretado e pendente.
- Mensagem clara de que estados individuais dos chakras ainda nao possuem regra validada.
- Acao de limpar dados locais no Perfil.

Esta etapa reduz o risco de a interface parecer mais personalizada do que o motor sustenta. O mapa dos chakras continua visual e deve receber regra validada ou questionario antes de assumir diagnostico individual.

## Atualizacao v0.6.1

O formulario inicial passou a coletar apenas nome, data de nascimento e area da leitura.

Mudancas no app:

- Removidos o campo de intencao e o checkbox de consentimento da sintonia inicial.
- Areas de leitura centralizadas em lista unica, persistidas por `selectedAreaId`.
- Areas novas usam o `focus_area` validado mais proximo, preservando o motor existente.
- Salvamento local ocorre somente apos uma sintonia valida, junto com leitura e historico.
- Perfil mantem a acao de limpar dados locais do navegador.

## Auditoria de resultado antes de refinamento visual

Antes de qualquer mudanca no motor, foram documentados os resultados de referencia usados na tela de Resultado da Sintonia.

Casos de validacao executados localmente:

- `1987-07-26` -> Kin 34, Branco Galactico Mago. Este e o caso ancora ja usado pelo motor e citado em fontes do sistema Dreamspell/13 Luas como inicio do Dreamspell Count.
- `1987-07-25` -> Kin 33, Vermelho Ressonante Caminhante do Ceu.
- `1987-07-27` -> Kin 35, Azul Solar Aguia.
- `1996-06-25` -> Kin 168, Amarelo Cristal Estrela.
- `2026-06-05` -> Kin 178, Branco Solar Espelho.

Achados de apresentacao:

- A tela misturava campos calculados, relacoes derivadas e textos interpretativos no mesmo card.
- A base de conhecimento ainda gerava frases por concatenacao de palavras-chave, por exemplo `Equalizar morte com manifestacao e producao`.
- O Kin do dia 178 gerava sintese mecanica baseada em palavras-chave.
- O titulo de detalhes dos chakras exibia codigo hexadecimal de cor, o que deve ser removido da interface visivel.

Decisao desta etapa:

- Nao alterar o motor matematico.
- Refinar apenas a apresentacao e a camada textual/editorial da tela de resultado.
- Manter classificacoes visuais separadas entre calculado, derivado e interpretativo.
