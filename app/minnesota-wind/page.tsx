"use client";
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { ProjectData } from "@/types/MNproject";
import MNProjectLocationSection from "@/components/MNProjectLocationSection";
import PropertyClassificationSection from "@/components/MNPropertyClassificationSection";
import WindFarmSection from "@/components/MNWindFarmSection";
import TaxResults from "@/components/MNTaxResults";
import { getProductionRate, getAnnualEnergyMWh, calculateRealPropertyTax } from "@/utils/MNcalculations";
import { useCountyData } from "@/hooks/useCountyDataMN";

export default function ProjectForm() {
  const [projectData, setProjectData] = useState<ProjectData>({
    county: "",
    township: "",
    schoolDistrict: "",
    approvedLandValuation: true,
    useCountyAvgLandValue: true,
    userLandValue: 10000,
    useEstimatedCapacityFactor: 0,
    userCapacityFactor: 0,
    pilotAgreement: false,
    pilotPayment: 0,
    inflationRate: 3.0,
    previousPropertyClass: "RuralLand",
    newPropertyClass: "Homestead",
    nameplateCapacity: 100,
    landArea: 700,
    numberOfTurbines: 0,
    acreageUnderTurbine: 0,
    taxRates: { homestead: 0.01, nonHomestead: 0.01, commercial: 0.01 },
  });

  const [userEditedLandValue, setUserEditedLandValue] = useState(false);

  const { countyAvgValue } = useCountyData(projectData, setProjectData);

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

    // Ensure agriculturalType is never undefined
    if (name === "previousPropertyClass") {
      if (value === "Agriculture") {
        newData.agriculturalType = newData.agriculturalType || "Homestead";
      } else {
        newData.agriculturalType = "Homestead"; // or null if you prefer
      }
    }

    if (name === "newPropertyClass") {
      if (value === "Agriculture") {
        newData.newAgriculturalType = newData.newAgriculturalType || "Homestead";
      } else {
        newData.newAgriculturalType = "Homestead"; // or null
      }
    }

    return newData;
  });
};


  // Calculate production revenue
  const productionRate = getProductionRate(projectData.nameplateCapacity);
  const annualMWh = getAnnualEnergyMWh(projectData);
  const modProdTaxRevenue = productionRate * annualMWh;
  const totalProductionRevenue = projectData.pilotAgreement ? projectData.pilotPayment : modProdTaxRevenue;

  // Real Property Tax
  const landValuePerAcre = (userEditedLandValue || countyAvgValue === 0) ? projectData.userLandValue : countyAvgValue;
  const realPropertyTaxRevenue = projectData.taxRates
    ? calculateRealPropertyTax(
        projectData.landArea,
        landValuePerAcre,
        projectData.previousPropertyClass,
        projectData.agriculturalType,
        projectData.taxRates
      )
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(projectData) });
    alert("Project saved!");
  };

  return (
    <div>
      <Navbar />
      <form onSubmit={handleSubmit}>
        <MNProjectLocationSection projectData={projectData} handleChange={handleChange} setProjectData={setProjectData} />
        <PropertyClassificationSection projectData={projectData} handleChange={handleChange} />
        <WindFarmSection projectData={projectData} handleChange={handleChange} />
        <button type="submit">Save Project</button>
        <TaxResults totalProductionRevenue={totalProductionRevenue} realPropertyTaxRevenue={realPropertyTaxRevenue} />
      </form>
    </div>
  );
}
