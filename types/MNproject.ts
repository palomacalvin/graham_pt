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
  approvedLandValuation: boolean;
  useCountyAvgLandValue: boolean;
  userLandValue: number;
  useEstimatedCapacityFactor: number;
  solarEstimatedCapacityFactor: number;
  userCapacityFactor: number;
  pilotAgreement: boolean;
  pilotPayment: number;
  inflationRate: number;
  previousPropertyClass: string;
  agriculturalType?: "Homestead" | "Non-homestead";
  newAgriculturalType?: "Homestead" | "Non-homestead";
  newPropertyClass: string;
  nameplateCapacity: number;
  landArea: number;
  numberOfTurbines: number;
  acreageUnderTurbine: number;

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



