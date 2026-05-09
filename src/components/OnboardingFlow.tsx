'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, Check, X, Sparkles } from 'lucide-react';

interface OnboardingFlowProps {
  userId: string;
  hasApiKeys: boolean;
  hasCredentials: boolean;
  onComplete: () => void;
}

export default function OnboardingFlow({ userId, hasApiKeys, hasCredentials, onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState<number>(1);
  const [isOpen, setIsOpen] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [localProgress, setLocalProgress] = useState<Record<number, boolean>>({});

  useEffect(() => {
    // Load progress from localStorage
    const saved = localStorage.getItem(`onboarding_${userId}`);
    if (saved) {
      const progress = JSON.parse(saved);
      setLocalProgress(progress);
      // Auto-advance to next incomplete step
      const nextStep = Object.entries(progress).find(([_, done]) => !done)?.[0];
      if (nextStep) {
        setStep(parseInt(nextStep));
      }
    }

    // Auto-open if user has no keys/credentials and hasn't completed
    if (!hasApiKeys && !hasCredentials && !saved) {
      setIsOpen(true);
    }
  }, [userId, hasApiKeys, hasCredentials]);

  const handleStepComplete = (stepNum: number) => {
    const updated = { ...localProgress, [stepNum]: true };
    setLocalProgress(updated);
    localStorage.setItem(`onboarding_${userId}`, JSON.stringify(updated));

    if (stepNum === 6) {
      setCompleted(true);
      // Mark as complete in DB
      fetch('/api/user/onboarding-complete', { method: 'POST' }).catch(() => {});
      setTimeout(() => {
        setIsOpen(false);
        onComplete();
      }, 2000);
    } else {
      setStep(stepNum + 1);
    }
  };

  const handleSkip = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  const steps = [
    {
      num: 1,
      title: 'Generate Your API Key',
      desc: 'Create a key to authenticate requests. You can manage multiple keys and set rate limits.',
      action: 'Go to Keys tab →',
      component: (
        <div className="space-y-4">
          <p className="text-sm text-[var(--muted)]">
            An API key is how Callio identifies your requests and tracks usage. You can create multiple keys with different rate limits.
          </p>
          <a href="#keys-tab" className="inline-block px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-strong)] transition text-sm font-medium">
            Create Key
          </a>
        </div>
      ),
    },
    {
      num: 2,
      title: 'Save a Provider Key',
      desc: 'Store credentials for an API provider. This lets Callio inject auth on each request.',
      action: 'Go to Browse, pick an API, save your key →',
      component: (
        <div className="space-y-4">
          <p className="text-sm text-[var(--muted)]">
            Most APIs need an authentication key. Save yours in Callio so we can inject it automatically on each request.
          </p>
          <a href="/browse" className="inline-block px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-strong)] transition text-sm font-medium">
            Browse APIs
          </a>
        </div>
      ),
    },
    {
      num: 3,
      title: 'Pick an API',
      desc: 'Choose an API from the catalog to test with.',
      action: 'Pick any API from the Browse page →',
      component: (
        <div className="space-y-4">
          <p className="text-sm text-[var(--muted)]">
            Browse our catalog of 1000+ APIs. Pick one that matches what your agent needs.
          </p>
          <a href="/browse" className="inline-block px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-strong)] transition text-sm font-medium">
            Browse Catalog
          </a>
        </div>
      ),
    },
    {
      num: 4,
      title: 'Execute Your First Request',
      desc: 'Open the playground and make a live API call.',
      action: 'Click "Test" on an API detail page →',
      component: (
        <div className="space-y-4">
          <p className="text-sm text-[var(--muted)]">
            The Playground lets you test any endpoint with real credentials. See requests, responses, latency, everything.
          </p>
          <a href="/browse" className="inline-block px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-strong)] transition text-sm font-medium">
            Open Playground
          </a>
        </div>
      ),
    },
    {
      num: 5,
      title: 'Favorite the API',
      desc: 'Star the API so it shows up in your dashboard.',
      action: 'Click the star icon on an API →',
      component: (
        <div className="space-y-4">
          <p className="text-sm text-[var(--muted)]">
            Mark your favorite APIs so they appear on your dashboard for quick access.
          </p>
          <button
            onClick={() => handleStepComplete(5)}
            className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-strong)] transition text-sm font-medium"
          >
            I've Favorited an API
          </button>
        </div>
      ),
    },
    {
      num: 6,
      title: 'You\'re Ready!',
      desc: 'Your agent now has access to 1000+ APIs with a single key.',
      action: 'Start building →',
      component: (
        <div className="space-y-4 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-sm text-[var(--muted)]">
            Your agent can now call any API in the catalog. Head to MCP to install Callio in Cursor, Claude, or Antigravity.
          </p>
          <a href="/mcp" className="inline-block px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-strong)] transition text-sm font-medium">
            Install MCP
          </a>
        </div>
      ),
    },
  ];

  const currentStep = steps[step - 1];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-[var(--line)] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-[var(--accent)]" />
            <div>
              <h2 className="font-semibold text-[var(--ink)]">Welcome to Callio</h2>
              <p className="text-xs text-[var(--muted)]">Step {step} of 6</p>
            </div>
          </div>
          <button
            onClick={handleSkip}
            className="p-2 hover:bg-[var(--soft)] rounded-lg transition"
          >
            <X className="w-5 h-5 text-[var(--muted)]" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-[var(--soft)]">
          <div
            className="h-full bg-[var(--accent)] transition-all duration-300"
            style={{ width: `${(step / 6) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="px-6 py-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-[var(--ink)] mb-2">{currentStep.title}</h3>
              <p className="text-[var(--muted)]">{currentStep.desc}</p>
            </div>

            {currentStep.component}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[var(--line)] px-6 py-4 flex items-center justify-between bg-[var(--soft)]">
          <button
            onClick={handleSkip}
            className="text-sm text-[var(--muted)] hover:text-[var(--ink)] transition"
          >
            Skip for now
          </button>

          <div className="flex gap-2">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 border border-[var(--line)] rounded-lg hover:bg-[var(--soft)] transition text-sm font-medium"
              >
                Back
              </button>
            )}

            {step < 6 && (
              <button
                onClick={() => handleStepComplete(step)}
                className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-strong)] transition text-sm font-medium flex items-center gap-2"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {step === 6 && !completed && (
              <button
                onClick={() => handleStepComplete(6)}
                className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-strong)] transition text-sm font-medium flex items-center gap-2"
              >
                <Check className="w-4 h-4" /> Complete
              </button>
            )}
          </div>
        </div>

        {/* Step Indicators */}
        <div className="border-t border-[var(--line)] px-6 py-3 bg-white flex gap-1.5 overflow-x-auto">
          {steps.map((s) => (
            <button
              key={s.num}
              onClick={() => setStep(s.num)}
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition ${
                s.num === step
                  ? 'bg-[var(--accent)] text-white'
                  : localProgress[s.num]
                  ? 'bg-green-100 text-green-700'
                  : 'bg-[var(--soft)] text-[var(--muted)]'
              }`}
            >
              {localProgress[s.num] ? <Check className="w-4 h-4" /> : s.num}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
