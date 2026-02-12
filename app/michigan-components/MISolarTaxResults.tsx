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
    const county_allocated = projectData?.county_allocated;
    const county_extra_voted = projectData?.county_extra_voted;
    const county_debt = projectData.county_debt;
    const local_unit_allocated = projectData.lu_allocated;
    const local_unit_extra_voted = projectData.lu_extra_voted;
    const local_unit_debt = projectData.lu_debt;
    const school_district_hold_harmless = projectData.sd_hold_harmless;
    const school_district_non_homestead_operating = projectData.sd_non_homestead;
    const school_district_debt = projectData.sd_debt;
    const school_district_sinking_fund = projectData.sd_sinking_fund;
    const school_district_recreational = projectData.sd_recreational;
    const intermediate_school_district_allocated = projectData.isd_allocated;
    const intermediate_school_district_vocational = projectData.isd_vocational;
    const intermediate_school_district_special_ed = projectData.isd_special_ed;
    const intermediate_school_district_debt = projectData.isd_debt;
    const intermediate_school_district_enhancement = projectData.isd_enhancement;
    const community_college_operating = projectData.cc_operating;
    const community_college_debt = projectData.cc_debt;
    const public_authorities = projectData.part_unit_auth;
    const public_authority_debt = projectData.part_unit_auth_debt;
    const special_assessment = projectData.special_assessment;
    const village_allocated = projectData.village_allocated;
    const village_extra_voted = projectData.village_extra_voted;
    const village_debt = projectData.village_debt;
    const village_public_authorities = projectData.village_auth;
    const village_public_authority_debt = projectData.village_auth_debt;
    const village_special_assessment = projectData.village_special_assessment;



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



    const original_cost = projectData.original_cost_post_inverter ?? 0;
    const county_allocated_rate = projectData.county_allocated ?? 0;


    const yearly_calculations =
        multiplicationFactors.map((factor) => {
              const tcv =
                  original_cost * factor.factor_form_5762 * 0.5;

              const county_allocated_revenue =
                  (county_allocated_rate / 1000) * tcv;

              return {
                  year: factor.years_ago_from_present,
                  tcv,
                  county_allocated_revenue,
              };
          });



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
                        <th colSpan={2}>Non-PILT Calculation Details</th>
                    </tr>
                    <tr>
                        <th>Variable</th>
                        <th>Value</th>
                    </tr>
                    </thead>
                    <tbody>
                    
                        {yearly_calculations.map((year) => (
                            <tr key={year.year}>
                                <th>Year {year.year}</th>
                                <th>{formatCurrency(year.county_allocated_revenue)}</th>
                            </tr>
                        ))}

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
