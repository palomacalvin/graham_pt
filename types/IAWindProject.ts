export interface ProjectData {
    county_name: string;
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

}



