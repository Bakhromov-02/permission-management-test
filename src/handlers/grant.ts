import { encode, kv } from '../kv/cache';
import { grantPermission, getPermissions } from '../db/permissions';

import { logger } from '../lib/helpers';
import { GrantRequest, GrantResponse } from "../lib/permissions";

export async function handleGrant(
  payload: GrantRequest
): Promise<GrantResponse> {
  const { apiKey, module, action } = payload;

  logger.info("grant_request", payload);

  await grantPermission(apiKey, module, action);

  const perms = await getPermissions(apiKey);
  await kv.put(apiKey, encode(perms));

  logger.info("grant_success", { apiKey });

  return { status: "ok" };
}
