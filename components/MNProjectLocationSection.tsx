"use client";

import { ProjectData } from "@/types/MNproject";
import LocationSelector from "./LocationSelector";
import { County } from "@/components/LocationSelector";


interface Props {
  projectData: ProjectData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  setProjectData: React.Dispatch<React.SetStateAction<ProjectData>>;
  countyAvgValue: number;
  userEditedLandValue: boolean;
  onSelectCounty: (county: County | null) => void
}

export default function MNProjectLocationSection({
  projectData,
  handleChange,
  setProjectData,
  countyAvgValue,
  userEditedLandValue
}: Props) {
  return (
    <section>
      <h1>Project Location Information</h1>

      <LocationSelector
        stateName="MINNESOTA"
        onSelectCounty={(county) => {
        setProjectData((prev) => ({
          ...prev, // keep all other fields
          county: county?.county_name || "",
          countyTaxRates: county
            ? {
                ag_homestead_effective_rate: county.ag_homestead_effective_rate,
                ag_non_homestead_effective_rate: county.ag_non_homestead_effective_rate,
                commercial_effective_rate: county.commercial_effective_rate,
              }
            : undefined,
        }));
      }}

        onSelectCity={(cityObj) => {
          if (!cityObj) return;
          setProjectData((prev) => ({
            ...prev,
            township: cityObj.city_town,
            taxRates: {
              homestead: cityObj.homestead_rate / 100,
              nonHomestead: cityObj.non_homestead_rate / 100,
              commercial: cityObj.commercial_rate / 100
            }
          }));
        }}
        onSelectSchoolDistrict={(sdObj) => {
          if (!sdObj) return;
          console.log(sdObj)
          setProjectData((prev) => ({
            ...prev,
            schoolDistrict: sdObj.school_district,
            taxRates: {
              homestead: sdObj.ag_homestead_rate > 0 ? sdObj.ag_homestead_rate : prev.taxRates!.homestead,
              nonHomestead: sdObj.ag_non_homestead_rate > 0 ? sdObj.ag_non_homestead_rate : prev.taxRates!.nonHomestead,
              commercial: sdObj.commercial_rate > 0 ? sdObj.commercial_rate : prev.taxRates!.commercial
            }
          }));
        }}
      />

      <label>
        County Average Land Market Value ($/acre):
        <input
          type="number"
          name="userLandValue"
          value={projectData.userLandValue || ""}
          onChange={handleChange}
          className="basicInputBox"
        />
      </label>

      <label>
        County Estimated Wind Capacity Factor:
        <input
          type="number"
          step="0.1"
          name="useEstimatedCapacityFactor"
          value={projectData.useEstimatedCapacityFactor || ""}
          onChange={handleChange}
          className="basicInputBox"
        />
      </label>

      <label>
        Check if the county arranged a payment in lieu of taxes agreement (PILOT) with 
        the developer:
        <input
          type="checkbox"
          name="pilotAgreement"
          checked={projectData.pilotAgreement}
          onChange={handleChange}
          className="basicCheckBox"
        />
      </label>

      {projectData.pilotAgreement && (
        <label>
          Enter the PILOT Annual Payment ($):
          <input
            type="number"
            name="pilotPayment"
            value={projectData.pilotPayment || ""}
            onChange={handleChange}
            className="basicInputBox"
          />
        </label>
      )}
    </section>
  );
}
