import { agentServer } from "@/lib/content/agent";
import { isAgentToolName, runAgentTool } from "@/lib/agent/tools";
import { readBodyText } from "@/lib/subscribeGuard";
import {
  MCP_PROTOCOL_VERSIONS,
  mcpCapabilities,
  mcpServerInfo,
  mcpToolList,
} from "@/lib/agent/mcp";

/**
 * /mcp: a stateless, read-only MCP server over Streamable HTTP.
 *
 * Every request is one JSON-RPC message in a POST and gets one JSON reply,
 * never an SSE stream: nothing here runs long enough to stream, there are no
 * server-to-client requests, and there's no session to resume, so no
 * Mcp-Session-Id is issued. GET (the optional SSE channel) answers 405, which
 * the spec allows. Batches aren't accepted (the 2025-06-18 revision removed
 * them).
 *
 * Open CORS is deliberate: the tools only read the site's public content, no
 * cookie or credential is read, and the in-browser WebMCP tools call this
 * from the page itself.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Requests are a tool name and a few words; anything bigger isn't one. */
const MAX_BODY_BYTES = 16 * 1024;

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Accept, Mcp-Protocol-Version, Mcp-Session-Id, Last-Event-ID",
  "Access-Control-Max-Age": "86400",
} as const;

type JsonRpcId = string | number | null;

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...CORS,
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}

function rpcError(id: JsonRpcId, code: number, message: string, status = 200): Response {
  return json({ jsonrpc: "2.0", id, error: { code, message } }, status);
}

function rpcResult(id: JsonRpcId, result: unknown): Response {
  return json({ jsonrpc: "2.0", id, result });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function negotiateVersion(requested: unknown): string {
  return typeof requested === "string" &&
    (MCP_PROTOCOL_VERSIONS as readonly string[]).includes(requested)
    ? requested
    : MCP_PROTOCOL_VERSIONS[0];
}

export async function POST(request: Request): Promise<Response> {
  // Counted in bytes as the body streams in, and cancelled past the limit,
  // so an oversized or chunked request is never buffered whole.
  const raw = await readBodyText(request.body, MAX_BODY_BYTES);
  if (raw === null) {
    return rpcError(null, -32600, "Request too large.", 413);
  }

  let message: unknown;
  try {
    message = JSON.parse(raw);
  } catch {
    return rpcError(null, -32700, "Parse error.", 400);
  }

  if (Array.isArray(message)) {
    return rpcError(null, -32600, "Batch requests are not supported.", 400);
  }
  if (!isRecord(message) || message.jsonrpc !== "2.0" || typeof message.method !== "string") {
    return rpcError(null, -32600, "Invalid request.", 400);
  }

  const { method } = message;
  const params = isRecord(message.params) ? message.params : {};

  // A notification (no id) or a response from the client: accepted, no body.
  if (!("id" in message)) {
    return new Response(null, { status: 202, headers: CORS });
  }
  const id = message.id;
  if (typeof id !== "string" && typeof id !== "number") {
    return rpcError(null, -32600, "Invalid request id.", 400);
  }

  switch (method) {
    case "initialize":
      return rpcResult(id, {
        protocolVersion: negotiateVersion(params.protocolVersion),
        capabilities: mcpCapabilities,
        serverInfo: mcpServerInfo,
        instructions: agentServer.instructions,
      });

    case "ping":
      return rpcResult(id, {});

    case "tools/list":
      return rpcResult(id, { tools: mcpToolList });

    case "tools/call": {
      const name = params.name;
      if (!isAgentToolName(name)) {
        return rpcError(id, -32602, `Unknown tool: ${String(name).slice(0, 80)}`);
      }
      const args = isRecord(params.arguments) ? params.arguments : {};
      const result = runAgentTool(name, args);
      return rpcResult(id, {
        content: [{ type: "text", text: result.text }],
        isError: Boolean(result.isError),
      });
    }

    default:
      return rpcError(id, -32601, `Method not found: ${method.slice(0, 80)}`);
  }
}

export function GET(): Response {
  return new Response("This MCP endpoint takes JSON-RPC over POST.\n", {
    status: 405,
    headers: { ...CORS, Allow: "POST, OPTIONS", "Content-Type": "text/plain; charset=utf-8" },
  });
}

export function DELETE(): Response {
  return GET();
}

export function OPTIONS(): Response {
  return new Response(null, { status: 204, headers: CORS });
}
