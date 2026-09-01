import { ProjectData } from "@/types/INProject";
import { TaxUnitRecord } from "@/app/indiana-components/TaxUnits";

export interface AbatementUnit {
  year: number;
  personalPropertyAbatement: number;
  realPropertyAbatement: number;
}

export interface ScheduleYearRow {
  year: number;
  macrsPercent: number;
  cumDepreciation: number;
  depreciationBalance: number;
  finalAssessedValueUDP: number;
  improvements: number;
  increasedLandValue: number;
  totalAssessedValue: number;
}

export interface NoAbatementYearRow {
  year: number;
  utilityProperty: number;
  improvements: number;
  increasedLandValue: number;
  totalAssessedValue: number;
}

export interface WithAbatementYearRow {
  year: number;
  utilityProperty: number;
  improvements: number;
  increasedLandValue: number;
  totalAssessedValue: number;
}

export interface FundAssessedValueImpactNoAbatement {
  unitName: string;
  fundName: string;
  fundCode?: string;
  certifiedLevy: number;
  baseNetAV: number;
  taxRate: number;
  expandedPaymentByYear: number[]; 
}

export interface TaxPaymentResultNoAbatement {
  projectAssessedValues: number[];
  fundImpacts: FundAssessedValueImpactNoAbatement[];
  totalBaseNetAV: number;
  totalPaymentByYear: number[]; 
}

export interface CalculationResults {
  inputs: {
    totalInvestment: number;
    pctInvestmentUDP: number;
    totalUDP: number;
    realPropertyImprovements: number;
    realPropertyAssessmentRatio: number;
    stateCreditGrossAdditions: number;
    depreciationFloor: number;
  };
  schedule: ScheduleYearRow[];
  noAbatementSchedule: NoAbatementYearRow[];
  withAbatementSchedule: WithAbatementYearRow[];
}

export interface FundNewTaxRateImpactNoAbatement {
  unitName: string;
  fundName: string;
  fundCode?: string;
  isDebtOrReferendum: boolean;
  certifiedLevy: number;
  baseNetAV: number;
  baseTaxRate: number;
  newRatesByYear: (number | null)[];
}

export interface NewTaxRateResultNoAbatement {
  projectAssessedValues: number[];
  fundRateImpacts: FundNewTaxRateImpactNoAbatement[];
}

export interface FundPropertyTaxPaymentNoAbatement {
  unitName: string;
  fundName: string;
  fundCode?: string;
  isDebtOrReferendum: boolean;
  certifiedLevy: number;
  baseNetAV: number;
  baseTaxRate: number;
  paymentsByYear: number[];
  total25YrPayment: number;
}

export interface PropertyTaxPaymentResultNoAbatement {
  projectAssessedValues: number[];
  fundPayments: FundPropertyTaxPaymentNoAbatement[];
  yearlyTotals: number[];
  grandTotal25Yr: number;
}

export interface FundTaxOffsetNoAbatement {
  unitName: string;
  fundName: string;
  fundCode?: string;
  isDebtOrReferendum: boolean;
  certifiedLevy: number;
  baseNetAV: number;
  baseTaxRate: number;
  offsetsByYear: (number | null)[];
  total25YrOffset: number;
}

export interface TaxOffsetResult {
  projectAssessedValues: number[];
  fundOffsetImpacts: FundTaxOffsetNoAbatement[];
  yearlyTotals: (number | null)[];
  grandTotal25Yr: number;
}

// Creates functionally same schemas for calculations w/abatement.
export interface FundNewTaxRateImpactWithAbatement extends FundNewTaxRateImpactNoAbatement {}
export interface NewTaxRateResultWithAbatement extends NewTaxRateResultNoAbatement {}

export interface FundPropertyTaxPaymentWithAbatement extends FundPropertyTaxPaymentNoAbatement {}
export interface PropertyTaxPaymentResultWithAbatement extends PropertyTaxPaymentResultNoAbatement {}

export interface FundTaxOffsetWithAbatement extends FundTaxOffsetNoAbatement {}
export interface TaxOffsetResultWithAbatement extends TaxOffsetResult {}

// 13-year Pool 4 True Tax percentages.
const POOL_4_TRUE_TAX_PCT = [0.40, 0.60, 0.63, 0.54, 0.46, 0.40, 0.34, 0.29, 0.25, 0.21, 0.15, 0.10, 0.10, 0.10,
  0.10, 0.10, 0.10, 0.10, 0.10, 0.10, 0.10, 0.10, 0.10, 0.10, 0.10
];
const STATEWIDE_AGRICULTURAL_BASELINE_ASSESSED_VALUE = 2120;

// Default units for the Abatement Schedule Table.
const DEFAULT_ABATEMENT_UNITS: AbatementUnit[] = Array.from({ length: 10 }, (_, i) => ({
  year: i + 1,
  personalPropertyAbatement: 1.0,
  realPropertyAbatement: 1.0,
}));

// Determines if a fund is a debt or referendum fund.
export function isDebtOrReferendumFund(fundName: string): boolean {
  if (!fundName) return false;
  const nameLower = fundName.toLowerCase();
  return (
    nameLower.includes("debt") ||
    nameLower.includes("referendum") ||
    nameLower.includes("ref")
  );
}


// Main function to calculate new tax rates.
export function calculateNewTaxRates(
  projectData: ProjectData,
  projectAvSchedule: number[]
): NewTaxRateResultNoAbatement {
  const selectedUnits: TaxUnitRecord[] = projectData.selectedTaxUnits || [];
  const yearsCount = projectAvSchedule.length > 0 ? projectAvSchedule.length : 25;
  const fundRateImpacts: FundNewTaxRateImpactNoAbatement[] = [];

  selectedUnits.forEach((fund) => {
    const baseNetAV = Number(fund.certified_net_assessed_value || 0);
    const certifiedLevy = Number(fund.certified_levy || 0);
    const fundName = fund.fund_name || "General";
    const isDebt = isDebtOrReferendumFund(fundName);

    // The target fund's base tax rate.
    const baseTaxRate =
      baseNetAV > 0 && certifiedLevy > 0 ? certifiedLevy / baseNetAV : 0;

    // Array to hold the new tax rates once calculated.
    const newRatesByYear: (number | null)[] = [];

    for (let yr = 0; yr < yearsCount; yr++) {
      const projAV = projectAvSchedule[yr] || 0; // The project's assessed value by year.
      
      // If the target fund is missing a levy / has an invalid rate, push null (will render as "-").
      if (certifiedLevy <= 0 || baseNetAV <= 0 || baseTaxRate <= 0) {
        newRatesByYear.push(null);
        continue;
      }

      // If the fund is a debt / ref., push the rate as is.
      if (isDebt) {
        newRatesByYear.push(baseTaxRate);
      } else { // Else, calculate the new rate.
        const totalTaxableBase = baseNetAV + projAV;

        if (totalTaxableBase <= 0) {
          newRatesByYear.push(null);
        } else {
          const projectedLevyCalculated = totalTaxableBase * baseTaxRate;

          if (projectedLevyCalculated > certifiedLevy) {
            newRatesByYear.push(certifiedLevy / totalTaxableBase);
          } else {
            newRatesByYear.push(baseTaxRate);
          }
        }
      }
    }

    fundRateImpacts.push({
      unitName: fund.unit_name || "Taxing Unit",
      fundName,
      fundCode: fund.fund_code,
      isDebtOrReferendum: isDebt,
      certifiedLevy,
      baseNetAV,
      baseTaxRate,
      newRatesByYear,
    });
  });

  return {
    projectAssessedValues: projectAvSchedule,
    fundRateImpacts,
  };
}

// Calculates new tax rates with abatement.
export function calculateNewTaxRatesWithAbatement(
  projectData: ProjectData,
  abatedProjectAvSchedule: number[]
): NewTaxRateResultWithAbatement {
  return calculateNewTaxRates(projectData, abatedProjectAvSchedule);
}

// Calculates the tax impact.
export function calculateTaxBaseImpact(
  projectData: ProjectData,
  projectAvSchedule: number[]
): TaxPaymentResultNoAbatement {
  const selectedUnits: TaxUnitRecord[] = projectData.selectedTaxUnits || [];

  const fundImpacts: FundAssessedValueImpactNoAbatement[] = [];
  const yearsCount = projectAvSchedule.length > 0 ? projectAvSchedule.length : 25;
  const totalExpandedNetAVByYear: number[] = new Array(yearsCount).fill(0);
  let aggregateBaseNetAV = 0;
  const totalPaymentByYear: number[] = new Array(yearsCount).fill(0);

  selectedUnits.forEach((fund) => {
    // Get the base net assessed value and certified levy from the target fund.
    const baseNetAV = Number(fund.certified_net_assessed_value || 0);
    const certifiedLevy = Number(fund.certified_levy || 0);

    // Calculate the effective tax rate.
    const taxRate = baseNetAV > 0 && certifiedLevy > 0 
      ? certifiedLevy / baseNetAV
      : 0;

    // Calculate the 25-year payments and AV by year.
    const expandedPaymentByYear: number[] = [];

    for (let yr = 0; yr < yearsCount; yr++) {
      const projAV = projectAvSchedule[yr] || 0;
      const expandedAV = baseNetAV + projAV;
      
      expandedPaymentByYear.push(expandedAV);
      totalExpandedNetAVByYear[yr] += expandedAV;

      // Calculate the annual tax payment for the fund.
      const fundPayment = projAV * taxRate;
      totalExpandedNetAVByYear[yr] += fundPayment;
    }

    aggregateBaseNetAV += baseNetAV;

    fundImpacts.push({
      unitName: fund.unit_name || "Taxing Unit",
      fundName: fund.fund_name || "General",
      fundCode: fund.fund_code,
      certifiedLevy,
      baseNetAV,
      taxRate,
      expandedPaymentByYear,
    });
  });

  return {
    projectAssessedValues: projectAvSchedule,
    fundImpacts,
    totalBaseNetAV: aggregateBaseNetAV,
    totalPaymentByYear,
  };
}

export function calculateSchedule(
  projectData?: Partial<ProjectData>,
  abatementUnits: AbatementUnit[] = DEFAULT_ABATEMENT_UNITS
): CalculationResults {

  // Set the total investment and % UDP from the user's selections
  // and default assumptions.
  const totalInvestment = projectData?.total_investment ?? 337500000;
  const pctInvestmentUDP = projectData?.pct_investment_udp ?? 0.95;
  
  // Calculate total UDP, real property improvements for each fund.
  const totalUDP = totalInvestment * pctInvestmentUDP;
  const realPropertyImprovements = totalInvestment * (1 - pctInvestmentUDP);
  
  // Set assumed/selected real property assessment ratio, state credit gross additions, and depreciation floor.
  const realPropertyAssessmentRatio = projectData?.real_property_assessment_ratio ?? 0.50;
  const stateCreditGrossAdditions = projectData?.state_credit_gross_additions ?? 0.60;
  const depreciationFloor = projectData?.depreciation_floor ?? 0.00;

  // Calculate starting improvements and land values.
  let currentImprovement = realPropertyAssessmentRatio * realPropertyImprovements;
  let currentLandValue = (projectData?.land_area || 0) * ((projectData?.land_assessed_value || 0) - STATEWIDE_AGRICULTURAL_BASELINE_ASSESSED_VALUE);

  const annualGrowthRate = 0.025;

  // Calculate depreciation over time.
  let runningCumulativeDepreciation = 0;
  const schedule: ScheduleYearRow[] = [];
  const noAbatementSchedule: NoAbatementYearRow[] = [];
  const withAbatementSchedule: WithAbatementYearRow[] = [];

  for (let yr = 1; yr <= 25; yr++) {
    const macrsRate = yr <= 25 ? POOL_4_TRUE_TAX_PCT[yr - 1] : 0;
    runningCumulativeDepreciation += macrsRate;

    const depreciationBalance = totalUDP * runningCumulativeDepreciation;

    const floorValue = totalUDP * depreciationFloor;
    const netValue = totalUDP - depreciationBalance;
    const baseValueWithFloor = Math.max(netValue, floorValue);

    const year1CreditFactor = yr === 1 ? (1 - stateCreditGrossAdditions) : 1;
    const finalAssessedValueUDP = baseValueWithFloor * year1CreditFactor;

    if (yr > 1) {
      currentImprovement = Math.round(currentImprovement * (1 + annualGrowthRate));
      currentLandValue = Math.round(currentLandValue * (1 + annualGrowthRate));
    }

    const roundedUDP = Math.round(finalAssessedValueUDP);
    const roundedImprovement = Math.round(currentImprovement);
    const roundedLand = Math.round(currentLandValue);
    const totalAssessedValue = finalAssessedValueUDP + currentImprovement + currentLandValue;

    schedule.push({
      year: yr,
      macrsPercent: macrsRate,
      cumDepreciation: Math.round(runningCumulativeDepreciation),
      depreciationBalance: Math.round(depreciationBalance),
      finalAssessedValueUDP: Math.round(finalAssessedValueUDP),
      improvements: Math.round(currentImprovement),
      increasedLandValue: Math.round(currentLandValue),
      totalAssessedValue: Math.round(totalAssessedValue),
    });

    noAbatementSchedule.push({
      year: yr,
      utilityProperty: roundedUDP,
      improvements: roundedImprovement,
      increasedLandValue: roundedLand,
      totalAssessedValue,
    });

    const yearAbatement = abatementUnits.find((u) => u.year === yr);
    const personalPropertyAbatementRate = yearAbatement?.personalPropertyAbatement ?? 0;
    const realPropertyAbatementRate = yearAbatement?.realPropertyAbatement ?? 0;

    const abatedUDP = Math.round(finalAssessedValueUDP * (1 - personalPropertyAbatementRate));
    const abatedImprovements = Math.round(currentImprovement * (1 - realPropertyAbatementRate));
    const abatedLand = roundedLand;
    const totalAbatedAssessedValue = abatedUDP + abatedImprovements + abatedLand;

    withAbatementSchedule.push({
      year: yr,
      utilityProperty: abatedUDP,
      improvements: abatedImprovements,
      increasedLandValue: abatedLand,
      totalAssessedValue: totalAbatedAssessedValue,
    });
  }

  return {
    inputs: {
      totalInvestment,
      pctInvestmentUDP,
      totalUDP,
      realPropertyImprovements,
      realPropertyAssessmentRatio,
      stateCreditGrossAdditions,
      depreciationFloor,
    },
    schedule,
    noAbatementSchedule,
    withAbatementSchedule,
  };
}

// Calculates the tax payments.
export function calculatePropertyTaxPayments(
  projectData: ProjectData,
  projectAvSchedule: number[]
): PropertyTaxPaymentResultNoAbatement {
  const yearsCount = projectAvSchedule.length > 0 ? projectAvSchedule.length : 25;

  // Generate the new tax rates for all funds, years 1-25.
  const newRatesResult = calculateNewTaxRates(projectData, projectAvSchedule);
  const fundRateImpacts = newRatesResult?.fundRateImpacts || [];

  const fundPayments: FundPropertyTaxPaymentNoAbatement[] = [];
  const yearlyTotals = new Array(yearsCount).fill(0);
  let grandTotal25Yr = 0;

  // Iterate through each fund and calculate the payment by year.
  fundRateImpacts.forEach((fundRate) => {
    const paymentsByYear: number[] = [];
    let fundTotal25Yr = 0;

    for (let yr = 0; yr < yearsCount; yr++) {
      const projAV = projectAvSchedule[yr] || 0;
      const rate = fundRate.newRatesByYear[yr];

      const payment = rate !== null && rate > 0 ? projAV * rate : 0;
      const roundedPayment = Math.round(payment);

      paymentsByYear.push(roundedPayment);
      fundTotal25Yr += roundedPayment;
      yearlyTotals[yr] += roundedPayment;
    }

    grandTotal25Yr += fundTotal25Yr;

    fundPayments.push({
      unitName: fundRate.unitName,
      fundName: fundRate.fundName,
      fundCode: fundRate.fundCode,
      isDebtOrReferendum: fundRate.isDebtOrReferendum,
      certifiedLevy: fundRate.certifiedLevy,
      baseNetAV: fundRate.baseNetAV,
      baseTaxRate: fundRate.baseTaxRate,
      paymentsByYear,
      total25YrPayment: fundTotal25Yr,
    });
  });

  return {
    projectAssessedValues: projectAvSchedule,
    fundPayments,
    yearlyTotals,
    grandTotal25Yr,
  };
}

// Calculates the tax payments with abatement.
export function calculatePropertyTaxPaymentsWithAbatement(
  projectData: ProjectData,
  abatedProjectAvSchedule: number[]
): PropertyTaxPaymentResultWithAbatement {
  return calculatePropertyTaxPayments(projectData, abatedProjectAvSchedule);
}

// Calculates the tax offset.
export function calculateTaxOffsetForCommunity(
  projectData: ProjectData,
  projectAvSchedule: number[]
): TaxOffsetResult {
  const yearsCount = projectAvSchedule.length > 0 ? projectAvSchedule.length : 25;

  // Get the original rates and new tax rates for each fund, years 1-25.
  const newRatesResult = calculateNewTaxRates(projectData, projectAvSchedule);
  const fundRateImpacts = newRatesResult?.fundRateImpacts || [];

  const fundOffsetImpacts: FundTaxOffsetNoAbatement[] = [];
  const yearlyTotals = new Array(yearsCount).fill(0);
  let grandTotal25Yr = 0;

  // Iterate through each fund and calculate the tax offset.
  fundRateImpacts.forEach((fund) => {
    const offsetsByYear: (number | null)[] = [];
    let fundTotal25Yr = 0;

    const baseNetAV = fund.baseNetAV;
    const baseRate = fund.baseTaxRate;

    for (let yr = 0; yr < yearsCount; yr++) {
      const newRate = fund.newRatesByYear[yr];

      // If invalid rate, levy <= 0, or baseNetAV <= 0, push null value, (which becomes "-").
      if (newRate === null || baseNetAV <= 0 || fund.certifiedLevy <= 0 || baseRate <= 0) {
        offsetsByYear.push(null);
        continue;
      }

      // Calculate the offset.
      const rateDiff = baseRate - newRate;
      const offsetValue = baseNetAV * rateDiff;
      const roundedOffset = Math.round(offsetValue);

      offsetsByYear.push(roundedOffset);
      fundTotal25Yr += roundedOffset;
      yearlyTotals[yr] += roundedOffset;
    }

    grandTotal25Yr += fundTotal25Yr;

    fundOffsetImpacts.push({
      unitName: fund.unitName,
      fundName: fund.fundName,
      fundCode: fund.fundCode,
      isDebtOrReferendum: fund.isDebtOrReferendum,
      certifiedLevy: fund.certifiedLevy,
      baseNetAV,
      baseTaxRate: baseRate,
      offsetsByYear,
      total25YrOffset: fundTotal25Yr,
    });
  });

  return {
    projectAssessedValues: projectAvSchedule,
    fundOffsetImpacts,
    yearlyTotals,
    grandTotal25Yr,
  };
}

// Calculates the tax offset with abatement.
export function calculateTaxOffsetForCommunityWithAbatement(
  projectData: ProjectData,
  abatedProjectAvSchedule: number[]
): TaxOffsetResultWithAbatement {
  return calculateTaxOffsetForCommunity(projectData, abatedProjectAvSchedule);
}