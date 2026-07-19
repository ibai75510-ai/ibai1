const typePrefixes: Record<string, string> = {
  institute: "INST",
  university: "UNIV",
  organization: "ORG",
  lab: "LAB",
  research_group: "RES",
  journal: "JRN",
  partner: "PTR",
};

// Deterministic from the row's primary key, so it's always unique without a lookup/retry loop.
export function generateRecognitionCode(type: string, id: number): string {
  const prefix = typePrefixes[type] ?? "ORG";
  return `IBAI-${prefix}-${id.toString().padStart(5, "0")}`;
}
