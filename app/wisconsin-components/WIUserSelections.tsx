"use client";

import { ProjectData } from "@/types/WIProject";
import LocationSelector from "../../components/WILocationSelector";
import { County } from "@/components/WILocationSelector";
import { useState } from "react";
import { useEffect } from "react";


interface Props {
  projectData: ProjectData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  setProjectData: React.Dispatch<React.SetStateAction<ProjectData>>;
  onSelectCounty?: (county: County | null) => void
}

const MAX_USEFUL_LIFE = 35;


export default function WIUserSelections({
  projectData,
  handleChange,
  setProjectData,
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
        stateName="WISCONSIN"
        onSelectCounty={(county) => {
            console.log("Selected county:", county)
            setProjectData((prev) => ({
            ...prev,
            county_name: county?.county_name || "",
            over_30_acres: county?.over_30_acres || prev.over_30_acres,
            between_10_and_30_acres: county?.between_10_and_30_acres || prev.between_10_and_30_acres,
            under_10_acres: county?.under_10_acres || prev.under_10_acres,
            }));
        }}
        onSelectMunicipality={(municipality) => {
            console.log("Selected municipality:", municipality);
            if (!municipality) return;

            setProjectData((prev) => ({
            ...prev,
            municipality: municipality.municipality,
            tvc: municipality.tvc,
            code: municipality.code,

            grade_1: municipality.grade_1 ?? prev.grade_1,
            grade_2: municipality.grade_2 ?? prev.grade_2,
            grade_3: municipality.grade_3 ?? prev.grade_3,
            pasture: municipality.pasture ?? prev.pasture,
            school_tax: municipality.school_tax ?? prev.school_tax,
            college_tax: municipality.college_tax ?? prev.college_tax,
            county_tax: municipality.county_tax ?? prev.county_tax,
            local_tax: municipality.local_tax ?? prev.local_tax,
            other_tax: municipality.other_tax ?? prev.other_tax,
            total_property_tax: municipality.total_property_tax ?? prev.total_property_tax,
            gross_rate: municipality.gross_rate ?? prev.gross_rate,
            effective_rate: municipality.effective_rate ?? prev.effective_rate,
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

            <label>
            Grade of Agricultural Land Converted:
            <select
                name="selected_grade"
                value={projectData.selected_grade}
                onChange={handleChange}
                className="basicInputBox"
            >
                <option value="">Select</option>
                <option value={1}>Grade 1</option>
                <option value={2}>Grade 2</option>
                <option value={3}>Grade 3</option>
                <option value={4}>Pasture</option>
            </select>
            </label>

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

    </>
    
  );
}
