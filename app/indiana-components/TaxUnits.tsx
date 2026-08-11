"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import { ProjectData } from "@/types/INProject";
import { County } from "@/components/INLocationSelector";

export interface TaxUnitRecord {
  unit_code: string;
  unit_name: string;
  unit_type_code:
    | "County"
    | "Township"
    | "City/Town"
    | "School"
    | "Library"
    | "Special";
  unit_type_name?: string;
  county_name: string;
  township_name?: string;
  fund_code: string;
  fund_name: string;
  certified_levy: number;
  certified_net_assessed_value: number;
  certified_gross_tax_rate: number;
}

interface TaxUnitsProps {
  projectData: ProjectData;
  setProjectData: React.Dispatch<React.SetStateAction<ProjectData>>;
  selectedCounty?: County | string | null;
}

export const TaxUnits: React.FC<TaxUnitsProps> = ({
  projectData,
  setProjectData,
  selectedCounty: externalSelectedCounty,
}) => {
  const [allTaxUnits, setAllTaxUnits] = useState<TaxUnitRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Normalize the county name string.
  const activeCountyName = useMemo(() => {
    if (!externalSelectedCounty) return projectData.county || "";
    if (typeof externalSelectedCounty === "object") {
      return externalSelectedCounty.county_name || "";
    }
    return externalSelectedCounty;
  }, [externalSelectedCounty, projectData.county]);

  // Selection states.
  const [selectedTownship, setSelectedTownship] = useState<string>(
    projectData.township || ""
  );
  const [selectedCityTown, setSelectedCityTown] = useState<string>(
    projectData.cityTown || ""
  );
  const [selectedSchool, setSelectedSchool] = useState<string>(
    projectData.school || ""
  );
  const [selectedLibraries, setSelectedLibraries] = useState<string[]>(
    projectData.libraries || []
  );
  const [selectedSpecialUnits, setSelectedSpecialUnits] = useState<string[]>(
    projectData.specialUnits || []
  );

  // Track the selected county.
  const prevCountyRef = useRef<string>(activeCountyName);

  useEffect(() => {
    if (prevCountyRef.current !== activeCountyName) {
      prevCountyRef.current = activeCountyName;

      // Reset selections when changes are made.
      setSelectedTownship("");
      setSelectedCityTown("");
      setSelectedSchool("");
      setSelectedLibraries([]);
      setSelectedSpecialUnits([]);
    }
  }, [activeCountyName]);

  // Fetch tax units from the API.
  useEffect(() => {
    const fetchTaxUnits = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/indiana/certified_values_avs");

        // Error message.
        if (!response.ok) {
          throw new Error(`Failed to fetch tax unit data. (Status ${response.status})`);
        }

        const json = await response.json();

        // Check if the API returned an error object.
        if (json.error) {
          throw new Error(json.error);
        }

        // Extract the 'counties' array from the returned object.
        const data: TaxUnitRecord[] = json.counties || [];
          setAllTaxUnits(data);
        } catch (err: any) {
          console.error("Fetch tax units error:", err);
          setError(err.message || "An unexpected error occurred.");
        } finally {
          setLoading(false);
        }
      };

      fetchTaxUnits();
    }, []);

  // Filter records to only the active county.
  const countyTaxUnits = useMemo(() => {
    if (!activeCountyName) return [];

    const cleanActive = activeCountyName.toLowerCase().replace(/\s+county$/i, "").trim();

    return allTaxUnits.filter((item) => {
      if (!item.county_name) return false;
      const cleanItemCounty = item.county_name.toLowerCase().replace(/\s+county$/i, "").trim();
      return cleanItemCounty === cleanActive;
    });
  }, [allTaxUnits, activeCountyName]);


  // Handlers for changes/resets.
  const handleTownshipChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const township = e.target.value;
    setSelectedTownship(township);
    setSelectedCityTown("");
    setSelectedSchool("");
    setSelectedLibraries([]);
    setSelectedSpecialUnits([]);
  };

  const handleLibraryToggle = (libName: string) => {
    setSelectedLibraries((prev) =>
      prev.includes(libName)
        ? prev.filter((item) => item !== libName)
        : [...prev, libName]
    );
  };

  const handleSpecialUnitToggle = (unitName: string) => {
    setSelectedSpecialUnits((prev) =>
      prev.includes(unitName)
        ? prev.filter((item) => item !== unitName)
        : [...prev, unitName]
    );
  };


  // Helper function to handle matching.
  const matchesType = (u: any, type: string) => {
    const code = String(u.unit_type_code || "").toLowerCase();
    const name = String(u.unit_type_name || "").toLowerCase();
    const search = type.toLowerCase();
    return code === search || name.includes(search);
  };


  // Filtered unit options for selected county.
  const availableTownships = useMemo(() => {
    if (!activeCountyName) return [];
    const filtered = countyTaxUnits.filter((u) => matchesType(u, "township"));
    return Array.from(new Set(filtered.map((u) => u.unit_name))).sort();
  }, [countyTaxUnits, activeCountyName]);

  const availableCities = useMemo(() => {
    if (!selectedTownship) return [];
    const filtered = countyTaxUnits.filter((u) => matchesType(u, "city") || matchesType(u, "town"));
    return Array.from(new Set(filtered.map((u) => u.unit_name))).sort();
  }, [countyTaxUnits, selectedTownship]);

  const availableSchools = useMemo(() => {
    if (!selectedTownship) return [];
    const filtered = countyTaxUnits.filter((u) => matchesType(u, "school"));
    return Array.from(new Set(filtered.map((u) => u.unit_name))).sort();
  }, [countyTaxUnits, selectedTownship]);

  const availableLibraries = useMemo(() => {
    if (!selectedTownship) return [];
    const filtered = countyTaxUnits.filter((u) => matchesType(u, "library"));
    return Array.from(new Set(filtered.map((u) => u.unit_name))).sort();
  }, [countyTaxUnits, selectedTownship]);

 const availableSpecialUnits = useMemo(() => {
    if (!selectedTownship) return [];
    const filtered = countyTaxUnits.filter((u) => matchesType(u, "special"));
    return Array.from(new Set(filtered.map((u) => u.unit_name))).sort();
  }, [countyTaxUnits, selectedTownship]);


  // Aggregated active tax units for calculations.
  const activeTaxUnits = useMemo(() => {
    if (!activeCountyName || !selectedTownship) return [];

    return countyTaxUnits.filter((item) => {
      if (matchesType(item, "county")) return true;
      if (matchesType(item, "township") && item.unit_name === selectedTownship)
        return true;
      if (matchesType(item, "city/town") && item.unit_name === selectedCityTown)
        return true;
      if (matchesType(item, "school") && item.unit_name === selectedSchool)
        return true;
      if (
        matchesType(item, "library") &&
        selectedLibraries.includes(item.unit_name)
      )
        return true;
      if (
        matchesType(item, "special") &&
        selectedSpecialUnits.includes(item.unit_name)
      )
        return true;

      return false;
    });
  }, [
    countyTaxUnits,
    activeCountyName,
    selectedTownship,
    selectedCityTown,
    selectedSchool,
    selectedLibraries,
    selectedSpecialUnits,
  ]);

  // Compute grand totals based on selected funds.
  const grandTotals = useMemo(() => {
    return activeTaxUnits.reduce(
      (acc, item) => {
        acc.levy += Number(item.certified_levy) || 0;
        acc.netAv += Number(item.certified_net_assessed_value) || 0;
        acc.rate += Number(item.certified_gross_tax_rate) || 0;
        return acc;
      },
      { levy: 0, netAv: 0, rate: 0 }
    );
  }, [activeTaxUnits]);

  // Sync state upward to parent ProjectData without infinite render loop.
  useEffect(() => {
    setProjectData((prev) => {
      if (
        prev.county === activeCountyName &&
        prev.township === selectedTownship &&
        prev.cityTown === selectedCityTown &&
        prev.school === selectedSchool &&
        prev.libraries === selectedLibraries &&
        prev.specialUnits === selectedSpecialUnits &&
        prev.selectedTaxUnits === activeTaxUnits &&
        prev.totals?.totalLevy === grandTotals.levy &&
        prev.totals?.totalRate === grandTotals.rate
      ) {
        return prev;
      }

      return {
        ...prev,
        county_name: activeCountyName,
        township: selectedTownship,
        cityTown: selectedCityTown,
        school: selectedSchool,
        libraries: selectedLibraries,
        specialUnits: selectedSpecialUnits,
        selectedTaxUnits: activeTaxUnits,
        totals: {
          totalLevy: grandTotals.levy,
          totalRate: grandTotals.rate,
        },
      };
    });
  }, [
    activeCountyName,
    selectedTownship,
    selectedCityTown,
    selectedSchool,
    selectedLibraries,
    selectedSpecialUnits,
    activeTaxUnits,
    grandTotals,
    setProjectData,
  ]);

  // Group like items together for UI rendering.
  const groupedUnits = useMemo(() => {
    const order = [
      "County",
      "Township",
      "City/Town",
      "School",
      "Library",
      "Special",
    ];

    return order
      .map((type) => {
        const items = activeTaxUnits.filter((u) => matchesType(u, type));
        const totalLevy = items.reduce(
          (sum, i) => sum + (Number(i.certified_levy) || 0),
          0
        );
        const totalRate = items.reduce(
          (sum, i) => sum + (Number(i.certified_gross_tax_rate) || 0),
          0
        );
        return { type, items, totalLevy, totalRate };
      })
      .filter((group) => group.items.length > 0);
  }, [activeTaxUnits]);

  return (
    <div className="home-page-wrapper">

      {error && (
        <div className="warning-alert-box">
          {error}
        </div>
      )}

      <div className="input-grid">
        <div>
          <label className="label">
            Your Selected County
          </label>
          <div className="basicInputBox" style={{marginLeft: 0, marginRight: 0}}>
            {activeCountyName ? (
              activeCountyName
            ) : (
              <span style={{ color: "#7a7a7a" }}>
                Please select a county above.
              </span>
            )}
          </div>
        </div>

        <div>
          <label className="label">
            Township <span style={{ color: "#d61b15", fontStyle: "italic", fontSize: "0.85rem"}}>(Required)</span>
          </label>
          <select
            className="full-width-dropdown" style={{ marginLeft: "0", marginRight: "0"}}
            value={selectedTownship}
            onChange={handleTownshipChange}
            disabled={!activeCountyName || loading}
          >
            <option value="">-- Select Township --</option>
            {availableTownships.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">
            City / Town <span style={{ color: "#7a7a7a", fontStyle: "italic", fontSize: "0.85rem"}}>(Optional)</span>
          </label>
          <select
            className="full-width-dropdown"
            value={selectedCityTown}
            onChange={(e) => setSelectedCityTown(e.target.value)}
            disabled={!selectedTownship || loading}
          >
            <option value="">-- None / Unincorporated --</option>
            {availableCities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">
            School District <span style={{ color: "#7a7a7a", fontStyle: "italic", fontSize: "0.85rem"}}>(Optional)</span>
          </label>
          <select
            className="full-width-dropdown"
            value={selectedSchool}
            onChange={(e) => setSelectedSchool(e.target.value)}
            disabled={!selectedTownship || loading}
          >
            <option value="">-- Select School District --</option>
            {availableSchools.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedTownship && (
        <div className="input-grid">
          <div className="full-width-check">
            <h4 className="label" style={{marginBottom: "0.5rem", marginLeft: "0.5rem" }}>
              Library Districts <span style={{ color: "#7a7a7a", fontStyle: "italic", fontSize: "0.85rem"}}>(Select all applicable units)</span>
            </h4>
            {availableLibraries.length === 0 ? (
              <p style={{ color: "#7a7a7a", fontStyle: "italic", fontSize: "0.85rem"}}>No libraries available for the selected county/township.</p>
            ) : (
              <div className="">
                {availableLibraries.map((lib) => (
                  <label key={lib}>
                    <input
                      type="checkbox"
                      checked={selectedLibraries.includes(lib)}
                      onChange={() => handleLibraryToggle(lib)}
                      className="list-check-box"
                    />
                    <span>{lib}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

            <div className="full-width-check">
            <h4 className="label">
              Special Districts <span style={{ color: "#7a7a7a", fontStyle: "italic", fontSize: "0.85rem"}}>(Select all applicable units)</span>
            </h4>
            {availableSpecialUnits.length === 0 ? (
              <p style={{ color: "#7a7a7a", fontStyle: "italic", fontSize: "0.85rem"}}>No special districts available for this selection.</p>
            ) : (
              <div className="">
                {availableSpecialUnits.map((sp) => (
                  <label key={sp}>
                    <input
                      type="checkbox"
                      checked={selectedSpecialUnits.includes(sp)}
                      onChange={() => handleSpecialUnitToggle(sp)}
                      className="list-check-box"
                    />
                    <span>{sp}</span>
                  </label>
                ))}
              </div>
            )}
            </div>
          </div>
      )}

      <br></br>

      {activeCountyName && selectedTownship && (
        <div className="homepage-wrapper">
          <h3 className="page-title-text">
            Tax Units Breakdown ({activeTaxUnits.length} funds selected)
          </h3>
          <div className="">
            <table className="basicTable">
              <thead>
                <tr className="">
                  <th>Unit Type</th>
                  <th>Unit Name</th>
                  <th>Fund Name</th>
                  <th>Certified Levy ($)</th>
                  <th>Net Assessed Value ($)</th>
                  <th>Gross Tax Rate (%)</th>
                </tr>
              </thead>
              <tbody>
                {groupedUnits.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ color: "#7a7a7a", fontStyle: "italic", fontSize: "0.85rem" }}>
                      No active tax units match the selected criteria.
                    </td>
                  </tr>
                ) : (
                  groupedUnits.map((group) =>
                    group.items.map((item, idx) => (
                      <tr
                        key={`${item.unit_code}-${item.fund_code}-${idx}`}
                        className="hover-row"
                      >
                        <td>{group.type}</td>
                        <td>{item.unit_name}</td>
                        <td>{item.fund_name}</td>
                        <td>
                          ${(Number(item.certified_levy) || 0).toLocaleString()}
                        </td>
                        <td>
                          ${(Number(item.certified_net_assessed_value) || 0).toLocaleString()}
                        </td>
                        <td>
                          {(Number(item.certified_gross_tax_rate) || 0).toFixed(4)}%
                        </td>
                      </tr>
                    ))
                  )
                )}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="rowHighlight">
                    Total:
                  </td>
                  <td className="rowHighlight">
                    ${grandTotals.levy.toLocaleString()}
                  </td>
                  <td className="rowHighlight">
                    ${grandTotals.netAv.toLocaleString()}
                  </td>
                  <td className="rowHighlight">
                    {grandTotals.rate.toFixed(4)}%
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaxUnits;