"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

import Navbar from "@/components/Navbar";
import { ProjectData } from "@/types/MIWindProject";
import MIProjectLocationSection from "@/app/michigan-components/MIWindProjectLocationSection";
import MIWindProjectDetailsSection from "../michigan-components/MIWindProjectDetails";
import MIWindTaxResults from "../michigan-components/MIWindTaxResults";

import Instructions from "@/components/Instructions";

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

  const [showResults, setShowResults] = useState(false);
  
  useEffect(() => {
    setShowResults(false);
  }, [projectData]);

  return (
    <div>
      <Navbar />

      <div style={{ margin: "3rem" }}>

        <h1>Michigan Wind Renewable Energy Tax Impacts Calculator</h1>

      </div>

      <Instructions state="Michigan" />

      <div style={{ margin: "3rem" }}>
          {/* Project Location Section */}
          <MIProjectLocationSection projectData={projectData} setProjectData={setProjectData}/>
      </div>

      <div style={{ marginLeft: "3rem", marginTop: "3rem" }}>
        <MIWindProjectDetailsSection projectData={projectData} setProjectData={setProjectData} />
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
          <MIWindTaxResults projectData={projectData}/>
        </div>
      )}
    </div>
  );
}
