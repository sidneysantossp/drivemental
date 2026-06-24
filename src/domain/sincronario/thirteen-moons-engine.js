(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
    return;
  }

  root.DriveAstralThirteenMoons = factory().ThirteenMoonsEngine;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const ENGINE_VERSION = "0.1.0";
  const MS_PER_DAY = 24 * 60 * 60 * 1000;

  const MOONS = Object.freeze([
    {
      number: 1,
      name: "Lua Magnética",
      guiding_question: "Qual é o meu propósito?",
      symbolic_function: "Atração e início",
      practical_application: "observar o que chega e definir o propósito do ciclo",
      short_description: "Abertura do ciclo e reconhecimento do que pede atenção.",
      expanded_description: "Versão v0.1: identifica o início do ciclo, o que se aproxima e o propósito que pode organizar os próximos movimentos.",
    },
    {
      number: 2,
      name: "Lua Lunar",
      guiding_question: "Qual é o meu desafio?",
      symbolic_function: "Discernimento e polarização",
      practical_application: "separar o que permanece do que precisa sair",
      short_description: "Leitura dos desafios e escolhas que pedem discernimento.",
      expanded_description: "Versão v0.1: apoia a observação de tensões, contrastes e escolhas sem transformar o desafio em previsão.",
    },
    {
      number: 3,
      name: "Lua Elétrica",
      guiding_question: "Como posso servir?",
      symbolic_function: "Serviço e ativação",
      practical_application: "ativar uma contribuição concreta e útil",
      short_description: "Movimento de serviço, vínculo e entrega ao próximo.",
      expanded_description: "Versão v0.1: convida a transformar intenção em contribuição prática, respeitando limites e contexto.",
    },
    {
      number: 4,
      name: "Lua Autoexistente",
      guiding_question: "Qual é a forma da ação?",
      symbolic_function: "Forma e definição",
      practical_application: "definir estrutura, método e limites",
      short_description: "Definição de como algo será organizado e realizado.",
      expanded_description: "Versão v0.1: favorece dar forma ao processo, nomear etapas e tornar a intenção compreensível.",
    },
    {
      number: 5,
      name: "Lua Harmônica",
      guiding_question: "Como reunir os melhores recursos?",
      symbolic_function: "Recursos e sustentação",
      practical_application: "reunir recursos e sustentar o que foi definido",
      short_description: "Organização dos recursos necessários para sustentar o ciclo.",
      expanded_description: "Versão v0.1: orienta a reconhecer recursos, responsabilidades e condições de sustentação.",
    },
    {
      number: 6,
      name: "Lua Rítmica",
      guiding_question: "Como organizar para equilibrar?",
      symbolic_function: "Organização e equilíbrio",
      practical_application: "organizar o ritmo e preparar a entrega",
      short_description: "Equilíbrio da rotina e preparação antes da entrega.",
      expanded_description: "Versão v0.1: convida a ajustar ritmo, ordem e distribuição de tarefas para reduzir dispersão.",
    },
    {
      number: 7,
      name: "Lua Ressonante",
      guiding_question: "Como sintonizar o meu serviço?",
      symbolic_function: "Inspiração e alinhamento",
      practical_application: "escutar, alinhar e reconhecer a inspiração disponível",
      short_description: "Sintonização com inspiração, escuta e direção interior.",
      expanded_description: "Versão v0.1: favorece uma pausa de escuta para alinhar ação, valores e significado.",
    },
    {
      number: 8,
      name: "Lua Galáctica",
      guiding_question: "Eu vivo aquilo em que acredito?",
      symbolic_function: "Integridade e coerência",
      practical_application: "alinhar fala, valores e comportamento",
      short_description: "Coerência entre o que se vive, se diz e se sustenta.",
      expanded_description: "Versão v0.1: convida a revisar a integridade das escolhas sem impor uma resposta moral absoluta.",
    },
    {
      number: 9,
      name: "Lua Solar",
      guiding_question: "Como realizar o meu propósito?",
      symbolic_function: "Intenção e realização",
      practical_application: "firmar a intenção e direcionar a realização",
      short_description: "Intenção sustentada para aproximar propósito e realização.",
      expanded_description: "Versão v0.1: orienta a escolher uma intenção clara e acompanhar como ela se expressa em ações.",
    },
    {
      number: 10,
      name: "Lua Planetária",
      guiding_question: "Como aperfeiçoar o que faço?",
      symbolic_function: "Manifestação e concretização",
      practical_application: "concretizar e entregar com estrutura",
      short_description: "Concretização, aperfeiçoamento e entrega estruturada.",
      expanded_description: "Versão v0.1: favorece concluir, revisar e apresentar uma entrega de maneira objetiva.",
    },
    {
      number: 11,
      name: "Lua Espectral",
      guiding_question: "Como liberar e deixar ir?",
      symbolic_function: "Liberação e expansão",
      practical_application: "liberar, divulgar e ampliar a circulação",
      short_description: "Liberação do que cumpriu sua função e expansão do que pode circular.",
      expanded_description: "Versão v0.1: convida a soltar controles desnecessários e permitir que uma entrega alcance novos espaços.",
    },
    {
      number: 12,
      name: "Lua Cristal",
      guiding_question: "Como cooperar com os outros?",
      symbolic_function: "Cooperação e partilha",
      practical_application: "compartilhar, cooperar e fortalecer a comunidade",
      short_description: "Partilha, cooperação e construção em comunidade.",
      expanded_description: "Versão v0.1: orienta a reunir perspectivas e distribuir aprendizados de forma colaborativa.",
    },
    {
      number: 13,
      name: "Lua Cósmica",
      guiding_question: "Como ampliar minha presença?",
      symbolic_function: "Transcendência e presença",
      practical_application: "incorporar aprendizados e concluir o ciclo",
      short_description: "Fechamento do ciclo, presença e incorporação do aprendizado.",
      expanded_description: "Versão v0.1: favorece reconhecer o percurso, integrar o que foi vivido e preparar a passagem de ciclo.",
    },
  ].map(Object.freeze));

  const CHROMATIC_WEEKS = Object.freeze([
    {
      number: 1,
      name: "Semana Vermelha",
      color: "Vermelha",
      day_range: [1, 7],
      meaning: "Conhecimento, início e estudo",
      practical_guidance: "Estude, observe e reúna informações antes de agir.",
    },
    {
      number: 2,
      name: "Semana Branca",
      color: "Branca",
      day_range: [8, 14],
      meaning: "Refinamento, preparo e escolha",
      practical_guidance: "Refine escolhas, organize recursos e prepare o próximo movimento.",
    },
    {
      number: 3,
      name: "Semana Azul",
      color: "Azul",
      day_range: [15, 21],
      meaning: "Ação, transformação e realização",
      practical_guidance: "Coloque a mão na massa e transforme intenção em movimento.",
    },
    {
      number: 4,
      name: "Semana Amarela",
      color: "Amarela",
      day_range: [22, 28],
      meaning: "Florescimento, partilha e entrega",
      practical_guidance: "Compartilhe, entregue e distribua o que foi desenvolvido.",
    },
  ].map(Object.freeze));

  const PLASMAS = Object.freeze([
    {
      number: 1,
      name: "Dali",
      chakra: "Coroa",
      chakra_label: "Coroa",
      observation_guidance: "observar propósito, sentido e visão ampla",
    },
    {
      number: 2,
      name: "Seli",
      chakra: "Raiz",
      chakra_label: "Raiz",
      observation_guidance: "observar base, rotina e sustentação",
    },
    {
      number: 3,
      name: "Gama",
      chakra: "Terceiro Olho",
      chakra_label: "Terceiro Olho",
      observation_guidance: "observar clareza, padrões e discernimento",
    },
    {
      number: 4,
      name: "Kali",
      chakra: "Sacral",
      chakra_label: "Sexual / Sacral",
      observation_guidance: "observar criatividade, emoções e capacidade de adaptação",
    },
    {
      number: 5,
      name: "Alfa",
      chakra: "Laríngeo",
      chakra_label: "Garganta / Laríngeo",
      observation_guidance: "observar comunicação, expressão e coerência da fala",
    },
    {
      number: 6,
      name: "Limi",
      chakra: "Plexo Solar",
      chakra_label: "Plexo Solar",
      observation_guidance: "observar foco, iniciativa e uso consciente da energia",
    },
    {
      number: 7,
      name: "Silio",
      chakra: "Cardíaco",
      chakra_label: "Coração / Cardíaco",
      observation_guidance: "observar cuidado, cooperação e limites",
    },
  ].map(Object.freeze));

  function parseDateOnly(value) {
    if (typeof value !== "string") {
      return { error: "DATE_MUST_BE_STRING" };
    }

    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!match) {
      return { error: "DATE_FORMAT_INVALID" };
    }

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const date = new Date(Date.UTC(year, month - 1, day));

    if (
      date.getUTCFullYear() !== year
      || date.getUTCMonth() !== month - 1
      || date.getUTCDate() !== day
    ) {
      return { error: "DATE_INVALID" };
    }

    return { year, month, day, date };
  }

  function isLeapYear(year) {
    return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  }

  function dateToUtcMs(parts) {
    return Date.UTC(parts.year, parts.month - 1, parts.day);
  }

  function calendarDayDifference(startParts, endParts) {
    return Math.round((dateToUtcMs(endParts) - dateToUtcMs(startParts)) / MS_PER_DAY);
  }

  function countLeapDaysInHalfOpenRange(startParts, endParts) {
    let count = 0;

    for (let year = startParts.year; year <= endParts.year; year += 1) {
      if (!isLeapYear(year)) continue;
      const leapDayMs = Date.UTC(year, 1, 29);
      if (leapDayMs >= dateToUtcMs(startParts) && leapDayMs < dateToUtcMs(endParts)) {
        count += 1;
      }
    }

    return count;
  }

  function formatDate(parts) {
    return [
      String(parts.year).padStart(4, "0"),
      String(parts.month).padStart(2, "0"),
      String(parts.day).padStart(2, "0"),
    ].join("-");
  }

  function solarRingForDate(parts) {
    const startsThisYear = parts.month > 7 || (parts.month === 7 && parts.day >= 26);
    const startYear = startsThisYear ? parts.year : parts.year - 1;

    return {
      start_year: startYear,
      end_year: startYear + 1,
      label: `${startYear}-${startYear + 1}`,
      start_date: `${startYear}-07-26`,
      end_date: `${startYear + 1}-07-25`,
    };
  }

  function invalidResult(referenceDate, errorCode) {
    return {
      engine: { name: "thirteen-moons-engine", version: ENGINE_VERSION },
      reference_date: referenceDate || null,
      status: "invalido",
      validation_errors: [{ field: "date", code: errorCode }],
      warnings: [],
    };
  }

  function calculateForDate(dateValue) {
    const parsed = parseDateOnly(dateValue);
    if (parsed.error) {
      return invalidResult(dateValue, parsed.error);
    }

    const solarRing = solarRingForDate(parsed);

    if (parsed.month === 2 && parsed.day === 29) {
      return {
        engine: { name: "thirteen-moons-engine", version: ENGINE_VERSION },
        reference_date: dateValue,
        solar_ring: solarRing,
        is_day_out_of_time: false,
        status: "fora_da_contagem",
        validation_errors: [],
        warnings: [{ code: "LEAP_DAY_0_0_HUNAB_KU" }],
      };
    }

    if (parsed.month === 7 && parsed.day === 25) {
      return {
        engine: { name: "thirteen-moons-engine", version: ENGINE_VERSION },
        reference_date: dateValue,
        solar_ring: solarRing,
        is_day_out_of_time: true,
        day_out_of_time: {
          name: "Dia Fora do Tempo",
          description: "Dia de transição entre o encerramento das 13 Luas e o novo anel solar.",
        },
        moon: null,
        moon_day: null,
        chromatic_week: null,
        plasma: null,
        chakra: null,
        plasma_cycle_position: null,
        status: "calculado_especial",
        validation_errors: [],
        warnings: [],
      };
    }

    const startParts = parseDateOnly(solarRing.start_date);
    const rawElapsed = calendarDayDifference(startParts, parsed);
    const skippedLeapDays = countLeapDaysInHalfOpenRange(startParts, parsed);
    const elapsed = rawElapsed - skippedLeapDays;

    if (elapsed < 0 || elapsed >= 364) {
      return invalidResult(dateValue, "DATE_OUTSIDE_SOLAR_RING");
    }

    const moonIndex = Math.floor(elapsed / 28);
    const moonDay = (elapsed % 28) + 1;
    const weekIndex = Math.floor((moonDay - 1) / 7);
    const plasmaIndex = (moonDay - 1) % 7;
    const moon = MOONS[moonIndex];
    const week = CHROMATIC_WEEKS[weekIndex];
    const plasma = PLASMAS[plasmaIndex];

    return {
      engine: { name: "thirteen-moons-engine", version: ENGINE_VERSION },
      reference_date: formatDate(parsed),
      solar_ring: solarRing,
      is_day_out_of_time: false,
      moon,
      moon_day: moonDay,
      chromatic_week: week,
      plasma: {
        number: plasma.number,
        name: plasma.name,
      },
      chakra: {
        name: plasma.chakra,
        label: plasma.chakra_label,
        observation_guidance: plasma.observation_guidance,
        safety_note: "Esta coordenada não diagnostica o estado individual do chakra.",
      },
      plasma_cycle_position: plasma.number,
      cycle_day: elapsed + 1,
      status: "calculado",
      validation_errors: [],
      warnings: [],
      rule_id: "thirteen-moons-from-july-26-v0.1",
    };
  }

  return {
    ThirteenMoonsEngine: {
      calculateForDate,
      constants: {
        ENGINE_VERSION,
        MOONS,
        CHROMATIC_WEEKS,
        PLASMAS,
      },
    },
  };
});
