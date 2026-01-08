import { ProjectData } from "@/types/MNproject";

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

  console.log("CITY Capacity Factor:", capacityFactor)
  return projectData.nameplateCapacity * capacityFactor * HOURS_PER_YEAR;
}


export function calculateCityRealPropertyTax(
  landArea: number,
  landValuePerAcre: number,
  newPropertyClass: string,
  agriculturalType: "Homestead" | "Non-homestead" | undefined,
  cityTaxRates: { ag_homestead_effective_rate: number; 
    ag_non_homestead_effective_rate: number; 
    commercial_effective_rate: number;
  }
  ): number {

  let chosenRate = 0;

  switch (newPropertyClass) {
    case "Agriculture":
      chosenRate = agriculturalType === "Homestead" ? cityTaxRates.ag_homestead_effective_rate : cityTaxRates.ag_non_homestead_effective_rate;
      break;
    case "RuralLand":
      chosenRate =
        agriculturalType === "Homestead"
          ? cityTaxRates.ag_homestead_effective_rate
          : cityTaxRates.ag_non_homestead_effective_rate;
      break;
    case "Commercial":
      chosenRate = cityTaxRates.commercial_effective_rate;
      break;
    default:
      return 0;
  }

  // console.log("CITY NEW PROPERTY CLASS:", newPropertyClass)

  // console.log("City Tax Rates", cityTaxRates)

  // console.log("City Chosen Rate:", chosenRate)
  // console.log("CITY LAND AREA", landArea)
  // console.log("CITY LANDVALUEPERACRE", landValuePerAcre)
  // console.log("CITY CHOSEN RATE", chosenRate)
  //let calculatedValue = landArea * landValuePerAcre * chosenRate;
  // console.log("City Calculated value:", calculatedValue)

  let adjustedChosenRate = Number(chosenRate) / 100;

  return landArea * landValuePerAcre * adjustedChosenRate;
}

export function calculateFormerCityRealPropertyTax(
  landArea: number,
  landValuePerAcre: number,
  previousPropertyClass: string,
  agriculturalType: "Homestead" | "Non-homestead" | undefined,
  cityTaxRates: { ag_homestead_effective_rate: number; 
    ag_non_homestead_effective_rate: number; 
    commercial_effective_rate: number;
  }
  ): number {

  let chosenRate = 0;

  switch (previousPropertyClass) {
    case "Agriculture":
      chosenRate = agriculturalType === "Homestead" ? cityTaxRates.ag_homestead_effective_rate : cityTaxRates.ag_non_homestead_effective_rate;
      break;
    case "RuralLand":
      chosenRate =
        agriculturalType === "Homestead"
          ? cityTaxRates.ag_homestead_effective_rate
          : cityTaxRates.ag_non_homestead_effective_rate;
      break;
    case "Commercial":
      chosenRate = cityTaxRates.commercial_effective_rate;
      break;
    default:
      return 0;
  }

  // console.log("CITY FORMER PROPERTY CLASS:", previousPropertyClass)
  // console.log("City Chosen Rate", chosenRate)
  //let calculatedValue = landArea * landValuePerAcre * chosenRate;
  // console.log("City Calculated value:", calculatedValue)

  let adjustedChosenRate = Number(chosenRate) / 100;

  return landArea * landValuePerAcre * adjustedChosenRate;
}