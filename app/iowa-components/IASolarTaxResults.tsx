"use client";
import React from "react";
import { ProjectData } from "@/types/IASolarProject";
import { generateSolarTaxResults } from "@/utils/IACalculations";
import ProjectLifeBreakdown from "@/components/Breakdown";
import CommunityBenefitsHeader from "@/components/CommunityBenefits";

interface IASolarTaxResultsProps {
  projectData: ProjectData;
  dbCounties?: any[];
  dbCountyTaxData?: any[];
  dbCityData?: any[];
}

export default function IASolarTaxResults({ 
  projectData, 
  dbCounties = [], 
  dbCountyTaxData = [], 
  dbCityData = [] 
}: IASolarTaxResultsProps) {

  // Helper functions: NPV, Gross, and currency formatting.
  function calculateNPV(rate: number, cash_flows: number[]): number {
    return cash_flows.reduce((sum: number, cf: number, i: number) => {
      return sum + cf / Math.pow(1 + rate, i);
    }, 0);
  }

  // Helper functions.
  const formatCurrency = (value: number) => {
    const rounded = Math.round(value);
      if (rounded === 0) return "$0";
      return rounded < 0 
        ? `($${Math.abs(rounded).toLocaleString()})` 
        : `$${rounded.toLocaleString()}`;
    };

  const calcResults = generateSolarTaxResults({
    projectData,
    dbCounties,
    dbCountyTaxData,
    dbCityData
  });

  const { taxRevenueRows, millageRows } = calcResults;

  // Assign the discount and inflation rates.
  const rawInflation = Number(projectData.inflation_rate ?? 2.5);
  const inflationRate = rawInflation > 0.5 ? rawInflation / 100 : rawInflation;

  const rawDiscount = Number(projectData.discount_rate ?? 3.0);
  const discountRate = rawDiscount > 0.5 ? rawDiscount / 100 : rawDiscount;

  // Track project lifespan properties.
  const lifespanYears = Number(projectData.expected_useful_life || 30);
  const startYear: number = new Date().getFullYear();
  const timelineYears = Array.from({ length: lifespanYears }, (_, idx) => startYear + idx);

  // Create jurisdictional datasets over the lifespan of the project.
  const fullLifetimeData = taxRevenueRows.map((u: any, index: number) => {
    let matchingMillage = millageRows.find((m: any) => m.jurisdiction === u.jurisdiction);
    
    if (!matchingMillage && u.jurisdiction.toLowerCase().includes("county additional")) {
      matchingMillage = millageRows.find((m: any) => m.jurisdiction === "County Additional Rural Rate");
    }

    const previousRevenueBase = matchingMillage?.previousRevenue || 0;
    
    const yearlyNetImpacts = Array.from({ length: lifespanYears }, (_, idx) => {
      const inflationMultiplier = Math.pow(1 + inflationRate, idx);
      const projectTaxThisYear = u.total;
      const baselineFarmlandTaxThisYear = previousRevenueBase * inflationMultiplier;
      
      return projectTaxThisYear - baselineFarmlandTaxThisYear;
    });

    const grossLifetime = yearlyNetImpacts.reduce((sum, v) => sum + v, 0);
    const npvLifetime = calculateNPV(discountRate, yearlyNetImpacts);

    return {
      ...u,
      previousRevenue: matchingMillage?.previousRevenue,
      yearlyNetImpacts,
      grossLifetime,
      npvLifetime
    };
  });

  // Aggregated Totals across columns
  const totalGenerationYear1 = fullLifetimeData.reduce((sum: number, r: any) => sum + (r.generation || 0), 0);
  const totalDeliveryYear1 = fullLifetimeData.reduce((sum: number, r: any) => sum + (r.delivery || 0), 0);
  const totalTransmissionYear1 = fullLifetimeData.reduce((sum: number, r: any) => sum + (r.transmission || 0), 0);
  const totalProjectYear1 = fullLifetimeData.reduce((sum: number, r: any) => sum + (r.total || 0), 0);
  const totalFarmlandYear1 = fullLifetimeData.reduce((sum: number, r: any) => sum + (r.previousRevenue || 0), 0);
  const totalNetYear1 = totalProjectYear1 - totalFarmlandYear1;

  const grandGross = fullLifetimeData.reduce((sum: number, r: any) => sum + r.grossLifetime, 0);
  const grandNPV = fullLifetimeData.reduce((sum: number, r: any) => sum + r.npvLifetime, 0);

  const combinedCountyGross = fullLifetimeData
    .filter((f: any) => f.jurisdiction.toLowerCase().includes("county"))
    .reduce((sum, r) => sum + r.grossLifetime, 0);

  const combinedCountyNPV = fullLifetimeData
    .filter((f: any) => f.jurisdiction.toLowerCase().includes("county"))
    .reduce((sum, r) => sum + r.npvLifetime, 0);

  const schoolNPV = fullLifetimeData.find((f: any) => f.jurisdiction === "School District")?.npvLifetime || 0;

  return (
    <div>
      <h1>Your Results</h1>
      <br></br>

      <h3>Year 1 Summary</h3>

      <div className="table-container">
        <table className="basicTable">
        <thead>
          <tr>
            <th>Unit</th>
              <th>Jurisdiction Name</th>
              <th>Generation Tax Revenue</th>
              <th>Delivery Tax Revenue</th>
              <th>Transmission Tax Revenue</th>
              <th>Total Project Payments</th>
              <th>Previous Farmland Tax</th>
              <th>Net Tax Impact</th>
          </tr>
        </thead>
        <tbody>
          {fullLifetimeData.map((u, idx) => {
              const netYear1 = u.total - u.previousRevenue;
              return (
                <tr key={`${u.jurisdiction}-${idx}`}>
                  <td>{u.jurisdiction}</td>
                  <td>{u.name || "—"}</td>
                  <td>{formatCurrency(u.generation)}</td>
                  <td>{formatCurrency(u.delivery)}</td>
                  <td>{formatCurrency(u.transmission)}</td>
                  <td>{formatCurrency(u.total)}</td>
                  <td className="subtractive-text">-({formatCurrency(u.previousRevenue)})</td>
                  <td className="rowBold">
                    {formatCurrency(netYear1)}
                  </td>
                </tr>
              );
            })}
            <tr className="rowHighlight">
              <td colSpan={2}>Total Year 1 Impact</td>
              <td>{formatCurrency(totalGenerationYear1)}</td>
              <td>{formatCurrency(totalDeliveryYear1)}</td>
              <td>{formatCurrency(totalTransmissionYear1)}</td>
              <td>{formatCurrency(totalProjectYear1)}</td>
              <td>{formatCurrency(totalFarmlandYear1)}</td>
              <td>{formatCurrency(totalNetYear1)}</td>
            </tr>
          </tbody>
      </table>
      </div>

        <br></br>

        <ProjectLifeBreakdown />

        <br />

        <h3>Jurisdictional Gross & NPV Totals</h3>
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
            {fullLifetimeData.map((u, idx) => (
              <tr key={`${u.jurisdiction}-${idx}`}>
                <td>{u.jurisdiction}: {u.name || "—"}</td>
                <td>{formatCurrency(u.grossLifetime)}</td>
                <td>{formatCurrency(u.npvLifetime)}</td>
              </tr>
            ))}
            <tr className="rowHighlight">
              <td>All Jurisdictions</td>
              <td>{formatCurrency(grandGross)}</td>
              <td>{formatCurrency(grandNPV)}</td>
            </tr>
          </tbody>
        </table>
        </div>

        <br></br>

        <div className="table-container">
        <table className="basicTable">
          <thead>
            <tr>
            </tr>

            <tr>
              <th>Jurisdiction</th>
              {timelineYears.map((year) => (
                <th key={year}>{year}</th>
              ))}
            </tr>
          </thead>

          <tbody>
          {fullLifetimeData.map((u, idx) => (
              <tr key={`${u.jurisdiction}-${idx}`}>
                <td style={{ fontWeight: "bold", minWidth: "180px" }}>
                  {u.jurisdiction}: {u.name || "—"}
                </td>
                {u.yearlyNetImpacts.map((val: number, idxY: number) => (
                  <td key={idxY}>{formatCurrency(val)}</td>
                ))}
              </tr>
            ))}
          <tr className="rowBold">
            <td>
              Total Across Jurisdictions
            </td>
              {timelineYears.map((_, idx) => {
                const yearTotal = fullLifetimeData.reduce((s: number, u: any) => s + u.yearlyNetImpacts[idx], 0);
                return <td key={idx}>{formatCurrency(yearTotal)}</td>;
              })}
            </tr>

          <tr className="rowHighlight">
            <td colSpan={3}>Gross Over the Life of the Project (Total Dollar Value)</td>
            <td colSpan={projectData.expected_useful_life}>{formatCurrency(grandGross)}</td>
          </tr>

          <tr className="rowHighlight">
            <td colSpan={3}>Net Present Value Over the Life of the Project (Discounted for future inflation and risk)</td>
            <td colSpan={projectData.expected_useful_life}>{formatCurrency(grandNPV)}</td>
          </tr>
        
        </tbody>
        </table>
        </div>

        <CommunityBenefitsHeader />

        <br></br>

        <div className="table-container">
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
                  <td>~$13,362 per mile</td>
                  <td>
                      ~{Math.round((combinedCountyNPV) / 13362)} miles
                  </td>
              </tr>

              <tr>
                  <td style={{ minWidth: "100px", maxWidth: "200px" }}><img src="/photos-logos/fire-truck.png" alt="Vector graphic of a firefighter"></img></td>
                  <td>Fire Trucks</td>
                  <td>County</td>
                  <td>~$1,400,000 per regular fire truck</td>
                  <td>~{Math.round((combinedCountyNPV) / 1400000)} fire truck(s)</td>
              </tr>

              <tr>
                  <td style={{ minWidth: "100px", maxWidth: "200px" }}><img src="/photos-logos/teacher.png" alt="Vector graphic of a fire truck"></img></td>
                  <td>Public School Teachers</td>
                  <td>School District</td>
                  <td>~$83,615 per annual salary</td>
                  <td>~{Math.round((schoolNPV) / 83615)} full-time employee annual salaries</td>
              </tr>
          </tbody>
      </table>
      </div>
    </div>
  )};
