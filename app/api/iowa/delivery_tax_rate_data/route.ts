import { Pool } from "pg";
import { NextResponse } from "next/server";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(request: Request) {
  try {
    const res = await pool.query(
        `SELECT 
            name_of_utility,
            delivery_tax_rate_per_kwh,
            delivery_tax_rate_per_mwh
        FROM iowa_delivery_tax_rate_data
        ORDER BY name_of_utility`
    );

    return NextResponse.json({ utility: res.rows });
  } catch (err: any) {
    console.error("Database query error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
