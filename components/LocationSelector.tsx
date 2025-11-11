"use client";

import { useEffect, useState } from "react";

interface County {
  name: string;
}

interface Props {
  stateName: string;
  onSelect?: (county: County | null) => void;
}

export default function LocationSelector({ stateName, onSelect }: Props) {
  const [counties, setCounties] = useState<County[]>([]);
  const [selectedCounty, setSelectedCounty] = useState<string>(""); // store as string for simplicity

  // Fetch counties and normalize the data
  useEffect(() => {
    console.log(`Fetching counties for state: ${stateName}`);
    fetch(`/api/location?state=${stateName}`)
      .then(res => res.json())
      .then((data: { counties: any[] }) => {
        // Normalize: ensure every object has a 'name' string
        const normalized: County[] = data.counties.map(c => ({
          name: c.name || c.county_name || "Unknown",
        }));
        console.log("Normalized counties:", normalized);
        setCounties(normalized);
      })
      .catch(err => console.error("Error fetching counties:", err));
  }, [stateName]);

  // Trigger onSelect when selection changes
  useEffect(() => {
    if (onSelect) {
      const countyObj = counties.find(c => c.name === selectedCounty) || null;
      onSelect(countyObj);
      console.log("Selected county:", countyObj);
    }
  }, [selectedCounty, counties, onSelect]);

  return (
    <div style={{ width: "100%", maxWidth: "300px" }}>
      <select
        value={selectedCounty}
        onChange={e => setSelectedCounty(e.target.value)}
        style={{
          width: "100%",
          padding: "8px",
          border: "1px solid black",
          borderRadius: "4px",
          backgroundColor: "white",
          color: "black",
          appearance: "menulist",
        }}
      >
        <option value="">-- Choose a County --</option>
        {counties.map((c, i) => {
          const displayName = c.name
            ? c.name.charAt(0) + c.name.slice(1).toLowerCase()
            : "Unknown";
          return (
            <option key={`${c.name}-${i}`} value={c.name}>
              {displayName}
            </option>
          );
        })}
      </select>
    </div>
  );
}
