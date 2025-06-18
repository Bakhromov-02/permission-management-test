import { revokePermission, getPermissions } from '../db/permissions';
import { PermissionPayload, ErrorResponse, ErrorCode } from '../types';
import { kv, encode } from '../kv/cache';
import { logger } from '../utils/logger';

export async function handleRevoke(payload: PermissionPayload): Promise<{ status: 'ok' } | ErrorResponse> {
  try {
   logger.info("revoke_request", payload);

    await revokePermission(payload.apiKey, payload.module, payload.action);
    const updatedPermissions = await getPermissions(payload.apiKey);
    await kv.put(payload.apiKey, encode(updatedPermissions));

    logger.info("revoke_success", { apiKey: payload.apiKey });
    return { status: "ok" };
  } catch (e: any) {
    logger.error("revoke_error", { error: e.message });
    return {
      error: {
        code: ErrorCode.db_error,
        message: 'Failed to revoke permission',
      },
    };
  }
}
