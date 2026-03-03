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
    const acreage =
            projectData.project_acreage > 0
                ? projectData.project_acreage
                : (projectData.nameplate_capacity ?? 0) * 7;
    
        const pre_wind_taxable_value = acreage * 4285.7;
    
        const post_solar_value =
            projectData.real_property_ownership_change === "yes"
            ? projectData.post_solar_taxable_value ?? pre_solar_taxable_value
            : pre_solar_taxable_value;
    
        useEffect(() => {
            // Compute acreage and taxable values inside the effect
            const acreage =
                projectData.project_acreage > 0
                    ? projectData.project_acreage
                    : (projectData.nameplate_capacity ?? 0) * 7;
    
            const pre_solar_taxable_value = acreage * 4285.7;
    
            const post_solar_value =
                projectData.real_property_ownership_change === "yes"
                    ? projectData.post_solar_taxable_value ?? pre_solar_taxable_value
                    : pre_solar_taxable_value;
    
            // Convert yes/no strings to booleans
            const was_previously_covered = projectData.real_property_previously_covered === "yes";
            const ownership_changed = projectData.real_property_ownership_change === "yes";
    
            // Calculate millages
            const school_district_millages = was_previously_covered && ownership_changed
                ? post_solar_value
                : was_previously_covered && !ownership_changed
                ? post_solar_value
                : !was_previously_covered && ownership_changed
                ? post_solar_value - pre_solar_taxable_value
                : 0;
    
            const other_millages = was_previously_covered && ownership_changed
                ? post_solar_value - pre_solar_taxable_value
                : was_previously_covered && !ownership_changed
                ? 0
                : !was_previously_covered && ownership_changed
                ? post_solar_value - pre_solar_taxable_value
                : 0;
    
            // Log everything
            console.log("=== Real Property Calculation ===");
            console.log("Project acreage:", acreage);
            console.log("Pre-solar taxable value:", pre_solar_taxable_value);
            console.log("Post-solar taxable value:", post_solar_value);
            console.log("Previously covered:", was_previously_covered);
            console.log("Ownership changed:", ownership_changed);
            console.log("School District Millages:", school_district_millages);
            console.log("Other Millages:", other_millages);
    
            // Update project data state
            setProjectData((prev) => ({
                ...prev,
                pre_solar_taxable_value,
                post_solar_taxable_value: post_solar_value,
                real_property_school_district_millages: school_district_millages,
                real_property_other_millages: other_millages,
            }));
        }, [
            projectData.project_acreage,
            projectData.real_property_previously_covered,
            projectData.real_property_ownership_change,
            projectData.post_solar_taxable_value,
        ]);
        
    
        return (
            <section>
                <h1>Real Property Calculation Details</h1>
    
                <br />
    
                <p style={{ color: "red", fontStyle: "italic"}}>
                    All fields in this section are required. You may choose to
                    use the defaults listed below, or override them with values relevant to
                    your project.
                </p>
    
                <br></br>
    
                <label>
                    <div className="inputWithInfo">
                    Project acreage:
                    <input
                        type="number"
                        value={acreage}
                        onChange={(e) =>
                            setProjectData((prev) => ({
                            ...prev!,
                            project_acreage: parseFloat(e.target.value),
                            }))
                        }
                        className="basicInputBox"
                    />
    
                        <div className="infoWrapper">
                            <img src="/photos-logos/information-bubble.svg" alt="Vector graphic information bubble"></img>
                            <div className="infoBubble">
                                We assume a land acreage of 7 acres per mega-watt.
                            </div>
                        </div>
                    </div>
                </label>
    
                <label>
                    <div className="inputWithInfo">
                    Pre-Solar Taxable Value:
                    <input
                        type="number"
                        value={pre_solar_taxable_value}
                        readOnly
                        onChange={(e) =>
                        setProjectData((prev) => ({
                            ...prev!,
                            pre_solar_taxable_value: parseFloat(e.target.value),
                        }))
                        }
                        className="basicInputBox"
                    />
                    
    
                        <div className="infoWrapper">
                            <img src="/photos-logos/information-bubble.svg" alt="Vector graphic information bubble"></img>
                            <div className="infoBubble">
                                Note that the taxable value of land in Michigan is typically an adjusted assessed value
                                set by the government and is less than the true market value. We assume a 
                                hypothetical $4,285.70 / acre.
                            </div>
                        </div>
                    </div>
                </label>
    
    
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
                                In most cases, but not always, the answer to this question will be "No"
                                because the land under solar projects is typically leased.
                            </div>
                        </div>
                    </div>
                </label>
    
                <br></br>
    
                {projectData.real_property_ownership_change === "yes" && (
                    <label>
                        Post-solar taxable value of the real property:
                        <div className="inputWithInfo">
                            <input
                                type="number"
                                value={projectData.post_solar_taxable_value ?? pre_solar_taxable_value}
                                onChange={(e) =>
                                setProjectData((prev) => ({
                                    ...prev!,
                                    post_solar_taxable_value: parseFloat(e.target.value),
                                }))
                                }
                                className="basicInputBox"
                            />
                            <div className="infoWrapper">
                                <img src="/photos-logos/information-bubble.svg" alt="Vector graphic information bubble"></img>
                                <div className="infoBubble">
                                Note: If the real property changed ownership as a result of the solar project
                                (i.e., the developer purchased the underlying land instead of leasing it),
                                the taxable value will be "uncapped" to equal the state equalized value (SEV),
                                which is set at 50% of true cash value.
                                </div>
                            </div>
                        </div>
                    </label>
                )}
    
    
                {/* <label>
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
                </label> */}
    
                </section>
    
            </section>
        )
        
    }