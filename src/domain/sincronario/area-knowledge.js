(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    const { AreaApplicationKnowledge } = require("./area-application-knowledge.js");
    module.exports = factory(AreaApplicationKnowledge);
    return;
  }

  root.DriveAstralAreaKnowledge = factory(
    root.DriveAstralAreaApplicationKnowledge,
  ).AreaKnowledge;
})(typeof globalThis !== "undefined" ? globalThis : this, function (AreaApplicationKnowledge) {
  const contentVersion = "area-knowledge-v0.3";

  const areaKnowledge = Object.freeze({
    general: Object.freeze({
      title: "Visão Geral",
      intent: "Oferecer uma leitura ampla sobre o momento atual.",
      synthesisFocus: Object.freeze([
        "Nesta leitura de Visão Geral, a assinatura pessoal {personalSignature}, formada pelo selo {sealName} e pelo tom {toneName}, convida você a observar o momento atual de forma ampla. Simbolicamente, essa combinação pode favorecer a percepção de padrões, prioridades e movimentos que merecem mais presença.",
        "O Kin do dia {dailyKin}, {dailySignature}, acrescenta uma referência para o agora. A relação derivada {relationshipLabel} pode indicar um ponto de observação entre seu mapa pessoal e a energia do dia, sem determinar acontecimentos ou resultados.",
      ]),
      reflectionQuestion: "Qual padrão tem se repetido na sua vida e pede uma nova forma de presença?",
      suggestedPractice: "Escolha um ponto da sua rotina para observar hoje sem tentar controlar imediatamente.",
    }),
    purpose: Object.freeze({
      title: "Propósito e Direção",
      intent: "Relacionar o mapa pessoal com missão, talentos e caminhos possíveis.",
      synthesisFocus: Object.freeze([
        "Nesta leitura voltada para Propósito e Direção, a assinatura pessoal {personalSignature} reúne o selo {sealName} e o tom {toneName}. Essa combinação pode favorecer uma reflexão sobre talentos, valores e caminhos que fazem sentido, sem transformar propósito em uma resposta fixa ou definitiva.",
        "O Kin do dia {dailyKin}, {dailySignature}, convida a perceber qual direção pede presença agora. A relação derivada {relationshipLabel} pode ajudar a observar o que precisa ser integrado, encerrado ou amadurecido antes do próximo passo.",
      ]),
      reflectionQuestion: "O que você sente que precisa encerrar para caminhar com mais verdade na direção do seu propósito?",
      suggestedPractice: "Escreva três atividades que fazem você sentir sentido e três que apenas consomem sua energia.",
    }),
    "work-prosperity": Object.freeze({
      title: "Trabalho e Prosperidade",
      intent: "Relacionar o mapa pessoal com carreira, projetos, dinheiro e realização.",
      synthesisFocus: Object.freeze([
        "Nesta leitura voltada para Trabalho e Prosperidade, a assinatura pessoal {personalSignature}, com o selo {sealName} e o tom {toneName}, pode favorecer a revisão de projetos, prioridades materiais e formas de produzir com mais clareza. O foco não é prever resultados financeiros, mas observar como organização, encerramento de etapas e presença podem apoiar escolhas concretas.",
        "O Kin do dia {dailyKin}, {dailySignature}, convida à reflexão antes da ação. A relação derivada {relationshipLabel} pode indicar que decisões profissionais ou financeiras ganham mais consistência quando são examinadas com ordem, critério e atenção ao momento atual.",
      ]),
      reflectionQuestion: "Qual projeto, hábito ou decisão material precisa de mais ordem antes de crescer?",
      suggestedPractice: "Escolha uma ação concreta e simples para organizar sua vida material: revisar uma pendência, planejar um pagamento ou concluir uma etapa de projeto.",
    }),
    "love-relationships": Object.freeze({
      title: "Amor e Relacionamentos",
      intent: "Relacionar o mapa pessoal com vínculos, padrões afetivos e convivência.",
      synthesisFocus: Object.freeze([
        "Nesta leitura voltada para Amor e Relacionamentos, a assinatura pessoal {personalSignature}, formada pelo selo {sealName} e pelo tom {toneName}, convida você a observar vínculos, padrões afetivos e formas de convivência com mais presença e verdade. O tema central não é prever uma relação, mas perceber o que pede maturidade, limite ou renovação.",
        "O Kin do dia {dailyKin}, {dailySignature}, acrescenta uma lente para as trocas de hoje. A relação derivada {relationshipLabel} pode favorecer uma pausa antes de reagir e uma comunicação mais consciente sobre necessidades, acordos e limites.",
      ]),
      reflectionQuestion: "Que padrão relacional está pedindo mais consciência, limite ou renovação?",
      suggestedPractice: "Antes de responder impulsivamente a alguém, faça uma pausa e pergunte: o que eu realmente quero comunicar?",
    }),
    "challenges-blocks": Object.freeze({
      title: "Desafios e Bloqueios",
      intent: "Relacionar o mapa pessoal com padrões repetitivos e pontos de transformação.",
      synthesisFocus: Object.freeze([
        "Nesta leitura voltada para Desafios e Bloqueios, a assinatura pessoal {personalSignature}, com o selo {sealName} e o tom {toneName}, convida você a observar padrões repetitivos sem transformar a reflexão em julgamento. Simbolicamente, a combinação pode indicar onde insistência, medo ou excesso de controle estão dificultando uma mudança possível.",
        "O Kin do dia {dailyKin}, {dailySignature}, oferece uma referência para reconhecer pequenas aberturas no presente. A relação derivada {relationshipLabel} pode favorecer a identificação de um gesto simples capaz de interromper uma repetição e criar outra resposta.",
      ]),
      reflectionQuestion: "O que você vem tentando manter, mesmo já percebendo que esse ciclo precisa mudar?",
      suggestedPractice: "Anote um padrão que se repete e escreva qual pequeno gesto pode interrompê-lo hoje.",
    }),
    "energy-spirituality": Object.freeze({
      title: "Energia e Espiritualidade",
      intent: "Relacionar o mapa pessoal com equilíbrio, consciência e conexão interior.",
      synthesisFocus: Object.freeze([
        "Nesta leitura voltada para Energia e Espiritualidade, a assinatura pessoal {personalSignature}, formada pelo selo {sealName} e pelo tom {toneName}, pode favorecer uma escuta mais silenciosa sobre presença, sentido e coerência interior. A leitura é simbólica e não mede seu estado espiritual ou energético.",
        "O Kin do dia {dailyKin}, {dailySignature}, convida a reduzir o ruído e perceber a qualidade da intenção sustentada hoje. A relação derivada {relationshipLabel} pode servir como reflexão sobre ritmo, atenção e conexão com aquilo que você considera essencial.",
      ]),
      reflectionQuestion: "Que prática simples poderia reconectar você com presença, silêncio e sentido hoje?",
      suggestedPractice: "Reserve três minutos para respirar em silêncio e observar qual intenção deseja sustentar no dia.",
    }),
    "decisions-cycles": Object.freeze({
      title: "Decisões e Ciclos",
      intent: "Relacionar o mapa pessoal com escolhas, momento atual e próximos movimentos.",
      synthesisFocus: Object.freeze([
        "Nesta leitura voltada para Decisões e Ciclos, a assinatura pessoal {personalSignature}, com o selo {sealName} e o tom {toneName}, convida você a observar o que está terminando, o que ainda precisa amadurecer e qual escolha merece mais clareza. Simbolicamente, a leitura pode favorecer decisões menos impulsivas e mais coerentes com o momento.",
        "O Kin do dia {dailyKin}, {dailySignature}, acrescenta uma referência para o próximo movimento. A relação derivada {relationshipLabel} pode indicar que comparar custos, limites e consequências ajuda a escolher com mais presença, sem transformar a leitura em previsão.",
      ]),
      reflectionQuestion: "Qual decisão pede menos impulso e mais escuta antes do próximo movimento?",
      suggestedPractice: "Liste duas opções, o custo de cada uma e o que cada escolha exige de você agora.",
    }),
  });

  const areaAliases = Object.freeze({
    geral: "general",
    general: "general",
    purpose: "purpose",
    proposito: "purpose",
    financas: "work-prosperity",
    finance: "work-prosperity",
    financial: "work-prosperity",
    "work-prosperity": "work-prosperity",
    relacionamentos: "love-relationships",
    relationship: "love-relationships",
    relationships: "love-relationships",
    "love-relationships": "love-relationships",
    "challenges-blocks": "challenges-blocks",
    "energy-spirituality": "energy-spirituality",
    "decisions-cycles": "decisions-cycles",
  });

  function normalizeAreaId(value) {
    const requestedAreaId = String(value || "general").trim().toLowerCase();
    const normalizedAreaId = areaAliases[requestedAreaId] || requestedAreaId;
    const contentFallbackUsed = !Object.prototype.hasOwnProperty.call(areaKnowledge, normalizedAreaId);
    const areaId = contentFallbackUsed ? "general" : normalizedAreaId;

    return {
      areaId,
      requestedAreaId,
      contentFallbackUsed,
      content: areaKnowledge[areaId],
    };
  }

  function fillTemplate(template, values) {
    return template.replace(/\{([a-zA-Z]+)\}/g, (_match, key) => String(values[key] || ""));
  }

  function buildCoordinateApplication(reading, normalized) {
    const coordinates = reading && reading.coordinates ? reading.coordinates : {};
    const dayCoordinates = coordinates.day && coordinates.day.thirteen_moons
      ? coordinates.day.thirteen_moons
      : {};
    const synchronization = coordinates.synchronization || {};
    const daily = reading && reading.daily ? reading.daily : {};
    const moon = dayCoordinates.moon || {};
    const week = dayCoordinates.chromatic_week || {};
    const plasma = dayCoordinates.plasma || {};
    const chakra = dayCoordinates.chakra || {};
    const dailySeal = daily.seal || {};
    const dailyTone = daily.tone || {};

    if (!moon.name || !week.name || !plasma.name || !synchronization.synchronizedKin) {
      return null;
    }

    const application = AreaApplicationKnowledge.buildApplication({
      areaId: normalized.areaId,
      moonName: moon.name,
      moonNumber: moon.number,
      weekName: week.name,
      weekNumber: week.number,
      plasmaName: plasma.name,
      plasmaNumber: plasma.number,
      chakraName: chakra.label || chakra.name,
      navigationKin: synchronization.synchronizedKin,
      dailyTone: dailyTone.name || "não disponível",
      dailySeal: dailySeal.name || "não disponível",
    });

    return {
      applicationSummary: application.applicationSummary,
      reflectionQuestion: application.reflectionQuestion,
      dailyPractice: application.dailyPractice,
      coordinatesUsed: {
        moon: moon.name,
        moonDay: dayCoordinates.moon_day,
        week: week.name,
        plasma: plasma.name,
        chakra: chakra.label || chakra.name,
        synchronizedKin: synchronization.synchronizedKin,
        dailyTone: dailyTone.name || null,
        dailySeal: dailySeal.name || null,
      },
    };
  }

  function buildInterpretation(reading, requestedAreaId) {
    const normalized = normalizeAreaId(requestedAreaId);
    const personal = reading && reading.personal_map ? reading.personal_map : {};
    const daily = reading && reading.daily ? reading.daily : {};
    const relationship = daily.relationship_to_personal_kin || {};
    const values = {
      personalSignature: personal.signature && personal.signature.value
        ? personal.signature.value
        : "assinatura não disponível",
      sealName: personal.seal && personal.seal.name ? personal.seal.name : "não disponível",
      toneName: personal.tone && personal.tone.name ? personal.tone.name : "não disponível",
      dailyKin: daily.kin_of_day && daily.kin_of_day.value ? daily.kin_of_day.value : "não disponível",
      dailySignature: daily.signature && daily.signature.value
        ? daily.signature.value
        : "assinatura do dia não disponível",
      relationshipLabel: relationship.label
        ? `"${relationship.label}"`
        : "\"relação no ciclo\"",
    };

    const coordinateApplication = buildCoordinateApplication(reading, normalized);
    const legacySynthesis = normalized.content.synthesisFocus
      .map((paragraph) => fillTemplate(paragraph, values))
      .join("\n\n");

    return {
      areaId: normalized.areaId,
      areaTitle: normalized.content.title,
      contentVersion,
      synthesis: coordinateApplication
        ? coordinateApplication.applicationSummary
        : legacySynthesis,
      reflectionQuestion: coordinateApplication
        ? coordinateApplication.reflectionQuestion
        : normalized.content.reflectionQuestion,
      suggestedPractice: coordinateApplication
        ? coordinateApplication.dailyPractice
        : normalized.content.suggestedPractice,
      applicationSummary: coordinateApplication
        ? coordinateApplication.applicationSummary
        : legacySynthesis,
      dailyPractice: coordinateApplication
        ? coordinateApplication.dailyPractice
        : normalized.content.suggestedPractice,
      coordinatesUsed: coordinateApplication ? coordinateApplication.coordinatesUsed : null,
      contentFallbackUsed: normalized.contentFallbackUsed,
    };
  }

  return {
    AreaKnowledge: {
      areaKnowledge,
      areaApplications: AreaApplicationKnowledge.areaApplicationKnowledge,
      contentVersion,
      normalizeAreaId,
      buildInterpretation,
    },
  };
});
