import { handle } from "hono/vercel";
import app from "../server/boot";

// Uses the Node.js serverless runtime (not Edge) because the Postgres
// connection (server/queries/connection.ts) needs a raw TCP socket, which
// the Edge runtime doesn't support.
export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
