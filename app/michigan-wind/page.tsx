"use client";

import React, { useState } from "react";
import Link from "next/link";

import Navbar from "@/components/Navbar";
import { ProjectData } from "@/types/MIWindProject";
import MIProjectLocationSection from "@/app/michigan-components/MIWindProjectLocationSection";
import MIWindProjectDetailsSection from "../michigan-components/MIWindProjectDetails";

export default function MichiganWind() {
  const [projectData, setProjectData] = useState<ProjectData | null>(null);

  return (
    <div>
      <Navbar />

      <div style={{ margin: "3rem" }}>

        <h1>Michigan Wind Renewable Energy Tax Impacts Calculator</h1>

      </div>

      <p className="basicBox">
        Fill in the fields below with values relevant to your project. Default values
        are available for each county, city/township, and school district; these values
        have been compiled from state-by-state research. See the{" "}
          <Link className="boxLinkText" href="references">
            References
          </Link>{" "}
          page for more details.

        Hover over the information icons next to each field to learn more about individual inputs.
      </p>

      <div style={{ margin: "3rem" }}>
          {/* Project Location Section */}
          <MIProjectLocationSection projectData={projectData} setProjectData={setProjectData}/>
      </div>

      <div style={{ margin: "3rem" }}>
        <MIWindProjectDetailsSection projectData={projectData} setProjectData={setProjectData} />
      </div>
    </div>
  );
}
