// WIResults.tsx
"use client";
import React from "react";
import type { ProjectData } from "@/types/WIProject";


interface Props {
    projectData?: ProjectData;

}

// For creating 25-year array of results.
interface YearResults {
  year: number;
  utility_aid: number;
  conversion_charge: number;
  reduction_in_local_pt: number;
  net_benefit: number;
  total_to_school: number;
  total_to_college: number;
  total_to_county: number;
  total_to_tvc: number;
  total_to_other: number;
}

// Creates formatting for the currency results, adding $ and separating commas.
const formatCurrency = (value: number) => {
  const rounded = Math.round(value);
  if (rounded < 0) {
    return `($${Math.abs(rounded).toLocaleString()})`;
  }
  return `$${rounded.toLocaleString()}`;
};

function inflationArray(base: number, years: number, rate: number) {
  const arr = [base];
  for (let i = 1; i < years; i++) {
    arr.push(arr[i - 1] * (1 + rate));
  }
  return arr;
}

function calculateNPV(rate: number, cash_flows: number[]) {
  return cash_flows.reduce((sum, cf, i) => {
    return sum + cf / Math.pow(1 + rate, i);
  }, 0);
}

function calculateGrossTotal(values: number[]) {
  return values.reduce((sum, v) => sum + v, 0);
}


export default function WIResults({ projectData }: Props) {
  if (
    !projectData ||
    projectData.land_area === 0 ||
    projectData.nameplate_capacity === 0
  ) {
    return (
      <p style={{ marginTop: "2rem" }}>
        Select a county and enter project details to see results.
      </p>
    );
  }

  // Hardcoded values.
  const UTILITY_AID_PER_MW = 5000;

  // Utility aid payment distribution.
    const UTILITY_AID_SPLIT = {
        town: {
            to_tvc: 2166.67,
            to_county: 2833.33,
        },
        city_village: {
            to_tvc: 2833.33,
            to_county: 2166.67,
        },
    };

    // Conversion charge distribution.
    const CONVERSION_CHARGE_SPLIT = {
        to_tvc: 0.5,
        to_county: 0.5,
    };

    // Define the conversion charge type.
    const getConversionChargeRate = (projectData: ProjectData) => {
    const acres = projectData.land_area;

      if (acres > 30) return projectData.over_30_acres;
      if (acres >= 10) return projectData.between_10_and_30_acres;
      return projectData.under_10_acres;
    };

    // Get the conversion charge rate based on acreage.
    const conversion_charge_rate = getConversionChargeRate(projectData);


    // Variables for storing calculation information.
    const project_size = projectData.nameplate_capacity;
    const acres_converted = projectData.land_area;
    const tvc = projectData.tvc;

    const utility_aid_total = project_size * UTILITY_AID_PER_MW;
    const is_town = tvc === "Town";

    const utility_aid_to_tvc = is_town
        ? UTILITY_AID_SPLIT.town.to_tvc * project_size
        : UTILITY_AID_SPLIT.city_village.to_tvc * project_size;

    const utility_aid_to_county = is_town
        ? UTILITY_AID_SPLIT.town.to_county * project_size
        : UTILITY_AID_SPLIT.city_village.to_county * project_size;

    const total_conversion_charge = 
        acres_converted * conversion_charge_rate;

    const conversion_charge_to_tvc = total_conversion_charge * CONVERSION_CHARGE_SPLIT.to_tvc;
    const conversion_charge_to_county = total_conversion_charge * CONVERSION_CHARGE_SPLIT.to_county;

    


    const getAgUseValue = (projectData: ProjectData) => {
    switch (projectData.selected_grade) {
      case 1:
        return projectData.grade_1;
      case 2:
        return projectData.grade_2;
      case 3:
        return projectData.grade_3;
      case 4:
        return projectData.pasture;
      default:
        return 0;
    }
  };

      const school_tax = Number(projectData.school_tax);
      const college_tax = Number(projectData.college_tax);
      const county_tax = Number(projectData.county_tax);
      const local_tax = Number(projectData.local_tax);
      const other_tax = Number(projectData.other_tax);

      const total_tax_rate =
        school_tax + college_tax + county_tax + local_tax + other_tax;

      const school_pct = school_tax / total_tax_rate;
      const college_pct = college_tax / total_tax_rate;
      const county_pct = county_tax / total_tax_rate;
      const local_pct = local_tax / total_tax_rate;
      const other_pct = other_tax / total_tax_rate;


    // Formatting string.
    const format$ = (value: number) => `$${Math.round(value)}`;

    const YEARS = projectData.expected_useful_life || 30;

    const base_conversion_charge =
      acres_converted * conversion_charge_rate;

    const use_value_ag = getAgUseValue(projectData);

    let converted_acres = 0;
    switch (projectData.selected_grade) {
      case 1:
        converted_acres = Number(projectData.grade_1);
        break;
      case 2:
        converted_acres = Number(projectData.grade_2);
        break;
      case 3:
        converted_acres = Number(projectData.grade_3);
        break;
      case 4:
        converted_acres = Number(projectData.pasture);
        break;
    }

    const totalToSchool = Number(projectData.school_tax) * converted_acres / acres_converted;
    const totalToCollege = Number(projectData.college_tax) * converted_acres / acres_converted;

    const reduction_in_local_pt = acres_converted * Number(projectData.gross_rate) * use_value_ag;

    // const yearlyResults = Array.from({ length: YEARS }, (_, i) => {
    //   const year = i + 1;

    //   const utility_aid = utility_aid_total;
    //   const conversion_charge =
    //     year === 1 ? base_conversion_charge : 0;

    //   const net_benefit =
    //     utility_aid +
    //     conversion_charge -
    //     reduction_in_local_pt;

    //   return {
    //     year,
    //     utility_aid,
    //     conversion_charge,
    //     reduction_in_local_pt: -reduction_in_local_pt,
    //     net_benefit,

    //     total_to_school:
    //       -reduction_in_local_pt * school_pct,

    //     total_to_college:
    //       -reduction_in_local_pt * college_pct,

    //     total_to_county:
    //       utility_aid_to_county +
    //       (year === 1 ? conversion_charge_to_county : 0),

    //     total_to_tvc:
    //       utility_aid_to_tvc +
    //       (year === 1 ? conversion_charge_to_tvc : 0),


    //     total_to_other:
    //       -reduction_in_local_pt * other_pct,
    //   };
    // });

    // Building Yearly Arrays

    // Utility aid (no inflation)
    const utility_aid_array = Array(YEARS).fill(utility_aid_total);

    // Conversion charge (year 1 only)
    const conversion_array = Array.from({ length: YEARS }, (_, i) =>
      i === 0 ? base_conversion_charge : 0
    );

    // Reduction in local PT w/inflation
    const inflated_reduction_array = inflationArray(
      reduction_in_local_pt,
      YEARS,
      projectData.inflation_rate
    );

    console.log("WISCONSIN INFLATION")
    console.log("inflation rate", projectData.inflation_rate);
    console.log("use value ag", use_value_ag);
    console.log("inflated_reduction_array", inflated_reduction_array);

    

    // Net cash flow array (total)
    const net_cash_flows = utility_aid_array.map((val, i) =>
      val + conversion_array[i] - inflated_reduction_array[i]
    );

    // Jurisdiction cash flows.

    const county_cash_flows = Array.from({ length: YEARS }, (_, i) =>
      -inflated_reduction_array[i] * county_pct + 
      utility_aid_to_county + 
      (i === 0 ? conversion_charge_to_county : 0)
    );

    const tvc_cash_flows = Array.from({ length: YEARS }, (_, i) =>
      -inflated_reduction_array[i] * local_pct + 
        utility_aid_to_tvc +
        (i === 0 ? conversion_charge_to_tvc : 0)
    );

    console.log("County cash flows:", county_cash_flows);
    console.log("TVC cash flows:", tvc_cash_flows);

    const school_cash_flows = inflated_reduction_array.map(
      (val) => -val * school_pct
    );

    const college_cash_flows = inflated_reduction_array.map(
      (val) => -val * college_pct
    );

    const other_cash_flows = inflated_reduction_array.map(
      (val) => -val * other_pct
    );

    // Gross totals by jurisdiction.
    const gross_county = calculateGrossTotal(county_cash_flows);
    const gross_tvc = calculateGrossTotal(tvc_cash_flows);
    const gross_school = calculateGrossTotal(school_cash_flows);
    const gross_college = calculateGrossTotal(college_cash_flows);
    const gross_other = calculateGrossTotal(other_cash_flows);

    // NPV totals by jurisdiction.
    const npv_county = calculateNPV(projectData.discount_rate, county_cash_flows);
    const npv_tvc = calculateNPV(projectData.discount_rate, tvc_cash_flows);
    const npv_school = calculateNPV(projectData.discount_rate, school_cash_flows);
    const npv_college = calculateNPV(projectData.discount_rate, college_cash_flows);
    const npv_other = calculateNPV(projectData.discount_rate, other_cash_flows);

    // Grand totals.
    const gross_all =
      gross_county + gross_tvc + gross_school + gross_college + gross_other;

    const npv_all =
      npv_county + npv_tvc + npv_school + npv_college + npv_other;


    // Creating yearlyResults
    const yearlyResults = Array.from({ length: YEARS }, (_, i) => ({
      year: i + 1,
      utility_aid: utility_aid_array[i],
      conversion_charge: conversion_array[i],
      reduction_in_local_pt: -inflated_reduction_array[i],
      net_benefit: net_cash_flows[i],

      total_to_school: -inflated_reduction_array[i] * school_pct,
      total_to_college: -inflated_reduction_array[i] * college_pct,

      total_to_county:
        utility_aid_to_county +
        (i === 0 ? conversion_charge_to_county : 0),

      total_to_tvc:
        utility_aid_to_tvc +
        (i === 0 ? conversion_charge_to_tvc : 0),

      total_to_other: -inflated_reduction_array[i] * other_pct,
    }));

    // Convert into row-based arrays for output table.

    // Row arrays for table formatting
    
    const utility_aid_row = yearlyResults.map(r => r.utility_aid);
    const conversion_row = yearlyResults.map(r => r.conversion_charge);
    const reduction_row = yearlyResults.map(r => r.reduction_in_local_pt);
    const net_row = yearlyResults.map(r => r.net_benefit);

    const school_row = yearlyResults.map(r => r.total_to_school);
    const college_row = yearlyResults.map(r => r.total_to_college);
    const county_row = yearlyResults.map(r => r.total_to_county);
    const tvc_row = yearlyResults.map(r => r.total_to_tvc);
    const other_row = yearlyResults.map(r => r.total_to_other);

    // Totals the row arrays.
    const total_per_year = yearlyResults.map(r =>
      r.net_benefit
    );

    // Gross and NPV values.
    const grossTotal = calculateGrossTotal(net_cash_flows);

    const npvTotal = calculateNPV(
      projectData.discount_rate,
      net_cash_flows
    );

    const year_one = yearlyResults[0];

    console.log("other pct", other_pct);

    const over30Acres = Number(projectData.over_30_acres);
    const grade1 = Number(projectData.grade_1);
    const grossRate = Number(projectData.gross_rate);
    const totalPropertyTax = Number(projectData.total_property_tax);

    // For yearly results table.
    const start_year = new Date().getFullYear();

    // Helper component for formatting negative value cells.
    const CurrencyCell = ({ value }: { value: number }) => {
      const isNegative = value < 0;
      return (
        <span style={{ color: isNegative ? "red" : "inherit" }}>
          -{formatCurrency(value)}
        </span>
      );
    };


  return (
    <div>
    <section>
      <h1>Your results</h1>
      <br></br>

      <h3>Year 1 Summary</h3>
      <table className="basicTable">
        <tbody>
          <tr>
            <td>Utility Aid</td>
            <td>{formatCurrency(year_one.utility_aid)}</td>
          </tr>
          <tr>
            <td>Conversion Charge</td>
            <td>{formatCurrency(year_one.conversion_charge)}</td>
          </tr>
          <tr>
            <td>Reduction in Local Property Tax</td>
            <td><CurrencyCell value={year_one.reduction_in_local_pt}></CurrencyCell></td>
          </tr>

          <tr className="rowHighlight">
            <td>Net Benefit</td>
            <td>{formatCurrency(year_one.net_benefit)}</td>
          </tr>

          <tr><td colSpan={2}></td></tr>

          <tr>
            <td>Total to School</td>
            <td><CurrencyCell value={year_one.total_to_school}></CurrencyCell></td>
          </tr>
          <tr>
            <td>Total to College</td>
            <td><CurrencyCell value={year_one.total_to_college}></CurrencyCell></td>
          </tr>
          <tr>
            <td>Total to County</td>
            <td>{formatCurrency(year_one.total_to_county)}</td>
          </tr>
          <tr>
            <td>Total to {tvc}</td>
            <td>{formatCurrency(year_one.total_to_tvc)}</td>
          </tr>
          <tr>
            <td>Total to Other</td>
            <td><CurrencyCell value={year_one.total_to_other}></CurrencyCell></td>
          </tr>
        </tbody>
      </table>

    <br></br>

    <h1>Breakdown Over the Life of the Project</h1>
    <br></br>

    <p>
      The gross value represents revenue over the life of the project without 
      adjustments for future inflation or risk over the life of the project.
    </p>

    <br></br>

    <p>
      The net present value represents revenue over the life of 
      the project that has been adjusted for inflation and risk over the life of the project. 
      This is calculated by accounting for the difference between the annual inflation and 
      discount rate.
    </p>

    <br />

    {/* Jurisdiction section */}
    <h3>Jurisdictional Gross & NPV Totals</h3>

      <table className="basicTable">
        <thead>
          <tr>
            <th>Jurisdiction</th>
            <th>
              Gross Over the Life of the Project
              [Before adjustment for future inflation and risk over the life of the project]
            </th>
            <th>
              Net Present Value
              [Adjusted for future inflation and risk over the life of the project]
            </th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>County</td>
            <td>{formatCurrency(gross_county)}</td>
            <td>{formatCurrency(npv_county)}</td>
          </tr>

          <tr>
            <td>{tvc}</td>
            <td>{formatCurrency(gross_tvc)}</td>
            <td>{formatCurrency(npv_tvc)}</td>
          </tr>

          <tr>
            <td>School District</td>
            <td>{formatCurrency(gross_school)}</td>
            <td>{formatCurrency(npv_school)}</td>
          </tr>

          <tr>
            <td>Technical College</td>
            <td>{formatCurrency(gross_college)}</td>
            <td>{formatCurrency(npv_college)}</td>
          </tr>

          <tr>
            <td>Other</td>
            <td>{formatCurrency(gross_other)}</td>
            <td>{formatCurrency(npv_other)}</td>
          </tr>

          <tr className="rowHighlight">
            <td>All Jurisdictions</td>
            <td>{formatCurrency(gross_all)}</td>
            <td>{formatCurrency(npv_all)}</td>
          </tr>
        </tbody>
      </table>

      <br></br>

      {/* Yearly Results table */}

      <section>
        <table className="basicTable">
          <thead>
            <tr>
              <th></th>
              {Array.from({ length: YEARS }, (_, i) => (
                <th key={i}>{start_year + i}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Utility Aid</td>
              {utility_aid_row.map((val, i) => (
                <td key={i}>{formatCurrency(val)}</td>
              ))}
            </tr>

            <tr>
              <td>Conversion Charge</td>
              {conversion_row.map((val, i) => (
                <td key={i}>{formatCurrency(val)}</td>
              ))}
            </tr>

            <tr>
              <td>Reduction in Local Property Tax</td>
              {reduction_row.map((val, i) => (
                <td key={i}><CurrencyCell value={val} /></td>
              ))}
            </tr>

            <tr className="rowBold">
              <td>Net Benefit</td>
              {net_row.map((val, i) => (
                <td key={i}>{formatCurrency(val)}</td>
              ))}
            </tr>

            <tr><th></th></tr>

            <tr>
              <td>Total to School</td>
              {school_row.map((val, i) => (
                <td key={i}><CurrencyCell value={val} /></td>
              ))}
            </tr>

            <tr>
              <td>Total to College</td>
              {college_row.map((val, i) => (
                <td key={i}>{formatCurrency(val)}</td>
              ))}
            </tr>

            <tr>
              <td>Total to County</td>
              {county_row.map((val, i) => (
                <td key={i}>{formatCurrency(val)}</td>
              ))}
            </tr>

            <tr>
              <td>Total to {tvc}</td>
              {tvc_row.map((val, i) => (
                <td key={i}>{formatCurrency(val)}</td>
              ))}
            </tr>

            <tr>
              <td>Total to Other</td>
              {other_row.map((val, i) => (
                <td key={i}>{formatCurrency(val)}</td>
              ))}
            </tr>

            <tr><th></th></tr>

            <tr className="rowBold">
              <td>Total Net Benefit (All Jurisdictions)</td>
              {total_per_year.map((val, i) => (
                <td key={i}>{formatCurrency(val)}</td>
              ))}
            </tr>

            <tr><th></th></tr>

            <tr className="rowHighlight">
              <td>Gross Over Life</td>
              <td colSpan={YEARS}>{formatCurrency(grossTotal)}</td>
            </tr>

            <tr className="rowHighlight">
              <td>NPV Over Life</td>
              <td colSpan={YEARS}>{formatCurrency(npvTotal)}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <br />

      <h1>Community Benefits Table</h1>
        <br></br>

        <p>
          Below is an estimate of real-world community benefits from your 
          planned renewable project over the course of its lifespan.
        </p>

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
                  <td>~$12,492 per mile</td>
                  <td>
                      ~{Math.round((npv_county) / 12492)} miles
                  </td>
              </tr>

              <tr>
                  <td style={{ minWidth: "100px", maxWidth: "200px" }}><img src="/photos-logos/firefighter.png" alt="Vector graphic of a firefighter"></img></td>
                  <td>Firefighters</td>
                  <td>School District</td>
                  <td>~$68,421 per annual salary</td>
                  <td>~{Math.round((npv_tvc) / 68421)} FTE (full-time employee) annual salaries</td>
              </tr>

              <tr>
                  <td style={{ minWidth: "100px", maxWidth: "200px" }}><img src="/photos-logos/fire-truck.png" alt="Vector graphic of a fire truck"></img></td>
                  <td>Fire Trucks</td>
                  <td>City/Township</td>
                  <td>~$1,800,000 per unit</td>
                  <td>~{Math.round((npv_tvc) / 1800000)} fire truck(s)</td>
              </tr>


          </tbody>
      </table>

    </section>
    </div>
  );
}
