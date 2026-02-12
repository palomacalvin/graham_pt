import { Pool } from "pg";
import { NextResponse } from "next/server";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(request: Request) {
  try {
    const res = await pool.query(
      `SELECT 
         years_ago_from_present,
         factor_form_3589,
         factor_form_4565,
         factor_form_5762
       FROM michigan_mult_factors
       ORDER BY years_ago_from_present`
    );

    return NextResponse.json({ factors: res.rows });
  } catch (err: any) {
    console.error("Database query error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
