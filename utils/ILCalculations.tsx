type Row = {
  year: number;
  age: number;
  depreciationFactor: number;
  trendingFactor: number;
  trendedCost: number;
  depreciation: number;
  fcv: number;
  assessedValue: number;
};


export function generateNetAssessedValues(
  baseCost: number,
  inflationRate: number,
  startYear: number,
  years: number
): Row[] {
  const rows: Row[] = [];

  for (let i = 0; i < years; i++) {
    const age = i + 1;
    const year = startYear + i;
    const baseTrendingFactor = 1.31;
    const depreciationFactor = Math.min(0.04 * age, 0.70);

    const trendingFactor =
      age === 1
        ? baseTrendingFactor
        : baseTrendingFactor * Math.pow(1 + inflationRate, age - 1);

    const trendedCost = baseCost * trendingFactor;

    const depreciation = trendedCost * depreciationFactor;

    const fcv = trendedCost - depreciation;

    const assessedValue = fcv / 3;

    rows.push({
      year,
      age,
      depreciationFactor,
      trendingFactor,
      trendedCost,
      depreciation,
      fcv,
      assessedValue,
    });
  }

  return rows;
}

