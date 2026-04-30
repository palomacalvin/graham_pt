"use client";
import React from "react";

export interface TaxUnit {
  unitNumber: number;
  type: string;
  rate: number;
  name: string;
}

interface Props {
  taxUnits: TaxUnit[];
  setTaxUnits: React.Dispatch<React.SetStateAction<TaxUnit[]>>;
}

export default function TaxTable({ taxUnits, setTaxUnits }: Props) {

    const handleChange = (index: number, field: keyof TaxUnit, value: string | number) => {
      setTaxUnits(prev => prev.map((unit, i) => 
          i === index ? { ...unit, [field]: value } : unit
      ));
    };

    const handleRateChange = (index: number, value: string) => {
    const newUnits = [...taxUnits];
    newUnits[index].rate = parseFloat(value) || 0;
    setTaxUnits(newUnits);
  };

  const totalRate = taxUnits.reduce((sum, u) => sum + (u.rate || 0), 0);

  // Different default unit types for dropdown.
  const unitTypes = [
    "County",
    "Township",
    "School District (non-bond)",
    "School District (bond)",
    "Other Special Unit"
  ];

  return (
    <table className="basicTable">
      <thead>
        <tr>
          <th>Unit #</th>
          <th>Taxing Unit Type</th>
          <th>Unit Name</th>
          <th>Rate (%)</th>
        </tr>
      </thead>
      <tbody>
        {taxUnits.map((unit, idx) => (
          <tr key={idx}>
            <td>{unit.unitNumber}</td>
              <td>
                <select
                  value={unit.type}
                  onChange={(e) => handleChange(idx, "type", e.target.value)}
                  className="basicInputBox"
                >
                  <option value="">Select Type</option>
                  {unitTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </td>
            <td>
              <input
                type="text"
                value={unit.name || ""}
                onChange={(e) => handleChange(idx, "name", e.target.value)}
                className="basicInputBox"
                placeholder="Enter unit name"
                />
            </td>
            <td>
              <input
                type="number"
                step="0.001"
                value={unit.rate}
                onChange={(e) => handleRateChange(idx, e.target.value)}
                className="basicInputBox"
                placeholder="Enter unit rate"
                />
            </td>
          </tr>
        ))}
        <tr className="rowHighlight">
          <td>Total</td>
          <td></td>
          <td></td>
          <td>{totalRate.toFixed(5)}%</td>
        </tr>
      </tbody>
    </table>
  );
}