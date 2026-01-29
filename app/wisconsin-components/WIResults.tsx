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
  return `$ ${rounded.toLocaleString()}`;
};

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
      const other_pct = total_tax_rate / total_tax_rate;


    // Formatting string.
    const format$ = (value: number) => `$${Math.round(value)}`;


    const YEARS = 25;

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

    const yearlyResults = Array.from({ length: YEARS }, (_, i) => {
      const year = i + 1;

      const utility_aid = utility_aid_total;
      const conversion_charge =
        year === 1 ? base_conversion_charge : 0;

      const net_benefit =
        utility_aid +
        conversion_charge -
        reduction_in_local_pt;

      return {
        year,
        utility_aid,
        conversion_charge,
        reduction_in_local_pt: -reduction_in_local_pt,
        net_benefit,

        total_to_school:
          -reduction_in_local_pt * school_pct,

        total_to_college:
          -reduction_in_local_pt * college_pct,

        total_to_county:
          utility_aid_to_county +
          (year === 1 ? conversion_charge_to_county : 0),

        total_to_tvc:
          utility_aid_to_tvc +
          (year === 1 ? conversion_charge_to_tvc : 0),


        total_to_other:
          -reduction_in_local_pt * other_pct,
      };
    });

    console.log("other pct", other_pct);

    const over30Acres = Number(projectData.over_30_acres);
    const grade1 = Number(projectData.grade_1);
    const grossRate = Number(projectData.gross_rate);
    const totalPropertyTax = Number(projectData.total_property_tax);




    


  return (
    <div>
    <section>
      <h1>Your results</h1>
      <br></br>

      <table className="basicTable">
        <thead>
          <tr>
            <th>Year</th>
            <th>Utility Aid Payments</th>
            <th>Conversion Charge</th>
            <th>Reduction in Local PT</th>
            <th>Net Benefit</th>
            <th>Total to School</th>
            <th>Total to College</th>
            <th>Total to County</th>
            <th>Total to {tvc}</th>
            <th>Total to Other</th>
          </tr>
        </thead>
        <tbody>
          {yearlyResults.map((row) => (
            <tr key={row.year}>
              <td>{row.year}</td>
              <td>{formatCurrency(row.utility_aid)}</td>
              <td>{formatCurrency(row.conversion_charge)}</td>
              <td>{formatCurrency(row.reduction_in_local_pt)}</td>
              <td>{formatCurrency(row.net_benefit)}</td>
              <td>{formatCurrency(row.total_to_school)}</td>
              <td>{formatCurrency(row.total_to_college)}</td>
              <td>{formatCurrency(row.total_to_county)}</td>
              <td>{formatCurrency(row.total_to_tvc)}</td>
              <td>{formatCurrency(row.total_to_other)}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </section>
    </div>
  );
}
