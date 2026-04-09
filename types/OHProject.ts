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
  uses_assumed_personal_property_valuation: string;
  user_specified_personal_property_valuation: number;
  is_project_status_qep: string;
  user_specified_project_status: string;
  pct_employed_construction_workers: string;

  // Location selections.
  county_name: string;
  taxing_district: string;

  // Location specific details.
  avg_land_market_value: number;

  // Default.
  assumed_personal_property_valuation: number;
  calculated_valuation: number;

}



