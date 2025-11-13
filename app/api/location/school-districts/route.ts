import { Pool } from "pg";
import { NextResponse } from "next/server";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(request: Request) {
  try {
    const res = await pool.query(
      `SELECT school_district FROM minnesota_school_districts ORDER BY school_district`
    );

    return NextResponse.json({ schoolDistricts: res.rows });
  } catch (err: any) {
    console.error("Database query error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
