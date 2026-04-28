"use client";
import React from "react";
import { ProjectData } from "@/types/ILProject";
import { TaxUnit } from "./ILTaxTable";

interface ILTaxResultsProps {
  projectData: ProjectData;
  rows: Row[];
  taxUnits: TaxUnit[];
  setTaxUnits: (units: TaxUnit[]) => void;
}

type Row = {
  year: number;
  age: number;
  depreciationFactor: number;
  trendingFactor: number;
  trendedCost: number;
  depreciation: number;
  fcv: number;
  assessedValue: number;
  farmlandAssessedValue: number;
};

interface ILTaxResultsProps {
  projectData: ProjectData;
  rows: Row[];
  taxUnits: TaxUnit[];
}

export default function ILTaxResults({ projectData, rows, taxUnits }: ILTaxResultsProps) {
  // Helper functions.
  const formatCurrency = (value: number) => {
    const rounded = Math.round(value);
      if (rounded === 0) return "$0";
      return rounded < 0 
        ? `($${Math.abs(rounded).toLocaleString()})` 
        : `$${rounded.toLocaleString()}`;
    };

  function calculateNPV(rate: number, cash_flows: number[]) {
    return cash_flows.reduce((sum, cf, i) => {
      return sum + cf / Math.pow(1 + rate, i);
    }, 0);
  }
  
  function calculateGrossTotal(values: number[]) {
    return values.reduce((sum, v) => sum + v, 0);
  }

  // Bulk calculations.
  const taxImpactRows = React.useMemo(() => {
    // Filter out units with no rate and no name/label.
    const activeUnits = taxUnits.filter((u) => u.rate > 0 || (u.name || "") !== "");

    // For units that are filled in...
    return activeUnits.map((unit) => {
      const decimalRate = unit.rate / 100; // Convert to decimal for calculations.

      const yearlyProjectPayments = rows.map((r) => r.assessedValue * decimalRate);
      const yearlyFarmlandPayments = rows.map((r) => r.farmlandAssessedValue * decimalRate);
      const yearlyNetImpacts = yearlyProjectPayments.map((proj, idx) => proj - yearlyFarmlandPayments[idx]);

      const projectTaxYear1 = yearlyProjectPayments[0] || 0;
      const farmlandTaxYear1 = yearlyFarmlandPayments[0] || 0;

      const grossLifetime = calculateGrossTotal(yearlyNetImpacts);
      const npvLifetime = calculateNPV(projectData.discount_rate || 0.03, yearlyNetImpacts);

      return {
        id: unit.unitNumber,
        name: unit.name || "",
        label: unit.type || "Unit",
        rate: decimalRate, // Rate for calculations.
        displayRate: unit.rate, // Rate for display.
        projectTaxYear1,
        farmlandTaxYear1,
        netImpactYear1: projectTaxYear1 - farmlandTaxYear1,
        yearlyNetImpacts,
        grossLifetime,
        npvLifetime,
      };
    });
  }, [rows, projectData.discount_rate, taxUnits]);

    // For displaying wind vs. solar.
    const projectLabel = projectData.project_type || "Project";

    // Calculate rows of gross, npv, and year one results.
    const grandGross = taxImpactRows.reduce((sum, u) => sum + u.grossLifetime, 0);
    const grandNPV = taxImpactRows.reduce((sum, u) => sum + u.npvLifetime, 0);
    const totalNetYear1 = taxImpactRows.reduce((sum, u) => sum + u.netImpactYear1, 0);
    const totalProjectYear1 = taxImpactRows.reduce((s, u) => s + u.projectTaxYear1, 0);
    const totalFarmlandYear1 = taxImpactRows.reduce((s, u) => s + u.farmlandTaxYear1, 0);

  return (
    <div>
      <h1>Your Results</h1>
      <br></br>

      <h3>Year 1 Summary</h3>
        <table className="basicTable">
        <thead>
          <tr>
            <th>Unit</th>
            <th>Jurisdiction Name</th>
            <th>Tax Rate</th>
            <th>Year 1 Project Tax Payments</th>
            <th>Previous Farmland Tax Payments</th>
            <th>Net Tax Impacts from Project</th>
          </tr>
        </thead>
        <tbody>
          {taxImpactRows.map((u) => (
            <tr key={u.id}>
              <td>{u.label}</td>
              <td>{u.name}</td>
              <td>{(u.rate * 100).toFixed(5)}%</td>
              <td>{formatCurrency(u.projectTaxYear1)}</td>
              <td>{formatCurrency(u.farmlandTaxYear1)}</td>
              <td className="rowBold">{formatCurrency(u.netImpactYear1)}</td>
            </tr>
          ))}
          <tr className="rowHighlight">
            <td colSpan={3}>Total Year 1 Impact</td>
            <td>{formatCurrency(totalProjectYear1)}</td>
            <td>{formatCurrency(totalFarmlandYear1)}</td>
            <td>{formatCurrency(totalNetYear1)}</td>
          </tr>
        </tbody>
      </table>

        <br></br>
        <br></br>

        <h1>Breakdown Over the Life of the Project</h1>
        <br></br>

        <p>
          The gross value represents the total dollar value of tax revenue over the life of the project. 
          Underlying property values are adjusted for inflation on an annual basis.
        </p>

        <br></br>

        <p>
          The net present value adjusts this dollar value using the discount factor to represent 
          what the future money is expected to be worth today (accounting for inflation and risk).
        </p>

        <br />

        <h3>Jurisdictional Gross & NPV Totals</h3>
        <table className="basicTable">
          <thead>
            <tr>
              <th>Jurisdiction</th>
              <th>Gross Over the Life of the Project (Total Dollar Value)</th>
              <th>Net Present Value Over the Life of the Project (Discounted for future inflation and risk)</th>
            </tr>
          </thead>
          <tbody>
            {taxImpactRows.map((u) => (
              <tr key={u.id}>
                <td>{u.label}: {u.name}</td>
                <td>{formatCurrency(u.grossLifetime)}</td>
                <td>{formatCurrency(u.npvLifetime)}</td>
              </tr>
            ))}
            <tr className="rowHighlight" style={{ fontWeight: 'bold' }}>
              <td>All Jurisdictions</td>
              <td>{formatCurrency(grandGross)}</td>
              <td>{formatCurrency(grandNPV)}</td>
            </tr>
          </tbody>
        </table>
        <br></br>

        <table className="basicTable">
          <thead>
            <tr>
            </tr>

            <tr>
              <th>Jurisdiction</th>
              {rows.map((r) => (
                <th key={r.year}>{r.year}</th>
              ))}
            </tr>
          </thead>

          <tbody>
          {taxImpactRows.map((u) => (
            <tr key={u.id}>

              <td style={{ fontWeight: "bold" }}>
                {u.label}: {u.name}
              </td>
            
              {u.yearlyNetImpacts.map((val, idx) => (
                <td key={idx}>${Math.round(val).toLocaleString()}</td>
              ))}
            </tr>
          ))}
          <tr className="rowBold">
            <td>
              Total Across Jurisdictions
            </td>
            {rows.map((_, idx) => (
              <td key={idx}>
                ${Math.round(taxImpactRows.reduce((s, u) => s + u.yearlyNetImpacts[idx], 0)).toLocaleString()}
              </td>
            ))}
          </tr>

          <tr className="rowHighlight">
            <td colSpan={3}>Gross Over the Life of the Project (Total Dollar Value)</td>
            <td colSpan={rows.length}>{formatCurrency(grandGross)}</td>
          </tr>

          <tr className="rowHighlight">
            <td colSpan={3}>Net Present Value Over the Life of the Project (Discounted for future inflation and risk)</td>
            <td colSpan={rows.length}>{formatCurrency(grandNPV)}</td>
          </tr>
        
        </tbody>
        </table>

    </div>
  );
}