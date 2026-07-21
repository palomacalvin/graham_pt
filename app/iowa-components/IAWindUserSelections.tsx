"use client";

import { ProjectData } from "@/types/IAWindProject";
import LocationSelector, { County, SchoolDistrict } from "../../components/IALocationSelector";
import { useState } from "react";
import { useEffect } from "react";
import AllFieldsRequired from "@/components/AllFieldsRequired";


interface Props {
    projectData: ProjectData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    setProjectData: React.Dispatch<React.SetStateAction<ProjectData>>;
    onSelectCounty?: (county: County | null) => void;
}

// Interface for the utility data.
interface UtilityData {
    name_of_utility: string;
    delivery_tax_rate_per_kwh: number;
    delivery_tax_rate_per_mwh: number;
}

// Interface for the city data.
interface CityData {
    county_name: string;
    city_name: string;
    regular_without_ag: number;
    debt_service: number;
    employ_benefit: number;
    capital_improve: number;
}

const MAX_USEFUL_LIFE = 35;


export default function IAWindUserSelections({
  projectData,
  handleChange,
  setProjectData,
}: Props) {

    // Define inflation and discount rate using project data inputs.
    const inflation = (projectData.inflation_rate?? 0) * 100;
    const discount = (projectData.discount_rate ?? 0) * 100;

    // Default details.
    const DEFAULT_PROJECT_DETAILS = {
      inflation_rate: 0.025, 
      discount_rate: 0.03,
      auto_calculate_costs: true,
    };

    // Handle resetting to default.
    const handleResetDefaults = () => {
      setProjectData((prev) => ({
          ...prev,
          ...DEFAULT_PROJECT_DETAILS,
      }));
    };

    const [selectedCounty, setSelectedCounty] = useState<County | null>(null);
    const [userEditedAcreage, setUserEditedAcreage] = useState(false);
    const [userEditedSolarRelation, setUserEditedSolarRelation] = useState(false);

    // State to hold fetched utilities data.
    const [utilities, setUtilities] = useState<UtilityData[]>([]);
    const [isLoadingUtilities, setIsLoadingUtilities] = useState(false);

    // State to hold fetched city data.
    const [allCities, setAllCities] = useState<CityData[]>([]);
    const [filteredCities, setFilteredCities] = useState<CityData[]>([]);

    // Fetch utility data on component mount
    useEffect(() => {
        async function fetchUtilities() {
            setIsLoadingUtilities(true);
            try {
                const res = await fetch("/api/iowa/delivery_tax_rate_data"); 
                if (!res.ok) throw new Error("Failed to fetch utilities");
                const data = await res.json();
                setUtilities(data.utility || []);
            } catch (err) {
                console.error("Error fetching utilities:", err);
            } finally {
                setIsLoadingUtilities(false);
            }
        }
        fetchUtilities();
    }, []);


    // Handle selection changes in the utility dropdown
    const handleUtilityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedName = e.target.value;
        const selectedUtility = utilities.find(u => u.name_of_utility === selectedName);

        setProjectData((prev) => ({
            ...prev,
            utility_service_area: selectedName,
            delivery_tax_rate_per_kwh: selectedUtility?.delivery_tax_rate_per_kwh || 0,
            delivery_tax_rate_per_mwh: selectedUtility?.delivery_tax_rate_per_mwh || 0,
        }));
    };

    useEffect(() => {
        if (userEditedAcreage) return;

        setProjectData(prev => ({
            ...prev,
            land_area: prev.number_of_turbines * 1
        }));
    }, [projectData.number_of_turbines, userEditedAcreage]);



    useEffect(() => {
        async function fetchCities() {
            try {
                const res = await fetch("/api/iowa/city_data"); 
                if (!res.ok) throw new Error("Failed to fetch cities");
                const data = await res.json();
                setAllCities(data.cities || []);
            } catch (err) {
                console.error("Error fetching cities:", err);
            }
        }
        fetchCities();
    }, []);

    // Update filtered cities whenever the county changes
    useEffect(() => {
        if (projectData.county_name) {
            const filtered = allCities.filter(
                (c) => c.county_name.toUpperCase() === projectData.county_name.toUpperCase()
            );
            setFilteredCities(filtered);
        } else {
            setFilteredCities([]);
        }
    }, [projectData.county_name, allCities]);

  return (
    <>
    <section>
      <h1 className="page-section-title">Project Information</h1>

      <AllFieldsRequired />

      <br></br>
      <LocationSelector
        stateName="IOWA"
        onSelectCounty={(county) => {
            console.log("Selected county:", county)
            setProjectData((prev) => ({
                ...prev,
                county_name: county?.county_name || "",
                productivity_per_acre: county?.productivity_per_acre || 0,
                ag_rollback: county?.ag_rollback || 0,
            }));
        }}
        onSelectSchoolDistrict={(schoolDistrict) => {
            console.log("Selected School District:", schoolDistrict);
            setProjectData((prev) => ({
              ...prev,
              school_district_name: schoolDistrict?.sd_name || "",
              school_total_rate: schoolDistrict?.total_rate || 0,
              school_voted_ppel: schoolDistrict?.voted_ppel || 0,
            }));
          }}
        />
        <br></br>
            <>
                <label>
                    Nameplate Capacity (in mega-watts)
                    <input
                        type="number"
                        name="nameplate_capacity"
                        value={projectData.nameplate_capacity}
                        onChange={handleChange}
                        className="basicInputBox"
                    />
                </label>
            
                    <label>
                        Number of Turbines
                        <input
                        type="number"
                        name="number_of_turbines"
                        value={projectData.number_of_turbines || ""}
                        onChange={handleChange}
                        className="basicInputBox"
                        />
                    </label>

                    <label className="inputWithInfo">
                        Project acreage under turbines:
                        <input
                            type="number"
                            name="land_area"
                            value={projectData.land_area}
                            onChange={(e) => {
                                setUserEditedAcreage(true);
                                handleChange(e);
                            }}
                            className="basicInputBox"
                        />

                        <div className="infoWrapper">
                        <img src="/photos-logos/information-bubble.svg" alt="Vector graphic information bubble"></img>
                        <div className="infoBubble">
                            For wind projects, we assume that total acreage is equivalent to the total number of turbines (1 turbine = 1 acre).
                        </div>
                        </div>
                    </label>

                    {userEditedAcreage && (

                    <div className="warning-alert-box">
                        <img
                            src="/photos-logos/warning-alert.svg"
                            alt="Warning sign logo."
                            className="warning-alert-icon"
                        />
                        <span className="warning-alert-text">
                            <strong>WARNING:</strong> Acreage is manually overridden. 
                            Click <em>"Reset Turbines to Default"</em> to restore automatic calculation from turbine totals.
                        </span>
                    </div>
                )}
            <br></br>

            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <button
                    type="button"
                    onClick={() => {
                    setUserEditedAcreage(false);
                    setProjectData(prev => ({
                        ...prev,
                        land_area: prev.number_of_turbines * 1
                    }));
                    }}
                    className="inPageButton"
                >
                    Reset Acreage to Match Turbines
                </button>

                <button
                    type="button"
                    onClick={() => {
                    setUserEditedAcreage(false);
                    setProjectData(prev => ({
                        ...prev,
                        nameplate_capacity: 100,
                        number_of_turbines: 50,
                        land_area: 50,
                    }));
                    }}
                    className="inPageButton"
                >
                    Reset All Inputs
                </button>
                </div>
            </>

            <br></br>

            <label>
                Use the estimated Wind Project Net Acquisition cost ($1,000,000/mega-watt)?
                <select
                    name="use_estimated_wind_net_acquisition_cost"
                    value={projectData.use_estimated_wind_net_acquisition_cost || ""}
                    onChange={handleChange} // Let parent standard state handling process it cleanly
                    className="basicInputBox"
                >
                    <option value="">-- Choose Option --</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                </select>
            </label>

            <br></br>

            {projectData.use_estimated_wind_net_acquisition_cost === 'no' && (

                <>
                <div>
                    <label>
                        Enter a custom wind project net acquisition cost:
                    </label>
                    <input 
                        type="number"
                        name="wind_net_acquisition_cost"
                        value={projectData.wind_net_acquisition_cost || ""}
                        onChange={handleChange}
                        className="basicInputBox"
                        placeholder="Enter value"
                    />
                    <p className="required">Required</p>
                    <br></br>
                </div>
            </>
            )}
        </section>

        <h1 className="page-section-title">Inflation Factors</h1>

        <AllFieldsRequired />

        <br></br>

        <label>
            Average annual inflation rate (%):
            <div className="inputWithInfo">
                <input
                    type="number"
                    step="0.01"
                    value={Math.round(projectData.inflation_rate * 10000) / 100} // Displays as 2.7%
                    onChange={(e) =>
                    setProjectData((prev) => ({
                        ...prev,
                        inflation_rate: e.target.value === "" ? 0 : parseFloat(e.target.value) / 100
                    }))
                    }
                    className="basicInputBox"
                />

                <div className="infoWrapper">
                    <img src="/photos-logos/information-bubble.svg" alt="Vector graphic information bubble"></img>
                    <div className="infoBubble">
                        The default number (2.5%) represents the average 
                        annual inflation rate multiplier from the {" "}
                        <a style={{textDecoration: "underline"}} target="_blank" 
                        href="https://data.bls.gov/pdq/SurveyOutputServlet">U.S. Bureau of Labor Statistics</a> {" "}
                        between 1995 and 2025.
                        The default multiplier translates to a 2.5% average annual inflation rate. 
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
                    value={projectData.discount_rate * 100} // Display as 3%
                    onChange={(e) =>
                    setProjectData((prev) => ({
                        ...prev,
                        discount_rate: e.target.value === "" ? 0 : parseFloat(e.target.value) / 100,
                    }))
                    }
                    className="basicInputBox"
                />
                <div className="infoWrapper">
                    <img src="/photos-logos/information-bubble.svg" alt="Vector graphic information bubble"></img>
                    <div className="infoBubble">
                        The default discount rate of 3.0% comes from {" "}
                        <a style={{ textDecoration: "underline" }} 
                        target="_blank" 
                        href="https://nvlpubs.nist.gov/nistpubs/ir/2023/NIST.IR.85-3273-38.pdf">FEMP guidelines for analyzing renewable energy projects for federal agencies</a>.
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
                Reset Inflation Factors
            </button>

        <section>
        <br></br>
        
        <label>
                Expected useful economic life of the project (years):
                <div className="inputWithInfo">
                    <input
                        type="number"
                        step="1"
                        min={1}
                        max={MAX_USEFUL_LIFE}
                        value={projectData.expected_useful_life ?? 30}
                    onChange={(e) => {
                        let value = parseInt(e.target.value, 10) || 1;

                        // Cap value at 35.
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

            <br></br>

            <label>
                Is the project located in a city, or is it located outside of 
                city boundaries?
                <select
                    value={projectData.city_rural_classification}
                    onChange={(e) => {
                        const val = e.target.value;
                        setProjectData((prev) => ({
                            ...prev,
                            city_rural_classification: val,
                            is_located_in_city: val === "city"
                        }));
                    }}
                    className="basicInputBox"
                >
                    <option value="">-- Choose Option --</option>
                    <option value="city">City</option>
                    <option value="rural">Rural</option>
                </select>
            </label>

            {projectData.city_rural_classification === 'city' && (
                <div>
                    <label></label>
                    <select 
                        name="city_name"
                        value={projectData.city_name || ""}
                        onChange={(e) => {
                            const selectedCity = filteredCities.find(c => c.city_name === e.target.value);
                            
                            // Sum all components for the fallback rate
                            const totalCityRate = selectedCity 
                                ? (selectedCity.regular_without_ag + 
                                selectedCity.debt_service + 
                                selectedCity.employ_benefit + 
                                selectedCity.capital_improve)
                                : 0;

                            setProjectData(prev => ({
                                ...prev,
                                city_name: e.target.value,
                                city_regular_rate: totalCityRate 
                            }));
                        }}
                        className="basicInputBox"
                    >
                        <option value="">-- Select a City --</option>
                        {filteredCities.map((city) => (
                            <option key={city.city_name} value={city.city_name}>
                                {city.city_name}
                            </option>
                        ))}
                    </select>
                    <p className="required">Required</p>
                    <br />
                </div>
            )}

            <br></br>

            <label>
                Is the project located in a Tax Increment Financing (TIF) district?
                <select
                    value={projectData.is_project_tif}
                    onChange={(e) =>
                        setProjectData((prev) => ({
                            ...prev,
                            is_project_tif: e.target.value,
                        }))
                    }
                    className="basicInputBox"
                >
                <option value="">-- Choose Option --</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
                </select>
                <p className="required">Required</p>
            </label>

            <br></br>

            {projectData.is_project_tif === 'yes' && (

                <>
                <div>
                    <label>
                        Enter the percentage of the project's new assessed value
                        that is allocated to the TIF district (%):
                    </label>
                    <input 
                        type="number"
                        name="tif_percentage"
                        value={projectData.tif_percentage || ""}
                        onChange={handleChange}
                        className="basicInputBox"
                        placeholder="Enter value"
                    /> %
                    <p className="required">Required</p>
                    <br></br>
                </div>
            </>
            )}
        </section>

        <br></br>

    </>
    
  );
}
