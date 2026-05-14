export interface ProjectData {
    county_name: string;
    city_name: string;
    school_district: string;

    // User choices.
    land_area: number;
    inflation_rate: number;
    nameplate_capacity: number;
    discount_rate: number;
    expected_useful_life: number;
    is_located_in_city: boolean;
    city_rural_classification: string;

    // Solar specific.
    use_avg_solar_capacity_factor: string;
    avg_solar_capacity_factor: number;
    use_county_avg_csr2s: string;
    county_avg_csr2s: number;

    // Utility service specifics.
    proportion_electricity_sold_to_utility: number;
    utility_service_area: string;
    all_transmission_infrastructure_utility_owned: string;
    num_miles_4_5_to_100: number;
    num_miles_101_to_150: number;
    num_miles_151_to_300: number;
    more_than_300: number;

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

