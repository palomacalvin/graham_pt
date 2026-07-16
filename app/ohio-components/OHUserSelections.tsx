"use client";

import { ProjectData } from "@/types/OHProject";
import LocationSelector, { TaxData } from "../../components/OHLocationSelector";
import { useState } from "react";
import { useEffect } from "react";
import { Jurisdiction } from "@/types/OHProject";
import AllFieldsRequired from "@/components/AllFieldsRequired";


interface Props {
    projectData: ProjectData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    setProjectData: React.Dispatch<React.SetStateAction<ProjectData>>;
    onSelectLocation?: (location: TaxData | null) => void;
}

const MAX_USEFUL_LIFE = 30;

export default function OHUserSelections({
  projectData,
  handleChange,
  setProjectData,
}: Props) {

    // Define inflation and discount rate using project data inputs.
    const inflation = (projectData.inflation_rate?? 0) * 100;
    const discount = (projectData.discount_rate ?? 0) * 100;

    // Default details.
    const DEFAULT_PROJECT_DETAILS = {
      inflation_rate: 0.025, 
      discount_rate: 0.03,
      auto_calculate_costs: true,
    };

    // Handle resetting to default.
    const handleResetDefaults = () => {
      setProjectData((prev) => ({
          ...prev,
          ...DEFAULT_PROJECT_DETAILS,
      }));
    };

    const [selectedLocation, setSelectedLocation] = useState<TaxData | null>(null);
    const [userEditedAcreage, setUserEditedAcreage] = useState(false);
    const [userEditedSolarRelation, setUserEditedSolarRelation] = useState(false);

    useEffect(() => {
        const capacity = projectData.nameplate_capacity || 0;

        const useRate = projectData.uses_assumed_personal_property_valuation === "no"
            ? (projectData.user_specified_personal_property_valuation || 0)
            : projectData.assumed_personal_property_valuation;

        projectData.calculated_valuation = capacity * useRate;
    }, [
        projectData.nameplate_capacity,
        projectData.uses_assumed_personal_property_valuation,
        projectData.user_specified_personal_property_valuation,
        projectData.calculated_valuation,
        setProjectData
    ]);

    // Wind and solar specifics.
    useEffect(() => {
        if (projectData.project_type !== "Wind") return;
        if (userEditedAcreage) return;

        setProjectData(prev => ({
            ...prev,
            land_area: prev.number_of_turbines * 1
        }));
    }, [projectData.number_of_turbines, projectData.project_type, userEditedAcreage]);

    useEffect(() => {
        if (projectData.project_type !== "Solar") return;
        if (userEditedSolarRelation) return;

        setProjectData(prev => ({
            ...prev,
            land_area: prev.nameplate_capacity * 7
        }));
    }, [projectData.nameplate_capacity, projectData.project_type, userEditedSolarRelation]);
    
    const isQEPEligible = (() => {
        const level = projectData.pct_employed_construction_workers;

        if (projectData.project_type === "Wind") {
            return [
                "from_50_to_59",
                "from_60_to_69",
                "from_70_to_74",
                "more_than_75"
            ].includes(level);
        }

        if (projectData.project_type === "Solar") {
            return [
                "from_70_to_74",
                "more_than_75"
            ].includes(level);
        }

        return false;

    }) ();
    

    useEffect(() => {
        if (!isQEPEligible && projectData.is_project_status_qep === "yes") {
            setProjectData(prev => ({
                ...prev,
                is_project_status_qep: "no",
                user_specified_project_status: "",
            }));
        }
    }, [projectData.pct_employed_construction_workers, projectData.project_type, isQEPEligible, setProjectData]);
    

  return (
    <>
    <section>
      <h1 className="page-section-title">Project Information</h1>

      <AllFieldsRequired />

      <br></br>
      <LocationSelector
        stateName="OHIO"
        projectData={projectData}
        setProjectData={setProjectData}
        onSelectLocation={(location) => {

            if (!location) return;

            // DEBUGGING //
            console.log("DEBUG - Full Location Keys:", Object.keys(location || {}));
                if (location?.jurisdictions) {
                    console.log("DEBUG - First Jurisdiction:", location.jurisdictions[0]);
            }

            console.log("DATABASE CHECK - Jurisdiction Keys:", Object.keys(location.jurisdictions[0]));
            console.log("DATABASE CHECK - Class II Value:", location.jurisdictions[0].class_ii_tax_rate);

            const mappedJurisdictions: Jurisdiction[] = (location?.jurisdictions || []).map((j: any) => ({
                political_unit_name: j.political_unit_name,
                previous_farmland: j.previous_farmland || 0,
                qep_base_revenue: j.qep_base_revenue || 0,
                qep_discretionary_revenue: j.qep_discretionary_revenue || 0,
                class_i_tax_rate: j.class_i_tax_rate || 0,
                class_ii_tax_rate: j.class_ii_tax_rate || 0,
                gross_tax_rate: j.gross_tax_rate || 0,
            }));

            setProjectData((prev) => ({
                ...prev,
                taxing_district: location?.taxing_district_name || "",
                jurisdictions: mappedJurisdictions
            }));
        }}
        />
        <br></br>

        <label>
            Project Type:
            <select
                name="project_type"
                value={projectData.project_type}
                onChange={handleChange}
                className="basicInputBox"
            >
                <option value="">Select</option>
                <option value="Solar">Solar</option>
                <option value="Wind">Wind</option>
            </select>
        </label>


            {projectData.project_type === "Solar" && (
                <>
                    <label>
                        Nameplate Capacity (in mega-watts):
                        <input
                            type="number"
                            name="nameplate_capacity"
                            value={projectData.nameplate_capacity}
                            onChange={(e) => {
                                const newCapacity = Number(e.target.value);

                                setProjectData(prev => {
                                    const expectedAcreage = newCapacity * 7;

                                    return {
                                    ...prev,
                                    nameplate_capacity: newCapacity,
                                    land_area: userEditedSolarRelation ? prev.land_area : expectedAcreage
                                    };
                                });
                                }}
                            className="basicInputBox"
                        />
                    </label>
            
                    <label className="inputWithInfo">
                        Fenceline Acres:
                        <input
                            type="number"
                            name="land_area"
                            value={projectData.land_area}
                            onChange={(e) => {
                                setUserEditedSolarRelation(true);
                                handleChange(e);
                            }}
                            className="basicInputBox"
                        />

                        <div className="infoWrapper">
                            <img src="/photos-logos/information-bubble.svg" alt="Vector graphic information bubble"></img>
                            <div className="infoBubble">
                                For solar projects, we assume 7 fenceline acres per mega-watt.
                            </div>
                        </div>
                    </label>

                    {userEditedSolarRelation && (
                        <>
                            <div className="warning-alert-box">
                                <img
                                    src="/photos-logos/warning-alert.svg"
                                    alt="Warning sign logo."
                                    className="warning-alert-icon"
                                />
                                <span className="warning-alert-text">
                                    <strong>WARNING:</strong> Nameplate capacity and fenceline acres are no longer linked.
                                    Click <em>"Reset Fenceline Acres to Match Nameplate Capacity"</em> below to restore the default relationship.
                                </span>
                            </div>
                        </>
                    )}

                    <button
                        type="button"
                        onClick={() => {
                            setUserEditedSolarRelation(false);
                            setProjectData(prev => ({
                            ...prev,
                            land_area: prev.nameplate_capacity * 7
                            }));
                        }}
                        className="inPageButton"
                        >
                        Reset Fenceline Acres to Match Nameplate Capacity
                    </button>
                </>
            )}

            {projectData.project_type === "Wind" && (
            <>

            <label>
                Nameplate Capacity (in mega-watts)
                <input
                    type="number"
                    name="nameplate_capacity"
                    value={projectData.nameplate_capacity}
                    onChange={handleChange}
                    className="basicInputBox"
                />
            </label>

            <label>
                Number of Turbines
                <input
                type="number"
                name="number_of_turbines"
                value={projectData.number_of_turbines || ""}
                onChange={handleChange}
                className="basicInputBox"
                />
            </label>

            <label className="inputWithInfo">
                Project acreage under turbines:
                <input
                    type="number"
                    name="land_area"
                    value={projectData.land_area}
                    onChange={(e) => {
                        setUserEditedAcreage(true);
                        handleChange(e);
                    }}
                    className="basicInputBox"
                />

                <div className="infoWrapper">
                  <img src="/photos-logos/information-bubble.svg" alt="Vector graphic information bubble"></img>
                  <div className="infoBubble">
                      For wind projects, we assume that total acreage is equivalent to the total number of turbines (1 turbine = 1 acre).
                  </div>
                </div>
            </label>

            {userEditedAcreage && (
                <div className="warning-alert-box">
                    <img
                        src="/photos-logos/warning-alert.svg"
                        alt="Warning sign logo."
                        className="warning-alert-icon"
                    />
                    <span className="warning-alert-text">
                        <strong>WARNING:</strong> Acreage is manually overridden.
                        Click <em>"Reset Acreage to Match Turbines"</em> below to restore automatic calculation from turbine totals.
                    </span>
                </div>
            )}

            <br></br>

            <div style={{ display: "flex", gap: "30px", alignItems: "center" }}>
                <button
                    type="button"
                    onClick={() => {
                        setUserEditedAcreage(false);
                        setProjectData(prev => ({
                        ...prev,
                        land_area: prev.number_of_turbines * 1
                        }));
                    }}
                    className="inPageButton"
                    >
                    Reset Acreage to Match Turbines
                </button>

                <button
                    type="button"
                    onClick={() => {
                        setUserEditedAcreage(false);

                        setProjectData(prev => ({
                        ...prev,
                        nameplate_capacity: 100,
                        number_of_turbines: 50,
                        land_area: 50, // 1 turbine per acre
                        }));
                    }}
                    className="inPageButton"
                    >
                    Reset All Inputs
                </button>
            </div>

            </>
            )}

            <label>
                Expected useful economic life of project (years):
                <div className="inputWithInfo">
                    <input
                        type="number"
                        step="1"
                        min={1}
                        max={MAX_USEFUL_LIFE}
                        value={projectData.expected_useful_life ?? 30}
                    onChange={(e) => {
                        let value = parseInt(e.target.value, 10) || 1;

                        // Cap value at 30
                        if (value > MAX_USEFUL_LIFE) value = MAX_USEFUL_LIFE;

                        setProjectData((prev) => ({
                            ...prev,
                            expected_useful_life: value,
                        }));
                        }}
                    className="basicInputBox"
                    />

                    <div className="infoWrapper">
                        <img src="/photos-logos/information-bubble.svg" alt="Vector graphic information bubble"></img>
                        <div className="infoBubble">
                            Note: This calculator can only calculate revenues up to 30 years.
                        </div>
                    </div>
                </div>
            </label>

            <br></br>

            <h1 className="page-section-title">Inflation Factors</h1>

            <AllFieldsRequired />

            <br></br>

        <label>
            Average annual inflation rate:
            <div className="inputWithInfo">
                <input
                    type="number"
                    step="0.01"
                    value={Math.round(projectData.inflation_rate * 10000) / 100} // Displays as 2.7%
                    onChange={(e) =>
                    setProjectData((prev) => ({
                        ...prev,
                        inflation_rate: e.target.value === "" ? 0 : parseFloat(e.target.value) / 100
                    }))
                    }
                    className="basicInputBox"
                /> %

                <div className="infoWrapper">
                    <img src="/photos-logos/information-bubble.svg" alt="Vector graphic information bubble"></img>
                    <div className="infoBubble">
                        The default number (2.5%) represents the average 
                        annual inflation rate multiplier from the {" "}
                        <a style={{textDecoration: "underline"}} target="_blank" 
                        href="https://data.bls.gov/pdq/SurveyOutputServlet">U.S. Bureau of Labor Statistics</a> {" "}
                        between 1995 and 2025.
                        The default multiplier translates to a 2.5% average annual inflation rate. 
                        Users can override this default number and enter their own estimated 
                        average annual inflation rate multiplier if they prefer.
                    </div>
                </div>
            </div>
        </label>

        <label>
            Annual discount rate:
            <div className="inputWithInfo">
                <input
                    type="number"
                    step="0.01"
                    value={projectData.discount_rate * 100} // Display as 3%
                    onChange={(e) =>
                    setProjectData((prev) => ({
                        ...prev,
                        discount_rate: e.target.value === "" ? 0 : parseFloat(e.target.value) / 100,
                    }))
                    }
                    className="basicInputBox"
                /> %
                <div className="infoWrapper">
                    <img src="/photos-logos/information-bubble.svg" alt="Vector graphic information bubble"></img>
                    <div className="infoBubble">
                        The default discount rate of 3.0% comes from {" "}
                        <a style={{ textDecoration: "underline" }} 
                        target="_blank" 
                        href="https://nvlpubs.nist.gov/nistpubs/ir/2023/NIST.IR.85-3273-38.pdf">FEMP guidelines for analyzing renewable energy projects for federal agencies</a>.
                        Users can override this default rate and enter their own estimated 
                        discount rate if they prefer.
                    </div>
                </div>
            </div>
            </label>

            <br></br>

            <button
            type="button"
            onClick={handleResetDefaults}
            className="inPageButton"
            >
            Reset Inflation Factors
            </button>
        </section>

        <section>
            <h1 className="page-section-title">Energy System Information</h1>

            <AllFieldsRequired />

            <br></br>

            <label>
                Use Assumed Personal Property Valuation of System ($/mega-watt):
                <select
                    name="uses_assumed_personal_property_valuation"
                    value={projectData.uses_assumed_personal_property_valuation}
                    onChange={handleChange}
                    className="basicInputBox"
                >
                    <option value="">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                </select>
            </label>

            {projectData.uses_assumed_personal_property_valuation === 'no' && (
                <>
                <div>
                    <label>Enter Custom Personal Property Valuation of System ($/MW):</label>
                    <input 
                        type="number"
                        name="user_specified_personal_property_valuation"
                        value={projectData.user_specified_personal_property_valuation || ""}
                        onChange={handleChange}
                        className="basicInputBox"
                        placeholder=""
                    />
                    <p className="required">Required</p>
                    <br></br>
                </div>


                    <label>Total Calculated Personal Property Valuation:
                        <div className="inputWithInfo">
                    
                    <input 
                        type="number"
                        name="assumed_personal_property_valuation"
                        value={projectData.calculated_valuation}
                        className="basicDataBox"
                        readOnly
                    />
        
                    <div className="infoWrapper">
                    <img src="/photos-logos/information-bubble.svg" alt="Vector graphic information bubble"></img>
                        <div className="infoBubble">
                            Calculation: {projectData.nameplate_capacity || 0} MW (Nameplate Capacity) × 
                            ${projectData.uses_assumed_personal_property_valuation === "no" 
                                ? (projectData.user_specified_personal_property_valuation || 0) 
                                : projectData.assumed_personal_property_valuation} (Personal Property Valuation)
                        </div>
                    </div>
                </div>
                </label>
                <br></br>
            </>
                
            )}


            <label>
                Percentage of Employed Construction Workers that are from Ohio:
                <div className="inputWithInfo">
                <select
                    name="pct_employed_construction_workers"
                    value={projectData.pct_employed_construction_workers}
                    onChange={handleChange}
                    className="basicInputBox"
                >
                    <option value="">Select</option>
                    <option value="less_than_50">Less than 50%</option>
                    <option value="from_50_to_59">50 to 59%</option>
                    <option value="from_60_to_69">60 to 69%</option>
                    <option value="from_70_to_74">70 to 74%</option>
                    <option value="more_than_75">Greater than 75%</option>
                </select>
                <div className="infoWrapper">
                  <img src="/photos-logos/information-bubble.svg" alt="Vector graphic information bubble"></img>
                  <div className="infoBubble">
                      Note that to qualify for QEP projects, a minimum of 70% of employed construction
                      workers must be residents of Ohio.
                  </div>
                </div>
                </div>
                <div className="required">Required</div>
            </label>


            <label>
                Project Status is Qualified Energy Project (QEP):
                <select
                    name="is_project_status_qep"
                    value={projectData.is_project_status_qep}
                    onChange={handleChange}
                    className="basicInputBox"
                    disabled={!isQEPEligible} 
                    style={{ backgroundColor: !isQEPEligible ? "#bababa" : "white", cursor: !isQEPEligible ? "not-allowed" : "pointer" }}
                >
                    <option value="">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                </select>
            </label>

            {projectData.is_project_status_qep === "yes" && (
                <div>
                    <br></br>
                    <label>Enter the additional QEP payment (if applicable):</label>
                    <input 
                        type="number"
                        name="user_specified_project_status"
                        value={projectData.user_specified_project_status || ""}
                        onChange={handleChange}
                        className="basicInputBox"
                        disabled={!isQEPEligible}
                        style={{backgroundColor: !isQEPEligible ? "#f0f0f0" : "white"}}
                    />
                </div>
            )}
    

            {projectData.uses_assumed_personal_property_valuation === "yes" && (
                <div>
                    <br></br>
                    <label>Assumed Personal Property Valuation:</label>
                    <input 
                        type="number"
                        name="assumed_personal_property_valuation"
                        value={projectData.assumed_personal_property_valuation || ""}
                        onChange={handleChange}
                        className="basicDataBox"
                        readOnly
                    />
                </div>
            )}

            <br></br>

            {(projectData.uses_assumed_personal_property_valuation === "yes" || 
              projectData.uses_assumed_personal_property_valuation === "no") && (
                    <label>Total Calculated Personal Property Valuation:
                        <div className="inputWithInfo">
                    
                    <input 
                        type="number"
                        name="assumed_personal_property_valuation"
                        value={projectData.calculated_valuation}
                        className="basicDataBox"
                        readOnly
                    />
        
                    <div className="infoWrapper">
                    <img src="/photos-logos/information-bubble.svg" alt="Vector graphic information bubble"></img>
                        <div className="infoBubble">
                            Calculation: {projectData.nameplate_capacity || 0} MW (Nameplate Capacity) × 
                            ${projectData.uses_assumed_personal_property_valuation === "no" 
                                ? (projectData.user_specified_personal_property_valuation || 0) 
                                : projectData.assumed_personal_property_valuation} (Personal Property Valuation)
                        </div>
                    </div>
                </div>
                </label>
            )}
        </section>

    </>
  );
}
