"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import LocationSelector from "@/components/LocationSelector";

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

  const [showLocation, setShowLocation] = useState(true);
  const [showProperty, setShowProperty] = useState(false);
  const [showSystem, setShowSystem] = useState(false);

  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  const { name, value, type } = e.target;

  if (type === "checkbox") {
    const target = e.target as HTMLInputElement; // Narrow type
    setProjectData((prev) => ({
      ...prev,
      [name]: target.checked,
    }));
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

    // Send to backend API
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
      <LocationSelector stateName="MINNESOTA" onSelect={county => console.log(county)} />

      {/* <main className="max-w-4xl mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold mb-6">Project Calculator</h1> */}

        {/* <form onSubmit={handleSubmit} className="space-y-4"> */}

          {/* Project Location Section */}
          {/* <section className="border rounded p-4"> */}
            {/* <header
              className="text-xl font-semibold cursor-pointer"
              onClick={() => setShowLocation(!showLocation)}
            >
              Project Location Information
            </header> */}
            {/* {showLocation && (
              <div className="mt-4 space-y-2">
                <label>
                  County:
                  <input
                    type="text"
                    name="county"
                    value={projectData.county}
                    onChange={handleChange}
                    className="border p-1 ml-2"
                  />
                </label> */}
                {/* <label>
                  Township:
                  <input
                    type="text"
                    name="township"
                    value={projectData.township}
                    onChange={handleChange}
                    className="border p-1 ml-2"
                  />
                </label>
                <label>
                  School District:
                  <input
                    type="text"
                    name="schoolDistrict"
                    value={projectData.schoolDistrict}
                    onChange={handleChange}
                    className="border p-1 ml-2"
                  />
                </label> */}

                {/* <label className="flex items-center gap-2">
                  Approved Land Valuation?
                  <input
                    type="checkbox"
                    name="approvedLandValuation"
                    checked={projectData.approvedLandValuation}
                    onChange={handleChange}
                  />
                </label> */}

                {/* <label className="flex items-center gap-2">
                  Use County Avg Land Value?
                  <input
                    type="checkbox"
                    name="useCountyAvgLandValue"
                    checked={projectData.useCountyAvgLandValue}
                    onChange={handleChange}
                  />
                </label> */}

                {/* {!projectData.useCountyAvgLandValue && (
                  <label>
                    Enter Land Value ($/acre):
                    <input
                      type="number"
                      name="userLandValue"
                      value={projectData.userLandValue}
                      onChange={handleChange}
                      className="border p-1 ml-2"
                    />
                  </label>
                )} */}

                {/* <label className="flex items-center gap-2">
                  Use Estimated Capacity Factor?
                  <input
                    type="checkbox"
                    name="useEstimatedCapacityFactor"
                    checked={projectData.useEstimatedCapacityFactor}
                    onChange={handleChange}
                  />
                </label> */}

                {/* {!projectData.useEstimatedCapacityFactor && (
                  <label>
                    Enter Capacity Factor:
                    <input
                      type="number"
                      name="userCapacityFactor"
                      value={projectData.userCapacityFactor}
                      onChange={handleChange}
                      className="border p-1 ml-2"
                    />
                  </label>
                )} */}

                {/* <label className="flex items-center gap-2">
                  PILOT Agreement?
                  <input
                    type="checkbox"
                    name="pilotAgreement"
                    checked={projectData.pilotAgreement}
                    onChange={handleChange}
                  />
                </label> */}

                {/* {projectData.pilotAgreement && (
                  <label>
                    Annual Payment ($):
                    <input
                      type="number"
                      name="pilotPayment"
                      value={projectData.pilotPayment}
                      onChange={handleChange}
                      className="border p-1 ml-2"
                    />
                  </label>
                )} */}

                {/* <label>
                  Inflation Rate (%):
                  <input
                    type="number"
                    name="inflationRate"
                    value={projectData.inflationRate}
                    onChange={handleChange}
                    className="border p-1 ml-2"
                  />
                </label> */}
              {/* </div>
            )}
          </section> */}

          {/* Property Classification Section */}
          {/* <section className="border rounded p-4"> */}
            {/* <header
              className="text-xl font-semibold cursor-pointer"
              onClick={() => setShowProperty(!showProperty)}
            >
              Property Classification
            </header> */}
            {/* {showProperty && (
              <div className="mt-4 space-y-2">
                <label>
                  Previous Property Class:
                  <select
                    name="previousPropertyClass"
                    value={projectData.previousPropertyClass}
                    onChange={handleChange}
                    className="border p-1 ml-2"
                  > */}
                    {/* <option value="">Select</option>
                    <option value="Agriculture">Agriculture</option>
                    <option value="Non-homestead">Non-homestead</option>
                  </select>
                </label> */}

                {/* <label>
                  New Property Class:
                  <select
                    name="newPropertyClass"
                    value={projectData.newPropertyClass}
                    onChange={handleChange}
                    className="border p-1 ml-2"
                  > */}
                    {/* <option value="">Select</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Residential">Residential</option>
                  </select>
                </label>
              </div>
            )}
          </section> */}

          {/* Wind Farm System Section */}
          {/* <section className="border rounded p-4">
            <header
              className="text-xl font-semibold cursor-pointer"
              onClick={() => setShowSystem(!showSystem)}
            >
              Wind Farm System */}
            {/* </header>
            {showSystem && (
              <div className="mt-4 space-y-2">
                <label>
                  Nameplate Capacity (MW):
                  <input
                    type="number"
                    name="nameplateCapacity"
                    value={projectData.nameplateCapacity}
                    onChange={handleChange}
                    className="border p-1 ml-2"
                  />
                </label> */}

                {/* <label>
                  Land Area (Acres):
                  <input
                    type="number"
                    name="landArea"
                    value={projectData.landArea}
                    onChange={handleChange}
                    className="border p-1 ml-2"
                  />
                </label> */}

                {/* <label>
                  Number of Turbines:
                  <input
                    type="number"
                    name="numberOfTurbines"
                    value={projectData.numberOfTurbines}
                    onChange={handleChange}
                    className="border p-1 ml-2"
                  />
                </label> */}

                {/* <label>
                  Acreage Under Turbine:
                  <input
                    type="number"
                    name="acreageUnderTurbine"
                    value={projectData.acreageUnderTurbine}
                    onChange={handleChange}
                    className="border p-1 ml-2"
                  />
                </label>
              </div>
            )}
          </section> */}

          {/* <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded mt-4"
          >
            Save Project
          </button>
        </form> */}
      {/* </main> */}
    </div>
  );
}
