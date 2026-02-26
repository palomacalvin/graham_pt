"use client";

import React from "react";
import { ProjectData } from "@/types/MISolarProject";
import LocationSelector from "@/components/MISolarLocationSelector";

interface Props {
  projectData: ProjectData;
  setProjectData: React.Dispatch<React.SetStateAction<ProjectData>>;
}


export default function MIProjectLocationSection({
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
            ...prev,
            ...location,
          }));
        }}
      />


      {projectData && (
        <>

        </>
      )}
    </section>
  );
}
