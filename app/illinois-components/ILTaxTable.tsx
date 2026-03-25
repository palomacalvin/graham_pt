"use client";
import React from "react";

export interface TaxUnit {
  unitNumber: number;
  type: string;
  rate: number;
  name?: string;
}

interface Props {
  taxUnits: TaxUnit[];
  setTaxUnits: (units: TaxUnit[]) => void;
}

export default function TaxTable({ taxUnits, setTaxUnits }: Props) {
    const handleChange = (index: number, field: "type" | "name", value: string) => {
    const newUnits = [...taxUnits];
    newUnits[index][field] = value;
    setTaxUnits(newUnits);
};

    const handleRateChange = (index: number, value: string) => {
    const newUnits = [...taxUnits];
    newUnits[index].rate = parseFloat(value) || 0;
    setTaxUnits(newUnits);
};

  const totalRate = taxUnits.reduce((sum, u) => sum + (u.rate || 0), 0);

  return (
    <table className="basicTable">
      <thead>
        <tr>
          <th>Unit #</th>
          <th>Taxing Unit Type</th>
          <th>Rate (%)</th>
          <th>Unit Name</th>
        </tr>
      </thead>
      <tbody>
        {taxUnits.map((unit, idx) => (
          <tr key={idx}>
            <td>{unit.unitNumber}</td>
            <td>
              <input
                type="text"
                value={unit.type}
                onChange={(e) => handleChange(idx, "type", e.target.value)}
                className="basicInputBox"
                />
            </td>
            <td>
              <input
                type="text"
                value={unit.name || ""}
                onChange={(e) => handleChange(idx, "name", e.target.value)}
                className="basicInputBox"
                />
            </td>
            <td>
              <input
                type="number"
                step="0.00001"
                value={unit.rate}
                onChange={(e) => handleRateChange(idx, e.target.value)}
                className="basicInputBox"
                />
            </td>
          </tr>
        ))}
        <tr>
          <td>Total</td>
          <td></td>
          <td>{totalRate.toFixed(5)}%</td>
          <td></td>
        </tr>
      </tbody>
    </table>
  );
}