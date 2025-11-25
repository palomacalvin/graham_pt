"use client";

import {ProjectData} from "@/types/MNproject";
import LocationSelector from "./LocationSelector";


interface Props {
  projectData: ProjectData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  setProjectData: React.Dispatch<React.SetStateAction<ProjectData>>;
  countyAvgValue: number;
  userEditedLandValue: boolean;
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
        onSelectCounty={(county) =>
          setProjectData((prev) => ({ ...prev, county: county || "" }))
        }
        onSelectCity={(cityObj) => {
          if (!cityObj) return;
          setProjectData((prev) => ({
            ...prev,
            township: cityObj.city_town,
            taxRates: {
              homestead: cityObj.homestead_rate,
              nonHomestead: cityObj.non_homestead_rate,
              commercial: cityObj.commercial_rate
            }
          }));
        }}
        onSelectSchoolDistrict={(sdObj) => {
          if (!sdObj) return;
          setProjectData((prev) => ({
            ...prev,
            schoolDistrict: sdObj.school_district,
            taxRates: {
              homestead: sdObj.homestead_rate > 0 ? sdObj.homestead_rate : prev.taxRates!.homestead,
              nonHomestead: sdObj.non_homestead_rate > 0 ? sdObj.non_homestead_rate : prev.taxRates!.nonHomestead,
              commercial: sdObj.commercial_rate > 0 ? sdObj.commercial_rate : prev.taxRates!.commercial
            }
          }));
        }}
      />

      <label>
        Land Market Value ($/acre):
        <input
          type="number"
          name="userLandValue"
          value={projectData.userLandValue || ""}
          onChange={handleChange}
        />
      </label>

      <label>
        Estimated Capacity Factor:
        <input
          type="number"
          step="0.1"
          name="useEstimatedCapacityFactor"
          value={projectData.useEstimatedCapacityFactor || ""}
          onChange={handleChange}
        />
      </label>

      <label>
        PILOT Agreement:
        <input
          type="checkbox"
          name="pilotAgreement"
          checked={projectData.pilotAgreement}
          onChange={handleChange}
        />
      </label>

      {projectData.pilotAgreement && (
        <label>
          Annual Payment ($):
          <input
            type="number"
            name="pilotPayment"
            value={projectData.pilotPayment || ""}
            onChange={handleChange}
          />
        </label>
      )}
    </section>
  );
}
