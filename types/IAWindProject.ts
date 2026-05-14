export interface ProjectData {
    county_name: string;
    city_name: string;
    school_district: string;

    // User choices.
    number_of_turbines: number;
    land_area: number;
    inflation_rate: number;
    nameplate_capacity: number;
    discount_rate: number;
    expected_useful_life: number;
    is_located_in_city: boolean;
    city_rural_classification: string;

    // Wind-specific.
    is_project_tif: string;
    tif_percentage: number;
    use_estimated_wind_net_acquisition_cost: string;
    wind_net_acquisition_cost: number;

    delivery_tax_rate_per_kwh?: number;
    school_total_rate: number;

}

export interface IowaAgValueCounty {
  county_name: string;
  productivity_per_acre: number;
  five_yr_avg_market_value_per_acre: number;
  ag_building_factor: number;
  ag_land_adjustment: number;
  number_of_ag_acres_in_county: number;
  average_csr_in_county: number;
  ag_rollback: number;
}

export interface CalculatedAgCounty extends IowaAgValueCounty {
  targetValueAgLand: number;
  estimatedTotalCsrPoints: number;
  dollarsPerCsrPoint: number;
  totalProjectLandAssessedValue: number;
}




