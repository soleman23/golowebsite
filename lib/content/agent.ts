/**
 * The words agents read: the MCP server's name and instructions, and each
 * read-only tool's name, description and input schema. One list serves the
 * /mcp endpoint, its server card and the in-browser WebMCP tools, so the
 * three can't describe different tools.
 *
 * Plain strings and JSON Schema only. The WebMCP leaf ships this file to the
 * browser, so nothing here may import the content records the tools read
 * (lib/agent/tools.ts does that, server-side).
 */

export const agentServer = {
  /** Reverse-DNS, as the MCP registry names servers. */
  name: "golf.golo/site",
  title: "GoLo Golf",
  /** Bump when a tool is added, removed or changes its input. */
  version: "1.0.0",
  description:
    "Read-only lookups from golo.golf: golf terms, side-game rules, Rules of Golf situations and what the GoLo app does today.",
  instructions:
    "Every tool is read-only and needs no sign-in. Answers come from the same content as the golo.golf pages and end with the page URL to cite. GoLo keeps score and shows who owes whom; it never moves money. The Rules answers explain the 2023 Rules of Golf and are independent of The R&A and the USGA; the official text is linked.",
} as const;

export type AgentToolName =
  | "lookup_golf_term"
  | "list_side_games"
  | "get_side_game"
  | "find_rules_situation"
  | "get_app_facts";

export type AgentToolDef = {
  name: AgentToolName;
  title: string;
  description: string;
  inputSchema: {
    type: "object";
    properties: Record<string, { type: "string"; description: string; maxLength?: number }>;
    required?: string[];
    additionalProperties: false;
  };
};

/** Longest string a tool accepts. Real queries are a few words. */
export const AGENT_INPUT_MAX = 200;

export const agentTools: readonly AgentToolDef[] = [
  {
    name: "lookup_golf_term",
    title: "Look up a golf term",
    description:
      "Define a golf term, scoring word, handicap concept, side game or bit of slang from the GoLo Golf glossary. Returns up to three matches with their definitions and URLs.",
    inputSchema: {
      type: "object",
      properties: {
        term: {
          type: "string",
          description: "The term or phrase, e.g. \"sandbagger\", \"course handicap\", \"press\".",
          maxLength: AGENT_INPUT_MAX,
        },
      },
      required: ["term"],
      additionalProperties: false,
    },
  },
  {
    name: "list_side_games",
    title: "List golf side games",
    description:
      "List the golf side games GoLo scores (Skins, Nassau, Wolf and the rest), each with its one-line rule, player count and guide URL.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "get_side_game",
    title: "Explain a side game",
    description:
      "Explain how one golf side game is played and scored, step by step, with a link to the full guide. Use list_side_games for the names.",
    inputSchema: {
      type: "object",
      properties: {
        game: {
          type: "string",
          description: "The game's name or slug, e.g. \"Nassau\", \"wolf\", \"bingo-bango-bongo\".",
          maxLength: AGENT_INPUT_MAX,
        },
      },
      required: ["game"],
      additionalProperties: false,
    },
  },
  {
    name: "find_rules_situation",
    title: "Find a Rules of Golf answer",
    description:
      "Answer a common on-course Rules of Golf situation (lost ball, out of bounds, cart path, unplayable lie) or summarize a rule by number. Returns up to three matches with the answer, penalty and URL.",
    inputSchema: {
      type: "object",
      properties: {
        question: {
          type: "string",
          description: "The situation in plain words or a rule number, e.g. \"ball on the cart path\", \"rule 18\".",
          maxLength: AGENT_INPUT_MAX,
        },
      },
      required: ["question"],
      additionalProperties: false,
    },
  },
  {
    name: "get_app_facts",
    title: "GoLo app facts",
    description:
      "What the GoLo app is, what it costs, where to get it, what it does today and what it doesn't, and how to contact the company.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
];

/** Lines the tools add around content records. */
export const agentToolCopy = {
  noTerm: "No glossary term matched. Browse the full glossary:",
  noGame: "No side game by that name. The games GoLo scores:",
  noRules: "No Rules situation or rule matched. Browse the Rules Center:",
  rulesIndependence:
    "Independent of The R&A and the USGA. For a ruling that matters, check the official text or ask the Committee.",
  moneyLine: "GoLo never moves money; the group settles up outside the app.",
  liveHeading: "What it does today:",
  /** The /features roadmap's own column headings. */
  testingHeading: "In testing with real groups:",
  plannedHeading: "On the list, not built:",
};
