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
      <h1>Your Results</h1>
      <br></br>
        {isQEP && (
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
                const netLandRevenue = unit.landRevenue - unit.previousFarmland;
                const totalNetRevenue = unit.qepBaseRevenue + unit.qepDiscretionaryRevenue - unit.previousFarmland;
                return (
                  <tr key={index}>
                    <td>{unit.name}</td>
                    <td>{formatCurrency(unit.previousFarmland)}</td>
                    <td>{formatCurrency(unit.qepBaseRevenue)}</td>
                    <td>{formatCurrency(unit.qepDiscretionaryRevenue)}</td>
                    <td>{formatCurrency(totalNetRevenue)}</td>
                  </tr>
                );
              })}
            </tbody>
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
          </tbody>
        </table>
        <br></br>

        <table className="basicTable">
          <thead>
            <tr>
            </tr>

            <tr>
              <th>Jurisdiction</th>
            </tr>
          </thead>

          <tbody>
          <tr className="rowBold">
          </tr>

          <tr className="rowHighlight">
          </tr>

          <tr className="rowHighlight">
          </tr>
        
        </tbody>
        </table>

    </div>
  );
}