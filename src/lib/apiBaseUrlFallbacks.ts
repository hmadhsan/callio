const API_BASE_URL_FALLBACKS: Record<string, string> = {
  'y-combinator-hn': 'https://hacker-news.firebaseio.com/v0',
};

export function getApiBaseUrlFallback(apiSlug: string): string | null {
  return API_BASE_URL_FALLBACKS[apiSlug] || null;
}
