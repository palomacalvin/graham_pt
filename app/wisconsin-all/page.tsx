"use client";
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { ProjectData } from "@/types/WIProject";
import Link from "next/link";

import WIUserSelections from "@/app/wisconsin-components/WIUserSelections";
import { County } from "@/components/WILocationSelector";
import WIResults from "@/app/wisconsin-components/WIResults";

export default function ProjectForm() {
  const [projectData, setProjectData] = useState<ProjectData>({
    county_name: "",
    project_type: "Solar",

    over_30_acres: 0,
    between_10_and_30_acres: 0,
    under_10_acres: 0,

    municipality: "",
    code: "",
    tvc: "",

    grade_1: 0,
    grade_2: 0,
    grade_3: 0,
    pasture: 0,

    gross_rate: 0,
    effective_rate: 0,
    total_property_tax: 0,
    school_tax: 0,
    college_tax: 0,
    county_tax: 0,
    local_tax: 0,
    other_tax: 0,

    selected_grade: 1,
    number_of_turbines: 70,

    land_area: 700,
    inflation_rate: 3.0,
    nameplate_capacity: 100,

  });

  const [userEditedLandValue, setUserEditedLandValue] = useState(false);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    setProjectData(prev => {
      let newData: any = { ...prev };

      if (type === "checkbox") {
        newData[name] = (e.target as HTMLInputElement).checked;
      } else if (type === "number") {
        newData[name] = Number(value);
      } else {
        newData[name] = value;
      }

      if (name === "previousPropertyClass") {
        if (value === "Agriculture") {
          newData.agriculturalType = newData.agriculturalType || "Homestead";
        } else {
          newData.agriculturalType = "Homestead";
        }
      }

      if (name === "newPropertyClass") {
        if (value === "Agriculture") {
          newData.newAgriculturalType = newData.newAgriculturalType || "Homestead";
        } else {
          newData.newAgriculturalType = "Homestead";
        }
      }

    return newData;
  });
};


  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      await fetch("/api/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(projectData) });
      alert("Project saved!");
    };

  return (
    <div>
      <Navbar />
      <p style={{ margin: "3rem" }}>
        Fill in the fields below with values relevant to your project. Default values
        are available for each county. These values 
        have been compiled from state-by-state research. See the <Link className="basicLinkText" href="references">References </Link>page for more details.
      </p>
      <div style={{ margin: "3rem" }}>
      <form onSubmit={handleSubmit}>
        {/* Project Selections / User Inputs */}
        <WIUserSelections
          projectData={projectData}
          handleChange={handleChange}
          setProjectData={setProjectData}
        />

        <WIResults projectData={projectData} />

      </form>
      </div>
    </div>
  );
}
