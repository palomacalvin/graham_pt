import { ProjectData } from "@/types/NEProject";

const OH_ASSESSMENT_RATIO = 0.35; // 35% standard for Ohio Real Property.

export interface OHYearlyResult {
  year: number;
  revenue: number;
}

export interface OHCalculationResult {
  name: string;
  previousFarmland: number;
  landRevenue: number;
  equipmentRevenue: number;
  qepBaseRevenue: number;
  qepDiscretionaryRevenue: number;
  // Add additional outputs here (if needed).

  yearlyCashFlows: number[];
  grossTotal: number;
  npvTotal: number;
}

/* Manages table output for Wind & Solar, QEP and Non-QEP, for Year 1 Summaries */
// export function calculateNERevenue(projectData: ProjectData): OHCalculationResult[] {
//   const {
//     land_area,
//     avg_land_market_value,
//     nameplate_capacity,
//     project_type,

//     expected_useful_life = 30,
//     inflation_rate = 0.029, //todo: check default
//     discount_rate = 0.03,
//   } = projectData;

//   const marketValuePerAcre = avg_land_market_value || 0;

//     return {
        
//     };
//   });
// }

export function calculateNPV(rate: number, cashFlows: number[]): number {
  const firstYear = cashFlows[0] ?? 0;
  const discounted = cashFlows.slice(1).reduce((sum, cf, i) => {
    return sum + cf / Math.pow(1 + rate, i + 1);
  }, 0);
  return firstYear + discounted;
}