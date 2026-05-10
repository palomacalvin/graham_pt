"use client";
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { ProjectData } from "@/types/IAWindProject";
import Link from "next/link";

import IASolarUserSelections from "../iowa-components/IASolarUserSelections";
import Instructions from "@/components/Instructions";
import { useEffect } from "react";
import TaxResults from "../iowa-components/IAWindTaxResults";
import { strict } from "assert";
import IAWindUserSelections from "../iowa-components/IAWindUserSelections";


export default function ProjectForm() {

  const [showResults, setShowResults] = useState(false);

  // Project data definitions.
  const [projectData, setProjectData] = useState<ProjectData>({
    county_name: "",
    school_district: "",

    land_area: 700,
    inflation_rate: 0.029,
    discount_rate: 0.03,
    nameplate_capacity: 100,
    expected_useful_life: 30,

    is_located_in_city: true,
    city_rural_classification: "",

    number_of_turbines: 50,
    is_project_tif: "",
    tif_percentage: 50.00,

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

          <h1>Illinois Wind Renewable Energy Tax Impacts Calculator</h1>

      </div>

      <Instructions state="Illinois" />


      <div className="spaced">
        <form>
          <IAWindUserSelections
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
    </div>
  );
}
