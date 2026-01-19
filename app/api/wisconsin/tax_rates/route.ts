import { Pool } from "pg";
import { NextResponse } from "next/server";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const county = searchParams.get("county");
  const municipality = searchParams.get("municipality");

  if (!county || !municipality) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  const res = await pool.query(
    `
    SELECT *
    FROM wisconsin_tax_rates
    WHERE county_name = $1
      AND municipality = $2
    `,
    [county, municipality]
  );

  return NextResponse.json(res.rows[0]);
}
