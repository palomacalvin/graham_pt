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
         local_unit_name,
         city,
         village_name,
         school_name,
         school_code,
         total_rate,
         homestead_rate,
         non_homestead_rate,
         county_allocated,
         county_extra_voted,
         county_debt,
         lu_allocated,
         lu_extra_voted,
         lu_debt,
         sd_hold_harmless,
         sd_non_homestead,
         sd_debt,
         sd_sinking_fund,
         sd_comm_pers,
         sd_recreational,
         isd_allocated,
         isd_vocational,
         isd_special_ed,
         isd_debt,
         cc_operating,
         part_unit_auth,
         part_unit_auth_debt,
         special_assessment,
         village_allocated,
         village_extra_voted,
         village_debt,
         village_auth,
         village_auth_debt,
         village_special_assessment,
         cc_debt,
         isd_enhancement
       FROM michigan_millages
       ORDER BY county_name`
    );

    return NextResponse.json({ counties: res.rows });
  } catch (err: any) {
    console.error("Database query error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
