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

}


export default function TaxResults({ totalProductionRevenue, realPropertyTaxRevenue, formerRealPropertyTaxRevenue,
  cityRealPropertyTaxRevenue, formerCityRealPropertyTaxRevenue, schoolDistrictRealPropertyTaxRevenue,
  formerSchoolDistrictRealPropertyTaxRevenue
 }: Props) {

  const netCounty = realPropertyTaxRevenue - formerRealPropertyTaxRevenue;
  const netCity = cityRealPropertyTaxRevenue - formerCityRealPropertyTaxRevenue;
  const netSchool = schoolDistrictRealPropertyTaxRevenue - formerSchoolDistrictRealPropertyTaxRevenue;

  const totalNetRevenue = netCounty + netCity + netSchool;
  const totalNetTaxRevenue = totalProductionRevenue + totalNetRevenue;

  const startYear = 2026;
  const endYear = 2056;
  const years = endYear - startYear + 1;
  const inflationRate = 0.03; // Standard

  const netRevenues = {
    netCounty: realPropertyTaxRevenue - formerRealPropertyTaxRevenue,
    netCity: cityRealPropertyTaxRevenue - formerCityRealPropertyTaxRevenue,
    netSchool: schoolDistrictRealPropertyTaxRevenue - formerSchoolDistrictRealPropertyTaxRevenue,
  };


  const netRevenueNames: Record<string, string> = {
    netCounty: "Net County Property Tax Revenue",
    netCity: "Net City/Township Property Tax Revenue",
    netSchool: "Net School District Property Tax Revenue",
  };

  const productionRevenues = {
    countyProduction: totalProductionRevenue * 0.8,
    cityProduction: totalProductionRevenue * 0.2,
  }

  const productionRevenueNames: Record<string, string> = {
    countyProduction: "County Production Tax Revenue",
    cityProduction: "City/Township Production Tax Revenue",
  }

  const format$ = (value: number) => `$${Math.round(value)}`;

  return (
    <div>
    <section>
      <h1>Your results</h1>
      <h3>Production Tax Revenue for Each Year</h3>
      <table className="basicTable">
        <thead>
          <tr>
            <th>Item</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>County</td>
            <td>{format$(totalProductionRevenue * 0.8)}</td>
          </tr>
          <tr>
            <td>Township</td>
            <td>{format$(totalProductionRevenue * 0.2)}</td>
          </tr>
          <tr>
            <td>Total</td>
            <td>{format$(totalProductionRevenue)}</td>
          </tr>
        </tbody>
      </table>

      <h3>Real Property Tax Revenue (Year 1)</h3>

      <table className="basicTable">
        <thead>
          <tr>
            <th>Item</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>New County Real Property Tax Revenue</td>
            <td>{format$(realPropertyTaxRevenue)}</td>
          </tr>
          <tr>
            <td>Former County Real Property Tax Revenue</td>
            <td>{format$(formerRealPropertyTaxRevenue)}</td>
          </tr>
          <tr>
            <td>Net County Revenue</td>
            <td>{format$(netCounty)}</td>
          </tr>
        </tbody>
      </table>

      <table className="basicTable">
        <thead>
          <tr>
            <th>Item</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>New City/Township Real Property Tax Revenue</td>
            <td>{format$(cityRealPropertyTaxRevenue)}</td>
          </tr>
          <tr>
            <td>Former City/Township Real Property Tax Revenue</td>
            <td>{format$(formerCityRealPropertyTaxRevenue)}</td>
          </tr>
          <tr>
            <td>Net City/Township Revenue</td>
            <td>{format$(netCity)}</td>
          </tr>
        </tbody>
      </table>

      <table className="basicTable">
        <thead>
          <tr>
            <th>Item</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>New School District Real Property Tax Revenue</td>
            <td>{format$(schoolDistrictRealPropertyTaxRevenue)}</td>
          </tr>
          <tr>
            <td>Former School District Real Property Tax Revenue</td>
            <td>{format$(formerSchoolDistrictRealPropertyTaxRevenue)}</td>
          </tr>
          <tr>
            <td>Net School District Revenue</td>
            <td>{format$(netSchool)}</td>
          </tr>
        </tbody>
      </table>

      <h3>Total Net Revenue</h3>

      <table className="basicTable">
        <thead>
          <tr>
            <th>Item</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{format$(totalNetRevenue)}</td>
          </tr>
        </tbody>
      </table>

      <h3>Total Net Tax Revenue (Year 1)</h3>

      <table className="basicTable">
        <thead>
          <tr>
            <th>Item</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Production</td>
            <td>{format$(totalProductionRevenue)}</td>
          </tr>
          <tr>
            <td>Real Property</td>
            <td>{format$(totalNetRevenue)}</td>
          </tr>
          <tr>
            <td>Total</td>
            <td>{format$(totalNetTaxRevenue)}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section>
      <h3>Projected Revenue (2026 - 2056)</h3>
      <table className="basicTable">
        <thead>
          <tr>
            <th>Revenue Type</th>
            {Array.from({ length: years }, (_, i) => (
              <th key={i}>{startYear + i}</th>
            ))}
          </tr>
        </thead>
          <tbody>
            {Object.entries(netRevenues).map(([key, baseValue]) => (
              <tr key={key}>
                <td>{netRevenueNames[key] || key}</td>
                {Array.from({ length: years }, (_, i) => {
                  const revenue = baseValue * Math.pow(1 + inflationRate, i);
                  return <td key={i}>${Math.round(revenue)}</td>;
                })}
              </tr>
            ))}
          </tbody>

          <tbody>
            {Object.entries(productionRevenues).map(([key, baseValue]) => (
              <tr key={key}>
                <td>{productionRevenueNames[key] || key}</td>
                {Array.from({ length: years }, (_, i) => 
                  <td key={Math.random()}>{format$(baseValue)}</td>
                )}
              </tr>
            ))}

             {/* Total County Net Revenue */}
            <tr>
              <td>Total County Net Revenue</td>
              {Array.from({ length: years }, (_, i) => {
                const totalRevenue =
                  netRevenues.netCounty * Math.pow(1 + inflationRate, i) +
                  productionRevenues.countyProduction;
                return <td key={i}>{format$(totalRevenue)}</td>;
              })}
            </tr>
            

            <tr>
              <td>Total City/Township Net Revenue</td>
              {Array.from({ length: years }, (_, i) => {
                const totalRevenue =
                  netRevenues.netCity * Math.pow(1 + inflationRate, i) +
                  productionRevenues.cityProduction;
                return <td key={i}>{format$(totalRevenue)}</td>;
              })}
            </tr>

            <tr>
              <td>Total School District Net Revenue</td>
              {Array.from({ length: years }, (_, i) => {
                const totalRevenue =
                  netRevenues.netSchool * Math.pow(1 + inflationRate, i);
                return <td key={i}>{format$(totalRevenue)}</td>;
              })}
            </tr>

          {/* Total Net Revenue Across All Jurisdictions */}
          <tr>
            <td>Total Project Net Revenue</td>
            {Array.from({ length: years }, (_, i) => {
              const totalRevenue =
                // County Net + inflated production
                netRevenues.netCounty * Math.pow(1 + inflationRate, i) +
                productionRevenues.countyProduction +
                // City Net + inflated production
                netRevenues.netCity * Math.pow(1 + inflationRate, i) +
                productionRevenues.cityProduction +
                // School Net (inflated)
                netRevenues.netSchool * Math.pow(1 + inflationRate, i);

              return <td key={i}>{format$(totalRevenue)}</td>;
            })}
          </tr>


          </tbody>
        </table>

    </section>
    </div>
  );
}
