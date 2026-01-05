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
  return (
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
            <td>${Math.round(totalProductionRevenue * 0.8)}</td>
          </tr>
          <tr>
            <td>Township</td>
            <td>${Math.round(totalProductionRevenue * 0.2)}</td>
          </tr>
          <tr>
            <td>Total</td>
            <td>${Math.round(totalProductionRevenue)}</td>
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
            <td>${Math.round(realPropertyTaxRevenue)}</td>
          </tr>
          <tr>
            <td>Former County Real Property Tax Revenue</td>
            <td>${Math.round(formerRealPropertyTaxRevenue)}</td>
          </tr>
          <tr>
            <td>Net County Revenue</td>
            <td>${Math.round(realPropertyTaxRevenue - formerRealPropertyTaxRevenue)}</td>
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
            <td>${Math.round(cityRealPropertyTaxRevenue)}</td>
          </tr>
          <tr>
            <td>Former City/Township Real Property Tax Revenue</td>
            <td>${Math.round(formerCityRealPropertyTaxRevenue)}</td>
          </tr>
          <tr>
            <td>Net City/Township Revenue</td>
            <td>${Math.round(cityRealPropertyTaxRevenue - formerCityRealPropertyTaxRevenue)}</td>
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
            <td>ADD</td>
          </tr>
          <tr>
            <td>Former School District Real Property Tax Revenue</td>
            <td>ADD</td>
          </tr>
          <tr>
            <td>Net School District Revenue</td>
            <td>ADD</td>
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
            <td>FIX ${Math.round(totalProductionRevenue + realPropertyTaxRevenue)}</td>
          </tr>
          <tr>
            <td>Real Property</td>
            <td>ADD</td>
          </tr>
          <tr>
            <td>Total</td>
            <td>ADD</td>
          </tr>
        </tbody>
      </table>


    </section>
  );
}
