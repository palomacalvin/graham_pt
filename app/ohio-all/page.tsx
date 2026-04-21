"use client";
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { ProjectData } from "@/types/OHProject";
import Link from "next/link";
import OHTaxResults from "../ohio-components/OHTaxResults";

import OHUserSelections from "../ohio-components/OHUserSelections";
import Instructions from "@/components/Instructions";
import { useEffect } from "react";



export default function ProjectForm() {

  const [showResults, setShowResults] = useState(false);

  // Project data definitions.
  const [projectData, setProjectData] = useState<ProjectData>({
    county: "",
    project_type: "Solar",

    number_of_turbines: 50,
    land_area: 700,
    inflation_rate: 0.029,
    discount_rate: 0.03,
    nameplate_capacity: 100,
    expected_useful_life: 30,
    uses_assumed_personal_property_valuation: "",
    user_specified_personal_property_valuation: 0,
    is_project_status_qep: "",
    user_specified_project_status: "", 
    pct_employed_construction_workers: "less_than_50", 
    county_name: "", 
    taxing_district: "",
    assumed_personal_property_valuation: 1000000, 
    calculated_valuation: 0,
    avg_land_market_value: 0,
    cauv_100_percent_valuation_total_acres: 0,
    jurisdictions: [],
    use_county_avg: "",
  });


  // Handle input changes.
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

    return newData;
  });
};


  // Handles showing/hiding results table based on user input changes.
  useEffect(() => {
    setShowResults(false);
  }, [projectData]);

  return (
    <div>
      <Navbar />

      <div className="spaced">

          <h1>Ohio Wind & Solar Renewable Energy Tax Impacts Calculator</h1>

      </div>

      <Instructions state="Ohio" />


      <div className="spaced">
        <form>
          <OHUserSelections
            projectData={projectData}
            handleChange={handleChange}
            setProjectData={setProjectData}
          /> 

          <br></br>
          <button
            type="button"
            onClick={() => setShowResults(true)}
            className="basicButton"
          >
            Calculate
          </button>

          <div>
            {showResults && (
              <OHTaxResults 
                projectData={projectData} 
              />
            )}
          </div>

        </form>
      </div>
    </div>
  );
}
