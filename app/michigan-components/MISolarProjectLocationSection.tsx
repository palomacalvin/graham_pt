"use client";

import React from "react";
import { ProjectData } from "@/types/MISolarProject";
import LocationSelector from "@/components/MISolarLocationSelector";
import { useCallback } from "react";

interface Props {
  projectData: ProjectData;
  setProjectData: React.Dispatch<React.SetStateAction<ProjectData>>;
}


export default function MIProjectLocationSection({
  projectData,
  setProjectData,
}: Props) {

  const handleSelectLocation = useCallback((location: any) => {
    if (!location) return;

    setProjectData((prev) => ({
      ...prev,
      ...location,
    }));
  }, [setProjectData]);


  return (
    <section>
      <h1>Project Location Information</h1>

      <br />


      <LocationSelector
        stateName="MICHIGAN"
        onSelectLocation={handleSelectLocation}
      />


      {projectData && (
        <>
        </>
      )}
    </section>
  );
}
