"use client";
import React from "react";
import { ProjectData } from "@/types/NEProject";
import { useState, useMemo } from "react";
import { TaxUnit } from "./NETaxTable";
import { calculateNEResults } from "@/utils/NECalculations";
import ProjectLifeBreakdown from "@/components/Breakdown";
import CommunityBenefitsHeader from "@/components/CommunityBenefits";

interface NETaxResultsProps {
  projectData: ProjectData;
  taxUnits: TaxUnit[];
  setTaxUnits: React.Dispatch<React.SetStateAction<TaxUnit[]>>;
}

export default function NETaxResults({ projectData, taxUnits }: NETaxResultsProps) {

    // Determine project type.
    const isSolar = projectData.project_type === "Solar";
    const isWind = projectData.project_type === "Wind";

    const years = projectData.expected_useful_life || 30;
    const startYear = new Date().getFullYear();

    // Helper functions.
    const formatCurrency = (value: number) => {
        const rounded = Math.round(value);
            if (rounded === 0) return "$0";
            return rounded < 0 
            ? `($${Math.abs(rounded).toLocaleString()})` 
            : `$${rounded.toLocaleString()}`;
        };

    const formatPercent = (decimal: number) => 
      (decimal * 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 3 }) + "%";

    const currentYear = new Date().getFullYear();
  
    function calculateNPV(rate: number, cash_flows: number[]) {
        return cash_flows.reduce((sum, cf, i) => {
        return sum + cf / Math.pow(1 + rate, i);
        }, 0);
    }

    function calculateGrossTotal(values: number[]) {
        return values.reduce((sum, v) => sum + v, 0);
    }

    const results = calculateNEResults(projectData, taxUnits);

    // Calculate year 1 sums.
    const year1Totals = useMemo(() => {
      return results.reduce((acc, curr) => ({
          unitRate: acc.unitRate + curr.unitRate,
          proportionalTaxRate: acc.proportionalTaxRate + curr.proportionalTaxRate,
          capacityTaxRevenue: acc.capacityTaxRevenue + curr.capacityTaxRevenue,
          projectRealTaxRevenue: acc.projectRealTaxRevenue + curr.projectRealTaxRevenue,
          previousFarmlandTaxRevenue: acc.previousFarmlandTaxRevenue + curr.previousFarmlandTaxRevenue,
          netRealPropertyRevenue: acc.netRealPropertyRevenue + curr.netRealPropertyRevenue,
          netTaxRevenue: acc.netTaxRevenue + curr.netTaxRevenue,
      }), {
          unitRate: 0,
          proportionalTaxRate: 0,
          capacityTaxRevenue: 0,
          projectRealTaxRevenue: 0,
          previousFarmlandTaxRevenue: 0,
          netRealPropertyRevenue: 0,
          netTaxRevenue: 0
      });
  }, [results]);


  // Yearly array results.
  const totalYearlyCashFlows = useMemo(() => {
    const totals = new Array(Number(years)).fill(0);
      results.forEach(result => {
        result.yearlyCashFlows.forEach((val, i) => {
          totals[i] += val;
        });
      });
      return totals;
    }, [results, years]);

  const totalGrossAllUnits = results.reduce((sum, r) => sum + r.grossTotal, 0);
  const totalNPVAllUnits = results.reduce((sum, r) => sum + r.npvTotal, 0);


  // Group NPV by type for the Community Benefits table
  const totalsByType = useMemo(() => {
    return results.reduce((acc, curr) => {
      let category = curr.type;

      // Group both school types into one "School District" key
      if (category === "School District (non-bond)" || category === "School District (bond)") {
        category = "School District";
      }

      if (!acc[category]) {
        acc[category] = 0;
      }
      
      acc[category] += curr.npvTotal;
      return acc;
    }, {} as Record<string, number>);
  }, [results]);

  return (
    <div>
      <br></br>
      <h1>Your Results</h1>

      <br></br>
        <>
          <h3>Year 1 Summary</h3>
          <table className="basicTable">
            <thead>
              <tr>
                <th>Taxing Unit Name</th>
                <th>Tax Rate</th>
                <th>Proportional Tax Rate</th>
                <th>Capacity Tax Revenue</th>
                <th>Project Real Tax Revenue</th>
                <th>Previous Farmland Tax Revenue</th>
                <th>Net Real Property Revenue</th>
                <th>Net {currentYear} Tax Revenue</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={index}>
                  <td>{result.name}</td>
                  <td>{result.unitRate}%</td>
                  <td>{formatPercent(result.proportionalTaxRate)}</td>
                  <td>{formatCurrency(result.capacityTaxRevenue)}</td>
                  <td>{formatCurrency(result.projectRealTaxRevenue)}</td>
                  <td className="subtractive-text">{formatCurrency(result.previousFarmlandTaxRevenue)}</td>
                  <td>{formatCurrency(result.netRealPropertyRevenue)}</td>
                  <td className="rowHighlight">{formatCurrency(result.netTaxRevenue)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="rowHighlight" style={{ fontWeight: 'bold' }}>
                  <td>Total</td>
                  <td>{year1Totals.unitRate.toFixed(3)}%</td>
                  <td>{formatPercent(year1Totals.proportionalTaxRate)}</td>
                  <td>{formatCurrency(year1Totals.capacityTaxRevenue)}</td>
                  <td>{formatCurrency(year1Totals.projectRealTaxRevenue)}</td>
                  <td>{formatCurrency(year1Totals.previousFarmlandTaxRevenue)}</td>
                  <td>{formatCurrency(year1Totals.netRealPropertyRevenue)}</td>
                  <td>{formatCurrency(year1Totals.netTaxRevenue)}</td>
              </tr>
            </tfoot>
          </table>
        </>

      <br></br>

      <ProjectLifeBreakdown />

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
            {results.map((result, idx) => (
              <tr key={idx}>
                <td>{result.name}</td>
                <td>{formatCurrency(result.grossTotal)}</td>
                <td>{formatCurrency(result.npvTotal)}</td>
              </tr>
            ))}

            {/* Final row: Sum of all units */}
            <tr className="rowHighlight">
              <td>Total (All Units)</td>
              <td>{formatCurrency(totalGrossAllUnits)}</td>
              <td>{formatCurrency(totalNPVAllUnits)}</td>
            </tr>
          </tbody>
        </table>
        <br></br>

        <div className="table-container">
        <table className="basicTable">
          <thead>
            <tr>
              <th>Year</th>
                {Array.from({ length: Number(years) }, (_, i) => (
                  <th key={i}>{startYear + i}</th>
                ))}
            </tr>
          </thead>
          <tbody>

            {results.map((result, idx) => (
                <tr key={idx}>
                  <td>{result.name}</td>
                  {result.yearlyCashFlows.map((val, i) => (
                    <td key={i}>{formatCurrency(val)}</td>
                  ))}
                </tr>
              ))}

            <tr className="rowBold">
              <td>Total Revenue (All Units)</td>
              {totalYearlyCashFlows.map((val, i) => (
                <td key={i}>{formatCurrency(val)}</td>
              ))}
            </tr>

            <tr className="rowHighlight">
              <td>Gross Over the Life of the Project (Total Dollar Value)</td>
              <td colSpan={Number(years)}>
                <strong>{formatCurrency(totalGrossAllUnits)}</strong>
              </td>
            </tr>

            <tr className="rowHighlight">
              <td>Net Present Value Over the Life of the Project (Discounted for future inflation and risk)</td>
                <td colSpan={Number(years)}>
                  <strong>{formatCurrency(totalNPVAllUnits)}</strong>
                </td>
            </tr>
          </tbody>
        </table>
        </div>

        <CommunityBenefitsHeader />

        <br></br>

        <table className="basicTable">
          <thead>
              <th></th>
              <th>Expenditure</th>
              <th>Jurisdiction</th>
              <th>Unit Cost</th>
              <th>Total Lifetime Benefit</th>
          </thead>

          <tbody>
              <tr>
                  <td style={{ minWidth: "100px", maxWidth: "200px" }}><img src="/photos-logos/roadway-maintenance.png" alt="Vector graphic of a roadway."></img></td>
                  <td>Roadway Maintenance</td>
                  <td>County</td>
                  <td>~$11,908 per mile</td>
                  <td>
                      ~{Math.round((totalsByType["County"]) / 11908)} miles
                  </td>
              </tr>

              <tr>
                  <td style={{ minWidth: "100px", maxWidth: "200px" }}><img src="/photos-logos/fire-truck.png" alt="Vector graphic of a firefighter"></img></td>
                  <td>Fire Trucks</td>
                  <td>Township</td>
                  <td>~$1,750,000 per regular fire truck</td>
                  <td>~{Math.round((totalsByType["Township"] || 0) / 1750000)} fire truck(s)</td>
              </tr>

              <tr>
                  <td style={{ minWidth: "100px", maxWidth: "200px" }}><img src="/photos-logos/teacher.png" alt="Vector graphic of a fire truck"></img></td>
                  <td>Public School Teachers</td>
                  <td>School District</td>
                  <td>~$80,270 per annual salary</td>
                  <td>~{Math.round((totalsByType["School District"] || 0) / 80270)} full-time employee annual salaries</td>
              </tr>
          </tbody>
      </table>
    </div>
  );
}