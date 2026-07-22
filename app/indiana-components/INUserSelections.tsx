"use client";

import { ProjectData } from "@/types/INProject";
import LocationSelector, { County } from "@/components/INLocationSelector";
import { useState, useEffect, useCallback } from "react";
import AllFieldsRequired from "@/components/AllFieldsRequired";


interface Props {
    projectData: ProjectData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    setProjectData: React.Dispatch<React.SetStateAction<ProjectData>>;
    onSelectCounty?: (county: County | null) => void;
}

const MAX_USEFUL_LIFE = 35;

export default function INUserSelections({
  projectData,
  handleChange,
  setProjectData,
  onSelectCounty,
}: Props) {

    // Define inflation and discount rate using project data inputs.
    const inflation = (projectData.inflation_rate?? 0) * 100;
    const discount = (projectData.discount_rate ?? 0) * 100;

    // Default details.
    const DEFAULT_PROJECT_DETAILS = {
      inflation_rate: 0.029, 
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

    const [selectedCounty, setSelectedCounty] = useState<County | null>(null);
    const [userEditedAcreage, setUserEditedAcreage] = useState(false);
    const [userEditedSolarRelation, setUserEditedSolarRelation] = useState(false);
    const [userEditedLandValue, setUserEditedLandValue] = useState(false);

    // Helper function to resolve regional land value based on selected county
    const getRegionalLandValue = useCallback(
    (county: County | null) => {
        if (!county?.rp_district) return 0;

        switch (county.rp_district.trim()) {
        case "North":
            return projectData.north_land_assessed_value ?? 13000;
        case "Central":
            return projectData.central_land_assessed_value ?? 14607;
        case "South":
            return projectData.south_land_assessed_value ?? 7699;
        default:
            // Default fallback if region not recognized
            return projectData.central_land_assessed_value ?? 14607;
        }
    },
    [
        projectData.north_land_assessed_value,
        projectData.central_land_assessed_value,
        projectData.south_land_assessed_value,
    ]
    );

    // Auto-populate land assessed value when county selection changes
    useEffect(() => {
        if (!selectedCounty) return;

        const regionalVal = getRegionalLandValue(selectedCounty);

        if (!userEditedLandValue) {
            setProjectData((prev) => ({
            ...prev,
            land_assessed_value: regionalVal,
            }));
        }
        }, [selectedCounty, userEditedLandValue, getRegionalLandValue, setProjectData]);

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

  return (
    <>
    <section>
      <h1 className="page-section-title">Project Information</h1>

      <AllFieldsRequired />

      <br></br>
      <LocationSelector
        stateName="INDIANA"
        onSelectCounty={(county) => {
            console.log("Selected county:", county)

            setSelectedCounty(county);
            setUserEditedLandValue(false);

            setProjectData((prev) => ({
                ...prev,
                county_name: county?.county_name || "",
                land_assessed_value: getRegionalLandValue(county),
            }));
        }}
        />
        <br></br>

        <label className="inputWithInfo">
          Land Assessed Value ($/acre):
          <input
            type="number"
            name="land_assessed_value"
            value={projectData.land_assessed_value ?? getRegionalLandValue(selectedCounty)}
            onChange={(e) => {
              setUserEditedLandValue(true);
              handleChange(e);
            }}
            className="basicInputBox"
          />
          <div className="infoWrapper">
            <img src="/photos-logos/information-bubble.svg" alt="Vector graphic information bubble" />
            <div className="infoBubble">
              This value is auto-populated based on the selected county's regional district (North, Central, or South). You can manually override this value.
            </div>
          </div>
        </label>

        {userEditedLandValue && (
          <div className="warning-alert-box">
            <img
              src="/photos-logos/warning-alert.svg"
              alt="Warning sign logo."
              className="warning-alert-icon"
            />
            <span className="warning-alert-text">
              <strong>WARNING:</strong> Land assessed value is manually overridden.
              Click <em>"Reset Assessed Value to Regional Default"</em> to restore the default calculation for this county's region.
            </span>
          </div>
        )}

        {userEditedLandValue && (
          <button
            type="button"
            onClick={() => {
              setUserEditedLandValue(false);
              setProjectData((prev) => ({
                ...prev,
                land_assessed_value: getRegionalLandValue(selectedCounty),
              }));
            }}
            className="inPageButton"
            style={{ marginBottom: "1rem" }}
          >
            Reset Assessed Value to Regional Default
          </button>
        )}

        <br></br>

        <label className="inputWithInfo">
          Total Investment:
          <input
            type="number"
            name="land_assessed_value"
            value={projectData.total_investment}
            className="basicInputBox"
            placeholder="Example: $337,500,000"
          />
          <div className="infoWrapper">
            <img src="/photos-logos/information-bubble.svg" alt="Vector graphic information bubble" />
            <div className="infoBubble">
              Input your expected total investment of your solar project in a <strong>single taxing district</strong>.
            </div>
          </div>
        </label>

        <h1 className="page-section-title">Renewable Type</h1>
        <AllFieldsRequired />

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

                        <div className="warning-alert-box">
                            <img
                                src="/photos-logos/warning-alert.svg"
                                alt="Warning sign logo."
                                className="warning-alert-icon"
                            />
                            <span className="warning-alert-text">
                                <strong>WARNING:</strong> Nameplate capacity and fenceline acres are no longer linked. 
                                Click <em>"Reset Fenceline Acres to Match Nameplate Capacity"</em> to restore the default relationship.
                            </span>
                        </div>
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
                        Click <em>"Reset Acreage to Match Turbines"</em> to restore automatic calculation from turbine totals.
                    </span>
                </div>
            )}

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

            

            <h1 className="page-section-title">Inflation Factors</h1>

            <AllFieldsRequired />

            <br></br>

        <label>
            Average annual inflation rate (%):
            <div className="inputWithInfo">
                <input
                    type="number"
                    step="0.01"
                    value={Math.round(projectData.inflation_rate * 10000) / 100}
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
                        The default number (2.5%) represents the average annual inflation rate multiplier from the U.S. Bureau of 
                        Labor Statistics between 1995 and 2025. The default multiplier translates to a 2.5% average annual inflation rate. 
                        Users can override this default number and enter their own estimated average annual inflation rate multiplier if they prefer.
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

                        // Cap value at 35.
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
            <h1 className="page-section-title">Manual Taxing District Rates</h1>

            <div className="info-callout-box">
                <p>
                    Input a potential abatement schedule for personal and real property. 
                    Indiana law allows for up to a 10-year 100% abatement of personal and real property taxes. 
                    Every value must be between 0 and 1.		
                </p>

            </div>

            <br></br>

        </section>

    </>
  );
}
