"use client";

import React, { useEffect } from "react";
import { ProjectData } from "@/types/MISolarProject";
import { useState } from "react";

interface Props {
  projectData: ProjectData;
  setProjectData: React.Dispatch<React.SetStateAction<ProjectData>>;
}

export default function MISolarRealPropertyCalculator ({
    projectData,
    setProjectData
}: Props) {

    const [hasManualPostSolarValue, setHasManualPostSolarValue] = useState(false);
    const [hasManualPreSolarValue, setHasManualPreSolarValue] = useState(false);

    const acreage =
        projectData.project_acreage > 0
            ? projectData.project_acreage
            : (projectData.nameplate_capacity ?? 0) * 7;

    const pre_solar_taxable_value = acreage * 4285.7;

    const DEFAULT_REAL_PROPERTY = {
        project_acreage: 0, // Triggers 7 acres per MW fallback
        real_property_previously_covered: "yes",
        real_property_ownership_change: "no",
        real_property_conditions: false,
        post_solar_taxable_value: undefined,
    };

    const handleResetDefaults = () => {
        setHasManualPostSolarValue(false); // reset manual override
        setHasManualPreSolarValue(false); // reset pre-solar override

        setProjectData((prev) => ({
            ...prev,
            ...DEFAULT_REAL_PROPERTY,
            post_solar_taxable_value: undefined, // go back to derived default
            pre_solar_taxable_value: undefined,
        }));
    };

    useEffect(() => {

        const default_value = acreage * 4285.7;
        const pre = projectData.pre_solar_taxable_value ?? default_value;
        const post = projectData.post_solar_taxable_value ?? default_value;

        const change = projectData.real_property_ownership_change === "yes"
            ? post - pre
            : 0;

        console.log("Taxable value change:", change);

        setProjectData((prev) => ({
            ...prev,
            real_property_taxable_value_change: change,
        }));
    }, [
        projectData.project_acreage,
        projectData.pre_solar_taxable_value,
        projectData.post_solar_taxable_value,
        projectData.real_property_ownership_change,
    ]);

  // Recalculate post-solar taxable value based on ownership change
  useEffect(() => {
    const defaultPre = acreage * 4285.7;

    const pre_solar = hasManualPreSolarValue
        ? projectData.pre_solar_taxable_value ?? defaultPre
        : defaultPre;

    const post_solar = hasManualPostSolarValue
        ? projectData.post_solar_taxable_value ?? pre_solar
        : projectData.real_property_ownership_change === "yes"
        ? pre_solar
        : undefined;

    const newly_subject_value =
        projectData.real_property_ownership_change === "yes"
            ? (post_solar ?? 0) - pre_solar
            : 0;

    setProjectData((prev) => ({
        ...prev,
        pre_solar_taxable_value: pre_solar,
        post_solar_taxable_value: post_solar,
        real_property_newly_subject_value: newly_subject_value,
    }));
}, [
    acreage,
    projectData.real_property_ownership_change,
    hasManualPreSolarValue,
    hasManualPostSolarValue,
]);

  // Handle changes to post-solar value
  const handlePostSolarValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    setHasManualPostSolarValue(true);
    setProjectData((prev) => ({
      ...prev,
      post_solar_taxable_value: isNaN(newValue) ? 0 : Math.round(newValue),
    }));
  };

  const handlePostSolarValueBlur = () => {
    // Reset the flag when the user stops editing the post-solar taxable value
    // setHasManualPostSolarValue(false);
  };

  const calculateMillages = (post_solar_value: number, pre_solar_value: number) => {
    let school_district_millages = 0;
    let other_millages = 0;

    if (projectData.real_property_ownership_change === "yes") {
      if (projectData.real_property_previously_covered === "yes") {
        school_district_millages = post_solar_value;
      } else {
        school_district_millages = post_solar_value - pre_solar_value;
      }
      other_millages = post_solar_value - pre_solar_value;
    } else {
      if (projectData.real_property_previously_covered === "yes") {
        school_district_millages = post_solar_value;
      } else {
        school_district_millages = 0;
      }
      other_millages = 0;
    }

        console.log("School District Millages:", school_district_millages);
    console.log("Other Millages:", other_millages);

    return { school_district_millages, other_millages };
  };

    
  
    //const post_solar_value = projectData.post_solar_taxable_value ?? pre_solar_taxable_value;

    const post_solar_value = hasManualPostSolarValue
        ? projectData.post_solar_taxable_value ?? pre_solar_taxable_value
        : projectData.real_property_ownership_change === "yes"
        ? pre_solar_taxable_value
        : undefined;
    const { school_district_millages, other_millages } = calculateMillages(post_solar_value ?? 0, pre_solar_taxable_value);


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

            {hasManualPreSolarValue && (
                <>
                    <br />
                    <p className="warning">
                        <img
                            src="/photos-logos/warning-alert.svg"
                            alt="Warning sign logo."
                            className="warningImg"
                        />
                        <span>
                            WARNING: The pre-solar taxable value is manually overridden. Click "Reset to Defaults" to restore
                            automatic calculation based on acreage.
                        </span>
                    </p>
                    <br />
                </>
            )}

            <label>
                <div className="inputWithInfo">
                Pre-Solar Taxable Value:
                <input
                    type="number"
                    step="1"
                    value={projectData.pre_solar_taxable_value ?? pre_solar_taxable_value}
                    onChange={(e) => {
                        const newValue = parseFloat(e.target.value);
                        setHasManualPreSolarValue(true);
                        setProjectData((prev) => ({
                            ...prev,
                            pre_solar_taxable_value: isNaN(newValue) ? 0 : Math.round(newValue),
                        }));
                    }}
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
                <div className="inputWithInfo">
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

                        <div className="infoWrapper">
                            <img src="/photos-logos/information-bubble.svg" alt="Vector graphic information bubble" className="adjustedInfoIcon"></img>
                            <div className="infoBubble">
                                This determines which PILT rate would apply to the project. 
                            </div>
                        </div>

                </fieldset>

            </div>

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

            {hasManualPostSolarValue && (
                <>
                <br></br>
                    <p className="warning">
                        <img
                            src="/photos-logos/warning-alert.svg"
                            alt="Warning sign logo."
                            className="warningImg"
                        />
                        <span>
                            WARNING: The post-solar taxable value is manually overridden. Click "Reset to Defaults" to restore
                            automatic calculation based on acreage and ownership change.
                        </span>
                    </p>
                <br></br>
                </>
            )}

            {projectData.real_property_ownership_change === "yes" && (
                <label>
                    Post-solar taxable value of the real property:
                    <div className="inputWithInfo">
                        <input
                            type="number"
                            step="1"
                            value={post_solar_value ?? pre_solar_taxable_value}
                            onChange={handlePostSolarValueChange}
                            onBlur={handlePostSolarValueBlur}
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