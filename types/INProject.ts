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

  north_land_assessed_value: number;
  central_land_assessed_value: number;
  south_land_assessed_value: number;

  land_assessed_value: number;
  rp_district: string;

  total_investment: number;

}



