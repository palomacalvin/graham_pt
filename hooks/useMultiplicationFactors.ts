import { useEffect, useState } from "react";
import { MIMultiplicationFactors } from "@/types/MIMultiplicationFactors";

export function useMultiplicationFactors() {
  const [factors, setFactors] = useState<MIMultiplicationFactors[]>([]);

  useEffect(() => {
    const fetchFactors = async () => {
      const res = await fetch("/api/michigan/mult_factors");
      const data = await res.json();
      setFactors(Array.isArray(data.factors) ? data.factors : []);
    };

    fetchFactors();
  }, []);

  return factors;
}
