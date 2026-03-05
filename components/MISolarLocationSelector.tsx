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
  const [selectedCounty, setSelectedCounty] = useState("");
  const [selectedUnit, setSelectedUnit] = useState<{ name: string; isCity: boolean } | null>(null);
  const [selectedVillage, setSelectedVillage] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");

  // Fetch all locations and normalize city to boolean
  useEffect(() => {
    fetch("/api/michigan/millages")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data?.counties)) {
          setAllLocations(
            data.counties.map((l: any) => ({
              ...l,
              city: l.city === true || l.city === "true", // now TypeScript won't complain
            }))
          );
        } else setAllLocations([]);
      })
      .catch(() => setAllLocations([]));
  }, []);

  // Counties
  const counties = useMemo(() => Array.from(new Set(allLocations.map(l => l.county_name))).sort(), [allLocations]);

  // Local units (cities + townships) for selected county
  const localUnits = useMemo(() => {
    if (!selectedCounty) return [];
    const units = allLocations.filter(l => l.county_name === selectedCounty);
    const map = new Map<string, { name: string; isCity: boolean }>();
    units.forEach(l => {
      const isCity = l.city === true; // normalize
      const key = `${l.local_unit_name}__${isCity}`;
      if (!map.has(key)) map.set(key, { name: l.local_unit_name, isCity });
    });
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [allLocations, selectedCounty]);

  // Villages for selected unit
  const villages = useMemo(() => {
    if (!selectedCounty || !selectedUnit) return [];
    return Array.from(
      new Set(
        allLocations
          .filter(
            l =>
              l.county_name === selectedCounty &&
              l.local_unit_name === selectedUnit.name &&
              l.city === selectedUnit.isCity
          )
          .map(l => l.village_name)
          .filter(Boolean)
      )
    ) as string[];
  }, [allLocations, selectedCounty, selectedUnit]);

  // Schools for selected county/unit/village
  const schools = useMemo(() => {
    if (!selectedCounty || !selectedUnit) return [];
    return Array.from(
      new Set(
        allLocations
          .filter(
            l =>
              l.county_name === selectedCounty &&
              l.local_unit_name === selectedUnit.name &&
              l.city === selectedUnit.isCity &&
              (!selectedVillage || l.village_name === selectedVillage)
          )
          .map(l => l.school_name)
      )
    ).sort();
  }, [allLocations, selectedCounty, selectedUnit, selectedVillage]);

  // Update selected location
  useEffect(() => {
    if (!selectedCounty || !selectedUnit) {
      onSelectLocation?.(null);
      return;
    }
    const loc = allLocations.find(
      l =>
        l.county_name === selectedCounty &&
        l.local_unit_name === selectedUnit.name &&
        l.city === selectedUnit.isCity &&
        (selectedVillage ? l.village_name === selectedVillage : true) &&
        (selectedSchool ? l.school_name === selectedSchool : true)
    ) || null;
    onSelectLocation?.(loc);
  }, [allLocations, selectedCounty, selectedUnit, selectedVillage, selectedSchool, onSelectLocation]);


  return (
    <div>
      {/* County */}
      <div>
        <select
          value={selectedCounty}
          onChange={e => {
            setSelectedCounty(e.target.value);
            setSelectedUnit(null);
            setSelectedVillage("");
            setSelectedSchool("");
          }}
          className="basicDropdown"
        >
          <option value="">-- Choose County --</option>
          {counties.map(c => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <div className="required">Required</div>
      </div>

      <br />

      {/* Local Unit (City / Township) */}
      <div>
        <select
            value={selectedUnit ? `${selectedUnit.name}__${selectedUnit.isCity ? "true" : "false"}` : ""}
            onChange={e => {
              const [name, isCityStr] = e.target.value.split("__");
              setSelectedUnit({ name, isCity: isCityStr === "true" });
              setSelectedVillage("");
              setSelectedSchool("");
            }}
            disabled={!selectedCounty}
            className="basicDropdown"
          >
            <option value="">-- Choose Local Unit --</option>
            {localUnits.map(lu => (
              <option
                key={`${lu.name}__${lu.isCity}`}
                value={`${lu.name}__${lu.isCity ? "true" : "false"}`}
              >
                {lu.name} {lu.isCity ? "(City)" : "(Township)"}
              </option>
            ))}
          </select>
        <div className="required">Required</div>
      </div>

      <br />

      {/* Village */}
      {villages.length > 0 && (
        <div>
          <select
            value={selectedVillage}
            onChange={e => {
              setSelectedVillage(e.target.value);
              setSelectedSchool("");
            }}
            className="basicDropdown"
          >
            <option value="">-- Choose Village --</option>
            {villages.map(v => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
          <div className="required">Required</div>
        </div>
      )}

      {/* School */}
      {schools.length > 0 && (
        <div>
          <select
            value={selectedSchool}
            onChange={e => setSelectedSchool(e.target.value)}
            className="basicDropdown"
          >
            <option value="">-- Choose School District --</option>
            {schools.map(s => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <div className="required">Required</div>
        </div>
      )}
    </div>
  );
}