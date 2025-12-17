import React from "react";
import { ProjectData } from "@/types/MNproject";

interface Props {
  projectData: ProjectData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function WindFarmSection({ projectData, handleChange }: Props) {
  return (
    <section>
      <h1>Wind Farm Systems Information</h1>

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

      <label>
        Number of Turbines:
        <input 
        type="number" 
        name="numberOfTurbines" 
        value={projectData.numberOfTurbines} 
        onChange={handleChange}
        className="basicInputBox" />
      </label>

      <label>
        Acreage Under Turbine:
        <input 
        type="number" 
        name="acreageUnderTurbine" 
        value={projectData.acreageUnderTurbine} 
        onChange={handleChange}
        className="basicInputBox" />
      </label>
    </section>
  );
}
