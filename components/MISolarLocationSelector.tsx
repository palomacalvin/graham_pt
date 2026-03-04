// "use client";

// import { useEffect, useMemo, useState } from "react";

// export interface Location {
//   county_name: string;
//   local_unit_name: string;
//   city: boolean;
//   village_name: string | null;
//   school_name: string;
//   school_code: string;
//   total_rate: number;
//   homestead_rate: number;
//   non_homestead_rate: number;
//   county_allocated: number;
//   county_extra_voted: number;
//   county_debt: number;
//   lu_allocated: number;
//   lu_extra_voted: number;
//   lu_debt: number;
//   sd_hold_harmless: number;
//   sd_non_homestead: number;
//   sd_debt: number;
//   sd_sinking_fund: number;
//   sd_comm_pers: number;
//   sd_recreational: number;
//   isd_allocated: number;
//   isd_vocational: number;
//   isd_special_ed: number;
//   isd_debt: number;
//   cc_operating: number;
//   part_unit_auth: number;
//   part_unit_auth_debt: number;
//   special_assessment: number;
//   village_allocated: number;
//   village_extra_voted: number;
//   village_debt: number;
//   village_auth: number;
//   village_auth_debt: number;
//   village_special_assessment: number;
//   cc_debt: number;
//   isd_enhancement: number;
// }

// interface Props {
//   stateName: string;
//   onSelectLocation?: (location: Location | null) => void;
// }

// export default function LocationSelector({ onSelectLocation }: Props) {
//   const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
//   const [allLocations, setAllLocations] = useState<Location[]>([]);
//   const [selectedCounty, setSelectedCounty] = useState("");
//   const [selectedUnitName, setSelectedUnitName] = useState("");
//   const [selectedIsCity, setSelectedIsCity] = useState<boolean | null>(null);
//   const [selectedVillage, setSelectedVillage] = useState("");
//   const [selectedSchool, setSelectedSchool] = useState("");

//     // Fetch all data for each location.
//     useEffect(() => {
//         fetch("/api/michigan/millages")
//         .then((res) => res.json())
//         .then((data) => {
//             if (Array.isArray(data?.counties)) {
//             setAllLocations(data.counties);
//             } else {
//             setAllLocations([]);
//             }
//         })
//         .catch((err) => {
//             console.error("Error fetching millages:", err);
//             setAllLocations([]);
//         });
//     }, []);

//     // Sort by unique counties.
//     const counties = useMemo(
//         () => Array.from(new Set(allLocations.map((l) => l.county_name))).sort(),
//         [allLocations]
//     );

//     // Filter local units by county.
//     const cities = useMemo(() => {
//       if (!selectedCounty) return [];

//       // Filter locations for the selected county
//       const localUnits = allLocations.filter((l) => l.county_name === selectedCounty);

//       // Create unique map of 'local_unit_name + city' to avoid duplicates
//       const uniqueUnitsMap = new Map<string, { name: string; isCity: boolean }>();
//       localUnits.forEach((l) => {
//         const key = `${l.local_unit_name}__${l.city}`;
//         if (!uniqueUnitsMap.has(key)) {
//           uniqueUnitsMap.set(key, { name: l.local_unit_name, isCity: l.city });
//         }
//       });

//       // Return array sorted by name
//       return Array.from(uniqueUnitsMap.values()).sort((a, b) => a.name.localeCompare(b.name));
//     }, [allLocations, selectedCounty]);

    
//     // Filter by village.
//     const villages = useMemo(() => {
//       if (!selectedCounty || !selectedUnitName || selectedIsCity === null) return [];

//       const filtered = allLocations.filter(
//         (l) =>
//           l.county_name === selectedCounty &&
//           l.local_unit_name === selectedUnitName &&
//           l.city === selectedIsCity
//       );

//       return Array.from(new Set(filtered.map((l) => l.village_name).filter(Boolean))) as string[];
//     }, [allLocations, selectedCounty, selectedUnitName, selectedIsCity]);

//     const schools = useMemo(() => {
//       if (!selectedCounty || !selectedUnitName || selectedIsCity === null) return [];

//       const filtered = allLocations.filter(
//         (l) =>
//           l.county_name === selectedCounty &&
//           l.local_unit_name === selectedUnitName &&
//           l.city === selectedIsCity &&
//           (!selectedVillage || l.village_name === selectedVillage)
//       );

//       return Array.from(new Set(filtered.map((l) => l.school_name))).sort();
//     }, [allLocations, selectedCounty, selectedUnitName, selectedIsCity, selectedVillage]);


//     // List schools for selected county, city, and village combination.
//     // const schools = useMemo(() => {
//     //   if (!selectedCounty || !selectedCity) return [];

//     //   const [unitName, isCity] = selectedCity.split("__");

//     //   const filtered = allLocations.filter(
//     //     (l) =>
//     //       l.county_name === selectedCounty &&
//     //       l.local_unit_name === unitName &&
//     //       String(l.city) === isCity &&
//     //       (!selectedVillage || l.village_name === selectedVillage)
//     //   );

//     //   return Array.from(new Set(filtered.map((l) => l.school_name))).sort();
//     // }, [allLocations, selectedCounty, selectedCity, selectedVillage]);

//     // Update selected location whenever all selections are made
//     useEffect(() => {
//         if (!selectedCounty || !selectedUnitName || selectedIsCity === null) {
//           setSelectedLocation(null);
//           onSelectLocation?.(null);
//           return;
//         }

//         const loc = allLocations.find(
//           (l) =>
//             l.county_name === selectedCounty &&
//             l.local_unit_name === selectedUnitName &&
//             l.city === selectedIsCity &&
//             (selectedVillage ? l.village_name === selectedVillage : true) &&
//             (selectedSchool ? l.school_name === selectedSchool : true)
//         ) || null;

//         // Only update if the location is different
//         if (loc !== selectedLocation) {
//           setSelectedLocation(loc);
//           onSelectLocation?.(loc);
//         }
//       }, [
//         selectedCounty,
//         selectedUnitName,
//         selectedIsCity,
//         selectedVillage,
//         selectedSchool,
//         allLocations,
//         onSelectLocation,
//       ]);


// return (
//     <div>
//       {/* County Select */}
//       <div>
//         <select
//           value={selectedCounty}
//           onChange={(e) => {
//             setSelectedCounty(e.target.value);
//             setSelectedUnitName("");
//             setSelectedIsCity(null);
//             setSelectedVillage("");
//             setSelectedSchool("");
//             }}
//             className="basicDropdown"
//         >
//           <option value="">-- Choose County --</option>
//           {counties.map((county) => (
//             <option key={county} value={county}>
//               {county}
//             </option>
//           ))}
//         </select>
//         <div className="required">Required</div>
//       </div>

//       <br></br>

//       {/* City and Township */}
//       <div>
//         <select
//             value={selectedUnitName}
//             onChange={(e) => {
//               const [name, isCityStr] = e.target.value.split("__");
//               setSelectedUnitName(name);
//               setSelectedIsCity(isCityStr === "true"); // ensure boolean
//               setSelectedVillage(""); 
//               setSelectedSchool(""); 
//             }}
//             disabled={!selectedCounty}
//             className="basicDropdown"
//           >
//             <option value="">-- Choose Local Unit --</option>
//             {cities.map((c) => (
//               <option key={`${c.name}-${c.isCity}`} value={`${c.name}__${c.isCity}`}>
//                 {c.name} {c.isCity ? "(City)" : "(Township)"}
//               </option>
//             ))}
//           </select>
//         <div className="required">Required</div>

//         <br></br>

//         {/* Village (optional) */}
//         {villages.length > 0 && (
//           <div style={{ marginTop: "0rem" }}>
//             <select
//               value={selectedVillage}
//               onChange={(e) => {
//                 setSelectedVillage(e.target.value);
//                 setSelectedSchool("");
//               }}
//               className="basicDropdown"
//             >
//               <option value="">-- Choose Village --</option>
//               {villages.map((v) => (
//                 <option key={v} value={v}>{v}</option>
//               ))}

//             </select>
//             <div className="required">Required</div>
//           </div>
//         )}

//         {/* School District */}
//         {schools.length > 0 && (
//           <div style={{ marginTop: "1rem" }}>
//             <select
//             value={selectedSchool}
//             onChange={(e) => setSelectedSchool(e.target.value)}
//             className="basicDropdown"
//             >
//             <option value="">-- Choose School District --</option>
//             {schools.map((s) => (
//                 <option key={s} value={s}>{s}</option>
//             ))}
//             </select>
//             <div className="required">Required</div>

//             </div>
//         )}
       
        
//       </div>
//     </div>
//   );
// }


// "use client";

// import { useEffect, useMemo, useState } from "react";

// export interface Location {
//   county_name: string;
//   local_unit_name: string;
//   city: boolean;
//   village_name: string | null;
//   school_name: string;
//   school_code: string;
//   total_rate: number;
//   homestead_rate: number;
//   non_homestead_rate: number;
//   county_allocated: number;
//   county_extra_voted: number;
//   county_debt: number;
//   lu_allocated: number;
//   lu_extra_voted: number;
//   lu_debt: number;
//   sd_hold_harmless: number;
//   sd_non_homestead: number;
//   sd_debt: number;
//   sd_sinking_fund: number;
//   sd_comm_pers: number;
//   sd_recreational: number;
//   isd_allocated: number;
//   isd_vocational: number;
//   isd_special_ed: number;
//   isd_debt: number;
//   cc_operating: number;
//   part_unit_auth: number;
//   part_unit_auth_debt: number;
//   special_assessment: number;
//   village_allocated: number;
//   village_extra_voted: number;
//   village_debt: number;
//   village_auth: number;
//   village_auth_debt: number;
//   village_special_assessment: number;
//   cc_debt: number;
//   isd_enhancement: number;
// }

// interface Props {
//   stateName: string;
//   onSelectLocation?: (location: Location | null) => void;
// }

// export default function LocationSelector({ onSelectLocation }: Props) {
//   const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
//   const [allLocations, setAllLocations] = useState<Location[]>([]);
//   const [selectedCounty, setSelectedCounty] = useState("");
//   const [selectedUnitName, setSelectedUnitName] = useState("");
//   const [selectedIsCity, setSelectedIsCity] = useState<boolean | null>(null);
//   const [selectedVillage, setSelectedVillage] = useState("");
//   const [selectedSchool, setSelectedSchool] = useState("");

//   // Fetch all data once
//   useEffect(() => {
//     fetch("/api/michigan/millages")
//       .then((res) => res.json())
//       .then((data) => {
//         if (Array.isArray(data?.counties)) {
//           setAllLocations(data.counties);
//         } else {
//           setAllLocations([]);
//         }
//       })
//       .catch((err) => {
//         console.error("Error fetching millages:", err);
//         setAllLocations([]);
//       });
//   }, []);

//   // Unique counties
//   const counties = useMemo(
//     () => Array.from(new Set(allLocations.map((l) => l.county_name))).sort(),
//     [allLocations]
//   );

//   // Local units for selected county
//   const cities = useMemo(() => {
//     if (!selectedCounty) return [];
//     const localUnits = allLocations.filter((l) => l.county_name === selectedCounty);
//     const uniqueUnitsMap = new Map<string, { name: string; isCity: boolean }>();
//     localUnits.forEach((l) => {
//       const key = `${l.local_unit_name}__${l.city}`; // use __true or __false
//       if (!uniqueUnitsMap.has(key)) uniqueUnitsMap.set(key, { name: l.local_unit_name, isCity: l.city });
//     });
//     return Array.from(uniqueUnitsMap.values()).sort((a, b) => a.name.localeCompare(b.name));
//   }, [allLocations, selectedCounty]);

//   // Helper to create unique key
//   const unitKey = (name: string, isCity: boolean) => `${name}__${isCity}`;

//   // Local units for county
//   const localUnits = useMemo(() => {
//     if (!selectedCounty) return [];
//     const units = allLocations.filter(l => l.county_name === selectedCounty);
//     const map = new Map<string, { name: string; isCity: boolean }>();
//     units.forEach(l => {
//       const key = unitKey(l.local_unit_name, l.city);
//       if (!map.has(key)) map.set(key, { name: l.local_unit_name, isCity: l.city });
//     });
//     return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
//   }, [allLocations, selectedCounty]);

//   // Villages for selected county/unit/city
//   const villages = useMemo(() => {
//     if (!selectedCounty || !selectedUnitName || selectedIsCity === null) return [];
//     const filtered = allLocations.filter(
//       (l) =>
//         l.county_name === selectedCounty &&
//         l.local_unit_name === selectedUnitName &&
//         l.city === selectedIsCity
//     );
//     return Array.from(new Set(filtered.map((l) => l.village_name).filter(Boolean))) as string[];
//   }, [allLocations, selectedCounty, selectedUnitName, selectedIsCity]);

//   // Schools for selected county/unit/city/(optional village)
//   const schools = useMemo(() => {
//     if (!selectedCounty || !selectedUnitName || selectedIsCity === null) return [];
//     const filtered = allLocations.filter(
//       (l) =>
//         l.county_name === selectedCounty &&
//         l.local_unit_name === selectedUnitName &&
//         l.city === selectedIsCity &&
//         (selectedVillage ? l.village_name === selectedVillage : true)
//     );
//     return Array.from(new Set(filtered.map((l) => l.school_name))).sort();
//   }, [allLocations, selectedCounty, selectedUnitName, selectedIsCity, selectedVillage]);

//   // Update selectedLocation whenever selections change
//   useEffect(() => {
//     if (!selectedCounty || !selectedUnitName || selectedIsCity === null) {
//       setSelectedLocation(null);
//       onSelectLocation?.(null);
//       return;
//     }

//     const loc = allLocations.find(
//       (l) =>
//         l.county_name === selectedCounty &&
//         l.local_unit_name === selectedUnitName &&
//         l.city === selectedIsCity &&
//         (selectedVillage ? l.village_name === selectedVillage : true) &&
//         (selectedSchool ? l.school_name === selectedSchool : true)
//     ) || null;

//     if (loc !== selectedLocation) {
//       setSelectedLocation(loc);
//       onSelectLocation?.(loc);
//     }
//   }, [
//     selectedCounty,
//     selectedUnitName,
//     selectedIsCity,
//     selectedVillage,
//     selectedSchool,
//     allLocations,
//     onSelectLocation,
//     selectedLocation,
//   ]);

//   return (
//     <div>
//       {/* County */}
//       <div>
//         <select
//           value={selectedCounty}
//           onChange={(e) => {
//             setSelectedCounty(e.target.value);
//             setSelectedUnitName("");
//             setSelectedIsCity(null);
//             setSelectedVillage("");
//             setSelectedSchool("");
//           }}
//           className="basicDropdown"
//         >
//           <option value="">-- Choose County --</option>
//           {counties.map((county) => (
//             <option key={county} value={county}>
//               {county}
//             </option>
//           ))}
//         </select>
//         <div className="required">Required</div>
//       </div>

//       <br />

//       {/* Local Unit */}
//       <div>
//         <select
//           value={selectedUnitName && selectedIsCity !== null ? unitKey(selectedUnitName, selectedIsCity) : ""}
//           onChange={e => {
//             const [name, isCityStr] = e.target.value.split("__");
//             setSelectedUnitName(name);
//             setSelectedIsCity(isCityStr === "true");
//             setSelectedVillage("");
//             setSelectedSchool("");
//           }}
//           disabled={!selectedCounty}
//           className="basicDropdown"
//         >
//           <option value="">-- Choose Local Unit --</option>
//           {localUnits.map(c => (
//             <option key={unitKey(c.name, c.isCity)} value={unitKey(c.name, c.isCity)}>
//               {c.name} {c.isCity ? "(City)" : "(Township)"}
//             </option>
//           ))}
//         </select>
//         <div className="required">Required</div>
//       </div>

//       <br />

//       {/* Village */}
//       {villages.length > 0 && (
//         <div style={{ marginTop: "0rem" }}>
//           <select
//             value={selectedVillage}
//             onChange={(e) => {
//               setSelectedVillage(e.target.value);
//               setSelectedSchool("");
//             }}
//             className="basicDropdown"
//           >
//             <option value="">-- Choose Village --</option>
//             {villages.map((v) => (
//               <option key={v} value={v}>
//                 {v}
//               </option>
//             ))}
//           </select>
//           <div className="required">Required</div>
//         </div>
//       )}

//       {/* School */}
//       {schools.length > 0 && (
//         <div style={{ marginTop: "1rem" }}>
//           <select
//             value={selectedSchool}
//             onChange={(e) => setSelectedSchool(e.target.value)}
//             className="basicDropdown"
//           >
//             <option value="">-- Choose School District --</option>
//             {schools.map((s) => (
//               <option key={s} value={s}>
//                 {s}
//               </option>
//             ))}
//           </select>
//           <div className="required">Required</div>
//         </div>
//       )}
//     </div>
//   );
// }



// "use client";

// import { useEffect, useMemo, useState } from "react";

// export interface Location {
//   county_name: string;
//   local_unit_name: string;
//   city: boolean;
//   village_name: string | null;
//   school_name: string;
//   school_code: string;
//   total_rate: number;
//   homestead_rate: number;
//   non_homestead_rate: number;
//   county_allocated: number;
//   county_extra_voted: number;
//   county_debt: number;
//   lu_allocated: number;
//   lu_extra_voted: number;
//   lu_debt: number;
//   sd_hold_harmless: number;
//   sd_non_homestead: number;
//   sd_debt: number;
//   sd_sinking_fund: number;
//   sd_comm_pers: number;
//   sd_recreational: number;
//   isd_allocated: number;
//   isd_vocational: number;
//   isd_special_ed: number;
//   isd_debt: number;
//   cc_operating: number;
//   part_unit_auth: number;
//   part_unit_auth_debt: number;
//   special_assessment: number;
//   village_allocated: number;
//   village_extra_voted: number;
//   village_debt: number;
//   village_auth: number;
//   village_auth_debt: number;
//   village_special_assessment: number;
//   cc_debt: number;
//   isd_enhancement: number;
// }

// interface Props {
//   stateName: string;
//   onSelectLocation?: (location: Location | null) => void;
// }

// export default function LocationSelector({ onSelectLocation }: Props) {
//   const [allLocations, setAllLocations] = useState<Location[]>([]);
//   const [selectedCounty, setSelectedCounty] = useState("");
//   const [selectedUnitKey, setSelectedUnitKey] = useState(""); // local_unit_name + city
//   const [selectedVillage, setSelectedVillage] = useState("");
//   const [selectedSchool, setSelectedSchool] = useState("");

//   // Helper to create a unique key for local units
//   const unitKey = (name: string, isCity: boolean) => `${name}__${isCity ? "true" : "false"}`;

//   // Parse selectedUnitKey into name and city boolean
//   const selectedUnit = useMemo(() => {
//     if (!selectedUnitKey) return null;
//     const [name, isCityStr] = selectedUnitKey.split("__");
//     return { name, isCity: isCityStr === "true" }; // convert to boolean here
//   }, [selectedUnitKey]);

//   // Fetch all locations
//   // After fetching, normalize `city` field
//   // After fetching, normalize city to boolean
//     useEffect(() => {
//       fetch("/api/michigan/millages")
//         .then(res => res.json())
//         .then(data => {
//           if (Array.isArray(data?.counties)) {
//             const normalized = data.counties.map((l: Location) => ({
//               ...l,
//               city: !!l.city, // force boolean
//             }));
//             setAllLocations(normalized);
//           } else setAllLocations([]);
//         })
//         .catch(() => setAllLocations([]));
//     }, []);

//   // Counties
//   const counties = useMemo(
//     () => Array.from(new Set(allLocations.map(l => l.county_name))).sort(),
//     [allLocations]
//   );

//   // Local units (cities + townships) for selected county
//   const localUnits = useMemo(() => {
//     if (!selectedCounty) return [];
//     const units = allLocations.filter(l => l.county_name === selectedCounty);
//     const map = new Map<string, { name: string; isCity: boolean }>();
//     units.forEach(l => {
//       const key = unitKey(l.local_unit_name, l.city); // uses boolean now
//       if (!map.has(key)) map.set(key, { name: l.local_unit_name, isCity: l.city });
//     });
//     return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
//   }, [allLocations, selectedCounty]);

//   // Villages for selected local unit
//   const villages = useMemo(() => {
//     if (!selectedCounty || !selectedUnit) return [];
//     return Array.from(
//       new Set(
//         allLocations
//           .filter(
//             l =>
//               l.county_name === selectedCounty &&
//               l.local_unit_name === selectedUnit.name &&
//               l.city === selectedUnit.isCity // now boolean matches
//           )
//           .map(l => l.village_name)
//           .filter(Boolean)
//       )
//     ) as string[];
//   }, [allLocations, selectedCounty, selectedUnit]);

//   // Schools for selected county/unit/village
//   const schools = useMemo(() => {
//     if (!selectedCounty || !selectedUnit) return [];
//     return Array.from(
//       new Set(
//         allLocations
//           .filter(
//             l =>
//               l.county_name === selectedCounty &&
//               l.local_unit_name === selectedUnit.name &&
//               l.city === selectedUnit.isCity &&
//               (!selectedVillage || l.village_name === selectedVillage)
//           )
//           .map(l => l.school_name)
//       )
//     ).sort();
//   }, [allLocations, selectedCounty, selectedUnit, selectedVillage]);

//   // Update selected location
//   useEffect(() => {
//     if (!selectedCounty || !selectedUnit) {
//       onSelectLocation?.(null);
//       return;
//     }
//     const loc = allLocations.find(
//       l =>
//         l.county_name === selectedCounty &&
//         l.local_unit_name === selectedUnit.name &&
//         l.city === selectedUnit.isCity &&
//         (selectedVillage ? l.village_name === selectedVillage : true) &&
//         (selectedSchool ? l.school_name === selectedSchool : true)
//     ) || null;
//     onSelectLocation?.(loc);
//   }, [allLocations, selectedCounty, selectedUnit, selectedVillage, selectedSchool, onSelectLocation]);

//   return (
//     <div>
//       {/* County */}
//       <div>
//         <select
//           value={selectedCounty}
//           onChange={e => {
//             setSelectedCounty(e.target.value);
//             setSelectedUnitKey("");
//             setSelectedVillage("");
//             setSelectedSchool("");
//           }}
//           className="basicDropdown"
//         >
//           <option value="">-- Choose County --</option>
//           {counties.map(c => (
//             <option key={c} value={c}>
//               {c}
//             </option>
//           ))}
//         </select>
//         <div className="required">Required</div>
//       </div>

//       <br />

//       {/* Local Unit (City / Township) */}
//       <div>
//         <select
//             value={selectedUnitKey}
//             onChange={e => setSelectedUnitKey(e.target.value)}
//             disabled={!selectedCounty}
//             className="basicDropdown"
//           >
//             <option value="">-- Choose Local Unit --</option>
//             {localUnits.map(lu => (
//               <option key={unitKey(lu.name, lu.isCity)} value={unitKey(lu.name, lu.isCity)}>
//                 {lu.name} {lu.isCity ? "(City)" : "(Township)"}
//               </option>
//             ))}
//           </select>
//         <div className="required">Required</div>
//       </div>

//       <br />

//       {/* Village */}
//       {villages.length > 0 && (
//         <div>
//           <select
//             value={selectedVillage}
//             onChange={e => {
//               setSelectedVillage(e.target.value);
//               setSelectedSchool("");
//             }}
//             className="basicDropdown"
//           >
//             <option value="">-- Choose Village --</option>
//             {villages.map(v => (
//               <option key={v} value={v}>
//                 {v}
//               </option>
//             ))}
//           </select>
//           <div className="required">Required</div>
//         </div>
//       )}

//       {/* School */}
//       {schools.length > 0 && (
//         <div>
//           <select
//             value={selectedSchool}
//             onChange={e => setSelectedSchool(e.target.value)}
//             className="basicDropdown"
//           >
//             <option value="">-- Choose School District --</option>
//             {schools.map(s => (
//               <option key={s} value={s}>
//                 {s}
//               </option>
//             ))}
//           </select>
//           <div className="required">Required</div>
//         </div>
//       )}
//     </div>
//   );
// }



// "use client";

// import { useEffect, useMemo, useState } from "react";

// export interface Location {
//   county_name: string;
//   local_unit_name: string;
//   city: boolean;
//   village_name: string | null;
//   school_name: string;
//   school_code: string;
//   // other fields omitted for brevity
// }

// interface Props {
//   stateName: string;
//   onSelectLocation?: (location: Location | null) => void;
// }

// export default function LocationSelector({ onSelectLocation }: Props) {
//   const [allLocations, setAllLocations] = useState<Location[]>([]);
//   const [selectedCounty, setSelectedCounty] = useState("");
//   const [selectedUnitName, setSelectedUnitName] = useState("");
//   const [selectedUnitIsCity, setSelectedUnitIsCity] = useState<boolean | null>(null);
//   const [selectedVillage, setSelectedVillage] = useState("");
//   const [selectedSchool, setSelectedSchool] = useState("");

//   // Fetch and normalize data
//   useEffect(() => {
//     fetch("/api/michigan/millages")
//       .then((res) => res.json())
//       .then((data) => {
//         if (Array.isArray(data?.counties)) {
//           const normalized = data.counties.map((l: any) => ({
//             ...l,
//             city: l.city === true || l.city === "true" ? true : false,
//             local_unit_name: String(l.local_unit_name || ""),
//             county_name: String(l.county_name || ""),
//           }));
//           setAllLocations(normalized);
//         } else {
//           setAllLocations([]);
//         }
//       })
//       .catch(() => setAllLocations([]));
//   }, []);

//   // Counties
//   const counties = useMemo(
//     () => Array.from(new Set(allLocations.map((l) => l.county_name))).sort(),
//     [allLocations]
//   );

//   // Local units for selected county
//   const localUnits = useMemo(() => {
//     if (!selectedCounty) return [];
//     const units = allLocations.filter((l) => l.county_name === selectedCounty);
//     // Deduplicate by name + city
//     const uniqueUnits: { name: string; isCity: boolean }[] = [];
//     const seen = new Set<string>();
//     units.forEach((l) => {
//       const key = `${l.local_unit_name}__${l.city}`;
//       if (!seen.has(key)) {
//         seen.add(key);
//         uniqueUnits.push({ name: l.local_unit_name, isCity: l.city });
//       }
//     });
//     return uniqueUnits.sort((a, b) => a.name.localeCompare(b.name));
//   }, [allLocations, selectedCounty]);

//   // Villages for selected local unit
//   const villages = useMemo(() => {
//     if (!selectedCounty || !selectedUnitName || selectedUnitIsCity === null) return [];
//     return Array.from(
//       new Set(
//         allLocations
//           .filter(
//             (l) =>
//               l.county_name === selectedCounty &&
//               l.local_unit_name === selectedUnitName &&
//               l.city === selectedUnitIsCity
//           )
//           .map((l) => l.village_name)
//           .filter(Boolean)
//       )
//     ) as string[];
//   }, [allLocations, selectedCounty, selectedUnitName, selectedUnitIsCity]);

//   // Schools for selected county/unit/village
//   const schools = useMemo(() => {
//     if (!selectedCounty || !selectedUnitName || selectedUnitIsCity === null) return [];
//     return Array.from(
//       new Set(
//         allLocations
//           .filter(
//             (l) =>
//               l.county_name === selectedCounty &&
//               l.local_unit_name === selectedUnitName &&
//               l.city === selectedUnitIsCity &&
//               (!selectedVillage || l.village_name === selectedVillage)
//           )
//           .map((l) => l.school_name)
//       )
//     ).sort();
//   }, [allLocations, selectedCounty, selectedUnitName, selectedUnitIsCity, selectedVillage]);

//   // Update selected location
//   useEffect(() => {
//     if (!selectedCounty || !selectedUnitName || selectedUnitIsCity === null) {
//       onSelectLocation?.(null);
//       return;
//     }
//     const loc = allLocations.find(
//       (l) =>
//         l.county_name === selectedCounty &&
//         l.local_unit_name === selectedUnitName &&
//         l.city === selectedUnitIsCity &&
//         (selectedVillage ? l.village_name === selectedVillage : true) &&
//         (selectedSchool ? l.school_name === selectedSchool : true)
//     ) || null;
//     onSelectLocation?.(loc);
//   }, [allLocations, selectedCounty, selectedUnitName, selectedUnitIsCity, selectedVillage, selectedSchool, onSelectLocation]);

//   return (
//     <div>
//       {/* County */}
//       <div>
//         <select
//           value={selectedCounty}
//           onChange={(e) => {
//             setSelectedCounty(e.target.value);
//             setSelectedUnitName("");
//             setSelectedUnitIsCity(null);
//             setSelectedVillage("");
//             setSelectedSchool("");
//           }}
//           className="basicDropdown"
//         >
//           <option value="">-- Choose County --</option>
//           {counties.map((c) => (
//             <option key={c} value={c}>
//               {c}
//             </option>
//           ))}
//         </select>
//         <div className="required">Required</div>
//       </div>

//       <br />

//       {/* Local Unit */}
//       <div>
//         <select
//           value={selectedUnitName && selectedUnitIsCity !== null ? `${selectedUnitName}__${selectedUnitIsCity}` : ""}
//           onChange={(e) => {
//             const [name, isCityStr] = e.target.value.split("__");
//             setSelectedUnitName(name);
//             setSelectedUnitIsCity(isCityStr === "true");
//             setSelectedVillage("");
//             setSelectedSchool("");
//           }}
//           disabled={!selectedCounty}
//           className="basicDropdown"
//         >
//           <option value="">-- Choose Local Unit --</option>
//           {localUnits.map((lu) => (
//             <option key={`${lu.name}__${lu.isCity}`} value={`${lu.name}__${lu.isCity}`}>
//               {lu.name} {lu.isCity ? "(City)" : "(Township)"}
//             </option>
//           ))}
//         </select>
//         <div className="required">Required</div>
//       </div>

//       <br />

//       {/* Village */}
//       {villages.length > 0 && (
//         <div>
//           <select
//             value={selectedVillage}
//             onChange={(e) => {
//               setSelectedVillage(e.target.value);
//               setSelectedSchool("");
//             }}
//             className="basicDropdown"
//           >
//             <option value="">-- Choose Village --</option>
//             {villages.map((v) => (
//               <option key={v} value={v}>
//                 {v}
//               </option>
//             ))}
//           </select>
//           <div className="required">Required</div>
//         </div>
//       )}

//       {/* School */}
//       {schools.length > 0 && (
//         <div>
//           <select
//             value={selectedSchool}
//             onChange={(e) => setSelectedSchool(e.target.value)}
//             className="basicDropdown"
//           >
//             <option value="">-- Choose School District --</option>
//             {schools.map((s) => (
//               <option key={s} value={s}>
//                 {s}
//               </option>
//             ))}
//           </select>
//           <div className="required">Required</div>
//         </div>
//       )}
//     </div>
//   );
// }


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