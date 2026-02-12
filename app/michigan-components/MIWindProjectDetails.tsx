"use client";

import React from "react";
import { ProjectData } from "../../types/MIWindProject";

interface Props {
  projectData: ProjectData | null;
  setProjectData: React.Dispatch<React.SetStateAction<ProjectData | null>>;
}

export default function MIWindProjectDetailsSection({
  projectData,
  setProjectData,
}: Props) {
  return (
    <section>
      <h1>Project Details</h1>

      <label>
        Original cost of site improvements for <strong>new</strong> wind project{" "}
        <strong>up to and including the power interface (converters)</strong>, including:
        rotor, drive train, tower, controls, foundation, and all land improvements like roads,
        fences, and communication facilities. ($):
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
      </label>

      <label>
        Original cost of site improvements for <strong>new</strong> wind project{" "}
        <strong>after the power interface</strong>, including cables, substations, and other
        transmission and distribution infrastructure created by the wind project. ($):
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
      </label>

      <label>
        Expected useful economic life of project (years):
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
      </label>

      <label>
        Average annual inflation rate multiplier:
        <input
          type="number"
          step="0.01"
          value={projectData?.inflation_multiplier ?? 1.02}
          onChange={(e) =>
            setProjectData((prev) => ({
              ...prev!,
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
          value={projectData?.annual_discount_rate ?? 3.0}
          onChange={(e) =>
            setProjectData((prev) => ({
              ...prev!,
              annual_discount_rate: parseFloat(e.target.value),
            }))
          }
          className="basicInputBox"
        />
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
