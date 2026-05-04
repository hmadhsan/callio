type Platform = 'x';

type Template = {
  topic: string;
  x: string;
};

const TEMPLATES: Template[] = [
  {
    topic: 'positioning',
    x: `AI agents are only as useful as the APIs they can reach.\n\nCallio is the API gateway for AI agents.\n\nOne interface to discover, authenticate, and call the full API catalog without stitching integrations together one by one.\n\nhttps://callio.dev`,
  },
  {
    topic: 'pain-point',
    x: `Every new agent capability usually means another API, another auth flow, and more plumbing.\n\nCallio removes that overhead.\n\nOne gateway. Full catalog. Faster shipping.\n\nhttps://callio.dev`,
  },
  {
    topic: 'developer-speed',
    x: `If you are building agentic products, the fastest team often wins.\n\nCallio helps teams move faster by replacing separate API integrations with one unified gateway for AI agents.\n\nhttps://callio.dev`,
  },
  {
    topic: 'mcp',
    x: `MCP is making agents more useful.\n\nBut useful agents still need reliable access to APIs.\n\nCallio connects that layer: install the MCP server and your agent gets the same catalog through one gateway.\n\nhttps://callio.dev/mcp`,
  },
  {
    topic: 'use-case-email',
    x: `Need an agent to send emails, search the web, enrich data, or trigger workflows?\n\nThat usually means multiple integrations.\n\nCallio turns that into one gateway for AI agents.\n\nhttps://callio.dev`,
  },
  {
    topic: 'infrastructure',
    x: `The opportunity in AI is not just better models.\n\nIt is better infrastructure around what agents can actually do.\n\nCallio is building that infrastructure layer for API access.\n\nhttps://callio.dev`,
  },
  {
    topic: 'api-providers',
    x: `Callio is useful for builders, but also for API providers.\n\nList once, get discovered by AI agents and agentic products.\n\nhttps://callio.dev`,
  },
  {
    topic: 'product',
    x: `Callio is not trying to be another generic wrapper.\n\nThe product is simple:\nOne API gateway for AI agents.\n\nDevelopers discover, authenticate, and call upstream APIs through one interface.\n\nhttps://callio.dev`,
  },
  {
    topic: 'auth',
    x: `A lot of the pain in API integrations is not the request itself.\n\nIt is auth, routing, and operational overhead.\n\nThat is exactly the layer Callio handles for agent builders.\n\nhttps://callio.dev`,
  },
  {
    topic: 'distribution',
    x: `If agents become a real software category, they will need a real API access layer.\n\nThat is the wedge behind Callio.\n\nhttps://callio.dev`,
  },
];

function rotateTemplate(index: number) {
  return TEMPLATES[index % TEMPLATES.length];
}

function scheduledDateForIndex(startDate: Date, index: number) {
  const date = new Date(startDate);
  date.setUTCDate(date.getUTCDate() + index);
  return date;
}

export function generateMarketingPosts({
  startDate,
  days,
  platforms,
}: {
  startDate: Date;
  days: number;
  platforms: Platform[];
}) {
  const posts: Array<{
    platform: Platform;
    topic: string;
    content: string;
    scheduledFor: Date;
  }> = [];

  for (let index = 0; index < days; index++) {
    const template = rotateTemplate(index);
    const scheduledFor = scheduledDateForIndex(startDate, index);

    for (const platform of platforms) {
      posts.push({
        platform,
        topic: template.topic,
        content: template[platform],
        scheduledFor,
      });
    }
  }

  return posts;
}

export function normalizePlatforms(input: unknown): Platform[] {
  if (!Array.isArray(input)) {
    return ['x'];
  }

  const platforms = input.filter((item): item is Platform => item === 'x');
  return platforms.length > 0 ? platforms : ['x'];
}
