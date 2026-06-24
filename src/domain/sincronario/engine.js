(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
    return;
  }

  root.DriveAstralSincronario = factory().SincronarioEngine;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const ENGINE_VERSION = "0.4.0";
  const METHOD_ID = "dreamspell-wizard-count";
  const ANCHOR = Object.freeze({
    date: "1987-07-26",
    kin: 34,
    signature: "Branco Galactico Mago",
  });

  const TONES = Object.freeze([
    { number: 1, name: "Magnetico", power: "Proposito", action: "Unificar", essence: "Atracao" },
    { number: 2, name: "Lunar", power: "Desafio", action: "Polarizar", essence: "Estabilizacao" },
    { number: 3, name: "Eletrico", power: "Servico", action: "Ativar", essence: "Vinculo" },
    { number: 4, name: "Autoexistente", power: "Forma", action: "Definir", essence: "Medida" },
    { number: 5, name: "Entonado", power: "Radiancia", action: "Empoderar", essence: "Comando" },
    { number: 6, name: "Ritmico", power: "Igualdade", action: "Organizar", essence: "Equilibrio" },
    { number: 7, name: "Ressonante", power: "Sintonia", action: "Canalizar", essence: "Inspiracao" },
    { number: 8, name: "Galactico", power: "Integridade", action: "Harmonizar", essence: "Modelagem" },
    { number: 9, name: "Solar", power: "Intencao", action: "Pulsar", essence: "Realizacao" },
    { number: 10, name: "Planetario", power: "Manifestacao", action: "Aperfeicoar", essence: "Producao" },
    { number: 11, name: "Espectral", power: "Liberacao", action: "Dissolver", essence: "Soltura" },
    { number: 12, name: "Cristal", power: "Cooperacao", action: "Dedicar", essence: "Universalizacao" },
    { number: 13, name: "Cosmico", power: "Presenca", action: "Perdurar", essence: "Transcendencia" },
  ]);

  const SEALS = Object.freeze([
    { number: 1, name: "Dragao", color: "Vermelho", colorHex: "#EF3B2D", power: "Nascimento", action: "Nutrir", essence: "Ser" },
    { number: 2, name: "Vento", color: "Branco", colorHex: "#F3E4C3", power: "Espirito", action: "Comunicar", essence: "Respiracao" },
    { number: 3, name: "Noite", color: "Azul", colorHex: "#5145C6", power: "Abundancia", action: "Sonhar", essence: "Intuicao" },
    { number: 4, name: "Semente", color: "Amarelo", colorHex: "#F5B51B", power: "Florescimento", action: "Focalizar", essence: "Consciencia" },
    { number: 5, name: "Serpente", color: "Vermelho", colorHex: "#EF3B2D", power: "Forca Vital", action: "Sobreviver", essence: "Instinto" },
    { number: 6, name: "Enlacador de Mundos", color: "Branco", colorHex: "#F3E4C3", power: "Morte", action: "Equalizar", essence: "Oportunidade" },
    { number: 7, name: "Mao", color: "Azul", colorHex: "#5145C6", power: "Realizacao", action: "Conhecer", essence: "Cura" },
    { number: 8, name: "Estrela", color: "Amarelo", colorHex: "#F5B51B", power: "Elegancia", action: "Embelezar", essence: "Arte" },
    { number: 9, name: "Lua", color: "Vermelho", colorHex: "#EF3B2D", power: "Agua Universal", action: "Purificar", essence: "Fluxo" },
    { number: 10, name: "Cachorro", color: "Branco", colorHex: "#F3E4C3", power: "Coracao", action: "Amar", essence: "Lealdade" },
    { number: 11, name: "Macaco", color: "Azul", colorHex: "#5145C6", power: "Magia", action: "Brincar", essence: "Ilusao" },
    { number: 12, name: "Humano", color: "Amarelo", colorHex: "#F5B51B", power: "Livre-Arbitrio", action: "Influenciar", essence: "Sabedoria" },
    { number: 13, name: "Caminhante do Ceu", color: "Vermelho", colorHex: "#EF3B2D", power: "Espaco", action: "Explorar", essence: "Vigilia" },
    { number: 14, name: "Mago", color: "Branco", colorHex: "#F3E4C3", power: "Atemporalidade", action: "Encantar", essence: "Receptividade" },
    { number: 15, name: "Aguia", color: "Azul", colorHex: "#5145C6", power: "Visao", action: "Criar", essence: "Mente" },
    { number: 16, name: "Guerreiro", color: "Amarelo", colorHex: "#F5B51B", power: "Inteligencia", action: "Questionar", essence: "Destemor" },
    { number: 17, name: "Terra", color: "Vermelho", colorHex: "#EF3B2D", power: "Navegacao", action: "Evoluir", essence: "Sincronicidade" },
    { number: 18, name: "Espelho", color: "Branco", colorHex: "#F3E4C3", power: "Infinito", action: "Refletir", essence: "Ordem" },
    { number: 19, name: "Tormenta", color: "Azul", colorHex: "#5145C6", power: "Autogeracao", action: "Catalisar", essence: "Energia" },
    { number: 20, name: "Sol", color: "Amarelo", colorHex: "#F5B51B", power: "Fogo Universal", action: "Iluminar", essence: "Vida" },
  ]);

  const CASTLES = Object.freeze([
    { number: 1, name: "Vermelho Oriental", range: [1, 52] },
    { number: 2, name: "Branco Norte", range: [53, 104] },
    { number: 3, name: "Azul Ocidental", range: [105, 156] },
    { number: 4, name: "Amarelo Sul", range: [157, 208] },
    { number: 5, name: "Verde Central", range: [209, 260] },
  ]);

  const EARTH_FAMILIES = Object.freeze([
    { key: "polar", name: "Polar", seal_numbers: [5, 10, 15, 20] },
    { key: "cardinal", name: "Cardinal", seal_numbers: [1, 6, 11, 16] },
    { key: "core", name: "Core", seal_numbers: [2, 7, 12, 17] },
    { key: "signal", name: "Signal", seal_numbers: [3, 8, 13, 18] },
    { key: "gateway", name: "Gateway", seal_numbers: [4, 9, 14, 19] },
  ]);

  const MS_PER_DAY = 24 * 60 * 60 * 1000;

  function positiveModulo(value, size) {
    return ((value % size) + size) % size;
  }

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
      date.getUTCFullYear() !== year ||
      date.getUTCMonth() !== month - 1 ||
      date.getUTCDate() !== day
    ) {
      return { error: "DATE_INVALID" };
    }

    return { year, month, day, date };
  }

  function isGregorianLeapYear(year) {
    return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  }

  function isLeapDay(parts) {
    return parts.month === 2 && parts.day === 29;
  }

  function dateToUtcMs(parts) {
    return Date.UTC(parts.year, parts.month - 1, parts.day);
  }

  function countLeapDaysInHalfOpenRange(startParts, endParts) {
    const startMs = dateToUtcMs(startParts);
    const endMs = dateToUtcMs(endParts);
    const startYear = Math.min(startParts.year, endParts.year) - 1;
    const endYear = Math.max(startParts.year, endParts.year) + 1;
    let count = 0;

    for (let year = startYear; year <= endYear; year += 1) {
      if (!isGregorianLeapYear(year)) continue;

      const leapMs = Date.UTC(year, 1, 29);
      if (leapMs >= startMs && leapMs < endMs) {
        count += 1;
      }
    }

    return count;
  }

  function calendarDayDifference(startParts, endParts) {
    return Math.round((dateToUtcMs(endParts) - dateToUtcMs(startParts)) / MS_PER_DAY);
  }

  function dreamspellElapsedDays(anchorParts, targetParts) {
    const rawDays = calendarDayDifference(anchorParts, targetParts);

    if (rawDays >= 0) {
      return rawDays - countLeapDaysInHalfOpenRange(anchorParts, targetParts);
    }

    return rawDays + countLeapDaysInHalfOpenRange(targetParts, anchorParts);
  }

  function kinFromElapsedDays(elapsedDays) {
    return positiveModulo(ANCHOR.kin - 1 + elapsedDays, 260) + 1;
  }

  function toneFromKin(kin) {
    return TONES[positiveModulo(kin - 1, 13)];
  }

  function sealFromKin(kin) {
    return SEALS[positiveModulo(kin - 1, 20)];
  }

  function wavespellFromKin(kin) {
    const startKin = Math.floor((kin - 1) / 13) * 13 + 1;
    const startSeal = sealFromKin(startKin);

    return {
      start_kin: startKin,
      seal: startSeal,
      classification: "calculado",
      status: "calculado",
      rule_id: "wavespell-start-from-kin-v0.1",
    };
  }

  function castleFromKin(kin) {
    const castle = CASTLES.find((item) => kin >= item.range[0] && kin <= item.range[1]);

    return {
      value: castle ? castle.name : null,
      number: castle ? castle.number : null,
      classification: "calculado",
      status: castle ? "calculado" : "invalido",
      rule_id: "castle-from-kin-range-v0.1",
    };
  }

  function harmonicFromKin(kin) {
    return {
      value: Math.floor((kin - 1) / 4) + 1,
      classification: "calculado",
      status: "calculado",
      rule_id: "harmonic-from-kin-group-of-four-v0.1",
    };
  }

  function earthFamilyFromSeal(sealNumber) {
    const family = EARTH_FAMILIES.find((item) => item.seal_numbers.includes(sealNumber));

    return {
      value: family ? family.name : null,
      key: family ? family.key : null,
      seal_numbers: family ? family.seal_numbers : [],
      classification: "calculado",
      status: family ? "calculado" : "invalido",
      rule_id: family ? "earth-family-from-seal-table-v0.3" : null,
    };
  }

  function signatureFromParts(seal, tone) {
    return `${seal.color} ${tone.name} ${seal.name}`;
  }

  function kinFromSealTone(sealNumber, toneNumber) {
    for (let kin = 1; kin <= 260; kin += 1) {
      if (sealFromKin(kin).number === sealNumber && toneFromKin(kin).number === toneNumber) {
        return kin;
      }
    }

    return null;
  }

  function sealByNumber(sealNumber) {
    return SEALS[positiveModulo(sealNumber - 1, 20)];
  }

  function toneByNumber(toneNumber) {
    return TONES[positiveModulo(toneNumber - 1, 13)];
  }

  function sealWithOffset(sealNumber, offset) {
    return positiveModulo(sealNumber - 1 + offset, 20) + 1;
  }

  function guideOffsetForTone(toneNumber) {
    if ([1, 6, 11].includes(toneNumber)) return 0;
    if ([2, 7, 12].includes(toneNumber)) return 12;
    if ([3, 8, 13].includes(toneNumber)) return 4;
    if ([4, 9].includes(toneNumber)) return -4;
    if ([5, 10].includes(toneNumber)) return 8;
    return null;
  }

  function analogSealForSeal(sealNumber) {
    return positiveModulo(18 - sealNumber, 20) + 1;
  }

  function antipodeSealForSeal(sealNumber) {
    return sealWithOffset(sealNumber, 10);
  }

  function occultSealForSeal(sealNumber) {
    return positiveModulo(20 - sealNumber, 20) + 1;
  }

  function occultToneForTone(toneNumber) {
    return 14 - toneNumber;
  }

  function kinDescriptor(kin, role, ruleId) {
    const seal = sealFromKin(kin);
    const tone = toneFromKin(kin);

    return {
      role,
      kin,
      signature: signatureFromParts(seal, tone),
      seal,
      tone,
      classification: "calculado",
      status: "calculado",
      rule_id: ruleId,
    };
  }

  function calculateOracleForKin(kin) {
    if (!Number.isInteger(kin) || kin < 1 || kin > 260) {
      return {
        destiny: null,
        guide: null,
        analog: null,
        antipode: null,
        occult: null,
        classification: "calculado",
        status: "invalido",
        rule_id: null,
      };
    }

    const seal = sealFromKin(kin);
    const tone = toneFromKin(kin);
    const guideSeal = sealWithOffset(seal.number, guideOffsetForTone(tone.number));
    const analogSeal = analogSealForSeal(seal.number);
    const antipodeSeal = antipodeSealForSeal(seal.number);
    const occultSeal = occultSealForSeal(seal.number);
    const occultTone = occultToneForTone(tone.number);

    return {
      destiny: kinDescriptor(kin, "destiny", "oracle-destiny-from-kin-v0.2"),
      guide: kinDescriptor(
        kinFromSealTone(guideSeal, tone.number),
        "guide",
        "oracle-guide-tone-offset-v0.2",
      ),
      analog: kinDescriptor(
        kinFromSealTone(analogSeal, tone.number),
        "analog",
        "oracle-analog-seal-complement-19-v0.2",
      ),
      antipode: kinDescriptor(
        kinFromSealTone(antipodeSeal, tone.number),
        "antipode",
        "oracle-antipode-plus-10-seals-v0.2",
      ),
      occult: kinDescriptor(
        kinFromSealTone(occultSeal, occultTone),
        "occult",
        "oracle-occult-seal-21-tone-14-complement-v0.2",
      ),
      classification: "calculado",
      status: "calculado",
      rule_id: "fifth-force-oracle-v0.2",
    };
  }

  function emptyRelationship(status) {
    return {
      value: null,
      label: null,
      classification: "derivado",
      status,
      rule_id: null,
      personal_kin: null,
      daily_kin: null,
      deltas: null,
      matches: null,
    };
  }

  function nearestCycleDelta(forwardDelta, cycleSize) {
    return forwardDelta > cycleSize / 2 ? forwardDelta - cycleSize : forwardDelta;
  }

  function oracleRoleForKin(oracle, kin) {
    const roles = [
      ["destiny", "Destino"],
      ["guide", "Guia"],
      ["analog", "Analogo"],
      ["antipode", "Antipoda"],
      ["occult", "Oculto"],
    ];

    const match = roles.find(([role]) => oracle[role] && oracle[role].kin === kin);

    return match
      ? {
          key: match[0],
          label: match[1],
        }
      : null;
  }

  function relationshipDescriptorFromMatches(matches) {
    if (matches.same_kin) {
      return { value: "same_kin", label: "Mesmo Kin pessoal" };
    }

    if (matches.oracle_role) {
      return {
        value: `oracle_${matches.oracle_role.key}`,
        label: `Ponto do Oraculo pessoal: ${matches.oracle_role.label}`,
      };
    }

    if (matches.same_seal) {
      return { value: "same_seal", label: "Mesmo selo solar" };
    }

    if (matches.same_tone) {
      return { value: "same_tone", label: "Mesmo tom galactico" };
    }

    if (matches.same_color) {
      return { value: "same_color", label: "Mesma cor" };
    }

    if (matches.same_earth_family) {
      return { value: "same_earth_family", label: "Mesma Familia Terrestre" };
    }

    return { value: "cycle_distance", label: "Distancia calculada no ciclo" };
  }

  function calculateRelationshipForKins(personalKin, dailyKin) {
    if (
      !Number.isInteger(personalKin) ||
      !Number.isInteger(dailyKin) ||
      personalKin < 1 ||
      personalKin > 260 ||
      dailyKin < 1 ||
      dailyKin > 260
    ) {
      return emptyRelationship("invalido");
    }

    const personalSeal = sealFromKin(personalKin);
    const dailySeal = sealFromKin(dailyKin);
    const personalTone = toneFromKin(personalKin);
    const dailyTone = toneFromKin(dailyKin);
    const personalEarthFamily = earthFamilyFromSeal(personalSeal.number);
    const dailyEarthFamily = earthFamilyFromSeal(dailySeal.number);
    const kinForwardDelta = positiveModulo(dailyKin - personalKin, 260);
    const sealForwardDelta = positiveModulo(dailySeal.number - personalSeal.number, 20);
    const toneForwardDelta = positiveModulo(dailyTone.number - personalTone.number, 13);
    const oracle = calculateOracleForKin(personalKin);

    const matches = {
      same_kin: personalKin === dailyKin,
      same_seal: personalSeal.number === dailySeal.number,
      same_tone: personalTone.number === dailyTone.number,
      same_color: personalSeal.color === dailySeal.color,
      same_earth_family: personalEarthFamily.key === dailyEarthFamily.key,
      oracle_role: oracleRoleForKin(oracle, dailyKin),
    };
    const descriptor = relationshipDescriptorFromMatches(matches);

    return {
      ...descriptor,
      classification: "derivado",
      status: "derivado",
      rule_id: "daily-personal-kin-relationship-v0.4",
      personal_kin: personalKin,
      daily_kin: dailyKin,
      deltas: {
        kin_forward: kinForwardDelta,
        kin_nearest: nearestCycleDelta(kinForwardDelta, 260),
        seal_forward: sealForwardDelta,
        seal_nearest: nearestCycleDelta(sealForwardDelta, 20),
        tone_forward: toneForwardDelta,
        tone_nearest: nearestCycleDelta(toneForwardDelta, 13),
      },
      matches,
    };
  }

  function relationshipToPersonalKin(personal, daily) {
    const personalKin = personal && personal.kin ? personal.kin.value : null;
    const dailyKin = daily && daily.kin ? daily.kin.value : null;

    if (personalKin && dailyKin) {
      return calculateRelationshipForKins(personalKin, dailyKin);
    }

    if (daily && daily.kin && daily.kin.status === "nao_implementado") {
      return emptyRelationship("nao_implementado");
    }

    if (
      (personal && personal.kin && personal.kin.status === "fora_da_contagem") ||
      (daily && daily.kin && daily.kin.status === "fora_da_contagem")
    ) {
      return emptyRelationship("fora_da_contagem");
    }

    return emptyRelationship("invalido");
  }

  function emptyKinResult(status, warningCode) {
    return {
      kin: { value: null, classification: "calculado", status, rule_id: null },
      signature: { value: null, classification: "derivado", status, rule_id: null },
      seal: { value: null, classification: "calculado", status, rule_id: null },
      tone: { value: null, classification: "calculado", status, rule_id: null },
      wavespell: { value: null, classification: "calculado", status, rule_id: null },
      castle: { value: null, classification: "calculado", status, rule_id: null },
      harmonic: { value: null, classification: "calculado", status, rule_id: null },
      earth_family: { value: null, classification: "calculado", status, rule_id: null },
      warnings: warningCode ? [{ code: warningCode }] : [],
    };
  }

  function calculateKinForDate(dateValue) {
    const parsed = parseDateOnly(dateValue);

    if (parsed.error) {
      return {
        ...emptyKinResult("invalido", "INVALID_DATE"),
        validation_errors: [{ field: "date", code: parsed.error }],
      };
    }

    if (isLeapDay(parsed)) {
      return {
        ...emptyKinResult("fora_da_contagem", "LEAP_DAY_0_0_HUNAB_KU"),
        validation_errors: [],
      };
    }

    const anchorParts = parseDateOnly(ANCHOR.date);
    const elapsed = dreamspellElapsedDays(anchorParts, parsed);
    const kin = kinFromElapsedDays(elapsed);
    const seal = sealFromKin(kin);
    const tone = toneFromKin(kin);

    return {
      kin: {
        value: kin,
        classification: "calculado",
        status: "calculado",
        rule_id: "kin-from-wizard-count-anchor-v0.1",
      },
      signature: {
        value: signatureFromParts(seal, tone),
        classification: "derivado",
        status: "derivado",
        rule_id: "signature-from-seal-tone-v0.1",
      },
      seal: {
        ...seal,
        classification: "calculado",
        status: "calculado",
        rule_id: "seal-from-kin-mod-20-v0.1",
      },
      tone: {
        ...tone,
        classification: "calculado",
        status: "calculado",
        rule_id: "tone-from-kin-mod-13-v0.1",
      },
      wavespell: wavespellFromKin(kin),
      castle: castleFromKin(kin),
      harmonic: harmonicFromKin(kin),
      earth_family: earthFamilyFromSeal(seal.number),
      elapsed_days_from_anchor: elapsed,
      validation_errors: [],
      warnings: [],
    };
  }

  function buildEngineMeta() {
    return {
      name: "drive-astral-sincronario-engine",
      version: ENGINE_VERSION,
      method: METHOD_ID,
      anchor: ANCHOR,
      leap_day_policy: "Feb 29 is treated as 0.0 Hunab Ku and does not advance the kin count.",
      status: "implemented_initial",
    };
  }

  function calculate(input) {
    const birthDate = input && input.birthDate;
    const currentDate = input && input.currentDate;
    const timezone = (input && input.timezone) || "date-only";
    const personal = calculateKinForDate(birthDate);
    const daily = currentDate ? calculateKinForDate(currentDate) : emptyKinResult("nao_implementado");

    return {
      engine: buildEngineMeta(),
      input: {
        birth_date: {
          value: birthDate || null,
          timezone,
          source: "informado_pelo_usuario",
          status: personal.validation_errors && personal.validation_errors.length ? "invalido" : "valido",
        },
        current_date: {
          value: currentDate || null,
          timezone,
          source: currentDate ? "sistema" : "nao_informado",
          status: currentDate ? "valido" : "nao_implementado",
        },
      },
      personal_map: {
        kin: personal.kin,
        signature: personal.signature,
        seal: personal.seal,
        tone: personal.tone,
        wavespell: personal.wavespell,
        castle: personal.castle,
        harmonic: personal.harmonic,
        earth_family: personal.earth_family,
        oracle: calculateOracleForKin(personal.kin.value),
        related_chakra: {
          value: null,
          classification: "derivado",
          status: "pendente_fonte_validada",
          rule_id: null,
        },
      },
      daily: {
        kin_of_day: daily.kin,
        signature: daily.signature,
        seal: daily.seal,
        tone: daily.tone,
        earth_family: daily.earth_family,
        relationship_to_personal_kin: relationshipToPersonalKin(personal, daily),
      },
      cycles: [],
      rules_applied: [
        "kin-from-wizard-count-anchor-v0.1",
        "leap-day-skip-v0.1",
        "seal-from-kin-mod-20-v0.1",
        "tone-from-kin-mod-13-v0.1",
        "wavespell-start-from-kin-v0.1",
        "castle-from-kin-range-v0.1",
        "harmonic-from-kin-group-of-four-v0.1",
        "earth-family-from-seal-table-v0.3",
        "daily-personal-kin-relationship-v0.4",
        "fifth-force-oracle-v0.2",
        "oracle-guide-tone-offset-v0.2",
        "oracle-analog-seal-complement-19-v0.2",
        "oracle-antipode-plus-10-seals-v0.2",
        "oracle-occult-seal-21-tone-14-complement-v0.2",
      ],
      warnings: [
        ...personal.warnings,
        ...(daily.warnings || []).map((warning) => ({ ...warning, scope: "daily" })),
      ],
      validation_errors: [...(personal.validation_errors || []), ...(daily.validation_errors || [])],
    };
  }

  function formatDateOnly(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  return {
    SincronarioEngine: {
      calculate,
      calculateKinForDate,
      calculateOracleForKin,
      calculateEarthFamilyForSeal: earthFamilyFromSeal,
      calculateRelationshipForKins,
      formatDateOnly,
      constants: {
        ENGINE_VERSION,
        METHOD_ID,
        ANCHOR,
        TONES,
        SEALS,
        CASTLES,
        EARTH_FAMILIES,
      },
    },
  };
});
