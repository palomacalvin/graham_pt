"use client";

import React from "react";
import { ProjectData } from "@/types/MIWindProject";
import { LocationSelector } from "../../components/MIWindLocationSelector";

interface Props {
  projectData: ProjectData | null;
  setProjectData: React.Dispatch<React.SetStateAction<ProjectData | null>>;
}

export default function MIWindProjectLocationSection({
  projectData,
  setProjectData,
}: Props) {
  return (
    <section>
      <h1>Project Location Information</h1>

      <br />

        <LocationSelector
            stateName="MICHIGAN"
            onSelectLocation={(location) => {
                if (!location) return;

                setProjectData((prev) => ({
                ...prev!,
                ...location,
                }));
            }}
        />


      {projectData && (
        <>
          <br />

          {/* <div>
            <strong>Selected Location:</strong>
            <br></br>
            <br></br>
            <ul>
              <li>County: {projectData.county_name}</li>
              <li>Local Unit: {projectData.local_unit_name}</li>
              <li>
                Type: {projectData.city ? "City" : "Township"}
              </li>
              <li>School District: {projectData.school_name}</li>
            </ul>
          </div> */}
        </>
      )}
    </section>
  );
}
