"use client";
import React from "react";
import { ProjectData } from "@/types/OHProject";
import { calculateOHRevenue } from "@/utils/OHCalculations";
import { useState, useMemo } from "react";

interface OHTaxResultsProps {
  projectData: ProjectData;
}

export default function OHTaxResults({ projectData }: OHTaxResultsProps) {
    const results = useMemo(() => calculateOHRevenue(projectData), [projectData]);

    const isQEP = projectData.is_project_status_qep === "yes";
    const isSolar = projectData.project_type === "Solar";
    const isWind = projectData.project_type === "Wind";

    const years = projectData.expected_useful_life || 30;
    const startYear = new Date().getFullYear();

    // Helper to aggregate results by category.
    const getTotalsByType = (typeKeywords: string[]) => {
      const filtered = results.filter(r =>
        typeKeywords.some(key => r.name.toLowerCase().includes(key.toLowerCase()))
      );
      const gross = filtered.reduce((sum, r) => sum + r.grossTotal, 0)
      const npv = filtered.reduce((sum, r) => sum + r.npvTotal, 0);
      const yearly = Array.from({length: Number(years)}, (_, i) =>
        filtered.reduce((sum, r) => sum + r.yearlyCashFlows[i], 0)
      );

      return { gross, npv, yearly }
    };

    // Helper functions.
    const formatCurrency = (value: number) => {
        const rounded = Math.round(value);
            if (rounded === 0) return "$0";
            return rounded < 0 
            ? `($${Math.abs(rounded).toLocaleString()})` 
            : `$${rounded.toLocaleString()}`;
        };

    const currentYear = new Date().getFullYear();
  
    function calculateNPV(rate: number, cash_flows: number[]) {
        return cash_flows.reduce((sum, cf, i) => {
        return sum + cf / Math.pow(1 + rate, i);
        }, 0);
    }

    function calculateGrossTotal(values: number[]) {
        return values.reduce((sum, v) => sum + v, 0);
    }

    const calculatedUnits = useMemo(() => calculateOHRevenue(projectData), [projectData]);
  
  return (
    <div>
      <br></br>
      <h1>Your Results</h1>
        {(isQEP && isSolar) && (
        <>
          <h3>Year 1 Summary (Solar, QEP)</h3>
          <table className="basicTable">
            <thead>
              <tr>
                <th>Political Unit</th>
                <th>Previous Farmland</th>
                <th>QEP Base Revenue</th>
                <th>QEP Discretionary Revenue</th>
                <th>Total {currentYear} Net Revenue</th>
              </tr>
            </thead>
            <tbody>
              {calculatedUnits.map((unit, index) => {
                  const totalNet = unit.qepBaseRevenue + unit.qepDiscretionaryRevenue - unit.previousFarmland;
                  return (
                    <tr key={index}>
                      <td>{unit.name}</td>
                      <td>{formatCurrency(unit.previousFarmland)}</td>
                      <td>{formatCurrency(unit.qepBaseRevenue)}</td>
                      <td>{formatCurrency(unit.qepDiscretionaryRevenue)}</td>
                      <td className="rowHighlight">{formatCurrency(totalNet)}</td>
                    </tr>
                  );
                })}
            </tbody>
            <tfoot>
              <tr className="rowHighlight">
                <td>Total All Units</td>
                <td>{formatCurrency(calculatedUnits.reduce((s, u) => s + u.previousFarmland, 0))}</td>
                <td>{formatCurrency(calculatedUnits.reduce((s, u) => s + u.qepBaseRevenue, 0))}</td>
                <td>{formatCurrency(calculatedUnits.reduce((s, u) => s + u.qepDiscretionaryRevenue, 0))}</td>
                <td>{formatCurrency(calculatedUnits.reduce((s, u) => s + (u.qepBaseRevenue + u.qepDiscretionaryRevenue - u.previousFarmland), 0))}</td>
              </tr>
            </tfoot>
          </table>
        </>
      )}

      <br></br>

        {(!isQEP && isSolar) && (
        <>
          <h3>Year 1 Summary (Solar, Non-QEP)</h3>
          <table className="basicTable">
            <thead>
              <tr>
                <th>Political Unit</th>
                <th>Previous Farmland</th>
                <th>Solar Land</th>
                <th>Net Land Revenue</th>
                <th>Solar Equipment Tax Revenue</th>
                <th>Total {currentYear} Net Revenue</th>
              </tr>
            </thead>
            <tbody>
              {calculatedUnits.map((unit, index) => {
                const netLandRevenue = unit.landRevenue - unit.previousFarmland;
                const totalNetRevenue = netLandRevenue + unit.equipmentRevenue;
                return (
                  <tr key={index}>
                    <td>{unit.name}</td>
                    <td>{formatCurrency(unit.previousFarmland)}</td>
                    <td>{formatCurrency(unit.landRevenue)}</td>
                    <td className="rowBold">
                      {formatCurrency(netLandRevenue)}
                    </td>
                    <td>{formatCurrency(unit.equipmentRevenue)}</td>
                    <td className="rowHighlight">{formatCurrency(totalNetRevenue)}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="rowHighlight">
                <td>Total All Units</td>
                <td>{formatCurrency(calculatedUnits.reduce((s, u) => s + u.previousFarmland, 0))}</td>
                <td>{formatCurrency(calculatedUnits.reduce((s, u) => s + u.landRevenue, 0))}</td>
                <td>{formatCurrency(calculatedUnits.reduce((s, u) => s + (u.landRevenue - u.previousFarmland), 0))}</td>
                <td>{formatCurrency(calculatedUnits.reduce((s, u) => s + u.equipmentRevenue, 0))}</td>
                <td>{formatCurrency(calculatedUnits.reduce((s, u) => s + (u.landRevenue - u.previousFarmland + u.equipmentRevenue), 0))}</td>
              </tr>
            </tfoot>
          </table>
        </>
      )}

        {(!isQEP && isWind) && (
        <>
          <h3>Year 1 Summary (Wind, Non-QEP)</h3>
          <table className="basicTable">
            <thead>
              <tr>
                <th>Political Unit</th>
                <th>Previous Farmland</th>
                <th>Wind Land</th>
                <th>Net Land Revenue</th>
                <th>Wind Equipment Tax Revenue</th>
                <th>Total {currentYear} Net Revenue</th>
              </tr>
            </thead>
            <tbody>
              {calculatedUnits.map((unit, index) => {
                const netLandRevenue = unit.landRevenue - unit.previousFarmland;
                const totalNetRevenue = netLandRevenue + unit.equipmentRevenue;
                return (
                  <tr key={index}>
                    <td>{unit.name}</td>
                    <td>{formatCurrency(unit.previousFarmland)}</td>
                    <td>{formatCurrency(unit.landRevenue)}</td>
                    <td>{formatCurrency(netLandRevenue)}</td>
                    <td>{formatCurrency(unit.equipmentRevenue)}</td>
                    <td>{formatCurrency(totalNetRevenue)}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="rowHighlight">
                <td>Total All Units</td>
                <td>{formatCurrency(calculatedUnits.reduce((s, u) => s + u.previousFarmland, 0))}</td>
                <td>{formatCurrency(calculatedUnits.reduce((s, u) => s + u.landRevenue, 0))}</td>
                <td>{formatCurrency(calculatedUnits.reduce((s, u) => s + (u.landRevenue - u.previousFarmland), 0))}</td>
                <td>{formatCurrency(calculatedUnits.reduce((s, u) => s + u.equipmentRevenue, 0))}</td>
                <td>{formatCurrency(calculatedUnits.reduce((s, u) => s + (u.landRevenue - u.previousFarmland + u.equipmentRevenue), 0))}</td>
              </tr>
            </tfoot>
          </table>
        </>
      )}

        {(isQEP && isWind) && (
        <>
          <h3>Year 1 Summary (Wind, QEP)</h3>
          <table className="basicTable">
            <thead>
              <tr>
                <th>Political Unit</th>
                <th>Previous Farmland</th>
                <th>QEP Base Revenue</th>
                <th>QEP Discretionary Revenue</th>
                <th>Total {currentYear} Net Revenue</th>
              </tr>
            </thead>
            <tbody>
              {calculatedUnits.map((unit, index) => {
                const totalNet = unit.qepBaseRevenue + unit.qepDiscretionaryRevenue - unit.previousFarmland;
                return (
                  <tr key={index}>
                    <td>{unit.name}</td>
                    <td>{formatCurrency(unit.previousFarmland)}</td>
                    <td>{formatCurrency(unit.qepBaseRevenue)}</td>
                    <td>{formatCurrency(unit.qepDiscretionaryRevenue)}</td>
                    <td>{formatCurrency(totalNet)}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="rowHighlight">
                <td>Total All Units</td>
                <td>{formatCurrency(calculatedUnits.reduce((s, u) => s + u.previousFarmland, 0))}</td>
                <td>{formatCurrency(calculatedUnits.reduce((s, u) => s + u.qepBaseRevenue, 0))}</td>
                <td>{formatCurrency(calculatedUnits.reduce((s, u) => s + u.qepDiscretionaryRevenue, 0))}</td>
                <td>{formatCurrency(calculatedUnits.reduce((s, u) => s + (u.qepBaseRevenue + u.qepDiscretionaryRevenue - u.previousFarmland), 0))}</td>
              </tr>
            </tfoot>
          </table>
        </>
      )}

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
            {calculatedUnits.map((unit, index) => (
              <tr key={index}>
                <td>{unit.name}</td>
                <td>{formatCurrency(unit.grossTotal)}</td>
                <td>{formatCurrency(unit.npvTotal)}</td>
              </tr>
            ))}

            {/* Final row: Sum of all units */}
            <tr className="rowHighlight">
              <td><strong>All Jurisdictions</strong></td>
              <td><strong>{formatCurrency(calculatedUnits.reduce((sum, u) => sum + u.grossTotal, 0))}</strong></td>
              <td><strong>{formatCurrency(calculatedUnits.reduce((sum, u) => sum + u.npvTotal, 0))}</strong></td>
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
            {calculatedUnits.map((unit, unitIndex) => (
              <tr key={unitIndex}>
                <td>{unit.name}</td>
                {unit.yearlyCashFlows.map((value, i) => (
                  <td key={i}>{formatCurrency(value)}</td>
                ))}
              </tr>
            ))}

            <tr className="rowBold">
              <td>Total Gross Per Year (All Jurisdictions)</td>
              {Array.from({ length: Number(years) }, (_, i) => {
                const yearTotal = calculatedUnits.reduce((sum, unit) => sum + unit.yearlyCashFlows[i], 0);
                return <td key={i}>{formatCurrency(yearTotal)}</td>;
              })}
            </tr>

            <tr className="rowHighlight">
              <td>Gross Over the Life of the Project (Total Dollar Value)</td>
              <td colSpan={Number(years)}>
                {formatCurrency(calculatedUnits.reduce((sum, u) => sum + u.grossTotal, 0))}
              </td>
            </tr>

            <td className="rowHighlight">Net Present Value Over the Life of the Project (Discounted for future inflation and risk)</td>
              <td colSpan={Number(years)} className="rowHighlight">
                {formatCurrency(calculatedUnits.reduce((sum, u) => sum + u.npvTotal, 0))}
              </td>
          
          </tbody>
        </table>

    </div>
  );
}