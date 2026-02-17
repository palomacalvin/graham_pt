import { ProjectData } from "@/types/MISolarProject";
import { MIMultiplicationFactors } from "@/types/MIMultiplicationFactors";

export function calculateNPV(rate: number, cashFlows: number[]): number {
  const firstYear = cashFlows[0] ?? 0;
  const remaining = cashFlows.slice(1);

  const discounted = remaining.reduce((sum, cf, i) => {
    return sum + cf / Math.pow(1 + rate, i + 1);
  }, 0);

  return firstYear + discounted;
}


interface YearlyRevenueResult {
  year: number;
  tcv: number;
  revenue: number;
}

export function generateYearlyRevenue(
  originalCost: number,
  millageRate: number,
  factors: { factor_form_5762: number }[],
  years = 30
): YearlyRevenueResult[] {
  return factors.slice(0, years).map((factor, index) => {
    const year = index + 1;
    const tcv = originalCost * factor.factor_form_5762 * 0.5;
    const revenue = (millageRate / 1000) * tcv;

    return { year, tcv, revenue };
  });
}

export function sumRevenueStreams(
  streams: number[][]
): number[] {
  const years = streams[0]?.length ?? 0;

  return Array.from({ length: years }, (_, i) =>
    streams.reduce((sum, stream) => sum + (stream[i] ?? 0), 0)
  );
}

export function calculateGrossTotal(values: number[]): number {
  return values.reduce((acc, val) => acc + val, 0);
}


export function calculateMichiganTaxResults(
  projectData: ProjectData,
  multiplicationFactors: MIMultiplicationFactors[]
) {
  const originalCost = projectData.original_cost_pre_inverter ?? 0;
  const discountRate = projectData.annual_discount_rate ?? 0.05;

  const countyAllocated = generateYearlyRevenue(
    originalCost,
    projectData.county_allocated ?? 0,
    multiplicationFactors
  );

  const countyExtra = generateYearlyRevenue(
    originalCost,
    projectData.county_extra_voted ?? 0,
    multiplicationFactors
  );

  const countyDebt = generateYearlyRevenue(
    originalCost,
    projectData.county_debt ?? 0,
    multiplicationFactors
  );

  const totalCountyPerYear = sumRevenueStreams([
    countyAllocated.map(x => x.revenue),
    countyExtra.map(x => x.revenue),
    countyDebt.map(x => x.revenue),
  ]);

  const grossCounty = calculateGrossTotal(totalCountyPerYear);
  const countyNPV = calculateNPV(discountRate, totalCountyPerYear);

  return {
    county: {
      allocated: countyAllocated,
      extra: countyExtra,
      debt: countyDebt,
      totalPerYear: totalCountyPerYear,
      gross: grossCounty,
      npv: countyNPV,
    },

    // Repeat pattern for:
    // localUnit
    // schoolDistrict
    // isd
    // communityCollege
    // publicAuthorities
    // village
  };
}
