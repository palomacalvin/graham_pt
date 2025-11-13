"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import LocationSelector from "@/components/LocationSelector";
import { useEffect } from "react";

interface ProjectData {
  county: string;
  township: string;
  schoolDistrict: string;
  approvedLandValuation: boolean;
  useCountyAvgLandValue: boolean;
  userLandValue: number;
  useEstimatedCapacityFactor: boolean;
  userCapacityFactor: number;
  pilotAgreement: boolean;
  pilotPayment: number;
  inflationRate: number;
  previousPropertyClass: string;
  newPropertyClass: string;
  nameplateCapacity: number;
  landArea: number;
  numberOfTurbines: number;
  acreageUnderTurbine: number;
}

export default function ProjectForm() {
  const [projectData, setProjectData] = useState<ProjectData>({
    county: "",
    township: "",
    schoolDistrict: "",
    approvedLandValuation: true,
    useCountyAvgLandValue: true,
    userLandValue: 0,
    useEstimatedCapacityFactor: true,
    userCapacityFactor: 0,
    pilotAgreement: false,
    pilotPayment: 0,
    inflationRate: 3.0,
    previousPropertyClass: "",
    newPropertyClass: "",
    nameplateCapacity: 100,
    landArea: 0,
    numberOfTurbines: 0,
    acreageUnderTurbine: 0,
  });

useEffect(() => {
  if (!projectData.county) return;

  let isMounted = true;

  const fetchCountyData = async () => {
    try {
      const res = await fetch("/api/minnesota_counties");
      const data = await res.json();

      const countyData = data.counties.find(
        (c: any) => c.county_name.toLowerCase() === projectData.county.toLowerCase()
      );

      if (countyData?.avg_market_value_per_acre !== undefined && isMounted) {
        setProjectData(prev => ({
          ...prev,
          userLandValue: countyData.avg_market_value_per_acre,
        }));
      }
    } catch (err) {
      console.error("Error fetching county data:", err);
    }
  };

  fetchCountyData();

  return () => {
    isMounted = false;
  };
}, [projectData.county]);








  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      setProjectData((prev) => ({ ...prev, [name]: target.checked }));
    } else {
      setProjectData((prev) => ({
        ...prev,
        [name]: type === "number" ? Number(value) : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting data:", projectData);

    await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(projectData),
    });

    alert("Project saved!");
  };

  return (
    <div>
      <Navbar />


      {/* === Main Form === */}
      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto p-6">
        {/* --- Project Location --- */}
        <section className="border rounded p-4">
          <h2 className="text-xl font-semibold mb-4">Project Location</h2>

          {/* === Location Selector === */}
          <LocationSelector
            stateName="MINNESOTA"
            onSelectCounty={(county) =>
              setProjectData((prev) => ({ ...prev, county: county || "" }))
            }
            onSelectCity={(township) =>
              setProjectData((prev) => ({ ...prev, township: township || "" }))
            }
            onSelectSchoolDistrict={(district) =>
              setProjectData((prev) => ({ ...prev, schoolDistrict: district || "" }))
            }
          />

          <br></br>

          <label className="block mb-2">
            County Approved New Land Valuation as Original Use
            <input
              type="checkbox"
              name="approvedLandValuation"
              checked={projectData.approvedLandValuation}
              onChange={handleChange}
              className="ml-2"
            />
          </label>

          <label className="block mb-2">
            Average Land Market Value ($/acre):
            <input
              type="number"
              name="userLandValue"
              value={projectData.userLandValue || ""}
              onChange={handleChange}
              className="border p-1 ml-2 w-32"
            />
          </label>


          {!projectData.useCountyAvgLandValue && (
            <label className="block mb-2">
              Enter Land Value ($/acre):
              <input
                type="number"
                name="userLandValue"
                value={projectData.userLandValue}
                onChange={handleChange}
                className="border p-1 ml-2"
              />
            </label>
          )}

          <label className="block mb-2">
            Use Estimated Capacity Factor?
            <input
              type="checkbox"
              name="useEstimatedCapacityFactor"
              checked={projectData.useEstimatedCapacityFactor}
              onChange={handleChange}
              className="ml-2"
            />
          </label>

          {!projectData.useEstimatedCapacityFactor && (
            <label className="block mb-2">
              Enter Capacity Factor:
              <input
                type="number"
                step="0.001"
                name="userCapacityFactor"
                value={projectData.userCapacityFactor}
                onChange={handleChange}
                className="border p-1 ml-2"
              />
            </label>
          )}

          <label className="block mb-2">
            PILOT Agreement?
            <input
              type="checkbox"
              name="pilotAgreement"
              checked={projectData.pilotAgreement}
              onChange={handleChange}
              className="ml-2"
            />
          </label>

          {projectData.pilotAgreement && (
            <label className="block mb-2">
              Annual Payment ($):
              <input
                type="number"
                name="pilotPayment"
                value={projectData.pilotPayment}
                onChange={handleChange}
                className="border p-1 ml-2"
              />
            </label>
          )}

          <label className="block mb-2">
            Average Yearly Inflation Rate (%):
            <input
              type="number"
              step="0.01"
              name="inflationRate"
              value={projectData.inflationRate}
              onChange={handleChange}
              className="border p-1 ml-2"
            />
          </label>
        </section>

        {/* --- Property Classification --- */}
        <section className="border rounded p-4">
          <h2 className="text-xl font-semibold mb-4">Property Classification</h2>

          <label className="block mb-2">
            Previous Property Class:
            <select
              name="previousPropertyClass"
              value={projectData.previousPropertyClass}
              onChange={handleChange}
              className="border p-1 ml-2"
            >
              <option value="">Select</option>
              <option value="Agriculture">Agriculture</option>
              <option value="Non-homestead">Non-homestead</option>
            </select>
          </label>

          <label className="block mb-2">
            New Property Class:
            <select
              name="newPropertyClass"
              value={projectData.newPropertyClass}
              onChange={handleChange}
              className="border p-1 ml-2"
            >
              <option value="">Select</option>
              <option value="Commercial">Commercial</option>
              <option value="Residential">Residential</option>
            </select>
          </label>
        </section>

        {/* --- Wind Farm System --- */}
        <section className="border rounded p-4">
          <h2 className="text-xl font-semibold mb-4">Wind Farm System</h2>

          <label className="block mb-2">
            Nameplate Capacity (MW):
            <input
              type="number"
              name="nameplateCapacity"
              value={projectData.nameplateCapacity}
              onChange={handleChange}
              className="border p-1 ml-2"
            />
          </label>

          <label className="block mb-2">
            Land Area (Acres):
            <input
              type="number"
              name="landArea"
              value={projectData.landArea}
              onChange={handleChange}
              className="border p-1 ml-2"
            />
          </label>

          <label className="block mb-2">
            Number of Turbines:
            <input
              type="number"
              name="numberOfTurbines"
              value={projectData.numberOfTurbines}
              onChange={handleChange}
              className="border p-1 ml-2"
            />
          </label>

          <label className="block mb-2">
            Acreage Under Turbine:
            <input
              type="number"
              name="acreageUnderTurbine"
              value={projectData.acreageUnderTurbine}
              onChange={handleChange}
              className="border p-1 ml-2"
            />
          </label>
        </section>

        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded mt-4"
        >
          Save Project
        </button>
      </form>
    </div>
  );
}
