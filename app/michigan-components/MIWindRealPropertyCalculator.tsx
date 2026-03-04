"use client";

import React, { useEffect } from "react";
import { ProjectData } from "@/types/MIWindProject";

interface Props {
  projectData: ProjectData;
  setProjectData: React.Dispatch<React.SetStateAction<ProjectData>>;
}

export default function MIWindRealPropertyCalculator ({
    projectData,
    setProjectData

}: Props) {

    return (
        <section>
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

            <br></br>
        </section>
    )
    
}