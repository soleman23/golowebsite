/**
 * The MCP server's fixed facts, shared by the /mcp endpoint and the server
 * card at /.well-known/mcp/server-card.json so the two can't disagree.
 */

import { agentServer, agentTools } from "@/lib/content/agent";
import { siteConfig } from "@/lib/siteConfig";

/** Newest first. The endpoint answers with the client's version when it's listed. */
export const MCP_PROTOCOL_VERSIONS = ["2025-11-25", "2025-06-18", "2025-03-26"] as const;

export const MCP_PATH = "/mcp";
export const mcpEndpointUrl = `${siteConfig.url}${MCP_PATH}`;

export const mcpCapabilities = { tools: { listChanged: false } } as const;

export const mcpServerInfo = {
  name: agentServer.name,
  title: agentServer.title,
  version: agentServer.version,
} as const;

/** Tools as MCP's tools/list returns them. Every one is read-only. */
export const mcpToolList = agentTools.map((t) => ({
  name: t.name,
  title: t.title,
  description: t.description,
  inputSchema: t.inputSchema,
  annotations: {
    title: t.title,
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
}));
