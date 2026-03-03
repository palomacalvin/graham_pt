"use client";

import { useEffect, useState, useMemo } from "react";
import { ProjectData } from "@/types/MISolarProject";
import { MIMultiplicationFactors } from "@/types/MIMultiplicationFactors";

import { calculateGrossTotal, calculateMichiganTaxResults as calculateNonPILT } from "@/utils/MINonPILTSolarCalculations";
import { calculateMichiganTaxResults as calculatePILT } from "@/utils/MIPILTSolarCalculations";
import { calculateMichiganTaxResults as calculateRealPropertyTaxes } from "@/utils/MIRealPropertySolarCalculations";
import { calculateMichiganTaxResults as calculateUPPRevenue } from "@/utils/MIUPPSolarCalculations";


interface Props {
    projectData: ProjectData;
}

export default function MISolarTaxResults( {projectData}: Props) {
    const calculated_homestead_rate = (projectData?.homestead_rate ?? 0) - (projectData?.sd_comm_pers ?? 0);

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

    // Define state.
    const [multiplicationFactors, setMultiplicationFactors] = 
        useState<MIMultiplicationFactors[]>([]);

    const nonPiltResults = multiplicationFactors.length
    ? calculateNonPILT(projectData, multiplicationFactors)
    : null;

    const piltResults = useMemo(() => {
        return calculatePILT(projectData, multiplicationFactors, projectData.original_cost_pre_inverter ?? 0, 30); // your PILT engine does not use factors
    }, [projectData]);

    const {
        county,
        local_unit,
        school_district,
        intermediate_school_district,
        community_college,
        public_authority,
        village
    } = nonPiltResults || {
        county: emptyUnit(),
        local_unit: emptyUnit(),
        school_district: emptyUnit(),
        intermediate_school_district: emptyUnit(),
        community_college: emptyUnit(),
        public_authority: emptyUnit(),
        village: emptyUnit(),
    };

    const realPropertyResults = multiplicationFactors.length
        ? calculateRealPropertyTaxes(projectData, multiplicationFactors)
        : null;


    const uppRevenueResults = multiplicationFactors.length
        ? calculateUPPRevenue(projectData, multiplicationFactors)
        : null;

    // Helper to provide empty structure for a taxing unit
    function emptyUnit() {
        return {
            allocated: [],
            extra: [],
            debt: [],
            authority: [],
            authority_debt: [],
            operating: [],
            sinking_fund: [],
            recreational: [],
            hold_harmless: [],
            vocational: [],
            special_education: [],
            enhancement: [],
            totalPerYear: [],
            gross: 0,
            npv: 0,
            npv_per_year: [],
        };
    }


    const {
        county: piltCounty,
        local_unit: piltLocalUnit,
        school_district: piltSchoolDistrict,
        intermediate_school_district: piltISD,
        community_college: piltCC,
        public_authority: piltPA,
        village: piltVillage
    } = piltResults!;

    // ================= All unit helper functions =================

    // NPV calculation function.
    function calculateNPV(rate: number, cash_flows: number[]): number {
    const first_year = cash_flows[0] ?? 0;
    const remaining = cash_flows.slice(1);

    const discounted = remaining.reduce((sum, cf, i) => {
        return sum + cf / Math.pow(1 + rate, i + 1);
    }, 0);

    return first_year + discounted;
    }


    // ================= NON-PILT ALL TAXING UNITS COMBINED =================

    const non_pilt_total_all_taxing_units = county.totalPerYear.map((_, i) =>
        county.totalPerYear[i] +
        local_unit.totalPerYear[i] +
        school_district.totalPerYear[i] +
        intermediate_school_district.totalPerYear[i] +
        community_college.totalPerYear[i] +
        public_authority.totalPerYear[i] +
        village.totalPerYear[i]
    );

    const non_pilt_gross_all_units_revenue =
        non_pilt_total_all_taxing_units.reduce((sum, val) => sum + val, 0);

    const non_pilt_gross_all_units_npv = calculateNPV(
        projectData.annual_discount_rate ?? 0.05,
        non_pilt_total_all_taxing_units
    );


    // ================= PILT ALL TAXING UNITS COMBINED =================

    const pilt_total_all_taxing_units = piltCounty.totalPerYear.map((_, i) =>
        piltCounty.totalPerYear[i] +
        piltLocalUnit.totalPerYear[i] +
        piltSchoolDistrict.totalPerYear[i] +
        piltISD.totalPerYear[i] +
        piltCC.totalPerYear[i] +
        piltPA.totalPerYear[i] +
        piltVillage.totalPerYear[i]
    );

    const pilt_gross_all_units_revenue =
        pilt_total_all_taxing_units.reduce((sum, val) => sum + val, 0);

    const pilt_gross_all_units_npv = calculateNPV(
        projectData.annual_discount_rate ?? 0.05,
        pilt_total_all_taxing_units
    );


    // ================= REAL PROPERTY REVENUE ALL UNITS COMBINED =================

    const real_property_revenue_all_units =
        realPropertyResults
            ? realPropertyResults.county.totalPerYear.map((_, i) =>
            realPropertyResults.county.totalPerYear[i] +
            realPropertyResults.local_unit.totalPerYear[i] +
            realPropertyResults.school_district.totalPerYear[i] +
            realPropertyResults.intermediate_school_district.totalPerYear[i] +
            realPropertyResults.community_college.totalPerYear[i] +
            realPropertyResults.public_authority.totalPerYear[i] +
            realPropertyResults.village.totalPerYear[i]
        )
        : [];

    const real_property_gross_all_units =
        real_property_revenue_all_units?.reduce((sum, val) => sum + val, 0);

    const real_property_all_units_npv = calculateNPV(
        projectData.annual_discount_rate ?? 0.05,
        real_property_revenue_all_units
    );


    // ================= UPP REVENUE ALL TAXING UNITS COMBINED =================

    const upp_total_all_taxing_units = 
        uppRevenueResults
            ? uppRevenueResults.county.totalPerYear.map((_, i) =>
            uppRevenueResults?.county.totalPerYear[i] +
            uppRevenueResults?.local_unit.totalPerYear[i] +
            uppRevenueResults?.school_district.totalPerYear[i] +
            uppRevenueResults?.intermediate_school_district.totalPerYear[i] +
            uppRevenueResults?.community_college.totalPerYear[i] +
            uppRevenueResults?.public_authority.totalPerYear[i] +
            uppRevenueResults?.village.totalPerYear[i]
    ) 
    : [];

    const upp_gross_all_units_revenue =
        upp_total_all_taxing_units?.reduce((sum, val) => sum + val, 0);

    const upp_all_units_npv = calculateNPV(
        projectData.annual_discount_rate ?? 0.05,
        upp_total_all_taxing_units ?? 0
    );


    // ======================= Total Gross By Year and Jurisdiction ===============
    const total_gross_per_year = county.totalPerYear.map((_, index) =>
        county.totalPerYear[index] +
        local_unit.totalPerYear[index] +
        school_district.totalPerYear[index] +
        intermediate_school_district.totalPerYear[index] +
        community_college.totalPerYear[index] +
        public_authority.totalPerYear[index] +
        village.totalPerYear[index]
    );


    // ======================= Non-PILT Total NPV By Year and Jurisdiction ===============

    function sumRevenueStreams(streams: number[][]): number[] {
    const years = streams[0]?.length ?? 0;

    return Array.from({ length: years }, (_, i) =>
            streams.reduce((sum, stream) => sum + (stream[i] ?? 0), 0)
        );
    }
    const total_npv_per_year = sumRevenueStreams([
        county.npv_per_year,
        local_unit.npv_per_year,
        school_district.npv_per_year,
        intermediate_school_district.npv_per_year,
        community_college.npv_per_year,
        public_authority.npv_per_year,
        village.npv_per_year
    ]);


    // ======================= PILT Total NPV By Year and Jurisdiction ===============

    const pilt_total_npv_per_year = sumRevenueStreams([
        piltCounty.npv_per_year,
        piltLocalUnit.npv_per_year,
        piltSchoolDistrict.npv_per_year,
        piltISD.npv_per_year,
        piltCC.npv_per_year,
        piltPA.npv_per_year,
        piltVillage.npv_per_year
    ]);


    function sumJurisdictionPerYearArrays(
        base: number[],
        realProperty?: number[],
        upp?: number[]
    ): number[] {
        const years = base.length;
        return Array.from({ length: years }, (_, i) => 
            (base[i] ?? 0) + (realProperty?.[i] ?? 0) + (upp?.[i] ?? 0)
        );
    }

    const non_pilt_county_combined = sumJurisdictionPerYearArrays(
        county.totalPerYear,
        realPropertyResults?.county.totalPerYear,
        uppRevenueResults?.county.totalPerYear
    );

    const non_pilt_local_unit_combined = sumJurisdictionPerYearArrays(
        local_unit.totalPerYear,
        realPropertyResults?.local_unit.totalPerYear,
        uppRevenueResults?.local_unit.totalPerYear
    );

    const non_pilt_school_district_combined = sumJurisdictionPerYearArrays(
        school_district.totalPerYear,
        realPropertyResults?.school_district.totalPerYear,
        uppRevenueResults?.school_district.totalPerYear
    );

    const non_pilt_intermediate_school_district_combined = sumJurisdictionPerYearArrays(
        intermediate_school_district.totalPerYear,
        realPropertyResults?.intermediate_school_district.totalPerYear,
        uppRevenueResults?.intermediate_school_district.totalPerYear
    );

    const non_pilt_community_college_combined = sumJurisdictionPerYearArrays(
        community_college.totalPerYear,
        realPropertyResults?.community_college.totalPerYear,
        uppRevenueResults?.community_college.totalPerYear
    );

    const non_pilt_public_authority_combined = sumJurisdictionPerYearArrays(
        public_authority.totalPerYear,
        realPropertyResults?.public_authority.totalPerYear,
        uppRevenueResults?.public_authority.totalPerYear
    );

    const non_pilt_village_combined = sumJurisdictionPerYearArrays(
        village.totalPerYear,
        realPropertyResults?.village.totalPerYear,
        uppRevenueResults?.village.totalPerYear
    );




    const pilt_county_combined = sumJurisdictionPerYearArrays(
        piltCounty.totalPerYear,
        realPropertyResults?.county.totalPerYear,
        uppRevenueResults?.county.totalPerYear
    );

    const pilt_local_unit_combined = sumJurisdictionPerYearArrays(
        piltLocalUnit.totalPerYear,
        realPropertyResults?.local_unit.totalPerYear,
        uppRevenueResults?.local_unit.totalPerYear
    );

    const pilt_school_district_combined = sumJurisdictionPerYearArrays(
        piltSchoolDistrict.totalPerYear,
        realPropertyResults?.school_district.totalPerYear,
        uppRevenueResults?.school_district.totalPerYear
    );

    const pilt_intermediate_school_district_combined = sumJurisdictionPerYearArrays(
        piltISD.totalPerYear,
        realPropertyResults?.intermediate_school_district.totalPerYear,
        uppRevenueResults?.intermediate_school_district.totalPerYear
    );

    const pilt_community_college_combined = sumJurisdictionPerYearArrays(
        piltCC.totalPerYear,
        realPropertyResults?.community_college.totalPerYear,
        uppRevenueResults?.community_college.totalPerYear
    );

    const pilt_public_authority_combined = sumJurisdictionPerYearArrays(
        piltPA.totalPerYear,
        realPropertyResults?.public_authority.totalPerYear,
        uppRevenueResults?.public_authority.totalPerYear
    );

    const pilt_village_combined = sumJurisdictionPerYearArrays(
        piltVillage.totalPerYear,
        realPropertyResults?.village.totalPerYear,
        uppRevenueResults?.village.totalPerYear
    );

    const total_gross_per_year_final = sumRevenueStreams([
        non_pilt_county_combined,
        non_pilt_local_unit_combined,
        non_pilt_school_district_combined,
        non_pilt_intermediate_school_district_combined,
        non_pilt_community_college_combined,
        non_pilt_public_authority_combined,
        non_pilt_village_combined,
    ]);

    const pilt_total_gross_per_year_final = sumRevenueStreams([
        pilt_county_combined,
        pilt_local_unit_combined,
        pilt_school_district_combined,
        pilt_intermediate_school_district_combined,
        pilt_community_college_combined,
        pilt_public_authority_combined,
        pilt_village_combined,
    ]);

    const total_gross_all_units_final = calculateGrossTotal(total_gross_per_year_final);
    const pilt_total_gross_all_units_final = calculateGrossTotal(pilt_total_gross_per_year_final);

    const total_npv_all_units_final = calculateNPV(
        projectData.annual_discount_rate ?? 0,
        total_gross_per_year_final
    );

    const pilt_total_npv_all_units_final = calculateNPV(
        projectData.annual_discount_rate ?? 0,
        pilt_total_gross_per_year_final
    );

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


    return (
        <section>
            <h1>Michigan Solar Tax Results</h1>

            <br></br>

            <h2 style={{ margin: "0rem" }}>Non-PILT Year 1 Results</h2>

            <table className="basicTable">
                <thead>
                    <tr>
                        <th>Jurisdiction</th>
                        <th>IPP</th>
                        <th>Real Property Tax</th>
                        <th>UPP</th>
                        <th>Total</th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <td>County</td>
                        <td>{formatCurrency(county.totalPerYear[0])}</td>
                        <td>{formatCurrency(realPropertyResults?.county.totalPerYear[0] ?? 0)}</td>
                        <td>{formatCurrency(uppRevenueResults?.county.totalPerYear[0] ?? 0)}</td>
                        <td>{formatCurrency(county.totalPerYear[0] +
                            (realPropertyResults?.county.totalPerYear[0] ?? 0 ) +
                            (uppRevenueResults?.county.totalPerYear[0] ?? 0))
                        }</td>
                    </tr>

                    <tr>
                        <td>Local Unit</td>
                        <td>{formatCurrency(local_unit.totalPerYear[0])}</td>
                        <td>{formatCurrency(realPropertyResults?.local_unit.totalPerYear[0] ?? 0)}</td>
                        <td>{formatCurrency(uppRevenueResults?.local_unit.totalPerYear[0] ?? 0)}</td>
                        <td>{formatCurrency(local_unit.totalPerYear[0] +
                            (realPropertyResults?.local_unit.totalPerYear[0] ?? 0 ) +
                            (uppRevenueResults?.local_unit.totalPerYear[0] ?? 0))
                        }</td>
                    </tr>

                    <tr>
                        <td>School District</td>
                        <td>{formatCurrency(school_district.totalPerYear[0])}</td>
                        <td>{formatCurrency(realPropertyResults?.school_district.totalPerYear[0] ?? 0)}</td>
                        <td>{formatCurrency(uppRevenueResults?.school_district.totalPerYear[0] ?? 0)}</td>
                        <td>{formatCurrency(school_district.totalPerYear[0] +
                            (realPropertyResults?.school_district.totalPerYear[0] ?? 0 ) +
                            (uppRevenueResults?.school_district.totalPerYear[0] ?? 0))
                        }</td>
                    </tr>

                    <tr>
                        <td>Intermediate School District</td>
                        <td>{formatCurrency(intermediate_school_district.totalPerYear[0])}</td>
                        <td>{formatCurrency(realPropertyResults?.intermediate_school_district.totalPerYear[0] ?? 0)}</td>
                        <td>{formatCurrency(uppRevenueResults?.intermediate_school_district.totalPerYear[0] ?? 0)}</td>
                        <td>{formatCurrency(intermediate_school_district.totalPerYear[0] +
                            (realPropertyResults?.intermediate_school_district.totalPerYear[0] ?? 0 ) +
                            (uppRevenueResults?.intermediate_school_district.totalPerYear[0] ?? 0))
                        }</td>
                    </tr>

                    <tr>
                        <td>Community College</td>
                        <td>{formatCurrency(community_college.totalPerYear[0])}</td>
                        <td>{formatCurrency(realPropertyResults?.community_college.totalPerYear[0] ?? 0)}</td>
                        <td>{formatCurrency(uppRevenueResults?.community_college.totalPerYear[0] ?? 0)}</td>
                        <td>{formatCurrency(community_college.totalPerYear[0] +
                            (realPropertyResults?.community_college.totalPerYear[0] ?? 0 ) +
                            (uppRevenueResults?.community_college.totalPerYear[0] ?? 0))
                        }</td>
                    </tr>


                    <tr>
                        <td>Public Authorities</td>
                        <td>{formatCurrency(public_authority.totalPerYear[0])}</td>
                        <td>{formatCurrency(realPropertyResults?.public_authority.totalPerYear[0] ?? 0)}</td>
                        <td>{formatCurrency(uppRevenueResults?.public_authority.totalPerYear[0] ?? 0)}</td>
                        <td>{formatCurrency(public_authority.totalPerYear[0] +
                            (realPropertyResults?.public_authority.totalPerYear[0] ?? 0 ) +
                            (uppRevenueResults?.public_authority.totalPerYear[0] ?? 0))
                        }</td>
                    </tr>

                    <tr>
                        <td>Village</td>
                        <td>{formatCurrency(village.totalPerYear[0])}</td>
                        <td>{formatCurrency(realPropertyResults?.village.totalPerYear[0] ?? 0)}</td>
                        <td>{formatCurrency(uppRevenueResults?.village.totalPerYear[0] ?? 0)}</td>
                        <td>{formatCurrency(village.totalPerYear[0] +
                            (realPropertyResults?.village.totalPerYear[0] ?? 0 ) +
                            (uppRevenueResults?.village.totalPerYear[0] ?? 0))
                        }</td>
                    </tr>

                    <tr className="rowHighlight">
                        <td>All Units</td>

                        {/* IPP */}
                        <td>{formatCurrency(county.totalPerYear[0] + 
                        local_unit.totalPerYear[0] + 
                        school_district.totalPerYear[0] + 
                        intermediate_school_district.totalPerYear[0] +
                        community_college.totalPerYear[0] +
                        public_authority.totalPerYear[0] +
                        village.totalPerYear[0])}</td>

                        {/* Real Property Tax */}
                        <td>
                            {formatCurrency((realPropertyResults?.county.totalPerYear[0] ?? 0) + 
                            (realPropertyResults?.local_unit.totalPerYear[0] ?? 0) +
                            (realPropertyResults?.school_district.totalPerYear[0] ?? 0) +
                            (realPropertyResults?.intermediate_school_district.totalPerYear[0] ?? 0) +
                            (realPropertyResults?.community_college.totalPerYear[0] ?? 0) +
                            (realPropertyResults?.public_authority.totalPerYear[0] ?? 0) +
                            (realPropertyResults?.village.totalPerYear[0] ?? 0)
                            )}
                        </td>

                        {/* UPP */}

                        <td>
                            {formatCurrency((uppRevenueResults?.county.totalPerYear[0] ?? 0) + 
                            (uppRevenueResults?.local_unit.totalPerYear[0] ?? 0) +
                            (uppRevenueResults?.school_district.totalPerYear[0] ?? 0) +
                            (uppRevenueResults?.intermediate_school_district.totalPerYear[0] ?? 0) +
                            (uppRevenueResults?.community_college.totalPerYear[0] ?? 0) +
                            (uppRevenueResults?.public_authority.totalPerYear[0] ?? 0) +
                            (uppRevenueResults?.village.totalPerYear[0] ?? 0)
                            )}
                        </td>

                        {/* TOTAL */}

                        <td>
                            {formatCurrency(
                                county.totalPerYear[0] + 
                                local_unit.totalPerYear[0] + 
                                school_district.totalPerYear[0] + 
                                intermediate_school_district.totalPerYear[0] +
                                community_college.totalPerYear[0] +
                                public_authority.totalPerYear[0] +
                                village.totalPerYear[0] + 
                                (realPropertyResults?.county.totalPerYear[0] ?? 0) + 
                                (realPropertyResults?.local_unit.totalPerYear[0] ?? 0) +
                                (realPropertyResults?.school_district.totalPerYear[0] ?? 0) +
                                (realPropertyResults?.intermediate_school_district.totalPerYear[0] ?? 0) +
                                (realPropertyResults?.community_college.totalPerYear[0] ?? 0) +
                                (realPropertyResults?.public_authority.totalPerYear[0] ?? 0) +
                                (realPropertyResults?.village.totalPerYear[0] ?? 0) +
                                (uppRevenueResults?.county.totalPerYear[0] ?? 0) + 
                                (uppRevenueResults?.local_unit.totalPerYear[0] ?? 0) +
                                (uppRevenueResults?.school_district.totalPerYear[0] ?? 0) +
                                (uppRevenueResults?.intermediate_school_district.totalPerYear[0] ?? 0) +
                                (uppRevenueResults?.community_college.totalPerYear[0] ?? 0) +
                                (uppRevenueResults?.public_authority.totalPerYear[0] ?? 0) +
                                (uppRevenueResults?.village.totalPerYear[0] ?? 0)
                            )}
                        </td>
                    </tr>
                </tbody>
            </table>

            <br></br>

            <h2 style={{ margin: "0rem" }}>PILT Year 1 Results</h2>


            <table className="basicTable">
                <thead>
                    <tr>
                        <th>Jurisdiction</th>
                        <th>PILT</th>
                        <th>Real Property Tax</th>
                        <th>UPP</th>
                        <th>Total</th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <td>County</td>
                        <td>{formatCurrency(piltCounty.totalPerYear[0])}</td>
                        <td>{formatCurrency(realPropertyResults?.county.totalPerYear[0] ?? 0)}</td>
                        <td>{formatCurrency(uppRevenueResults?.county.totalPerYear[0] ?? 0)}</td>
                        <td>{formatCurrency(piltCounty.totalPerYear[0] +
                            (realPropertyResults?.county.totalPerYear[0] ?? 0 ) +
                            (uppRevenueResults?.county.totalPerYear[0] ?? 0))
                        }</td>
                    </tr>

                    <tr>
                        <td>Local Unit</td>
                        <td>{formatCurrency(piltLocalUnit.totalPerYear[0])}</td>
                        <td>{formatCurrency(realPropertyResults?.local_unit.totalPerYear[0] ?? 0)}</td>
                        <td>{formatCurrency(uppRevenueResults?.local_unit.totalPerYear[0] ?? 0)}</td>
                        <td>{formatCurrency(piltLocalUnit.totalPerYear[0] +
                            (realPropertyResults?.local_unit.totalPerYear[0] ?? 0 ) +
                            (uppRevenueResults?.local_unit.totalPerYear[0] ?? 0))
                        }</td>
                    </tr>

                    <tr>
                        <td>School District</td>
                        <td>{formatCurrency(piltSchoolDistrict.totalPerYear[0])}</td>
                        <td>{formatCurrency(realPropertyResults?.school_district.totalPerYear[0] ?? 0)}</td>
                        <td>{formatCurrency(uppRevenueResults?.school_district.totalPerYear[0] ?? 0)}</td>
                        <td>{formatCurrency(piltSchoolDistrict.totalPerYear[0] +
                            (realPropertyResults?.school_district.totalPerYear[0] ?? 0 ) +
                            (uppRevenueResults?.school_district.totalPerYear[0] ?? 0))
                        }</td>
                    </tr>

                    <tr>
                        <td>Intermediate School District</td>
                        <td>{formatCurrency(piltISD.totalPerYear[0])}</td>
                        <td>{formatCurrency(realPropertyResults?.intermediate_school_district.totalPerYear[0] ?? 0)}</td>
                        <td>{formatCurrency(uppRevenueResults?.intermediate_school_district.totalPerYear[0] ?? 0)}</td>
                        <td>{formatCurrency(piltISD.totalPerYear[0] +
                            (realPropertyResults?.intermediate_school_district.totalPerYear[0] ?? 0 ) +
                            (uppRevenueResults?.intermediate_school_district.totalPerYear[0] ?? 0))
                        }</td>
                    </tr>

                    <tr>
                        <td>Community College</td>
                        <td>{formatCurrency(piltCC.totalPerYear[0])}</td>
                        <td>{formatCurrency(realPropertyResults?.community_college.totalPerYear[0] ?? 0)}</td>
                        <td>{formatCurrency(uppRevenueResults?.community_college.totalPerYear[0] ?? 0)}</td>
                        <td>{formatCurrency(piltCC.totalPerYear[0] +
                            (realPropertyResults?.community_college.totalPerYear[0] ?? 0 ) +
                            (uppRevenueResults?.community_college.totalPerYear[0] ?? 0))
                        }</td>
                    </tr>


                    <tr>
                        <td>Public Authorities</td>
                        <td>{formatCurrency(piltPA.totalPerYear[0])}</td>
                        <td>{formatCurrency(realPropertyResults?.public_authority.totalPerYear[0] ?? 0)}</td>
                        <td>{formatCurrency(uppRevenueResults?.public_authority.totalPerYear[0] ?? 0)}</td>
                        <td>{formatCurrency(piltPA.totalPerYear[0] +
                            (realPropertyResults?.public_authority.totalPerYear[0] ?? 0 ) +
                            (uppRevenueResults?.public_authority.totalPerYear[0] ?? 0))
                        }</td>
                    </tr>

                    <tr>
                        <td>Village</td>
                        <td>{formatCurrency(piltVillage.totalPerYear[0])}</td>
                        <td>{formatCurrency(realPropertyResults?.village.totalPerYear[0] ?? 0)}</td>
                        <td>{formatCurrency(uppRevenueResults?.village.totalPerYear[0] ?? 0)}</td>
                        <td>{formatCurrency(piltVillage.totalPerYear[0] +
                            (realPropertyResults?.village.totalPerYear[0] ?? 0 ) +
                            (uppRevenueResults?.village.totalPerYear[0] ?? 0))
                        }</td>
                    </tr>

                    <tr className="rowHighlight">
                        <td>All Units</td>

                        {/* IPP */}
                        <td>{formatCurrency(piltCounty.totalPerYear[0] + 
                        piltLocalUnit.totalPerYear[0] + 
                        piltSchoolDistrict.totalPerYear[0] + 
                        piltISD.totalPerYear[0] +
                        piltCC.totalPerYear[0] +
                        piltPA.totalPerYear[0] +
                        piltVillage.totalPerYear[0])}</td>

                        {/* Real Property Tax */}
                        <td>
                            {formatCurrency((realPropertyResults?.county.totalPerYear[0] ?? 0) + 
                            (realPropertyResults?.local_unit.totalPerYear[0] ?? 0) +
                            (realPropertyResults?.school_district.totalPerYear[0] ?? 0) +
                            (realPropertyResults?.intermediate_school_district.totalPerYear[0] ?? 0) +
                            (realPropertyResults?.community_college.totalPerYear[0] ?? 0) +
                            (realPropertyResults?.public_authority.totalPerYear[0] ?? 0) +
                            (realPropertyResults?.village.totalPerYear[0] ?? 0)
                            )}
                        </td>

                        {/* UPP */}

                        <td>
                            {formatCurrency((uppRevenueResults?.county.totalPerYear[0] ?? 0) + 
                            (uppRevenueResults?.local_unit.totalPerYear[0] ?? 0) +
                            (uppRevenueResults?.school_district.totalPerYear[0] ?? 0) +
                            (uppRevenueResults?.intermediate_school_district.totalPerYear[0] ?? 0) +
                            (uppRevenueResults?.community_college.totalPerYear[0] ?? 0) +
                            (uppRevenueResults?.public_authority.totalPerYear[0] ?? 0) +
                            (uppRevenueResults?.village.totalPerYear[0] ?? 0)
                            )}
                        </td>

                        {/* TOTAL */}

                        <td>
                            {formatCurrency(
                                piltCounty.totalPerYear[0] + 
                                piltLocalUnit.totalPerYear[0] + 
                                piltSchoolDistrict.totalPerYear[0] + 
                                piltISD.totalPerYear[0] +
                                piltCC.totalPerYear[0] +
                                piltPA.totalPerYear[0] +
                                piltVillage.totalPerYear[0] + 
                                (realPropertyResults?.county.totalPerYear[0] ?? 0) + 
                                (realPropertyResults?.local_unit.totalPerYear[0] ?? 0) +
                                (realPropertyResults?.school_district.totalPerYear[0] ?? 0) +
                                (realPropertyResults?.intermediate_school_district.totalPerYear[0] ?? 0) +
                                (realPropertyResults?.community_college.totalPerYear[0] ?? 0) +
                                (realPropertyResults?.public_authority.totalPerYear[0] ?? 0) +
                                (realPropertyResults?.village.totalPerYear[0] ?? 0) +
                                (uppRevenueResults?.county.totalPerYear[0] ?? 0) + 
                                (uppRevenueResults?.local_unit.totalPerYear[0] ?? 0) +
                                (uppRevenueResults?.school_district.totalPerYear[0] ?? 0) +
                                (uppRevenueResults?.intermediate_school_district.totalPerYear[0] ?? 0) +
                                (uppRevenueResults?.community_college.totalPerYear[0] ?? 0) +
                                (uppRevenueResults?.public_authority.totalPerYear[0] ?? 0) +
                                (uppRevenueResults?.village.totalPerYear[0] ?? 0)
                            )}
                        </td>
                    </tr>
                </tbody>
            </table>

            <br></br>
            <br></br>

            <h1>Breakdown Over the Life of the Project</h1>
            <br></br>

            <p>
                Click on the buttons below to view gross and net present values for each 
                jurisdiction over the life of the project. 
            </p>
            <br></br>

            <p>The gross value represents revenue over the life of the project without adjustments
                for future inflation or risk over the life of the project.
            </p>
            <br></br>
            
            <p>
                The net present value represents revenue over the life of the project that has been
                adjusted for inflation and risk over the life of the project. This is calculated
                by accounting for the difference between the annual inflation and discount rate.
            </p>
            <br></br>

            <br></br>

            <div className="buttonContainer">
                <button onClick={() => setVisibleTable("non_pilt")} className="inPageButton">
                    View Non-PILT Calculations
                </button>

                <button
                    onClick={() => setVisibleTable("pilt")}
                    style={{ marginLeft: "10px" }}
                    className="inPageButton"
                >
                    View PILT Calculations
                </button>

                <button
                    onClick={() => setVisibleTable(null)}
                    style={{ marginLeft: "10px" }}
                    className="inPageButton"
                >
                    Hide
                </button>
            </div>
            <br></br>


            {visibleTable === "non_pilt" && (
                <section>
                    <br></br>

                    <table className="basicTable">
                        <thead>
                            <tr>
                                <th>Jurisdiction</th>
                                <th>Gross Over the Life of the Project [Before adjustment for future inflation and risk over the life of the project]</th>
                                <th>Net Present Value [Adjusted for future inflation and risk
                                    over the life of the project]
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td>County</td>
                                <td>{formatCurrency(county.gross + (realPropertyResults?.county.gross ?? 0) + (uppRevenueResults?.county.gross ?? 0))}</td>
                                <td>{formatCurrency(county.npv + (realPropertyResults?.county.npv ?? 0) + (uppRevenueResults?.county.npv ?? 0))}</td>
                            </tr>

                            <tr>
                                <td>Local Unit</td>
                                <td>{formatCurrency(local_unit.gross + (realPropertyResults?.local_unit.gross ?? 0) + (uppRevenueResults?.local_unit.gross ?? 0))}</td>
                                <td>{formatCurrency(local_unit.npv + (realPropertyResults?.local_unit.npv ?? 0) + (uppRevenueResults?.local_unit.npv ?? 0))}</td>
                            </tr>

                            <tr>
                                <td>School District</td>
                                <td>{formatCurrency(school_district.gross + (realPropertyResults?.school_district.gross ?? 0) + (uppRevenueResults?.school_district.gross ?? 0))}</td>
                                <td>{formatCurrency(school_district.npv + (realPropertyResults?.school_district.npv ?? 0) + (uppRevenueResults?.school_district.npv ?? 0))}</td>
                            </tr>

                            <tr>
                                <td>Intermediate School District</td>
                                <td>{formatCurrency(intermediate_school_district.gross + (realPropertyResults?.intermediate_school_district.gross ?? 0) + (uppRevenueResults?.intermediate_school_district.gross ?? 0))}</td>
                                <td>{formatCurrency(intermediate_school_district.npv + (realPropertyResults?.intermediate_school_district.npv ?? 0) + (uppRevenueResults?.intermediate_school_district.npv ?? 0))}</td>
                            </tr>

                            <tr>
                                <td>Community College</td>
                                <td>{formatCurrency(community_college.gross + (realPropertyResults?.community_college.gross ?? 0) + (uppRevenueResults?.community_college.gross ?? 0))}</td>
                                <td>{formatCurrency(community_college.npv + (realPropertyResults?.community_college.npv ?? 0) + (uppRevenueResults?.community_college.npv ?? 0))}</td>
                            </tr>

                            <tr>
                                <td>Public Authorities</td>
                                <td>{formatCurrency(public_authority.gross + (realPropertyResults?.public_authority.gross ?? 0) + (uppRevenueResults?.public_authority.gross ?? 0))}</td>
                                <td>{formatCurrency(public_authority.npv + (realPropertyResults?.public_authority.npv ?? 0) + (uppRevenueResults?.public_authority.npv ?? 0))}</td>
                            </tr>

                            <tr>
                                <td>Village</td>
                                <td>{formatCurrency(village.gross + (realPropertyResults?.village.gross ?? 0) + (uppRevenueResults?.village.gross ?? 0))}</td>
                                <td>{formatCurrency(village.npv + (realPropertyResults?.village.npv ?? 0) + (uppRevenueResults?.village.npv ?? 0))}</td>
                            </tr>

                            <tr className="rowHighlight">
                                <td>All Taxing Units</td>
                                <td>{formatCurrency((county.gross + (realPropertyResults?.county.gross ?? 0) + (uppRevenueResults?.county.gross ?? 0) + local_unit.gross + 
                                (realPropertyResults?.local_unit.gross ?? 0) + (uppRevenueResults?.local_unit.gross ?? 0) + school_district.gross +
                                (realPropertyResults?.school_district.gross ?? 0) + (uppRevenueResults?.school_district.gross ?? 0) + intermediate_school_district.gross
                                + (realPropertyResults?.intermediate_school_district.gross ?? 0) + (uppRevenueResults?.intermediate_school_district.gross ?? 0) + 
                                community_college.gross + (realPropertyResults?.community_college.gross ?? 0) + (uppRevenueResults?.community_college.gross ?? 0) + 
                                public_authority.gross + (realPropertyResults?.public_authority.gross ?? 0) + (uppRevenueResults?.public_authority.gross ?? 0) + 
                                village.gross + (realPropertyResults?.village.gross ?? 0) + (uppRevenueResults?.village.gross ?? 0)))}</td>
                                
                                <td>{formatCurrency(county.npv + (realPropertyResults?.county.npv ?? 0) + (uppRevenueResults?.county.npv ?? 0) 
                                + local_unit.npv + (realPropertyResults?.local_unit.npv ?? 0) + (uppRevenueResults?.local_unit.npv ?? 0) 
                                + school_district.npv + (realPropertyResults?.school_district.npv ?? 0) + (uppRevenueResults?.school_district.npv ?? 0)
                                + intermediate_school_district.npv + (realPropertyResults?.intermediate_school_district.npv ?? 0) + (uppRevenueResults?.intermediate_school_district.npv ?? 0)
                                + community_college.npv + (realPropertyResults?.community_college.npv ?? 0) + (uppRevenueResults?.community_college.npv ?? 0)
                                + public_authority.npv + (realPropertyResults?.public_authority.npv ?? 0) + (uppRevenueResults?.public_authority.npv ?? 0) +
                                village.npv + (realPropertyResults?.village.npv ?? 0) + (uppRevenueResults?.village.npv ?? 0))}</td>
                            </tr>
                        </tbody>
                    </table>

                    <br></br>
                    <br></br>

                    <table className="basicTable">
                        <thead>
                            <tr>
                                <th>Jurisdiction</th>
                                {county.allocated.map((year) => (
                                <th key={year.year}>Year {year.year}</th>
                                ))}
                            </tr>
                        </thead>
                        
                            <tbody>
                                <tr>
                                    <td>Gross Per Year - County</td>
                                        {non_pilt_county_combined.map((value, i) => (
                                            <td key={i}>{formatCurrency(value)}</td>
                                        ))}
                                </tr>


                                <tr>
                                    <td>Gross Per Year - Local Unit</td>
                                        {non_pilt_local_unit_combined.map((value, i) => (
                                            <td key={i}>{formatCurrency(value)}</td>
                                        ))}
                                </tr>

                                <tr>
                                    <td>Gross Per Year - School District</td>
                                        {non_pilt_school_district_combined.map((value, i) => (
                                            <td key={i}>{formatCurrency(value)}</td>
                                        ))}
                                </tr>

                                <tr>
                                    <td>Gross Per Year - Intermediate School District</td>
                                        {non_pilt_intermediate_school_district_combined.map((value, i) => (
                                            <td key={i}>{formatCurrency(value)}</td>
                                        ))}
                                </tr>

                                <tr>
                                    <td>Gross Per Year - Community College</td>
                                        {non_pilt_community_college_combined.map((value, i) => (
                                            <td key={i}>{formatCurrency(value)}</td>
                                        ))}
                                </tr>

                                <tr>
                                    <td>Gross Per Year - Public Authorities (e.g. library, park authorities, etc.)</td>
                                        {non_pilt_public_authority_combined.map((value, i) => (
                                            <td key={i}>{formatCurrency(value)}</td>
                                        ))}
                                </tr>

                                <tr>
                                    <td>Gross Per Year - Village</td>
                                        {non_pilt_village_combined.map((value, i) => (
                                            <td key={i}>{formatCurrency(value)}</td>
                                        ))}
                                </tr>

                                <tr className="rowBold">
                                    <td>Total Gross Per Year - All Jurisdictions</td>
                                    {total_gross_per_year_final.map((total, index) => (
                                        <td key={index}>{formatCurrency(total)}</td>
                                    ))}
                                </tr>

                                <tr className="rowHighlight">
                                    <td colSpan={3}>Gross Over the Life of the Project [Before adjustment for future inflation and risk over the life of the project]</td>
                                    <td colSpan={projectData.expected_useful_life}>{formatCurrency(total_gross_all_units_final)}</td>
                                </tr>

                                <tr className="rowHighlight">
                                    <td colSpan={3}>Net Present Value [Adjusted for future inflation and risk over the life of the project]</td>
                                    <td colSpan={projectData.expected_useful_life}>{formatCurrency(total_npv_all_units_final)}</td>
                                </tr>

                            </tbody>
                    </table>

                </section>
            )}



            {visibleTable === "pilt" && (

                <section>

                <br></br>

                    <table className="basicTable">
                        <thead>
                            <tr>
                                <th>Jurisdiction</th>
                                <th>Gross Over the Life of the Project [Before adjustment for future inflation and risk over the life of the project]</th>
                                <th>Net Present Value [Adjusted for future inflation and risk
                                    over the life of the project]
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td>County</td>
                                <td>{formatCurrency(piltCounty.gross + (realPropertyResults?.county.gross ?? 0) + (uppRevenueResults?.county.gross ?? 0))}</td>
                                <td>{formatCurrency(piltCounty.npv + (realPropertyResults?.county.npv ?? 0) + (uppRevenueResults?.county.npv ?? 0))}</td>
                            </tr>

                            <tr>
                                <td>Local Unit</td>
                                <td>{formatCurrency(piltLocalUnit.gross + (realPropertyResults?.local_unit.gross ?? 0) + (uppRevenueResults?.local_unit.gross ?? 0))}</td>
                                <td>{formatCurrency(piltLocalUnit.npv + (realPropertyResults?.local_unit.npv ?? 0) + (uppRevenueResults?.local_unit.npv ?? 0))}</td>
                            </tr>

                            <tr>
                                <td>School District</td>
                                <td>{formatCurrency(piltSchoolDistrict.gross + (realPropertyResults?.school_district.gross ?? 0) + (uppRevenueResults?.school_district.gross ?? 0))}</td>
                                <td>{formatCurrency(piltSchoolDistrict.npv + (realPropertyResults?.school_district.npv ?? 0) + (uppRevenueResults?.school_district.npv ?? 0))}</td>
                            </tr>

                            <tr>
                                <td>Intermediate School District</td>
                                <td>{formatCurrency(piltISD.gross + (realPropertyResults?.intermediate_school_district.gross ?? 0) + (uppRevenueResults?.intermediate_school_district.gross ?? 0))}</td>
                                <td>{formatCurrency(piltISD.npv + (realPropertyResults?.intermediate_school_district.npv ?? 0) + (uppRevenueResults?.intermediate_school_district.npv ?? 0))}</td>
                            </tr>

                            <tr>
                                <td>Community College</td>
                                <td>{formatCurrency(piltCC.gross + (realPropertyResults?.community_college.gross ?? 0) + (uppRevenueResults?.community_college.gross ?? 0))}</td>
                                <td>{formatCurrency(piltCC.npv + (realPropertyResults?.community_college.npv ?? 0) + (uppRevenueResults?.community_college.npv ?? 0))}</td>
                            </tr>

                            <tr>
                                <td>Public Authorities</td>
                                <td>{formatCurrency(piltPA.gross + (realPropertyResults?.public_authority.gross ?? 0) + (uppRevenueResults?.public_authority.gross ?? 0))}</td>
                                <td>{formatCurrency(piltPA.npv + (realPropertyResults?.public_authority.npv ?? 0) + (uppRevenueResults?.public_authority.npv ?? 0))}</td>
                            </tr>

                            <tr>
                                <td>Village</td>
                                <td>{formatCurrency(piltVillage.gross + (realPropertyResults?.village.gross ?? 0) + (uppRevenueResults?.village.gross ?? 0))}</td>
                                <td>{formatCurrency(piltVillage.npv + (realPropertyResults?.village.npv ?? 0) + (uppRevenueResults?.village.npv ?? 0))}</td>
                            </tr>

                            <tr className="rowHighlight">
                                <td>All Taxing Units</td>
                                <td>{formatCurrency(piltCounty.gross + (realPropertyResults?.county.gross ?? 0) + (uppRevenueResults?.county.gross ?? 0) +
                                piltLocalUnit.gross + (realPropertyResults?.local_unit.gross ?? 0) + (uppRevenueResults?.local_unit.gross ?? 0) 
                                + piltSchoolDistrict.gross + (realPropertyResults?.school_district.gross ?? 0) + (uppRevenueResults?.school_district.gross ?? 0)
                                + piltISD.gross + (realPropertyResults?.intermediate_school_district.gross ?? 0) + (uppRevenueResults?.intermediate_school_district.gross ?? 0)
                                + piltCC.gross + (realPropertyResults?.community_college.gross ?? 0) + (uppRevenueResults?.community_college.gross ?? 0)
                                + piltPA.gross + (realPropertyResults?.public_authority.gross ?? 0) + (uppRevenueResults?.public_authority.gross ?? 0)
                                + piltVillage.gross + (realPropertyResults?.village.gross ?? 0) + (uppRevenueResults?.village.gross ?? 0))}</td>
                                
                                <td>{formatCurrency(piltCounty.npv + (realPropertyResults?.county.npv ?? 0) + (uppRevenueResults?.county.npv ?? 0) 
                                + piltLocalUnit.npv + (realPropertyResults?.local_unit.npv ?? 0) + (uppRevenueResults?.local_unit.npv ?? 0) 
                                + piltSchoolDistrict.npv + (realPropertyResults?.school_district.npv ?? 0) + (uppRevenueResults?.school_district.npv ?? 0) +
                                + piltISD.npv + (realPropertyResults?.intermediate_school_district.npv ?? 0) + (uppRevenueResults?.intermediate_school_district.npv ?? 0)
                                + piltCC.npv + (realPropertyResults?.community_college.npv ?? 0) + (uppRevenueResults?.community_college.npv ?? 0)
                                + piltPA.npv + (realPropertyResults?.public_authority.npv ?? 0) + (uppRevenueResults?.public_authority.npv ?? 0) 
                                + piltVillage.npv + (realPropertyResults?.village.npv ?? 0) + (uppRevenueResults?.village.npv ?? 0))}</td>
                            </tr>
                        </tbody>
                    </table>

                    <br></br>
                    <br></br>

                    <table className="basicTable">
                        <thead>
                            <tr>
                                <th>Jurisdiction</th>
                                {piltCounty.allocated.map((year) => (
                                <th key={year.year}>Year {year.year}</th>
                                ))}
                            </tr>
                        </thead>

                            <tbody>
                                <tr>
                                    <td>Gross Per Year - County</td>
                                        {pilt_county_combined.map((value, i) => (
                                            <td key={i}>{formatCurrency(value)}</td>
                                        ))}
                                </tr>


                                <tr>
                                    <td>Gross Per Year - Local Unit</td>
                                        {pilt_local_unit_combined.map((value, i) => (
                                            <td key={i}>{formatCurrency(value)}</td>
                                        ))}
                                </tr>

                                <tr>
                                    <td>Gross Per Year - School District</td>
                                        {pilt_school_district_combined.map((value, i) => (
                                            <td key={i}>{formatCurrency(value)}</td>
                                        ))}
                                </tr>

                                <tr>
                                    <td>Gross Per Year - Intermediate School District</td>
                                        {pilt_intermediate_school_district_combined.map((value, i) => (
                                            <td key={i}>{formatCurrency(value)}</td>
                                        ))}
                                </tr>

                                <tr>
                                    <td>Gross Per Year - Community College</td>
                                        {pilt_community_college_combined.map((value, i) => (
                                            <td key={i}>{formatCurrency(value)}</td>
                                        ))}
                                </tr>

                                <tr>
                                    <td>Gross Per Year - Public Authorities (e.g. library, park authorities, etc.)</td>
                                        {pilt_public_authority_combined.map((value, i) => (
                                            <td key={i}>{formatCurrency(value)}</td>
                                        ))}
                                </tr>

                                <tr>
                                    <td>Gross Per Year - Village</td>
                                        {pilt_village_combined.map((value, i) => (
                                            <td key={i}>{formatCurrency(value)}</td>
                                        ))}
                                </tr>

                                <tr className="rowBold">
                                    <td>Total Gross Per Year - All Jurisdictions</td>
                                    {pilt_total_gross_per_year_final.map((total, index) => (
                                        <td key={index}>{formatCurrency(total)}</td>
                                    ))}
                                </tr>

                                <tr className="rowHighlight">
                                    <td colSpan={3}>Gross Over the Life of the Project [Before adjustment for future inflation and risk over the life of the project]</td>
                                    <td colSpan={projectData.expected_useful_life}>{formatCurrency(pilt_total_gross_all_units_final)}</td>
                                </tr>

                                <tr className="rowHighlight">
                                    <td colSpan={3}>Net Present Value [Adjusted for future inflation and risk over the life of the project]</td>
                                    <td colSpan={projectData.expected_useful_life}>{formatCurrency(pilt_total_npv_all_units_final)}</td>
                                </tr>

                            </tbody>
                    </table>

                </section>
            )}


            <br></br>
            <section>
                <h1>Community Benefits</h1>
                <br></br>

                <p>Below is an estimate of real-world community benefits from your planned renewable project
                    over the course of its lifespan.
                </p>
                <br></br>

                <table className="basicTable">
                    <thead>
                        <th></th>
                        <th>Expenditure</th>
                        <th>Jurisdiction</th>
                        <th>Unit Cost</th>
                        <th>Total Lifetime Non-PILT Benefit</th>
                        <th>Total Lifetime PILT Benefit</th>
                    </thead>

                    <tbody>
                        <tr>
                            <td style={{ minWidth: "100px", maxWidth: "200px" }}><img src="/photos-logos/roadway-maintenance.png" alt="Vector graphic of a roadway."></img></td>
                            <td>Roadway Maintenance</td>
                            <td>County</td>
                            <td>~$1,152 per mile</td>
                            <td>
                                {Math.round((county.npv) / 1152)} miles
                            </td>
                            <td>{Math.round((piltCounty.npv) / 1152)} miles
                            </td>
                        </tr>

                        <tr>
                            <td style={{ minWidth: "100px", maxWidth: "200px" }}><img src="/photos-logos/firefighter.png" alt="Vector graphic of a firefighter"></img></td>
                            <td>Firefighters</td>
                            <td>Township</td>
                            <td>~$71,835 per full-time employee (FTE)</td>
                            <td>{Math.round((local_unit.npv) / 71835)} FTEs</td>
                            <td>{Math.round((piltLocalUnit.npv / 71835))} FTEs</td>
                        </tr>

                        <tr>
                            <td style={{ minWidth: "100px", maxWidth: "200px" }}><img src="/photos-logos/fire-truck.png" alt="Vector graphic of a fire truck"></img></td>
                            <td>Fire Trucks</td>
                            <td>Township</td>
                            <td>~$2,100,000 per unit</td>
                            <td>{Math.round((local_unit.npv) / 2100000)} fire truck(s)</td>
                            <td>{Math.round((piltLocalUnit.npv) / 2100000)} fire truck(s)</td>
                        </tr>
                    </tbody>
                </table>
            </section>


        </section>
        
    );

}

