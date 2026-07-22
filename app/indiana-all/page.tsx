"use client";
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { ProjectData } from "@/types/INProject";
import Link from "next/link";

import INUserSelections from "../indiana-components/INUserSelections";
import Instructions from "@/components/Instructions";
import { useEffect } from "react";
import TaxResults from "../indiana-components/INTaxResults";
import FooterComp from "@/components/Footer";
import { Analytics } from "@vercel/analytics/next";


export default function ProjectForm() {

  const [showResults, setShowResults] = useState(false);

  // Project data definitions.
  const [projectData, setProjectData] = useState<ProjectData>({
    county: "",
    project_type: "Solar",

    number_of_turbines: 50,
    land_area: 700,
    inflation_rate: 0.025,
    discount_rate: 0.03,
    nameplate_capacity: 100,
    expected_useful_life: 30,

    north_land_assessed_value: 13000,
    central_land_assessed_value: 14607,
    south_land_assessed_value: 7699

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

  let rows = [];

  return (
    <div>
      <Navbar />

      <div style={{marginLeft: "1.5rem", marginTop: "2rem"}}>
        <h1 className="page-main-title">Indiana Wind & Solar Renewable Energy Tax Impacts Calculator</h1>
      </div>

      <Instructions state="Indiana" />


      <div className="spaced" style={{marginTop: "0"}}>
        <form>
          <INUserSelections
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
            {/* {showResults && (
              <TaxResults 
                projectData={projectData} 
                rows={rows} 
              />
            )} */}
          </div>

        </form>
      </div>

      <FooterComp />
      <Analytics />
    </div>
  );
}
