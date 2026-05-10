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
            productivity_per_acre,
            five_yr_avg_market_value_per_acre,
            ag_building_factor,
            ag_land_adjustment,
            number_of_ag_acres_in_county,
            average_csr_in_county,
            ag_rollback
        FROM iowa_ag_land_value_data
        ORDER BY county_name`
    );

    return NextResponse.json({ counties: res.rows });
  } catch (err: any) {
    console.error("Database query error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
