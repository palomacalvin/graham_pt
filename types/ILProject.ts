export interface ProjectData {
  county: string;

  // Project type.
  project_type: "Solar" | "Wind" | "";

  // Tax rates.
  unit1: number;
  unit2: number;
  unit3: number;
  unit4: number;
  unit5: number;
  unit6: number;
  unit7: number;
  unit8: number;
  unit9: number;
  unit10: number;
  unit11: number;
  unit12: number;
  unit13: number;
  unit14: number;
  unit15: number;

  // Unit names.
  unit1_name: string;
  unit2_name: string;
  unit3_name: string;
  unit4_name: string;
  unit5_name: string;
  unit6_name: string;
  unit7_name: string;
  unit8_name: string;
  unit9_name: string;
  unit10_name: string;
  unit11_name: string;
  unit12_name: string;
  unit13_name: string;
  unit14_name: string;
  unit15_name: string;

  // User choices.
  number_of_turbines: number;
  land_area: number;
  inflation_rate: number;
  nameplate_capacity: number;
  discount_rate: number;
  expected_useful_life: number;

  // Hard-coded inputs.
  per_mw_value_wind: number;
  per_mw_value_solar: number;
  wind_trending_factor: number;
  solar_trending_factor: number;
  county_avg_soil_productivity: number;
}



