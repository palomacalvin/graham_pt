import React from "react";
import { ProjectData } from "@/types/MNproject";

interface Props {
  projectData: ProjectData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export default function PropertyClassificationSection({ projectData, handleChange }: Props) {
  return (
    <section>
      <h1>Property Classification Information</h1>

      <label>
        Previous Property Class:
        <select name="previousPropertyClass" value={projectData.previousPropertyClass} onChange={handleChange}>
          <option value="">Select</option>
          <option value="Agriculture">Agriculture</option>
          <option value="RuralLand">Rural Land</option>
          <option value="Commercial">Commercial</option>
        </select>
      </label>

      {projectData.previousPropertyClass === "Agriculture" && (
        <label>
          Agricultural Land Type:
          <select name="agriculturalType" value={projectData.agriculturalType || ""} onChange={handleChange}>
            <option value="">Select</option>
            <option value="Homestead">Homestead</option>
            <option value="Non-homestead">Non-homestead</option>
          </select>
        </label>
      )}

      <label>
        New Property Class:
        <select name="newPropertyClass" value={projectData.newPropertyClass} onChange={handleChange}>
          <option value="">Select</option>
          <option value="Agriculture">Agriculture</option>
          <option value="RuralLand">Rural Land</option>
          <option value="Commercial">Commercial</option>
        </select>
      </label>

      {projectData.newPropertyClass === "Agriculture" && (
        <label>
          Agricultural Land Type:
          <select name="newAgriculturalType" value={projectData.newAgriculturalType || ""} onChange={handleChange}>
            <option value="">Select</option>
            <option value="Homestead">Homestead</option>
            <option value="Non-homestead">Non-homestead</option>
          </select>
        </label>
      )}
    </section>
  );
}
