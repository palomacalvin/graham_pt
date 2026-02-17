"use client";

import { useEffect, useState } from "react";
import { ProjectData } from "@/types/MISolarProject";
import { MIMultiplicationFactors } from "@/types/MIMultiplicationFactors";


interface Props {
    projectData: ProjectData;
}


export default function MISolarTaxResults( {projectData}: Props) {
    const calculated_homestead_rate = (projectData?.homestead_rate ?? 0) - (projectData?.sd_comm_pers ?? 0);
    const calculated_non_homestead_rate = (projectData?.non_homestead_rate ?? 0) - (projectData?.sd_comm_pers ?? 0);
    const county_allocated = (projectData?.county_allocated ?? 0);
    const county_extra_voted = (projectData?.county_extra_voted ?? 0);
    const county_debt = (projectData.county_debt ?? 0);
    const local_unit_allocated = (projectData.lu_allocated ?? 0);
    const local_unit_extra_voted = (projectData.lu_extra_voted ?? 0);
    const local_unit_debt = (projectData.lu_debt ?? 0);
    const school_district_hold_harmless = (projectData.sd_hold_harmless ?? 0);
    const school_district_non_homestead_operating = (projectData.sd_non_homestead ?? 0);
    const school_district_debt = (projectData.sd_debt ?? 0);
    const school_district_sinking_fund = (projectData.sd_sinking_fund ?? 0);
    const school_district_recreational = (projectData.sd_recreational ?? 0);
    const intermediate_school_district_allocated = (projectData.isd_allocated ?? 0);
    const intermediate_school_district_vocational = (projectData.isd_vocational ?? 0);
    const intermediate_school_district_special_ed = (projectData.isd_special_ed ?? 0);
    const intermediate_school_district_debt = (projectData.isd_debt ?? 0);
    const intermediate_school_district_enhancement = (projectData.isd_enhancement ?? 0);
    const community_college_operating = (projectData.cc_operating ?? 0);
    const community_college_debt = (projectData.cc_debt ?? 0);
    const public_authorities = (projectData.part_unit_auth ?? 0);
    const public_authority_debt = (projectData.part_unit_auth_debt ?? 0);
    const special_assessment = (projectData.special_assessment ?? 0);
    const village_allocated = (projectData.village_allocated ?? 0);
    const village_extra_voted = (projectData.village_extra_voted ?? 0);
    const village_debt = (projectData.village_debt ?? 0);
    const village_public_authorities = (projectData.village_auth ?? 0);
    const village_public_authority_debt = (projectData.village_auth_debt ?? 0);
    const village_special_assessment = (projectData.village_special_assessment ?? 0);
    

    // String for easily formatting currency.
    const formatCurrency = (value: number) => {
        const rounded = Math.round(value);
        if (rounded < 0) {
        return `($${Math.abs(rounded).toLocaleString()})`;
        }
        return `$${rounded.toLocaleString()}`;
    };

    // Toggle state for the PILT and non-PILT tables.
    const [visibleTable, setVisibleTable] = 
        useState<"pilt" | "non_pilt" | null>(null);


    // Multiplication factors.
    
    // Define state.
    const [multiplicationFactors, setMultiplicationFactors] = 
    useState<MIMultiplicationFactors[]>([]);

    useEffect(() => {
        const fetchFactors = async () => {
            try {
                console.log("Fetching multiplication factors...");
                const res = await fetch("/api/michigan/mult_factors");
                console.log("Response status:", res.status);

                
                if (!res.ok) {
                    throw new Error("Failed to fetch multiplication factors");
                }

                const data = await res.json();
                console.log("Raw data from API:", data);

                const factors = Array.isArray(data.factors) ? data.factors : [];
                console.log("Parsed multiplication factors:", factors);


                setMultiplicationFactors(
                    Array.isArray(data.factors) ? data.factors : []
                );

            } catch (error) {
                console.error("Error fetching multiplication factors:", error);
                setMultiplicationFactors([]); // NEVER allow undefined
            }
        };

        fetchFactors();
    }, []);


    // ------------ Non-PILT IPP Revenue ----------------


    // County - Allocated
    const original_cost = projectData.original_cost_pre_inverter ?? 0;
    const county_allocated_rate = projectData.county_allocated ?? 0;

    // Make a copy and sort by years_ago_from_present ascending (1 → 35)
    const sortedFactors = [...multiplicationFactors].sort(
    (a, b) => a.years_ago_from_present - b.years_ago_from_present
    );

    // Map sequentially: Year 1 → Year 35
    const county_allocated_yearly_calculations = multiplicationFactors.slice(0, 30).map((factor, index) => {
    const year = index + 1; // sequential display year
    const tcv = original_cost * factor.factor_form_5762 * 0.5;
    const county_allocated_revenue = (county_allocated_rate / 1000) * tcv;

        return { year, tcv, county_allocated_revenue };
    });


    // County - Extra Voted
    const county_extra_voted_yearly_calculations = multiplicationFactors.slice(0, 30).map((factor, index) => {
    const year = index + 1; // sequential display year
    const tcv = original_cost * factor.factor_form_5762 * 0.5;
    const county_extra_voted_revenue = (county_extra_voted / 1000) * tcv;

        return { year, tcv, county_extra_voted_revenue };
    });


     // County - Debt
    const county_debt_yearly_calculations = multiplicationFactors.slice(0, 30).map((factor, index) => {
    const year = index + 1; // sequential display year
    const tcv = original_cost * factor.factor_form_5762 * 0.5;
    const county_debt_revenue = (county_debt / 1000) * tcv;

        return { year, tcv, county_debt_revenue };
    });


    // -------- Sum of values by year --------
    const total_county_revenue_per_year = Array.from({ length: 30 }, (_, i) => {
    const allocated = county_allocated_yearly_calculations[i]?.county_allocated_revenue ?? 0;
    const extra_voted = county_extra_voted_yearly_calculations[i]?.county_extra_voted_revenue ?? 0;
    const debt = county_debt_yearly_calculations[i]?.county_debt_revenue ?? 0;

        return allocated + extra_voted + debt;
    });

    // Sum all yearly totals into one grand total
    const gross_county_revenue = total_county_revenue_per_year.reduce(
        (acc, val) => acc + val,
        0
    );

    // Net Present Value of IPP Revenue Over Course of Project - County
    // annualDiscountRate should be in decimal form, e.g., 5% -> 0.05

    // Sum all components per year
    const totalRevenueByYear = Array.from({ length: 30 }, (_, i) => {
    return (
        (county_allocated_yearly_calculations[i]?.county_allocated_revenue ?? 0) +
        (county_extra_voted_yearly_calculations[i]?.county_extra_voted_revenue ?? 0) +
        (county_debt_yearly_calculations[i]?.county_debt_revenue ?? 0)
    );
    });

    // Annual discount rate from projectData
    const annual_discount_rate = projectData.annual_discount_rate ?? 0.05;

    // First year cash flow
    const first_year_cash_flow = totalRevenueByYear[0] ?? 0;

    // Remaining cash flows (years 2 → 30)
    const remaining_cash_flows = totalRevenueByYear.slice(1);

    // NPV function for remaining years
    const npv = (rate: number, cash_flows: number[]) => {
    return cash_flows.reduce((sum, cash_flow, index) => {
        return sum + cash_flow / Math.pow(1 + rate, index + 1); // index +1 because first cash flow is year 2
    }, 0);
    };

    // Apply NPV to remaining years and add first year
    const gross_county_npv = npv(annual_discount_rate, remaining_cash_flows) + first_year_cash_flow;

    console.log("Gross IPP Revenue Over Course of Project - County (NPV):", gross_county_npv);


    // Local Unit - Allocated
    const local_unit_allocated_yearly_calculations = multiplicationFactors.slice(0, 30).map((factor, index) => {
    const year = index + 1; // sequential display year
    const tcv = original_cost * factor.factor_form_5762 * 0.5;
    const local_unit_allocated_revenue = (local_unit_allocated / 1000) * tcv;

        return { year, tcv, local_unit_allocated_revenue };
    });


    // Local Unit - Extra Vpted
    const local_unit_extra_voted_yearly_calculations = multiplicationFactors.slice(0, 30).map((factor, index) => {
    const year = index + 1; // sequential display year
    const tcv = original_cost * factor.factor_form_5762 * 0.5;
    const local_unit_extra_voted_revenue = (local_unit_extra_voted / 1000) * tcv;

        return { year, tcv, local_unit_extra_voted_revenue };
    });


    // Local Unit - Debt
    const local_unit_debt_yearly_calculations = multiplicationFactors.slice(0, 30).map((factor, index) => {
    const year = index + 1; // sequential display year
    const tcv = original_cost * factor.factor_form_5762 * 0.5;
    const local_unit_debt_revenue = (local_unit_debt / 1000) * tcv;

        return { year, tcv, local_unit_debt_revenue };
    });



    // -------- Sum of values by year --------
    const total_local_unit_revenue_per_year = Array.from({ length: 30 }, (_, i) => {
    const allocated = local_unit_allocated_yearly_calculations[i]?.local_unit_allocated_revenue ?? 0;
    const extra_voted = local_unit_extra_voted_yearly_calculations[i]?.local_unit_extra_voted_revenue ?? 0;
    const debt = local_unit_debt_yearly_calculations[i]?.local_unit_debt_revenue ?? 0;

        return allocated + extra_voted + debt;
    });

    // Sum all yearly totals into one grand total
    const gross_local_unit_revenue = total_local_unit_revenue_per_year.reduce(
        (acc, val) => acc + val,
        0
    );

    // Net Present Value of IPP Revenue Over Course of Project - County
    // annualDiscountRate should be in decimal form, e.g., 5% -> 0.05

    // Sum all components per year
    const totalLocalUnitRevenueByYear = Array.from({ length: 30 }, (_, i) => {
    return (
        (local_unit_allocated_yearly_calculations[i]?.local_unit_allocated_revenue ?? 0) +
        (local_unit_extra_voted_yearly_calculations[i]?.local_unit_extra_voted_revenue ?? 0) +
        (local_unit_debt_yearly_calculations[i]?.local_unit_debt_revenue ?? 0)
    );
    });

    // First year cash flow
    const local_unit_first_year_cash_flow = totalLocalUnitRevenueByYear[0] ?? 0;

    // Remaining cash flows (years 2 → 30)
    const local_unit_remaining_cash_flows = totalLocalUnitRevenueByYear.slice(1);

    // Apply NPV to remaining years and add first year
    const gross_local_unit_npv = npv(annual_discount_rate, local_unit_remaining_cash_flows) + local_unit_first_year_cash_flow;



    console.log("multiplicationFactors:", multiplicationFactors);
    console.log("original_cost:", original_cost);
    console.log("county_debt:", county_debt);
    console.log("multiplicationFactors:", multiplicationFactors);

    // School District - Hold Harmless
    const sd_hold_harmless_yearly_calculations = multiplicationFactors.slice(0, 30).map((factor, index) => {
    const year = index + 1; // sequential display year
    const tcv = original_cost * factor.factor_form_5762 * 0.5;
    const sd_hold_harmless_revenue = (school_district_hold_harmless / 1000) * tcv;

        return { year, tcv, sd_hold_harmless_revenue };
    });


    // School District - Debt
    const sd_debt_yearly_calculations = multiplicationFactors.slice(0, 30).map((factor, index) => {
    const year = index + 1; // sequential display year
    const tcv = original_cost * factor.factor_form_5762 * 0.5;
    const sd_debt_revenue = (school_district_debt / 1000) * tcv;

        return { year, tcv, sd_debt_revenue };
    });


    // School District - Sinking Fund
    const sd_sinking_fund_yearly_calculations = multiplicationFactors.slice(0, 30).map((factor, index) => {
    const year = index + 1; // sequential display year
    const tcv = original_cost * factor.factor_form_5762 * 0.5;
    const sd_sinking_fund_revenue = (school_district_sinking_fund / 1000) * tcv;

        return { year, tcv, sd_sinking_fund_revenue };
    });


    // School District - Recreational
    const sd_recreational_yearly_calculations = multiplicationFactors.slice(0, 30).map((factor, index) => {
    const year = index + 1; // sequential display year
    const tcv = original_cost * factor.factor_form_5762 * 0.5;
    const sd_recreational_revenue = (school_district_recreational / 1000) * tcv;

        return { year, tcv, sd_recreational_revenue };
    });




    // -------- Sum of values by year --------
    const total_sd_revenue_per_year = Array.from({ length: 30 }, (_, i) => {
    const harmless = sd_hold_harmless_yearly_calculations[i]?.sd_hold_harmless_revenue ?? 0;
    const debt = sd_debt_yearly_calculations[i]?.sd_debt_revenue ?? 0;
    const sinking_fund = sd_sinking_fund_yearly_calculations[i]?.sd_sinking_fund_revenue ?? 0;
    const recreational = sd_recreational_yearly_calculations[i]?.sd_recreational_revenue ?? 0;

        return harmless + debt + sinking_fund + recreational;
    });

    // Sum all yearly totals into one grand total
    const gross_sd_revenue = total_sd_revenue_per_year.reduce(
        (acc, val) => acc + val,
        0
    );

    // Net Present Value of IPP Revenue Over Course of Project - County
    // annualDiscountRate should be in decimal form, e.g., 5% -> 0.05

    // Sum all components per year
    const totalSchoolDistrictRevenueByYear = Array.from({ length: 30 }, (_, i) => {
    return (
        (sd_hold_harmless_yearly_calculations[i]?.sd_hold_harmless_revenue ?? 0) +
        (sd_debt_yearly_calculations[i]?.sd_debt_revenue ?? 0) +
        (sd_sinking_fund_yearly_calculations[i]?.sd_sinking_fund_revenue ?? 0) +
        (sd_recreational_yearly_calculations[i]?.sd_recreational_revenue ?? 0)
    );
    });

    // First year cash flow
    const sd_first_year_cash_flow = totalSchoolDistrictRevenueByYear[0] ?? 0;

    // Remaining cash flows (years 2 → 30)
    const sd_remaining_cash_flows = totalSchoolDistrictRevenueByYear.slice(1);

    // Apply NPV to remaining years and add first year
    const gross_school_district_npv = npv(annual_discount_rate, sd_remaining_cash_flows) + sd_first_year_cash_flow;


    // ----------------- ISD -------------------- // 

    // Intermediate School District - Allocated
    const isd_allocated_yearly_calculations = multiplicationFactors.slice(0, 30).map((factor, index) => {
    const year = index + 1; // sequential display year
    const tcv = original_cost * factor.factor_form_5762 * 0.5;
    const isd_allocated_revenue = (intermediate_school_district_allocated / 1000) * tcv;

        return { year, tcv, isd_allocated_revenue };
    });


    // Intermediate School District - Vocational
    const isd_vocational_yearly_calculations = multiplicationFactors.slice(0, 30).map((factor, index) => {
    const year = index + 1; // sequential display year
    const tcv = original_cost * factor.factor_form_5762 * 0.5;
    const isd_vocational_revenue = (intermediate_school_district_vocational / 1000) * tcv;

        return { year, tcv, isd_vocational_revenue };
    });


    // Intermediate School District - Special Education
    const isd_special_education_yearly_calculations = multiplicationFactors.slice(0, 30).map((factor, index) => {
    const year = index + 1; // sequential display year
    const tcv = original_cost * factor.factor_form_5762 * 0.5;
    const isd_special_education_revenue = (intermediate_school_district_special_ed / 1000) * tcv;

        return { year, tcv, isd_special_education_revenue };
    });


    // Intermediate School District - Debt
    const isd_debt_yearly_calculations = multiplicationFactors.slice(0, 30).map((factor, index) => {
    const year = index + 1; // sequential display year
    const tcv = original_cost * factor.factor_form_5762 * 0.5;
    const isd_debt_revenue = (intermediate_school_district_debt / 1000) * tcv;

        return { year, tcv, isd_debt_revenue };
    });


    // Intermediate School District - Enhancement
    const isd_enhancement_yearly_calculations = multiplicationFactors.slice(0, 30).map((factor, index) => {
    const year = index + 1; // sequential display year
    const tcv = original_cost * factor.factor_form_5762 * 0.5;
    const isd_enhancement_revenue = (intermediate_school_district_enhancement / 1000) * tcv;

        return { year, tcv, isd_enhancement_revenue };
    });




    // -------- Sum of values by year --------
    const total_isd_revenue_per_year = Array.from({ length: 30 }, (_, i) => {
    const allocated = isd_allocated_yearly_calculations[i]?.isd_allocated_revenue ?? 0;
    const vocational = isd_vocational_yearly_calculations[i]?.isd_vocational_revenue ?? 0;
    const special_education = isd_special_education_yearly_calculations[i]?.isd_special_education_revenue ?? 0;
    const debt = isd_debt_yearly_calculations[i]?.isd_debt_revenue ?? 0;
    const enhancement = isd_enhancement_yearly_calculations[i]?.isd_enhancement_revenue ?? 0;

        return allocated + vocational + special_education + debt + enhancement;
    });

    // Sum all yearly totals into one grand total
    const gross_isd_revenue = total_isd_revenue_per_year.reduce(
        (acc, val) => acc + val,
        0
    );

    // Net Present Value of IPP Revenue Over Course of Project - County
    // annualDiscountRate should be in decimal form, e.g., 5% -> 0.05

    // Sum all components per year
    const totalIntermediateSchoolDistrictRevenueByYear = Array.from({ length: 30 }, (_, i) => {
    return (
        (isd_allocated_yearly_calculations[i]?.isd_allocated_revenue ?? 0) +
        (isd_vocational_yearly_calculations[i]?.isd_vocational_revenue ?? 0) +
        (isd_special_education_yearly_calculations[i]?.isd_special_education_revenue ?? 0) +
        (isd_debt_yearly_calculations[i]?.isd_debt_revenue ?? 0) +
        (isd_enhancement_yearly_calculations[i]?.isd_enhancement_revenue ?? 0)
        );
    });

    // First year cash flow
    const isd_first_year_cash_flow = totalIntermediateSchoolDistrictRevenueByYear[0] ?? 0;

    // Remaining cash flows (years 2 → 30)
    const isd_remaining_cash_flows = totalIntermediateSchoolDistrictRevenueByYear.slice(1);

    // Apply NPV to remaining years and add first year
    const gross_isd_npv = npv(annual_discount_rate, isd_remaining_cash_flows) + isd_first_year_cash_flow;



    // ======================= Community College ===========================

    // Community College - Operating
    const cc_operating_yearly_calculations = multiplicationFactors.slice(0, 30).map((factor, index) => {
    const year = index + 1; // sequential display year
    const tcv = original_cost * factor.factor_form_5762 * 0.5;
    const cc_operating_revenue = (community_college_operating / 1000) * tcv;

        return { year, tcv, cc_operating_revenue };
    });


    // Community College Debt
    const cc_debt_yearly_calculations = multiplicationFactors.slice(0, 30).map((factor, index) => {
    const year = index + 1; // sequential display year
    const tcv = original_cost * factor.factor_form_5762 * 0.5;
    const cc_debt_revenue = (community_college_debt / 1000) * tcv;

        return { year, tcv, cc_debt_revenue };
    });


    // -------- Sum of values by year --------
    const total_cc_revenue_per_year = Array.from({ length: 30 }, (_, i) => {
    const operating = cc_operating_yearly_calculations[i]?.cc_operating_revenue ?? 0;
    const debt = cc_debt_yearly_calculations[i]?.cc_debt_revenue ?? 0;

        return operating + debt;
    });

    // Sum all yearly totals into one grand total
    const gross_cc_revenue = total_cc_revenue_per_year.reduce(
        (acc, val) => acc + val,
        0
    );

    // Net Present Value of IPP Revenue Over Course of Project - County
    // annualDiscountRate should be in decimal form, e.g., 5% -> 0.05

    // Sum all components per year
    const totalCommunityCollegeRevenueByYear = Array.from({ length: 30 }, (_, i) => {
    return (
        (cc_operating_yearly_calculations[i]?.cc_operating_revenue ?? 0) +
        (cc_debt_yearly_calculations[i]?.cc_debt_revenue ?? 0)
        );
    });

    // First year cash flow
    const cc_first_year_cash_flow = totalCommunityCollegeRevenueByYear[0] ?? 0;

    // Remaining cash flows (years 2 → 30)
    const cc_remaining_cash_flows = totalCommunityCollegeRevenueByYear.slice(1);

    // Apply NPV to remaining years and add first year
    const gross_cc_npv = npv(annual_discount_rate, cc_remaining_cash_flows) + cc_first_year_cash_flow;


    // ======================= Public Authorities ===========================

    // Public Authorities
    const pa_yearly_calculations = multiplicationFactors.slice(0, 30).map((factor, index) => {
    const year = index + 1; // sequential display year
    const tcv = original_cost * factor.factor_form_5762 * 0.5;
    const pa_revenue = (public_authorities / 1000) * tcv;

        return { year, tcv, pa_revenue };
    });


    // Public Authority Debt
    const pa_debt_yearly_calculations = multiplicationFactors.slice(0, 30).map((factor, index) => {
    const year = index + 1; // sequential display year
    const tcv = original_cost * factor.factor_form_5762 * 0.5;
    const pa_debt_revenue = (public_authority_debt / 1000) * tcv;

        return { year, tcv, pa_debt_revenue };
    });


    // -------- Sum of values by year --------
    const total_pa_revenue_per_year = Array.from({ length: 30 }, (_, i) => {
    const authority = pa_yearly_calculations[i]?.pa_revenue ?? 0;
    const debt = pa_debt_yearly_calculations[i]?.pa_debt_revenue ?? 0;

        return authority + debt;
    });


    // Sum all yearly totals into one grand total
    const gross_pa_revenue = total_pa_revenue_per_year.reduce(
        (acc, val) => acc + val,
        0
    );

    // Net Present Value of IPP Revenue Over Course of Project - County
    // annualDiscountRate should be in decimal form, e.g., 5% -> 0.05

    // Sum all components per year
    const totalPublicAuthorityRevenueByYear = Array.from({ length: 30 }, (_, i) => {
    return (
        (pa_yearly_calculations[i]?.pa_revenue ?? 0) +
        (pa_debt_yearly_calculations[i]?.pa_debt_revenue ?? 0)
        );
    });

    // First year cash flow
    const pa_first_year_cash_flow = totalPublicAuthorityRevenueByYear[0] ?? 0;

    // Remaining cash flows (years 2 → 30)
    const pa_remaining_cash_flows = totalPublicAuthorityRevenueByYear.slice(1);

    // Apply NPV to remaining years and add first year
    const gross_pa_npv = npv(annual_discount_rate, pa_remaining_cash_flows) + pa_first_year_cash_flow;



    // ======================= Village ===========================

    // Village - Allocated
    const village_allocated_yearly_calculations = multiplicationFactors.slice(0, 30).map((factor, index) => {
    const year = index + 1; // sequential display year
    const tcv = original_cost * factor.factor_form_5762 * 0.5;
    const village_allocated_revenue = (village_allocated / 1000) * tcv;

        return { year, tcv, village_allocated_revenue };
    });


    // Village - Extra Voted
    const village_extra_voted_yearly_calculations = multiplicationFactors.slice(0, 30).map((factor, index) => {
    const year = index + 1; // sequential display year
    const tcv = original_cost * factor.factor_form_5762 * 0.5;
    const village_extra_voted_revenue = (village_extra_voted / 1000) * tcv;

        return { year, tcv, village_extra_voted_revenue };
    });


    // Village - Debt
    const village_debt_yearly_calculations = multiplicationFactors.slice(0, 30).map((factor, index) => {
    const year = index + 1; // sequential display year
    const tcv = original_cost * factor.factor_form_5762 * 0.5;
    const village_debt_revenue = (village_debt / 1000) * tcv;

        return { year, tcv, village_debt_revenue };
    });



    // Village - Public Authorities
    const village_public_authorities_yearly_calculations = multiplicationFactors.slice(0, 30).map((factor, index) => {
    const year = index + 1; // sequential display year
    const tcv = original_cost * factor.factor_form_5762 * 0.5;
    const village_public_authorities_revenue = (village_public_authorities / 1000) * tcv;

        return { year, tcv, village_public_authorities_revenue };
    });



    // Village - Public Authority Debt
    const village_public_authority_debt_yearly_calculations = multiplicationFactors.slice(0, 30).map((factor, index) => {
    const year = index + 1; // sequential display year
    const tcv = original_cost * factor.factor_form_5762 * 0.5;
    const village_public_authority_debt_revenue = (village_public_authority_debt / 1000) * tcv;

        return { year, tcv, village_public_authority_debt_revenue };
    });


    // -------- Sum of values by year --------
    const total_village_revenue_per_year = Array.from({ length: 30 }, (_, i) => {
    const allocated = village_allocated_yearly_calculations[i]?.village_allocated_revenue ?? 0;
    const extra_voted = village_extra_voted_yearly_calculations[i]?.village_extra_voted_revenue ?? 0;
    const debt = village_debt_yearly_calculations[i]?.village_debt_revenue ?? 0;
    const pa = village_public_authorities_yearly_calculations[i]?.village_public_authorities_revenue ?? 0;
    const pa_debt = village_public_authority_debt_yearly_calculations[i]?.village_public_authority_debt_revenue ?? 0;

        return allocated + extra_voted + debt + pa + pa_debt;
    });


    // Sum all yearly totals into one grand total
    const gross_village_revenue = total_village_revenue_per_year.reduce(
        (acc, val) => acc + val,
        0
    );

    // Net Present Value of IPP Revenue Over Course of Project - County
    // annualDiscountRate should be in decimal form, e.g., 5% -> 0.05

    // Sum all components per year
    const totalVillageRevenueByYear = Array.from({ length: 30 }, (_, i) => {
    return (
        (village_allocated_yearly_calculations[i]?.village_allocated_revenue ?? 0) +
        (village_extra_voted_yearly_calculations[i]?.village_extra_voted_revenue ?? 0) +
        (village_debt_yearly_calculations[i]?.village_debt_revenue ?? 0) +
        (village_public_authorities_yearly_calculations[i]?.village_public_authorities_revenue ?? 0) +
        (village_public_authority_debt_yearly_calculations[i]?.village_public_authority_debt_revenue ?? 0)
        );
    });

    // First year cash flow
    const village_first_year_cash_flow = totalVillageRevenueByYear[0] ?? 0;

    // Remaining cash flows (years 2 → 30)
    const village_remaining_cash_flows = totalVillageRevenueByYear.slice(1);

    // Apply NPV to remaining years and add first year
    const gross_village_npv = npv(annual_discount_rate, village_remaining_cash_flows) + village_first_year_cash_flow;



    // ================================ FINAL TOTALS ============================== //

    const total_all_taxing_units = Array.from({ length: 30 }, (_, i) => {
    return (
        (total_county_revenue_per_year[i] ?? 0) +
        (total_local_unit_revenue_per_year[i] ?? 0) +
        (total_sd_revenue_per_year[i] ?? 0) +
        (total_isd_revenue_per_year[i] ?? 0) +
        (total_cc_revenue_per_year[i] ?? 0) +
        (total_pa_revenue_per_year[i] ?? 0) + 
        (total_village_revenue_per_year[i] ?? 0)
        );
    });

    // Sum all yearly totals into one grand total
    const gross_all_units_revenue = total_all_taxing_units.reduce(
        (acc, val) => acc + val,
        0
    );

    // Net Present Value of IPP Revenue Over Course of Project - County
    // annualDiscountRate should be in decimal form, e.g., 5% -> 0.05

    // Sum all components per year
    const totalAllUnitsRevenueByYear = Array.from({ length: 30 }, (_, i) => {
    return (
        (total_county_revenue_per_year[i] ?? 0) +
        (total_local_unit_revenue_per_year[i] ?? 0) +
        (total_sd_revenue_per_year[i] ?? 0) +
        (total_isd_revenue_per_year[i] ?? 0) +
        (total_cc_revenue_per_year[i] ?? 0) +
        (total_pa_revenue_per_year[i] ?? 0) + 
        (total_village_revenue_per_year[i] ?? 0)
        );
    });

    // First year cash flow
    const all_units_first_year_cash_flow = totalAllUnitsRevenueByYear[0] ?? 0;

    // Remaining cash flows (years 2 → 30)
    const all_units_remaining_cash_flows = totalAllUnitsRevenueByYear.slice(1);

    // Apply NPV to remaining years and add first year
    const gross_all_units_npv = npv(annual_discount_rate, all_units_remaining_cash_flows) + all_units_first_year_cash_flow;




    return (
        <section>
            <h1>Michigan Solar Tax Results</h1>
            <br />

            <table className="basicTable">
                <thead>
                    <tr>
                        <th>Millage Type</th>
                        <th>Rate</th>
                    </tr>
                </thead>

                <tbody>
                <tr>
                    <td>Homestead Rate</td>
                    <td>{calculated_homestead_rate}</td>
                </tr>
                <tr>
                    <td>Adjusted Non-Homestead Rate</td>
                    <td>{calculated_non_homestead_rate}</td>
                </tr>
                <tr>
                    <td>County - Allocated</td>
                    <td>{county_allocated}</td>
                </tr>
                <tr>
                    <td>County - Extra Voted</td>
                    <td>{county_extra_voted}</td>
                </tr>
                <tr>
                    <td>County - Debt</td>
                    <td>{county_debt}</td>
                </tr>
                <tr>
                    <td>Local Unit - Allocated</td>
                    <td>{local_unit_allocated}</td>
                </tr>
                <tr>
                    <td>Local Unit - Extra Voted</td>
                    <td>{local_unit_extra_voted}</td>
                </tr>
                <tr>
                    <td>Local Unit - Debt</td>
                    <td>{local_unit_debt}</td>
                </tr>
                <tr>
                    <td>School District - Hold Harmless</td>
                    <td>{school_district_hold_harmless}</td>
                </tr>
                <tr>
                    <td>School District - Non-Homestead Millage (Operating)</td>
                    <td>{school_district_non_homestead_operating}</td>
                </tr>
                <tr>
                    <td>School District - Debt</td>
                    <td>{school_district_debt}</td>
                </tr>
                <tr>
                    <td>School District - Sinking Fund</td>
                    <td>{school_district_sinking_fund}</td>
                </tr>
                <tr>
                    <td>School District - Recreational</td>
                    <td>{school_district_recreational}</td>
                </tr>
                <tr>
                    <td>Intermediate School District - Allocated</td>
                    <td>{intermediate_school_district_allocated}</td>
                </tr>
                <tr>
                    <td>Intermediate School District - Vocational</td>
                    <td>{intermediate_school_district_vocational}</td>
                </tr>
                <tr>
                    <td>Intermediate School District - Special Education</td>
                    <td>{intermediate_school_district_special_ed}</td>
                </tr>
                <tr>
                    <td>Intermediate School District - School Debt</td>
                    <td>{intermediate_school_district_debt}</td>
                </tr>
                <tr>
                    <td>Intermediate School District - Enhancement</td>
                    <td>{intermediate_school_district_enhancement}</td>
                </tr>
                <tr>
                    <td>Community College - Operating</td>
                    <td>{community_college_operating}</td>
                </tr>
                <tr>
                    <td>Community College - Debt</td>
                    <td>{community_college_debt}</td>
                </tr>
                <tr>
                    <td>Public Authorities (e.g. library, park authorities, etc.)</td>
                    <td>{public_authorities}</td>
                </tr>
                <tr>
                    <td>Public Authority Debt</td>
                    <td>{public_authority_debt}</td>
                </tr>
                <tr>
                    <td>Special Assessment</td>
                    <td>{special_assessment}</td>
                </tr>
                <tr>
                    <td>Village - Allocated</td>
                    <td>{village_allocated}</td>
                </tr>
                <tr>
                    <td>Village - Extra Voted</td>
                    <td>{village_extra_voted}</td>
                </tr>
                <tr>
                    <td>Village - Debt</td>
                    <td>{village_debt}</td>
                </tr>
                <tr>
                    <td>Village - Public Authorities</td>
                    <td>{village_public_authorities}</td>
                </tr>
                <tr>
                    <td>Village - Public Authority Debt</td>
                    <td>{village_public_authority_debt}</td>
                </tr>
                <tr>
                    <td>Village - Special Assessment</td>
                    <td>{village_special_assessment}</td>
                </tr>

                <tr><th></th></tr>
                </tbody>
            </table>

            <br></br>
            <h1>Gross Additional Local Revenue Over Course of Project (Non-PILT)</h1>
            <br></br>

            <table className="basicTable">
                <thead>
                    <tr>
                        <th>Unit</th>
                        <th>Value</th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <td className="rowHighlight">Grand Total</td>
                        <td className="rowHighlight">ADD</td>
                    </tr>
                    <tr>
                        <td>County - Allocated</td>
                        <td>ADD</td>
                    </tr>
                    <tr>
                        <td>County - Extra Voted</td>
                        <td>ADD</td>
                    </tr>
                    <tr>
                        <td>County - Debt</td>
                        <td>ADD</td>
                    </tr>
                    <tr>
                        <td>Local Unit - Allocated</td>
                        <td>ADD</td>
                    </tr>
                    <tr>
                        <td>Local Unit - Extra Voted</td>
                        <td>ADD</td>
                    </tr>
                    <tr>
                        <td>Local Unit - Debt</td>
                        <td>ADD</td>
                    </tr>
                    <tr>
                        <td>School District - Hold Harmless</td>
                        <td>ADD</td>
                    </tr>
                    <tr>
                        <td>School District - Operating</td>
                        <td>ADD</td>
                    </tr>
                    <tr>
                        <td>School District - Debt</td>
                        <td>ADD</td>
                    </tr>
                    <tr>
                        <td>School District - Sinking Fund</td>
                        <td>ADD</td>
                    </tr>
                    <tr>
                        <td>School District - Recreational</td>
                        <td>ADD</td>
                    </tr>
                    <tr>
                        <td>Intermediate School District - Allocated</td>
                        <td>ADD</td>
                    </tr>
                    <tr>
                        <td>Intermediate School District - Vocational</td>
                        <td>ADD</td>
                    </tr>
                    <tr>
                        <td>Intermediate School District - Special Education</td>
                        <td>ADD</td>
                    </tr>
                    <tr>
                        <td>Intermediate School District - Enhancement</td>
                        <td>ADD</td>
                    </tr>
                    <tr>
                        <td>Community College - Operating</td>
                        <td>ADD</td>
                    </tr>
                    <tr>
                        <td>Community College - Debt</td>
                        <td>ADD</td>
                    </tr>
                    <tr>
                        <td>Public Authorities (e.g. library, park authorities, etc.)</td>
                        <td>ADD</td>
                    </tr>
                    <tr>
                        <td>Public Authority - Debt</td>
                        <td>ADD</td>
                    </tr>
                    <tr>
                        <td>Special Assessment</td>
                        <td>ADD</td>
                    </tr>
                    <tr>
                        <td>Village - Allocated</td>
                        <td>ADD</td>
                    </tr>
                    <tr>
                        <td>Village - Extra Voted</td>
                        <td>ADD</td>
                    </tr>
                    <tr>
                        <td>Village - Debt</td>
                        <td>ADD</td>
                    </tr>
                    <tr>
                        <td>Village - Public Authorities</td>
                        <td>ADD</td>
                    </tr>
                    <tr>
                        <td>Village - Public Authority Debt</td>
                        <td>ADD</td>
                    </tr>
                    <tr>
                        <td>Village - Special Assessment</td>
                        <td>ADD</td>
                    </tr>
                </tbody>
            </table>

            <br></br>
            <h1>Gross Additional Local Revenue Over Course of Project (PILT)</h1>
            <br></br>

            <table className="basicTable">
                <thead>
                    <tr>
                        <th>Unit</th>
                        <th>Value</th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <td className="rowHighlight">Grand Total</td>
                        <td className="rowHighlight">ADD</td>
                    </tr>
                    <tr>
                        <td>County - Allocated</td>
                        <td>ADD</td>
                    </tr>
                    <tr>
                        <td>County - Extra Voted</td>
                        <td>ADD</td>
                    </tr>
                    <tr>
                        <td>County - Debt</td>
                        <td>ADD</td>
                    </tr>
                    <tr>
                        <td>Local Unit - Allocated</td>
                        <td>ADD</td>
                    </tr>
                    <tr>
                        <td>Local Unit - Extra Voted</td>
                        <td>ADD</td>
                    </tr>
                    <tr>
                        <td>Local Unit - Debt</td>
                        <td>ADD</td>
                    </tr>
                    <tr>
                        <td>School District - Hold Harmless</td>
                        <td>ADD</td>
                    </tr>
                    <tr>
                        <td>School District - Operating</td>
                        <td>ADD</td>
                    </tr>
                    <tr>
                        <td>School District - Debt</td>
                        <td>ADD</td>
                    </tr>
                    <tr>
                        <td>School District - Sinking Fund</td>
                        <td>ADD</td>
                    </tr>
                    <tr>
                        <td>School District - Recreational</td>
                        <td>ADD</td>
                    </tr>
                    <tr>
                        <td>Intermediate School District - Allocated</td>
                        <td>ADD</td>
                    </tr>
                    <tr>
                        <td>Intermediate School District - Vocational</td>
                        <td>ADD</td>
                    </tr>
                    <tr>
                        <td>Intermediate School District - Special Education</td>
                        <td>ADD</td>
                    </tr>
                    <tr>
                        <td>Intermediate School District - Enhancement</td>
                        <td>ADD</td>
                    </tr>
                    <tr>
                        <td>Community College - Operating</td>
                        <td>ADD</td>
                    </tr>
                    <tr>
                        <td>Community College - Debt</td>
                        <td>ADD</td>
                    </tr>
                    <tr>
                        <td>Public Authorities (e.g. library, park authorities, etc.)</td>
                        <td>ADD</td>
                    </tr>
                    <tr>
                        <td>Public Authority - Debt</td>
                        <td>ADD</td>
                    </tr>
                    <tr>
                        <td>Special Assessment</td>
                        <td>ADD</td>
                    </tr>
                    <tr>
                        <td>Village - Allocated</td>
                        <td>ADD</td>
                    </tr>
                    <tr>
                        <td>Village - Extra Voted</td>
                        <td>ADD</td>
                    </tr>
                    <tr>
                        <td>Village - Debt</td>
                        <td>ADD</td>
                    </tr>
                    <tr>
                        <td>Village - Public Authorities</td>
                        <td>ADD</td>
                    </tr>
                    <tr>
                        <td>Village - Public Authority Debt</td>
                        <td>ADD</td>
                    </tr>
                    <tr>
                        <td>Village - Special Assessment</td>
                        <td>ADD</td>
                    </tr>
                </tbody>
            </table>

            <br></br>
            
            <h2>Detailed Calculation Tables</h2>

            <div style={{ marginBottom: "1rem" }}>
            <button onClick={() => setVisibleTable("non_pilt")} className="basicButton">
                View Non-PILT Calculations
            </button>

            <button
                onClick={() => setVisibleTable("pilt")}
                style={{ marginLeft: "10px" }}
                className="basicButton"
            >
                View PILT Calculations
            </button>

            <button
                onClick={() => setVisibleTable(null)}
                style={{ marginLeft: "10px" }}
                className="basicButton"
            >
                Hide
            </button>
            </div>

            {/* Non-PILT Table */}
            {visibleTable === "non_pilt" && (
                <table className="basicTable">
                    <thead>
                        <tr>
                            <th>Variable</th>
                            {county_allocated_yearly_calculations.map((year) => (
                                <th key={year.year}>Year {year.year}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>County - Allocated</td>
                            {county_allocated_yearly_calculations.map((year) => (
                                <td key={year.year}>{formatCurrency(year.county_allocated_revenue)}</td>
                            ))}
                        </tr>

                        {/* You can add more rows here, for example: */}
                        <tr>
                            <td>County - Extra Voted</td>
                            {county_extra_voted_yearly_calculations.map((year) => (
                                <td key={year.year}>{formatCurrency(year.county_extra_voted_revenue ?? 0)}</td>
                            ))}
                        </tr>

                        <tr>
                            <td>County - Debt</td>
                            {county_debt_yearly_calculations.map((year) => (
                                <td key={year.year}>{formatCurrency(year.county_debt_revenue ?? 0)}</td>
                            ))}
                        </tr>

                        <tr className="rowBold">
                            <td>Total Per Year - County</td>
                            {total_county_revenue_per_year.map((total, index) => (
                                <td key={index}>{formatCurrency(total)}</td>
                            ))}
                        </tr>

                        <tr className="rowHighlight">
                            <td colSpan={3}>Gross IPP Revenue Over Course of Project - County</td>
                            <td colSpan={3}>{formatCurrency(gross_county_revenue)}</td>
                        </tr>

                        <tr className="rowHighlight">
                            <td colSpan={3}>Net Present Value of IPP Revenue Over Course of Project - County</td>
                            <td colSpan={3}>{formatCurrency(gross_county_npv)}</td>
                        </tr>
                    </tbody>

                    <tr><th></th></tr>

                    <tbody>
                        <tr>
                            <td>Local Unit - Allocated</td>
                            {local_unit_allocated_yearly_calculations.map((year) => (
                                <td key={year.year}>{formatCurrency(year.local_unit_allocated_revenue)}</td>
                            ))}
                        </tr>
                        <tr>
                            <td>Local Unit - Extra Voted</td>
                            {local_unit_extra_voted_yearly_calculations.map((year) => (
                                <td key={year.year}>{formatCurrency(year.local_unit_extra_voted_revenue)}</td>
                            ))}
                        </tr>
                        <tr>
                            <td>Local Unit - Debt</td>
                            {local_unit_debt_yearly_calculations.map((year) => (
                                <td key={year.year}>{formatCurrency(year.local_unit_debt_revenue)}</td>
                            ))}
                        </tr>

                        <tr className="rowBold">
                            <td>Total Per Year - Local Unit</td>
                            {total_local_unit_revenue_per_year.map((total, index) => (
                                <td key={index}>{formatCurrency(total)}</td>
                            ))}
                        </tr>

                        <tr className="rowHighlight">
                            <td colSpan={3}>Gross IPP Revenue Over Course of Project - Local Unit</td>
                            <td colSpan={3}>{formatCurrency(gross_local_unit_revenue)}</td>
                        </tr>

                        <tr className="rowHighlight">
                            <td colSpan={3}>Net Present Value of IPP Revenue Over Course of Project - Local Unit</td>
                            <td colSpan={3}>{formatCurrency(gross_local_unit_npv)}</td>
                        </tr>
                    </tbody>

                    <tr><th></th></tr>

                    <tbody>
                        <tr>
                            <td>School District - Hold Harmless</td>
                            {sd_hold_harmless_yearly_calculations.map((year) => (
                                <td key={year.year}>{formatCurrency(year.sd_hold_harmless_revenue)}</td>
                            ))}
                        </tr>
                        <tr>
                            <td>School District - Debt</td>
                            {sd_debt_yearly_calculations.map((year) => (
                                <td key={year.year}>{formatCurrency(year.sd_debt_revenue)}</td>
                            ))}
                        </tr>
                        <tr>
                            <td>School District - Sinking Fund</td>
                            {sd_sinking_fund_yearly_calculations.map((year) => (
                                <td key={year.year}>{formatCurrency(year.sd_sinking_fund_revenue)}</td>
                            ))}
                        </tr>
                        <tr>
                            <td>School District - Recreational</td>
                            {sd_recreational_yearly_calculations.map((year) => (
                                <td key={year.year}>{formatCurrency(year.sd_recreational_revenue)}</td>
                            ))}
                        </tr>

                        <tr className="rowBold">
                            <td>Total Per Year - School District</td>
                            {total_sd_revenue_per_year.map((total, index) => (
                                <td key={index}>{formatCurrency(total)}</td>
                            ))}
                        </tr>

                        <tr className="rowHighlight">
                            <td colSpan={3}>Gross IPP Revenue Over Course of Project - School District</td>
                            <td colSpan={3}>{formatCurrency(gross_sd_revenue)}</td>
                        </tr>

                        <tr className="rowHighlight">
                            <td colSpan={3}>Net Present Value of IPP Revenue Over Course of Project - School District</td>
                            <td colSpan={3}>{formatCurrency(gross_school_district_npv)}</td>
                        </tr>
                    </tbody>

                    <tr><th></th></tr>

                    <tbody>
                        <tr>
                            <td>Intermediate School District - Allocated</td>
                            {isd_allocated_yearly_calculations.map((year) => (
                                <td key={year.year}>{formatCurrency(year.isd_allocated_revenue)}</td>
                            ))}
                        </tr>
                        <tr>
                            <td>Intermediate School District - Vocational</td>
                            {isd_vocational_yearly_calculations.map((year) => (
                                <td key={year.year}>{formatCurrency(year.isd_vocational_revenue)}</td>
                            ))}
                        </tr>
                        <tr>
                            <td>Intermediate School District - Special Educationa</td>
                            {isd_special_education_yearly_calculations.map((year) => (
                                <td key={year.year}>{formatCurrency(year.isd_special_education_revenue)}</td>
                            ))}
                        </tr>
                        <tr>
                            <td>School District - Debt</td>
                            {isd_debt_yearly_calculations.map((year) => (
                                <td key={year.year}>{formatCurrency(year.isd_debt_revenue)}</td>
                            ))}
                        </tr>
                        <tr>
                            <td>School District - Enhancement</td>
                            {isd_enhancement_yearly_calculations.map((year) => (
                                <td key={year.year}>{formatCurrency(year.isd_enhancement_revenue)}</td>
                            ))}
                        </tr>

                        <tr className="rowBold">
                            <td>Total Per Year - Intermediate School District</td>
                            {total_isd_revenue_per_year.map((total, index) => (
                                <td key={index}>{formatCurrency(total)}</td>
                            ))}
                        </tr>

                        <tr className="rowHighlight">
                            <td colSpan={3}>Gross IPP Revenue Over Course of Project - Intermediate School District</td>
                            <td colSpan={3}>{formatCurrency(gross_isd_revenue)}</td>
                        </tr>

                        <tr className="rowHighlight">
                            <td colSpan={3}>Net Present Value of IPP Revenue Over Course of Project - Intermediate School District</td>
                            <td colSpan={3}>{formatCurrency(gross_isd_npv)}</td>
                        </tr>
                    </tbody>

                    
                    <tr><th></th></tr>

                    <tbody>
                        <tr>
                            <td>Community College - Operating</td>
                            {cc_operating_yearly_calculations.map((year) => (
                                <td key={year.year}>{formatCurrency(year.cc_operating_revenue)}</td>
                            ))}
                        </tr>
                        <tr>
                            <td>Community College - Revenue</td>
                            {cc_debt_yearly_calculations.map((year) => (
                                <td key={year.year}>{formatCurrency(year.cc_debt_revenue)}</td>
                            ))}
                        </tr>

                        <tr className="rowBold">
                            <td>Total Per Year - Community College</td>
                            {total_cc_revenue_per_year.map((total, index) => (
                                <td key={index}>{formatCurrency(total)}</td>
                            ))}
                        </tr>

                        <tr className="rowHighlight">
                            <td colSpan={3}>Gross IPP Revenue Over Course of Project - Community College</td>
                            <td colSpan={3}>{formatCurrency(gross_cc_revenue)}</td>
                        </tr>

                        <tr className="rowHighlight">
                            <td colSpan={3}>Net Present Value of IPP Revenue Over Course of Project - Community College</td>
                            <td colSpan={3}>{formatCurrency(gross_cc_npv)}</td>
                        </tr>
                    </tbody>

                    <tr><th></th></tr>

                    <tbody>
                        <tr>
                            <td>Public Authorities (e.g. library, park authorities, etc.)</td>
                            {pa_yearly_calculations.map((year) => (
                                <td key={year.year}>{formatCurrency(year.pa_revenue)}</td>
                            ))}
                        </tr>
                        <tr>
                            <td>Public Authority Debt</td>
                            {pa_debt_yearly_calculations.map((year) => (
                                <td key={year.year}>{formatCurrency(year.pa_debt_revenue)}</td>
                            ))}
                        </tr>

                        <tr className="rowBold">
                            <td>Total Per Year - Public Authorities</td>
                            {total_pa_revenue_per_year.map((total, index) => (
                                <td key={index}>{formatCurrency(total)}</td>
                            ))}
                        </tr>

                        <tr className="rowHighlight">
                            <td colSpan={3}>Gross IPP Revenue Over Course of Project - Public Authorities</td>
                            <td colSpan={3}>{formatCurrency(gross_pa_revenue)}</td>
                        </tr>

                        <tr className="rowHighlight">
                            <td colSpan={3}>Net Present Value of IPP Revenue Over Course of Project - Public Authorities</td>
                            <td colSpan={3}>{formatCurrency(gross_pa_npv)}</td>
                        </tr>
                    </tbody>

                    <tr><th></th></tr>

                    <tbody>
                        <tr>
                            <td>Village - Allocated</td>
                            {village_allocated_yearly_calculations.map((year) => (
                                <td key={year.year}>{formatCurrency(year.village_allocated_revenue)}</td>
                            ))}
                        </tr>
                        <tr>
                            <td>Village - Extra Voted</td>
                            {village_extra_voted_yearly_calculations.map((year) => (
                                <td key={year.year}>{formatCurrency(year.village_extra_voted_revenue)}</td>
                            ))}
                        </tr>
                        <tr>
                            <td>Village - Debt</td>
                            {village_debt_yearly_calculations.map((year) => (
                                <td key={year.year}>{formatCurrency(year.village_debt_revenue)}</td>
                            ))}
                        </tr>
                        <tr>
                            <td>Village - Public Authorities</td>
                            {village_public_authorities_yearly_calculations.map((year) => (
                                <td key={year.year}>{formatCurrency(year.village_public_authorities_revenue)}</td>
                            ))}
                        </tr>
                        <tr>
                            <td>Village - Public Authority Debt</td>
                            {village_public_authority_debt_yearly_calculations.map((year) => (
                                <td key={year.year}>{formatCurrency(year.village_public_authority_debt_revenue)}</td>
                            ))}
                        </tr>

                        <tr className="rowBold">
                            <td>Total Per Year - Village</td>
                            {total_village_revenue_per_year.map((total, index) => (
                                <td key={index}>{formatCurrency(total)}</td>
                            ))}
                        </tr>

                        <tr className="rowHighlight">
                            <td colSpan={3}>Gross IPP Revenue Over Course of Project - Village</td>
                            <td colSpan={3}>{formatCurrency(gross_village_revenue)}</td>
                        </tr>

                        <tr className="rowHighlight">
                            <td colSpan={3}>Net Present Value of IPP Revenue Over Course of Project - Village</td>
                            <td colSpan={3}>{formatCurrency(gross_village_npv)}</td>
                        </tr>
                    </tbody>

                    <tr><th></th></tr>

                    <tbody>
                        <tr className="rowBold">
                            <td>Total Per Year - All Taxing Units</td>
                            {total_all_taxing_units.map((total, index) => (
                                <td key={index}>{formatCurrency(total)}</td>
                            ))}
                        </tr>

                        <tr className="rowHighlight">
                            <td colSpan={3}>Gross IPP Revenue Over Course of Project - All Taxing Units</td>
                            <td colSpan={3}>{formatCurrency(gross_all_units_revenue)}</td>
                        </tr>

                        <tr className="rowHighlight">
                            <td colSpan={3}>Net Present Value of IPP Revenue Over Course of Project - All Taxing Units</td>
                            <td colSpan={3}>{formatCurrency(gross_all_units_npv)}</td>
                        </tr>
                    </tbody>

                </table>
            )}



            {/* PILT Table */}
            {visibleTable === "pilt" && (
            <table className="basicTable">
                <thead>
                <tr>
                    <th colSpan={2}>PILT Calculation Details</th>
                </tr>
                <tr>
                    <th>Variable</th>
                    <th>Value</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>Placeholder Row</td>
                    <td>--</td>
                </tr>
                </tbody>
            </table>
            )}


        </section>
    );
}
