// WIResults.tsx
import React from "react";

interface Props {

    // Project utility values.
    project_size: number;
    // utility_aid_payment: number;
    acres_converted: number;
    conversion_charge_rate: number;
    // tax_rate: number;
    // use_value_agriculture_assessment: number;

    // Payments and benefit for yearly calculations.
    // utility_aid_payments: number;
    // conversion_charge: number;
    reduction_in_local_pt: number;
    // net_benefit: number;

    // Historical breakdown of taxes.
    // percent_to_school: number;
    // percent_to_college: number;
    // percent_to_county: number;
    // percent_to_tvc: number; // or null?
    // percent_to_other: number; // or null?

    // Utility aid and conversion charge distribution.
    tvc: string;
    // amount_to_tvc: number;
    // amount_to_county: number;
    // conversion_charge_to_tvc: number;
    // conversion_charge_to_county: number;

    // Total taxes by unit/year.
    // total_to_school: number;
    // total_to_college: number;
    // total_to_county: number;
    // total_to_tvc: number;
    // total_to_other: number;

}


export default function WIResults({ project_size, /*utility_aid_payment,*/ acres_converted, conversion_charge_rate,
    /*tax_rate, /*use_value_agriculture_assessment,*/ /*utility_aid_payments, conversion_charge,*/ reduction_in_local_pt, 
    /*net_benefit, /*percent_to_school,*/ /*percent_to_college, percent_to_county, percent_to_tvc,*/
    /*percent_to_other,*/ tvc, /*amount_to_tvc, amount_to_county, /*conversion_charge_to_tvc, conversion_charge_to_county,*/
    /*total_to_school, total_to_college, total_to_county, total_to_tvc, total_to_other*/
 }: Props) {

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
  

    // Variables for storing calculation information.
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
    const net_benefit = utility_aid_total + total_conversion_charge - reduction_in_local_pt;


  // Formatting string.
  const format$ = (value: number) => `$${Math.round(value)}`;

  return (
    <div>
    <section>
      <h1>Your results</h1>
      <br></br>

      <h3>Utility Aid Payments (Year 1)</h3>
      <table className="basicTable">
        <thead>
          <tr>
            <th>Item</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Total Utility Aid</td>
            <td>{format$(utility_aid_total)}</td>
          </tr>
          <tr>
            <td>To {tvc}</td>
            <td>{format$(utility_aid_to_tvc)}</td>
          </tr>
          <tr>
            <td>To County</td>
            <td>{format$(utility_aid_to_county)}</td>
          </tr>
        </tbody>
      </table>

      <br></br>
      <h3>Conversion Charges (Year 1)</h3>

      <table className="basicTable">
        <tbody>
          <tr>
            <td>Total Conversion Charge</td>
            <td>{format$(total_conversion_charge)}</td>
          </tr>
          <tr>
            <td>To {tvc}</td>
            <td>{format$(conversion_charge_to_tvc)}</td>
          </tr>
          <tr>
            <td>To County</td>
            <td>{format$(conversion_charge_to_county)}</td>
          </tr>
        </tbody>
      </table>


      <br></br>
      <h3>Net Impact (Year 1)</h3>
      <table className="basicTable">
        <tbody>
          <tr>
            <td>Utility Aid & Conversion Charges</td>
            <td>{format$(utility_aid_total + total_conversion_charge)}</td>
          </tr>
          <tr>
            <td>Reduction in Local Property Taxes</td>
            <td>{format$(net_benefit)}</td>
          </tr>
        </tbody>
      </table>

    </section>
    </div>
  );
}
