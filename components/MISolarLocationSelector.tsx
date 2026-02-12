"use client";

import { useEffect, useMemo, useState } from "react";

export interface Location {
  county_name: string;
  local_unit_name: string;
  city: boolean;
  village_name: string | null;
  school_name: string;
  school_code: string;
  total_rate: number;
  homestead_rate: number;
  non_homestead_rate: number;
  county_allocated: number;
  county_extra_voted: number;
  county_debt: number;
  lu_allocated: number;
  lu_extra_voted: number;
  lu_debt: number;
  sd_hold_harmless: number;
  sd_non_homestead: number;
  sd_debt: number;
  sd_sinking_fund: number;
  sd_comm_pers: number;
  sd_recreational: number;
  isd_allocated: number;
  isd_vocational: number;
  isd_special_ed: number;
  isd_debt: number;
  cc_operating: number;
  part_unit_auth: number;
  part_unit_auth_debt: number;
  special_assessment: number;
  village_allocated: number;
  village_extra_voted: number;
  village_debt: number;
  village_auth: number;
  village_auth_debt: number;
  village_special_assessment: number;
  cc_debt: number;
  isd_enhancement: number;
}

interface Props {
  stateName: string;
  onSelectLocation?: (location: Location | null) => void;
}

export default function LocationSelector({ onSelectLocation }: Props) {
  const [allLocations, setAllLocations] = useState<Location[]>([]);
  const [selectedCounty, setSelectedCounty] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedVillage, setSelectedVillage] = useState<string>("");
  const [selectedSchool, setSelectedSchool] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

    // Fetch all data for each location.
    useEffect(() => {
        fetch("/api/michigan/millages")
        .then((res) => res.json())
        .then((data) => {
            if (Array.isArray(data?.counties)) {
            setAllLocations(data.counties);
            } else {
            setAllLocations([]);
            }
        })
        .catch((err) => {
            console.error("Error fetching millages:", err);
            setAllLocations([]);
        });
    }, []);

    // Sort by unique counties.
    const counties = useMemo(
        () => Array.from(new Set(allLocations.map((l) => l.county_name))).sort(),
        [allLocations]
    );

    // Filter local units by county.
    const cities = useMemo(() => {
        if (!selectedCounty) return [];
        const localUnits = allLocations.filter(
        (l) => l.county_name === selectedCounty
        );
        return Array.from(new Set(localUnits.map((l) => l.local_unit_name))).sort();
    }, [allLocations, selectedCounty]);

    // List villages for selected city (if present).
    const villages = useMemo(() => {
        if (!selectedCounty || !selectedCity) return [];
        const cityLocations = allLocations.filter(
        (l) => l.county_name === selectedCounty && l.local_unit_name === selectedCity
        );
        return Array.from(
        new Set(cityLocations.map((l) => l.village_name).filter(Boolean))
        ) as string[];
    }, [allLocations, selectedCounty, selectedCity]);

    // List schools for selected county, city, and village combination.
    const schools = useMemo(() => {
        if (!selectedCounty || !selectedCity) return [];
        const filtered = allLocations.filter(
        (l) =>
            l.county_name === selectedCounty &&
            l.local_unit_name === selectedCity &&
            (!selectedVillage || l.village_name === selectedVillage)
        );
        return Array.from(new Set(filtered.map((l) => l.school_name))).sort();
    }, [allLocations, selectedCounty, selectedCity, selectedVillage]);

    // Update selected location whenever all selections are made
    useEffect(() => {
      if (!selectedCounty || !selectedCity) {
        if (selectedLocation !== null) {
          setSelectedLocation(null);
          onSelectLocation?.(null);
        }
        return;
      }

      const loc =
        allLocations.find(
          (l) =>
            l.county_name === selectedCounty &&
            l.local_unit_name === selectedCity &&
            (!selectedVillage || l.village_name === selectedVillage) &&
            (!selectedSchool || l.school_name === selectedSchool)
        ) || null;

      // Only update state if it changed
      const isSame =
        selectedLocation?.county_name === loc?.county_name &&
        selectedLocation?.local_unit_name === loc?.local_unit_name &&
        selectedLocation?.village_name === loc?.village_name &&
        selectedLocation?.school_name === loc?.school_name;

      if (!isSame) {
        setSelectedLocation(loc);
        onSelectLocation?.(loc);
      }
    }, [
      selectedCounty,
      selectedCity,
      selectedVillage,
      selectedSchool,
      allLocations,
      onSelectLocation,
      selectedLocation, // <- we now track the previous value
    ]);


return (
    <div>
      {/* County Select */}
      <div>
        <select
          value={selectedCounty}
          onChange={(e) => {
            setSelectedCounty(e.target.value);
            setSelectedCity("");
            setSelectedVillage("");
            setSelectedSchool("");
            }}
            className="basicDropdown"
        >
          <option value="">-- Choose County --</option>
          {counties.map((county) => (
            <option key={county} value={county}>
              {county}
            </option>
          ))}
        </select>
      </div>

      {/* City and Township */}
      <div>
        <select
            value={selectedCity}
            onChange={(e) => {
            setSelectedCity(e.target.value);
            setSelectedVillage("");
            setSelectedSchool("");
            }}
            disabled={!selectedCounty}
            className="basicDropdown"
        >
          <option value="">-- Choose City / Township --</option>
            {cities.map((c) => (
            <option key={c} value={c}>{c}</option>
            ))}
        </select>

        {/* Village (optional) */}
        {villages.length > 0 && (
            <select
            value={selectedVillage}
            onChange={(e) => {
                setSelectedVillage(e.target.value);
                setSelectedSchool("");
            }}
            className="basicDropdown"
            >
            <option value="">-- Choose Village --</option>
            {villages.map((v) => (
                <option key={v} value={v}>{v}</option>
            ))}
            </select>
        )}

        {/* School District */}
        {schools.length > 0 && (
            <select
            value={selectedSchool}
            onChange={(e) => setSelectedSchool(e.target.value)}
            className="basicDropdown"
            >
            <option value="">-- Choose School District --</option>
            {schools.map((s) => (
                <option key={s} value={s}>{s}</option>
            ))}
            </select>
        )}

      </div>
    </div>
  );
}
