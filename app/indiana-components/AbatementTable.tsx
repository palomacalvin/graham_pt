"use client";
import React from "react";

export interface AbatementUnit {
  year: number;
  personalPropertyAbatement: number; // Decimal value between 0 and 1
  realPropertyAbatement: number; // Decimal value between 0 and 1
}

interface Props {
  abatementUnits: AbatementUnit[];
  setAbatementUnits: React.Dispatch<React.SetStateAction<AbatementUnit[]>>;
}

export default function AbatementTable({ abatementUnits, setAbatementUnits }: Props) {
  const handleRateChange = (
    index: number,
    field: "personalPropertyAbatement" | "realPropertyAbatement",
    inputValue: string
  ) => {
    // Parse input percentage (e.g., 100) and convert to decimal (e.g., 1.0)
    let parsedVal = parseFloat(inputValue);

    if (isNaN(parsedVal)) {
      parsedVal = 0;
    }

    // Clamp value between 0% and 100% (0.0 and 1.0)
    const decimalVal = Math.min(Math.max(parsedVal / 100, 0), 1);

    setAbatementUnits((prevUnits) =>
      prevUnits.map((unit, i) =>
        i === index ? { ...unit, [field]: decimalVal } : unit
      )
    );
  };

  return (
    <table className="basicTable">
      <thead>
        <tr>
          <th>Abatement Schedule</th>
          <th>Percent Abated - Personal Property</th>
          <th>Percent Abated - Real Property</th>
        </tr>
      </thead>
      <tbody>
        {abatementUnits.map((unit, idx) => (
          <tr key={unit.year || idx}>
            <td>Year {unit.year}</td>
            <td>
              <div className="inputWithSymbol">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={
                    isNaN(unit.personalPropertyAbatement)
                      ? ""
                      : Math.round((unit.personalPropertyAbatement || 0) * 100)
                  }
                  onChange={(e) =>
                    handleRateChange(idx, "personalPropertyAbatement", e.target.value)
                  }
                  className="basicInputBox"
                />
                <span>%</span>
              </div>
            </td>
            <td>
              <div className="inputWithSymbol">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={
                    isNaN(unit.realPropertyAbatement)
                      ? ""
                      : Math.round((unit.realPropertyAbatement || 0) * 100)
                  }
                  onChange={(e) =>
                    handleRateChange(idx, "realPropertyAbatement", e.target.value)
                  }
                  className="basicInputBox"
                />
                <span>%</span>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}