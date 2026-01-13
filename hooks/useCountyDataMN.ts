import { useEffect, useState } from "react";
import { ProjectData } from "@/types/MNproject";

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

        if (countyData?.avg_market_value_per_acre && !landValueDefaultSet) {
          const avgValue = Number(countyData.avg_market_value_per_acre);
          setProjectData((prev) => ({ ...prev, userLandValue: avgValue }));
          setCountyAvgValue(avgValue);
          setLandValueDefaultSet(true);
        }

        if (countyData?.est_capacity_factor && !capacityFactorDefaultSet) {
          setProjectData((prev) => ({ ...prev, useEstimatedCapacityFactor: countyData.est_capacity_factor }));
          setCapacityFactorDefaultSet(true);
        }
      } catch (err) {
        console.error("Error fetching county data:", err);
      }
    };

    fetchCountyData();

    return () => {
      setLandValueDefaultSet(false);
      setCapacityFactorDefaultSet(false);
    };
  }, [projectData.county]);

  return { countyAvgValue };
}
