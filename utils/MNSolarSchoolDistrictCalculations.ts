import { ProjectData } from "@/types/MNSolarProject";

export function getProductionRate(nameplateCapacity: number): number {
  if (nameplateCapacity < 1) return 0;
  if (nameplateCapacity >= 1) return 1.2;
  return 0;
}


export function getAnnualEnergyMWh(projectData: ProjectData): number {
  const HOURS_PER_YEAR = 8760;
  const capacityFactor =
    projectData.userCapacityFactor && projectData.userCapacityFactor > 0
      ? projectData.userCapacityFactor
      : projectData.useEstimatedCapacityFactor;

  console.log("SD Cap factor", capacityFactor)
  return projectData.nameplateCapacity * capacityFactor * HOURS_PER_YEAR;
}


export function calculateSchoolDistrictRealPropertyTax(
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

  // console.log(chosenRate)
  // let calculatedValue = landArea * landValuePerAcre * chosenRate;
  // console.log("SD Calculated value:", calculatedValue)

  let adjustedChosenRate = Number(chosenRate) / 100;

  console.log("SD Adjusted Rate", adjustedChosenRate)


  return landArea * landValuePerAcre * adjustedChosenRate;
}

export function calculateFormerSchoolDistrictRealPropertyTax(
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

  // console.log(chosenRate)
  // let calculatedValue = landArea * landValuePerAcre * chosenRate;
  // console.log("SD Calculated value:", calculatedValue)

  let adjustedChosenRate = Number(chosenRate) / 100;

  console.log("SD Adjusted Rate", adjustedChosenRate)

  return landArea * landValuePerAcre * adjustedChosenRate;
}