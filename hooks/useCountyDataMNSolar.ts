import { useEffect, useState } from "react";
import { ProjectData } from "@/types/MNSolarProject";

export function useCountyData(projectData: ProjectData, setProjectData: React.Dispatch<React.SetStateAction<ProjectData>>) {
  const [countyAvgValue, setCountyAvgValue] = useState(0);
  const [landValueDefaultSet, setLandValueDefaultSet] = useState(false);
  const [capacityFactorDefaultSet, setCapacityFactorDefaultSet] = useState(false);

  // Fetch county data for land value
useEffect(() => {
  if (!projectData.county) return;

  const fetchCountyData = async () => {
    try {
      const res = await fetch("/api/minnesota/location");
      const data = await res.json();

      const countyData = data.counties.find(
        (c: any) => c.county_name.toLowerCase() === projectData.county.toLowerCase()
      );

      if (!countyData) return;

      // Always update defaults for the selected county
      setProjectData((prev) => ({
        ...prev,
        userLandValue: countyData.avg_market_value_per_acre
          ? Number(countyData.avg_market_value_per_acre)
          : prev.userLandValue,
        useEstimatedCapacityFactor: countyData.est_capacity_factor
          ? countyData.est_capacity_factor
          : prev.useEstimatedCapacityFactor,
      }));

      setCountyAvgValue(countyData.avg_market_value_per_acre || 0);
    } catch (err) {
      console.error("Error fetching county data:", err);
    }
  };

  fetchCountyData();
}, [projectData.county]);

return {countyAvgValue};

}
