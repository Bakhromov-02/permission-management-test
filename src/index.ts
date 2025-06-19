import { connect, JSONCodec } from 'nats';
import dotenv from 'dotenv';
dotenv.config();

import { handleCheck, handleGrant, handleList, handleRevoke } from './handlers';
import { initKV } from './kv/cache';

import {
  Topics,
  ListRequest,
  CheckRequest,
  GrantRequest,
  RevokeRequest,
} from "./lib/permissions";


const jc = JSONCodec();

async function start() {
  const nc = await connect({ servers: "localhost:4222" });
  const { kv } = await initKV();

  nc.subscribe(Topics.GRANT, {
    callback: async (err, msg) => {
      try {
        const payload = jc.decode(msg.data) as GrantRequest;
        const res = await handleGrant(payload);
        msg.respond(jc.encode(res));
      } catch (e: any) {
        msg.respond(
          jc.encode({ error: { code: "unknown", message: e.message } })
        );
      }
    },
  });

  nc.subscribe(Topics.REVOKE, {
    callback: async (err, msg) => {
      try {
        const payload = jc.decode(msg.data) as RevokeRequest;
        const res = await handleRevoke(payload);
        msg.respond(jc.encode(res));
      } catch (e: any) {
        msg.respond(
          jc.encode({ error: { code: "unknown", message: e.message } })
        );
      }
    },
  });

  nc.subscribe(Topics.CHECK, {
    callback: async (err, msg) => {
      try {
        const payload = jc.decode(msg.data) as CheckRequest;
        const res = await handleCheck(payload);
        msg.respond(jc.encode(res));
      } catch (e: any) {
        msg.respond(
          jc.encode({ error: { code: "unknown", message: e.message } })
        );
      }
    },
  });

  nc.subscribe(Topics.LIST, {
    callback: async (err, msg) => {
      try {
        const payload = jc.decode(msg.data) as ListRequest;
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
