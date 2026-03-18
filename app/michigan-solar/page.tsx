"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

import Navbar from "@/components/Navbar";
import { ProjectData } from "@/types/MISolarProject";
import MIProjectLocationSection from "@/app/michigan-components/MISolarProjectLocationSection";
import MISolarProjectDetailsSection from "../michigan-components/MISolarProjectDetails";
import MISolarRealPropertyCalculator from "../michigan-components/MISolarRealPropertyCalculator";
import MISolarTaxResults from "../michigan-components/MISolarTaxResults";

import Instructions from "@/components/Instructions";

export default function MichiganSolar() {
    const [projectData, setProjectData] = useState<ProjectData>({
    // Required fields.
    real_property_previously_covered: "yes",
    real_property_ownership_change: "no",
    post_solar_taxable_value: undefined,
    real_property_conditions: false,
    real_property_school_district_millages: 0,
    real_property_other_millages: 0,

    nameplate_capacity: 100,
    original_cost_pre_inverter: 90000000,
    original_cost_post_inverter: 10000000,
    expected_useful_life: 30,
    inflation_multiplier: 0.027,
    annual_discount_rate: 0.03,
    project_acreage: 0,
    auto_calculate_costs: true,

  });

  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    setShowResults(false);
  }, [projectData]);

  return (
    <div>
      <Navbar />

        <div style={{ margin: "3rem" }}>

        <h1>Michigan Solar Renewable Energy Tax Impacts Calculator</h1>

        </div>

        <Instructions state="Michigan" />

        <div style={{ margin: "3rem" }}>
            {/* Project Location Section */}
            <MIProjectLocationSection projectData={projectData} setProjectData={setProjectData}/>
        </div>

        <div style={{ margin: "3rem" }}>
          <MISolarProjectDetailsSection projectData={projectData} setProjectData={setProjectData} />
        </div>

        <div style={{ marginLeft: "3rem", marginTop: "3rem" }}>
          <MISolarRealPropertyCalculator projectData={projectData} setProjectData={setProjectData} />
        </div>

        <div style={{ marginLeft: "3rem" }}>
          <button
            type="button"
            onClick={() => setShowResults(true)}
            className="basicButton"
          >
            Calculate
          </button>
        </div>
      
        {showResults && (
          <div style={{ marginLeft: "3rem", marginRight: "3rem" }}>
          <MISolarTaxResults projectData={projectData} />
          </div>
        )}



    </div>
  );
}
