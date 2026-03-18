// /types/project.ts
export interface ProjectData {
  county: string;

  countyTaxRates?: {
    ag_homestead_effective_rate: number;
    ag_non_homestead_effective_rate: number;
    commercial_effective_rate: number;
  };

  cityTaxRates?: {
    ag_homestead_effective_rate: number;
    ag_non_homestead_effective_rate: number;
    commercial_effective_rate: number;
  }

  schoolDistrictTaxRates?: {
    ag_homestead_effective_rate: number;
    ag_non_homestead_effective_rate: number;
    commercial_effective_rate: number;
  }

  township: string;
  schoolDistrict: string;
  useCountyAvgLandValue: boolean;
  userLandValue: number;
  useEstimatedCapacityFactor: number;
  estimatedCapacityFactor: number;
  userCapacityFactor: number;
  pilotAgreement: boolean;
  pilotPayment: number;
  inflationRate: number;
  propertyClass: "Agriculture" | "RuralLand" | "Commercial";
  agriculturalType?: "Homestead" | "Non-homestead";
  nameplateCapacity: number;
  landArea: number;
  numberOfTurbines: number;
  acreageUnderTurbine: number;
  discountRate: number;
  auto_calculate_costs: boolean;
  expected_useful_life: number;

  taxRates?: {
    homestead: number;
    nonHomestead: number;
    commercial: number;
  }
  
  taxRatesCity?: {
    homestead: number;
    nonHomestead: number;
    commercial: number;
  }

  taxRatesSchoolDistrict?: {
    homestead: number;
    nonHomestead: number;
    commercial: number;
  }
}



