// /types/project.ts
export interface ProjectData {
  county_name: string;

  project_type: "Solar" | "Wind" | "";

  // Conversion rates.
  over_30_acres: number;
  between_10_and_30_acres: number;
  under_10_acres: number;

  // Locality details.
  municipality: string;
  code: string;
  tvc: string;

  // Locality properties.
  grade_1: number;
  grade_2: number;
  grade_3: number;
  pasture: number;

  // Tax rates.
  gross_rate: number;
  effective_rate: number;
  total_property_tax: number;
  school_tax: number;
  college_tax: number;
  county_tax: number;
  local_tax: number;
  other_tax: number;

  // User choices.
  selected_grade: 1 | 2 | 3 | 4;
  number_of_turbines: number;
  land_area: number;

  // Other.
  inflation_rate: number;
  nameplate_capacity: number;

}



