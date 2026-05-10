"use client";

import { useEffect, useState } from "react";

export interface County {
    county_name: string;
    productivity_per_acre: number;
    five_yr_avg_market_value_per_acre: number;
    ag_building_factor: number;
    ag_land_adjustment: number;
    number_of_ag_acres_in_county: number;
    average_csr_in_county: number;
    ag_rollback: number;
}

export interface SchoolDistrict {
    sd_name: string;
    subtotal_general: number;
    instructional_support: number;
    total_general: number;
    management: number;
    amana_library: number;
    voted_ppel: number;
    reorganization: number;
    playground: number;
    debt_service: number;
    total_rate: number;
    total_levy: number;
    regular_ppel: number;
}

interface Props {
  stateName: string;

  onSelectCounty?: (county: County | null) => void;
  onSelectSchoolDistrict?: (SchoolDistrict: SchoolDistrict | null) => void;

}

export default function LocationSelector({
  stateName,
  onSelectCounty,
  onSelectSchoolDistrict,
}: Props) {
  const [counties, setCounties] = useState<County[]>([]);
  const [schoolDistricts, setSchoolDistricts] = useState<SchoolDistrict[]>([]);
  const [selectedCounty, setSelectedCounty] = useState<County | null>(null);
  const [selectedSchoolDistrict, setSelectedSchoolDistrict] = useState<SchoolDistrict | null>(null);

  // Fetch counties
  useEffect(() => {
    fetch(`/api/iowa/county_tax_data?state=${stateName}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("County API response:", data);

        if (Array.isArray(data)) {
          setCounties(data);
        } else if (Array.isArray(data?.counties)) {
          setCounties(data.counties);
        } else {
          setCounties([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching counties:", err);
        setCounties([]);
      });
  }, [stateName]);

  useEffect(() => {
    fetch(`/api/iowa/school_data`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setSchoolDistricts(data);
        } else if (Array.isArray(data?.schoolDistricts)) {
          setSchoolDistricts(data.schoolDistricts);
        } else {
          setSchoolDistricts([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching school districts:", err);
        setSchoolDistricts([]);
      });
  }, []);

  return (
    <div className="w-full max-w-xs space-y-4">

      {/* County Select */}
      <div>
        <select
          value={selectedCounty?.county_name || ""}
          onChange={(e) => {
            // console.log("County select changed:", e.target.value);

            const countyObj = counties.find(c => c.county_name === e.target.value) || null;
            setSelectedCounty(countyObj);
            onSelectCounty?.(countyObj);
          }}
          className="basicDropdown"
        >
          <option value="">-- Choose County --</option>
          {counties.map((c, i) => (
            <option key={`${c.county_name}-${i}`} value={c.county_name}>
              {c.county_name}
            </option>
          ))}
        </select>
        <p className="required">Required</p>
      </div>
      

      <div className="w-full max-w-xs space-y-4">

      {/* County Select */}
      <div>
        <select
          value={selectedSchoolDistrict?.sd_name || ""}
          onChange={(e) => {
            const sdObj = schoolDistricts.find(c => c.sd_name === e.target.value) || null;
            setSelectedSchoolDistrict(sdObj);
            onSelectSchoolDistrict?.(sdObj);
          }}
          className="basicDropdown"
        >
          <option value="">-- Choose School District --</option>
          {schoolDistricts.map((c, i) => (
            <option key={`${c.sd_name}-${i}`} value={c.sd_name}>
              {c.sd_name}
            </option>
          ))}
        </select>
        <p className="required">Required</p>
      </div>
    </div>
    </div>
  );
}
