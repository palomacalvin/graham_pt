"use client";

import { ProjectData } from "@/types/MNSolarProject";
import LocationSelector from "../../components/LocationSelector";
import { County } from "@/components/LocationSelector";


interface Props {
  projectData: ProjectData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  setProjectData: React.Dispatch<React.SetStateAction<ProjectData>>;
  countyAvgValue: number;
  userEditedLandValue: boolean;
  onSelectCounty?: (county: County | null) => void
}

console.log("MNSolarProjectLocationSection rendered");


export default function MNSolarProjectLocationSection({
  projectData,
  handleChange,
  setProjectData,
  countyAvgValue,
  userEditedLandValue
}: Props) {
  return (
    <section>
      <h1>Project Location Information</h1>

      <br></br>
      <LocationSelector
        stateName="MINNESOTA"
        onSelectCounty={(county) => {
        setProjectData((prev) => ({
          ...prev, // keep all other fields
          county: county?.county_name || "",

          solarEstimatedCapacityFactor:
          county?.solar_estimated_capacity_factor ?? prev.solarEstimatedCapacityFactor,

          countyTaxRates: county
            ? {
                ag_homestead_effective_rate: county.ag_homestead_effective_rate,
                ag_non_homestead_effective_rate: county.ag_non_homestead_effective_rate,
                commercial_effective_rate: county.commercial_effective_rate,
              }
            : undefined,

        }));
        console.log("Selected county:", county);

      }}

        onSelectCity={(cityObj) => {
          // console.log("FULL cityObj:", cityObj);
          if (!cityObj) return;

          setProjectData((prev) => ({
            ...prev,
            township: cityObj.city_town,
            cityTaxRates: {
              ag_homestead_effective_rate: cityObj.ag_homestead_rate,
              ag_non_homestead_effective_rate: cityObj.ag_non_homestead_rate,
              commercial_effective_rate: cityObj.commercial_rate
            }
            
          }));
        }}
        onSelectSchoolDistrict={(sdObj) => {
          if (!sdObj) return;
          // console.log(sdObj)
          setProjectData((prev) => ({
            ...prev,
            schoolDistrict: sdObj.school_district,
            schoolDistrictTaxRates: {
              ag_homestead_effective_rate: sdObj.ag_homestead_rate > 0 ? sdObj.ag_homestead_rate : prev.taxRates!.homestead,
              ag_non_homestead_effective_rate: sdObj.ag_non_homestead_rate > 0 ? sdObj.ag_non_homestead_rate : prev.taxRates!.nonHomestead,
              commercial_effective_rate: sdObj.commercial_rate > 0 ? sdObj.commercial_rate : prev.taxRates!.commercial
            }
          }));
        }}
      />

      <br></br>
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
        Estimated Solar Capacity Factor:
        <input
          type="number"
          step="0.1"
          name="solarEstimatedCapacityFactor"
          value={projectData.solarEstimatedCapacityFactor ?? ""}
          onChange={handleChange}
          className="basicInputBox"
        />
      </label>


      {projectData.pilotAgreement && (
        <label>
          Enter the PILOT Annual Payment amount ($):
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
