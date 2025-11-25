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
        Nameplate Capacity (MW):
        <input type="number" name="nameplateCapacity" value={projectData.nameplateCapacity} onChange={handleChange} />
      </label>

      <label>
        Land Area of Project (acres):
        <input type="number" name="landArea" value={projectData.landArea} onChange={handleChange} />
      </label>

      <label>
        Number of Turbines:
        <input type="number" name="numberOfTurbines" value={projectData.numberOfTurbines} onChange={handleChange} />
      </label>

      <label>
        Acreage Under Turbine:
        <input type="number" name="acreageUnderTurbine" value={projectData.acreageUnderTurbine} onChange={handleChange} />
      </label>
    </section>
  );
}
