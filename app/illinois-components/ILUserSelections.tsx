"use client";

import { ProjectData } from "@/types/ILProject";
import LocationSelector from "../../components/ILLocationSelector";
import { County } from "../../components/ILLocationSelector";
import { useState } from "react";
import { useEffect } from "react";
import TaxTable, { TaxUnit } from "./ILTaxTable";


interface Props {
  projectData: ProjectData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  setProjectData: React.Dispatch<React.SetStateAction<ProjectData>>;
  onSelectCounty?: (county: County | null) => void;
}

const MAX_USEFUL_LIFE = 35;

export default function ILUserSelections({
  projectData,
  handleChange,
  setProjectData,
}: Props) {

    const inflation = (projectData.inflation_rate?? 0) * 100;
    const discount = (projectData.discount_rate ?? 0) * 100;

    const DEFAULT_PROJECT_DETAILS = {
      inflation_rate: 0.029, 
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
    
    const [taxUnits, setTaxUnits] = useState<TaxUnit[]>(
        Array.from({ length: 15 }, (_, i) => ({
            unitNumber: i + 1,
            type: i === 0 ? "County" : i === 1 ? "Township" : i === 2 ? "School District" : "",
            rate: i === 0 ? 0.76473 : i === 1 ? 0.33223 : i === 2 ? 3.50119 : i === 3 ? 1.43 : 0,
            name: i === 0 ? "Adams" : i === 1 ? "Clayton" : i === 2 ? "Camp Point" : "",
        }))
    );

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
        stateName="ILLINOIS"
        onSelectCounty={(county) => {
            console.log("Selected county:", county)
            setProjectData((prev) => ({
            ...prev,
            county_name: county?.county_name || "",
            county_avg_soil_productivity: county?.avg_soil_productivity_index || 0,
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
                    value={Math.round(projectData.inflation_rate * 10000) / 100} // Displays as 2.7%
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
                        The default number (2.9%) represents the average 
                        annual inflation rate multiplier from the {" "}
                        <a style={{textDecoration: "underline"}} target="_blank" href="https://tax.illinois.gov/localgovernments/property/cpihistory.html">Illinois Department of 
                        Revenue</a>.
                        The default multiplier translates to a 2.9% average annual inflation rate. 
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

        <section>
            <h1>Manual Taxing District Rates</h1>
            <br></br>

            <p>
                Illinois does not publish statewide data on local tax rates.
                Check county website or contact local jurisdictions for all applicable rates.
            </p>
            

            <br></br>

            <TaxTable taxUnits={taxUnits} setTaxUnits={setTaxUnits} />
        </section>

    </>
    
  );
}
