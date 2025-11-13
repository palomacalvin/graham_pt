"use client";

import { useEffect, useState } from "react";

interface County {
  county_name: string;
}

interface City {
  city_town: string;
}

interface Props {
  stateName: string;
  onSelectCounty?: (county: string | null) => void;
  onSelectCity?: (city: string | null) => void;
  onSelectSchoolDistrict?: (district: string | null) => void;
}

export default function LocationSelector({
  stateName,
  onSelectCounty,
  onSelectCity,
  onSelectSchoolDistrict,
}: Props) {
  const [counties, setCounties] = useState<County[]>([]);
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null);

  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const [schoolDistricts, setSchoolDistricts] = useState<{ school_district: string }[]>([]);
  const [selectedSchoolDistrict, setSelectedSchoolDistrict] = useState<string | null>(null);

  // Fetch counties on load
  useEffect(() => {
    fetch(`/api/location?state=${stateName}`)
      .then((res) => res.json())
      .then((data) => setCounties(data.counties))
      .catch((err) => console.error("Error fetching counties:", err));
  }, [stateName]);

  // Fetch cities when a county is selected
  useEffect(() => {
    if (!selectedCounty) {
      setCities([]);
      setSelectedCity(null);
      return;
    }

    fetch(`/api/location/cities?county=${encodeURIComponent(selectedCounty.toUpperCase())}`)
      .then((res) => res.json())
      .then((data) => setCities(data.cities))
      .catch((err) => console.error("Error fetching cities:", err));
  }, [selectedCounty]);

  // Fetch school districts when a county is selected
  useEffect(() => {
    if (!selectedCounty) {
      setSchoolDistricts([]);
      setSelectedSchoolDistrict(null);
      return;
    }

    fetch(`/api/location/school-districts?county=${encodeURIComponent(selectedCounty)}`)
      .then((res) => res.json())
      .then((data) => setSchoolDistricts(data.schoolDistricts))
      .catch((err) => console.error("Error fetching school districts:", err));
  }, [selectedCounty]);

  return (
    <div className="w-full max-w-xs space-y-4">
      {/* County Select */}
      <div>
        <select
          value={selectedCounty || ""}
          onChange={(e) => {
            const value = e.target.value || null;
            setSelectedCounty(value);
            setSelectedCity(null);
            setSelectedSchoolDistrict(null);
            onSelectCounty?.(value);
          }}
          className="w-full p-2 border border-gray-400 rounded bg-white text-black"
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
          value={selectedCity || ""}
          onChange={(e) => {
            const value = e.target.value || null;
            setSelectedCity(value);
            onSelectCity?.(value);
          }}
          className="w-full p-2 border border-gray-400 rounded bg-white text-black"
          disabled={!selectedCounty || cities.length === 0}
        >
          <option value="">-- Choose City/Town --</option>
          {cities.map((c, i) => (
            <option key={`${c.city_town}-${i}`} value={c.city_town}>
              {c.city_town}
            </option>
          ))}
        </select>
      </div>

      {/* School District Select */}
      <div>
        <select
          value={selectedSchoolDistrict || ""}
          onChange={(e) => {
            const value = e.target.value || null;
            setSelectedSchoolDistrict(value);
            onSelectSchoolDistrict?.(value);
          }}
          className="w-full p-2 border border-gray-400 rounded bg-white text-black"
          disabled={!selectedCounty || schoolDistricts.length === 0}
        >
          <option value="">-- Choose a School District --</option>
          {schoolDistricts.map((sd, i) => (
            <option key={`${sd.school_district}-${i}`} value={sd.school_district}>
              {sd.school_district}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
