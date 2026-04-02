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
      currentTrendingFactor = Number((currentTrendingFactor * (1 + selectedInflationRate)).toFixed(2));
      currentFarmlandEAV = Math.round(currentFarmlandEAV * (1 + selectedInflationRate));
    }

    // Project related calculations (see net assessed value tab).
    const depreciationFactor = Math.min(0.04 * age, 0.70);
    const trendedCost = Math.round(baseCost * currentTrendingFactor);
    const depreciation = Math.round(trendedCost * depreciationFactor);
    const fcv = Math.round(trendedCost - depreciation);
    const assessedValue = Math.round(fcv * 0.3333);
    const totalFarmlandAssessedValue = Math.round((currentFarmlandEAV * landArea));

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