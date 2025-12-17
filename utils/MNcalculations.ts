import { ProjectData } from "@/types/MNproject";

export function getProductionRate(nameplateCapacity: number): number {
  if (nameplateCapacity < 0) return 0;
  if (nameplateCapacity < 2) return 0.12;
  if (nameplateCapacity >= 2 && nameplateCapacity <= 12) return 0.36;
  return 1.2;
}

export function getAnnualEnergyMWh(projectData: ProjectData): number {
  const HOURS_PER_YEAR = 8760;
  const capacityFactor =
    projectData.userCapacityFactor && projectData.userCapacityFactor > 0
      ? projectData.userCapacityFactor
      : projectData.useEstimatedCapacityFactor;

  return projectData.nameplateCapacity * capacityFactor * HOURS_PER_YEAR;
}

export function calculateRealPropertyTax(
  landArea: number,
  landValuePerAcre: number,
  previousPropertyClass: string,
  agriculturalType: "Homestead" | "Non-homestead" | undefined,
  taxRates: { homestead: number; nonHomestead: number; commercial: number }
    ): number {


  let chosenRate = 0;

  switch (previousPropertyClass) {
    case "Agriculture":
      chosenRate = agriculturalType === "Homestead" ? taxRates.homestead : taxRates.nonHomestead;
      break;
    case "RuralLand":
      chosenRate = taxRates.nonHomestead;
      break;
    case "Commercial":
      chosenRate = taxRates.commercial;
      break;
    default:
      return 0;
  }

  return landArea * landValuePerAcre * chosenRate;
}
