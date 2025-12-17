// TaxResults.tsx
import React from "react";

interface Props {
  totalProductionRevenue: number;
  realPropertyTaxRevenue: number;
}

export default function TaxResults({ totalProductionRevenue, realPropertyTaxRevenue }: Props) {
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
      <div>${Math.round(realPropertyTaxRevenue)}</div>

      <h3>Total Net Tax Revenue (Year 1)</h3>
      <div>${Math.round(totalProductionRevenue + realPropertyTaxRevenue)}</div>
    </section>
  );
}
