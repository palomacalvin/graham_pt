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
            city_name,
            city_code,
            census_2020,
            taxable_value,
            ag_land,
            consolidated_gen_fund_levy_older,
            consolidated_gen_fund_levy_newer,
            public_transit,
            authority,
            self_insurance,
            support_of_local_emc,
            law_enforcement,
            ag_land_levy,
            debt_service,
            employ_benefit,
            capital_improve,
            regular_without_ag
        FROM iowa_city_data
        ORDER BY county_name`
    );

    return NextResponse.json({ cities: res.rows });
  } catch (err: any) {
    console.error("Database query error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
