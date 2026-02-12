import { ProjectData } from "@/types/MNproject";

export function getProductionRate(nameplateCapacity: number): number {
  if (nameplateCapacity < 0) return 0;
  if (nameplateCapacity < 2) return 1.2;
  if (nameplateCapacity >= 2 && nameplateCapacity <= 12) return 3.6;
  return 12.0;
}

export function getAnnualEnergyMWh(projectData: ProjectData): number {
  const HOURS_PER_YEAR = 8760;
  const capacityFactor =
    projectData.userCapacityFactor && projectData.userCapacityFactor > 0
      ? projectData.userCapacityFactor
      : projectData.useEstimatedCapacityFactor;

  return projectData.nameplateCapacity * capacityFactor * HOURS_PER_YEAR;
}

export function getAnnualSolarEnergyMWh(projectData: ProjectData): number {
  const HOURS_PER_YEAR = 8760;
  const capacityFactor =
    projectData.userCapacityFactor && projectData.userCapacityFactor > 0
      ? projectData.userCapacityFactor
      : projectData.solarEstimatedCapacityFactor;

  return projectData.nameplateCapacity * capacityFactor * HOURS_PER_YEAR;
}