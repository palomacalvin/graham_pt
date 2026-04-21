import { ProjectData } from "@/types/OHProject";

const OH_ASSESSMENT_RATIO = 0.35; // 35% standard for Ohio Real Property.

export interface OHCalculationResult {
  name: string;
  previousFarmland: number;
  landRevenue: number;
  equipmentRevenue: number;
  qepBaseRevenue: number;
  qepDiscretionaryRevenue: number;
  // Add additional outputs here (if needed).
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

  // QEP Base Payment Revenues.
  const MANDATORY_PAYMENT_RATE = 7000; // This is the value for Solar QEP; TODO: CHECK OUTPUT FOR ALL WIND QEP VALUES
  const totalMandatoryPayment = (nameplate_capacity || 0) * MANDATORY_PAYMENT_RATE;
  const totalGrossRateSum = jurisdictions.reduce((sum, unit) => sum + Number(unit.gross_tax_rate || 0), 0);

  // QEP Discretionary Payment.
  const totalDiscretionaryPayment = (nameplate_capacity || 0) * (Number(user_specified_project_status) || 0);

  return jurisdictions.map((unit) => {
    // Previous Farmland.
    let previousFarmland = 0;
      const classIRate = (unit.class_i_tax_rate || 0) / 1000; // Millage conversion.


    if (project_type === "Wind") {
      previousFarmland = ((cauvValuePerAcre * land_area) * OH_ASSESSMENT_RATIO * classIRate) / 3; // Divides by 3 for wind calculations.
      console.log(`Wind Debug - Market: ${marketValuePerAcre}, Area: ${land_area}, Assessment Ratio: ${OH_ASSESSMENT_RATIO}, Class I Rate: ${classIRate}, Unit: ${unit.political_unit_name}`);

    } else {
      previousFarmland = (cauvValuePerAcre * land_area) * OH_ASSESSMENT_RATIO * classIRate;
      console.log(`Wind Debug - Market: ${cauvValuePerAcre}, Area: ${land_area}, Assessment Ratio: ${OH_ASSESSMENT_RATIO}, Class I Rate: ${classIRate}, Unit: ${unit.political_unit_name}`);
    }

    // Calculates the land revenue for both solar and wind.
    const classIIRate = (unit.class_ii_tax_rate || 0) / 1000;
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

    // QEP Base Revenue.
    const baseGrossRate = (unit.gross_tax_rate || 0);
    let qepBaseRevenue = 0;

    // console.log(`QEP Debug - Unit: ${unit.political_unit_name}, Proportion: ${baseGrossRate}/${totalGrossRateSum}, Total Pay: ${totalMandatoryPayment}`);

    if (is_project_status_qep === "yes" && totalGrossRateSum > 0) {
      const proportion = baseGrossRate / totalGrossRateSum;
      qepBaseRevenue = proportion * totalMandatoryPayment
    }

    // QEP Discretionary Revenue.
    let qepDiscretionaryRevenue = 0;

    if (is_project_status_qep === "yes" && totalGrossRateSum > 0) {
      const proportion = baseGrossRate / totalGrossRateSum;
      qepDiscretionaryRevenue = proportion * totalDiscretionaryPayment;
    }

    // console.log(`Checking Rates for ${unit.political_unit_name}:`);
    // console.log(` -> Class I: ${unit.class_i_tax_rate}`);
    // console.log(` -> Class II: ${unit.class_ii_tax_rate}`);
    // console.log(` -> Gross Tax: ${unit.gross_tax_rate}`)

    return {
      name: unit.political_unit_name,
      previousFarmland: previousFarmland,
      landRevenue: landRevenue,
      equipmentRevenue: totalEquipmentRevenue,
      qepBaseRevenue: qepBaseRevenue,
      qepDiscretionaryRevenue: qepDiscretionaryRevenue,
    };
  });
}