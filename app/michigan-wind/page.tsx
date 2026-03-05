"use client";

import React, { useState } from "react";
import Link from "next/link";

import Navbar from "@/components/Navbar";
import { ProjectData } from "@/types/MIWindProject";
import MIProjectLocationSection from "@/app/michigan-components/MIWindProjectLocationSection";
import MIWindProjectDetailsSection from "../michigan-components/MIWindProjectDetails";
import MIWindTaxResults from "../michigan-components/MIWindTaxResults";

export default function MichiganWind() {
  const [projectData, setProjectData] = useState<ProjectData>({
    real_property_ownership_change: "no",
    
    pre_wind_taxable_value: undefined,
    post_wind_taxable_value: undefined,
    change_in_real_property_taxable_value: 0,
  
    nameplate_capacity: 100,
    original_cost_pre_interface: 90000000,
    original_cost_post_interface: 10000000,
    expected_useful_life: 30,
    inflation_multiplier: 0.027,
    annual_discount_rate: 0.03,
    project_acreage: 40,
    auto_calculate_costs: true,

    number_1_5_turbines: 8,
    number_1_65_turbines: 8,
    number_2_2_turbines: 8,
    number_2_5_turbines: 8,
    number_2_turbines: 8,

    auto_calculate_acreage: true,
  });

  return (
    <div>
      <Navbar />

      <div style={{ margin: "3rem" }}>

        <h1>Michigan Wind Renewable Energy Tax Impacts Calculator</h1>

      </div>

      <div className="basicBox">
          <p>
            Fill in the fields below with values relevant to your project. Default values
            are available for each county, city/township, and school district; these values
            have been compiled from state-by-state research. See the{" "}
              <Link className="boxLinkText" href="references">
                References
              </Link>{" "}
              page for more details.

            Hover over the information icons next to each field to learn more about individual inputs.
          </p>

          <p style={{ marginTop: "1rem" }}>
            Please contact Vamika Jain at vamikaj@umich.edu for any questions or feedback.
          </p>

          <br></br>

          <a
            className="inPageButton basicLinkText"
            href="/michigan/Michigan-Property-Tax-Final-2025.pdf"
            download="Michigan-Policy-Brief.pdf"
          >
            Click to download the policy brief
          </a>
      </div>

      <div style={{ margin: "3rem" }}>
          {/* Project Location Section */}
          <MIProjectLocationSection projectData={projectData} setProjectData={setProjectData}/>
      </div>

      <div style={{ margin: "3rem" }}>
        <MIWindProjectDetailsSection projectData={projectData} setProjectData={setProjectData} />
      </div>

      {/* <div style={{ margin: "3rem" }}>
        <MIWindRealPropertyCalculator projectData={projectData} setProjectData={setProjectData} />
      </div> */}

      <div style={{ margin: "3rem" }}>
        <MIWindTaxResults projectData={projectData}/>
      </div>
    </div>
  );
}
