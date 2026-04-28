"use client";

import { ProjectData } from "@/types/NEProject";
import LocationSelector from "../../components/NELocationSelector";
import { County } from "@/components/NELocationSelector";
import { useState } from "react";
import { useEffect } from "react";
import TaxTable from "./NETaxTable";
import type { TaxUnit } from "./NETaxTable";
import Link from "next/link";


interface Props {
  projectData: ProjectData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  setProjectData: React.Dispatch<React.SetStateAction<ProjectData>>;
  onSelectCounty?: (county: County | null) => void;
  taxUnits: TaxUnit[];
  setTaxUnits: React.Dispatch<React.SetStateAction<TaxUnit[]>>;
}

const MAX_USEFUL_LIFE = 35;


// Default tax unit definition; example for users.
export const createDefaultTaxUnits = (): TaxUnit[] =>
  Array.from({ length: 15 }, (_, i) => ({
    unitNumber: i + 1,
    type:
      i === 0 ? "County" :
      i === 1 ? "School District (non-bond)" :
      i === 2 ? "School District (bond)" :
      i === 3 ? "Special Unit" :
      i === 4 ? "Township" : 
      i === 5 ? "Special Unit" : "",
    rate:
      i === 0 ? 0.227 :
      i === 1 ? 0.891 :
      i === 2 ? 0.053 :
      i === 3 ? 0.080 :
      i === 4 ? 0.051 :
      i === 5 ? 0.144 : 0,
    name:
      i === 0 ? "Saunders County" :
      i === 1 ? "Yutan School District (non-bond)" :
      i === 2 ? "Yutan School District (bond)" :
      i === 3 ? "Yutan Fire Department" :
      i === 4 ? "Union Township" :
      i === 5 ? "Additional Special Districts" : "",
  }));

export const createClearedTaxUnits = (): TaxUnit[] =>
Array.from({ length: 15 }, (_, i) => ({
    unitNumber: i + 1,
    type:
    i === 0 ? "" :
    i === 1 ? "" :
    i === 2 ? "" :
    i === 3 ? "" : "",
    rate:
    i === 0 ? 0 :
    i === 1 ? 0 :
    i === 2 ? 0 :
    i === 3 ? 0 : 0,
    name:
    i === 0 ? "" :
    i === 1 ? "" :
    i === 2 ? "" :
    i === 3 ? "" : "",
}));


export default function NEUserSelections({
  projectData,
  handleChange,
  setProjectData,
  taxUnits,
  setTaxUnits,
}: Props) {

    const inflation = (projectData.inflation_rate?? 0) * 100;
    const discount = (projectData.discount_rate ?? 0) * 100;

    const DEFAULT_PROJECT_DETAILS = {
      inflation_rate: 0.027,
      discount_rate: 0.03,
      auto_calculate_costs: true,
    };

    const handleResetDefaults = () => {
      setProjectData((prev) => ({
          ...prev,
          ...DEFAULT_PROJECT_DETAILS,
      }));
    };

    const [selectedCounty, setSelectedCounty] = useState<County | null>(null);
    const [userEditedAcreage, setUserEditedAcreage] = useState(false);
    const [userEditedSolarRelation, setUserEditedSolarRelation] = useState(false);

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
    

    // Resets the tax unit table to default if the user clicks the reset button.
    const handleResetTaxUnits = () => {
        setTaxUnits(createDefaultTaxUnits());
    };
    
    // Sets the tax unit table to cleared. Can be restored using reset to default button.
    const handleClearTaxUnits = () => {
        setTaxUnits(createClearedTaxUnits());
    };

  return (
    <>
    <section>
      <h1>Project Information</h1>
      <br></br>

      <p style={{ color: "red", fontStyle: "italic"}}>
        All fields in this section are required. You may choose to
        use the defaults listed below, or override them with values relevant to
        your project.
      </p>

      <br></br>
      <LocationSelector
        stateName="NEBRASKA"
        onSelectCounty={(county) => {
            console.log("Selected county:", county)
            setProjectData((prev) => ({
            ...prev,
            county_name: county?.county_name || "",
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
            
                    <label>
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
                    </label>

                    <br></br>

                    {userEditedSolarRelation && (
                        <>
                        <p className="warning">
                            <img
                                src="/photos-logos/warning-alert.svg"
                                alt="Warning sign logo."
                                className="warningImg"
                            />
                            <span>
                                WARNING: Nameplate capacity and fencline acres no longer linked. Click "Reset Fencline Acres to Match Nameplate Capacity"
                                to restore the default relationship.
                            </span>
                        </p>

                        <br></br>
                        <br></br>
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
                Nameplate Capacity / Project Size (in mega-watts)
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
                      We assume that total acreage is equivalent to the total number of turbines (1 turbine = 1 acre).
                  </div>
                </div>
            </label>

            {userEditedAcreage && (
                <p className="warning">
                    <img
                        src="/photos-logos/warning-alert.svg"
                        alt="Warning sign logo."
                        className="warningImg"
                    />
                    <span>
                        WARNING: Acreage is manually overridden. Click "Reset Turbines to Default"
                        below to restore automatic calculation from turbine totals.
                    </span>
                </p>
            )}
            <br></br>

            <br></br>
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
                Reset Acreage to Match Number of Turbines
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

            </>
            )}

            <h1>Inflation Factors</h1>
            <br></br>

            <p style={{ color: "red", fontStyle: "italic"}}>
                All fields in this section are required. You may choose to
                use the defaults listed below, or override them with values relevant to
                your project.
            </p>

            <br></br>

            <label>
                Average annual inflation rate (%):
                <div className="inputWithInfo">
                    <input
                        type="number"
                        step="0.01"
                        value={projectData.inflation_rate * 100} // Displays as 2.7%
                        onChange={(e) =>
                        setProjectData((prev) => ({
                            ...prev,
                            inflation_rate: e.target.value === "" ? 0 : parseFloat(e.target.value) / 100
                        }))
                        }
                        className="basicInputBox"
                    />

                <div className="infoWrapper">
                    <img src="/photos-logos/information-bubble.svg" alt="Vector graphic information bubble"></img>
                    <div className="infoBubble">
                        The default number (2.7%) represents the average 
                        annual inflation rate multiplier from the {" "}
                        <a style={{textDecoration: "underline"}} target="_blank" href="https://www.revenue.wi.gov/Pages/SLF/COTVC-News/2025-09-24.aspx">Wisconsin Department of 
                        Revenue</a>.
                        The default multiplier translates to a 2.7% average annual inflation rate. 
                        Users can override this default number and enter their own estimated 
                        average annual inflation rate multiplier if they prefer.
                    </div>
                </div>
            </div>
        </label>

        <label>
            Annual discount rate (%):
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
                />
                <div className="infoWrapper">
                    <img src="/photos-logos/information-bubble.svg" alt="Vector graphic information bubble"></img>
                    <div className="infoBubble">
                        The default discount rate of 3.0% comes from {" "}
                        <a style={{ textDecoration: "underline" }} target="_blank" href="https://nvlpubs.nist.gov/nistpubs/ir/2023/NIST.IR.85-3273-38.pdf">FEMP guidelines for analyzing renewable energy projects for federal agencies</a>.
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
        
        <br></br>
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

                        // Cap value at 35
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
                            Note: This calculator can only calculate revenues up to 35 years.
                        </div>
                    </div>
                </div>
            </label>
        </section>

        <br></br>

        <section>
            <h1>Project Specifications</h1>

            <br />

            <label>Anticipated start date of project:</label>
            <div style={{ display: "flex", gap: "30px", marginBottom: "20px" }}>
                <select
                name="project_start_month"
                value={projectData.project_start_month}
                onChange={handleChange}
                className="basicInputBox"
                style={{ flex: 1 }}
                >
                <option value="">Month</option>
                    {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                        {new Date(0, i).toLocaleString("en-US", { month: "long" })}
                        </option>
                    ))}
                </select>

                <select
                    name="project_start_day"
                    value={projectData.project_start_day}
                    onChange={handleChange}
                    className="basicInputBox"
                    style={{ flex: 1 }}
                    >
                    <option value="">Day</option>
                    {/* Limits the date to real dates based on the selected month */}
                    {Array.from(
                        { length: new Date(2024, Number(projectData.project_start_month) || 0, 0).getDate() || 31 },
                        (_, i) => (
                        <option key={i + 1} value={i + 1}>
                            {i + 1}
                        </option>
                        )
                    )}
                </select>
            </div>

            <br></br>

            <label>
                Select Source for Market Value of Agricultural Land:
                <select
                name="market_value_source"
                value={projectData.market_value_source}
                onChange={handleChange}
                className="basicInputBox"
                >
                <option value="">Select</option>
                <option value="Statewide">Statewide</option>
                <option value="Regional">Regional</option>
                <option value="Manual">Manual</option>
                </select>
            </label>

            {projectData.market_value_source === "Manual" && (
                <label>
                Enter manual market value ($/acre):
                <input
                    type="number"
                    name="manual_market_value"
                    value={projectData.manual_market_value}
                    onChange={handleChange}
                    placeholder="e.g. 5000"
                    className="basicInputBox"
                />
                </label>
            )}

            <br />

            <label>
                Is the project developed by a Public Power District/Municipal Power System?
                <select
                name="is_public_power"
                value={projectData.is_public_power}
                onChange={handleChange}
                className="basicInputBox"
                >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
                </select>
            </label>

            {projectData.is_public_power === "yes" && (
                <>
                <br></br>
                <label>
                Enter PILOT Value ($/mega-watt):
                <input
                    type="number"
                    name="pilot_value"
                    value={projectData.pilot_value}
                    onChange={handleChange}
                    placeholder="Enter value"
                    className="basicInputBox"
                />
                </label>

                </>
            )}

        
        </section>

        <section>

            <br></br>

            <h1>Manual Taxing Units</h1>

            <br></br>

            <div className="altBasicBox">
                <p>
                    Above, you selected "no" to the question "Use County Average for Total District Tax Rates".
                    Now, please identify your taxing district {" "}
                    <Link className="boxLinkText" href="https://revenue.nebraska.gov/PAD/research-statistical-reports/consolidated-tax-districts-and-rates-county-reports">
                        at this link
                    </Link>{" "}
                    and copy/paste all taxing units and rates in the boxes below. Use the drop-down to indicate
                    which units are school bonds.
                </p>
            </div>

            <br></br>

            <TaxTable taxUnits={taxUnits} setTaxUnits={setTaxUnits} />

            <br></br>
            <br></br>
            <button
                type="button"
                onClick={handleResetTaxUnits}
                className="inPageButton"
                >
                Reset Tax Units to Defaults
            </button>

            <button
                type="button"
                onClick={handleClearTaxUnits}
                className="inPageButton"
                >
                Clear All Tax Units
            </button>
            
        </section>

    </>
    
  );
}
