import { Pool } from "pg";
import { NextResponse } from "next/server";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const county = searchParams.get("county");

  if (!county) {
    return NextResponse.json({ cities: [] });
  }

  const res = await pool.query(
    `
    SELECT
      code,
      tvc,
      municipality
    FROM wisconsin_tax_rates
    WHERE county_name = $1
    ORDER BY municipality
    `,
    [county]
  );

  return NextResponse.json({ cities: res.rows });
}
