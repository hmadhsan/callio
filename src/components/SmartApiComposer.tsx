'use client';

import { useMemo, useState } from 'react';
import { Check, ClipboardCopy, Loader2, Sparkles, Wand2 } from 'lucide-react';

type Language = 'typescript' | 'python';
type TabKey = 'workflow' | 'code' | 'mcp' | 'prompt';

interface ComposerStep {
  id: string;
  title: string;
  instruction: string;
  apiSlug: string;
  apiName: string;
  method: string;
  path: string;
  score: number;
  rationale: string;
}

interface ComposerResponse {
  workflow: {
    name: string;
    description: string;
    generatedAt: string;
    language: Language;
    steps: ComposerStep[];
  };
  code: string;
  mcpConfig: string;
  executionPrompt: string;
}

const EXAMPLES = [
  'When a new Stripe payment succeeds, enrich the customer in Clearbit, then send a Slack summary.',
  'Search for top fintech news, summarize key points, then post digest to Discord.',
  'Create a support ticket from inbound email, classify priority, then sync into Notion.',
];

const TAB_LABELS: Record<TabKey, string> = {
  workflow: 'Workflow JSON',
  code: 'Runnable Code',
  mcp: 'MCP Config',
  prompt: 'Execution Prompt',
};

function PrettyCode({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-2xl bg-[#0f172a] p-4 text-xs leading-relaxed text-[#e2e8f0] border border-[#1e293b]">
      {code}
    </pre>
  );
}

export default function SmartApiComposer() {
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState<Language>('typescript');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedTab, setCopiedTab] = useState<TabKey | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>('workflow');
  const [result, setResult] = useState<ComposerResponse | null>(null);
  const [runResults, setRunResults] = useState<unknown[] | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const tabContent = useMemo(() => {
    if (!result) {
      return '';
    }

    if (activeTab === 'workflow') {
      return JSON.stringify(result.workflow, null, 2);
    }

    if (activeTab === 'code') {
      return result.code;
    }

    if (activeTab === 'mcp') {
      return result.mcpConfig;
    }

    return result.executionPrompt;
  }, [activeTab, result]);

  async function onGenerate() {
    setLoading(true);
    setError(null);
    setCopiedTab(null);

    try {
      const response = await fetch('/api/composer/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          language,
        }),
      });

      const data = (await response.json()) as ComposerResponse | { error: string };
      if (!response.ok) {
        setError('error' in data ? data.error : 'Could not generate workflow.');
        setResult(null);
        return;
      }

      setResult(data as ComposerResponse);
    } catch {
      setError('Network error while generating workflow.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  async function copyCurrentTab() {
    if (!result) {
      return;
    }

    await navigator.clipboard.writeText(tabContent);
    setCopiedTab(activeTab);
    setTimeout(() => setCopiedTab(null), 1500);
  }

  async function onRun() {
    if (!result) return;
    setRunResults(null);
    setSaveStatus(null);

    try {
      const res = await fetch('/api/composer/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workflow: result.workflow, input: {} }),
      });

      const data = await res.json();
      if (!res.ok) {
        setRunResults([{ error: data.error || 'Run failed' }]);
        return;
      }

      setRunResults(data.results ?? null);
      setActiveTab('prompt');
    } catch {
      setRunResults([{ error: 'Network error running workflow' }]);
    }
  }

  async function onSave() {
    if (!result) return;
    setSaveStatus(null);

    // require a workspace id for now
    const workspaceId = window.prompt('Enter workspaceId to save workflow into:');
    if (!workspaceId) {
      setSaveStatus('Save cancelled (workspaceId required).');
      return;
    }

    try {
      const res = await fetch('/api/composer/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workflow: result.workflow, workspaceId, name: result.workflow.name, description: result.workflow.description }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSaveStatus(data.error || 'Save failed');
        return;
      }
      setSaveStatus(`Saved (id: ${data.id})`);
    } catch {
      setSaveStatus('Network error while saving.');
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="rounded-3xl border border-[var(--line)] bg-white p-5 sm:p-7 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#bfdbfe] bg-[#eff6ff] px-3 py-1 text-xs font-semibold text-[#1d4ed8]">
          <Sparkles className="h-3.5 w-3.5" />
          Smart API Composer
        </div>
        <h2 className="mt-4 text-2xl font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
          Describe your workflow. Get production-ready outputs in one click.
        </h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          We translate plain English into a step-by-step workflow graph, runnable code, and MCP configuration hints.
        </p>

        <label className="mt-5 block text-sm font-medium text-[var(--ink)]" htmlFor="composer-prompt">
          Workflow intent
        </label>
        <textarea
          id="composer-prompt"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder="Example: When a lead is created, enrich with Apollo, then push to HubSpot and notify Slack."
          className="mt-2 min-h-40 w-full rounded-2xl border border-[var(--line)] bg-[#f8fafc] px-4 py-3 text-sm outline-none transition focus:border-[#60a5fa] focus:ring-2 focus:ring-[#bfdbfe]"
        />

        <div className="mt-4 flex flex-wrap gap-2">
          {EXAMPLES.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => setPrompt(example)}
              className="rounded-full border border-[var(--line)] bg-white px-3 py-1.5 text-xs text-[var(--muted)] transition hover:border-[#93c5fd] hover:text-[#1e3a8a]"
            >
              {example}
            </button>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex rounded-xl border border-[var(--line)] bg-[#f8fafc] p-1">
            {(['typescript', 'python'] as const).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setLanguage(lang)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  language === lang
                    ? 'bg-[#0f172a] text-white shadow-sm'
                    : 'text-[var(--muted)] hover:text-[var(--ink)]'
                }`}
              >
                {lang === 'typescript' ? 'TypeScript' : 'Python'}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onGenerate}
            disabled={loading || !prompt.trim()}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
            {loading ? 'Composing...' : 'Compose Workflow'}
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-6 space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Generated flow</h3>
            {result.workflow.steps.map((step, index) => (
              <article key={step.id} className="rounded-2xl border border-[var(--line)] bg-white p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-[var(--ink)]">
                    {index + 1}. {step.title}
                  </p>
                  <span className="rounded-full bg-[#eff6ff] px-2.5 py-1 text-[11px] font-medium text-[#1d4ed8]">
                    score {step.score.toFixed(3)}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-md bg-[#0f172a] px-2 py-1 font-semibold text-white">{step.method}</span>
                  <span className="rounded-md border border-[var(--line)] bg-[#f8fafc] px-2 py-1 text-[var(--muted)]">{step.apiSlug}</span>
                  <span className="rounded-md border border-[var(--line)] bg-[#f8fafc] px-2 py-1 text-[var(--muted)]">{step.path}</span>
                </div>
                <p className="mt-2 text-xs text-[var(--muted)]">{step.rationale}</p>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-[var(--line)] bg-[linear-gradient(145deg,#f8fafc_0%,#ffffff_55%,#f1f5f9_100%)] p-5 sm:p-7">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
            Generated Artifacts
          </h3>
          <div className="flex items-center gap-2">
            <button
            type="button"
            onClick={copyCurrentTab}
            disabled={!result}
            className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--muted)] transition hover:text-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {copiedTab === activeTab ? <Check className="h-3.5 w-3.5 text-green-600" /> : <ClipboardCopy className="h-3.5 w-3.5" />}
            {copiedTab === activeTab ? 'Copied' : 'Copy'}
          </button>
            <button
              type="button"
              onClick={onRun}
              disabled={!result}
              className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent)] px-3 py-1.5 text-xs font-medium text-white transition hover:bg-[var(--accent-strong)] disabled:opacity-50"
            >
              Run
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={!result}
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--muted)] transition hover:text-[var(--ink)] disabled:opacity-40"
            >
              Save
            </button>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {(Object.keys(TAB_LABELS) as TabKey[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                activeTab === key
                  ? 'bg-[#0f172a] text-white'
                  : 'border border-[var(--line)] bg-white text-[var(--muted)] hover:text-[var(--ink)]'
              }`}
            >
              {TAB_LABELS[key]}
            </button>
          ))}
        </div>

        {result ? (
          <PrettyCode code={tabContent} />
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--line)] bg-white p-8 text-center text-sm text-[var(--muted)]">
            Your generated workflow artifacts will appear here.
          </div>
        )}
        {runResults && (
          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-semibold">Run results</h4>
            {runResults.map((r, i) => (
              <pre key={i} className="rounded-lg border border-[var(--line)] bg-white p-3 text-xs">{JSON.stringify(r, null, 2)}</pre>
            ))}
          </div>
        )}

        {saveStatus && (
          <div className="mt-4 rounded-lg border border-[var(--line)] bg-white p-3 text-sm">{saveStatus}</div>
        )}
      </section>
    </div>
  );
}