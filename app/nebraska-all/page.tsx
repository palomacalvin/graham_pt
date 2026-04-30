"use client";
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { ProjectData } from "@/types/NEProject";
import Link from "next/link";
import NETaxResults from "../nebraska-components/NETaxResults";

import NEUserSelections from "../nebraska-components/NEUserSelections";
import Instructions from "@/components/Instructions";
import { useEffect } from "react";
import { TaxUnit } from "../nebraska-components/NETaxTable";
import { createDefaultTaxUnits } from "../nebraska-components/NEUserSelections";



export default function ProjectForm() {

  const [showResults, setShowResults] = useState(false);

  // Project data definitions.
  const [projectData, setProjectData] = useState<ProjectData>({
    county: "",
    region: "",
    project_type: "Solar",

    number_of_turbines: 50,
    land_area: 700,
    inflation_rate: 0.03,
    discount_rate: 0.03,
    nameplate_capacity: 100,
    expected_useful_life: 30,
    county_name: "", 
    avg_land_market_value: 0,
    project_start_month: "",
    project_start_day: 0,
    market_value_source: "",
    manual_market_value: 0,
    is_public_power: "",
    pilot_value: 0,
    is_using_avg: "",

  });

  // Sets the defaults for the tax unit table which users may manually edit.
  const [taxUnits, setTaxUnits] = useState<TaxUnit[]>(createDefaultTaxUnits());


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

          <h1>Nebraska Wind & Solar Renewable Energy Tax Impacts Calculator</h1>

      </div>

      <Instructions state="Ohio" />


      <div className="spaced">
        <form>
          <NEUserSelections
            projectData={projectData}
            handleChange={handleChange}
            setProjectData={setProjectData}
            taxUnits={taxUnits}
            setTaxUnits={setTaxUnits}
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
              <NETaxResults 
                projectData={projectData} 
                taxUnits={taxUnits}
                setTaxUnits={setTaxUnits}
              />
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
