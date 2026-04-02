"use client";
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { ProjectData } from "@/types/ILProject";
import Link from "next/link";

import ILUserSelections from "../illinois-components/ILUserSelections";
import Instructions from "@/components/Instructions";
import { useEffect } from "react";
import { generateNetAssessedValues } from "@/utils/ILCalculations";
import TaxResults from "../illinois-components/ILTaxResults";
import { createDefaultTaxUnits } from "../illinois-components/ILUserSelections";
import { TaxUnit } from "../illinois-components/ILTaxTable";


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

    per_mw_value_solar: 218000,
    per_mw_value_wind: 360000,
    wind_trending_factor: 1.61,
    solar_trending_factor: 1.31,
    county_avg_soil_productivity: 110,

    unit1: 0.76473,
    unit2: 0.33223,
    unit3: 3.50119,
    unit4: 1.42907,
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
    unit4_name: "Special units",
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

  // Get the certified values from the database.
  const [certifiedValues, setCertifiedValues] = useState<any[]>([]);
  useEffect(() => {
    fetch("/api/illinois/certified_values")
      .then((res) => res.json())
      .then((data) => {
        setCertifiedValues(data.counties || []); 
      })
      .catch((err) => console.error("Failed to fetch values", err));
  }, []);

  // Define the rows for output tables; update when the user changes
  // tax unit inputs.
  const rows = React.useMemo(() => {

    // Choose the avg. soil productivity based on the location and target PI.
    const targetPI = Number(projectData.county_avg_soil_productivity);

    // DEBUG.
    if (certifiedValues.length > 0) {
      console.log("API Data Sample:", certifiedValues[0]);
      console.log("Looking for PI:", targetPI);
    }

    // Get the certified value based on the target PI.
    const lookupRow = certifiedValues.find(
      (v) => Number(v.average_management_pi) === targetPI
    );

    // Compute the EAV based on the certified value.
    const dollarEAV = lookupRow ? Number(lookupRow.certified_value) : targetPI;

    // Compute the base cost and trending factor.
    const baseCost =
      projectData.project_type === "Solar"
        ? projectData.per_mw_value_solar * projectData.nameplate_capacity
        : projectData.per_mw_value_wind * projectData.nameplate_capacity;

    const baseTrendingFactor =
      projectData.project_type === "Solar"
        ? projectData.solar_trending_factor
        : projectData.wind_trending_factor;

    const trending = baseTrendingFactor > 0 ? baseTrendingFactor : 1;

    // Generate the net assessed values table.
    return generateNetAssessedValues(
      projectData.project_type as "Solar" | "Wind",
      baseCost,
      new Date().getFullYear(),
      projectData.expected_useful_life ?? 30,
      trending,
      dollarEAV,
      projectData.inflation_rate ?? 0.029,
      projectData.land_area ?? 0,
    );
  }, [
    projectData,
    certifiedValues,
  ]);

  // Handles showing/hiding results table based on user input changes.
  useEffect(() => {
    setShowResults(false);
  }, [projectData]);

  return (
    <div>
      <Navbar />

      <div className="spaced">

          <h1>Illinois Wind & Solar Renewable Energy Tax Impacts Calculator</h1>

      </div>

      <Instructions state="Illinois" />


      <div className="spaced">
        <form>
          <ILUserSelections
            projectData={projectData}
            handleChange={handleChange}
            setProjectData={setProjectData}
            taxUnits={taxUnits}
            setTaxUnits={setTaxUnits}
          /> 

          {/* <div style={{ margin: "3rem" }}>
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
        </div> */}

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
              <TaxResults 
                projectData={projectData} 
                rows={rows} 
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
