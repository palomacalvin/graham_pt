"use client";

import React from "react";
import { ProjectData } from "../../types/MIWindProject";
import { useState } from "react";
import { useEffect } from "react";

interface Props {
  projectData: ProjectData | null;
  setProjectData: React.Dispatch<React.SetStateAction<ProjectData | null>>;
}

export default function MIWindProjectDetailsSection({
  projectData,
  setProjectData,
}: Props) {

  const inflation = (projectData?.inflation_multiplier ?? 0) * 100;
  const discount = (projectData?.annual_discount_rate ?? 0) * 100;

  useEffect(() => {
  if (!projectData) return;

}, [projectData]);

  return (
    <section>
      <h1>Project Details</h1>
      <br></br>

      <p style={{ color: "red", fontStyle: "italic"}}>
        All fields in this section are required. You may choose to
        use the defaults listed below, or override them with values relevant to
        your project.
      </p>

      <br></br>

      <label>
        Original cost of site improvements for <strong>new</strong>{" "}
        solar projects <strong>up to and including the inverter</strong>, including:
        solar modules, racks, tracking, on-site battery storage systems, controls, interver ($):
        <div className="inputWithInfo">
        <input
            type="number"
            value={projectData?.original_cost_pre_interface ?? 90000000}
            onChange={(e) =>
                setProjectData((prev) => ({
                ...prev!,
                original_cost_pre_interface: parseFloat(e.target.value),
                }))
            }
            className="basicInputBox"
            />
            <div className="infoWrapper">
                <img src="/photos-logos/information-bubble.svg" alt="Vector graphic information bubble"></img>
                <div className="infoBubble">
                    If you don't know the total cost of a particular project, it can 
                    be estimated by multiplying $1 million by the nameplate capacity 
                    in megawatts.
                    If you are unsure about how the total project cost should be 
                    divided between these two categories, assume that 90% of the total 
                    cost is for site improvements up to and including the power interface, 
                    while 10% is for site improvements after the power interface.
                </div>
            </div>
        </div>
      </label>


      <label>
        Original cost of site improvements for <strong>new</strong> solar project
        {" "}<strong>after the inverter</strong>, including: cables, substations, and other transmission
        and distribution infrastructure created by the solar project ($):
        <div className="inputWithInfo">
            <input
                type="number"
                value={projectData?.original_cost_post_interface ?? 10000000}
                onChange={(e) =>
                    setProjectData((prev) => ({
                    ...prev!,
                    original_cost_post_interface: parseFloat(e.target.value),
                    }))
                }
                className="basicInputBox"
            />

              <div className="infoWrapper">
                  <img src="/photos-logos/information-bubble.svg" alt="Vector graphic information bubble"></img>
                  <div className="infoBubble">
                    If you don't know the total cost of a particular project, it can 
                    be estimated by multiplying $1 million by the nameplate capacity 
                    in megawatts.
                    If you are unsure about how the total project cost should be 
                    divided between these two categories, assume that 90% of the total 
                    cost is for site improvements up to and including the power interface, 
                    while 10% is for site improvements after the power interface.
                </div>
              </div>
          </div>
      </label>


      <label>
            Expected useful economic life of project (years):
            <div className="inputWithInfo">
                <input
                    type="number"
                    step="0.1"
                    value={projectData?.expected_useful_life ?? 30}
                    onChange={(e) =>
                        setProjectData((prev) => ({
                        ...prev!,
                        expected_useful_life: parseFloat(e.target.value),
                        }))
                }
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
                    ...prev!,
                    inflation_multiplier: parseFloat(e.target.value) / 100,
                }))
                }
                className="basicInputBox"
            />
            

            <div className="infoWrapper">
                <img src="/photos-logos/information-bubble.svg" alt="Vector graphic information bubble"></img>
                <div className="infoBubble">
                    The default number (2.7%) shown in column C represents the average 
                    annual inflation rate multiplier from 1995-2025 as calculated by 
                    the State Tax Commission (see Table 5 in the "Backend" sheet). 
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
                  ...prev!,
                  annual_discount_rate: parseFloat(e.target.value) / 100,
              }))
              }
              className="basicInputBox"
            />
            <div className="infoWrapper">
              <img src="/photos-logos/information-bubble.svg" alt="Vector graphic information bubble"></img>
              <div className="infoBubble">
                  The default discount rate of 3.0% comes from FEMP guidelines for 
                  analyzing renewable energy projects for federal agencies 
                  (https://nvlpubs.nist.gov/nistpubs/ir/2023/NIST.IR.85-3273-38.pdf). 
                  Users can override this default rate and enter their own estimated 
                  discount rate if they prefer.
            </div>
          </div>
        </div>
      </label>


      <label>
        Number of 1.5 MW wind turbine towers in service:
        <input
          type="number"
          value={projectData?.number_1_5_turbines ?? 3}
          onChange={(e) =>
            setProjectData((prev) => ({
              ...prev!,
              turbines_1_5_MW: parseInt(e.target.value, 10),
            }))
          }
          className="basicInputBox"
        />
      </label>

      <label>
        Number of 1.65 MW wind turbine towers in service:
        <input
          type="number"
          value={projectData?.number_1_65_turbines ?? 3}
          onChange={(e) =>
            setProjectData((prev) => ({
              ...prev!,
              turbines_1_65_MW: parseInt(e.target.value, 10),
            }))
          }
          className="basicInputBox"
        />
      </label>

      <label>
        Number of 2.0 MW wind turbine towers in service:
        <input
          type="number"
          value={projectData?.number_2_turbines ?? 3}
          onChange={(e) =>
            setProjectData((prev) => ({
              ...prev!,
              turbines_2_0_MW: parseInt(e.target.value, 10),
            }))
          }
          className="basicInputBox"
        />
      </label>

      <label>
        Number of 2.2 MW wind turbine towers in service:
        <input
          type="number"
          value={projectData?.number_2_2_turbines ?? 3}
          onChange={(e) =>
            setProjectData((prev) => ({
              ...prev!,
              turbines_2_2_MW: parseInt(e.target.value, 10),
            }))
          }
          className="basicInputBox"
        />
      </label>

      <label>
        Number of 2.5 MW or greater wind turbine towers in service:
        <input
          type="number"
          value={projectData?.number_2_5_turbines ?? 3}
          onChange={(e) =>
            setProjectData((prev) => ({
              ...prev!,
              turbines_2_5_MW_or_greater: parseInt(e.target.value, 10),
            }))
          }
          className="basicInputBox"
        />
      </label>
    </section>
  );
}
