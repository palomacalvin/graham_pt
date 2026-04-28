export interface ProjectData {
  county: string;

  // Project type.
  project_type: "Solar" | "Wind" | "";

  // User choices.
  number_of_turbines: number;
  land_area: number;
  inflation_rate: number;
  nameplate_capacity: number;
  discount_rate: number;
  expected_useful_life: number;

  // Location selections.
  county_name: string;

  // Location specific details.
  avg_land_market_value: number;

  // Project specifications.
  project_start_month: string;
  project_start_day: number;
  market_value_source: string;
  manual_market_value: number;
  is_public_power: string;
  pilot_value: number;

}


