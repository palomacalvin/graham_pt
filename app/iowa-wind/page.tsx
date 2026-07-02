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

  // State to hold the raw county and city records from the database.
  const [dbCounties, setDbCounties] = useState<any[]>([]);
  const [dbCountyTaxData, setDbCountyTaxData] = useState<any[]>([]);
  const [dbCityData, setDbCityData] = useState<any[]>([]);
  

  // Project data definitions.
  const [projectData, setProjectData] = useState<ProjectData>({
    county_name: "Marshall",
    city_name: "MARSHALLTOWN",
    school_district: "MARSHALLTOWN",

    land_area: 700,
    inflation_rate: 0.025,
    discount_rate: 0.03,
    nameplate_capacity: 100,
    expected_useful_life: 30,

    is_located_in_city: false,
    city_rural_classification: "rural",

    school_total_rate: 15.95910,

    number_of_turbines: 50,
    is_project_tif: "",
    tif_percentage: 50.00,

    use_estimated_wind_net_acquisition_cost: "yes", 
    wind_net_acquisition_cost: 0,

  });

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

      <div style={{marginLeft: "1.5rem", marginTop: "2rem"}}>
          <h1 className="page-main-title">Iowa Wind Renewable Energy Tax Impacts Calculator</h1>
      </div>

      <Instructions state="Iowa" />


      <div className="spaced" style={{marginTop: "0"}}>
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
            {showResults && (
              <TaxResults 
                projectData={projectData} 
                dbCounties={dbCounties}
                dbCountyTaxData={dbCountyTaxData}
                dbCityData={dbCityData}
              />
            )}
          </div>

        </form>
      </div>
    </div>
  );
}
