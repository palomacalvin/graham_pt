"use client";
import React, { useState } from "react";
import { ProjectData } from "@/types/INProject";
import ProjectLifeBreakdown from "@/components/Breakdown";
import CommunityBenefitsHeader from "@/components/CommunityBenefits";

export interface JurisdictionRow {
  id: string;
  label: string;
  name: string;
  projectTaxYear1: number;
  additionalUnitRevenueYear1: number;
  taxOffsetNeighborsYear1: number;
  abatedProjectTaxYear1: number;
  abatedAdditionalUnitRevenueYear1: number;
  abatedTaxOffsetNeighborsYear1: number;
  grossLifetime: number;
  npvLifetime: number;
  yearlyNetImpacts: number[];
  abatedGrossLifetime?: number;
  abatedNpvLifetime?: number;
  abatedYearlyNetImpacts?: number[];
  abatementYears?: number;
  unit_type?: string;
  unitType?: string;
}

interface INTaxResultsProps {
  projectData: ProjectData;
  rows?: Row[];
  jurisdictionRows?: JurisdictionRow[];
  year1AssessedValueNoAbatement?: number;
  year1AssessedValueWithAbatement?: number;
  hasAbatement?: boolean;
  discountRate?: number;
}

export type Row = {
  year: number;
  utilityAV?: number;
  landAV?: number;
  totalAssessedValue?: number;
  age?: number;
  depreciationFactor?: number;
  trendingFactor?: number;
  trendedCost?: number;
  depreciation?: number;
  fcv?: number;
  assessedValue?: number;
  farmlandAssessedValue?: number;
  [key: string]: any;
};

export default function INTaxResults({ 
  projectData,
  rows = [],
  jurisdictionRows = [],
  year1AssessedValueNoAbatement = 0,
  year1AssessedValueWithAbatement = 0,
  hasAbatement = true,
  discountRate,
}: INTaxResultsProps) {

  // Safety feature: ensures the received rows and jurisdictions are always arrays.
  const safeRows = Array.isArray(rows) ? rows : [];
  const safeJurisdictionRows = Array.isArray(jurisdictionRows) ? jurisdictionRows : [];

  // Discount rate fallback.
  const activeDiscountRate = 
    discountRate || 
    projectData?.discount_rate || 
    (projectData as any)?.discountRate || 
    0.03;

  // State for toggling view with or without abatement in all summary tables.
  const [abatementView, setAbatementView] = useState<"no_abatement" | "with_abatement" | null>(
    hasAbatement ? "with_abatement" : "no_abatement"
  );

  // Helper functions.
  const formatCurrency = (value: number) => {
    const rounded = Math.round(value);
    if (rounded === 0) return "$0";
    return rounded < 0 
      ? `($${Math.abs(rounded).toLocaleString()})` 
      : `$${rounded.toLocaleString()}`;
  };

  function calculateNPV(rate: number, cash_flows: number[]) {
    if (!cash_flows || cash_flows.length === 0) return 0;
    return cash_flows.reduce((sum, cf, i) => {
      return sum + cf / Math.pow(1 + rate, i);
    }, 0);
  }
  
  function calculateGrossTotal(values: number[]) {
    if (!values || values.length === 0) return 0;
    return values.reduce((sum, v) => sum + v, 0);
  }

  // Default.
  const standard10YearPayableSchedule = [0.10, 0.20, 0.30, 0.40, 0.50, 0.60, 0.70, 0.80, 0.90, 0.95];

  // Get the cash flows from INCalculations.tsx (with and without abatement).
  const getEffectiveCashFlows = (j: JurisdictionRow): number[] => {
    const standardFlows = Array.isArray(j.yearlyNetImpacts) ? j.yearlyNetImpacts : [];

    if (abatementView === "with_abatement") {

      // Check to see if the values have been pre-computed correctly in INCalculations.tsx.
      const hasPrecomputed = Array.isArray(j.abatedYearlyNetImpacts) && j.abatedYearlyNetImpacts.length > 0;
      if (hasPrecomputed) {
        return j.abatedYearlyNetImpacts!;
      }

      // Return the flows.
      return standardFlows.map((flow, yearIndex) => {
        if (j.projectTaxYear1 > 0 && typeof j.abatedProjectTaxYear1 === "number") {
          const year1AbatementDiscount = j.projectTaxYear1 - j.abatedProjectTaxYear1;
          const abatementDuration = j.abatementYears || 10;

          if (yearIndex >= abatementDuration) return flow;

          const scheduleFactor = standard10YearPayableSchedule[yearIndex] ?? (yearIndex / abatementDuration);
          const year1DiscountFactor = 1 - (j.abatedProjectTaxYear1 / j.projectTaxYear1);
          const activeDiscount = year1AbatementDiscount * (1 - scheduleFactor) / (year1DiscountFactor || 1);
          return Math.max(0, flow - activeDiscount);
        }
        return flow;
      });
    }

    return standardFlows;
  };

  // Extracts specific rows based on abatement/no abatement selection.
  const getRowGross = (j: JurisdictionRow) => {
    if (abatementView === "with_abatement") {
      if (typeof j.abatedGrossLifetime === "number") return j.abatedGrossLifetime;
    } else {
      if (typeof j.grossLifetime === "number") return j.grossLifetime;
    }
    return calculateGrossTotal(getEffectiveCashFlows(j));
  };

  // Extracts the correct NPV value based on abatement/no abatement selection.
  const getRowNPV = (j: JurisdictionRow) => {
    if (abatementView === "with_abatement") {
      if (typeof j.abatedNpvLifetime === "number") return j.abatedNpvLifetime;
    } else {
      if (typeof j.npvLifetime === "number") return j.npvLifetime;
    }
    return calculateNPV(activeDiscountRate, getEffectiveCashFlows(j));
  };

  // Filter out empty/zero-value jurisdictions for clarity.
  const activeJurisdictions = safeJurisdictionRows.filter((j) => {
    const flows = getEffectiveCashFlows(j);
    const hasYearly = flows.some((val) => val !== 0);
    return j.grossLifetime > 0 || j.npvLifetime > 0 || hasYearly || j.projectTaxYear1 > 0;
  });

  // Totals (no abatement).
  const totalProjectTaxYear1 = safeJurisdictionRows.reduce((sum, j) => sum + (j.projectTaxYear1 || 0), 0);
  const totalAddRevenueYear1 = safeJurisdictionRows.reduce((sum, j) => sum + (j.additionalUnitRevenueYear1 || 0), 0);
  const totalOffsetYear1 = safeJurisdictionRows.reduce((sum, j) => sum + (j.taxOffsetNeighborsYear1 || 0), 0);

  // Totals (with abatement).
  const totalAbatedProjectTaxYear1 = safeJurisdictionRows.reduce((sum, j) => sum + (j.abatedProjectTaxYear1 || 0), 0);
  const totalAbatedAddRevenueYear1 = safeJurisdictionRows.reduce((sum, j) => sum + (j.abatedAdditionalUnitRevenueYear1 || 0), 0);
  const totalAbatedOffsetYear1 = safeJurisdictionRows.reduce((sum, j) => sum + (j.abatedTaxOffsetNeighborsYear1 || 0), 0);

  // Final gross and NPV values (dynamically displays abatement/no abatement based on selection).
  const grandGross = activeJurisdictions.reduce((sum, j) => sum + getRowGross(j), 0);
  const grandNPV = activeJurisdictions.reduce((sum, j) => sum + getRowNPV(j), 0);

  // Helper for matching jurisdiction category types from label, unit_type, or id.
  const matchesUnitCategory = (j: JurisdictionRow, category: string) => {
    const searchString = `${j.label} ${j.id} ${j.name} ${j.unit_type || ''} ${j.unitType || ''}`.toLowerCase();
    return searchString.includes(category.toLowerCase());
  };

  // Extracts values for the community benefits table (and parses abatement/no abatement selection).
  const countyNPV = activeJurisdictions
    .filter((j) => matchesUnitCategory(j, "county"))
    .reduce((sum, j) => sum + getRowNPV(j), 0);

  const townshipNPV = activeJurisdictions
    .filter((j) => matchesUnitCategory(j, "township"))
    .reduce((sum, j) => sum + getRowNPV(j), 0);

  const schoolNPV = activeJurisdictions
    .filter((j) => matchesUnitCategory(j, "school"))
    .reduce((sum, j) => sum + getRowNPV(j), 0);

  const activeModeLabel = abatementView === "with_abatement" ? "With Abatement" : "No Abatement";

  return (
    <div>
      <br />
      <h1 className="page-section-title">Your Results</h1>

      <div className="about-section-divider">
        <h1 className="page-section-title-med">Year 1 Summary</h1>
      </div>

      {/* Allows the user to select abatement/no abatement calculations. */}
      <div className="buttonContainer" style={{ marginBottom: "15px" }}>
        <button
          type="button"
          onClick={() => setAbatementView("no_abatement")}
          className="inPageButton"
        >
          View No Abatement Calculations
        </button>

        {hasAbatement && (
          <button
            type="button"
            onClick={() => setAbatementView("with_abatement")}
            style={{
              marginLeft: "10px",
            }}
            className="inPageButton"
          >
            View With Abatement Calculations
          </button>
        )}

        <button
          type="button"
          onClick={() => setAbatementView(null)}
          style={{ marginLeft: "10px" }}
          className="inPageButton"
        >
          Hide Table
        </button>
      </div>

      {/* Conditionally Rendered Year 1 summary table based on button selection above. */}
      {abatementView !== null && (
        <div className="table-container">
          <table className="basicTable">
            <thead>
              <tr>
                <th>Unit</th>
                <th>Total Project Tax Payments</th>
                <th>Additional Unit Revenue</th>
                <th>Tax Offset for Neighbors</th>
              </tr>
            </thead>
            <tbody>
              {/* (No abatement) */}
              {abatementView === "no_abatement" && (
                <>
                  <tr>
                    <td colSpan={4} className="rowHighlight" style={{ backgroundColor: "#ccebff"}}>
                      Year 1 Project Assessed Value: {formatCurrency(year1AssessedValueNoAbatement)} (No Abatement)
                    </td>
                  </tr>

                  {safeJurisdictionRows.map((j) => (
                    <tr key={`no-abate-${j.id}`}>
                      <td>
                        {j.name ? `${j.name}` : ""}
                      </td>
                      <td>{formatCurrency(j.projectTaxYear1)}</td>
                      <td>{formatCurrency(j.additionalUnitRevenueYear1)}</td>
                      <td>{formatCurrency(j.taxOffsetNeighborsYear1)}</td>
                    </tr>
                  ))}

                  <tr className="rowHighlight" style={{ fontWeight: "bold" }}>
                    <td>Total (All Units)</td>
                    <td>{formatCurrency(totalProjectTaxYear1)}</td>
                    <td>{formatCurrency(totalAddRevenueYear1)}</td>
                    <td>{formatCurrency(totalOffsetYear1)}</td>
                  </tr>
                </>
              )}

              {/* With Abatement Table View */}
              {abatementView === "with_abatement" && hasAbatement && (
                <>
                  <tr>
                    <td colSpan={4} className="rowHighlight" style={{ backgroundColor: "#ccebff"}}>
                      Year 1 Project Assessed Value: {formatCurrency(year1AssessedValueWithAbatement)} (With Abatement)
                    </td>
                  </tr>

                  {safeJurisdictionRows.map((j) => (
                    <tr key={`abate-${j.id}`}>
                      <td>
                        {j.name ? `${j.name}` : ""}
                      </td>
                      <td>{formatCurrency(j.abatedProjectTaxYear1)}</td>
                      <td>{formatCurrency(j.abatedAdditionalUnitRevenueYear1)}</td>
                      <td>{formatCurrency(j.abatedTaxOffsetNeighborsYear1)}</td>
                    </tr>
                  ))}

                  <tr className="rowHighlight" style={{ fontWeight: "bold" }}>
                    <td>Total (All Units)</td>
                    <td>{formatCurrency(totalAbatedProjectTaxYear1)}</td>
                    <td>{formatCurrency(totalAbatedAddRevenueYear1)}</td>
                    <td>{formatCurrency(totalAbatedOffsetYear1)}</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      )}

      <br />

      <ProjectLifeBreakdown />

      {/* Jurisdictional Gross & NPV Totals Summary Table */}
      <div className="about-section-divider">
        <h1 className="page-section-title-med">
          Jurisdictional Gross & NPV Totals ({activeModeLabel})
        </h1>
      </div>

      <div className="table-container">
        <table className="basicTable">
          <thead>
            <tr>
              <th>Jurisdiction</th>
              <th>Gross Over the Life of the Project (Total Dollar Value)</th>
              <th>Net Present Value Over the Life of the Project (Discounted for future inflation and risk)</th>
            </tr>
          </thead>
          <tbody>
            {activeJurisdictions.map((u) => {
              const gross = getRowGross(u);
              const npv = getRowNPV(u);
              return (
                <tr key={u.id}>
                  <td>{u.name ? `${u.name}` : u.label}</td>
                  <td>{formatCurrency(gross)}</td>
                  <td>{formatCurrency(npv)}</td>
                </tr>
              );
            })}
            <tr className="rowHighlight" style={{ fontWeight: "bold" }}>
              <td>All Jurisdictions</td>
              <td>{formatCurrency(grandGross)}</td>
              <td>{formatCurrency(grandNPV)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <br />

      {/* Yearly breakdown table. */}
      <div className="table-container">
        <table className="basicTable">
          <thead>
            <tr>
              <th>Jurisdiction</th>
              {safeRows.map((r) => (
                <th key={r.year}>{r.year}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {activeJurisdictions.map((u) => {
              const flows = getEffectiveCashFlows(u);
              return (
                <tr key={u.id}>
                  <td style={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                    {u.name ? `${u.name}` : u.label}
                  </td>
                  {safeRows.map((_, idx) => (
                    <td key={idx}>{formatCurrency(flows[idx] || 0)}</td>
                  ))}
                </tr>
              );
            })}

            <tr className="rowHighlight">
              <td>Total Across Jurisdictions</td>
              {safeRows.map((_, idx) => {
                const yearTotal = activeJurisdictions.reduce(
                  (s, u) => s + (getEffectiveCashFlows(u)?.[idx] || 0), 0
                );
                return <td key={idx}>{formatCurrency(yearTotal)}</td>;
              })}
            </tr>

            <tr className="rowHighlight">
              <td colSpan={3}>Gross Over the Life of the Project (Total Dollar Value)</td>
              <td colSpan={Math.max(1, safeRows.length - 2)}>
                {formatCurrency(grandGross)}
              </td>
            </tr>

            <tr className="rowHighlight">
              <td colSpan={3}>Net Present Value Over the Life of the Project (Discounted for future inflation and risk)</td>
              <td colSpan={Math.max(1, safeRows.length - 2)}>
                {formatCurrency(grandNPV)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <CommunityBenefitsHeader />

      <br />

      {/* Community Benefits Table */}
      <div className="table-container">
        <table className="basicTable">
          <thead>
            <tr>
              <th></th>
              <th>Expenditure</th>
              <th>Jurisdiction</th>
              <th>Unit Cost</th>
              <th>Total Lifetime Benefit ({activeModeLabel})</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td style={{ minWidth: "100px", maxWidth: "200px" }}>
                <img src="/photos-logos/roadway-maintenance.png" alt="Vector graphic of a roadway." />
              </td>
              <td>Roadway Maintenance</td>
              <td>County</td>
              <td>~$9,790 per mile</td>
              <td>
                ~{Math.max(0, Math.round(countyNPV / 9790)).toLocaleString()} miles
              </td>
            </tr>

            <tr>
              <td style={{ minWidth: "100px", maxWidth: "200px" }}>
                <img src="/photos-logos/fire-truck.png" alt="Vector graphic of a fire truck" />
              </td>
              <td>Fire Trucks</td>
              <td>Township</td>
              <td>~$1,650,000 per regular fire truck</td>
              <td>
                ~{(townshipNPV / 1650000).toFixed(1)} fire truck(s)
              </td>
            </tr>

            <tr>
              <td style={{ minWidth: "100px", maxWidth: "200px" }}>
                <img src="/photos-logos/teacher.png" alt="Vector graphic of a teacher" />
              </td>
              <td>Public School Teachers</td>
              <td>School District</td>
              <td>~$101,810 per annual salary</td>
              <td>
                ~{Math.max(0, Math.round(schoolNPV / 101810)).toLocaleString()} full-time employee annual salaries
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}