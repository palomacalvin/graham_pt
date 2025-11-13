"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import LocationSelector from "@/components/LocationSelector";

interface ProjectData {
  county: string;
  township: string;
  schoolDistrict: string;
  approvedLandValuation: boolean;
  useCountyAvgLandValue: boolean;
  userLandValue: number;
  useEstimatedCapacityFactor: number;
  userCapacityFactor: number;
  pilotAgreement: boolean;
  pilotPayment: number;
  inflationRate: number;
  previousPropertyClass: string;
  agriculturalType?: "Homestead" | "Non-homestead";
  newAgriculturalType?: "Homestead" | "Non-homestead";
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
    useEstimatedCapacityFactor: 0,
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

  // Track whether the county average has been set to avoid overwriting user input
  const [defaultValueSet, setDefaultValueSet] = useState(false);

  // Fetch county average when county changes
  useEffect(() => {
    if (!projectData.county) return;

    const fetchCountyData = async () => {
      try {
        const res = await fetch("/api/location");
        const data = await res.json();

        const countyData = data.counties.find(
          (c: any) =>
            c.county_name.toLowerCase() === projectData.county.toLowerCase()
        );

        if (countyData?.avg_market_value_per_acre !== undefined && !defaultValueSet) {
          setProjectData((prev) => ({
            ...prev,
            userLandValue: countyData.avg_market_value_per_acre,
          }));
          setDefaultValueSet(true); // Mark as set to prevent infinite updates
        }
      } catch (err) {
        console.error("Error fetching county data:", err);
      }
    };

    fetchCountyData();


  // reset the flag when county changes
  return () => setDefaultValueSet(false);
}, [projectData.county]);

useEffect(() => {
  if (!projectData.county) return;

  const fetchCapacityFactor = async () => {
    try {
      const res = await fetch("/api/location");
      const data = await res.json();

      const countyData = data.counties.find(
        (c: any) =>
          c.county_name.toLowerCase() === projectData.county.toLowerCase()
      );

      // assuming each county record includes est_capacity_factor
      if (countyData?.est_capacity_factor !== undefined && !defaultValueSet) {
        setProjectData((prev) => ({
          ...prev,
          useEstimatedCapacityFactor: countyData.est_capacity_factor,
        }));
        setDefaultValueSet(true);
      }
    } catch (err) {
      console.error("Error fetching capacity factor:", err);
    }
  };

  fetchCapacityFactor();


    // Reset default value flag if county changes
    return () => setDefaultValueSet(false);
  }, [projectData.county]);

  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  const { name, value, type } = e.target;

  if (type === "checkbox") {
    const target = e.target as HTMLInputElement;
    setProjectData((prev) => ({ ...prev, [name]: target.checked }));
  } else {
    setProjectData((prev) => {
      // Auto-clear agriculturalType if previousPropertyClass changes
      if (name === "previousPropertyClass" && value !== "Agriculture") {
        return { ...prev, [name]: value, agriculturalType: undefined };
      }
      return { ...prev, [name]: type === "number" ? Number(value) : value };
    });
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

      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto p-6">
        {/* === Project Location === */}
        <section className="border rounded p-4">
          <h2 className="text-xl font-semibold mb-4">Project Location Information</h2>

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

          <br />

          <label className="block mb-2">
            Check if the county approved new land valuation as the original use
            <input
              type="checkbox"
              name="approvedLandValuation"
              checked={projectData.approvedLandValuation}
              onChange={handleChange}
              className="ml-2"
            />
          </label>

          <label className="block mb-2">
            Land Market Value ($/acre):
            <input
              type="number"
              name="userLandValue"
              value={projectData.userLandValue || ""}
              onChange={handleChange}
              className="border p-1 ml-2 w-32"
            />
          </label>

          <p>Note that the default value in this field is the 
            average land market value for the selected county.
            Edit the value to match your project's details.
          </p>

          <br></br>

          <label className="block mb-2">
            Estimated Capacity Factor:
            <input
              type="number"
              step="0.1"
              name="useEstimatedCapacityFactor"
              value={projectData.useEstimatedCapacityFactor || ""}
              onChange={handleChange}
              className="border p-1 ml-2 w-32"
            />
          </label>

          <p>
            Note that the default value is the average estimated capacity factor for the
            selected county. Edit the value to match your project's details.
          </p>

          <br></br>

          <label className="block mb-2">
            Did the county arrange a payment in lieu of taxes (PILOT) with the developer?
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
                value={projectData.pilotPayment || ""}
                onChange={handleChange}
                className="border p-1 ml-2"
              />
            </label>
          )}

          <br></br>

          <label className="block mb-2">
            Average Yearly Inflation Rate (%):
            <input
              type="number"
              step="0.1"
              name="inflationRate"
              value={projectData.inflationRate || ""}
              onChange={handleChange}
              className="border p-1 ml-2"
            />
          </label>
        </section>

        {/* === Property Classification === */}
        <section className="border rounded p-4">
          <h2 className="text-xl font-semibold mb-4">Property Classification Information</h2>

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
              <option value="RuralLand">Rural Land</option>
              <option value="Commercial">Commercial</option>
            </select>
          </label>

          
          {/* Conditional dropdown for Agriculture */}
          {projectData.previousPropertyClass === "Agriculture" && (
            <label className="block mb-2">
              Agricultural Land Type:
              <select
                name="agriculturalType"
                value={projectData.agriculturalType || ""}
                onChange={handleChange}
                className="border p-1 ml-2"
              >
                <option value="">Select</option>
                <option value="Homestead">Homestead</option>
                <option value="Non-homestead">Non-homestead</option>
              </select>
            </label>
          )}

          <label className="block mb-2">
            New Property Class:
            <select
              name="newPropertyClass"
              value={projectData.newPropertyClass}
              onChange={handleChange}
              className="border p-1 ml-2"
            >
              <option value="">Select</option>
              <option value="Agriculture">Agriculture</option>
              <option value="RuralLand">Rural Land</option>
              <option value="Commercial">Commercial</option>
            </select>
          </label>

          {/* Conditional dropdown for Agriculture */}
          {projectData.newPropertyClass === "Agriculture" && (
            <label className="block mb-2">
              Agricultural Land Type:
              <select
                name="newAgriculturalType"
                value={projectData.newAgriculturalType || ""}
                onChange={handleChange}
                className="border p-1 ml-2"
              >
                <option value="">Select</option>
                <option value="Homestead">Homestead</option>
                <option value="Non-homestead">Non-homestead</option>
              </select>
            </label>
          )}

        </section>

        {/* === Wind Farm System === */}
        <section className="border rounded p-4">
          <h2 className="text-xl font-semibold mb-4">Wind Farm Systems Information</h2>

          <label className="block mb-2">
            Nameplate Capacity (mega-watt):
            <input
              type="number"
              name="nameplateCapacity"
              value={projectData.nameplateCapacity || ""}
              onChange={handleChange}
              className="border p-1 ml-2"
            />
          </label>

          <label className="block mb-2">
            Land Area of Project (acres):
            <input
              type="number"
              name="landArea"
              value={projectData.landArea || 700}
              onChange={handleChange}
              className="border p-1 ml-2"
            />
          </label>

          <label className="block mb-2">
            Number of Turbines:
            <input
              type="number"
              name="numberOfTurbines"
              value={projectData.numberOfTurbines || ""}
              onChange={handleChange}
              className="border p-1 ml-2"
            />
          </label>

          <label className="block mb-2">
            Acreage Under Turbine:
            <input
              type="number"
              name="acreageUnderTurbine"
              value={projectData.acreageUnderTurbine || ""}
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
