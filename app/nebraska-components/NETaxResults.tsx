"use client";
import React from "react";
import { ProjectData } from "@/types/NEProject";
// import { calculateNERevenue } from "@/utils/NECalculations";
import { useState, useMemo } from "react";
import { TaxUnit } from "./NETaxTable";
import { calculateNEResults } from "@/utils/NECalculations";

interface NETaxResultsProps {
  projectData: ProjectData;
  taxUnits: TaxUnit[];
  setTaxUnits: React.Dispatch<React.SetStateAction<TaxUnit[]>>;
}

export default function NETaxResults({ projectData, taxUnits }: NETaxResultsProps) {
    // const results = useMemo(() => calculateNERevenue(projectData), [projectData]);

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
                  <td>{formatCurrency(result.netTaxRevenue)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="rowHighlight">
              </tr>
            </tfoot>
          </table>
        </>

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
            

            {/* Final row: Sum of all units */}
            <tr className="rowHighlight">
            </tr>
          </tbody>
        </table>
        <br></br>

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
        
            <tr className="rowBold">
              <td>Total Gross Per Year (All Jurisdictions)</td>
            </tr>

            <tr className="rowHighlight">
              <td>Gross Over the Life of the Project (Total Dollar Value)</td>
              <td colSpan={Number(years)}>
              </td>
            </tr>

            <td className="rowHighlight">Net Present Value Over the Life of the Project (Discounted for future inflation and risk)</td>
              <td colSpan={Number(years)} className="rowHighlight">
              </td>
          
          </tbody>
        </table>

    </div>
  );
}