/**
 * A stub Reach client for tests (scripts/test-reach-sync.mjs). Holds contacts
 * in memory, records every call, and can be told to fail. Never touches the
 * network. Not used by the app.
 */

import type {
  ReachClient,
  ReachContactStatus,
  FindContactResult,
  CreateContactResult,
  DeleteContactResult,
  ListActiveResult,
  UnsubscribeResult,
} from "./reachSync";

export type StubReachClient = ReachClient & {
  /** Lead-path calls (find, create, delete); the guard's calls are in guardCalls. */
  calls: { op: "find" | "create" | "delete"; email: string }[];
  guardCalls: { op: "list" | "unsubscribe"; uuid?: string }[];
  contacts: Map<string, ReachContactStatus>;
  /** Addresses Reach holds an unsubscribed_at for (it stays after a reactivation). */
  unsubscribedAt: Map<string, string>;
  /** Next N find calls fail with this code. */
  failFind: (code: string, times?: number) => void;
  /** Next N create calls fail with this code; "throw" makes them throw. */
  failCreate: (code: string, times?: number) => void;
  /** Next N list calls fail with this code; "throw" makes them throw. */
  failList: (code: string, times?: number) => void;
  /** Next N unsubscribe calls fail with this code. */
  failUnsubscribe: (code: string, times?: number) => void;
  creates: () => number;
  /** Uuids the guard set back to unsubscribed, in order. */
  reverts: () => string[];
  /** The contact follows a campaign's unsubscribe link. */
  unsubscribe: (email: string, at?: string) => void;
  /** The contact follows an old double opt-in link: confirmed again, unsubscribed_at kept. */
  replayConfirmation: (email: string) => void;
};

export function createStubReachClient(
  initial: Record<string, ReachContactStatus> = {},
): StubReachClient {
  const contacts = new Map<string, ReachContactStatus>(Object.entries(initial));
  const unsubscribedAt = new Map<string, string>();
  // Sequential, so a uuid in a log line never carries the address.
  const uuids = new Map<string, string>();
  const uuidOf = (email: string) => {
    if (!uuids.has(email)) uuids.set(email, `contact-${uuids.size + 1}`);
    return uuids.get(email) as string;
  };
  const calls: StubReachClient["calls"] = [];
  const guardCalls: StubReachClient["guardCalls"] = [];
  let findFailure: { code: string; times: number } | null = null;
  let createFailure: { code: string; times: number } | null = null;
  let listFailure: { code: string; times: number } | null = null;
  let unsubscribeFailure: { code: string; times: number } | null = null;

  return {
    calls,
    guardCalls,
    contacts,
    unsubscribedAt,
    failFind(code, times = 1) {
      findFailure = { code, times };
    },
    failCreate(code, times = 1) {
      createFailure = { code, times };
    },
    failList(code, times = 1) {
      listFailure = { code, times };
    },
    failUnsubscribe(code, times = 1) {
      unsubscribeFailure = { code, times };
    },
    creates: () => calls.filter((c) => c.op === "create").length,
    reverts: () => guardCalls.filter((c) => c.op === "unsubscribe").map((c) => c.uuid as string),
    unsubscribe(email, at = "2026-11-02T12:00:00Z") {
      contacts.set(email, "unsubscribed");
      unsubscribedAt.set(email, at);
    },
    replayConfirmation(email) {
      contacts.set(email, "confirmed");
    },

    async findContact(email): Promise<FindContactResult> {
      calls.push({ op: "find", email });
      if (findFailure && findFailure.times > 0) {
        findFailure.times -= 1;
        if (findFailure.code === "throw") throw new Error("stub find threw");
        return { ok: false, error: findFailure.code };
      }
      return { ok: true, status: contacts.get(email) ?? null };
    },

    async createContact(email): Promise<CreateContactResult> {
      calls.push({ op: "create", email });
      if (createFailure && createFailure.times > 0) {
        createFailure.times -= 1;
        if (createFailure.code === "throw") throw new Error("stub create threw");
        return { ok: false, error: createFailure.code };
      }
      // As Reach does: an address it already has keeps its status (an
      // unsubscribed one stays unsubscribed). Double opt-in on: a new contact
      // is pending.
      if (!contacts.has(email)) contacts.set(email, "pending");
      return { ok: true };
    },

    async deleteContact(email): Promise<DeleteContactResult> {
      calls.push({ op: "delete", email });
      // As Reach does: the contact and its unsubscribed mark both go.
      unsubscribedAt.delete(email);
      const deleted = contacts.delete(email) ? 1 : 0;
      return { ok: true, deleted };
    },

    async listActiveContacts(): Promise<ListActiveResult> {
      guardCalls.push({ op: "list" });
      if (listFailure && listFailure.times > 0) {
        listFailure.times -= 1;
        if (listFailure.code === "throw") throw new Error("stub list threw");
        return { ok: false, error: listFailure.code };
      }
      return {
        ok: true,
        contacts: [...contacts]
          .filter(([, status]) => status === "confirmed" || status === "subscribed")
          .map(([email, status]) => ({
            uuid: uuidOf(email),
            email,
            status,
            unsubscribedAt: unsubscribedAt.get(email) ?? null,
          })),
      };
    },

    async unsubscribeContact(uuid): Promise<UnsubscribeResult> {
      guardCalls.push({ op: "unsubscribe", uuid });
      if (unsubscribeFailure && unsubscribeFailure.times > 0) {
        unsubscribeFailure.times -= 1;
        return { ok: false, error: unsubscribeFailure.code };
      }
      const email = [...contacts.keys()].find((e) => uuids.get(e) === uuid);
      if (!email) return { ok: false, error: "http_404" };
      contacts.set(email, "unsubscribed");
      unsubscribedAt.set(email, "2026-11-02T12:00:00Z");
      return { ok: true };
    },
  };
}
