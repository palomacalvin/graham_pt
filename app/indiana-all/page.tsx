"use client";
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { ProjectData } from "@/types/INProject";
import INUserSelections from "../indiana-components/INUserSelections";
import Instructions from "@/components/Instructions";
import TaxResults from "../indiana-components/INTaxResults";
import FooterComp from "@/components/Footer";
import { Analytics } from "@vercel/analytics/next";
import {
  calculateSchedule,
  calculatePropertyTaxPayments,
  calculatePropertyTaxPaymentsWithAbatement,
  calculateTaxOffsetForCommunity,
  calculateTaxOffsetForCommunityWithAbatement,
} from "@/utils/INCalculations";

// Define the unit type priority order.
const UNIT_TYPE_ORDER: Record<string, number> = {
  County: 1,
  Township: 2,
  "City/Town": 3,
  School: 4,
  Library: 5,
  Special: 6,
  Unit: 7,
};

export default function ProjectForm() {
  const [showResults, setShowResults] = useState(false);

  const [projectData, setProjectData] = useState<ProjectData>({
    county: "",
    project_type: "Solar",

    number_of_turbines: 50,
    land_area: 700,
    inflation_rate: 0.025,
    discount_rate: 0.03,
    nameplate_capacity: 100,
    expected_useful_life: 30,

    north_land_assessed_value: 13000,
    central_land_assessed_value: 14607,
    south_land_assessed_value: 7699,

    land_assessed_value: 0,
    rp_district: "",
    total_investment: 337500000,
    pct_investment_udp: 0.95,
    depreciation_floor: 0,
    state_credit_gross_additions: 0.60,
    real_property_assessment_ratio: 0.50,

    township: "",
    cityTown: "",
    school: "",
    libraries: [],
    specialUnits: [],

    selectedTaxUnits: [],

    totals: {
      totalLevy: 0,
      totalRate: 0,
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setProjectData((prev) => {
      let newData: any = { ...prev };
      if (type === "checkbox") {
        newData[name] = (e.target as HTMLInputElement).checked;
      } else if (type === "number") {
        newData[name] = Number(value);
      } else {
        newData[name] = value;
      }
      return newData;
    });
  };

  useEffect(() => {
    setShowResults(false);
  }, [projectData]);

  // Core calculations from INCalculations.tsx.
  const calcResults = calculateSchedule(projectData);
  const schedule = calcResults.schedule || [];
  const noAbatementSchedule = calcResults.noAbatementSchedule || [];
  const withAbatementSchedule = calcResults.withAbatementSchedule || [];

  // Get the year 1 assessed values (abatement/no abatement).
  const year1AssessedValueNoAbatement = noAbatementSchedule[0]?.totalAssessedValue ?? 0;
  const year1AssessedValueWithAbatement = withAbatementSchedule[0]?.totalAssessedValue ?? 0;

  // Extract the 25-year arrays.
  const noAbatementAvArray = noAbatementSchedule.map((r) => r.totalAssessedValue);
  const withAbatementAvArray = withAbatementSchedule.map((r) => r.totalAssessedValue);

  // Calculate the payments and offsets (abatement/no abatement).
  const paymentsNoAbatement = calculatePropertyTaxPayments(projectData, noAbatementAvArray);
  const paymentsWithAbatement = calculatePropertyTaxPaymentsWithAbatement(projectData, withAbatementAvArray);

  const offsetsNoAbatement = calculateTaxOffsetForCommunity(projectData, noAbatementAvArray);
  const offsetsWithAbatement = calculateTaxOffsetForCommunityWithAbatement(projectData, withAbatementAvArray);

  // Map results into rows for display.
  const selectedUnits = projectData.selectedTaxUnits || [];
  const unsortedJurisdictionRows = selectedUnits.map((unit: any, index: number) => {
    const payNoAbate = paymentsNoAbatement.fundPayments[index];
    const payWithAbate = paymentsWithAbatement.fundPayments[index];
    const offNoAbate = offsetsNoAbatement.fundOffsetImpacts[index];
    const offWithAbate = offsetsWithAbatement.fundOffsetImpacts[index];

    // Map the year 1 values.
    const projectTaxYear1 = payNoAbate?.paymentsByYear[0] ?? 0;
    const abatedProjectTaxYear1 = payWithAbate?.paymentsByYear[0] ?? 0;

    const taxOffsetNeighborsYear1 = offNoAbate?.offsetsByYear[0] ?? 0;
    const abatedTaxOffsetNeighborsYear1 = offWithAbate?.offsetsByYear[0] ?? 0;

    const additionalUnitRevenueYear1 = projectTaxYear1 - taxOffsetNeighborsYear1;
    const abatedAdditionalUnitRevenueYear1 = abatedProjectTaxYear1 - abatedTaxOffsetNeighborsYear1;

    // Map the lifetime values.
    const discountRate = projectData.discount_rate || 0.03;

    // (No Abatement).
    const yearlyNetImpacts = payNoAbate?.paymentsByYear || new Array(25).fill(0);
    const grossLifetime = payNoAbate?.total25YrPayment ?? 0;
    const npvLifetime = yearlyNetImpacts.reduce((sum: number, val: number, i: number) => {
      return sum + val / Math.pow(1 + discountRate, i);
    }, 0);

    // (Abatement).
    const abatedYearlyNetImpacts = payWithAbate?.paymentsByYear || new Array(25).fill(0);
    const abatedGrossLifetime = payWithAbate?.total25YrPayment ?? 0;
    const abatedNpvLifetime = abatedYearlyNetImpacts.reduce((sum: number, val: number, i: number) => {
      return sum + val / Math.pow(1 + discountRate, i);
    }, 0);

    // Group the funds by label.
    const unitType = String(unit.unit_type || unit.unitType || unit.category || "").toLowerCase();
    let label = "Unit";
    if (unitType.includes("county")) label = "County";
    else if (unitType.includes("township")) label = "Township";
    else if (unitType.includes("city") || unitType.includes("town")) label = "City/Town";
    else if (unitType.includes("school")) label = "School";
    else if (unitType.includes("library")) label = "Library";
    else if (unitType.includes("special") || unitType.includes("conservancy")) label = "Special";

    return {
      id: unit.unit_code || unit.fund_code || String(index),
      label,
      name: unit.unit_name || unit.fund_name || "Taxing Unit",
      fundName: unit.fund_name || unit.fundName || "",

      projectTaxYear1,
      additionalUnitRevenueYear1,
      taxOffsetNeighborsYear1,

      abatedProjectTaxYear1,
      abatedAdditionalUnitRevenueYear1,
      abatedTaxOffsetNeighborsYear1,

      grossLifetime,
      npvLifetime,
      yearlyNetImpacts,

      abatedGrossLifetime,
      abatedNpvLifetime,
      abatedYearlyNetImpacts,
    };
  });

  // Sort the rows by label/unit type.
  const jurisdictionRows = [...unsortedJurisdictionRows].sort((a, b) => {
    const rankA = UNIT_TYPE_ORDER[a.label] ?? 99;
    const rankB = UNIT_TYPE_ORDER[b.label] ?? 99;

    if (rankA !== rankB) {
      return rankA - rankB;
    }
    // Secondarily, sort alphabetically.
    return a.name.localeCompare(b.name);
  });

  return (
    <div>
      <Navbar />

      <div style={{ marginLeft: "1.5rem", marginTop: "2rem" }}>
        <h1 className="page-main-title">
          Indiana Wind & Solar Renewable Energy Tax Impacts Calculator
        </h1>
      </div>

      <Instructions state="Indiana" />

      <div className="spaced" style={{ marginTop: "0" }}>
        <form>
          <INUserSelections
            projectData={projectData}
            handleChange={handleChange}
            setProjectData={setProjectData}
          />

          <br />
          <button
            type="button"
            onClick={() => setShowResults(true)}
            className="basicButton"
          >
            Calculate
          </button>

          <div>
            {showResults && (
              <TaxResults
                projectData={projectData}
                rows={schedule}
                jurisdictionRows={jurisdictionRows}
                year1AssessedValueNoAbatement={year1AssessedValueNoAbatement}
                year1AssessedValueWithAbatement={year1AssessedValueWithAbatement}
                hasAbatement={true}
                discountRate={0}
              />
            )}
          </div>
        </form>
      </div>

      <FooterComp />
      <Analytics />
    </div>
  );
}