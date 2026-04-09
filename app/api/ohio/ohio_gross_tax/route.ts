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
        taxing_district_number,
        taxing_district_name,
        gross_tax_rate,
        class_i_composite_tax_reduction_factor,
        class_ii_composite_tax_reduction_factor,
        class_i_tax_rate,
        class_ii_tax_rate,
        class_i_non_business_rollback_factor,
        class_i_owner_occupied_rollback_factor,
        class_i_non_business_rollback_factor,
        class_ii_owner_occupied_rollback_factor
       FROM ohio_gross_tax
       ORDER BY county_name`
    );

    return NextResponse.json({ counties: res.rows });
  } catch (err: any) {
    console.error("Database query error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
