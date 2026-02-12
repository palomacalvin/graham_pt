"use client";

import React from "react";
import { ProjectData } from "@/types/MIWindProject";

interface Props {
  projectData: ProjectData;
  setProjectData: React.Dispatch<React.SetStateAction<ProjectData>>;
}


export default function MISolarRealPropertyCalculator ({
    projectData,
    setProjectData

}: Props) {
    return (
        <section>
            <h1>Project Details</h1>

            <br />

            <label>
                Did the real property change ownership as a result of the wind project?
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
            </label>
        

            <label>
                Pre-wind taxable value of the real property:
                <input
                    type="number"
                    value={projectData.pre_wind_taxable_value ?? 2000000}
                    onChange={(e) =>
                    setProjectData((prev) => ({
                        ...prev!,
                        pre_wind_taxable_value: parseFloat(e.target.value),
                    }))
                    }
                    className="basicInputBox"
                />
            </label>

            <label>
                Post-wind taxable value of the real property:
                <input
                    type="number"
                    value={projectData.post_wind_taxable_value ?? 2000000}
                    onChange={(e) =>
                    setProjectData((prev) => ({
                        ...prev!,
                        post_wind_taxable_value: parseFloat(e.target.value),
                    }))
                    }
                    className="basicInputBox"
                />
            </label>

            <br></br>

            <label>
                Change in real property's taxable value:
                <input
                    type="number"
                    value={projectData.change_in_real_property_taxable_value}
                    readOnly
                    className="basicInputBox"
                />
            </label>

        </section>
    )
}