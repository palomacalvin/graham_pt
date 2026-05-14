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
            urban_value,
            urban_rate,
            urban_levy,
            rural_value,
            rural_levy,
            total_value,
            special_levy,
            total_levy,
            rural_rate
        FROM iowa_county_tax_data
        ORDER BY county_name`
    );

    return NextResponse.json({ counties: res.rows });
  } catch (err: any) {
    console.error("Database query error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
