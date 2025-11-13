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

  // Set state for counties, cities, and SD
  const [counties, setCounties] = useState<County[]>([]);
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null);

  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const [schoolDistricts, setSchoolDistricts] = useState<{ school_district: string }[]>([]);
  const [selectedSchoolDistrict, setSelectedSchoolDistrict] = useState("");


  // Fetch counties on load
  useEffect(() => {
    fetch(`/api/location?state=${stateName}`)
      .then(res => res.json())
      .then(data => {
        setCounties(data.counties);
        console.log("Fetched counties:", data.counties);
      })
      .catch(err => console.error("Error fetching counties:", err));
  }, [stateName]);

  // Fetch cities when a county is selected
  useEffect(() => {
  if (!selectedCounty) return;

    fetch(`/api/location/cities?county=${encodeURIComponent(selectedCounty.toUpperCase())}`)
      .then(res => res.json())
      .then(data => {
        setCities(data.cities);
        console.log("Fetched cities:", data.cities);
      })
      .catch(err => console.error("Error fetching cities:", err));
  }, [selectedCounty]);

  useEffect(() => {
  if (!selectedCounty) return;

  fetch(`/api/location/school-districts?county=${encodeURIComponent(selectedCounty)}`)
    .then(res => res.json())
    .then(data => {
      setSchoolDistricts(data.schoolDistricts);
      console.log("Fetched school districts:", data.schoolDistricts);
    })
    .catch(err => console.error("Error fetching school districts:", err));
}, [selectedCounty]);



  // Notify parent of selection changes
  useEffect(() => {
    if (onSelectCounty) onSelectCounty(selectedCounty);
  }, [selectedCounty, onSelectCounty]);

  useEffect(() => {
    if (onSelectCity) onSelectCity(selectedCity);
  }, [selectedCity, onSelectCity]);

  return (
    <div className="w-full max-w-xs space-y-4">
      <div>
        <select
          value={selectedCounty || ""}
          onChange={e => setSelectedCounty(e.target.value || null)}
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

      <div>
        <select
          value={selectedCity || ""}
          onChange={e => setSelectedCity(e.target.value || null)}
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

          <div>

          <select
            name="schoolDistrict"
            value={selectedSchoolDistrict}
            onChange={(e) => {
              setSelectedSchoolDistrict(e.target.value);
              onSelectSchoolDistrict?.(e.target.value);
            }}
            className="w-full p-2 border border-gray-400 rounded bg-white text-black"
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
