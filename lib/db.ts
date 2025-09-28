
// lib/db.ts
import { neon, neonConfig } from '@neondatabase/serverless';

// don't cache fetch connections between invocations
neonConfig.fetchConnectionCache = false;

// optional: tighter timeouts for long/idle queries
neonConfig.poolQueryTimeout = 10_000; // 10s hard cap per query

export const sql = neon(process.env.NEON_DATABASE_URL!); // use your -pooler URL
