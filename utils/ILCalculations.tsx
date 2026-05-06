export type Row = {
  year: number;
  age: number;
  depreciationFactor: number;
  trendingFactor: number;
  trendedCost: number;
  depreciation: number;
  fcv: number;
  assessedValue: number;
  farmlandAssessedValue: number;
};

// Generates the net assessed value table (see spreadsheet backend).
// This table is hidden in display. To check, uncomment the "Depreciation Schedule"
// code in ProjectForm.
export function generateNetAssessedValues(
  projectType: "Solar" | "Wind",
  baseCost: number, 
  startYear: number,
  maxYears: number,
  countyTrendingFactor: number,
  countyFarmlandValue: number,
  selectedInflationRate: number,
  landArea: number,
): Row[] {
  const rows: Row[] = [];

  let currentTrendingFactor = countyTrendingFactor;
  let currentFarmlandEAV = countyFarmlandValue;

  for (let i = 0; i < maxYears; i++) {
    const age = i + 1;
    const year = startYear + i;

    

    // Apply inflation starting from the second year.
    if (i > 0) {
      // currentTrendingFactor = Number((currentTrendingFactor * (1 + selectedInflationRate)));
      // currentFarmlandEAV = currentFarmlandEAV * (1 + selectedInflationRate);

      // const currentTrendingFactor = countyTrendingFactor * Math.pow(1 + selectedInflationRate, i);
      // const currentFarmlandEAV = countyFarmlandValue * Math.pow(1 + selectedInflationRate, i);

      currentTrendingFactor = currentTrendingFactor * (1 + selectedInflationRate);
      currentFarmlandEAV = currentFarmlandEAV * (1 + selectedInflationRate);
    }

    // Project related calculations (see net assessed value tab).
    const depreciationFactor = Math.min(0.04 * age, 0.70);
    const trendedCost = baseCost * currentTrendingFactor;
    const depreciation = trendedCost * depreciationFactor;
    const fcv = trendedCost - depreciation;
    const assessedValue = fcv * 1/3;
    const totalFarmlandAssessedValue = currentFarmlandEAV * landArea;

    if (i === 0) { // Check Year 1
      console.table({
        "Step": ["Trending Factor", "Trended Cost", "Depreciation", "FCV", "Assessed Value"],
        "JS Value": [currentTrendingFactor, trendedCost, depreciation, fcv, assessedValue]
      });
    }

    rows.push({
      year,
      age,
      depreciationFactor,
      trendingFactor: currentTrendingFactor,
      trendedCost,
      depreciation,
      fcv,
      assessedValue,
      farmlandAssessedValue: totalFarmlandAssessedValue,
    });
  }

  return rows.sort((a, b) => a.year - b.year);
}