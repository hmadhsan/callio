'use client';

import { useState } from 'react';
import OnboardingFlow from './OnboardingFlow';

interface OnboardingFlowWrapperProps {
  userId: string;
  hasApiKeys: boolean;
  hasCredentials: boolean;
  onboardingCompleted: boolean;
}

export default function OnboardingFlowWrapper({
  userId,
  hasApiKeys,
  hasCredentials,
  onboardingCompleted,
}: OnboardingFlowWrapperProps) {
  const [completed, setCompleted] = useState(onboardingCompleted);

  // Only show onboarding if user hasn't completed it and has no API keys
  const shouldShowOnboarding = !completed && !hasApiKeys;

  if (!shouldShowOnboarding) return null;

  return (
    <OnboardingFlow
      userId={userId}
      hasApiKeys={hasApiKeys}
      hasCredentials={hasCredentials}
      onComplete={() => setCompleted(true)}
    />
  );
}
