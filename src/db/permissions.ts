import { db } from './client';

export async function grantPermission(apiKey: string, module: string, action: string) {
  await db.query(
    `INSERT INTO permissions (api_key, module, action) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
    [apiKey, module, action]
  );
}

export async function revokePermission(apiKey: string, module: string, action: string) {
  await db.query(
    `DELETE FROM permissions WHERE api_key=$1 AND module=$2 AND action=$3`,
    [apiKey, module, action]
  );
}

export async function getPermissions(apiKey: string) {
  const res = await db.query(
    `SELECT module, action FROM permissions WHERE api_key=$1`,
    [apiKey]
  );
  return res.rows;
}

export async function getPermission(apiKey: string, module: string, action: string) {
  const res = await db.query(
    `SELECT module, action FROM permissions WHERE api_key = $1 AND module = $2 AND action = $3 LIMIT 1`,
    [apiKey, module, action]
  );
  return res.rows[0] || null;
}

