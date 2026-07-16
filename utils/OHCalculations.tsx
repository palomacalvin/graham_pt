import { ProjectData } from "@/types/OHProject";

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
  yearlyCashFlows: number[];
  grossTotal: number;
  npvTotal: number;
}

const OH_DEPRECIATION_SCHEDULE = [
  1.0, 0.983, 0.95, 0.917, 0.883, 0.85, 0.817, 0.783, 0.717, 0.683, 
  0.65, 0.617, 0.583, 0.55, 0.517, 0.483, 0.45, 0.417, 0.383, 0.35, 
  0.317, 0.298, 0.28, 0.261, 0.243, 0.224, 0.206, 0.187, 0.169, 0.15, 0.15
];

const getMandatoryPaymentRate = (type: string, level: string): number => {
  if (type === "Wind") {
    switch (level) {
      case "less_than_50": return 0;
      case "from_50_to_59": return 8000;
      case "from_60_to_69": return 7000;
      case "from_70_to_74": return 7000;
      case "more_than_75": return 6000;
      default: return 7000;
    }
  } else {
    switch (level) {
      case "more_than_75": return 7000;
      case "from_70_to_74": return 7000;
      default: return 0;
    }
  }
}

/* Manages table output for Wind & Solar, QEP and Non-QEP, for Year 1 Summaries */
export function calculateOHRevenue(projectData: ProjectData): OHCalculationResult[] {
  const {
    land_area,
    cauv_100_percent_valuation_total_acres,
    avg_land_market_value,
    jurisdictions,
    nameplate_capacity,
    is_project_status_qep,
    user_specified_project_status,
    project_type,

    expected_useful_life = 30,
    inflation_rate = 0.025,
    discount_rate = 0.03,
    pct_employed_construction_workers = "from_70_to_74"
  } = projectData;

  // console.log("--- OH Calculation Debug Start ---");
  // console.log("Project Type:", projectData.project_type);
  // console.log("Use County Avg?:", projectData.use_county_avg);
  // console.log("Assessed Market Value Used:", cauv_100_percent_valuation_total_acres);
  // console.log("Total Land Area:", land_area);

  // Gets the CAUV value from the type file (default or user-specified)
  const cauvValuePerAcre = cauv_100_percent_valuation_total_acres || 0;

  // Gets the market value from the type file (default or user-specified).
  const marketValuePerAcre = avg_land_market_value || 0;

  const MANDATORY_PAYMENT_RATE = getMandatoryPaymentRate(project_type, pct_employed_construction_workers)
  const totalMandatoryPayment = (nameplate_capacity || 0) * MANDATORY_PAYMENT_RATE;
  const totalGrossRateSum = jurisdictions.reduce((sum, unit) => sum + Number(unit.gross_tax_rate || 0), 0);

  // QEP Discretionary Payment.
  const totalDiscretionaryPayment = (nameplate_capacity || 0) * (Number(user_specified_project_status) || 0);

  return jurisdictions.map((unit) => {

    const classIRate = (unit.class_i_tax_rate || 0) / 1000; // Millage conversion.
    const classIIRate = (unit.class_ii_tax_rate || 0) / 1000; // Millage conversion.

    let previousFarmland = 0;
    if (project_type === "Wind") {
      previousFarmland = ((cauvValuePerAcre * land_area) * OH_ASSESSMENT_RATIO * classIRate) / 3; // Divides by 3 for wind calculations.
      console.log(`Wind Debug - Market: ${marketValuePerAcre}, Area: ${land_area}, Assessment Ratio: ${OH_ASSESSMENT_RATIO}, Class I Rate: ${classIRate}, Unit: ${unit.political_unit_name}`);

    } else {
      previousFarmland = (cauvValuePerAcre * land_area) * OH_ASSESSMENT_RATIO * classIRate;
      console.log(`Wind Debug - Market: ${cauvValuePerAcre}, Area: ${land_area}, Assessment Ratio: ${OH_ASSESSMENT_RATIO}, Class I Rate: ${classIRate}, Unit: ${unit.political_unit_name}`);
    }

    // Calculates the land revenue for both solar and wind.
    let landRevenue = 0;

    // ============ TODO: CHECK THIS WHOLE IF/ELSE =============== */
    if (project_type === "Wind") {
      const windAssessedValue = (marketValuePerAcre * land_area) / 3;
      landRevenue = windAssessedValue * OH_ASSESSMENT_RATIO * classIIRate;
      //console.log(`Wind Debug - Market: ${marketValuePerAcre}, Area: ${land_area}, Unit: ${unit.political_unit_name}`);
    }
    else {
      landRevenue = (marketValuePerAcre * land_area) * OH_ASSESSMENT_RATIO * classIIRate;
    }
    
    // Equipment revenue.
    const grossRate = (unit.gross_tax_rate || 0) / 1000;
    const totalEquipmentValue = projectData.calculated_valuation || 0; // Also needs assessed value default capability?

    // Production Equipment Value - helper for equipment revenue calculations.
    // These default values are the same for both wind and solar, so it is generalized.
    const productionAssessedValue = totalEquipmentValue * 0.9;
    const productionTaxableValue = productionAssessedValue * 0.24;

    // Other Equipment Value.
    // Same as above; this is generalized to both wind and solar.
    const otherAssessedValue = totalEquipmentValue * 0.1;
    const otherTaxableValue = otherAssessedValue * 0.85;

    // Total Equipment Tax Revenue.
    const totalEquipmentRevenue = (productionTaxableValue + otherTaxableValue) * grossRate;

    // QEP Base & Discretionary Revenue.
    const baseGrossRate = (unit.gross_tax_rate || 0);
    let qepBaseRevenue = 0;
    let qepDiscretionaryRevenue = 0;

    // console.log(`QEP Debug - Unit: ${unit.political_unit_name}, Proportion: ${baseGrossRate}/${totalGrossRateSum}, Total Pay: ${totalMandatoryPayment}`);

    if (is_project_status_qep === "yes" && totalGrossRateSum > 0) {
      const proportion = baseGrossRate / totalGrossRateSum;
      qepBaseRevenue = proportion * totalMandatoryPayment
      qepDiscretionaryRevenue = proportion * totalDiscretionaryPayment;
    }

    let yearOneNet = 0;
    if (is_project_status_qep === "yes") {
      yearOneNet = (qepBaseRevenue + qepDiscretionaryRevenue) - previousFarmland;
    } else {
      yearOneNet = (landRevenue + totalEquipmentRevenue) - previousFarmland;
    }

    const yearlyCashFlows: number[] = [];

    for (let i = 0; i < expected_useful_life + 1; i++) {
      // Compounded inflation factor for the specific year.
      const inflationFactor = Math.pow(1 + Number(inflation_rate), i);
      const inflatedFarmland = previousFarmland * inflationFactor;
      const inflatedLand = landRevenue * inflationFactor;

      let netYearlyRevenue = 0;
      if (is_project_status_qep === "yes") {
        netYearlyRevenue = (qepBaseRevenue + qepDiscretionaryRevenue) - inflatedFarmland;
      } else {
        const depreciationFactor = i < OH_DEPRECIATION_SCHEDULE.length
          ? OH_DEPRECIATION_SCHEDULE[i]
          : 0.15;

          const depreciatedEquipmentRevenue = totalEquipmentRevenue * depreciationFactor;

          netYearlyRevenue = depreciatedEquipmentRevenue + (inflatedLand - inflatedFarmland);
      }

      yearlyCashFlows.push(netYearlyRevenue);
    }

    const grossTotal = yearlyCashFlows.reduce((a, b) => a + b, 0);
    const npvTotal = calculateNPV(Number(inflation_rate), yearlyCashFlows);

    return {
      name: unit.political_unit_name,
      previousFarmland: previousFarmland,
      landRevenue: landRevenue,
      equipmentRevenue: totalEquipmentRevenue,
      qepBaseRevenue: qepBaseRevenue,
      qepDiscretionaryRevenue: qepDiscretionaryRevenue,

      yearlyCashFlows,
      grossTotal,
      npvTotal,
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