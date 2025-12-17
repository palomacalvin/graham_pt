// "use client";

// import { useEffect, useState } from "react";

// interface County {
//   county_name: string;
// }

// interface City {
//   city_town: string;
// }

// interface Props {
//   stateName: string;
//   onSelectCounty?: (county: string | null) => void;
//   onSelectCity?: (city: string | null) => void;
//   onSelectSchoolDistrict?: (district: string | null) => void;
// }

// export default function LocationSelector({
//   stateName,
//   onSelectCounty,
//   onSelectCity,
//   onSelectSchoolDistrict,
// }: Props) {
//   const [counties, setCounties] = useState<County[]>([]);
//   const [selectedCounty, setSelectedCounty] = useState<string | null>(null);

//   const [cities, setCities] = useState<City[]>([]);
//   const [selectedCity, setSelectedCity] = useState<string | null>(null);

//   const [schoolDistricts, setSchoolDistricts] = useState<{ school_district: string }[]>([]);
//   const [selectedSchoolDistrict, setSelectedSchoolDistrict] = useState<string | null>(null);

//   // Fetch counties on load
//   useEffect(() => {
//     fetch(`/api/location?state=${stateName}`)
//       .then((res) => res.json())
//       .then((data) => setCounties(data.counties))
//       .catch((err) => console.error("Error fetching counties:", err));
//   }, [stateName]);

//   // Fetch cities when a county is selected
//   useEffect(() => {
//     if (!selectedCounty) {
//       setCities([]);
//       setSelectedCity(null);
//       return;
//     }

//     fetch(`/api/location/cities?county=${encodeURIComponent(selectedCounty.toUpperCase())}`)
//       .then((res) => res.json())
//       .then((data) => setCities(data.cities))
//       .catch((err) => console.error("Error fetching cities:", err));
//   }, [selectedCounty]);

//   // Fetch school districts when a county is selected
//   useEffect(() => {
//     if (!selectedCounty) {
//       setSchoolDistricts([]);
//       setSelectedSchoolDistrict(null);
//       return;
//     }

//     fetch(`/api/location/school-districts?county=${encodeURIComponent(selectedCounty)}`)
//       .then((res) => res.json())
//       .then((data) => setSchoolDistricts(data.schoolDistricts))
//       .catch((err) => console.error("Error fetching school districts:", err));
//   }, [selectedCounty]);

//   return (
//     <div className="w-full max-w-xs space-y-4">
//       {/* County Select */}
//       <div>
//         <select
//           value={selectedCounty || ""}
//           onChange={(e) => {
//             const value = e.target.value || null;
//             setSelectedCounty(value);
//             setSelectedCity(null);
//             setSelectedSchoolDistrict(null);
//             onSelectCounty?.(value);
//           }}
//           className="basicDropdown"
//         >
//           <option value="">-- Choose County --</option>
//           {counties.map((c, i) => (
//             <option key={`${c.county_name}-${i}`} value={c.county_name}>
//               {c.county_name}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* City Select */}
//       <div>
//         <select
//           value={selectedCity || ""}
//           onChange={(e) => {
//             const value = e.target.value || null;
//             setSelectedCity(value);
//             onSelectCity?.(value);
//           }}
//           className="basicDropdown"
//           disabled={!selectedCounty || cities.length === 0}
//         >
//           <option value="">-- Choose City/Town --</option>
//           {cities.map((c, i) => (
//             <option key={`${c.city_town}-${i}`} value={JSON.stringify(c)}>
//               {c.city_town}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* School District Select */}
//       <div>
//         <select
//           value={selectedSchoolDistrict || ""}
//           onChange={(e) => {
//             const value = e.target.value || null;
//             setSelectedSchoolDistrict(value);
//             onSelectSchoolDistrict?.(value);
//           }}
//           className="basicDropdown"
//           disabled={!selectedCounty || schoolDistricts.length === 0}
//         >
//           <option value="">-- Choose School District --</option>
//           {schoolDistricts.map((sd, i) => (
//             <option key={`${sd.school_district}-${i}`} value={JSON.stringify(sd)}>
//               {sd.school_district}
//             </option>
//           ))}
//         </select>
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";

interface County {
  county_name: string;
}

interface City {
  city_town: string;
  homestead_rate: number;
  non_homestead_rate: number;
  commercial_rate: number;
}

interface SchoolDistrict {
  school_district: string;
  homestead_rate: number;
  non_homestead_rate: number;
  commercial_rate: number;
}

interface Props {
  stateName: string;

  // UPDATED: city and district now pass full objects, not strings
  onSelectCounty?: (county: string | null) => void;
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
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null);

  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  const [schoolDistricts, setSchoolDistricts] = useState<SchoolDistrict[]>([]);
  const [selectedSchoolDistrict, setSelectedSchoolDistrict] =
  
  useState<SchoolDistrict | null>(null);

  // Fetch counties
  useEffect(() => {
    fetch(`/api/location?state=${stateName}`)
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

    fetch(`/api/location/cities?county=${encodeURIComponent(selectedCounty)}`)
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

    fetch(`/api/location/school-districts?county=${encodeURIComponent(selectedCounty)}`)
      .then((res) => res.json())
      .then((data) => setSchoolDistricts(data.schoolDistricts))
      .catch((err) => console.error("Error fetching school districts:", err));
  }, [selectedCounty, selectedSchoolDistrict, selectedCity]);

  return (
    <div className="w-full max-w-xs space-y-4">

      {/* County Select */}
      <div>
        <select
          value={selectedCounty || ""}
          onChange={(e) => {
            const value = e.target.value || null;
            setSelectedCounty(value);
            onSelectCounty?.(value);

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
