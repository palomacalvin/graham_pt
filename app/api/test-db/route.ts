import { NextResponse } from 'next/server';
import { Client } from 'pg';

export async function GET() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  
  try {
    await client.connect();
    const result = await client.query('SELECT NOW()');
    await client.end();

    return NextResponse.json({ dbTime: result.rows[0].now });
  } catch (error) {
    return NextResponse.json({ error: 'Database connection failed', details: error }, { status: 500 });
  }
}
