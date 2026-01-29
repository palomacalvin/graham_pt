import React from "react";
import { ProjectData } from "@/types/MNSolarProject";

interface Props {
  projectData: ProjectData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SolarFarmSection({ projectData, handleChange }: Props) {
  return (
    <section>
      <h1>Solar Farm Systems Information</h1>
      <br></br>

      <label>
        Nameplate Capacity (in mega-watts):
        <input 
        type="number" 
        name="nameplateCapacity" 
        value={projectData.nameplateCapacity} 
        onChange={handleChange}
        className="basicInputBox" />
      </label>

      <label>
        Land Area of Project (acres):
        <input 
        type="number" 
        name="landArea" 
        value={projectData.landArea} 
        onChange={handleChange}
        className="basicInputBox" />
      </label>

    </section>
  );
}
