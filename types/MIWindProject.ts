
export interface ProjectData {

    // Millage rates.
    county_name?: string;
    local_unit_name?: string | null;
    city?: boolean;
    village_name?: string | null;
    school_name?: string | null;
    school_code?: string | null;
    total_rate?: number;
    homestead_rate?: number;
    non_homestead_rate?: number;
    county_allocated?: number;
    county_extra_voted?: number;
    county_debt?: number;
    lu_allocated?: number;
    lu_extra_voted?: number;
    lu_debt?: number;
    sd_hold_harmless?: number;
    sd_non_homestead?: number;
    sd_debt?: number;
    sd_sinking_fund?: number;
    sd_comm_pers?: number;
    sd_recreational?: number;
    isd_allocated?: number;
    isd_vocational?: number;
    isd_special_ed?: number;
    isd_debt?: number;
    cc_operating?: number;
    part_unit_auth?: number;
    part_unit_auth_debt?: number;
    special_assessment?: number;
    village_allocated?: number;
    village_extra_voted?: number;
    village_debt?: number;
    village_auth?: number;
    village_auth_debt?: number;
    village_special_assessment?: number;
    cc_debt?: number;
    isd_enhancement?: number;

    // User selections.
    original_cost_pre_interface?: number;
    original_cost_post_interface?: number;
    expected_useful_life?: number;
    inflation_multiplier?: number;
    annual_discount_rate?: number;
    number_1_5_turbines?: number;
    number_1_65_turbines?: number;
    number_2_turbines?: number;
    number_2_2_turbines?: number;
    number_2_5_turbines?: number;

    // Real property values.
    real_property_ownership_change: string;
    pre_wind_taxable_value: number;
    post_wind_taxable_value: number;
    change_in_real_property_taxable_value: 0.00;

}



