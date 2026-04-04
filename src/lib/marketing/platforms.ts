import { createHmac, randomUUID } from 'crypto';

type PublishResult = {
  externalId?: string;
  externalUrl?: string;
};

function percentEncode(value: string) {
  return encodeURIComponent(value)
    .replace(/[!'()*]/g, (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`);
}

function buildOAuthHeader({
  method,
  url,
  consumerKey,
  consumerSecret,
  token,
  tokenSecret,
}: {
  method: string;
  url: string;
  consumerKey: string;
  consumerSecret: string;
  token: string;
  tokenSecret: string;
}) {
  const oauthParams: Record<string, string> = {
    oauth_consumer_key: consumerKey,
    oauth_nonce: randomUUID().replace(/-/g, ''),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: token,
    oauth_version: '1.0',
  };

  const sortedParams = Object.entries(oauthParams)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${percentEncode(key)}=${percentEncode(value)}`)
    .join('&');

  const signatureBase = [
    method.toUpperCase(),
    percentEncode(url),
    percentEncode(sortedParams),
  ].join('&');

  const signingKey = `${percentEncode(consumerSecret)}&${percentEncode(tokenSecret)}`;
  const signature = createHmac('sha1', signingKey).update(signatureBase).digest('base64');

  return `OAuth ${Object.entries({ ...oauthParams, oauth_signature: signature })
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${percentEncode(key)}="${percentEncode(value)}"`)
    .join(', ')}`;
}

async function publishToX(content: string): Promise<PublishResult> {
  const oauthConsumerKey = process.env.X_CONSUMER_KEY;
  const oauthConsumerSecret = process.env.X_CONSUMER_SECRET;
  const oauthAccessToken = process.env.X_ACCESS_TOKEN;
  const oauthAccessTokenSecret = process.env.X_ACCESS_TOKEN_SECRET;
  const bearerToken = process.env.X_USER_BEARER_TOKEN;
  const endpoint = 'https://api.x.com/2/tweets';

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (oauthConsumerKey && oauthConsumerSecret && oauthAccessToken && oauthAccessTokenSecret) {
    headers.Authorization = buildOAuthHeader({
      method: 'POST',
      url: endpoint,
      consumerKey: oauthConsumerKey,
      consumerSecret: oauthConsumerSecret,
      token: oauthAccessToken,
      tokenSecret: oauthAccessTokenSecret,
    });
  } else if (bearerToken) {
    headers.Authorization = `Bearer ${bearerToken}`;
  } else {
    throw new Error('Missing X credentials. Set OAuth 1.0a keys or X_USER_BEARER_TOKEN.');
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({ text: content }),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload?.detail || payload?.title || 'Failed to publish to X.');
  }

  const id = payload?.data?.id as string | undefined;
  const username = process.env.X_USERNAME;

  return {
    externalId: id,
    externalUrl: id && username ? `https://x.com/${username}/status/${id}` : undefined,
  };
}

export async function publishToPlatform(platform: string, content: string): Promise<PublishResult> {
  if (platform === 'x') {
    return publishToX(content);
  }

  throw new Error(`Unsupported platform: ${platform}`);
}
