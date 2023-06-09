import * as couchbase from 'couchbase';

const COUCHBASE_USER = process.env.COUCHBASE_USER;
const COUCHBASE_PASSWORD = process.env.COUCHBASE_PASSWORD;
const COUCHBASE_ENDPOINT = process.env.COUCHBASE_ENDPOINT || 'localhost';
let COUCHBASE_IS_CLOUD_INSTANCE = process.env.COUCHBASE_IS_CLOUD_INSTANCE || 'false';

if (!COUCHBASE_USER) {
  throw new Error(
    'Please define the COUCHBASE_USER environment variable inside .env.local',
  );
}

if (!COUCHBASE_PASSWORD) {
  throw new Error(
    'Please define the COUCHBASE_PASSWORD environment variable inside .env.local',
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */

let cached = (global as any).uniqueCouchbaseInstance;

if (!cached) {
  cached = (global as any).uniqueCouchbaseInstance = { conn: null };
}

export async function createCouchbaseCluster() {
  if (cached.conn) {
    return cached.conn;
  }

  cached.conn = await couchbase.connect(
    COUCHBASE_ENDPOINT +
      (COUCHBASE_IS_CLOUD_INSTANCE === 'true'
        ? '?ssl=no_verify&console_log_level=5'
        : ''),
    {
      username: COUCHBASE_USER,
      password: COUCHBASE_PASSWORD,
    },
  );

  return cached.conn;
}
