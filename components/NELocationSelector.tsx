"use client";

import { useEffect, useState } from "react";

export interface County {
  county_name: string;

  // Other data.
  region: string;
  county_avg_for_total_district_tax_rate: number;
  regional_avg_for_market_value_of_ag_land: number;
}

interface Props {
  stateName: string;
  onSelectCounty?: (county: County | null) => void;
}

export default function LocationSelector({
  stateName,
  onSelectCounty,
}: Props) {
  const [counties, setCounties] = useState<County[]>([]);
  const [selectedCounty, setSelectedCounty] = useState<County | null>(null);

  // Fetch counties
  useEffect(() => {
    fetch(`/api/nebraska/nebraska_county_level_data?state=${stateName}`)
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


  return (
    <div className="w-full max-w-xs space-y-4">

      {/* County Select */}
      <div>
        <select
          value={selectedCounty?.county_name || ""}
          onChange={(e) => {
            // console.log("County select changed:", e.target.value);

            const countyObj = counties.find(c => c.county_name === e.target.value) || null;
            // const value = e.target.value || null;
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
    </div>
  );
}
