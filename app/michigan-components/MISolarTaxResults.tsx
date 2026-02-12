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







    console.log("multiplicationFactors:", multiplicationFactors);
    console.log("original_cost:", original_cost);
    console.log("county_debt:", county_debt);
    console.log("multiplicationFactors:", multiplicationFactors);



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
