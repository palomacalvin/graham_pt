import { Pool } from "pg";
import { NextResponse } from "next/server";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const county = url.searchParams.get("county");

    if (!county) {
      return NextResponse.json({ error: "County is required" }, { status: 400 });
    }

    const res = await pool.query(
      `SELECT 
         city_town,
         ag_homestead_rate,
         ag_non_homestead_rate,
         commercial_rate
       FROM minnesota_cities 
       WHERE UPPER(home_county) ILIKE $1 
       ORDER BY city_town`,
      [county]
    );

    return NextResponse.json({ cities: res.rows });
  } catch (err: any) {
    console.error("Database query error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
