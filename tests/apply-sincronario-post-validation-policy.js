const fs = require("fs");
const path = require("path");

const REFERENCE_PATH = path.join(__dirname, "fixtures", "sincronario-reference-cases.json");
const LEAP_DAY_DATES = new Set(["1988-02-29", "2000-02-29", "2024-02-29"]);

const referenceCases = JSON.parse(fs.readFileSync(REFERENCE_PATH, "utf8"));
let updated = 0;

for (const referenceCase of referenceCases) {
  if (!LEAP_DAY_DATES.has(referenceCase.input.date)) continue;

  if (referenceCase.validation.differenceType !== "SOURCE_CONFLICT") {
    throw new Error(`${referenceCase.caseId} must remain SOURCE_CONFLICT`);
  }

  if (Object.values(referenceCase.expected).some((value) => value !== null)) {
    throw new Error(`${referenceCase.caseId} must keep expected empty`);
  }

  referenceCase.validation.status = "PENDING_METHOD_DECISION";
  referenceCase.validation.notes =
    "SOURCE_CONFLICT remains unresolved. The product blocks automatic readings for February 29 until a methodological decision is approved; expected remains empty.";
  updated += 1;
}

if (updated !== 3) {
  throw new Error(`Expected to update 3 leap-day cases, updated ${updated}`);
}

fs.writeFileSync(REFERENCE_PATH, `${JSON.stringify(referenceCases, null, 2)}\n`);
console.log(JSON.stringify({ updated, status: "PENDING_METHOD_DECISION" }, null, 2));
