"use client";
import React from "react";
import { ProjectData } from "@/types/IAWindProject";
import { generateWindTaxResults } from "@/utils/IACalculations";

interface IAWindTaxResultsProps {
  projectData: ProjectData;
  dbCounties?: any[];
  dbCountyTaxData?: any[];
  dbCityData?: any[];
}

export default function IAWindTaxResults({ 
  projectData, 
  dbCounties = [], 
  dbCountyTaxData = [], 
  dbCityData = [] 
}: IAWindTaxResultsProps) {

  // Helper functions: NPV, Gross, and currency formatting.
  function calculateNPV(rate: number, cash_flows: number[]): number {
    return cash_flows.reduce((sum: number, cf: number, i: number) => {
      return sum + cf / Math.pow(1 + rate, i);
    }, 0);
  }

  // Helper functions.
  const formatCurrency = (value: any) => {
    if (value === "N/A" || value === undefined || value === null) return "N/A";
    
    const parsed = typeof value === "string" ? parseFloat(value) : Number(value);
    if (isNaN(parsed)) return "$0";

    const rounded = Math.round(parsed);
    if (rounded === 0) return "$0";
    
    return rounded < 0 
      ? `($${Math.abs(rounded).toLocaleString()})` 
      : `$${rounded.toLocaleString()}`;
  };

  const calcResults = generateWindTaxResults({
    projectData,
    dbCounties,
    dbCountyTaxData,
    dbCityData
  });

  // // ----------- TEMP ------------- //
  // console.log("CALC RESULTS CAPTURED:", calcResults);
  // return (
  //   <div style={{ padding: '20px', background: '#000', color: '#0f0' }}>
  //     <h1>Check Console (F12)</h1>
  //     <pre>{JSON.stringify(calcResults.totals, null, 2)}</pre>
  //   </div>
  // );

  const { millageRows } = calcResults;

  // Assign the discount and inflation rates.
  const rawInflation = Number(projectData.inflation_rate ?? 2.5);
  const inflationRate = rawInflation > 0.5 ? rawInflation / 100 : rawInflation;

  const rawDiscount = Number(projectData.discount_rate ?? 6.0);
  const discountRate = rawDiscount > 0.5 ? rawDiscount / 100 : rawDiscount;

  // Track project lifespan properties.
  const lifespanYears = Number(projectData.expected_useful_life || 30);
  const startYear: number = new Date().getFullYear();
  const timelineYears = Array.from({ length: lifespanYears }, (_, idx) => startYear + idx);

  // Parse TIF Variables
  const isTif = projectData.is_project_tif?.toLowerCase() === "yes";
  const tifReductionPercent = Number(projectData.tif_percentage || 0) / 100;

  // Reconstruct Taxable Valuation multipliers.
  const multipliers = [0, 0.05, 0.10, 0.15, 0.20, 0.25, 0.30];


  const costPerMW = projectData.use_estimated_wind_net_acquisition_cost === "no" 
    ? Number(projectData.wind_net_acquisition_cost || 0)
    : 1000000;
  const capacityMW = Number(projectData.nameplate_capacity || 0);
  const netAcquisitionCost = costPerMW * capacityMW;

  const totalMillageRate = millageRows.reduce((sum: number, r: any) => sum + r.mills, 0);

  // const tifEffectiveMillage = totalMillageRate;

  // Create jurisdictional datasets over the lifespan of the project.
  const baseJurisdictionsData = millageRows.map((m: any) => {
    const currentMills = Number(m.mills || 0);
    const baselineFarmlandTaxYear1 = Number(m.previousRevenue || m.baselineRevenue || 0);

    const yearlyNetImpacts = Array.from({ length: lifespanYears }, (_, idx) => {
      const multiplier = idx < multipliers.length ? multipliers[idx] : 0.30;
      const baseProjectTax = (netAcquisitionCost * multiplier) * (m.mills / 1000);

      // If TIF is active, this unit only receives its remaining portion
      const projectTaxThisYear = isTif 
        ? baseProjectTax * (1 - tifReductionPercent) 
        : baseProjectTax;

      const inflationMultiplier = Math.pow(1 + inflationRate, idx);
      const baselineFarmlandTaxThisYear = baselineFarmlandTaxYear1 * inflationMultiplier;
      
      const netImpact = projectTaxThisYear - baselineFarmlandTaxThisYear;
      return isNaN(netImpact) ? 0 : netImpact;
    });

    const grossLifetime = yearlyNetImpacts.reduce((sum, v) => sum + v, 0);
    const npvLifetime = calculateNPV(discountRate, yearlyNetImpacts);

    const year1Multiplier = multipliers[0]; 
    const year1BaseTax = (netAcquisitionCost * year1Multiplier) * (m.mills / 1000);
    const year1ProjectTax = isTif ? year1BaseTax * (1 - tifReductionPercent) : year1BaseTax;

    return {
      jurisdiction: m.jurisdiction,
      name: m.name,
      mills: currentMills,
      year1ProjectTax: isNaN(year1ProjectTax) ? 0 : year1ProjectTax,
      previousRevenue: baselineFarmlandTaxYear1,
      year1NetImpact: (isNaN(year1ProjectTax) ? 0 : year1ProjectTax) - baselineFarmlandTaxYear1,
      yearlyNetImpacts,
      grossLifetime: isNaN(grossLifetime) ? 0 : grossLifetime,
      npvLifetime: isNaN(npvLifetime) ? 0 : npvLifetime
    };
  });

  let tifRow: any = null;
  if (isTif) {
    const yearlyNetImpacts = Array.from({ length: lifespanYears }, (_, idx) => {
      const multiplier = idx < multipliers.length ? multipliers[idx] : 0.30;
      const tifImpact = (netAcquisitionCost * multiplier) * (totalMillageRate / 1000) * tifReductionPercent;
      return isNaN(tifImpact) ? 0 : tifImpact;
    });

    const grossLifetime = yearlyNetImpacts.reduce((sum, v) => sum + v, 0);
    const npvLifetime = calculateNPV(discountRate, yearlyNetImpacts);
    
    const year1Multiplier = multipliers[0];
    const year1ProjectTax = (netAcquisitionCost * year1Multiplier) * (totalMillageRate / 1000) * tifReductionPercent;

  tifRow = {
      jurisdiction: "TIF District",
      name: "Collected by county for special projects",
      mills: 0,
      year1ProjectTax: isNaN(year1ProjectTax) ? 0 : year1ProjectTax,
      previousRevenue: 0,
      year1NetImpact: isNaN(year1ProjectTax) ? 0 : year1ProjectTax,
      yearlyNetImpacts,
      grossLifetime: isNaN(grossLifetime) ? 0 : grossLifetime,
      npvLifetime: isNaN(npvLifetime) ? 0 : npvLifetime,
      isTifRow: true
    };
  }
  
  const fullLifetimeData = [...baseJurisdictionsData];
  if (isTif && tifRow) {
    fullLifetimeData.push(tifRow);
  }

  // Aggregated Totals across columns
  const totalProjectYear1 = fullLifetimeData.reduce((sum, r) => sum + r.year1ProjectTax, 0);
  const totalFarmlandYear1 = fullLifetimeData.reduce((sum, r) => sum + r.previousRevenue, 0);
  const totalNetYear1 = totalProjectYear1 - totalFarmlandYear1;

  const grandGross = fullLifetimeData.reduce((sum: number, r: any) => sum + (r.grossLifetime || 0), 0);
  const grandNPV = fullLifetimeData.reduce((sum: number, r: any) => sum + (r.npvLifetime || 0), 0);

  const combinedCountyNPV = fullLifetimeData
    .filter((f: any) => f.jurisdiction.toLowerCase().includes("county"))
    .reduce((sum, r) => sum + r.npvLifetime, 0);

  const schoolNPV = fullLifetimeData.find((f: any) => f.jurisdiction === "School District")?.npvLifetime || 0;

  return (
    <div>
      <h1>Your Results</h1>
      <br></br>

      <h3>Year 1 Summary</h3>

      <p className="description-text">
        Note: Under Iowa Special Valuation laws, wind energy properties are assessed at a 0% multiplier in Year 1. 
        Net impacts reflect the subtraction of previous farmland baseline expectations.
      </p>

      <div className="table-container">
        <table className="basicTable">
        <thead>
          <tr>
            <th>Unit</th>
            <th>Jurisdiction Name</th>
            <th>Millage Rate</th>
            <th>Year 1 Wind Project Tax Revenue</th>
          </tr>
        </thead>
        <tbody>
          {baseJurisdictionsData.map((u, idx) => (
              <tr key={`${u.jurisdiction}-${idx}`}>
                <td>{u.jurisdiction}</td>
                <td>{u.name || "—"}</td>
                <td>{Number(u.mills || 0).toFixed(4)}</td>
                <td>{formatCurrency(u.year1ProjectTax)}</td>
              </tr>
            ))}

            {isTif && tifRow ? (
              <tr key="tif-row-summary">
                <td style={{ fontWeight: "bold" }}>{tifRow.jurisdiction}</td>
                <td>{tifRow.name}</td>
                <td>—</td>
                <td>{formatCurrency(tifRow.year1ProjectTax)}</td>
              </tr>
            ) : (
              <tr key="tif-row-summary-na">
                <td style={{ fontWeight: "bold" }}>TIF District</td>
                <td>Collected by county for special projects</td>
                <td>—</td>
                <td>N/A</td>
              </tr>
            )}

            <tr className="rowHighlight">
              <td colSpan={2}>Total Year 1 Impact</td>
              <td>{baseJurisdictionsData.reduce((s, r) => s + (r.mills || 0), 0).toFixed(4)}</td>
              <td>{formatCurrency(totalProjectYear1)}</td>
            </tr>
          </tbody>
      </table>
      </div>

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
              <tr key={`gross-${u.jurisdiction}-${idx}`}>
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
              <tr key={`timeline-${u.jurisdiction}-${idx}`}>
                <td style={{ fontWeight: "bold", minWidth: "180px" }}>
                  {u.jurisdiction}: {u.name || "—"}
                </td>
                {u.yearlyNetImpacts?.map((val: number, idxY: number) => (
                  <td key={idxY}>{formatCurrency(val)}</td>
                ))}
              </tr>
            ))}
          <tr className="rowBold">
            <td>
              Total Across Jurisdictions
            </td>
              {timelineYears.map((_, idx) => {
                const yearTotal = fullLifetimeData.reduce((s: number, u: any) => s + (u.yearlyNetImpacts?.[idx] || 0), 0);
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

        <br></br>
        <br></br>

        <h1>Community Benefits Table</h1>
        <br></br>

        <p>
          Below is an estimate of real-world community benefits from your 
          planned renewable project over the course of its lifespan.
        </p>

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
