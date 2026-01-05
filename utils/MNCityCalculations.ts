import { ProjectData } from "@/types/MNproject";

export function getProductionRate(nameplateCapacity: number): number {
  if (nameplateCapacity < 0) return 0;
  if (nameplateCapacity < 2) return 1.2;
  if (nameplateCapacity >= 2 && nameplateCapacity <= 12) return 3.6;
  return 12.0;
}

export function getAnnualEnergyMWh(projectData: ProjectData): number {
  const HOURS_PER_YEAR = 8760;
  const capacityFactor =
    projectData.userCapacityFactor && projectData.userCapacityFactor > 0
      ? projectData.userCapacityFactor
      : projectData.useEstimatedCapacityFactor;

  return projectData.nameplateCapacity * capacityFactor * HOURS_PER_YEAR;
}


export function calculateCityRealPropertyTax(
  landArea: number,
  landValuePerAcre: number,
  newPropertyClass: string,
  agriculturalType: "Homestead" | "Non-homestead" | undefined,
  taxRates: { ag_homestead_effective_rate: number; 
    ag_non_homestead_effective_rate: number; 
    commercial_effective_rate: number;
  }
  ): number {

  let chosenRate = 0;

  switch (newPropertyClass) {
    case "Agriculture":
      chosenRate = agriculturalType === "Homestead" ? taxRates.ag_homestead_effective_rate : taxRates.ag_non_homestead_effective_rate;
      break;
    case "RuralLand":
      chosenRate =
        agriculturalType === "Homestead"
          ? taxRates.ag_homestead_effective_rate
          : taxRates.ag_non_homestead_effective_rate;
      break;
    case "Commercial":
      chosenRate = taxRates.commercial_effective_rate;
      break;
    default:
      return 0;
  }

  console.log(chosenRate)
  let calculatedValue = landArea * landValuePerAcre * chosenRate;

  console.log("City Calculated value:", calculatedValue)
  return landArea * landValuePerAcre * chosenRate;
}

export function calculateFormerCityRealPropertyTax(
  landArea: number,
  landValuePerAcre: number,
  previousPropertyClass: string,
  agriculturalType: "Homestead" | "Non-homestead" | undefined,
  taxRates: { ag_homestead_effective_rate: number; 
    ag_non_homestead_effective_rate: number; 
    commercial_effective_rate: number;
  }
  ): number {

  let chosenRate = 0;

  switch (previousPropertyClass) {
    case "Agriculture":
      chosenRate = agriculturalType === "Homestead" ? taxRates.ag_homestead_effective_rate : taxRates.ag_non_homestead_effective_rate;
      break;
    case "RuralLand":
      chosenRate =
        agriculturalType === "Homestead"
          ? taxRates.ag_homestead_effective_rate
          : taxRates.ag_non_homestead_effective_rate;
      break;
    case "Commercial":
      chosenRate = taxRates.commercial_effective_rate;
      break;
    default:
      return 0;
  }

  console.log("City Chosen Rate", chosenRate)
  let calculatedValue = landArea * landValuePerAcre * chosenRate;

  console.log("City Calculated value:", calculatedValue)
  return landArea * landValuePerAcre * chosenRate;
}