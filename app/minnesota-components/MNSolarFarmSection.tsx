import React from "react";
import { ProjectData } from "@/types/MNSolarProject";
import { useState } from "react";
import AllFieldsRequired from "@/components/AllFieldsRequired";

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
      <h1 className="page-section-title">Solar Farm Systems Information</h1>

      <AllFieldsRequired />

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
          <div className="warning-alert-box">
            <img
                src="/photos-logos/warning-alert.svg"
                alt="Warning sign logo."
                className="warning-alert-icon"
            />
            <span className="warning-alert-text">
                <strong>WARNING:</strong> Project acreage has been manually overridden.
                Click <em>"Reset Acreage to Default"</em> to restore the 7 acres per mega-watt assumption.
            </span>
          </div>
        </>
      )}

      
      <button
          type="button"
          onClick={handleResetAcreage}
          className="inPageButton"
        >
          Reset Acreage to Default
        </button>

    </section>
  );
}
