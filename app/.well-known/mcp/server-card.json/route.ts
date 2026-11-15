import { agentServer } from "@/lib/content/agent";
import {
  MCP_PROTOCOL_VERSIONS,
  mcpCapabilities,
  mcpEndpointUrl,
  mcpServerInfo,
  mcpToolList,
} from "@/lib/agent/mcp";
import { organizationLogo, siteConfig } from "@/lib/siteConfig";

/**
 * /.well-known/mcp/server-card.json: the MCP Server Card (SEP-1649, carried
 * on in modelcontextprotocol PR #2127), so an agent can find /mcp and see its
 * tools before connecting.
 *
 * The card format is still a draft and readers differ, so this carries the
 * SEP's registry-style fields (name, version, remotes, capabilities, tools)
 * and also the earlier drafts' `serverInfo` and `transport`. Every value
 * comes from lib/agent/mcp.ts, the same source the endpoint answers from.
 */
export const dynamic = "force-static";

export function GET() {
  const card = {
    name: agentServer.name,
    title: agentServer.title,
    description: agentServer.description,
    version: agentServer.version,
    websiteUrl: siteConfig.url,
    icons: [
      {
        src: organizationLogo.url,
        mimeType: "image/png",
        sizes: [`${organizationLogo.width}x${organizationLogo.height}`],
      },
    ],
    remotes: [
      {
        type: "streamable-http",
        url: mcpEndpointUrl,
        supportedProtocolVersions: [...MCP_PROTOCOL_VERSIONS],
        authentication: { required: false },
      },
    ],
    serverInfo: mcpServerInfo,
    protocolVersion: MCP_PROTOCOL_VERSIONS[0],
    transport: { type: "streamable-http", endpoint: mcpEndpointUrl },
    capabilities: mcpCapabilities,
    authentication: { required: false },
    instructions: agentServer.instructions,
    tools: mcpToolList,
  };

  return new Response(JSON.stringify(card, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "X-Robots-Tag": "noindex",
    },
  });
}
