import { getPermissions } from '../db/permissions';
import { kv, decode, encode } from '../kv/cache';

import { logger } from '../lib/helpers';
import { ErrorCode, ErrorResponse, ListRequest, ListResponse } from '../lib/permissions';

export async function handleList(payload: ListRequest): Promise<ListResponse | ErrorResponse> {
  try {
    logger.info('list_request', payload);

    let permissions;
    try {
      const kvEntry = await kv.get(payload.apiKey);
      permissions = kvEntry ? decode(kvEntry.value) : null;
    } catch (e) {
      logger.error('cache_error', { error: e });
    }

    if (!permissions.length) {
      logger.info("cache_miss", { apiKey: payload.apiKey });
      permissions = await getPermissions(payload.apiKey);
      if (!permissions.length) {
        return {
          error: {
            code: ErrorCode.apiKey_not_found,
            message: "API key not found",
          },
        };
      }
      await kv.put(payload.apiKey, encode(permissions));
    }

    return { permissions };
  } catch (e: any) {
    logger.error("list_error", { error: e.message });
    return {
      error: {
        code: ErrorCode.unknown,
        message: 'Unexpected error during list',
      },
    };
  }
}
