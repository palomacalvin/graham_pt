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

// Static values. This section will need to be updated and rebuilt
// if there are changes over time.
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

// For determining prorate values.
const PRORATE_LOOKUP: Record<string, number> = {
  "January-1": 1, "January-2": 2, "January-3": 3, "January-4": 4, "January-5": 5, "January-6": 6, "January-7": 7, "January-8": 8, "January-9": 9, "January-10": 10, "January-11": 11, "January-12": 12, "January-13": 13, "January-14": 14, "January-15": 15, "January-16": 16, "January-17": 17, "January-18": 18, "January-19": 19, "January-20": 20, "January-21": 21, "January-22": 22, "January-23": 23, "January-24": 24, "January-25": 25, "January-26": 26, "January-27": 27, "January-28": 28, "January-29": 29, "January-30": 30, "January-31": 31,
  "February-1": 32, "February-2": 33, "February-3": 34, "February-4": 35, "February-5": 36, "February-6": 37, "February-7": 38, "February-8": 39, "February-9": 40, "February-10": 41, "February-11": 42, "February-12": 43, "February-13": 44, "February-14": 45, "February-15": 46, "February-16": 47, "February-17": 48, "February-18": 49, "February-19": 50, "February-20": 51, "February-21": 52, "February-22": 53, "February-23": 54, "February-24": 55, "February-25": 56, "February-26": 57, "February-27": 58, "February-28": 59,
  "March-1": 60, "March-2": 61, "March-3": 62, "March-4": 63, "March-5": 64, "March-6": 65, "March-7": 66, "March-8": 67, "March-9": 68, "March-10": 69, "March-11": 70, "March-12": 71, "March-13": 72, "March-14": 73, "March-15": 74, "March-16": 75, "March-17": 76, "March-18": 77, "March-19": 78, "March-20": 79, "March-21": 80, "March-22": 81, "March-23": 82, "March-24": 83, "March-25": 84, "March-26": 85, "March-27": 86, "March-28": 87, "March-29": 88, "March-30": 89, "March-31": 90,
  "April-1": 91, "April-2": 92, "April-3": 93, "April-4": 94, "April-5": 95, "April-6": 96, "April-7": 97, "April-8": 98, "April-9": 99, "April-10": 100, "April-11": 101, "April-12": 102, "April-13": 103, "April-14": 104, "April-15": 105, "April-16": 106, "April-17": 107, "April-18": 108, "April-19": 109, "April-20": 110, "April-21": 111, "April-22": 112, "April-23": 113, "April-24": 114, "April-25": 115, "April-26": 116, "April-27": 117, "April-28": 118, "April-29": 119, "April-30": 120,
  "May-1": 121, "May-2": 122, "May-3": 123, "May-4": 124, "May-5": 125, "May-6": 126, "May-7": 127, "May-8": 128, "May-9": 129, "May-10": 130, "May-11": 131, "May-12": 132, "May-13": 133, "May-14": 134, "May-15": 135, "May-16": 136, "May-17": 137, "May-18": 138, "May-19": 139, "May-20": 140, "May-21": 141, "May-22": 142, "May-23": 143, "May-24": 144, "May-25": 145, "May-26": 146, "May-27": 147, "May-28": 148, "May-29": 149, "May-30": 150, "May-31": 151,
  "June-1": 152, "June-2": 153, "June-3": 154, "June-4": 155, "June-5": 156, "June-6": 157, "June-7": 158, "June-8": 159, "June-9": 160, "June-10": 161, "June-11": 162, "June-12": 163, "June-13": 164, "June-14": 165, "June-15": 166, "June-16": 167, "June-17": 168, "June-18": 169, "June-19": 170, "June-20": 171, "June-21": 172, "June-22": 173, "June-23": 174, "June-24": 175, "June-25": 176, "June-26": 177, "June-27": 178, "June-28": 179, "June-29": 180, "June-30": 181,
  "July-1": 182, "July-2": 183, "July-3": 184, "July-4": 185, "July-5": 186, "July-6": 187, "July-7": 188, "July-8": 189, "July-9": 190, "July-10": 191, "July-11": 192, "July-12": 193, "July-13": 194, "July-14": 195, "July-15": 196, "July-16": 197, "July-17": 198, "July-18": 199, "July-19": 200, "July-20": 201, "July-21": 202, "July-22": 203, "July-23": 204, "July-24": 205, "July-25": 206, "July-26": 207, "July-27": 208, "July-28": 209, "July-29": 210, "July-30": 211, "July-31": 212,
  "August-1": 213, "August-2": 214, "August-3": 215, "August-4": 216, "August-5": 217, "August-6": 218, "August-7": 219, "August-8": 220, "August-9": 221, "August-10": 222, "August-11": 223, "August-12": 224, "August-13": 225, "August-14": 226, "August-15": 227, "August-16": 228, "August-17": 229, "August-18": 230, "August-19": 231, "August-20": 232, "August-21": 233, "August-22": 234, "August-23": 235, "August-24": 236, "August-25": 237, "August-26": 238, "August-27": 239, "August-28": 240, "August-29": 241, "August-30": 242, "August-31": 243,
  "September-1": 244, "September-2": 245, "September-3": 246, "September-4": 247, "September-5": 248, "September-6": 249, "September-7": 250, "September-8": 251, "September-9": 252, "September-10": 253, "September-11": 254, "September-12": 255, "September-13": 256, "September-14": 257, "September-15": 258, "September-16": 259, "September-17": 260, "September-18": 261, "September-19": 262, "September-20": 263, "September-21": 264, "September-22": 265, "September-23": 266, "September-24": 267, "September-25": 268, "September-26": 269, "September-27": 270, "September-28": 271, "September-29": 272, "September-30": 273,
  "October-1": 274, "October-2": 275, "October-3": 276, "October-4": 277, "October-5": 278, "October-6": 279, "October-7": 280, "October-8": 281, "October-9": 282, "October-10": 283, "October-11": 284, "October-12": 285, "October-13": 286, "October-14": 287, "October-15": 288, "October-16": 289, "October-17": 290, "October-18": 291, "October-19": 292, "October-20": 293, "October-21": 294, "October-22": 295, "October-23": 296, "October-24": 297, "October-25": 298, "October-26": 299, "October-27": 300, "October-28": 301, "October-29": 302, "October-30": 303, "October-31": 304,
  "November-1": 305, "November-2": 306, "November-3": 307, "November-4": 308, "November-5": 309, "November-6": 310, "November-7": 311, "November-8": 312, "November-9": 313, "November-10": 314, "November-11": 315, "November-12": 316, "November-13": 317, "November-14": 318, "November-15": 319, "November-16": 320, "November-17": 321, "November-18": 322, "November-19": 323, "November-20": 324, "November-21": 325, "November-22": 326, "November-23": 327, "November-24": 328, "November-25": 329, "November-26": 330, "November-27": 331, "November-28": 332, "November-29": 333, "November-30": 334,
  "December-1": 335, "December-2": 336, "December-3": 337, "December-4": 338, "December-5": 339, "December-6": 340, "December-7": 341, "December-8": 342, "December-9": 343, "December-10": 344, "December-11": 345, "December-12": 346, "December-13": 347, "December-14": 348, "December-15": 349, "December-16": 350, "December-17": 351, "December-18": 352, "December-19": 353, "December-20": 354, "December-21": 355, "December-22": 356, "December-23": 357, "December-24": 358, "December-25": 359, "December-26": 360, "December-27": 361, "December-28": 362, "December-29": 363, "December-30": 364, "December-31": 365,
};



/* Main calculations */
export function calculateNEResults(
  projectData: ProjectData,
  taxUnits: TaxUnit[]
): NECalculationResult[] {
  const activeUnits = taxUnits.filter(u => u.name.trim() !== "" && (u.rate ?? 0) > 0);
  const totalProjectRate = activeUnits.reduce((sum, u) => sum + (u.rate || 0), 0);
  const totalAnnualRevenueYear2Plus = (projectData.nameplate_capacity || 0) * 3518;

  // Calculating prorate data.
  const monthMap: Record<string, string> = {
    "1": "January", "2": "February", "3": "March", "4": "April", 
    "5": "May", "6": "June", "7": "July", "8": "August", 
    "9": "September", "10": "October", "11": "November", "12": "December"
  };

  const rawMonth = String(projectData.project_start_month || "1");
  const selectedMonthName = monthMap[rawMonth] || "January";
  const selectedDay = projectData.project_start_day || 1;

  const lookupKey = `${selectedMonthName}-${selectedDay}`;

  const dateValue = PRORATE_LOOKUP[lookupKey] || 1;

  const prorateValue = dateValue - 1;

  // 5. Final Multiplier: 1 - (I3 / 365)
  const prorateMultiplier = 1 - (prorateValue / 365);

  console.log(`Lookup Key: ${lookupKey} | I3: ${prorateValue} | Multiplier: ${prorateMultiplier}`);



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

  // console.log("Selected land value:", landMarketValuePerAcre)

  const totalLandMarketValue = landMarketValuePerAcre * (projectData.land_area || 0);

  // console.log("Total Land Market Value Calculation:", landMarketValuePerAcre, "* (", projectData.land_area, ")")

  const NON_SCHOOL_BOND_RATE = 0.75;
  const SCHOOL_BOND_RATE = 0.50;

  // Yearly results section.
  const inflationRate = projectData.inflation_rate || 0.02;
  const discountRate = projectData.discount_rate || 0.07;
  const projectLife = projectData.expected_useful_life || 30;

  const results: NECalculationResult[] = activeUnits.map((unit) => {

    const unitRate = unit.rate || 0;

    const totalProjectRate = activeUnits.reduce((sum, u) => sum + (u.rate || 0), 0);

    const proportionalTaxRate = totalProjectRate > 0 ? (unit.rate || 0) / totalProjectRate : 0;

    const capacityTaxRevenue = proportionalTaxRate * totalYear1Revenue; 

    // console.log("CAPACITYTAX")
    // console.log("Capacity tax revenue: ", proportionalTaxRate, "*", totalYear1Revenue);

    const projectRealTaxRevenue = (unitRate / 100) * totalLandMarketValue;

    // console.log("Project Real Tax Rate Calculation: ", unitRate, "*", totalLandMarketValue);


    // Previous Farmland Tax Revenue.
    const isBond = unit.type === "School District (bond)";
    const assessmentRatio = isBond ? SCHOOL_BOND_RATE : NON_SCHOOL_BOND_RATE;
    const previousFarmlandTaxRevenue = (unitRate / 100) * totalLandMarketValue * assessmentRatio;
    // console.log("Previous farmland tax calculation: ", "(", unitRate, "/", "100 ) *", totalLandMarketValue, "*", assessmentRatio);

    const netRealPropertyRevenue = projectRealTaxRevenue - previousFarmlandTaxRevenue;
    const netTaxRevenue = capacityTaxRevenue + netRealPropertyRevenue;
    
    
    // Yearly array calculations.
    const yearlyCashFlows: number[] = [];
    
    for (let i = 0; i < projectLife; i++) {
      const currentYearCapacity = i === 0
        ? capacityTaxRevenue
        : proportionalTaxRate * totalAnnualRevenueYear2Plus;

        const yearRealPropertyNet = (unitRate / 100) * totalLandMarketValue * (1 - assessmentRatio) * Math.pow(1 + inflationRate, i);
    
        yearlyCashFlows.push(currentYearCapacity + yearRealPropertyNet);
    }

    const grossTotal = yearlyCashFlows.reduce((a, b) => a + b, 0);
    const npvTotal = calculateNPV(discountRate, yearlyCashFlows);

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
      grossTotal,
      npvTotal,
    };
});

return results;

}