export interface ProjectData {
    county_name: string;
    school_district: string;

    // User choices.
    land_area: number;
    inflation_rate: number;
    nameplate_capacity: number;
    discount_rate: number;
    expected_useful_life: number;
    is_located_in_city: boolean;
    city_rural_classification: string;

    use_avg_solar_capacity_factor: string;
    avg_solar_capacity_factor: number;
    use_county_avg_csr2s: string;
    county_avg_csr2s: number;

    proportion_electricity_sold_to_utility: number;
    utility_service_area: string;
    all_transmission_infrastructure_utility_owned: string;
    num_miles_4_5_to_100: number;
    num_miles_101_to_150: number;
    num_miles_151_to_300: number;
    more_than_300: number;
}



