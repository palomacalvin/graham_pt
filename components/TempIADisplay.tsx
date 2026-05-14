"use client";
import React from "react";
import { IowaAgValueCounty, CalculatedAgCounty } from "@/types/IASolarProject";
import { agLandCalculations } from "@/utils/IACalculations"; // Adjust to your actual path

interface VerificationTableProps {
  dbCounties: IowaAgValueCounty[];
  projectData: any; // Pass your active form state here
}

export function AgCalculationVerificationTable({ dbCounties, projectData }: VerificationTableProps) {
  // Execute the calculation engine for all 99 counties
  const { allCounties } = agLandCalculations(dbCounties, projectData);

  const formatCurrency = (val: number) => 
    `$${Math.round(val).toLocaleString(undefined, { minimumFractionDigits: 0 })}`;

  return (
    <div style={{ padding: "20px", background: "#f9f9f9", borderRadius: "8px", marginTop: "40px" }}>
      <h2 style={{ color: "#d97706" }}>⚠️ DEV ONLY: Ag Land Math Verification Table</h2>
      <p style={{ fontSize: "14px", color: "#666" }}>
        Comparing these values directly to your spreadsheet rows. Active Project Land Area: <strong>{projectData.land_area || 0} Acres</strong>.
      </p>
      
      <div style={{ overflowX: "auto", maxHeight: "500px", border: "1px solid #ccc" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
          <thead style={{ position: "sticky", top: 0, background: "#333", color: "#fff" }}>
            <tr>
              <th style={{ padding: "10px" }}>County</th>
              <th style={{ padding: "10px" }}>Productivity / Acre</th>
              <th style={{ padding: "10px" }}>Ag Acres</th>
              <th style={{ padding: "10px" }}>Avg CSR2</th>
              <th style={{ padding: "10px" }}>Target Value (Derived)</th>
              <th style={{ padding: "10px" }}>Total CSR Points (Derived)</th>
              <th style={{ padding: "10px" }}>$/CSR Point (Derived)</th>
              <th style={{ padding: "10px" }}>Project Assessed Value (Derived)</th>
            </tr>
          </thead>
          <tbody>
            {allCounties.map((county) => (
              <tr key={county.county_name} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "10px", fontWeight: "bold" }}>{county.county_name}</td>
                <td style={{ padding: "10px" }}>{formatCurrency(county.productivity_per_acre)}</td>
                <td style={{ padding: "10px" }}>{Number(county.number_of_ag_acres_in_county).toLocaleString()}</td>
                <td style={{ padding: "10px" }}>{county.average_csr_in_county}</td>
                <td style={{ padding: "10px", color: "#2563eb" }}>{formatCurrency(county.targetValueAgLand)}</td>
                <td style={{ padding: "10px", color: "#2563eb" }}>{Number(county.estimatedTotalCsrPoints).toLocaleString()}</td>
                <td style={{ padding: "10px", color: "#16a34a", fontWeight: "bold" }}>${county.dollarsPerCsrPoint.toFixed(2)}</td>
                <td style={{ padding: "10px", color: "#dc2626", fontWeight: "bold" }}>{formatCurrency(county.totalProjectLandAssessedValue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}