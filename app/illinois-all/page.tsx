"use client";
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { ProjectData } from "@/types/ILProject";
import Link from "next/link";

import ILUserSelections from "../illinois-components/ILUserSelections";
import WIResults from "@/app/wisconsin-components/WIResults";
import Instructions from "@/components/Instructions";
import { useEffect } from "react";
import { generateNetAssessedValues } from "@/utils/ILCalculations";


export default function ProjectForm() {

  const [showResults, setShowResults] = useState(false);

  const [projectData, setProjectData] = useState<ProjectData>({
    county: "",
    project_type: "Solar",

    number_of_turbines: 50,
    land_area: 700,
    inflation_rate: 0.029,
    discount_rate: 0.03,
    nameplate_capacity: 100,
    expected_useful_life: 30,

    per_mw_value_solar: 0,
    per_mw_value_wind: 0,
    wind_trending_factor: 0,
    solar_trending_factor: 0,
    county_avg_soil_productivity: 0,

    unit1: 0.76473,
    unit2: 0.33223,
    unit3: 3.50119,
    unit4: 1.43,
    unit5: 0,
    unit6: 0,
    unit7: 0,
    unit8: 0,
    unit9: 0,
    unit10: 0,
    unit11: 0,
    unit12: 0,
    unit13: 0,
    unit14: 0,
    unit15: 0,

    unit1_name: "Adams",
    unit2_name: "Clayton",
    unit3_name: "Camp Point",
    unit4_name: "",
    unit5_name: "",
    unit6_name: "",
    unit7_name: "",
    unit8_name: "",
    unit9_name: "",
    unit10_name: "",
    unit11_name: "",
    unit12_name: "",
    unit13_name: "",
    unit14_name: "",
    unit15_name: "",

    unit1_label: "County",
    unit2_label: "Township",
    unit3_label: "School District",
    unit4_label: "All other special units",
    unit5_label: "",
    unit6_label: "",
    unit7_label: "",
    unit8_label: "",
    unit9_label: "",
    unit10_label: "",
    unit11_label: "",
    unit12_label: "",
    unit13_label: "",
    unit14_label: "",
    unit15_label: "",
  });

  const [userEditedLandValue, setUserEditedLandValue] = useState(false);

  // Handle input changes
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

  const rows = generateNetAssessedValues(
    21800000, // Base cost
    projectData.inflation_rate,
    2026,
    projectData.expected_useful_life
  );


  useEffect(() => {
    setShowResults(false);
  }, [projectData]);

  return (
    <div>
      <Navbar />

      <div style={{ margin: "3rem" }}>

          <h1>Illinois Wind & Solar Renewable Energy Tax Impacts Calculator</h1>

      </div>

      <Instructions state="Illinois" />


      <div style={{ margin: "3rem" }}>
        <form>
          <ILUserSelections
            projectData={projectData}
            handleChange={handleChange}
            setProjectData={setProjectData}
          /> 

          {/* <button
              type="button"
              onClick={() => setShowResults(true)}
              className="basicButton"
            >
              Calculate
          </button> */}

          {/* {showResults && (
            <WIResults projectData={projectData} />
          )} */}

          <div style={{ margin: "3rem" }}>
  <h2>Depreciation Schedule</h2>

  <table className="basicTable">
    <thead>
      <tr>
        <th>Year</th>
        <th>Age</th>
        <th>Dep Factor</th>
        <th>Trend Factor</th>
        <th>Trended Cost</th>
        <th>Depreciation</th>
        <th>FCV</th>
        <th>Assessed Value</th>
      </tr>
    </thead>
    <tbody>
      {rows.map((row) => (
        <tr key={row.year}>
          <td>{row.year}</td>
          <td>{row.age}</td>
          <td>{row.depreciationFactor.toFixed(3)}</td>
          <td>{row.trendingFactor.toFixed(2)}</td>
          <td>${row.trendedCost.toLocaleString()}</td>
          <td>${row.depreciation.toLocaleString()}</td>
          <td>${row.fcv.toLocaleString()}</td>
          <td>${row.assessedValue.toLocaleString()}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

        </form>
      </div>
      </div>
  );
}
