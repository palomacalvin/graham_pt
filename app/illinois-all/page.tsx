"use client";
import Link from "next/link";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import FooterComp from "@/components/Footer";

import { ProjectData } from "@/types/ILProject";
import ILUserSelections from "../illinois-components/ILUserSelections";
import Instructions from "@/components/Instructions";
import { generateNetAssessedValues } from "@/utils/ILCalculations";
import TaxResults from "../illinois-components/ILTaxResults";
import { createDefaultTaxUnits } from "../illinois-components/ILUserSelections";
import { TaxUnit } from "../illinois-components/ILTaxTable";
import { Analytics } from "@vercel/analytics/next";


export default function ProjectForm() {

  const [showResults, setShowResults] = useState(false);

  // Project data definitions.
  const [projectData, setProjectData] = useState<ProjectData>({
    county: "",
    project_type: "Solar",

    number_of_turbines: 50, // Update if project default assumptions change.
    land_area: 700, // Update if project default assumptions change. 
    inflation_rate: 0.029, // Update yearly.
    discount_rate: 0.03, // Update yearly/as needed.
    nameplate_capacity: 100, // Update if project default assumptions change.
    expected_useful_life: 30, // Update if project default assumptions change.

    per_mw_value_solar: 218000, // Update yearly.
    per_mw_value_wind: 360000, // Update yearly.
    wind_trending_factor: 1.61, // Update yearly.
    solar_trending_factor: 1.31, // Update yearly.
    county_avg_soil_productivity: 110, // Update yearly.

    unit1: 0.76473, // Update yearly.
    unit2: 0.33223, // Update yearly.
    unit3: 3.50119, // Update yearly.
    unit4: 1.42907, // Update yearly.
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

    unit1_name: "Adams", // Update if default county changes.
    unit2_name: "Clayton", // Update if default county/township changes.
    unit3_name: "Camp Point", // Update if default location changes.
    unit4_name: "Special units", // Update if needed.
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

  // Define the rows for output tables; update when the user changes tax unit inputs.
  const rows = React.useMemo(() => {

    // Choose the avg. soil productivity based on the location and target PI.
    const targetPI = Number(projectData.county_avg_soil_productivity);

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

    const baseCost = projectData.project_type === "Solar"
      ? projectData.per_mw_value_solar * projectData.nameplate_capacity
      : projectData.per_mw_value_wind * projectData.nameplate_capacity;

    const trending = projectData.project_type === "Solar"
      ? projectData.solar_trending_factor
      : projectData.wind_trending_factor;

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

      <div className="additional-header-spacing">
        <h1 className="page-main-title">Illinois Wind & Solar Renewable Energy Tax Impacts Calculator</h1>
      </div>

      <Instructions state="Illinois" />


      <div className="spaced" style={{marginTop: "0"}}>
        <form>
          <ILUserSelections
            projectData={projectData}
            handleChange={handleChange}
            setProjectData={setProjectData}
            taxUnits={taxUnits}
            setTaxUnits={setTaxUnits}
          /> 

          {/* 
            Uncomment the depreciation schedule code to show the depreciation schedule table,
            for testing/validation only.
          */}

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

      <FooterComp />
      <Analytics />
    </div>
  );
}
