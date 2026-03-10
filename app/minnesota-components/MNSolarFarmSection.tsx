import React from "react";
import { ProjectData } from "@/types/MNSolarProject";
import { useState } from "react";

interface Props {
  projectData: ProjectData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SolarFarmSection({ projectData, handleChange }: Props) 
{

  // State for determining whether the user has manually overridden the land area or not.
  const [hasManualAcreage, setHasManualAcreage] = useState(false);
  
  // Computes the acreage/nameplate capacity relationship.
  const acreage =
    !hasManualAcreage || projectData.landArea === undefined || projectData.landArea === null
      ? (projectData.nameplateCapacity ?? 0) * 7
      : projectData.landArea;

  const handleAcreageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasManualAcreage(true);

    handleChange(e);
  };


  const handleResetAcreage = () => {
    setHasManualAcreage(false);

    // Reset nameplate capacity
    handleChange({
      target: {
        name: "nameplateCapacity",
        value: "100",
        type: "number"
      }
    } as any);

    // Clear manual acreage
    handleChange({
      target: {
        name: "landArea",
        value: undefined,
        type: "number"
      }
    } as any);
  };

  return (
    <section>
      <h1>Solar Farm Systems Information</h1>
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
        <div className="inputWithInfo">
          Project acreage:

          <input
            type="number"
            name="landArea"
            value={acreage}
            onChange={handleAcreageChange}
            className="basicInputBox"
          />

          <div className="infoWrapper">
            <img
              src="/photos-logos/information-bubble.svg"
              alt="Vector graphic information bubble"
            />
            <div className="infoBubble">
              We assume a land acreage of 7 acres per mega-watt.
            </div>
          </div>
        </div>
      </label>

      {hasManualAcreage && (
        <>
          <br />
          <p className="warning">
            <img
              src="/photos-logos/warning-alert.svg"
              className="warningImg"
            />
            <span>
              WARNING: Project acreage has been manually overridden.
              Click "Reset to Defaults" to restore the 7 acres per MW assumption.
            </span>
          </p>
          <br />
        </>
      )}

      <br></br>
      
      <button
          type="button"
          onClick={handleResetAcreage}
          className="inPageButton"
        >
          Reset acreage to default
        </button>

    </section>
  );
}
