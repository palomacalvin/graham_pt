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
            console.log("Selected county:", county)
            setProjectData((prev) => ({
            ...prev,
            county_name: county?.county_name || "",
            over_30_acres: county?.over_30_acres || prev.over_30_acres,
            between_10_and_30_acres: county?.between_10_and_30_acres || prev.between_10_and_30_acres,
            under_10_acres: county?.under_10_acres || prev.under_10_acres,
            }));
        }}
        onSelectMunicipality={(municipality) => {
            console.log("Selected municipality:", municipality);
            if (!municipality) return;

            setProjectData((prev) => ({
            ...prev,
            municipality: municipality.municipality,
            tvc: municipality.tvc,
            code: municipality.code,

            grade_1: municipality.grade_1 ?? prev.grade_1,
            grade_2: municipality.grade_2 ?? prev.grade_2,
            grade_3: municipality.grade_3 ?? prev.grade_3,
            pasture: municipality.pasture ?? prev.pasture,
            school_tax: municipality.school_tax ?? prev.school_tax,
            college_tax: municipality.college_tax ?? prev.college_tax,
            county_tax: municipality.county_tax ?? prev.county_tax,
            local_tax: municipality.local_tax ?? prev.local_tax,
            other_tax: municipality.other_tax ?? prev.other_tax,
            total_property_tax: municipality.total_property_tax ?? prev.total_property_tax,
            gross_rate: municipality.gross_rate ?? prev.gross_rate,
            effective_rate: municipality.effective_rate ?? prev.effective_rate,
            }));
        }}
        />
        <br></br>

        <label>
            Project Type
            <select
                name="project_type"
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
                    name="nameplate_capacity"
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
                name="land_area"
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
                name="number_of_turbines"
                value={projectData.number_of_turbines || ""}
                onChange={handleChange}
                className="basicInputBox"
                />
            </label>
            )}

            <label>
            Grade of Agricultural Land Converted
            <select
                name="selected_grade"
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
