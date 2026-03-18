import React from "react";
import { ProjectData } from "@/types/MNproject";

interface Props {
  projectData: ProjectData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  projectDataSetter: React.Dispatch<React.SetStateAction<ProjectData>>
}

export default function PropertyClassificationSection({
  projectData,
  handleChange,
}: Props) {
  return (
    <section>
      <h1>Property Classification Information</h1>
      <br />

      <p style={{ color: "red", fontStyle: "italic"}}>
        All fields in this section are required. You may choose to
        use the defaults listed below, or override them with values relevant to
        your project.
      </p>

      <br></br>

      <label>
        Property Class:
        <select
          name="propertyClass"
          value={projectData.propertyClass}
          onChange={handleChange}
          className="basicDropdown"
        >
          <option value="Agriculture">Agriculture</option>
          <option value="RuralLand">Rural Land</option>
          <option value="Commercial">Commercial</option>
        </select>
      </label>

      {projectData.propertyClass === "Agriculture" && (
        <label>
          Agricultural Land Type:
          <select
            name="agriculturalType"
            value={projectData.agriculturalType || "Homestead"}
            onChange={handleChange}
            className="basicDropdown"
          >
            <option value="Homestead">Homestead</option>
            <option value="Non-homestead">Non-homestead</option>
          </select>
        </label>
      )}
    </section>
  );
}
