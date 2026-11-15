"use client";

/**
 * Registers the site's read-only agent tools with WebMCP, so an agent in the
 * browser can call them on any page. Renders nothing, and does nothing in a
 * browser without WebMCP.
 *
 * The tool definitions come from lib/content/agent.ts, the same list /mcp
 * serves, and each execute() calls /mcp, so the answers are built once,
 * server-side, and the content records never ship in the page bundle.
 *
 * Chrome exposes the API as document.modelContext; the early proposal and
 * older builds used navigator.modelContext. Tools are unregistered through
 * the AbortSignal the current API takes, and through unregisterTool where an
 * older build has it instead, so Strict Mode's double mount doesn't throw on
 * a duplicate name.
 */

import { useEffect } from "react";
import { agentTools } from "@/lib/content/agent";

type ModelContextTool = {
  name: string;
  title?: string;
  description: string;
  inputSchema: object;
  annotations?: { readOnlyHint?: boolean };
  execute: (input: Record<string, unknown>) => Promise<string>;
};

type ModelContext = {
  registerTool: (tool: ModelContextTool, options?: { signal?: AbortSignal }) => unknown;
  unregisterTool?: (name: string) => unknown;
};

function findModelContext(): ModelContext | undefined {
  const fromDocument = (document as unknown as { modelContext?: ModelContext }).modelContext;
  const fromNavigator = (navigator as unknown as { modelContext?: ModelContext }).modelContext;
  const mc = fromDocument ?? fromNavigator;
  return typeof mc?.registerTool === "function" ? mc : undefined;
}

let rpcId = 0;

async function callTool(name: string, args: Record<string, unknown>): Promise<string> {
  const response = await fetch("/mcp", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: ++rpcId,
      method: "tools/call",
      params: { name, arguments: args ?? {} },
    }),
  });
  const body = (await response.json()) as {
    result?: { content?: { type: string; text?: string }[]; isError?: boolean };
    error?: { message: string };
  };
  if (body.error) throw new Error(body.error.message);
  const text = (body.result?.content ?? [])
    .map((c) => c.text ?? "")
    .join("\n");
  if (body.result?.isError) throw new Error(text);
  return text;
}

/** Swallows a sync throw or a rejected promise: a tool that won't register isn't the page's problem. */
function attempt(fn: () => unknown) {
  try {
    const out = fn();
    if (out instanceof Promise) out.catch(() => {});
  } catch {
    /* unsupported or already registered */
  }
}

export function WebMcpTools() {
  useEffect(() => {
    const mc = findModelContext();
    if (!mc) return;
    const controller = new AbortController();

    for (const tool of agentTools) {
      attempt(() =>
        mc.registerTool(
          {
            name: tool.name,
            title: tool.title,
            description: tool.description,
            inputSchema: tool.inputSchema,
            annotations: { readOnlyHint: true },
            execute: (input) => callTool(tool.name, input),
          },
          { signal: controller.signal },
        ),
      );
    }

    return () => {
      controller.abort();
      if (mc.unregisterTool) {
        for (const tool of agentTools) attempt(() => mc.unregisterTool?.(tool.name));
      }
    };
  }, []);

  return null;
}
