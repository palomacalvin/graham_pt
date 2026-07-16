"use client";

import { ProjectData } from "@/types/IASolarProject";
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


export default function IASolarUserSelections({
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

    useEffect(() => {
        if (userEditedSolarRelation) return;

        setProjectData(prev => ({
            ...prev,
            land_area: prev.nameplate_capacity * 7
        }));
    }, [projectData.nameplate_capacity, userEditedSolarRelation]);

    // Handle selection changes in the utility dropdown
    const handleUtilityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedName = e.target.value;
        const selectedUtility = utilities.find(u => u.name_of_utility === selectedName);

        setProjectData((prev) => ({
            ...prev,
            utility_service_area: selectedName,
            // Save the rate directly to state.
            delivery_tax_rate_per_kwh: selectedUtility?.delivery_tax_rate_per_kwh || 0, 
        }));
    };

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

    const displayCapacityFactor = projectData.use_avg_solar_capacity_factor === "yes"
        ? 23.4
        : (projectData.avg_solar_capacity_factor || 0);

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
            setSelectedCounty(county);
            setProjectData((prev) => ({
                ...prev,
                county_name: county?.county_name || "",
                productivity_per_acre: county?.productivity_per_acre || 0,
                ag_rollback: county?.ag_rollback || 0,
                average_csr_in_county: county?.average_csr_in_county || 0,
            }));
        }}
        onSelectSchoolDistrict={(schoolDistrict) => {
            console.log("Selected School District:", schoolDistrict);
            setProjectData((prev) => ({
                ...prev,
                school_district: schoolDistrict?.sd_name || "",
                school_district_name: schoolDistrict?.sd_name || "",
                school_total_rate: schoolDistrict?.total_rate || 0,
                school_voted_ppel: schoolDistrict?.voted_ppel || 0,
            }));
          }}
        />
        <br></br>
            <>
                <label>
                    Nameplate Capacity (in mega-watts):
                    <input
                        type="number"
                        name="nameplate_capacity"
                        value={projectData.nameplate_capacity}
                        onChange={(e) => {
                            const newCapacity = Number(e.target.value);

                            setProjectData(prev => {
                                const expectedAcreage = newCapacity * 7;

                                return {
                                ...prev,
                                nameplate_capacity: newCapacity,
                                land_area: userEditedSolarRelation ? prev.land_area : expectedAcreage
                                };
                            });
                            }}
                        className="basicInputBox"
                    />
                </label>
            
                    <label className="inputWithInfo">
                        Fenceline Acres:
                        <input
                            type="number"
                            name="land_area"
                            value={projectData.land_area}
                            onChange={(e) => {
                                setUserEditedSolarRelation(true);
                                handleChange(e);
                            }}
                            className="basicInputBox"
                        />

                        <div className="infoWrapper">
                                <img src="/photos-logos/information-bubble.svg" alt="Vector graphic information bubble"></img>
                                <div className="infoBubble">
                                    For solar projects, we assume 7 fenceline acres per mega-watt.
                                </div>
                        </div>
                    </label>

                    {userEditedSolarRelation && (
                        <>
                        <div className="warning-alert-box">
                            <img
                                src="/photos-logos/warning-alert.svg"
                                alt="Warning sign logo."
                                className="warning-alert-icon"
                            />
                            <span className="warning-alert-text">
                                <strong>WARNING:</strong> Nameplate capacity and fenceline acres are no longer linked.
                                Click <em>"Reset Fenceline Acres to Match Nameplate Capacity"</em> to restore the default relationship.
                            </span>
                        </div>
                        </>
                    )}

                    <br></br>

                    <button
                        type="button"
                        onClick={() => {
                            setUserEditedSolarRelation(false);
                            setProjectData(prev => ({
                            ...prev,
                            land_area: prev.nameplate_capacity * 7
                            }));
                        }}
                        className="inPageButton"
                        >
                        Reset Fenceline Acres to Match Nameplate Capacity
                    </button>
                </>

            <br></br>

            <h1 className="page-section-title">Inflation Factors</h1>

            <AllFieldsRequired />

        <br></br>

        <label>
            Average annual inflation rate:
            <div className="inputWithInfo">
                <input
                    type="number"
                    step="0.01"
                    value={Math.round(projectData.inflation_rate * 10000) / 100}
                    onChange={(e) =>
                    setProjectData((prev) => ({
                        ...prev,
                        inflation_rate: e.target.value === "" ? 0 : parseFloat(e.target.value) / 100
                    }))
                    }
                    className="basicInputBox"
                /> %

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
            Annual discount rate:
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
                /> %

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
        </section>

        <section>
        <br></br>
        
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
        </section>

        <br></br>

        <section>
            <h1 className="page-section-title">Electric Generation Tax Inputs</h1>

            <label>
                Use the Average Solar Capacity Factor?
                <select
                    name="use_avg_solar_capacity_factor"
                    value={projectData.use_avg_solar_capacity_factor}
                    onChange={handleChange}
                    className="basicInputBox"
                >
                    <option value="">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                </select>
            </label>

            {projectData.use_avg_solar_capacity_factor === 'no' && (
                <>
                <div>
                    <label>Enter Custom Solar Capacity Factor:</label>
                    <input 
                        type="number"
                        name="avg_solar_capacity_factor"
                        value={projectData.avg_solar_capacity_factor || ""}
                        onChange={handleChange}
                        className="basicInputBox"
                        placeholder="e.g. 23.4"
                    /> %
                    <p className="required">Required</p>
                    <br></br>
                </div>
            </>
            )}

            <label>
                Total Selected Solar Capacity Factor:
                    <div className="inputWithInfo">

                    <input 
                        type="number"
                        name="avg_solar_capacity_factor_display"
                        value={displayCapacityFactor}
                        className="basicDataBox"
                        readOnly
                    /> %
                </div>
            </label>

            {/* CSR2s */}

            <label className="inputWithInfo">
                Use 2017 County Average CSR2s?
                <select
                    name="use_county_avg_csr2s"
                    value={projectData.use_county_avg_csr2s}
                    onChange={handleChange}
                    className="basicInputBox"
                >
                    <option value="">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                </select>

                <div className="infoWrapper">
                    <img src="/photos-logos/information-bubble.svg" alt="Vector graphic information bubble"></img>
                    <div className="infoBubble">
                        CSR2 refers to Iowa's updated Corn Suitability Rating Index, measuring
                        soil productivity. These indices attempt to capture crop yield changes 
                        over time, and factor into property tax calculations. {" "}
                        <a target="_blank" style={{textDecoration: "underline"}} 
                        href="https://www.fbn.com/community/blog/iowa-corn-suitability-rating-index-csr2">Read more</a>.
                    </div>
                </div>
            </label>

            {projectData.use_county_avg_csr2s === 'no' && (
                <>
                <div>
                    <label>Enter Custom CSR2 Value:</label>
                    <input 
                        type="number"
                        name="county_avg_csr2s"
                        value={projectData.county_avg_csr2s || ""}
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

        <br></br>

        <section>
            <h1 className="page-section-title">Electricity Delivery Tax Inputs</h1>

                <label>
                    Enter proportion of electricity 
                    that is being sold to a utility company vs. 
                    directly to end-users. Enter as a percentage:
                
                <div className="inputWithInfo">
                
                    <input 
                        type="number"
                        name="proportion_electricity_sold_to_utility"
                        value={projectData.proportion_electricity_sold_to_utility || 100}
                        onChange={handleChange}
                        className="basicInputBox"
                        placeholder="Enter percentage"
                    /> %

                    <div className="infoWrapper">
                        <img src="/photos-logos/information-bubble.svg" alt="Vector graphic information bubble"></img>
                        <div className="infoBubble">
                            If the proportion is unknown, we assume a proportion of 100%.
                        </div>
                    </div>
                </div>
            </label>

            <br></br>

            {projectData.proportion_electricity_sold_to_utility < 100 && (
                <>
                    <label>
                        If any proportion of the electricity is being delivered directly to end-users, what utility service area are the end-users located in?
                        <select
                            name="utility_service_area"
                            value={projectData.utility_service_area || ""}
                            onChange={handleUtilityChange}
                            className="basicInputBox"
                            disabled={isLoadingUtilities}
                        >
                            <option value="">{isLoadingUtilities ? "Loading utilities..." : "-- Select Utility Service Area --"}</option>
                            {utilities.map((util) => (
                                <option key={util.name_of_utility} value={util.name_of_utility}>
                                    {util.name_of_utility}
                                </option>
                            ))}
                        </select>
                    </label>
                    <br></br>
                </>
            )}
        
        </section>

        <section>
            <h1 className="page-section-title">Electric Transmission Tax Inputs</h1>

            <label>
                Assume all transmission infrastructure is owned by
                the utility company?
                <select
                    name="all_transmission_infrastructure_utility_owned"
                    value={projectData.all_transmission_infrastructure_utility_owned}
                    onChange={handleChange}
                    className="basicInputBox"
                >
                    <option value="">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                </select>
            </label>

            {projectData.all_transmission_infrastructure_utility_owned === 'no' && (
                <>
                <fieldset>
                    <p>Enter the number of miles of transmission infrastructure
                        owned by project in the voltage categories listed below:
                    </p>

                    <label>
                        4.5 to 100 kV:
                        <input 
                            type="number"
                            name="num_miles_4_5_to_100"
                            value={projectData.num_miles_4_5_to_100 || ""}
                            onChange={handleChange}
                            className="basicInputBox"
                            placeholder="e.g. 10.00"
                        />
                    </label>

                    <label>
                        101 to 150 kV:

                        <input
                            type="number"
                            name="num_miles_101_to_150"
                            value={projectData.num_miles_101_to_150 || ""}
                            onChange={handleChange}
                            className="basicInputBox"
                            placeholder="Enter value"
                        />
                    </label>

                    <label>
                        151 to 300 kV:
                        <input 
                            type="number"
                            name="num_miles_151_to_300"
                            value={projectData.num_miles_151_to_300 || ""}
                            onChange={handleChange}
                            className="basicInputBox"
                            placeholder="Enter value"
                        />
                    </label>

                    <label>
                        More than 300 kV:
                        <input 
                            type="number"
                            name="more_than_300"
                            value={projectData.more_than_300 || ""}
                            onChange={handleChange}
                            className="basicInputBox"
                            placeholder="Enter value"
                        />
                    </label>

                    <br></br>
                </fieldset>
            </>
            )}

        </section>
    </>
  );
}
