import { Pool } from "pg";
import { NextResponse } from "next/server";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(request: Request) {
  try {
    const res = await pool.query(
        `SELECT 
            sd_name,
            subtotal_general,
            instructional_support,
            total_general,
            management,
            amana_library,
            voted_ppel,
            reorganization,
            playground,
            debt_service,
            total_rate,
            total_levy,
            regular_ppel        
        FROM iowa_school_data
        ORDER BY sd_name`
    );

    return NextResponse.json({ schoolDistricts: res.rows });
  } catch (err: any) {
    console.error("Database query error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
