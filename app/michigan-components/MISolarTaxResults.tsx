"use client";

import { useEffect, useState, useMemo } from "react";
import { ProjectData } from "@/types/MISolarProject";
import { MIMultiplicationFactors } from "@/types/MIMultiplicationFactors";

import { calculateMichiganTaxResults as calculateNonPILT } from "@/utils/MINonPILTSolarCalculations";
import { calculateMichiganTaxResults as calculatePILT } from "@/utils/MIPILTSolarCalculations";

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
    
    // Proportional values
    const county_allocated_proportional = (projectData?.county_allocated ?? 0) / calculated_homestead_rate;
    const county_extra_voted_proportional = (projectData?.county_extra_voted ?? 0) / calculated_homestead_rate;
    const county_debt_proportional = (projectData?.county_debt ?? 0) / calculated_homestead_rate;
    const local_unit_allocated_proportional = (projectData?.lu_allocated ?? 0) / calculated_homestead_rate;
    const local_unit_extra_voted_proportional = (projectData?.lu_extra_voted ?? 0) / calculated_homestead_rate;
    const local_unit_debt_proportional = (projectData?.lu_debt ?? 0) / calculated_homestead_rate;
    const sd_hold_harmless_proportional = (projectData?.sd_hold_harmless ?? 0) / calculated_homestead_rate;
    const sd_debt_proportional = (projectData?.sd_debt ?? 0) / calculated_homestead_rate;
    const sd_sinking_fund_proportional = (projectData?.sd_sinking_fund ?? 0) / calculated_homestead_rate;
    const sd_recreational_proportional = (projectData?.sd_recreational ?? 0) / calculated_homestead_rate;
    const isd_allocated_proportional = (projectData?.isd_allocated ?? 0) / calculated_homestead_rate;
    const isd_vocational_proportional = (projectData?.isd_vocational ?? 0) / calculated_homestead_rate;
    const isd_special_ed_proportional = (projectData?.isd_special_ed ?? 0) / calculated_homestead_rate;
    const isd_debt_proportional = (projectData?.isd_debt ?? 0) / calculated_homestead_rate;
    const isd_enhancement_proportional = (projectData?.isd_enhancement ?? 0) / calculated_homestead_rate;
    const cc_operating_proportional = (projectData?.cc_operating ?? 0) / calculated_homestead_rate;
    const cc_debt_proportional = (projectData?.cc_debt ?? 0) / calculated_homestead_rate;
    const pa_proportional = (projectData?.part_unit_auth ?? 0) / calculated_homestead_rate;
    const pa_debt_proportional = (projectData?.part_unit_auth_debt ?? 0) / calculated_homestead_rate;
    const special_assessment_proportional = (projectData?.special_assessment ?? 0) / calculated_homestead_rate;
    const village_allocated_proportional = (projectData?.village_allocated ?? 0) / calculated_homestead_rate;
    const village_extra_voted_proportional = (projectData?.village_extra_voted ?? 0) / calculated_homestead_rate;
    const village_debt_proportional = (projectData?.village_debt ?? 0) / calculated_homestead_rate;
    const village_pa_proportional = (projectData?.village_auth ?? 0) / calculated_homestead_rate;
    const village_pa_debt_proportional = (projectData?.village_auth_debt ?? 0) / calculated_homestead_rate;
    const village_special_assessment_proportional = (projectData?.village_special_assessment ?? 0) / calculated_homestead_rate;


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
            npv: 0
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
                            {county.allocated.map((year) => (
                                <th key={year.year}>Year {year.year}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>County - Allocated</td>
                            {county.allocated.map((year) => (
                                <td key={year.year}>{formatCurrency(year.revenue)}</td>
                            ))}
                        </tr>

                        <tr>
                            <td>County - Extra Voted</td>
                            {county.extra.map((year) => (
                                <td key={year.year}>{formatCurrency(year.revenue ?? 0)}</td>
                            ))}
                        </tr>

                        <tr>
                            <td>County - Debt</td>
                            {county.debt.map((year) => (
                                <td key={year.year}>{formatCurrency(year.revenue ?? 0)}</td>
                            ))}
                        </tr>

                        <tr className="rowBold">
                            <td>Total Per Year - County</td>
                            {county.totalPerYear.map((total, index) => (
                                <td key={index}>{formatCurrency(total)}</td>
                            ))}
                        </tr>

                        <tr className="rowHighlight">
                            <td colSpan={3}>Gross IPP Revenue Over Course of Project - County</td>
                            <td colSpan={3}>{formatCurrency(county.gross)}</td>
                        </tr>

                        <tr className="rowHighlight">
                            <td colSpan={3}>Net Present Value of IPP Revenue Over Course of Project - County</td>
                            <td colSpan={3}>{formatCurrency(county.npv)}</td>
                        </tr>
                    </tbody>

                    <tr><th></th></tr>

                    <tbody>
                        <tr>
                            <td>Local Unit - Allocated</td>
                            {local_unit.allocated.map((year) => (
                                <td key={year.year}>{formatCurrency(year.revenue)}</td>
                            ))}
                        </tr>
                        <tr>
                            <td>Local Unit - Extra Voted</td>
                            {local_unit.extra.map((year) => (
                                <td key={year.year}>{formatCurrency(year.revenue)}</td>
                            ))}
                        </tr>
                        <tr>
                            <td>Local Unit - Debt</td>
                            {local_unit.debt.map((year) => (
                                <td key={year.year}>{formatCurrency(year.revenue)}</td>
                            ))}
                        </tr>

                        <tr className="rowBold">
                            <td>Total Per Year - Local Unit</td>
                            {local_unit.totalPerYear.map((total, index) => (
                                <td key={index}>{formatCurrency(total)}</td>
                            ))}
                        </tr>

                        <tr className="rowHighlight">
                            <td colSpan={3}>Gross IPP Revenue Over Course of Project - Local Unit</td>
                            <td colSpan={3}>{formatCurrency(local_unit.gross)}</td>
                        </tr>

                        <tr className="rowHighlight">
                            <td colSpan={3}>Net Present Value of IPP Revenue Over Course of Project - Local Unit</td>
                            <td colSpan={3}>{formatCurrency(local_unit.npv)}</td>
                        </tr>
                    </tbody>

                    <tr><th></th></tr>

                    <tbody>
                        <tr>
                            <td>School District - Hold Harmless</td>
                            {school_district.hold_harmless.map((year) => (
                                <td key={year.year}>{formatCurrency(year.revenue)}</td>
                            ))}
                        </tr>
                        <tr>
                            <td>School District - Debt</td>
                            {school_district.debt.map((year) => (
                                <td key={year.year}>{formatCurrency(year.revenue)}</td>
                            ))}
                        </tr>
                        <tr>
                            <td>School District - Sinking Fund</td>
                            {school_district.sinking_fund.map((year) => (
                                <td key={year.year}>{formatCurrency(year.revenue)}</td>
                            ))}
                        </tr>
                        <tr>
                            <td>School District - Recreational</td>
                            {school_district.recreational.map((year) => (
                                <td key={year.year}>{formatCurrency(year.revenue)}</td>
                            ))}
                        </tr>

                        <tr className="rowBold">
                            <td>Total Per Year - School District</td>
                            {school_district.totalPerYear.map((total, index) => (
                                <td key={index}>{formatCurrency(total)}</td>
                            ))}
                        </tr>

                        <tr className="rowHighlight">
                            <td colSpan={3}>Gross IPP Revenue Over Course of Project - School District</td>
                            <td colSpan={3}>{formatCurrency(school_district.gross)}</td>
                        </tr>

                        <tr className="rowHighlight">
                            <td colSpan={3}>Net Present Value of IPP Revenue Over Course of Project - School District</td>
                            <td colSpan={3}>{formatCurrency(school_district.npv)}</td>
                        </tr>
                    </tbody>

                    <tr><th></th></tr>

                    <tbody>
                        <tr>
                            <td>Intermediate School District - Allocated</td>
                            {intermediate_school_district.allocated.map((year) => (
                                <td key={year.year}>{formatCurrency(year.revenue)}</td>
                            ))}
                        </tr>
                        <tr>
                            <td>Intermediate School District - Vocational</td>
                            {intermediate_school_district.vocational.map((year) => (
                                <td key={year.year}>{formatCurrency(year.revenue)}</td>
                            ))}
                        </tr>
                        <tr>
                            <td>Intermediate School District - Special Educationa</td>
                            {intermediate_school_district.special_education.map((year) => (
                                <td key={year.year}>{formatCurrency(year.revenue)}</td>
                            ))}
                        </tr>
                        <tr>
                            <td>Intermediate School District - Debt</td>
                            {intermediate_school_district.debt.map((year) => (
                                <td key={year.year}>{formatCurrency(year.revenue)}</td>
                            ))}
                        </tr>
                        <tr>
                            <td>Intermediate School District - Enhancement</td>
                            {intermediate_school_district.enhancement.map((year) => (
                                <td key={year.year}>{formatCurrency(year.revenue)}</td>
                            ))}
                        </tr>

                        <tr className="rowBold">
                            <td>Total Per Year - Intermediate School District</td>
                            {intermediate_school_district.totalPerYear.map((total, index) => (
                                <td key={index}>{formatCurrency(total)}</td>
                            ))}
                        </tr>

                        <tr className="rowHighlight">
                            <td colSpan={3}>Gross IPP Revenue Over Course of Project - Intermediate School District</td>
                            <td colSpan={3}>{formatCurrency(intermediate_school_district.gross)}</td>
                        </tr>

                        <tr className="rowHighlight">
                            <td colSpan={3}>Net Present Value of IPP Revenue Over Course of Project - Intermediate School District</td>
                            <td colSpan={3}>{formatCurrency(intermediate_school_district.npv)}</td>
                        </tr>
                    </tbody>

                    
                    <tr><th></th></tr>

                    <tbody>
                        <tr>
                            <td>Community College - Operating</td>
                            {community_college.operating.map((year) => (
                                <td key={year.year}>{formatCurrency(year.revenue)}</td>
                            ))}
                        </tr>
                        <tr>
                            <td>Community College - Debt</td>
                            {community_college.debt.map((year) => (
                                <td key={year.year}>{formatCurrency(year.revenue)}</td>
                            ))}
                        </tr>

                        <tr className="rowBold">
                            <td>Total Per Year - Community College</td>
                            {community_college.totalPerYear.map((total, index) => (
                                <td key={index}>{formatCurrency(total)}</td>
                            ))}
                        </tr>

                        <tr className="rowHighlight">
                            <td colSpan={3}>Gross IPP Revenue Over Course of Project - Community College</td>
                            <td colSpan={3}>{formatCurrency(community_college.gross)}</td>
                        </tr>

                        <tr className="rowHighlight">
                            <td colSpan={3}>Net Present Value of IPP Revenue Over Course of Project - Community College</td>
                            <td colSpan={3}>{formatCurrency(community_college.npv)}</td>
                        </tr>
                    </tbody>

                    <tr><th></th></tr>

                    <tbody>
                        <tr>
                            <td>Public Authorities (e.g. library, park authorities, etc.)</td>
                            {public_authority.authority.map((year) => (
                                <td key={year.year}>{formatCurrency(year.revenue)}</td>
                            ))}
                        </tr>
                        <tr>
                            <td>Public Authority Debt</td>
                            {public_authority.debt.map((year) => (
                                <td key={year.year}>{formatCurrency(year.revenue)}</td>
                            ))}
                        </tr>

                        <tr className="rowBold">
                            <td>Total Per Year - Public Authorities</td>
                            {public_authority.totalPerYear.map((total, index) => (
                                <td key={index}>{formatCurrency(total)}</td>
                            ))}
                        </tr>

                        <tr className="rowHighlight">
                            <td colSpan={3}>Gross IPP Revenue Over Course of Project - Public Authorities</td>
                            <td colSpan={3}>{formatCurrency(public_authority.gross)}</td>
                        </tr>

                        <tr className="rowHighlight">
                            <td colSpan={3}>Net Present Value of IPP Revenue Over Course of Project - Public Authorities</td>
                            <td colSpan={3}>{formatCurrency(public_authority.npv)}</td>
                        </tr>
                    </tbody>

                    <tr><th></th></tr>

                    <tbody>
                        <tr>
                            <td>Village - Allocated</td>
                            {village.allocated.map((year) => (
                                <td key={year.year}>{formatCurrency(year.revenue)}</td>
                            ))}
                        </tr>
                        <tr>
                            <td>Village - Extra Voted</td>
                            {village.extra.map((year) => (
                                <td key={year.year}>{formatCurrency(year.revenue)}</td>
                            ))}
                        </tr>
                        <tr>
                            <td>Village - Debt</td>
                            {village.debt.map((year) => (
                                <td key={year.year}>{formatCurrency(year.revenue)}</td>
                            ))}
                        </tr>
                        <tr>
                            <td>Village - Public Authorities</td>
                            {village.authority.map((year) => (
                                <td key={year.year}>{formatCurrency(year.revenue)}</td>
                            ))}
                        </tr>
                        <tr>
                            <td>Village - Public Authority Debt</td>
                            {village.authority_debt.map((year) => (
                                <td key={year.year}>{formatCurrency(year.revenue)}</td>
                            ))}
                        </tr>

                        <tr className="rowBold">
                            <td>Total Per Year - Village</td>
                            {village.totalPerYear.map((total, index) => (
                                <td key={index}>{formatCurrency(total)}</td>
                            ))}
                        </tr>

                        <tr className="rowHighlight">
                            <td colSpan={3}>Gross IPP Revenue Over Course of Project - Village</td>
                            <td colSpan={3}>{formatCurrency(village.gross)}</td>
                        </tr>

                        <tr className="rowHighlight">
                            <td colSpan={3}>Net Present Value of IPP Revenue Over Course of Project - Village</td>
                            <td colSpan={3}>{formatCurrency(village.npv)}</td>
                        </tr>
                    </tbody>

                    <tr><th></th></tr>

                    <tbody>
                        <tr className="rowBold">
                            <td>Total Per Year - All Taxing Units</td>
                            {non_pilt_total_all_taxing_units.map((total, index) => (
                            <td key={index}>{formatCurrency(total)}</td>
                            ))}
                        </tr>

                        <tr className="rowHighlight">
                            <td colSpan={3}>
                            Gross IPP Revenue Over Course of Project - All Taxing Units
                            </td>
                            <td colSpan={3}>
                            {formatCurrency(non_pilt_gross_all_units_revenue)}
                            </td>
                        </tr>

                        <tr className="rowHighlight">
                            <td colSpan={3}>
                            Net Present Value of IPP Revenue Over Course of Project - All Taxing Units
                            </td>
                            <td colSpan={3}>
                            {formatCurrency(non_pilt_gross_all_units_npv)}
                            </td>
                        </tr>
                    </tbody>
                </table>
            )}



            {/* PILT Table */}
            {visibleTable === "pilt" && (
                <table className="basicTable">
                    <thead>
                        <tr>
                            <th>Variable</th>
                            {piltCounty.allocated.map((year) => (
                                <th key={year.year}>Year {year.year}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>County - Allocated</td>
                            {piltCounty.allocated.map((year) => (
                                <td key={year.year}>{formatCurrency(year.revenue)}</td>
                            ))}
                        </tr>

                        <tr>
                            <td>County - Extra Voted</td>
                            {piltCounty.extra.map((year) => (
                                <td key={year.year}>{formatCurrency(year.revenue ?? 0)}</td>
                            ))}
                        </tr>

                        <tr>
                            <td>County - Debt</td>
                            {piltCounty.debt.map((year) => (
                                <td key={year.year}>{formatCurrency(year.revenue ?? 0)}</td>
                            ))}
                        </tr>

                        <tr className="rowBold">
                            <td>Total Per Year - County</td>
                            {piltCounty.totalPerYear.map((total, index) => (
                                <td key={index}>{formatCurrency(total)}</td>
                            ))}
                        </tr>

                        <tr className="rowHighlight">
                            <td colSpan={3}>Gross IPP Revenue Over Course of Project - County</td>
                            <td colSpan={3}>{formatCurrency(piltCounty.gross)}</td>
                        </tr>

                        <tr className="rowHighlight">
                            <td colSpan={3}>Net Present Value of IPP Revenue Over Course of Project - County</td>
                            <td colSpan={3}>{formatCurrency(piltCounty.npv)}</td>
                        </tr>
                    </tbody>

                    <tr><th></th></tr>

                    <tbody>
                        <tr>
                            <td>Local Unit - Allocated</td>
                            {piltLocalUnit.allocated.map((year) => (
                                <td key={year.year}>{formatCurrency(year.revenue)}</td>
                            ))}
                        </tr>
                        <tr>
                            <td>Local Unit - Extra Voted</td>
                            {piltLocalUnit.extra.map((year) => (
                                <td key={year.year}>{formatCurrency(year.revenue)}</td>
                            ))}
                        </tr>
                        <tr>
                            <td>Local Unit - Debt</td>
                            {piltLocalUnit.debt.map((year) => (
                                <td key={year.year}>{formatCurrency(year.revenue)}</td>
                            ))}
                        </tr>

                        <tr className="rowBold">
                            <td>Total Per Year - Local Unit</td>
                            {piltLocalUnit.totalPerYear.map((total, index) => (
                                <td key={index}>{formatCurrency(total)}</td>
                            ))}
                        </tr>

                        <tr className="rowHighlight">
                            <td colSpan={3}>Gross IPP Revenue Over Course of Project - Local Unit</td>
                            <td colSpan={3}>{formatCurrency(piltLocalUnit.gross)}</td>
                        </tr>

                        <tr className="rowHighlight">
                            <td colSpan={3}>Net Present Value of IPP Revenue Over Course of Project - Local Unit</td>
                            <td colSpan={3}>{formatCurrency(piltLocalUnit.npv)}</td>
                        </tr>
                    </tbody>

                    <tr><th></th></tr>

                    <tbody>
                        <tr>
                            <td>School District - Hold Harmless</td>
                            {piltSchoolDistrict.hold_harmless.map((year) => (
                                <td key={year.year}>{formatCurrency(year.revenue)}</td>
                            ))}
                        </tr>
                        <tr>
                            <td>School District - Debt</td>
                            {piltSchoolDistrict.debt.map((year) => (
                                <td key={year.year}>{formatCurrency(year.revenue)}</td>
                            ))}
                        </tr>
                        <tr>
                            <td>School District - Sinking Fund</td>
                            {piltSchoolDistrict.sinking_fund.map((year) => (
                                <td key={year.year}>{formatCurrency(year.revenue)}</td>
                            ))}
                        </tr>
                        <tr>
                            <td>School District - Recreational</td>
                            {piltSchoolDistrict.recreational.map((year) => (
                                <td key={year.year}>{formatCurrency(year.revenue)}</td>
                            ))}
                        </tr>

                        <tr className="rowBold">
                            <td>Total Per Year - School District</td>
                            {piltSchoolDistrict.totalPerYear.map((total, index) => (
                                <td key={index}>{formatCurrency(total)}</td>
                            ))}
                        </tr>

                        <tr className="rowHighlight">
                            <td colSpan={3}>Gross IPP Revenue Over Course of Project - School District</td>
                            <td colSpan={3}>{formatCurrency(piltSchoolDistrict.gross)}</td>
                        </tr>

                        <tr className="rowHighlight">
                            <td colSpan={3}>Net Present Value of IPP Revenue Over Course of Project - School District</td>
                            <td colSpan={3}>{formatCurrency(piltSchoolDistrict.npv)}</td>
                        </tr>
                    </tbody>

                    <tr><th></th></tr>

                    <tbody>
                        <tr>
                            <td>Intermediate School District - Allocated</td>
                            {piltISD.allocated.map((year) => (
                                <td key={year.year}>{formatCurrency(year.revenue)}</td>
                            ))}
                        </tr>
                        <tr>
                            <td>Intermediate School District - Vocational</td>
                            {piltISD.vocational.map((year) => (
                                <td key={year.year}>{formatCurrency(year.revenue)}</td>
                            ))}
                        </tr>
                        <tr>
                            <td>Intermediate School District - Special Educationa</td>
                            {piltISD.special_education.map((year) => (
                                <td key={year.year}>{formatCurrency(year.revenue)}</td>
                            ))}
                        </tr>
                        <tr>
                            <td>Intermediate School District - Debt</td>
                            {piltISD.debt.map((year) => (
                                <td key={year.year}>{formatCurrency(year.revenue)}</td>
                            ))}
                        </tr>
                        <tr>
                            <td>Intermediate School District - Enhancement</td>
                            {piltISD.enhancement.map((year) => (
                                <td key={year.year}>{formatCurrency(year.revenue)}</td>
                            ))}
                        </tr>

                        <tr className="rowBold">
                            <td>Total Per Year - Intermediate School District</td>
                            {piltISD.totalPerYear.map((total, index) => (
                                <td key={index}>{formatCurrency(total)}</td>
                            ))}
                        </tr>

                        <tr className="rowHighlight">
                            <td colSpan={3}>Gross IPP Revenue Over Course of Project - Intermediate School District</td>
                            <td colSpan={3}>{formatCurrency(piltISD.gross)}</td>
                        </tr>

                        <tr className="rowHighlight">
                            <td colSpan={3}>Net Present Value of IPP Revenue Over Course of Project - Intermediate School District</td>
                            <td colSpan={3}>{formatCurrency(piltISD.npv)}</td>
                        </tr>
                    </tbody>

                    <tr><th></th></tr>

                    <tbody>
                        <tr>
                            <td>Community College - Operating</td>
                            {piltCC.operating.map((year) => (
                                <td key={year.year}>{formatCurrency(year.revenue)}</td>
                            ))}
                        </tr>
                        <tr>
                            <td>Community College - Debt</td>
                            {piltCC.debt.map((year) => (
                                <td key={year.year}>{formatCurrency(year.revenue)}</td>
                            ))}
                        </tr>

                        <tr className="rowBold">
                            <td>Total Per Year - Community College</td>
                            {piltCC.totalPerYear.map((total, index) => (
                                <td key={index}>{formatCurrency(total)}</td>
                            ))}
                        </tr>

                        <tr className="rowHighlight">
                            <td colSpan={3}>Gross IPP Revenue Over Course of Project - Community College</td>
                            <td colSpan={3}>{formatCurrency(piltCC.gross)}</td>
                        </tr>

                        <tr className="rowHighlight">
                            <td colSpan={3}>Net Present Value of IPP Revenue Over Course of Project - Community College</td>
                            <td colSpan={3}>{formatCurrency(piltCC.npv)}</td>
                        </tr>
                    </tbody>

                    <tr><th></th></tr>

                    <tbody>
                        <tr>
                            <td>Public Authorities (e.g. library, park authorities, etc.)</td>
                            {piltPA.authority.map((year) => (
                                <td key={year.year}>{formatCurrency(year.revenue)}</td>
                            ))}
                        </tr>
                        <tr>
                            <td>Public Authority Debt</td>
                            {piltPA.debt.map((year) => (
                                <td key={year.year}>{formatCurrency(year.revenue)}</td>
                            ))}
                        </tr>

                        <tr className="rowBold">
                            <td>Total Per Year - Public Authorities</td>
                            {piltPA.totalPerYear.map((total, index) => (
                                <td key={index}>{formatCurrency(total)}</td>
                            ))}
                        </tr>

                        <tr className="rowHighlight">
                            <td colSpan={3}>Gross IPP Revenue Over Course of Project - Public Authorities</td>
                            <td colSpan={3}>{formatCurrency(piltPA.gross)}</td>
                        </tr>

                        <tr className="rowHighlight">
                            <td colSpan={3}>Net Present Value of IPP Revenue Over Course of Project - Public Authorities</td>
                            <td colSpan={3}>{formatCurrency(piltPA.npv)}</td>
                        </tr>
                    </tbody>

                    <tr><th></th></tr>

                    <tbody>
                        <tr>
                            <td>Village - Allocated</td>
                            {piltVillage.allocated.map((year) => (
                                <td key={year.year}>{formatCurrency(year.revenue)}</td>
                            ))}
                        </tr>
                        <tr>
                            <td>Village - Extra Voted</td>
                            {piltVillage.extra.map((year) => (
                                <td key={year.year}>{formatCurrency(year.revenue)}</td>
                            ))}
                        </tr>
                        <tr>
                            <td>Village - Debt</td>
                            {piltVillage.debt.map((year) => (
                                <td key={year.year}>{formatCurrency(year.revenue)}</td>
                            ))}
                        </tr>
                        <tr>
                            <td>Village - Public Authorities</td>
                            {piltVillage.authority.map((year) => (
                                <td key={year.year}>{formatCurrency(year.revenue)}</td>
                            ))}
                        </tr>
                        <tr>
                            <td>Village - Public Authority Debt</td>
                            {piltVillage.authority_debt.map((year) => (
                                <td key={year.year}>{formatCurrency(year.revenue)}</td>
                            ))}
                        </tr>

                        <tr className="rowBold">
                            <td>Total Per Year - Village</td>
                            {piltVillage.totalPerYear.map((total, index) => (
                                <td key={index}>{formatCurrency(total)}</td>
                            ))}
                        </tr>

                        <tr className="rowHighlight">
                            <td colSpan={3}>Gross IPP Revenue Over Course of Project - Village</td>
                            <td colSpan={3}>{formatCurrency(piltVillage.gross)}</td>
                        </tr>

                        <tr className="rowHighlight">
                            <td colSpan={3}>Net Present Value of IPP Revenue Over Course of Project - Village</td>
                            <td colSpan={3}>{formatCurrency(piltVillage.npv)}</td>
                        </tr>
                    </tbody>

                    <tr><th></th></tr>

                    <tbody>
                        <tr className="rowBold">
                            <td>Total Per Year - All Taxing Units</td>
                            {pilt_total_all_taxing_units.map((total, index) => (
                            <td key={index}>{formatCurrency(total)}</td>
                            ))}
                        </tr>

                        <tr className="rowHighlight">
                            <td colSpan={3}>
                            Gross IPP Revenue Over Course of Project - All Taxing Units
                            </td>
                            <td colSpan={3}>
                            {formatCurrency(pilt_gross_all_units_revenue)}
                            </td>
                        </tr>

                        <tr className="rowHighlight">
                            <td colSpan={3}>
                            Net Present Value of IPP Revenue Over Course of Project - All Taxing Units
                            </td>
                            <td colSpan={3}>
                            {formatCurrency(pilt_gross_all_units_npv)}
                            </td>
                        </tr>
                    </tbody>
                </table>
            )}

        </section>
    );
}
