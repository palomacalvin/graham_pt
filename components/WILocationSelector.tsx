"use client";

import { useEffect, useState } from "react";

export interface County {
  county_name: string;

  // Conversion rates.
  over_30_acres: number;
  between_10_and_30_acres: number;
  under_10_acres: number;
}

interface Municipality {
  county_name: string;

  // Locality details.
  code: string;
  tvc: string;
  municipality: string;

  // Locality properties.
  grade_1: number;
  grade_2: number;
  grade_3: number;
  pasture: number;

  // Tax rates.
  gross_rate: number;
  effective_rate: number;
  total_property_tax: number;
  school_tax: number;
  college_tax: number;
  county_tax: number;
  local_tax: number;
  other_tax: number;
}


interface Props {
  stateName: string;

  onSelectCounty?: (county: County | null) => void;
  onSelectMunicipality?: (municipality: Municipality | null) => void;
  onSelectCity?: (municipality: Municipality | null) => void;

}

export default function LocationSelector({
  stateName,
  onSelectCounty,
  onSelectMunicipality,
}: Props) {
  const [counties, setCounties] = useState<County[]>([]);
  const [selectedCounty, setSelectedCounty] = useState<County | null>(null);

  const [cities, setMunicipalities] = useState<Municipality[]>([]);
  const [selectedMunicipality, setSelectedMunicipality] = useState<Municipality | null>(null);

  // Fetch counties
  useEffect(() => {
    fetch(`/api/wisconsin/conversion_rates?state=${stateName}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("County API response:", data);

        if (Array.isArray(data)) {
          setCounties(data);
        } else if (Array.isArray(data?.counties)) {
          setCounties(data.counties);
        } else {
          setCounties([]); // ← critical
        }
      })
      .catch((err) => {
        console.error("Error fetching counties:", err);
        setCounties([]);
      });
  }, [stateName]);


  // Fetch cities for county
  useEffect(() => {
    if (!selectedCounty) {
      setMunicipalities([]);
      return;
    }

    fetch(`/api/wisconsin/municipalities?county=${encodeURIComponent(selectedCounty.county_name)}`)
      .then(res => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setMunicipalities(data);
        } else if (Array.isArray(data?.cities)) {
          setMunicipalities(data.cities);
        } else {
          setMunicipalities([]);
        }
      })
      .catch(() => setMunicipalities([]));
  }, [selectedCounty]);




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

            // Reset city value when county changes
            setSelectedMunicipality(null);
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
      </div>

      {/* City Select */}
      <div>
        <select
          value={selectedMunicipality?.code || ""}
          onChange={(e) => {
            const value = e.target.value;

            if (!value) {
              setSelectedMunicipality(null);
              onSelectMunicipality?.(null);
              return;
            }

            const municipalityObj =
              cities.find((m) => m.code === value) || null;

            setSelectedMunicipality(municipalityObj);
            onSelectMunicipality?.(municipalityObj);
          }}
          className="basicDropdown"
          disabled={!selectedCounty || cities.length === 0}
        >
          <option value="">-- Choose Municipality --</option>
          {cities.map((c, i) => (
            <option key={`${c.municipality}-${i}`} value={c.code}>
              {c.municipality} ({c.tvc})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
