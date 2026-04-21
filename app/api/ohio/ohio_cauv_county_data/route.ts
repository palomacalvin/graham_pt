import { Pool } from "pg";
import { NextResponse } from "next/server";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(request: Request) {
  try {
    const res = await pool.query(
      `SELECT 
        county_name,
        avg_market_value_by_total_acres,
        avg_market_value_35_percent,
        cauv_100_percent_valuation_total_acres,
        cauv_35_percent_valuation
       FROM ohio_cauv_county_data
       ORDER BY county_name`
    );

    return NextResponse.json({ counties: res.rows });
  } catch (err: any) {
    console.error("Database query error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
