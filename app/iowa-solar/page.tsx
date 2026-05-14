"use client";
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { IowaAgValueCounty, ProjectData } from "@/types/IASolarProject";
import Link from "next/link";

import IASolarUserSelections from "../iowa-components/IASolarUserSelections";
import Instructions from "@/components/Instructions";
import { useEffect } from "react";
import TaxResults from "../iowa-components/IASolarTaxResults";
import { strict } from "assert";
import { generateSolarTaxResults, agLandCalculations } from "@/utils/IACalculations";

import { AgCalculationVerificationTable } from "@/components/TempIADisplay";

export default function ProjectForm() {
  const [showResults, setShowResults] = useState(false);

  {/* TEMP */}

  // 1. State to hold the raw county records from the database
  const [dbCounties, setDbCounties] = useState<any[]>([]);
  const [dbCountyTaxData, setDbCountyTaxData] = useState<any[]>([]);
  const [dbCityData, setDbCityData] = useState<any[]>([]);

  // Project data definitions.
  const [projectData, setProjectData] = useState<ProjectData>({
    county_name: "Marshall",
    school_district: "MARSHALLTOWN",

    land_area: 700,
    inflation_rate: 0.025,
    discount_rate: 0.03,
    nameplate_capacity: 100,
    expected_useful_life: 30,

    is_located_in_city: false,
    city_rural_classification: "rural",
    use_avg_solar_capacity_factor: "yes",
    avg_solar_capacity_factor: 0,
    use_county_avg_csr2s: "yes",
    county_avg_csr2s: 0,

    proportion_electricity_sold_to_utility: 100,
    utility_service_area: "",
    all_transmission_infrastructure_utility_owned: "",
    num_miles_4_5_to_100: 0,
    num_miles_101_to_150: 0,
    num_miles_151_to_300: 0,
    more_than_300: 0,

    school_total_rate: 15.95910,

  });

  {/* TEMP */}
  useEffect(() => {
    fetch("/api/iowa/ag_land_value_data")
      .then((res) => res.json())
      .then((data) => setDbCounties(data.agLands || []))
      .catch((err) => console.error("Error loading verification data:", err));

      // Fetching county, city, school district tax rates.
    fetch("/api/iowa/county_tax_data")
      .then((res) => res.json())
      .then((data) => {
        console.log("County Data Loaded:", data.counties?.length);
        setDbCountyTaxData(data.counties || []);
    });


    fetch("/api/iowa/city_data")
      .then((res) => res.json())
      .then((data) => {
        console.log("City Data Loaded:", data.cities?.length);
        setDbCityData(data.cities || []);
      });
  }, []);

  const calculatedRows = generateSolarTaxResults({
    projectData,
    dbCounties,
    dbCountyTaxData,
    dbCityData,
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

          <h1>Iowa Solar Renewable Energy Tax Impacts Calculator</h1>

      </div>

      <Instructions state="Iowa" />


      <div className="spaced">
        <form>
          <IASolarUserSelections
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
              <TaxResults 
                projectData={projectData} 
                dbCounties={dbCounties}
                dbCountyTaxData={dbCountyTaxData}
                dbCityData={dbCityData}
              />
            )}
          </div>

          {/* {dbCounties.length > 0 && (
        <AgCalculationVerificationTable 
          dbCounties={dbCounties} 
          projectData={projectData} 
        />
              )} */}

        </form>
      </div>
    </div>
  );
}
