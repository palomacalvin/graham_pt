"use client";

import React from "react";
import { ProjectData } from "@/types/MISolarProject";
import LocationSelector from "@/components/MISolarLocationSelector";

interface Props {
  projectData: ProjectData;
  setProjectData: React.Dispatch<React.SetStateAction<ProjectData>>;
}


const formatCurrency = (value: number) => {
    const rounded = Math.round(value);
    if (rounded < 0) {
      return `($${Math.abs(rounded).toLocaleString()})`;
    }
    return `$${rounded.toLocaleString()}`;
  };

export default function MISolarProjectDetailsSection ({
    projectData,
    setProjectData

}: Props) {
    return (
        <section>
            <h1>Project Details</h1>

            <br />

            <label>
                Nameplate capacity of solar project (in megawatts):
                <input
                    type="number"
                    value={projectData?.nameplate_capacity ?? 100}
                    onChange={(e) =>
                        setProjectData((prev) => ({
                            ...prev!,
                            nameplate_capacity: parseFloat(e.target.value),
                        }))
                        }
                    className="basicInputBox"
                />
            </label>

        

            <label>
                Original cost of site improvements for <strong>new</strong>{" "}
                solar projects <strong>up to and including the inverter</strong>, including:
                solar modules, racks, tracking, on-site battery storage systems, controls, interver ($):
                <input
                    type="number"
                    value={projectData.original_cost_pre_inverter}
                    onChange={(e) =>
                        setProjectData((prev) => ({
                        ...prev,
                        original_cost_pre_interface: parseFloat(e.target.value),
                        }))
                    }
                    className="basicInputBox"
                    />
            </label>


        <label>
            Original cost of site improvements for <strong>new</strong> solar project
            {" "}<strong>after the inverter</strong>, including: cables, substations, and other transmission
            and distribution infrastructure created by the solar project ($):
            <input
                type="number"
                value={projectData?.original_cost_post_inverter ?? 10000000}
                onChange={(e) =>
                    setProjectData((prev) => ({
                    ...prev,
                    original_cost_post_interface: parseFloat(e.target.value),
                    }))
            }
            className="basicInputBox"
            />
        </label>

        <label>
            Expected useful economic life of project (years):
            <input
                type="number"
                step="0.1"
                value={projectData?.expected_useful_life ?? 30}
                onChange={(e) =>
                    setProjectData((prev) => ({
                    ...prev,
                    expected_useful_life: parseFloat(e.target.value),
                    }))
            }
            className="basicInputBox"
            />
        </label>

        <label>
            Average annual inflation rate multiplier:
            <input
                type="number"
                step="0.01"
                value={projectData?.inflation_multiplier ?? 1.02}
                onChange={(e) =>
                    setProjectData((prev) => ({
                    ...prev,
                    inflation_multiplier: parseFloat(e.target.value),
                    }))
                }
            className="basicInputBox"
            />
        </label>

        <label>
            Annual discount rate (%):
            <input
                type="number"
                step="0.01"
                value={projectData?.annual_discount_rate ?? 0.03}
                onChange={(e) =>
                    setProjectData((prev) => ({
                    ...prev,
                    annual_discount_rate: parseFloat(e.target.value),
                    }))
            }
            className="basicInputBox"
            />
        </label>

        </section>

    )
}