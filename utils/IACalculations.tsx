import { ProjectData, IowaAgValueCounty, CalculatedAgCounty } from "@/types/IASolarProject";
import { ProjectData as WindProjectData } from "@/types/IAWindProject";
import { IowaAgValueCounty as IowaWindAgValueCounty } from "@/types/IAWindProject";
import { CalculatedAgCounty as WindCalculatedAgCounty } from "@/types/IAWindProject";

export interface IowaUtilityDeliveryTaxRow {
  name_of_utility: string;
  delivery_tax_rate_per_kwh: number;
  delivery_tax_rate_per_mwh: number;
}

export interface IowaCountyTaxRow {
  county_number: string;
  county_name: string;
  urban_value: number;
  urban_rate: number;
  urban_levy: number;
  rural_value: number;
  rural_levy: number;
  total_value: number;
  special_levy: number;
  total_levy: number;
  rural_rate: number;
}

export interface IowaCityDataRow {
  county_name: string;
  city_name: string;
  city_code: string;
  census_2020: number;
  taxable_value: number;
  ag_land: number;
  ag_land_levy: number;
  regular_without_ag: number;
  debt_service: number;
  employ_benefit: number;
  capital_improve: number;
}

export function agLandCalculations(
  dbCounties: IowaAgValueCounty[], 
  projectData: ProjectData
): { allCounties: CalculatedAgCounty[]; selectedCountyData: CalculatedAgCounty | null } {
  
  const projectLandArea = Number(projectData.land_area || 0);
  
  // Use custom CSR2 value if user checked "no" to county average, otherwise fall back to county data
  const userCsrTarget = projectData.use_county_avg_csr2s === "no" 
    ? Number(projectData.county_avg_csr2s || 0) 
    : null;

  // Map calculated values.
  const allCounties: CalculatedAgCounty[] = dbCounties.map((county) => {
    const acres = Number(county.number_of_ag_acres_in_county || 0);
    const productivity = Number(county.productivity_per_acre || 0);
    const avgCsr = Number(county.average_csr_in_county || 0);
    const rollback = Number(county.ag_rollback || 0);

    const targetValueAgLand = acres * productivity;
    const estimatedTotalCsrPoints = acres * avgCsr;
    
    const dollarsPerCsrPoint = estimatedTotalCsrPoints > 0 
      ? targetValueAgLand / estimatedTotalCsrPoints 
      : 0;

    // Determine whether to use the county default CSR or the user's custom override value
    const finalCsrValueUsed = userCsrTarget !== null ? userCsrTarget : avgCsr;

    // Total Project Land Assessed Value calculation
    const totalProjectLandAssessedValue = 
      projectLandArea * finalCsrValueUsed * dollarsPerCsrPoint * rollback;

    return {
      ...county,
      targetValueAgLand,
      estimatedTotalCsrPoints,
      dollarsPerCsrPoint,
      totalProjectLandAssessedValue,
    };
  });

  const selectedCountyData = allCounties.find(
    (c) => c.county_name.toUpperCase() === projectData.county_name?.toUpperCase()
  ) || null;

  return { allCounties, selectedCountyData };
}



export function generateSolarTaxResults({
  projectData,
  dbCounties = [],
  dbCountyTaxData = [],
  dbCityData = []
}: {
  projectData: ProjectData;
  dbCounties?: IowaAgValueCounty[];
  dbCountyTaxData?: IowaCountyTaxRow[];
  dbCityData?: IowaCityDataRow[];
}) {

  const rows = [];

   // ========================================================== //
   //               REPLACEMENT TAX CALCULATIONS                 //
  // ========================================================== //

  const selectedCapacityFactor = projectData.use_avg_solar_capacity_factor === "yes"
    ? (23.40 / 100) // 23.40 is the standard default value.
    : Number((projectData.avg_solar_capacity_factor / 100) || 0);

  const electricity_generated_annually = Number((projectData.nameplate_capacity || 0) * selectedCapacityFactor) * 8760;
  console.log("Electricity Generated Annually:", electricity_generated_annually);

  // Land value.
  const { selectedCountyData } = agLandCalculations(dbCounties, projectData);
  const land_assessed_value = selectedCountyData?.totalProjectLandAssessedValue || 0;
  console.log("Chosen County Land Assessed Value:", land_assessed_value);

  // Total Replacement Tax Revenue:
  const generation_tax = electricity_generated_annually * 1000 * 0.0006;
  console.log("Generation Tax:", generation_tax);

  // Delivery tax.
  const delivery_tax_rate = projectData.delivery_tax_rate_per_kwh ?? 0.0001;
  const proportion_sold_fraction = Number(projectData.proportion_electricity_sold_to_utility ?? 100) / 100;
  const delivery_tax = (1 - proportion_sold_fraction) * electricity_generated_annually * delivery_tax_rate * 1000;
  console.log("Delivery Tax:", delivery_tax, delivery_tax_rate);
  console.log("Delivery Tax Calculation:", "(1 - ", proportion_sold_fraction, ") *", electricity_generated_annually, "*", delivery_tax_rate, "*", 1000);

  // Transmission Rates Per Pole Mile Line and Revenue:
  const total_4_5_to_100 = 550 * projectData.num_miles_4_5_to_100;
  const total_101_to_150 = 3000 * projectData.num_miles_101_to_150;
  const total_150_to_300 = 700 * projectData.num_miles_151_to_300;
  const total_more_than_300 = 7000 * projectData.more_than_300;

  const sum_transmission_rates = total_4_5_to_100 + total_101_to_150 + total_150_to_300 + total_more_than_300;
  console.log("Sum transmission rates:", sum_transmission_rates);

  const transmission_tax = 
  projectData.all_transmission_infrastructure_utility_owned?.toLowerCase() === "yes"
    ? 0
    : sum_transmission_rates;

  console.log("Transmission Tax:", transmission_tax)

  // Total replacement tax.
  const total_replacement_tax = generation_tax + delivery_tax + transmission_tax;
  console.log("Total Replacement Tax:", total_replacement_tax);

  // ========================================================== //
   //               Millage Rates and Proportion                 //
  // ========================================================== //

  // Gets selected county/city name.
  const userCounty = projectData.county_name?.trim().toUpperCase() || "";
  const selectedCityName = projectData.city_name?.trim().toUpperCase() || "";
  const userCityOrDistrict = projectData.school_district?.trim().toUpperCase() || "";

  // Determines city/rural classification from selections.
  const isRural = projectData.city_rural_classification?.toLowerCase() === "rural" || projectData.is_located_in_city === false;
  const isCity = !isRural && (projectData.city_rural_classification?.toLowerCase() === "city" || projectData.is_located_in_city === true);

  // Gets county data from state.
  const countyRow = dbCountyTaxData.find((c: any) => {
    const name = c.county_name || c.County;
    return name?.toString().trim().toUpperCase() === userCounty;
  });

  // Gets city data from state.
  const cityRow = dbCityData.find((c: any) => {
    const dbCounty = (c.county_name || c.County || "").toString().trim().toUpperCase();
    const dbCity = (c.city_name || c.City || "").toString().trim().toUpperCase();
    
    return dbCounty === userCounty && dbCity === selectedCityName;
  });

  // Calculates mills based on city/rural classification.
  const countyBaseMills = countyRow ? Number(countyRow.urban_rate || 0) : 0;
  const countyRuralMills = isRural ? Number((countyRow?.rural_rate || 0) - (countyRow?.urban_rate || 0)) : 0;
  const cityMills = isCity && cityRow 
    ? Number(cityRow.regular_without_ag || 0) // Use ONLY the Ag levy column
    : 0;
  
  // Gets school district data from state.
  const schoolMills = Number((projectData as any).school_total_rate || 0);

  // Calculates total mills based on the above data.
  const total_mills = countyBaseMills + countyRuralMills + cityMills + schoolMills;

    console.log(`Math Check: Base(${countyBaseMills}) + Rural(${countyRuralMills}) + City(${cityMills}) + School(${schoolMills}) = Total(${total_mills})`);



    // Console logs for accuracy checks.
    console.log("--- DATABASE CHECK ---");
    console.log("dbCounties Length:", dbCounties.length);
    console.log("dbCountyTaxData Length:", dbCountyTaxData.length);
    console.log("dbCityData Length:", dbCityData.length);
    console.log("User Selection:", { userCounty, userCityOrDistrict });

// Display formatting.
const millageRows = [
    {
      jurisdiction: "County",
      name: countyRow ? countyRow.county_name.toUpperCase() : userCounty,
      mills: countyBaseMills,
      taxRate: countyBaseMills / 10, 
      distributionPercent: total_mills > 0 ? (countyBaseMills / total_mills) * 100 : 0,
      previousRevenue: land_assessed_value * (countyBaseMills / 1000)
    },
    {
      jurisdiction: "County Additional Rural Rate",
      name: isRural ? (countyRow ? countyRow.county_name.toUpperCase() : userCounty) : "—",
      mills: isRural ? countyRuralMills : 0, // Fix: Zero out if urban
      taxRate: isRural ? countyRuralMills / 10 : 0,
      distributionPercent: (isRural && total_mills > 0) ? (countyRuralMills / total_mills) * 100 : 0,
      previousRevenue: isRural ? land_assessed_value * (countyRuralMills / 1000) : 0
    },
    {
      jurisdiction: "City",
      name: isCity ? selectedCityName : "—",
      mills: cityMills,
      taxRate: cityMills / 10,
      distributionPercent: total_mills > 0 ? (cityMills / total_mills) * 100 : 0,
      previousRevenue: land_assessed_value * (cityMills / 1000)
    },
    {
      jurisdiction: "School District",
      name: userCityOrDistrict,
      mills: schoolMills,
      taxRate: schoolMills / 10,
      distributionPercent: total_mills > 0 ? (schoolMills / total_mills) * 100 : 0,
      previousRevenue: land_assessed_value * (schoolMills / 1000)
    }
  ];

  const total_previous_revenue = millageRows.reduce((sum, r) => sum + r.previousRevenue, 0);
  const total_distribution_percent = millageRows.reduce((sum, r) => sum + r.distributionPercent, 0);

  // ========================================================== //
  //                   CONSOLE VALIDATION                       //
  // ========================================================== //

  console.log("\n--- JURISDICTIONAL MILLAGE TABLE ---");
  console.table(
    millageRows.map((r) => ({
      Jurisdiction: r.jurisdiction,
      Name: r.name || "—",
      Mills: r.mills.toFixed(5),
      "Tax Rate": `${(r.mills / 10).toFixed(2)}%`,
      "Replacement Tax Distribution %": `${Math.round(r.distributionPercent)}%`,
      "Previous Real Property Tax Revenue": r.previousRevenue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }),
    }))
  );

   // ========================================================== //
  //                 TAX REVENUE BY UNIT                        //
  // ========================================================== //

  const taxRevenueRows = millageRows.map((r) => {
    // Convert distribution percentage back to a fraction decimal
    const distFraction = r.distributionPercent / 100;

    // Calculate the Generation, Delivery, Transmission, and Total Revenues.
    const rowGeneration = generation_tax * distFraction;
    const rowDelivery = delivery_tax * distFraction;
    const rowTransmission = transmission_tax * distFraction;
    const rowTotal = rowGeneration + rowDelivery + rowTransmission;

    return {
      jurisdiction: r.jurisdiction,
      name: r.name,
      generation: rowGeneration,
      delivery: rowDelivery,
      transmission: rowTransmission,
      total: rowTotal,
    };
  });

  // Calculate Column Totals.
  const total_unit_generation = taxRevenueRows.reduce((sum, r) => sum + r.generation, 0);
  const total_unit_delivery = taxRevenueRows.reduce((sum, r) => sum + r.delivery, 0);
  const total_unit_transmission = taxRevenueRows.reduce((sum, r) => sum + r.transmission, 0);
  const total_unit_revenue = taxRevenueRows.reduce((sum, r) => sum + r.total, 0);

  // Helper function that cleanly displays for console log check.
  const formatCurr = (val: number) =>
    val.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    });


  // Console check for accuracy.
  console.log("\n--- TAX REVENUE BY UNIT TABLE ---");
  console.table(
    taxRevenueRows.map((r) => ({
      Jurisdiction: r.jurisdiction,
      Name: r.name || "—",
      Generation: formatCurr(r.generation),
      Delivery: formatCurr(r.delivery),
      Transmission: formatCurr(r.transmission),
      Total: formatCurr(r.total),
    }))
  );

  console.log("TAX REVENUE BY UNIT TOTALS:", {
    "Total Generation": formatCurr(total_unit_generation),
    "Total Delivery": formatCurr(total_unit_delivery),
    "Total Transmission": formatCurr(total_unit_transmission),
    "Grand Total": formatCurr(total_unit_revenue),
  });

  return {
    electricity_generated_annually,
    generation_tax,
    delivery_tax,
    transmission_tax,
    total_replacement_tax,
    land_assessed_value,
    millageRows,
    taxRevenueRows,
    totals: {
      total_mills,
      total_distribution_percent,
      total_previous_revenue,
    }
  };
}


export function generateWindTaxResults({
  projectData,
  dbCounties = [],
  dbCountyTaxData = [],
  dbCityData = []
}: {
  projectData: WindProjectData;
  dbCounties?: IowaWindAgValueCounty[];
  dbCountyTaxData?: IowaCountyTaxRow[];
  dbCityData?: IowaCityDataRow[];
}) {

  const rows = [];

  const netAcquisitionCost = Number(projectData.wind_net_acquisition_cost || 0) * Number(projectData.nameplate_capacity);

  // ========================================================== //
   //               Millage Rates and Proportion                 //
  // ========================================================== //

  // Gets selected county/city name.
  const userCounty = projectData.county_name?.trim().toUpperCase() || "";
  const selectedCityName = projectData.city_name?.trim().toUpperCase() || "";
  const userCityOrDistrict = projectData.school_district?.trim().toUpperCase() || "";


  // Determines city/rural classification from selections.
  const isRural = projectData.city_rural_classification?.toLowerCase() === "rural" || projectData.is_located_in_city === false;
  const isCity = !isRural && (projectData.city_rural_classification?.toLowerCase() === "city" || projectData.is_located_in_city === true);

  // Gets county data from state.
  const countyRow = dbCountyTaxData.find((c: any) => {
    const name = c.county_name || c.County;
    return name?.toString().trim().toUpperCase() === userCounty;
  });

  // Gets city data from state.
  const cityRow = dbCityData.find((c: any) => {
    const dbCounty = (c.county_name || c.County || "").toString().trim().toUpperCase();
    const dbCity = (c.city_name || c.City || "").toString().trim().toUpperCase();
    
    return dbCounty === userCounty && dbCity === selectedCityName;
  });

  // Calculates mills based on city/rural classification.
  const countyBaseMills = countyRow ? Number(countyRow.urban_rate || 0) : 0;
  const countyRuralMills = isRural ? Number((countyRow?.rural_rate || 0) - (countyRow?.urban_rate || 0)) : 0;
  const cityMills = isCity && cityRow 
    ? Number(cityRow.regular_without_ag || 0) // Use ONLY the Ag levy column
    : 0;
  
  // Gets school district data from state.
  const schoolMills = Number((projectData as any).school_total_rate || 0);

  // Calculates total mills based on the above data.
  const total_mills = countyBaseMills + countyRuralMills + cityMills + schoolMills;

    // Console logs for accuracy checks.
    console.log("--- DATABASE CHECK ---");
    console.log("dbCounties Length:", dbCounties.length);
    console.log("dbCountyTaxData Length:", dbCountyTaxData.length);
    console.log("dbCityData Length:", dbCityData.length);
    console.log("User Selection:", { userCounty, userCityOrDistrict });

// Display formatting.
const millageRows = [
    {
      jurisdiction: "County",
      name: countyRow ? countyRow.county_name.toUpperCase() : userCounty,
      mills: countyBaseMills,
      taxRate: countyBaseMills / 10, 
      distributionPercent: total_mills > 0 ? (countyBaseMills / total_mills) * 100 : 0,
    },
    {
      jurisdiction: "County Additional Rural Rate",
      name: isRural ? (countyRow ? countyRow.county_name.toUpperCase() : userCounty) : "—",
      mills: isRural ? countyRuralMills : 0, // Fix: Zero out if urban
      taxRate: isRural ? countyRuralMills / 10 : 0,
      distributionPercent: (isRural && total_mills > 0) ? (countyRuralMills / total_mills) * 100 : 0,
    },
    {
      jurisdiction: "City",
      name: isCity ? selectedCityName : "—",
      mills: cityMills,
      taxRate: cityMills / 10,
      distributionPercent: total_mills > 0 ? (cityMills / total_mills) * 100 : 0,
    },
    {
      jurisdiction: "School District",
      name: userCityOrDistrict,
      mills: schoolMills,
      taxRate: schoolMills / 10,
      distributionPercent: total_mills > 0 ? (schoolMills / total_mills) * 100 : 0,
    }
  ];

  const total_distribution_percent = millageRows.reduce((sum, r) => sum + r.distributionPercent, 0);

  // ========================================================== //
  //                   CONSOLE VALIDATION                       //
  // ========================================================== //

  console.log("\n--- JURISDICTIONAL MILLAGE TABLE ---");
  console.table(
    millageRows.map((r) => ({
      Jurisdiction: r.jurisdiction,
      Name: r.name || "—",
      Mills: r.mills.toFixed(5),
      "Tax Rate": `${(r.mills / 10).toFixed(2)}%`,
      "Replacement Tax Distribution %": `${Math.round(r.distributionPercent)}%`,
    }))
  );

   // ============================================================= //
   // Taxable Value Schedule for Special Valuation of Wind Projects //
   // ============================================================= //


  const lifespan = Number(projectData.expected_useful_life || 30);
  
  // Iowa Special Valuation multipliers.
  const multipliers = [0, 0.05, 0.10, 0.15, 0.20, 0.25, 0.30];

  const valuationSchedule = Array.from({ length: lifespan }, (_, i) => {
    const year = i + 1;
    // Use the hardcoded multiplier for years 1-7, then default to 30% (0.30)
    const multiplier = i < multipliers.length ? multipliers[i] : 0.30;
    const taxableValue = netAcquisitionCost * multiplier;

    console.log("Net acquisition cost: ", netAcquisitionCost);

    return {
      year,
      multiplier: `${(multiplier * 100).toFixed(0)}%`,
      taxableValue
    };
  });

  // Calculate the Year 1 Total Valuation (which is $0 based on your table)
  const year1TaxableValue = valuationSchedule[0].taxableValue;

  console.log("\n--- WIND SPECIAL VALUATION SCHEDULE ---");
  console.table(valuationSchedule.slice(0, 10)); // Logs first 10 years to console

  return {
    millageRows,
    totals: {
      total_mills,
      total_distribution_percent,
    }
  };
}
