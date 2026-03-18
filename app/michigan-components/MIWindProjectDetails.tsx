"use client";

import React from "react";
import { ProjectData } from "../../types/MIWindProject";
import { useEffect } from "react";

interface Props {
  projectData: ProjectData;
  setProjectData: React.Dispatch<React.SetStateAction<ProjectData>>;
}

export default function MIWindProjectDetailsSection({
  projectData,
  setProjectData,
}: Props) {

    const inflation = (projectData.inflation_multiplier ?? 0) * 100;
    const discount = (projectData.annual_discount_rate ?? 0) * 100;
  
    useEffect(() => {
      if (!projectData.auto_calculate_costs) return;
      if (!projectData.nameplate_capacity) return;

      const base_cost = projectData.nameplate_capacity * 1_000_000;

      setProjectData((prev) => ({
        ...prev,
        original_cost_pre_interface: base_cost * 0.9,
        original_cost_post_interface: base_cost * 0.1,
      }));
    }, [projectData.nameplate_capacity, projectData.auto_calculate_costs]);

      const DEFAULT_PROJECT_DETAILS = {
          nameplate_capacity: 100,
          expected_useful_life: 30,
          inflation_multiplier: 0.027,
          annual_discount_rate: 0.03,
          auto_calculate_costs: true,
      };
  
      const handleResetDefaults = () => {
        setProjectData(prev => ({
          ...prev,
          ...DEFAULT_PROJECT_DETAILS,
        }));
      };


      
  const acreage = projectData.project_acreage;
  const acreage_default_value = acreage * 4285.7;

  useEffect(() => {
    const acreage = projectData.project_acreage ?? 0;
    const defaultValue = acreage * 4285.7;

    const pre =
      projectData.pre_wind_taxable_value ?? defaultValue;

    const post =
      projectData.post_wind_taxable_value ?? defaultValue;

    const change =
      projectData.real_property_ownership_change === "yes"
        ? post - pre
        : 0;

    console.log("Taxable value change:", change);

    setProjectData(prev => ({
      ...prev,
      real_property_taxable_value_change: change,
    }));
  }, [
    projectData.project_acreage,
    projectData.pre_wind_taxable_value,
    projectData.post_wind_taxable_value,
    projectData.real_property_ownership_change,
  ]);

      const pre_wind = acreage * 4285.7;

      const post_wind = projectData.real_property_ownership_change === "yes"
      ? projectData.post_wind_taxable_value ?? pre_wind
      : pre_wind;

      const newly_subject_value =
        projectData.real_property_ownership_change === "yes"
          ? post_wind - pre_wind
          : 0;

      const DEFAULT_TURBINES = {
        number_1_5_turbines: 8,
        number_1_65_turbines: 8,
        number_2_turbines: 8,
        number_2_2_turbines: 8,
        number_2_5_turbines: 8,
      };
      
      const handleResetTurbines = () => {
        const total =
          DEFAULT_TURBINES.number_1_5_turbines +
          DEFAULT_TURBINES.number_1_65_turbines +
          DEFAULT_TURBINES.number_2_turbines +
          DEFAULT_TURBINES.number_2_2_turbines +
          DEFAULT_TURBINES.number_2_5_turbines;

        setProjectData(prev => ({
          ...prev,
          ...DEFAULT_TURBINES,
          project_acreage: total,
          auto_calculate_acreage: true,

          pre_wind_taxable_value: pre_wind,
          post_wind_taxable_value:
            projectData.real_property_ownership_change === "yes"
              ? post_wind
              : undefined,
          real_property_newly_subject_value: newly_subject_value,
        }));
      };

      useEffect(() => {
      if (!projectData.auto_calculate_acreage) return;

      const totalTurbines =
        (projectData.number_1_5_turbines ?? 0) +
        (projectData.number_1_65_turbines ?? 0) +
        (projectData.number_2_turbines ?? 0) +
        (projectData.number_2_2_turbines ?? 0) +
        (projectData.number_2_5_turbines ?? 0);

      if (projectData.project_acreage !== totalTurbines) {
        setProjectData(prev => ({
          ...prev,
          project_acreage: totalTurbines,
        }));
      }
    }, [
      projectData.number_1_5_turbines,
      projectData.number_1_65_turbines,
      projectData.number_2_turbines,
      projectData.number_2_2_turbines,
      projectData.number_2_5_turbines,
      projectData.auto_calculate_acreage,
    ]);


    const post_wind_display =
      projectData.post_wind_taxable_value ?? pre_wind;


    const handleResetPostWindValue = () => {
      const resetValue = (projectData.project_acreage ?? 0) * 4285.7;

      setProjectData(prev => ({
        ...prev,
        pre_wind_taxable_value: resetValue,
        post_wind_taxable_value: resetValue,
      }));
    };

  return (
    <>
    <section>
      <h1>Project Details</h1>
      <br></br>

      <p style={{ color: "red", fontStyle: "italic"}}>
        All fields in this section are required. You may choose to
        use the defaults listed below, or override them with values relevant to
        your project.
      </p>

      <br></br>

      <button
          type="button"
          onClick={handleResetDefaults}
          className="inPageButton"
      >
          Reset to Defaults
      </button>

      <br></br>

      <label>
        Nameplate capacity of wind project (in megawatts):
        <div className="inputWithInfo">
            <input
                type="number"
                value={projectData.nameplate_capacity ?? 100}
                onChange={(e) =>
                    setProjectData((prev) => ({
                        ...prev,
                        nameplate_capacity: parseFloat(e.target.value),
                    }))
                    }
                className="basicInputBox"
            />
        </div>
      </label>

      {!projectData.auto_calculate_costs && (
        <>
          <br></br>
            <p className="warning">
                <img
                    src="/photos-logos/warning-alert.svg"
                    alt="Warning sign logo."
                    className="warningImg"
                />
                <span>
                    WARNING: Costs are manually overridden. Click "Reset to Defaults" to restore automatic
                    calculation from nameplate capacity.
                </span>
            </p>
          <br></br>
        </>
      )}

      <br></br>

      <label>
        Original cost of site improvements for <strong>new</strong>{" "}
        wind projects <strong>up to and including the power interface (converters)</strong>, including:
        the rotor, drive train, tower, controls, foundation, and all land 
        improvements (except buildings) like roads, fences, and communication facilities ($):
        <div className="inputWithInfo">
        <input
            type="number"
            value={projectData.original_cost_pre_interface}
            onChange={(e) =>
                setProjectData((prev) => ({
                    ...prev,
                    auto_calculate_costs: false,
                    original_cost_pre_interface: parseFloat(e.target.value),
                }))
            }
            className="basicInputBox"
            />
            <div className="infoWrapper">
                <img src="/photos-logos/information-bubble.svg" alt="Vector graphic information bubble"></img>
                <div className="infoBubble">
                    If you don't know the total cost of a particular project, it can be estimated by 
                    multiplying $1 million by the nameplate capacity in megawatts. If you are unsure about how the total project cost should be divided between these two 
                    categories, assume that 90% of the total cost is for site improvements <strong>up 
                    to and including the inverter</strong>.
                </div>
            </div>
        </div>
    </label>


      <label>
            Original cost of site improvements for <strong>new</strong> wind projects
            {" "}<strong>after the interface</strong>, including: cables, substations, and other transmission
            and distribution infrastructure created by the wind project ($):
            <div className="inputWithInfo">
                <input
                    type="number"
                    value={projectData.original_cost_post_interface}
                    onChange={(e) =>
                        setProjectData((prev) => ({
                            ...prev,
                            auto_calculate_costs: false,
                            original_cost_post_interface: parseFloat(e.target.value),
                        }))
                    }
                    className="basicInputBox"
                />

                <div className="infoWrapper">
                    <img src="/photos-logos/information-bubble.svg" alt="Vector graphic information bubble"></img>
                    <div className="infoBubble">
                        If you are unsure about how the total project cost should be divided between these two 
                        categories, assume that 10% is for site improvements <strong>after</strong>{" "} 
                        the inverter.
                    </div>
                </div>
            </div>
        </label>


      <label>
            Expected useful economic life of project (years):
            <div className="inputWithInfo">
                <input
                    type="number"
                    step="1"
                    min={1}
                    max={35}
                    value={projectData.expected_useful_life ?? 30}
                   onChange={(e) => {
                      let value = parseInt(e.target.value, 10) || 1;

                      // Cap value at 35
                      if (value > 35) value = 35;

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


        <label>
            Average annual inflation rate (%):
            <div className="inputWithInfo">
                <input
                    type="number"
                    step="0.01"
                    value={inflation}
                    onChange={(e) =>
                    setProjectData((prev) => ({
                        ...prev,
                        inflation_multiplier: parseFloat(e.target.value) / 100,
                    }))
                    }
                    className="basicInputBox"
                />
                

                <div className="infoWrapper">
                    <img src="/photos-logos/information-bubble.svg" alt="Vector graphic information bubble"></img>
                    <div className="infoBubble">
                        The default number (2.7%) represents the average 
                        annual inflation rate multiplier from 1995-2025 as calculated by 
                        the State Tax Commission. 
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
                    value={discount}
                    onChange={(e) =>
                    setProjectData((prev) => ({
                        ...prev,
                        annual_discount_rate: parseFloat(e.target.value) / 100,
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
      <h1>Acreage and Turbines</h1>

      <br></br>
        

      <label>
        Number of 1.5 MW wind turbine towers in service:
        <input
          type="number"
          value={projectData.number_1_5_turbines ?? 0}
          onChange={(e) =>
            setProjectData(prev => ({
              ...prev!,
              number_1_5_turbines: parseInt(e.target.value, 10) || 0,
            }))
          }
          className="basicInputBox"
        />
      </label>

      <label>
        Number of 1.65 MW wind turbine towers in service:
        <input
          type="number"
          value={projectData.number_1_65_turbines ?? 0}
          onChange={(e) =>
            setProjectData((prev) => ({
              ...prev!,
              number_1_65_turbines: parseInt(e.target.value, 10) || 0,
            }))
          }
          className="basicInputBox"
        />
      </label>

      <label>
        Number of 2.0 MW wind turbine towers in service:
        <input
          type="number"
          value={projectData.number_2_turbines ?? 0}
          onChange={(e) =>
            setProjectData((prev) => ({
              ...prev!,
              number_2_turbines: parseInt(e.target.value, 10) || 0,
            }))
          }
          className="basicInputBox"
        />
      </label>

      <label>
        Number of 2.2 MW wind turbine towers in service:
        <input
          type="number"
          value={projectData.number_2_2_turbines ?? 0}
          onChange={(e) =>
            setProjectData((prev) => ({
              ...prev!,
              number_2_2_turbines: parseInt(e.target.value, 10) || 0,
            }))
          }
          className="basicInputBox"
        />
      </label>

      <label>
        Number of 2.5 MW or greater wind turbine towers in service:
        <input
          type="number"
          value={projectData.number_2_5_turbines ?? 0}
          onChange={(e) =>
            setProjectData((prev) => ({
              ...prev!,
              number_2_5_turbines: parseInt(e.target.value, 10) || 0,
            }))
          }
          className="basicInputBox"
        />
      </label>

      <label>
          <div className="inputWithInfo">
          Project acreage under turbines:
          <input
                type="number"
                value={projectData.project_acreage ?? 0}
                onChange={(e) =>
                  setProjectData(prev => ({
                    ...prev!,
                    auto_calculate_acreage: false,
                    project_acreage: parseFloat(e.target.value) || 0,
                  }))
                }
                className="basicInputBox"
              />

              <div className="infoWrapper">
                  <img src="/photos-logos/information-bubble.svg" alt="Vector graphic information bubble"></img>
                  <div className="infoBubble">
                      We assume that total acreage is equivalent to the total number of turbines (1 turbine = 1 acre).
                  </div>
              </div>
          </div>
      </label>

      {!projectData.auto_calculate_acreage && (
          <>
            <br />
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
            <br />
          </>
        )}

      <div className="inputWithInfo">
        <button
          type="button"
          onClick={handleResetTurbines}
          className="inPageButton"
        >
          Reset Turbines/Acreage to Default
        </button>
        <div className="infoWrapper">
          <div style={{ marginBottom: "25px" }}>
            <img src="/photos-logos/information-bubble.svg" alt="Vector graphic information bubble"></img>
          </div>
          <div className="infoBubble">
              Press this button if you have made any changes to the total project acreage, but would like to keep the default 
              relationship (1 acre/turbine). You may also use this button to reset the number of turbines to default.
          </div>
        </div>
      </div>

    </section>

    <section style={{ marginTop: "3rem" }}>
            <h1>Real Property Calculation Details</h1>

            <br></br>

            <label>
                Did the real property change ownership as a result of the solar project?
                <div className="inputWithInfo">
                    <div>
                        <select
                            value={projectData.real_property_ownership_change}
                            onChange={(e) => {
                                setProjectData((prev) => ({
                                    ...prev,
                                    real_property_ownership_change: e.target.value,
                                    }))
                                }}
                                className="basicDropdown"
                            >
                            <option value="">-- Choose Option --</option>
                            <option value={"yes"}>
                                Yes
                            </option>
                            <option value={"no"}>
                                No
                            </option>
                        </select>
                    </div>
                    
                    <div className="infoWrapper">
                        <img src="/photos-logos/information-bubble.svg" alt="Vector graphic information bubble"></img>
                        <div className="infoBubble">
                            In most cases, but not always, the answer to this question will be "No" because the land under wind projects is typically leased.
                        </div>
                    </div>
                </div>
            </label>

            <label>
                <div className="inputWithInfo">
                  Pre-Wind Taxable Value:
                  <input
                    type="number"
                    value={
                      projectData.pre_wind_taxable_value ?? acreage_default_value
                    }
                    onChange={(e) =>
                      setProjectData(prev => ({
                        ...prev,
                        pre_wind_taxable_value: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="basicInputBox"
                  />

                  <div className="infoWrapper">
                    <img src="/photos-logos/information-bubble.svg" alt="Vector graphic information bubble" />
                    <div className="infoBubble">
                      Note that the taxable value of land in Michigan is typically an adjusted assessed 
                      value set by the government and is less than the true market value. We assume a hypothetical $4,285.70 / acre
                    </div>
                  </div>
                </div>
              </label>

              {projectData.real_property_ownership_change === "yes" && (
                <label>
                  <div className="inputWithInfo">
                    Post-Wind Taxable Value:
                    <input
                      type="number"
                      value={
                        projectData.post_wind_taxable_value ?? acreage_default_value
                      }
                      onChange={(e) =>
                        setProjectData(prev => ({
                          ...prev,
                          post_wind_taxable_value: parseFloat(e.target.value) || 0,
                        }))
                      }
                      className="basicInputBox"
                    />

                    <div className="infoWrapper">
                      <img src="/photos-logos/information-bubble.svg" alt="Vector graphic information bubble" />
                      <div className="infoBubble">
                        Note: If the real property changed ownership as a result of the solar project 
                        (i.e., the developer purchased the underlying land instead of leasing it), the taxable value will be "uncapped" to equal the state equalized value (SEV), which is set at 50% of true cash value.
                      </div>
                    </div>
                  </div>
                </label>
              )}

              <br></br>
              <button
                type="button"
                onClick={handleResetPostWindValue}
                className="inPageButton"
              >
                Reset Values to Match Acreage
              </button>

            <br></br>
        </section>
      </>
  );

}
