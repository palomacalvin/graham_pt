"use client";

import { useEffect, useState } from "react";
import { ProjectData } from "@/types/OHProject";

export interface TaxData {
  county_name: string;
  taxing_district: number;
  taxing_district_name: string;
  gross_tax_rate: number;
  taxing_district_number: number;

  // TODO: Add other data as needed.
}

interface Props {
  stateName: string;
  onSelectLocation?: (data: TaxData | null) => void;
}

export default function LocationSelector({
  stateName,
  onSelectLocation,
}: Props) {
  const [allData, setAllData] = useState<TaxData[]>([]);
  const [counties, setCounties] = useState<string[]>([]);
  const [districts, setDistricts] = useState<TaxData[]>([]);
  
  const [selectedCounty, setSelectedCounty] = useState<string>("");
  const [selectedDistrictNum, setSelectedDistrictNum] = useState<string>("");

  

  // Fetch data.
  useEffect(() => {
    fetch(`/api/ohio/ohio_gross_tax?state=${stateName}`)
        .then((res) => res.json())
        .then((data) => {
          const records: TaxData[] = data.counties || [];
          setAllData(records);

          // Extract unique county names.
          const uniqueCounties = Array.from(new Set(records.map((r) => r.county_name))).sort();
          setCounties(uniqueCounties);
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
      });
  }, [stateName]);

    const handleCountyChange = (countyName: string) => {
      setSelectedCounty(countyName);
      setSelectedDistrictNum("");
      onSelectLocation?.(null);

      const filteredDistricts = allData.filter((r) =>
      r.county_name === countyName)
      .sort((a, b) => a.taxing_district_name.localeCompare(b.taxing_district_name))

      setDistricts(filteredDistricts);
    }

    const handleDistrictChange = (districtNum: string) => {
      setSelectedDistrictNum(districtNum);
      const selection = districts.find(d => String(d.taxing_district_number) === districtNum) ?? null;
      onSelectLocation?.(selection);
    }

    // Reset handler for resetting location details to the default from the selected location.
    const handleResetCountyDefaults = () => {
        if (!selectedCounty) return;

        setCounties((prev) => ({
        ...prev,
          projectData.avg_land_market_value,
        }));
    };

  return (
    <div>

      {/* County Select */}
      <div>
        <select
          value={selectedCounty}
          onChange={(e) => {handleCountyChange(e.target.value)
        }}
          className="basicDropdown"
        >
          <option value="">-- Choose County --</option>
          {counties.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
        <p className="required">Required</p>
      </div>

      <br></br>

      {/* Taxing District Select */}
      <div className={!selectedCounty ? "" : ""}>
        <select
          value={selectedDistrictNum}
          onChange={(e) => handleDistrictChange(e.target.value)}
          disabled={!selectedCounty}
          className="basicDropdown"
        >
          <option value="">-- Choose Taxing District --</option>
          {districts.map((d) => (
            <option key={d.taxing_district_number} value={d.taxing_district_number}>
              {d.taxing_district_name} ({d.taxing_district_number})
            </option>
          ))}
        </select>
      </div>

        <br></br>
      
        <p>
          Note that the County Average Land Market Value defaults are determined based on the county
          and taxing district you select. You may
          manually override these values, or select a different location to see new defaults.
        </p>

        <br></br>

        <label>
          County Average Land Market Value ($/acre):
          <input
            type="number"
            name="userLandValue"
            value={projectData.avg_land_market_value || ""}
            onChange={handleChange}
            className="basicInputBox"
          />
          <button type="button" onClick={handleResetCountyDefaults} className="inPageButton">
            Reset to county default
          </button>
      </label>
    </div>
  );
}
