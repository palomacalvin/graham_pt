"use client";

import { useEffect, useState } from "react";

export interface County {
  county_name: string;
  ag_homestead_effective_rate: number;
  ag_non_homestead_effective_rate: number;
  commercial_effective_rate: number;

  // Wind fetching.
  est_capacity_factor?: number;

  // Solar fetching.
  solar_estimated_capacity_factor?: number;
  avg_solar_irradiance?: number;

}

interface City {
  city_town: string;
  ag_homestead_rate: number;
  ag_non_homestead_rate: number;
  commercial_rate: number;
}

interface SchoolDistrict {
  school_district: string;
  ag_homestead_rate: number;
  ag_non_homestead_rate: number;
  commercial_rate: number;
}

interface Props {
  stateName: string;

  // UPDATED: city and district now pass full objects, not strings
  onSelectCounty?: (county: County | null) => void;
  onSelectCity?: (city: City | null) => void;
  onSelectSchoolDistrict?: (district: SchoolDistrict | null) => void;
}

export default function LocationSelector({
  stateName,
  onSelectCounty,
  onSelectCity,
  onSelectSchoolDistrict,
}: Props) {
  const [counties, setCounties] = useState<County[]>([]);
  const [selectedCounty, setSelectedCounty] = useState<County | null>(null);

  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  const [schoolDistricts, setSchoolDistricts] = useState<SchoolDistrict[]>([]);
  const [selectedSchoolDistrict, setSelectedSchoolDistrict] =
  
  useState<SchoolDistrict | null>(null);

  // Fetch counties
  useEffect(() => {
    fetch(`/api/minnesota/location?state=${stateName}`)
      .then((res) => res.json())
      .then((data) => setCounties(data.counties))
      .catch((err) => console.error("Error fetching counties:", err));
  }, [stateName]);

  // Fetch cities for county
  useEffect(() => {
    if (!selectedCounty) {
      setCities([]);
      setSelectedCity(null);
      return;
    }

    fetch(`/api/minnesota/location/cities?county=${encodeURIComponent(selectedCounty?.county_name)}`)
      .then((res) => res.json())
      .then((data) => setCities(data.cities))
      .catch((err) => console.error("Error fetching cities:", err));
  }, [selectedCounty, selectedSchoolDistrict, selectedCity]);


  // Fetch school districts for county
  useEffect(() => {
    if (!selectedCounty) {
      setSchoolDistricts([]);
      setSelectedSchoolDistrict(null);
      return;
    }

    fetch(`/api/minnesota/location/school-districts?county=${encodeURIComponent(selectedCounty?.county_name)}`)
      .then((res) => res.json())
      .then((data) => setSchoolDistricts(data.schoolDistricts))
      .catch((err) => console.error("Error fetching school districts:", err));
  }, [selectedCounty, selectedSchoolDistrict, selectedCity]);

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

            // reset city + school district when county changes
            setSelectedCity(null);
            setSelectedSchoolDistrict(null);
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
          value={selectedCity ? JSON.stringify(selectedCity) : ""}
          onChange={(e) => {
            if (!e.target.value) {
              setSelectedCity(null);
              onSelectCity?.(null);
              return;
            }

            const parsedCity: City = JSON.parse(e.target.value);
            setSelectedCity(parsedCity);
            onSelectCity?.(parsedCity);
          }}
          className="basicDropdown"
          disabled={!selectedCounty || cities.length === 0}
        >
          <option value="">-- Choose City/Town --</option>
          {cities.map((c, i) => (
            <option key={`${c.city_town}-${i}`} value={JSON.stringify(c)}>
              {c.city_town}
            </option>
          ))}
        </select>
      </div>

      {/* School District Select */}
      <div>
        <select
          value={selectedSchoolDistrict ? JSON.stringify(selectedSchoolDistrict) : ""}
          onChange={(e) => {
            if (!e.target.value) {
              setSelectedSchoolDistrict(null);
              onSelectSchoolDistrict?.(null);
              return;
            }

            const parsedSD: SchoolDistrict = JSON.parse(e.target.value);
            setSelectedSchoolDistrict(parsedSD);
            onSelectSchoolDistrict?.(parsedSD);
          }}
          className="basicDropdown"
          disabled={!selectedCounty || schoolDistricts.length === 0}
        >
          <option value="">-- Choose School District --</option>
          {schoolDistricts.map((sd, i) => (
            <option key={`${sd.school_district}-${i}`} value={JSON.stringify(sd)}>
              {sd.school_district}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
