"use client";

import { ProjectData } from "@/types/MNSolarProject";
import LocationSelector from "../../components/LocationSelector";
import { County } from "@/components/LocationSelector";
import { useEffect } from "react";
import { useState } from "react";


interface Props {
  projectData: ProjectData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  setProjectData: React.Dispatch<React.SetStateAction<ProjectData>>;
  countyAvgValue: number;
  userEditedLandValue: boolean;
  onSelectCounty?: (county: County | null) => void
}

// console.log("MNSolarProjectLocationSection rendered");

const MAX_USEFUL_LIFE = 35;

export default function MNSolarProjectLocationSection({
  projectData,
  handleChange,
  setProjectData,
  countyAvgValue,
  userEditedLandValue
}: Props) {

  const inflation = (projectData.inflationRate?? 0) * 100;
  const discount = (projectData.discountRate ?? 0) * 100;


  useEffect(() => {
      if (!projectData.auto_calculate_costs) return;
      if (!projectData.nameplateCapacity) return;

      const base_cost = projectData.nameplateCapacity * 1_000_000;

      setProjectData((prev) => ({
          ...prev,
          original_cost_pre_inverter: base_cost * 0.9,
          original_cost_post_inverter: base_cost * 0.1,
      }));
  }, [projectData.nameplateCapacity, projectData.auto_calculate_costs]);

  const DEFAULT_PROJECT_DETAILS = {
      inflationRate: 0.027,
      discountRate: 0.03,
      auto_calculate_costs: true,
  };

  const handleResetDefaults = () => {
      setProjectData((prev) => ({
          ...prev,
          ...DEFAULT_PROJECT_DETAILS,
      }));
  };

  const [selectedCounty, setSelectedCounty] = useState<County | null>(null);

  // Reset handler for resetting location details to the default from the selected location.
  const handleResetCountyDefaults = () => {
    if (!selectedCounty) return;

    setProjectData((prev) => ({
      ...prev,
      userLandValue: selectedCounty.avg_solar_irradiance ?? prev.userLandValue,
      solarEstimatedCapacityFactor:
        selectedCounty.solar_estimated_capacity_factor ?? prev.solarEstimatedCapacityFactor,
    }));
  };



  return (
    <>
    <section>
      <h1>Project Location Information</h1>
      <br></br>

      <p style={{ color: "red", fontStyle: "italic"}}>
        All fields in this section are required. You may choose to
        use the defaults listed below, or override them with values relevant to
        your project.
      </p>

      <br></br>
      <LocationSelector
        stateName="MINNESOTA"
        onSelectCounty={(county) => {
          setSelectedCounty(county);
          setProjectData((prev) => ({
            ...prev,
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
      
      <p>
        Note that the County Average Land Market Value and the Estimated Solar Capacity Factor
        defaults are determined based on the county, city/town, and school district you select. You may
        manually override these values, or select a different location to see new defaults.
      </p>

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
        <button type="button" onClick={handleResetCountyDefaults} className="inPageButton">
          Reset to county default
        </button>
      </label>


      <label>
        Estimated Solar Capacity Factor:
        <input
          type="number"
          step="0.001"
          name="solarEstimatedCapacityFactor"
          value={projectData.solarEstimatedCapacityFactor ?? ""}
          onChange={handleChange}
          className="basicInputBox"
        />

        <button type="button" onClick={handleResetCountyDefaults} className="inPageButton">
          Reset to county default
        </button>
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
      

      <br></br>

      <h1>Inflation Factors</h1>
      <br></br>

      <label>
        Average annual inflation rate (%):
        <div className="inputWithInfo">
            <input
                type="number"
                step="0.01"
                value={projectData.inflationRate != null ? projectData.inflationRate * 100 : ""}
                onChange={(e) =>
                setProjectData((prev) => ({
                    ...prev,
                    inflationRate: e.target.value === "" ? 0 : parseFloat(e.target.value) / 100
                }))
                }
                className="basicInputBox"
            />

            <div className="infoWrapper">
                <img src="/photos-logos/information-bubble.svg" alt="Vector graphic information bubble"></img>
                <div className="infoBubble">
                    The default number (2.4%) represents the average 
                    annual inflation rate multiplier from the {" "}
                    <a style={{textDecoration: "underline"}} target="_blank" href="https://www.revenue.state.mn.us/press-release/2025-12-16/minnesota-income-tax-brackets-standard-deduction-and-dependent-exemption#:~:text=For%20tax%20year%202026%2C%20the,inflationary%20changes%20in%20their%20income">Minnesota Department of 
                    Revenue</a>.
                    The default multiplier translates to a 2.4% average annual inflation rate. 
                    Users can override this default number and enter their own estimated 
                    average annual inflation rate multiplier if they prefer.
                </div>
            </div>
        </div>
    </label>

    <label>
        Annual discount rate (%):
        <div className="inputWithInfo">
            <input
                type="number"
                step="0.01"
                value={projectData.discountRate != null ? projectData.discountRate * 100 : ""}
                onChange={(e) =>
                setProjectData((prev) => ({
                    ...prev,
                    discountRate: e.target.value === "" ? 0 : parseFloat(e.target.value) / 100,
                }))
                }
                className="basicInputBox"
            />
              <div className="infoWrapper">
                <img src="/photos-logos/information-bubble.svg" alt="Vector graphic information bubble"></img>
                <div className="infoBubble">
                    The default discount rate of 3.0% comes from {" "}
                    <a style={{ textDecoration: "underline" }} target="_blank" href="https://nvlpubs.nist.gov/nistpubs/ir/2023/NIST.IR.85-3273-38.pdf">FEMP guidelines for analyzing renewable energy projects for federal agencies</a>.
                    Users can override this default rate and enter their own estimated 
                    discount rate if they prefer.
                </div>
            </div>
          </div>
        </label>

        <br></br>

        <button
          type="button"
          onClick={handleResetDefaults}
          className="inPageButton"
        >
          Reset inflation factors
        </button>
    </section>

    <section>
      <label>
            Expected useful economic life of project (years):
            <div className="inputWithInfo">
                <input
                    type="number"
                    step="1"
                    min={1}
                    max={MAX_USEFUL_LIFE}
                    value={projectData.expected_useful_life ?? 30}
                   onChange={(e) => {
                      let value = parseInt(e.target.value, 10) || 1;

                      // Cap value at 35
                      if (value > MAX_USEFUL_LIFE) value = MAX_USEFUL_LIFE;

                      setProjectData((prev) => ({
                        ...prev,
                        expected_useful_life: value,
                      }));
                    }}
                className="basicInputBox"
                />

                <div className="infoWrapper">
                    <img src="/photos-logos/information-bubble.svg" alt="Vector graphic information bubble"></img>
                    <div className="infoBubble">
                        Note: This calculator can only calculate revenues up to 35 years.
                    </div>
                </div>
            </div>
        </label>
    </section>
    </>
  );
}
