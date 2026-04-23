"use client";

import { useEffect, useState, useRef } from "react";
import { Jurisdiction, ProjectData } from "@/types/OHProject";

export interface TaxData {
  county_name: string;
  taxing_district: number;
  taxing_district_name: string;
  gross_tax_rate: number;
  taxing_district_number: number;
  avg_land_market_value: number;
  jurisdictions: Jurisdiction[];

  // TODO: Add other data as needed.
}

interface Props {
  stateName: string;
  onSelectLocation?: (data: TaxData | null) => void;
  projectData: ProjectData;
  setProjectData: React.Dispatch<React.SetStateAction<ProjectData>>;
}

export default function LocationSelector({
  stateName,
  onSelectLocation,
  projectData,
  setProjectData,
}: Props) {
  const [allDistricts, setAllDistricts] = useState<TaxData[]>([]);
  const [cauvData, setCauvData] = useState<any[]>([]);
  const [allOhioTaxData, setAllOhioTaxData] = useState<any[]>([]);
  const taxDataRef = useRef<any[]>([]);

  const [counties, setCounties] = useState<string[]>([]);
  const [districts, setDistricts] = useState<TaxData[]>([]);
  
  const [selectedCounty, setSelectedCounty] = useState<string>("");
  const [selectedDistrictNum, setSelectedDistrictNum] = useState<string>("");


  useEffect(() => {
    // Fetch data from all three tables.
    Promise.all([
      fetch(`/api/ohio/ohio_gross_tax`).then(res => res.json()),
      fetch(`/api/ohio/ohio_cauv_county_data`).then(res => res.json()),
      fetch(`/api/ohio/ohio_tax_data`).then(res => res.json())
    ]).then(([taxRes, cauvRes, detailRes]) => {
      const detailCounties = detailRes.counties || [];
    setAllDistricts(taxRes.counties || []);
    setCauvData(cauvRes.counties || []);
    
    // Set BOTH state and ref
    setAllOhioTaxData(detailCounties);
    taxDataRef.current = detailCounties; 

    const uniqueCounties = Array.from(new Set(taxRes.counties.map((r: any) => r.county_name))).sort();
    setCounties(uniqueCounties as string[]);
    });
  }, []);

    const handleCountyChange = (countyName: string) => {
      setSelectedCounty(countyName);
      setSelectedDistrictNum("");
    
      // Filter taxing districts.
      const filtered = allDistricts.filter(r => r.county_name === countyName);
      setDistricts(filtered);

      // Find the land value & CAUV for selected county.
      const countyLandInfo = cauvData.find(c => c.county_name?.toLowerCase() === countyName?.toLowerCase());
        if (countyLandInfo) {

        const val = countyLandInfo.avg_market_value_by_total_acres || countyLandInfo.avg_land_market_value;
        const cauv_val = countyLandInfo.cauv_100_percent_valuation_total_acres || countyLandInfo.cauv_100_percent_valuation_total_acres;

        console.log("CAUV data sample: ", cauvData[0]);
        console.log("Found county info: ", countyLandInfo);

        setProjectData(prev => ({
          ...prev,
          avg_land_market_value: Number(val) || 0,
          cauv_100_percent_valuation_total_acres: Number(cauv_val) || 0
        }));
      }
    };

    const handleDistrictChange = (val: string) => {
      const selectedId = String(val).trim();
      setSelectedDistrictNum(selectedId);

      if (!selectedCounty) return;

  
      const districtInfo = allDistricts.find(
        (d) => 
          String(d.taxing_district_number).trim() === selectedId &&
          d.county_name?.toLowerCase() === selectedCounty.toLowerCase()
      );


      const componentUnits = taxDataRef.current.filter(
        (unit) => 
          String(unit.taxing_district_number).trim() === selectedId &&
          unit.county_name?.toLowerCase() === selectedCounty.toLowerCase()
      );

      if (componentUnits.length === 0) {
        console.warn("No units found for this specific county/district combination.");
        return; 
      }

      const jurisdictions: Jurisdiction[] = componentUnits.map((unit) => ({
        political_unit_name: unit.political_unit_name,
        class_i_tax_rate: unit.class_i_tax_rate,
        class_ii_tax_rate: unit.class_ii_tax_rate,
        gross_tax_rate: unit.gross_tax_rate,
        previous_farmland: 0,
        qep_base_revenue: 0,
        qep_discretionary_revenue: 0,
      }));

      if (onSelectLocation && districtInfo) {
        onSelectLocation({
          ...districtInfo,
          jurisdictions: jurisdictions,
        });
      }
    };

  // Reset handler for resetting location details to the default from the selected location.
  const handleResetCountyDefaults = () => {
    if (!selectedCounty) return;

    const countyLandInfo = cauvData.find(
      c => c.county_name?.toLowerCase() === selectedCounty?.toLowerCase());
        
      if (countyLandInfo) {
        const val = countyLandInfo.avg_market_value_by_total_acres || countyLandInfo.avg_land_market_value;
        const cauv_val = countyLandInfo.cauv_100_percent_valuation_total_acres || countyLandInfo.cauv_100_percent_valuation_total_acres;

    
      setProjectData(prev => ({
        ...prev,
        avg_land_market_value: Number(val) || 0,
        cauv_100_percent_valuation_total_acres: Number(cauv_val) || 0,
      }));
    }
  };

  // Helper to get the default data for the current selection
  const getDefaultData = () => {
    if (!selectedCounty) return null;
    return cauvData.find((c) => c.county_name?.toLowerCase() === selectedCounty.toLowerCase());
  };

  // Determines if the warning should show or not for values that can be manually overridden.
  const officialInfo = getDefaultData();
  
  const isMarketValueOverridden =
    officialInfo &&
    projectData.avg_land_market_value !==
      Number(officialInfo.avg_market_value_by_total_acres || officialInfo.avg_land_market_value);

  const isCauvOverridden =
    officialInfo &&
    projectData.cauv_100_percent_valuation_total_acres !==
      Number(officialInfo.cauv_100_percent_valuation_total_acres);

  // Warning message helper.
  const WarningMessage = () => (
    <>
      <br />
      <p className="warning">
        <img src="/photos-logos/warning-alert.svg" alt="Warning sign logo." className="warningImg" />
        <span>
          WARNING: This value is manually overridden. Click "Reset to Defaults" to restore automatic calculation.
        </span>
      </p>
      <br />
    </>
  );
    return (
      <div>
        {console.log("DROPDOWN CHECK:", {
          currentValue: selectedDistrictNum,
          availableOptions: districts.map(d => d.taxing_district_number)
        })}
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
      <div className="required">Required</div>
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
        onChange={(e) => setProjectData(prev => ({
          ...prev,
          avg_land_market_value: Number(e.target.value)
        }))}
        className="basicInputBox"
      />
    </label>
    {isMarketValueOverridden && <WarningMessage />}

    <label>
      CAUV of Agricultural Land ($/Acre):
      <input
        type="number"
        name="userCauvAgLand"
        value={projectData.cauv_100_percent_valuation_total_acres}
        onChange={(e) => setProjectData(prev => ({
          ...prev,
          cauv_100_percent_valuation_total_acres: Number(e.target.value)
        }))}
        className="basicInputBox"
      />
    </label>
    {isCauvOverridden && <WarningMessage />}

      <br></br>

      <button type="button" onClick={handleResetCountyDefaults} className="inPageButton">
        Reset to county default
      </button>
    </div>
  );
}
