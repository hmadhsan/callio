# Marketing Pipeline

This project now includes a lightweight daily social posting pipeline for Callio.

## What it does

- Stores scheduled posts in the database
- Generates a 30-day queue of founder-led posts for X
- Publishes posts manually from an admin route
- Publishes due posts automatically from a daily cron route

## Files

- `prisma/schema.prisma`
- `src/lib/marketing/templates.ts`
- `src/lib/marketing/platforms.ts`
- `src/lib/marketing/pipeline.ts`
- `src/app/api/marketing/posts/route.ts`
- `src/app/api/marketing/publish/route.ts`
- `src/app/api/cron/marketing-daily/route.ts`
- `vercel.json`

## Required environment variables

Set these before using the pipeline:

### Shared

- `CRON_SECRET`
- `MARKETING_CRON_SECRET` (optional if you want a separate secret outside Vercel)

### X

Use either OAuth 1.0a user credentials or an OAuth 2 user bearer token.

- `X_CONSUMER_KEY`
- `X_CONSUMER_SECRET`
- `X_ACCESS_TOKEN`
- `X_ACCESS_TOKEN_SECRET`
- `X_USER_BEARER_TOKEN` (optional alternative)
- `X_USERNAME`

## Recommended setup order

1. Run the Prisma migration in the environment you want to use.
2. Set the social platform credentials in your environment.
3. Generate the post queue.
4. Test publishing one post manually.
5. Let the Vercel cron publish daily.

## Generate posts

Send a `POST` request to:

`/api/marketing/posts`

Example body:

```json
{
  "days": 30,
  "platforms": ["x"],
  "overwrite": false
}
```

This route is admin-only and uses the existing `isAdmin()` email check.

## List queued posts

Send a `GET` request to:

`/api/marketing/posts`

## Publish one post manually

Send a `POST` request to:

`/api/marketing/publish`

Optional body:

```json
{
  "id": "marketing_post_id"
}
```

If no `id` is provided, the earliest scheduled or failed post is published.

## Daily cron

The cron route is:

`/api/cron/marketing-daily`

`vercel.json` schedules it once per day at `08:00 UTC`.

To call it manually, send:

```http
GET /api/cron/marketing-daily
Authorization: Bearer <CRON_SECRET or MARKETING_CRON_SECRET>
```

## Notes

- The initial content generator uses curated templates, not an LLM.
- X URLs are built when `X_USERNAME` is set.
- Failed posts are marked as `FAILED` and can be retried through the manual publish route.
