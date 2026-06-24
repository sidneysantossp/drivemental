(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    const { AreaKnowledge } = require("./area-knowledge.js");
    module.exports = factory(AreaKnowledge);
    return;
  }

  root.DriveAstralKnowledge = factory(root.DriveAstralAreaKnowledge).SincronarioKnowledge;
})(typeof globalThis !== "undefined" ? globalThis : this, function (AreaKnowledge) {
  const KNOWLEDGE_VERSION = "0.8.0";

  function normalizeFocusArea(value) {
    const normalized = AreaKnowledge.normalizeAreaId(value);
    return {
      key: normalized.areaId,
      id: normalized.areaId,
      label: normalized.content.title,
      title: normalized.content.title,
      intent: normalized.content.intent,
      contentFallbackUsed: normalized.contentFallbackUsed,
    };
  }

  function buildKnowledgeMeta() {
    return {
      name: "drive-astral-sincronario-knowledge-base",
      version: KNOWLEDGE_VERSION,
      content_version: AreaKnowledge.contentVersion,
      status: "implemented_area_interpretation",
      rules_applied: [
        "area-coordinate-application-v0.3",
        "snapshot-preserved-interpretation-v0.1",
      ],
      sources: [
        {
          id: AreaKnowledge.contentVersion,
          label: "Base interpretativa editorial por area, sem IA em tempo de execucao",
          status: "editorial_versionada",
        },
      ],
    };
  }

  function emptyGuidance(status, focusArea) {
    return {
      classification: "base_conhecimento",
      status,
      rule_id: null,
      focus_area: focusArea,
      interpretation: null,
      safety_note:
        "Conteudo simbolico e reflexivo. Nao e previsao nem substitui orientacao profissional medica, financeira, juridica ou psicologica.",
    };
  }

  function buildGuidance(reading, focusArea) {
    const personalMap = reading && reading.personal_map;
    const daily = reading && reading.daily;

    if (!personalMap || !personalMap.kin || !personalMap.kin.value) {
      return emptyGuidance(
        personalMap && personalMap.kin ? personalMap.kin.status : "invalido",
        focusArea,
      );
    }

    if (!daily || !daily.kin_of_day || !daily.kin_of_day.value) {
      return emptyGuidance(
        daily && daily.kin_of_day ? daily.kin_of_day.status : "nao_implementado",
        focusArea,
      );
    }

    const interpretation = AreaKnowledge.buildInterpretation(reading, focusArea.id);

    return {
      classification: "base_conhecimento",
      status: "derivado",
      rule_id: "area-coordinate-application-v0.3",
      focus_area: focusArea,
      interpretation: {
        ...interpretation,
        contentFallbackUsed: focusArea.contentFallbackUsed,
      },
      safety_note:
        "Conteudo simbolico e reflexivo. Nao e previsao nem substitui orientacao profissional medica, financeira, juridica ou psicologica.",
    };
  }

  function enrichReading(reading, options) {
    const focusArea = normalizeFocusArea(options && options.focusArea);

    if (!reading || typeof reading !== "object") {
      return {
        knowledge_base: buildKnowledgeMeta(),
        guidance: emptyGuidance("invalido", focusArea),
      };
    }

    return {
      ...reading,
      input: {
        ...(reading.input || {}),
        focus_area: {
          value: focusArea.id,
          label: focusArea.title,
          source: "informado_pelo_usuario",
          status: "valido",
          content_fallback_used: focusArea.contentFallbackUsed,
        },
      },
      knowledge_base: buildKnowledgeMeta(),
      guidance: buildGuidance(reading, focusArea),
    };
  }

  return {
    SincronarioKnowledge: {
      enrichReading,
      normalizeFocusArea,
      constants: {
        KNOWLEDGE_VERSION,
        AREA_CONTENT_VERSION: AreaKnowledge.contentVersion,
        AREA_KNOWLEDGE: AreaKnowledge.areaKnowledge,
      },
    },
  };
});
