import React from "react";
import { ProjectData } from "@/types/MNproject";
import { useState } from "react";
import { useEffect } from "react";

interface Props {
  projectData: ProjectData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setProjectData: React.Dispatch<React.SetStateAction<ProjectData>>;

}

const DEFAULT_TURBINES = 50;
const DEFAULT_LAND = 50;
const DEFAULT_CAPACITY = 100;

export default function WindFarmSection({ projectData, handleChange, setProjectData }: Props) {
  // State for determining whether the user has manually overridden the land area or not.
  const [manualLandEdit, setManualLandEdit] = useState(false);

  useEffect(() => {
    if (!manualLandEdit) {
      setProjectData(prev => ({
        ...prev,
        landArea: prev.numberOfTurbines
      }));
    }
  }, [projectData.numberOfTurbines, manualLandEdit, setProjectData]);

  const isBroken = manualLandEdit && projectData.landArea !== projectData.numberOfTurbines;

  const handleLandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setManualLandEdit(true); // True when user overrides the turbine/acreage default relationship.
    setProjectData(prev => ({
      ...prev,
      landArea: value
    }));
  };

  const handleReset = () => {
    setManualLandEdit(false);
    setProjectData(prev => ({
      ...prev,
      numberOfTurbines: DEFAULT_TURBINES,
      landArea: DEFAULT_LAND,
      nameplateCapacity: DEFAULT_CAPACITY,
    }));
  };

  return (
    <section>
      <h1>Wind Farm Systems Information</h1>
      <br></br>

      <p style={{ color: "red", fontStyle: "italic"}}>
        All fields in this section are required. You may choose to
        use the defaults listed below, or override them with values relevant to
        your project.
      </p>
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
        Number of Turbines:
        <input 
        type="number" 
        name="numberOfTurbines" 
        value={projectData.numberOfTurbines} 
        onChange={(e) => {handleChange(e);
          setManualLandEdit(false);
        }}
        className="basicInputBox" />
      </label>

      <label className="inputWithInfo">
        Project acreage under turbines:
        <input 
        type="number" 
        name="landArea" 
        value={projectData.landArea} 
        onChange={handleLandChange}
        className="basicInputBox" />

        <div className="infoWrapper">
          <img src="/photos-logos/information-bubble.svg" alt="Vector graphic information bubble"></img>
          <div className="infoBubble">
              We assume that total acreage is equivalent to the total number of turbines (1 turbine = 1 acre).
          </div>
        </div>
      </label>

      {isBroken && (
        <p className="warning">
              <img
                src="/photos-logos/warning-alert.svg"
                alt="Warning sign logo."
                className="warningImg"
              />
              <span>
                WARNING: Acreage is manually overridden. Click "Reset Turbines/Acreage to Default"
                below to restore automatic calculation from turbine totals.
              </span>
          </p>
      )}

      <br></br>

      <button className="inPageButton" type="button" onClick={handleReset} style={{marginLeft: "1rem"}}>
        Reset to default
      </button>

    </section>
  );
}
