"use client";

import React, { useState } from "react";
import Link from "next/link";

import Navbar from "@/components/Navbar";
import { ProjectData } from "@/types/MISolarProject";
import MIProjectLocationSection from "@/app/michigan-components/MISolarProjectLocationSection";
import MISolarProjectDetailsSection from "../michigan-components/MISolarProjectDetails";
import MISolarRealPropertyCalculator from "../michigan-components/MISolarRealPropertyCalculator";
import MISolarTaxResults from "../michigan-components/MISolarTaxResults";

export default function MichiganSolar() {
    const [projectData, setProjectData] = useState<ProjectData>({
    // Required fields.
    real_property_previously_covered: "Yes",
    real_property_ownership_change: "No",
    pre_solar_taxable_value: 3000000,
    post_solar_taxable_value: 3000000,
    real_property_conditions: "No",
    real_property_school_district_millages: 3000000,
    real_property_other_millages: 0,

    nameplate_capacity: 100,
    original_cost_pre_inverter: 90000000,
    original_cost_post_inverter: 10000000,
    expected_useful_life: 30,
    inflation_multiplier: 1.02,
    annual_discount_rate: 0.03,
  });

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
        <MISolarProjectDetailsSection projectData={projectData} setProjectData={setProjectData} />
      </div>

      <div style={{ margin: "3rem" }}>
        <MISolarRealPropertyCalculator projectData={projectData} setProjectData={setProjectData} />
      </div>

      <div style={{ margin: "3rem" }}>
        <MISolarTaxResults projectData={projectData} />
      </div>


    </div>
  );
}
