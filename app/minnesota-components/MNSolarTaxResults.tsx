// TaxResults.tsx
import React from "react";

interface Props {
  totalProductionRevenue: number;

  // County
  realPropertyTaxRevenue: number;
  formerRealPropertyTaxRevenue: number;

  // City
  cityRealPropertyTaxRevenue: number;
  formerCityRealPropertyTaxRevenue: number;

  // School District
  schoolDistrictRealPropertyTaxRevenue: number;
  formerSchoolDistrictRealPropertyTaxRevenue: number;

  discountRate: number;

  expectedUsefulLife: number;

  inflationRate: number;

}
// Adding inflation.
export function inflationRevenues(
  baseValue: number,
  years: number,
  inflationRate: number
  ) {
  const results = [];

  let revenue = baseValue;

  results.push(revenue); // Year 1

  for (let year = 2; year <= years; year++) {
    revenue = revenue * (1 + inflationRate);
    results.push(revenue);
  }

  return results;
}

// Gross and NPV calculations:
export function calculateGrossTotal(values: number[]): number {
  return values.reduce((sum, val) => sum + val, 0);
}

export function calculateNPV(rate: number, cashFlows: number[]): number {
  const firstYear = cashFlows[0] ?? 0;

  const discounted = cashFlows.slice(1).reduce((sum, cf, i) => {
    return sum + cf / Math.pow(1 + rate, i + 1);
  }, 0);

  return firstYear + discounted;
}


export default function TaxResults({ totalProductionRevenue, realPropertyTaxRevenue, formerRealPropertyTaxRevenue,
  cityRealPropertyTaxRevenue, formerCityRealPropertyTaxRevenue, schoolDistrictRealPropertyTaxRevenue,
  formerSchoolDistrictRealPropertyTaxRevenue, discountRate = 0.03, inflationRate, expectedUsefulLife,
 }: Props) {

  // Variables for storing calculation information.
  const netCounty = realPropertyTaxRevenue - formerRealPropertyTaxRevenue;
  const netCity = cityRealPropertyTaxRevenue - formerCityRealPropertyTaxRevenue;
  const netSchool = schoolDistrictRealPropertyTaxRevenue - formerSchoolDistrictRealPropertyTaxRevenue;

  // Total calculation variables.
  const totalNetRevenue = netCounty + netCity + netSchool;
  const totalNetTaxRevenue = totalProductionRevenue + totalNetRevenue;

  // Variables for temporal display.
  const startYear = new Date().getFullYear();
  const years = expectedUsefulLife;
  const endYear = startYear + years - 1;

  // Set variable arrays.
  const netRevenues = {
    netCounty: realPropertyTaxRevenue - formerRealPropertyTaxRevenue,
    netCity: cityRealPropertyTaxRevenue - formerCityRealPropertyTaxRevenue,
    netSchool: schoolDistrictRealPropertyTaxRevenue - formerSchoolDistrictRealPropertyTaxRevenue,
  };

  // Variable names to display in the table.
  const netRevenueNames: Record<string, string> = {
    netCounty: "Net County Property Tax Revenue",
    netCity: "Net City/Township Property Tax Revenue",
    netSchool: "Net School District Property Tax Revenue",
  };

  // Arrays of values for revenue with inflation //
  const revenueSeries = {
    netCounty: inflationRevenues(netCounty, years, inflationRate),
    netCity: inflationRevenues(netCity, years, inflationRate),
    netSchool: inflationRevenues(netSchool, years, inflationRate),
  };


  // Production revenue variable arrays.
  const productionRevenues = {
    countyProduction: totalProductionRevenue * 0.8,
    cityProduction: totalProductionRevenue * 0.2,
  }

  // Production revenue names for display in table.
  const productionRevenueNames: Record<string, string> = {
    countyProduction: "County Production Tax Revenue",
    cityProduction: "City/Township Production Tax Revenue",
  }

  // Base values for production revenue calculations.
  const countyBase = netCounty + productionRevenues.countyProduction;
  const cityBase = netCity + productionRevenues.cityProduction;
  const schoolBase = netSchool;


  // Yearly revenue arrays.
  const countyPerYear = revenueSeries.netCounty.map(
    (value) => value + productionRevenues.countyProduction
  );

  const cityPerYear = revenueSeries.netCity.map(
    (value) => value + productionRevenues.cityProduction
  );

  const schoolPerYear = [...revenueSeries.netSchool];


  const countyGrossPerYear = countyPerYear;
  const cityGrossPerYear = cityPerYear;
  const schoolGrossPerYear = schoolPerYear;


  const totalGrossPerYear = countyPerYear.map((_, i) =>
    countyPerYear[i] +
    cityPerYear[i] +
    schoolPerYear[i]
  );



  // Gross and NPV results.
  const grossCounty = calculateGrossTotal(countyPerYear);
  const grossCity = calculateGrossTotal(cityPerYear);
  const grossSchool = calculateGrossTotal(schoolPerYear);

  const npvCounty = calculateNPV(discountRate, countyPerYear);
  const npvCity = calculateNPV(discountRate, cityPerYear);
  const npvSchool = calculateNPV(discountRate, schoolPerYear);

  // Gross and NPV totals.
  const grossTotal = grossCounty + grossCity + grossSchool;
  const npvTotal = npvCounty + npvCity + npvSchool;


  // Creates formatting for the results, adding $ and separating commas.
  const formatCurrency = (value: number) => {
    const rounded = Math.round(value);
    if (rounded < 0) {
      return `($${Math.abs(rounded).toLocaleString()})`;
    }
    return `$${rounded.toLocaleString()}`;
  };

  return (
    <div>
    <section>
      <h1>Your results</h1>
      <br></br>

      <p>
        These values are based on user inputs. Taxable value for property taxes is adjusted
        for inflation annually.
      </p>
      <br></br>

      <h3>Production Tax Revenue for Each Year</h3>
      <table className="basicTable">
        <thead>
          <tr>
            <th>Jurisdiction</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>County</td>
            <td>{formatCurrency(totalProductionRevenue * 0.8)}</td>
          </tr>
          <tr>
            <td>Township</td>
            <td>{formatCurrency(totalProductionRevenue * 0.2)}</td>
          </tr>
          <tr className="rowHighlight">
            <td>Total</td>
            <td>{formatCurrency(totalProductionRevenue)}</td>
          </tr>
        </tbody>
      </table>

      <br></br>
      <h3>Real Property Tax Revenue (Year 1)</h3>

      <table className="basicTable">
        <thead>
          <tr>
            <th>County Revenue</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>New County Real Property Tax Revenue</td>
            <td>{formatCurrency(realPropertyTaxRevenue)}</td>
          </tr>
          <tr>
            <td>Former County Real Property Tax Revenue</td>
            <td>{formatCurrency(formerRealPropertyTaxRevenue)}</td>
          </tr>
          <tr>
            <td className="rowHighlight">Net County Revenue</td>
            <td className="rowHighlight">{formatCurrency(netCounty)}</td>
          </tr>
        </tbody>
      </table>

      <br></br>
      <table className="basicTable">
        <thead>
          <tr>
            <th>City Revenue</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>New City/Township Real Property Tax Revenue</td>
            <td>{formatCurrency(cityRealPropertyTaxRevenue)}</td>
          </tr>
          <tr>
            <td>Former City/Township Real Property Tax Revenue</td>
            <td>{formatCurrency(formerCityRealPropertyTaxRevenue)}</td>
          </tr>
          <tr>
            <td className="rowHighlight">Net City/Township Revenue</td>
            <td className="rowHighlight">{formatCurrency(netCity)}</td>
          </tr>
        </tbody>
      </table>

      <br></br>
      <table className="basicTable">
        <thead>
          <tr>
            <th>School District Revenue</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>New School District Real Property Tax Revenue</td>
            <td>{formatCurrency(schoolDistrictRealPropertyTaxRevenue)}</td>
          </tr>
          <tr>
            <td>Former School District Real Property Tax Revenue</td>
            <td>{formatCurrency(formerSchoolDistrictRealPropertyTaxRevenue)}</td>
          </tr>
          <tr>
            <td className="rowHighlight">Net School District Revenue</td>
            <td className="rowHighlight">{formatCurrency(netSchool)}</td>
          </tr>
        </tbody>
      </table>

      <br></br>

      <table className="basicTable">
        <thead>
          <tr>
            <th>Total Net Revenue for All Jurisdictions</th>
          </tr>
        </thead>
        <tbody>
          <tr className="rowHighlight">
            <td>{formatCurrency(totalNetRevenue)}</td>
          </tr>
        </tbody>
      </table>

      <br></br>

      <h3>Total Net Tax Revenue (Year 1)</h3>

      <table className="basicTable">
        <thead>
          <tr>
            <th colSpan={2}>Total Revenue</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Net Production Tax Revenue</td>
            <td>{formatCurrency(totalProductionRevenue)}</td>
          </tr>
          <tr>
            <td>Net Real Property Tax Revenue</td>
            <td>{formatCurrency(totalNetRevenue)}</td>
          </tr>
          <tr className="rowHighlight">
            <td>Total</td>
            <td>{formatCurrency(totalNetTaxRevenue)}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <br></br>

    <h1>Breakdown Over the Life of the Project</h1>

    <br></br>

    <p>
      The gross value represents revenue over the life of the project without 
      adjustments for future inflation or risk over the life of the project.
    </p>

    <br></br>

    <p>
      The net present value represents revenue over the life of the project that has 
      been adjusted for inflation and risk over the life of the project. 
      This is calculated by accounting for the difference between the annual 
      inflation and discount rate.
    </p>

    <br></br>

    {/* Jurisdictional Gross & NPV Totals */}
    <table className="basicTable">
      <thead>
        <tr>
          <th>Jurisdiction</th>
          <th>Gross Over the Life of the Project [Before adjustment for future inflation and risk over the life of the project]</th>
          <th>Net Present Value [Adjusted for future inflation and risk over the life of the project]</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>County</td>
          <td>{formatCurrency(grossCounty)}</td>
          <td>{formatCurrency(npvCounty)}</td>
        </tr>

        <tr>
          <td>City/Township</td>
          <td>{formatCurrency(grossCity)}</td>
          <td>{formatCurrency(npvCity)}</td>
        </tr>

        <tr>
          <td>School District</td>
          <td>{formatCurrency(grossSchool)}</td>
          <td>{formatCurrency(npvSchool)}</td>
        </tr>

        <tr className="rowHighlight">
          <td>All Jurisdictions</td>
          <td>{formatCurrency(grossTotal)}</td>
          <td>{formatCurrency(npvTotal)}</td>
        </tr>
      </tbody>
    </table>


    <br></br>
    
    <section>
      <table className="basicTable">
        <thead>
          <tr>
            <th></th>
            {Array.from({ length: years }, (_, i) => (
              <th key={i}>{startYear + i}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>Gross Per Year - County</td>
            {countyGrossPerYear.map((value, i) => (
              <td key={i}>{formatCurrency(value)}</td>
            ))}
          </tr>

          <tr>
            <td>Gross Per Year - City/Township</td>
            {cityGrossPerYear.map((value, i) => (
              <td key={i}>{formatCurrency(value)}</td>
            ))}
          </tr>

          <tr>
            <td>Gross Per Year - School District</td>
            {schoolGrossPerYear.map((value, i) => (
              <td key={i}>{formatCurrency(value)}</td>
            ))}
          </tr>

          <tr className="rowBold">
            <td>Total Gross Per Year (All Jurisdictions)</td>
            {totalGrossPerYear.map((value, i) => (
              <td key={i}>{formatCurrency(value)}</td>
            ))}
          </tr>

          <tr><th></th></tr>

          <tr className="rowHighlight">
            <td>Gross Over the Life of the Project</td>
            <td colSpan={years}>{formatCurrency(grossTotal)}</td>
          </tr>

          <tr className="rowHighlight">
            <td>NPV Over the Life of the Project</td>
            <td colSpan={years}>{formatCurrency(npvTotal)}</td>
          </tr>
        </tbody>
      </table>

      
      {/* <h3>Projected Revenue [2026-2056]</h3> */}
      {/* <table className="basicTable">
        <thead>
          <tr>
            <th></th>
            {Array.from({ length: years }, (_, i) => (
              <th key={i}>{startYear + i}</th>
            ))}
          </tr>
        </thead>
          <tbody>
            {Object.entries(netRevenues).map(([key]) => (
              <tr key={key}>
                <td>{netRevenueNames[key] || key}</td>
                {revenueSeries[key as keyof typeof revenueSeries].map((revenue, i) => (
                  <td key={i}>{formatCurrency(revenue)}</td>
                ))}
              </tr>
            ))}
            <tr><th></th></tr>
          </tbody>

          <tbody>
            {Object.entries(productionRevenues).map(([key, baseValue]) => (
              <tr key={key}>
                <td>{productionRevenueNames[key] || key}</td>
                {Array.from({ length: years }, (_, i) => 
                  <td key={i}>{formatCurrency(baseValue)}</td>
                )}
              </tr>
            ))}

            <tr><th></th></tr> */}

             {/* Total County Net Revenue */}
            {/* <tr>
              <td>Total County Net Revenue</td>
              {Array.from({ length: years }, (_, i) => {
                const totalRevenue =
                  revenueSeries.netCounty[i] +
                  productionRevenues.countyProduction;
                return <td key={i}>{formatCurrency(totalRevenue)}</td>;
              })}
            </tr>


            <tr>
              <td>Total City/Township Net Revenue</td>
              {Array.from({ length: years }, (_, i) => {
                const totalRevenue =
                  revenueSeries.netCity[i] +
                  productionRevenues.cityProduction;

                return <td key={i}>{formatCurrency(totalRevenue)}</td>;
              })}
            </tr>

            <tr>
              <td>Total School District Net Revenue</td>
              {Array.from({ length: years }, (_, i) => {
                const totalRevenue = revenueSeries.netSchool[i];
                return <td key={i}>{formatCurrency(totalRevenue)}</td>;
              })}
            </tr>

            <tr><th></th></tr> */}

          {/* Total Net Revenue Across All Jurisdictions */}
          {/* <tr className="rowHighlight">
            <td>Total Project Net Revenue</td>
            {Array.from({ length: years }, (_, i) => {
              const totalRevenue =
                revenueSeries.netCounty[i] +
                productionRevenues.countyProduction +
                revenueSeries.netCity[i] +
                productionRevenues.cityProduction +
                revenueSeries.netSchool[i];

              return <td key={i}>{formatCurrency(totalRevenue)}</td>;
            })}

          </tr>
          </tbody>
        </table> */}

        <br></br>
        <br></br>

        <h1>Community Benefits Table</h1>
        <br></br>

        <p>
          Below is an estimate of real-world community benefits from your 
          planned renewable project over the course of its lifespan.
        </p>

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
                  <td>~$3,308 per mile</td>
                  <td>
                      ~{Math.round((npvCounty) / 1152)} miles
                  </td>
              </tr>

              <tr>
                  <td style={{ minWidth: "100px", maxWidth: "200px" }}><img src="/photos-logos/fire-truck.png" alt="Vector graphic of a fire truck"></img></td>
                  <td>Fire Trucks</td>
                  <td>City/Township</td>
                  <td>~$1,100,000 per unit</td>
                  <td>~{Math.round((npvCity) / 2100000)} fire truck(s)</td>
              </tr>


              <tr>
                  <td style={{ minWidth: "100px", maxWidth: "200px" }}><img src="/photos-logos/teacher.png" alt="Vector graphic of a firefighter"></img></td>
                  <td>Public School Teachers</td>
                  <td>School District</td>
                  <td>~$97,056 per annual salary</td>
                  <td>~{Math.round((npvSchool) / 71835)} FTE (full-time employee) annual salaries</td>
              </tr>
          </tbody>
      </table>

    </section>
    </div>
  );
}
