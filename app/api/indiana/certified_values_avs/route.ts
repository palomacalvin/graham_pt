import { Pool } from "pg";
import { NextResponse } from "next/server";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(request: Request) {
  try {
    const res = await pool.query(
      `SELECT 
        county_number,
        county_name,
        unit_type_code,
        unit_type_name,
        unit_code,
        unit_name,
        fund,
        fund_name,
        certified_budget,
        certified_levy,
        certified_net_assessed_value,
        certified_gross_tax_rate
       FROM indiana_certified_values_avs
       ORDER BY county_name`
    );

    return NextResponse.json({ counties: res.rows });
  } catch (err: any) {
    console.error("Database query error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
