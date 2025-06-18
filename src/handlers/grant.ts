import { grantPermission, getPermissions } from '../db/permissions';
import { PermissionPayload } from '../types';
import { encode, kv } from '../kv/cache';
import { logger } from '../utils/logger';

export async function handleGrant(payload: PermissionPayload) {
  const { apiKey, module, action } = payload;

  logger.info("grant_request", payload);

  await grantPermission(apiKey, module, action);

  const perms = await getPermissions(apiKey);
  await kv.put(apiKey, encode(perms));

  logger.info("grant_success", { apiKey });

  return { status: "ok" };
}
