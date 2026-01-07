"use client";
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { ProjectData } from "@/types/MNproject";
import MNProjectLocationSection from "@/components/MNProjectLocationSection";
import PropertyClassificationSection from "@/components/MNPropertyClassificationSection";
import WindFarmSection from "@/components/MNWindFarmSection";
import TaxResults from "@/components/MNTaxResults";
import { getProductionRate, getAnnualEnergyMWh, calculateRealPropertyTax, calculateFormerRealPropertyTax } from "@/utils/MNcalculations";
import { useCountyData } from "@/hooks/useCountyDataMN";
import { County } from "@/components/LocationSelector";
import { calculateCityRealPropertyTax, calculateFormerCityRealPropertyTax } from "@/utils/MNCityCalculations";
import { calculateFormerSchoolDistrictRealPropertyTax, calculateSchoolDistrictRealPropertyTax } from "@/utils/MNSchoolDistrictCalculations";

export default function ProjectForm() {
  const [projectData, setProjectData] = useState<ProjectData>({
    county: "",
    township: "",
    schoolDistrict: "",
    approvedLandValuation: false,
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
    cityTaxRates: { ag_homestead_effective_rate: 0.01, ag_non_homestead_effective_rate: 0.01, commercial_effective_rate: 0.01},
    schoolDistrictTaxRates: { ag_homestead_effective_rate: 0.01, ag_non_homestead_effective_rate: 0.01, commercial_effective_rate: 0.01},
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

      if (name === "previousPropertyClass") {
        if (value === "Agriculture") {
          newData.agriculturalType = newData.agriculturalType || "Homestead";
        } else {
          newData.agriculturalType = "Homestead";
        }
      }

      if (name === "newPropertyClass") {
        if (value === "Agriculture") {
          newData.newAgriculturalType = newData.newAgriculturalType || "Homestead";
        } else {
          newData.newAgriculturalType = "Homestead";
        }
      }

    return newData;
  });
};

console.log(projectData.countyTaxRates)

  // Calculate production revenue
  const productionRate = getProductionRate(projectData.nameplateCapacity);
  const annualMWh = getAnnualEnergyMWh(projectData);
  const modProdTaxRevenue = productionRate * annualMWh;
  const totalProductionRevenue = (projectData.pilotAgreement ? projectData.pilotPayment : modProdTaxRevenue) / 10;

  const landValuePerAcre = (userEditedLandValue || countyAvgValue === 0) ? projectData.userLandValue : countyAvgValue;


  // Real Property Tax Revenue (County)
  const realPropertyTaxRevenue = projectData.countyTaxRates
    ? calculateRealPropertyTax(
        projectData.landArea,
        landValuePerAcre,
        projectData.newPropertyClass,
        projectData.agriculturalType,
        projectData.countyTaxRates
      )
    : 0;

  // Former Property Tax Revenue (County)
  const formerRealPropertyTaxRevenue =
  projectData.approvedLandValuation
    ? realPropertyTaxRevenue
    : projectData.countyTaxRates
        ? calculateFormerRealPropertyTax(
            projectData.landArea,
            landValuePerAcre,
            projectData.previousPropertyClass,
            projectData.agriculturalType,
            projectData.countyTaxRates
          )
        : 0;

  // Real Property Tax Revenue (City)
  const cityRealPropertyTaxRevenue = projectData.cityTaxRates
    ? calculateCityRealPropertyTax(
        projectData.landArea,
        landValuePerAcre,
        projectData.newPropertyClass,
        projectData.agriculturalType,
        projectData.cityTaxRates
      )
    : 0;

  // Former Property Tax Revenue (City)
  const formerCityRealPropertyTaxRevenue =
  projectData.approvedLandValuation
    ? cityRealPropertyTaxRevenue
    : projectData.cityTaxRates
        ? calculateFormerCityRealPropertyTax(
            projectData.landArea,
            landValuePerAcre,
            projectData.previousPropertyClass,
            projectData.agriculturalType,
            projectData.cityTaxRates
          )
        : 0;


    // Real Property Tax Revenue (School District)
    const schoolDistrictRealPropertyTaxRevenue = projectData.schoolDistrictTaxRates
      ? calculateSchoolDistrictRealPropertyTax(
          projectData.landArea,
          landValuePerAcre,
          projectData.newPropertyClass,
          projectData.agriculturalType,
          projectData.schoolDistrictTaxRates
        )
      : 0;

    // Former Property Tax Revenue (School District)
    const formerSchoolDistrictRealPropertyTaxRevenue =
    projectData.approvedLandValuation
      ? schoolDistrictRealPropertyTaxRevenue
      : projectData.schoolDistrictTaxRates
          ? calculateFormerCityRealPropertyTax(
              projectData.landArea,
              landValuePerAcre,
              projectData.previousPropertyClass,
              projectData.agriculturalType,
              projectData.schoolDistrictTaxRates
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
      <p style={{ margin: "3rem" }}>
        Fill in the fields below will values relevant to your project. Default values
        are available for each county, city/township, and school district; these values 
        have been compiled from state-by-state research. See the citations (TODO: ADD LINK) page for more details.
      </p>
      <div style={{ margin: "3rem" }}>
      <form onSubmit={handleSubmit}>
        {/* Project Location Section */}
        <MNProjectLocationSection
        projectData={projectData}
        handleChange={handleChange}
        setProjectData={setProjectData}
        countyAvgValue={countyAvgValue}
        userEditedLandValue={userEditedLandValue}
        onSelectCounty={(county: County | null) => {
          setProjectData(prev => ({
            ...prev,
            county: county?.county_name || "",
            countyTaxRates: county ? {
              ag_homestead_effective_rate: county.ag_homestead_effective_rate,
              ag_non_homestead_effective_rate: county.ag_non_homestead_effective_rate,
              commercial_effective_rate: county.commercial_effective_rate
            } : undefined
          }));
        }}
      />

        {/* Property Classification Section */}
        <br></br>
        <PropertyClassificationSection projectData={projectData} handleChange={handleChange} projectDataSetter={setProjectData} />

        {/* Wind Farm Section */}
        <br></br>
        <WindFarmSection projectData={projectData} handleChange={handleChange} />

        <br></br>

        {/* Results Section */}
        <TaxResults totalProductionRevenue={totalProductionRevenue} realPropertyTaxRevenue={realPropertyTaxRevenue} formerRealPropertyTaxRevenue={formerRealPropertyTaxRevenue}
        cityRealPropertyTaxRevenue={cityRealPropertyTaxRevenue} formerCityRealPropertyTaxRevenue={formerCityRealPropertyTaxRevenue}
        schoolDistrictRealPropertyTaxRevenue={schoolDistrictRealPropertyTaxRevenue} formerSchoolDistrictRealPropertyTaxRevenue={formerSchoolDistrictRealPropertyTaxRevenue}/>

      </form>
      </div>
    </div>
  );
}
