import { getPermission } from "../db/permissions";
import { kv, decode, encode } from "../kv/cache";

import { logger } from "../lib/helpers";
import { CheckRequest, CheckResponse, ErrorCode, ErrorResponse } from "../lib/permissions";

export async function handleCheck(
  payload: CheckRequest
): Promise<CheckResponse | ErrorResponse> {
  try {
    logger.info("check_request", payload);

    let data;
    try {
      const kvEntry = await kv.get(payload.apiKey);
      data = kvEntry ? decode(kvEntry.value) : null;
    } catch (e) {
      logger.error("cache_error", { error: e });
    }

    if (!data.length) {
      logger.info("cache_miss", { apiKey: payload.apiKey });
      
      data = await getPermission(
        payload.apiKey,
        payload.module,
        payload.action
      );

      if (!data) {
        return {
          error: {
            code: ErrorCode.apiKey_not_found,
            message: "API key not found",
          },
        };
      }
      await kv.put(payload.apiKey, encode(data));
    }

    const allowed = data.some(
      (p: any) => p?.module === payload?.module && p?.action === payload?.action
    );

    return { allowed };
  } catch (e: any) {
    logger.error("check_error", { error: e.message });
    return {
      error: {
        code: ErrorCode.unknown,
        message: "Unexpected error during check",
      },
    };
  }
}
