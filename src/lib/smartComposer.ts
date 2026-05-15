import prisma from '@/lib/prisma';

type ComposerLanguage = 'typescript' | 'python';

export interface ComposerRequest {
  prompt: string;
  language: ComposerLanguage;
}

export interface ComposerStep {
  id: string;
  title: string;
  instruction: string;
  apiSlug: string;
  apiName: string;
  method: string;
  path: string;
  score: number;
  rationale: string;
  inputSchema: Record<string, string>;
}

export interface ComposerResult {
  workflow: {
    name: string;
    description: string;
    generatedAt: string;
    language: ComposerLanguage;
    steps: ComposerStep[];
  };
  code: string;
  mcpConfig: string;
  executionPrompt: string;
}

interface EndpointRecord {
  method: string;
  path: string;
  description: string;
}

interface ApiRecord {
  slug: string;
  name: string;
  category: string;
  shortDescription: string;
  endpoints: EndpointRecord[];
}

const TOKEN_SPLIT_REGEX = /[^a-z0-9]+/g;
const STOP_WORDS = new Set([
  'the',
  'a',
  'an',
  'to',
  'for',
  'of',
  'and',
  'then',
  'with',
  'into',
  'from',
  'in',
  'on',
  'at',
  'by',
  'is',
  'are',
  'be',
  'new',
  'when',
  'after',
  'if',
]);

const VERB_HINTS: Record<string, string[]> = {
  GET: ['get', 'find', 'search', 'list', 'read', 'fetch', 'lookup', 'retrieve'],
  POST: ['create', 'send', 'add', 'post', 'insert', 'trigger', 'publish'],
  PUT: ['replace', 'overwrite', 'upsert', 'set'],
  PATCH: ['update', 'edit', 'modify', 'change'],
  DELETE: ['delete', 'remove', 'cancel', 'archive'],
};

const MAX_APIS = 120;

function normalize(value: string): string {
  return value.toLowerCase().trim();
}

function tokenize(value: string): string[] {
  return normalize(value)
    .split(TOKEN_SPLIT_REGEX)
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));
}

function splitPromptIntoSteps(prompt: string): string[] {
  const normalized = prompt
    .replace(/\s+/g, ' ')
    .replace(/\s*(->|=>)\s*/g, ' then ')
    .replace(/\s*,\s*then\s+/gi, ' then ')
    .replace(/\s*\.\s*/g, ' then ');

  const steps = normalized
    .split(/\bthen\b|\band then\b|\bafter that\b|\bnext\b/gi)
    .map((part) => part.trim())
    .filter(Boolean);

  if (steps.length === 0) {
    return [prompt.trim()];
  }

  return steps;
}

function detectPreferredMethod(stepText: string): string | null {
  const text = normalize(stepText);
  for (const [method, verbs] of Object.entries(VERB_HINTS)) {
    if (verbs.some((verb) => text.includes(verb))) {
      return method;
    }
  }
  return null;
}

function tokenOverlapScore(tokensA: string[], tokensB: string[]): number {
  if (tokensA.length === 0 || tokensB.length === 0) {
    return 0;
  }

  const setA = new Set(tokensA);
  const setB = new Set(tokensB);
  let overlap = 0;

  setA.forEach((token) => {
    if (setB.has(token)) {
      overlap += 1;
    }
  });

  const avgLength = (setA.size + setB.size) / 2;
  return overlap / Math.max(avgLength, 1);
}

function pickBestEndpoint(stepText: string, apis: ApiRecord[]): ComposerStep {
  const stepTokens = tokenize(stepText);
  const preferredMethod = detectPreferredMethod(stepText);

  let bestMatch: {
    api: ApiRecord;
    endpoint: EndpointRecord;
    score: number;
  } | null = null;

  for (const api of apis) {
    const apiTokens = tokenize(`${api.slug} ${api.name} ${api.category} ${api.shortDescription}`);

    for (const endpoint of api.endpoints) {
      const endpointTokens = tokenize(`${endpoint.method} ${endpoint.path} ${endpoint.description}`);
      let score = tokenOverlapScore(stepTokens, [...apiTokens, ...endpointTokens]);

      if (preferredMethod && endpoint.method.toUpperCase() === preferredMethod) {
        score += 0.12;
      }

      if (!bestMatch || score > bestMatch.score) {
        bestMatch = { api, endpoint, score };
      }
    }
  }

  if (!bestMatch) {
    return {
      id: 'step_1',
      title: 'Fallback API lookup',
      instruction: stepText,
      apiSlug: 'jsonplaceholder',
      apiName: 'JSONPlaceholder',
      method: preferredMethod ?? 'GET',
      path: '/posts/1',
      score: 0,
      rationale: 'No matching endpoint found in the indexed catalog sample; using a safe fallback endpoint.',
      inputSchema: {
        payload: 'object',
      },
    };
  }

  const compactTitle = stepText.length > 72 ? `${stepText.slice(0, 69)}...` : stepText;
  return {
    id: 'step_1',
    title: compactTitle,
    instruction: stepText,
    apiSlug: bestMatch.api.slug,
    apiName: bestMatch.api.name,
    method: bestMatch.endpoint.method.toUpperCase(),
    path: bestMatch.endpoint.path,
    score: Number(bestMatch.score.toFixed(3)),
    rationale: `Matched against ${bestMatch.api.name} endpoint ${bestMatch.endpoint.method.toUpperCase()} ${bestMatch.endpoint.path}.`,
    inputSchema: {
      payload: 'object',
      previousStepOutput: 'unknown',
    },
  };
}

function buildTypescriptCode(result: ComposerResult): string {
  const stepCalls = result.workflow.steps
    .map((step, index) => {
      const previousRef = index === 0 ? 'input' : `step${index}`;
      return `  const step${index + 1} = await callCallio({\n    slug: \"${step.apiSlug}\",\n    method: \"${step.method}\",\n    path: \"${step.path}\",\n    payload: ${previousRef},\n  });\n`;
    })
    .join('\n');

  return `type CallioRequest = {\n  slug: string;\n  method: string;\n  path: string;\n  payload?: unknown;\n};\n\nconst CALLIO_BASE_URL = process.env.CALLIO_BASE_URL ?? \"https://callio.dev\";\nconst CALLIO_API_KEY = process.env.CALLIO_API_KEY ?? \"callio_your_key_here\";\n\nasync function callCallio(request: CallioRequest): Promise<unknown> {\n  const response = await fetch(\`${'${CALLIO_BASE_URL}'}/api/proxy/${'${request.slug}'}${'${request.path}'}\`, {\n    method: request.method,\n    headers: {\n      Authorization: \`Bearer ${'${CALLIO_API_KEY}'}\`,\n      \"Content-Type\": \"application/json\",\n    },\n    body: request.method === \"GET\" ? undefined : JSON.stringify(request.payload ?? {}),\n  });\n\n  if (!response.ok) {\n    const bodyText = await response.text();\n    throw new Error(\`Callio request failed (${ '${response.status}' }): ${'${bodyText}'}\`);\n  }\n\n  return response.json();\n}\n\nexport async function runWorkflow(input: Record<string, unknown>) {\n${stepCalls}\n  return {\n${result.workflow.steps.map((_, index) => `    step${index + 1},`).join('\n')}\n  };\n}\n`;
}

function buildPythonCode(result: ComposerResult): string {
  const stepCalls = result.workflow.steps
    .map((step, index) => {
      const previousRef = index === 0 ? 'input_payload' : `step_${index}`;
      return `    step_${index + 1} = call_callio(\n        slug=\"${step.apiSlug}\",\n        method=\"${step.method}\",\n        path=\"${step.path}\",\n        payload=${previousRef},\n    )\n`;
    })
    .join('\n');

  return `import json\nimport os\nimport requests\n\nCALLIO_BASE_URL = os.getenv(\"CALLIO_BASE_URL\", \"https://callio.dev\")\nCALLIO_API_KEY = os.getenv(\"CALLIO_API_KEY\", \"callio_your_key_here\")\n\n\ndef call_callio(slug: str, method: str, path: str, payload=None):\n    url = f\"{CALLIO_BASE_URL}/api/proxy/{slug}{path}\"\n    headers = {\n        \"Authorization\": f\"Bearer {CALLIO_API_KEY}\",\n        \"Content-Type\": \"application/json\",\n    }\n    data = None if method.upper() == \"GET\" else json.dumps(payload or {})\n    response = requests.request(method=method, url=url, headers=headers, data=data, timeout=30)\n    response.raise_for_status()\n    return response.json()\n\n\ndef run_workflow(input_payload: dict):\n${stepCalls}\n    return {\n${result.workflow.steps.map((_, index) => `        \"step_${index + 1}\": step_${index + 1},`).join('\n')}\n    }\n`;
}

function buildMcpConfig(result: ComposerResult): string {
  const payload = {
    mcpServers: {
      callio: {
        command: 'npx',
        args: ['-y', 'github:hmadhsan/callio-mcp'],
        env: {
          CALLIO_API_KEY: 'callio_your_key_here',
        },
      },
    },
    workflowHints: result.workflow.steps.map((step) => ({
      id: step.id,
      tool: 'call_api',
      slug: step.apiSlug,
      method: step.method,
      path: step.path,
      instruction: step.instruction,
    })),
  };

  return JSON.stringify(payload, null, 2);
}

function buildExecutionPrompt(result: ComposerResult): string {
  const stepLines = result.workflow.steps
    .map((step, index) => `${index + 1}. call_api slug=${step.apiSlug}, method=${step.method}, path=${step.path}`)
    .join('\n');

  return [
    'Execute this workflow in order using Callio MCP tools:',
    stepLines,
    'If a step fails, retry twice with exponential backoff before stopping and returning an error summary.',
  ].join('\n');
}

export async function generateSmartWorkflow({
  prompt,
  language,
}: ComposerRequest): Promise<ComposerResult> {
  const trimmedPrompt = prompt.trim();
  if (!trimmedPrompt) {
    throw new Error('Prompt is required.');
  }

  const catalog = await prisma.api.findMany({
    take: MAX_APIS,
    select: {
      slug: true,
      name: true,
      category: true,
      shortDescription: true,
      endpoints: {
        select: {
          method: true,
          path: true,
          description: true,
        },
      },
    },
    orderBy: {
      featured: 'desc',
    },
  });

  const apis = catalog
    .map((api) => ({
      ...api,
      endpoints: api.endpoints.length > 0 ? api.endpoints : [{ method: 'GET', path: '/', description: 'Default root endpoint' }],
    }))
    .filter((api) => api.endpoints.length > 0);

  if (apis.length === 0) {
    throw new Error('No APIs found in catalog.');
  }

  const rawSteps = splitPromptIntoSteps(trimmedPrompt);
  const steps = rawSteps.map((stepText, index) => {
    const matched = pickBestEndpoint(stepText, apis);
    return {
      ...matched,
      id: `step_${index + 1}`,
      title: `Step ${index + 1}: ${matched.title}`,
    };
  });

  const workflow = {
    name: trimmedPrompt.length > 64 ? `${trimmedPrompt.slice(0, 61)}...` : trimmedPrompt,
    description: `Auto-generated workflow from plain-English intent: "${trimmedPrompt}"`,
    generatedAt: new Date().toISOString(),
    language,
    steps,
  };

  const baseResult: ComposerResult = {
    workflow,
    code: '',
    mcpConfig: '',
    executionPrompt: '',
  };

  baseResult.code = language === 'python' ? buildPythonCode(baseResult) : buildTypescriptCode(baseResult);
  baseResult.mcpConfig = buildMcpConfig(baseResult);
  baseResult.executionPrompt = buildExecutionPrompt(baseResult);

  return baseResult;
}