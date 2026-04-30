import { ProjectData } from "@/types/NEProject";
import { TaxUnit } from "@/app/nebraska-components/NETaxTable";

export interface NEYearlyResult {
  year: number;
  revenue: number;
}

export interface NECalculationResult {
  name: string;
  unitRate: number;
  proportionalTaxRate: number;
  capacityTaxRevenue: number;
  projectRealTaxRevenue: number;
  previousFarmlandTaxRevenue: number;
  netRealPropertyRevenue: number;
  netTaxRevenue: number;

  yearlyCashFlows: number[];
  grossTotal: number;
  npvTotal: number;
}

const REGIONAL_MARKET_VALUES: Record<string, number> = {
  "Central": 4340,
  "East": 9435,
  "North": 1545,
  "Northeast": 8305,
  "Northwest": 965,
  "South": 4990,
  "Southeast": 7170,
  "Southwest": 2045,
  "Statewide": 4849,
};

export function calculateProportionalRates(taxUnits: TaxUnit[]) {
  const totalRate = taxUnits.reduce((sum, unit) => sum + (unit.rate || 0), 0);

  if (totalRate === 0) {
    return taxUnits.map(unit => ({
      ...unit,
      proportionalShare: 0
    }));
  }

  return taxUnits.map(unit => {
    const proportionalShare = (unit.rate || 0) / totalRate;

    return {
      ...unit,
      proportionalShare: proportionalShare
    };
  });
}


export function calculateNPV(rate: number, cashFlows: number[]): number {
  const firstYear = cashFlows[0] ?? 0;
  const discounted = cashFlows.slice(1).reduce((sum, cf, i) => {
    return sum + cf / Math.pow(1 + rate, i + 1);
  }, 0);
  return firstYear + discounted;
}


/* Main calculations */
export function calculateNEResults(
  projectData: ProjectData,
  taxUnits: TaxUnit[]
): NECalculationResult[] {
  const activeUnits = taxUnits.filter(u => u.name.trim() !== "" && (u.rate ?? 0) > 0);
  const totalProjectRate = activeUnits.reduce((sum, u) => sum + (u.rate || 0), 0);
  const totalAnnualRevenueYear2Plus = (projectData.nameplate_capacity || 0) * 3518;

  // Calculating prorate data.
  const startDate = projectData.project_start_day ? new Date(projectData.project_start_day) : new Date();
  const startYear = new Date(startDate.getFullYear(), 0, 0);
  const diff = startDate.getTime() - startYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  const prorateMultiplier = 1 - (dayOfYear / 365);

  // Capacity Tax Revenue.
  const totalYear1Revenue = totalAnnualRevenueYear2Plus * prorateMultiplier;

  // Project Real Tax Revenue.
  let landMarketValuePerAcre = 0;

  if (projectData.market_value_source === "Manual") {
    landMarketValuePerAcre = projectData.manual_market_value || 0;
  } else if (projectData.market_value_source === "Regional") {
    landMarketValuePerAcre = REGIONAL_MARKET_VALUES[projectData.region || ""] || 0;
  } else if (projectData.market_value_source === "Statewide") {
    landMarketValuePerAcre = REGIONAL_MARKET_VALUES["Statewide"];
  }

  console.log("Selected land value:", landMarketValuePerAcre)

  const totalLandMarketValue = landMarketValuePerAcre * (projectData.land_area || 0);

  console.log("Total Land Market Value Calculation:", landMarketValuePerAcre, "* (", projectData.land_area, ")")

  const NON_SCHOOL_BOND_RATE = 0.75;
  const SCHOOL_BOND_RATE = 0.50;

  const results: NECalculationResult[] = activeUnits.map((unit) => {

    const unitRate = unit.rate || 0;

    const totalProjectRate = activeUnits.reduce((sum, u) => sum + (u.rate || 0), 0);

    const proportionalTaxRate = totalProjectRate > 0 ? (unit.rate || 0) / totalProjectRate : 0;

    const capacityTaxRevenue = proportionalTaxRate * totalYear1Revenue; 

    const projectRealTaxRevenue = (unitRate / 100) * totalLandMarketValue;

    console.log("Project Real Tax Rate Calculation: ", unitRate, "*", totalLandMarketValue);


    // Previous Farmland Tax Revenue.
    const isBond = unit.type === "School District (bond)";
    const assessmentRatio = isBond ? SCHOOL_BOND_RATE : NON_SCHOOL_BOND_RATE;
    const previousFarmlandTaxRevenue = (unitRate / 100) * totalLandMarketValue * assessmentRatio;
    console.log("Previous farmland tax calculation: ", "(", unitRate, "/", "100 ) *", totalLandMarketValue, "*", assessmentRatio);

    const netRealPropertyRevenue = projectRealTaxRevenue - previousFarmlandTaxRevenue;
    const netTaxRevenue = capacityTaxRevenue + netRealPropertyRevenue;
    const yearlyCashFlows: number[] = [];
    
    return {
      name: unit.name,
      unitRate,
      proportionalTaxRate,
      capacityTaxRevenue,
      projectRealTaxRevenue,
      previousFarmlandTaxRevenue,
      netRealPropertyRevenue,
      netTaxRevenue,
      yearlyCashFlows,
      grossTotal: 0,
      npvTotal: 0,
    };
});

return results;

}