"use client";

import { ProjectData } from "@/types/WIProject";
import LocationSelector from "../../components/WILocationSelector";
import { County } from "@/components/WILocationSelector";


interface Props {
  projectData: ProjectData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  setProjectData: React.Dispatch<React.SetStateAction<ProjectData>>;
  onSelectCounty?: (county: County | null) => void
}

export default function WIUserSelections({
  projectData,
  handleChange,
  setProjectData,
}: Props) {
  return (
    <section>
      <h1>Project Information</h1>

      <br></br>
      <LocationSelector
        stateName="WISCONSIN"
        onSelectCounty={(county) => {
            setProjectData((prev) => ({
            ...prev,
            county: county?.county_name || "",
            }));
        }}
        onSelectCity={(municipality) => {
            if (!municipality) return;

            setProjectData((prev) => ({
            ...prev,
            municipality: municipality.municipality, // adjust if your object uses a different key
            }));
        }}
        />
        <br></br>

        <label>
            Project Type
            <select
                name="projectType"
                value={projectData.project_type}
                onChange={handleChange}
                className="basicInputBox"
            >
                <option value="">Select</option>
                <option value="Solar">Solar</option>
                <option value="Wind">Wind</option>
            </select>
            </label>

            <label>
                Nameplate Capacity / Project Size (MW)
                <input
                    type="number"
                    name="projectSizeMW"
                    value={projectData.nameplate_capacity}
                    onChange={handleChange}
                    className="basicInputBox"
                />
            </label>

            {projectData.project_type === "Solar" && (
            <label>
                Fenceline Acres
                <input
                type="number"
                name="solarFencelineAcres"
                value={projectData.land_area || ""}
                onChange={handleChange}
                className="basicInputBox"
                />
            </label>
            )}

            {projectData.project_type === "Wind" && (
            <label>
                Number of Turbines
                <input
                type="number"
                name="windTurbineCount"
                value={projectData.number_of_turbines || ""}
                onChange={handleChange}
                className="basicInputBox"
                />
            </label>
            )}

            <label>
            Grade of Agricultural Land Converted
            <select
                name="agLandGrade"
                value={projectData.selected_grade}
                onChange={handleChange}
                className="basicInputBox"
            >
                <option value="">Select</option>
                <option value={1}>Grade 1</option>
                <option value={2}>Grade 2</option>
                <option value={3}>Grade 3</option>
                <option value={4}>Pasture</option>
            </select>
            </label>
    </section>
    
  );
}
