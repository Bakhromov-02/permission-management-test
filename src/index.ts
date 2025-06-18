import { connect, JSONCodec } from 'nats';
import dotenv from 'dotenv';
dotenv.config();

import { CheckPayload, ListPayload, PermissionPayload } from "./types";
import { handleCheck, handleGrant, handleList, handleRevoke } from './handlers';
import { initKV } from './kv/cache';


const jc = JSONCodec();

async function start() {
  const nc = await connect({ servers: "localhost:4222" });
  const { kv } = await initKV();

  nc.subscribe("permissions.grant", {
    callback: async (err, msg) => {
      try {
        const payload = jc.decode(msg.data) as PermissionPayload;
        const res = await handleGrant(payload);
        msg.respond(jc.encode(res));
      } catch (e: any) {
        msg.respond(
          jc.encode({ error: { code: "unknown", message: e.message } })
        );
      }
    },
  });

  nc.subscribe("permissions.revoke", {
    callback: async (err, msg) => {
      try {
        const payload = jc.decode(msg.data) as PermissionPayload;
        const res = await handleRevoke(payload);
        msg.respond(jc.encode(res));
      } catch (e: any) {
        msg.respond(
          jc.encode({ error: { code: "unknown", message: e.message } })
        );
      }
    },
  });

  nc.subscribe("permissions.check", {
    callback: async (err, msg) => {
      try {
        const payload = jc.decode(msg.data) as CheckPayload;
        const res = await handleCheck(payload);
        msg.respond(jc.encode(res));
      } catch (e: any) {
        msg.respond(
          jc.encode({ error: { code: "unknown", message: e.message } })
        );
      }
    },
  });

  nc.subscribe("permissions.list", {
    callback: async (err, msg) => {
      try {
        const payload = jc.decode(msg.data) as ListPayload;
        const res = await handleList(payload);
        msg.respond(jc.encode(res));
      } catch (e: any) {
        msg.respond(
          jc.encode({ error: { code: "unknown", message: e.message } })
        );
      }
    },
  });
}

start();
