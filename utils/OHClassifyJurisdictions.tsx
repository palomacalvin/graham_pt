// utils/classifyJurisdiction.ts

export type BenefitCategory = "county" | "school" | "township" | "other";

export function classifyUnit(name: string): BenefitCategory {
  const n = name.toUpperCase();

  if (
    n.includes("SCHOOL") || 
    n.includes(" CSD") || 
    n.includes(" ISD") || 
    n.includes(" UNIFIED") || 
    n.includes(" EDUCATION") ||
    n.includes(" JVSD") ||
    n.includes("PUBLIC INSTRUCTION")
  ) {
    return "school";
  }

  if (n.includes(" TWP") || n.includes("TOWNSHIP")) {
    return "township";
  }

  if (n.includes("COUNTY") || n.includes(" CO ")) {
    return "county";
  }

  return "other";
}