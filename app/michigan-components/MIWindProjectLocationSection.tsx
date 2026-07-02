"use client";

import React from "react";
import { ProjectData } from "@/types/MIWindProject";
import LocationSelector from "@/components/MIWindLocationSelector";
import { useCallback } from "react";


interface Props {
  projectData: ProjectData | null;
  setProjectData: React.Dispatch<React.SetStateAction<ProjectData>>;
}

export default function MIWindProjectLocationSection({
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
    <section style={{ marginBottom: "0" }}>
      <h1 className="page-section-title">Project Location Information</h1>

        <LocationSelector
            stateName="MICHIGAN"
            onSelectLocation={(handleSelectLocation)}
        />


      {projectData && (
        <>
        </>
      )}
    </section>
  );
}
