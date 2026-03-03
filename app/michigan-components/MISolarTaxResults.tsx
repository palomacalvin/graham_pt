"use client";

import { useEffect, useState, useMemo } from "react";
import { ProjectData } from "@/types/MISolarProject";
import { MIMultiplicationFactors } from "@/types/MIMultiplicationFactors";

import { calculateMichiganTaxResults as calculateNonPILT } from "@/utils/MINonPILTSolarCalculations";
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
                                <td>{formatCurrency(county.gross)}</td>
                                <td>{formatCurrency(county.npv)}</td>
                            </tr>

                            <tr>
                                <td>Local Unit</td>
                                <td>{formatCurrency(local_unit.gross)}</td>
                                <td>{formatCurrency(local_unit.npv)}</td>
                            </tr>

                            <tr>
                                <td>School District</td>
                                <td>{formatCurrency(school_district.gross)}</td>
                                <td>{formatCurrency(school_district.npv)}</td>
                            </tr>

                            <tr>
                                <td>Intermediate School District</td>
                                <td>{formatCurrency(intermediate_school_district.gross)}</td>
                                <td>{formatCurrency(intermediate_school_district.npv)}</td>
                            </tr>

                            <tr>
                                <td>Community College</td>
                                <td>{formatCurrency(community_college.gross)}</td>
                                <td>{formatCurrency(community_college.npv)}</td>
                            </tr>

                            <tr>
                                <td>Public Authorities</td>
                                <td>{formatCurrency(public_authority.gross)}</td>
                                <td>{formatCurrency(public_authority.npv)}</td>
                            </tr>

                            <tr>
                                <td>Village</td>
                                <td>{formatCurrency(village.gross)}</td>
                                <td>{formatCurrency(village.npv)}</td>
                            </tr>

                            <tr className="rowHighlight">
                                <td>All Taxing Units</td>
                                <td>{formatCurrency(county.gross + local_unit.gross + school_district.gross +
                                intermediate_school_district.gross + community_college.gross + public_authority.gross +
                                village.gross)}</td>
                                <td>{formatCurrency(county.npv + local_unit.npv + school_district.npv 
                                + intermediate_school_district.npv + community_college.npv + public_authority.npv +
                                village.npv)}</td>
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
                                        {county.totalPerYear.map((total, index) => (
                                            <td key={index}>{formatCurrency(total)}</td>
                                        ))}
                                </tr>

                                <tr>
                                    <td>Gross Per Year - Local Unit</td>
                                        {local_unit.totalPerYear.map((total, index) => (
                                            <td key={index}>{formatCurrency(total)}</td>
                                        ))}
                                </tr>

                                <tr>
                                    <td>Gross Per Year - School District</td>
                                        {school_district.totalPerYear.map((total, index) => (
                                            <td key={index}>{formatCurrency(total)}</td>
                                        ))}
                                </tr>

                                <tr>
                                    <td>Gross Per Year - Intermediate School District</td>
                                        {intermediate_school_district.totalPerYear.map((total, index) => (
                                            <td key={index}>{formatCurrency(total)}</td>
                                        ))}
                                </tr>

                                <tr>
                                    <td>Gross Per Year - Community College</td>
                                        {community_college.totalPerYear.map((total, index) => (
                                            <td key={index}>{formatCurrency(total)}</td>
                                        ))}
                                </tr>

                                <tr>
                                    <td>Gross Per Year - Public Authorities (e.g. library, park authorities, etc.)</td>
                                        {public_authority.totalPerYear.map((total, index) => (
                                            <td key={index}>{formatCurrency(total)}</td>
                                        ))}
                                </tr>

                                <tr>
                                    <td>Gross Per Year - Village</td>
                                        {village.totalPerYear.map((total, index) => (
                                            <td key={index}>{formatCurrency(total)}</td>
                                        ))}
                                </tr>

                                <tr className="rowBold">
                                    <td>Total Gross Per Year - All Jurisdictions</td>
                                    {total_gross_per_year.map((total, index) => (
                                        <td key={index}>{formatCurrency(total)}</td>
                                    ))}
                                </tr>

                                <tr className="rowHighlight">
                                    <td colSpan={3}>Gross Over the Life of the Project [Before adjustment for future inflation and risk over the life of the project]</td>
                                    <td colSpan={projectData.expected_useful_life}>{formatCurrency(county.gross + local_unit.gross + school_district.gross +
                                    intermediate_school_district.gross + community_college.gross + public_authority.gross +
                                    village.gross)}</td>
                                </tr>

                                <tr className="rowHighlight">
                                    <td colSpan={3}>Net Present Value [Adjusted for future inflation and risk over the life of the project]</td>
                                    <td colSpan={projectData.expected_useful_life}>{formatCurrency(county.npv + local_unit.npv + school_district.npv 
                                        + intermediate_school_district.npv + community_college.npv + public_authority.npv +
                                        village.npv)}</td>
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
                                <td>{formatCurrency(piltCounty.gross)}</td>
                                <td>{formatCurrency(piltCounty.npv)}</td>
                            </tr>

                            <tr>
                                <td>Local Unit</td>
                                <td>{formatCurrency(piltLocalUnit.gross)}</td>
                                <td>{formatCurrency(piltLocalUnit.npv)}</td>
                            </tr>

                            <tr>
                                <td>School District</td>
                                <td>{formatCurrency(piltSchoolDistrict.gross)}</td>
                                <td>{formatCurrency(piltSchoolDistrict.npv)}</td>
                            </tr>

                            <tr>
                                <td>Intermediate School District</td>
                                <td>{formatCurrency(piltISD.gross)}</td>
                                <td>{formatCurrency(piltISD.npv)}</td>
                            </tr>

                            <tr>
                                <td>Community College</td>
                                <td>{formatCurrency(piltCC.gross)}</td>
                                <td>{formatCurrency(piltCC.npv)}</td>
                            </tr>

                            <tr>
                                <td>Public Authorities</td>
                                <td>{formatCurrency(piltPA.gross)}</td>
                                <td>{formatCurrency(piltPA.npv)}</td>
                            </tr>

                            <tr>
                                <td>Village</td>
                                <td>{formatCurrency(piltVillage.gross)}</td>
                                <td>{formatCurrency(piltVillage.npv)}</td>
                            </tr>

                            <tr className="rowHighlight">
                                <td>All Taxing Units</td>
                                <td>{formatCurrency(piltCounty.gross + piltLocalUnit.gross + piltSchoolDistrict.gross +
                                piltISD.gross + piltCC.gross + piltPA.gross +
                                piltVillage.gross)}</td>
                                <td>{formatCurrency(piltCounty.npv + piltLocalUnit.npv + piltSchoolDistrict.npv 
                                + piltISD.npv + piltCC.npv + piltPA.npv +
                                piltVillage.npv)}</td>
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
                                        {piltCounty.totalPerYear.map((total, index) => (
                                            <td key={index}>{formatCurrency(total)}</td>
                                        ))}
                                </tr>

                                <tr>
                                    <td>Gross Per Year - Local Unit</td>
                                        {piltLocalUnit.totalPerYear.map((total, index) => (
                                            <td key={index}>{formatCurrency(total)}</td>
                                        ))}
                                </tr>

                                <tr>
                                    <td>Gross Per Year - School District</td>
                                        {piltSchoolDistrict.totalPerYear.map((total, index) => (
                                            <td key={index}>{formatCurrency(total)}</td>
                                        ))}
                                </tr>

                                <tr>
                                    <td>Gross Per Year - Intermediate School District</td>
                                        {piltISD.totalPerYear.map((total, index) => (
                                            <td key={index}>{formatCurrency(total)}</td>
                                        ))}
                                </tr>

                                <tr>
                                    <td>Gross Per Year - Community College</td>
                                        {piltCC.totalPerYear.map((total, index) => (
                                            <td key={index}>{formatCurrency(total)}</td>
                                        ))}
                                </tr>

                                <tr>
                                    <td>Gross Per Year - Public Authorities (e.g. library, park authorities, etc.)</td>
                                        {piltPA.totalPerYear.map((total, index) => (
                                            <td key={index}>{formatCurrency(total)}</td>
                                        ))}
                                </tr>

                                <tr>
                                    <td>Gross Per Year - Village</td>
                                        {piltVillage.totalPerYear.map((total, index) => (
                                            <td key={index}>{formatCurrency(total)}</td>
                                        ))}
                                </tr>

                                <tr className="rowBold">
                                    <td>Total Gross Per Year - All Jurisdictions</td>
                                    {pilt_total_npv_per_year.map((total, index) => (
                                        <td key={index}>{formatCurrency(total)}</td>
                                    ))}
                                </tr>

                                <tr className="rowHighlight">
                                    <td colSpan={3}>Gross Over the Life of the Project [Before adjustment for future inflation and risk over the life of the project]</td>
                                    <td colSpan={projectData.expected_useful_life}>{formatCurrency(piltCounty.gross + piltLocalUnit.gross + piltSchoolDistrict.gross +
                                    piltISD.gross + piltCC.gross + piltPA.gross +
                                    piltVillage.gross)}</td>
                                </tr>

                                <tr className="rowHighlight">
                                    <td colSpan={3}>Net Present Value [Adjusted for future inflation and risk over the life of the project]</td>
                                    <td colSpan={projectData.expected_useful_life}>{formatCurrency(piltCounty.npv + piltLocalUnit.npv + piltSchoolDistrict.npv 
                                        + piltISD.npv + piltCC.npv + piltPA.npv +
                                        piltVillage.npv)}</td>
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

