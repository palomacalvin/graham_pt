"use client";

import React from "react";
import { ProjectData } from "@/types/MISolarProject";

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
            <h1>Real Property Calculation Details</h1>

            <br />

            <label>
                Was the real property previously covered by a principal
                residence or agricultural exemption?:
                <div>
                    <select
                        value={projectData.real_property_previously_covered}
                        onChange={(e) => {
                            setProjectData((prev) => ({
                                ...prev,
                                real_property_previously_covered: e.target.value,
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
                Did the real property change ownership as a result of the solar project?
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
                Pre-solar taxable value of the real property:
                <input
                    type="number"
                    value={projectData.pre_solar_taxable_value ?? 3000000}
                    onChange={(e) =>
                    setProjectData((prev) => ({
                        ...prev!,
                        pre_solar_taxable_value: parseFloat(e.target.value),
                    }))
                    }
                    className="basicInputBox"
                />
            </label>

            <br></br>


            <section className="basicFormList">
                <fieldset>
                    <legend>
                        Is any of the following true about the real property?
                    </legend>
                    
                    <br></br>

                    <ol>
                        <li>
                            It either is currently owned by the state or was sold by the state
                            immediately prior to the installation of the solar project.
                        </li>
                        <li>
                            It is located in a U.S. Treasury Department-designated opportunity zone.
                        </li>
                        <li>
                            It was used or is currently used for commercial or industrial purposes,
                            such that it qualifies as a "brownfield" property.
                        </li>
                        <li>
                            Improved real property used for another purpose if the qualified
                            facility is attached to the improvement.
                        </li>
                    </ol>

                    <select
                        value={
                            projectData.real_property_conditions === true
                                ? "yes"
                                : projectData.real_property_conditions === false
                                ? "no"
                                : ""
                        }
                        onChange={(e) =>
                            setProjectData((prev) => ({
                                ...prev,
                                real_property_conditions:
                                    e.target.value === "yes"
                                        ? true
                                        : e.target.value === "no"
                                        ? false
                                        : undefined,
                            }))
                        }
                        className="basicDropdown"
                    >
                        <option value="">-- Choose Option --</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>

                </fieldset>
            </section>

            <br></br>

            <label>
                Real property's taxable value newly subject to the local school district's
                operating millage as a result of the solar project:
                <input
                    type="number"
                    value={projectData.real_property_school_district_millages}
                    readOnly
                    className="basicInputBox"
                />
            </label>

            <br></br>

            <label>
                Real property's taxable value newly subject to other millages as a result
                of the solar project:
                <input
                    type="number"
                    value={projectData.real_property_other_millages}
                    readOnly
                    className="basicInputBox"
                />
            </label>

        </section>
    )
}