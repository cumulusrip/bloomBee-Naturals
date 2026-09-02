import type { IncomingMessage, ServerResponse } from 'http';
import { createApiApp } from '../src/api/createApiApp';

/**
 * Vercel serverless function entry point.
 * All requests to /api/* are routed here (see vercel.json).
 * createApiApp() caches the Express app + DB connection across warm
 * invocations, so this stays fast after the first cold start.
 */
export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const app = await createApiApp();
  return (app as any)(req, res);
}
