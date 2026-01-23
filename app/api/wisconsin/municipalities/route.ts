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
      municipality,
      grade_1,
      grade_2,
      grade_3,
      pasture,
      gross_rate,
      effective_rate,
      total_property_tax,
      school_tax,
      college_tax,
      county_tax,
      local_tax,
      other_tax
    FROM wisconsin_tax_rates
    WHERE county_name = $1
    ORDER BY municipality
    `,
    [county]
  );

  return NextResponse.json({ cities: res.rows });
}
