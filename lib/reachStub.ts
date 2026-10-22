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
} from "./reachSync";

export type StubReachClient = ReachClient & {
  calls: { op: "find" | "create" | "delete"; email: string }[];
  contacts: Map<string, ReachContactStatus>;
  /** Next N find calls fail with this code. */
  failFind: (code: string, times?: number) => void;
  /** Next N create calls fail with this code; "throw" makes them throw. */
  failCreate: (code: string, times?: number) => void;
  creates: () => number;
};

export function createStubReachClient(
  initial: Record<string, ReachContactStatus> = {},
): StubReachClient {
  const contacts = new Map<string, ReachContactStatus>(Object.entries(initial));
  const calls: StubReachClient["calls"] = [];
  let findFailure: { code: string; times: number } | null = null;
  let createFailure: { code: string; times: number } | null = null;

  return {
    calls,
    contacts,
    failFind(code, times = 1) {
      findFailure = { code, times };
    },
    failCreate(code, times = 1) {
      createFailure = { code, times };
    },
    creates: () => calls.filter((c) => c.op === "create").length,

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
      // Double opt-in on: Reach holds the new contact as pending.
      contacts.set(email, "pending");
      return { ok: true };
    },

    async deleteContact(email): Promise<DeleteContactResult> {
      calls.push({ op: "delete", email });
      // As Reach does: the contact and its unsubscribed mark both go.
      const deleted = contacts.delete(email) ? 1 : 0;
      return { ok: true, deleted };
    },
  };
}
