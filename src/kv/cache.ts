import { connect, StringCodec, NatsConnection, KV } from 'nats';

let nc: NatsConnection;
export let kv: KV;
const sc = StringCodec();

export async function initKV() {
  nc = await connect({ servers: "localhost:4222" });
  kv = await nc.jetstream().views.kv("permissions_cache");
  return { nc, kv };
}

export function encode(data: any): Uint8Array {
  return sc.encode(JSON.stringify(data));
}

export function decode(data: Uint8Array): any {
  return JSON.parse(sc.decode(data));
}
