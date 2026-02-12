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

       <p style={{ margin: "3rem" }}>
        Fill in the fields below with values relevant to your project. Default values
        are available for each county, city/township, and school district; these values
        have been compiled from state-by-state research. See the{" "}
          <Link className="basicLinkText" href="references">
            References
          </Link>{" "}
          page for more details.
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
