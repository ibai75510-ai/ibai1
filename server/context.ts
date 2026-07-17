import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { User } from "@db/schema";
import { verifySessionToken } from "./lib/jwt";
import { findUserById } from "./queries/users";

export type TrpcContext = {
  req: Request;
  resHeaders: Headers;
  user?: User;
};

export async function createContext(
  opts: FetchCreateContextFnOptions,
): Promise<TrpcContext> {
  const ctx: TrpcContext = { req: opts.req, resHeaders: opts.resHeaders };
  const token = opts.req.headers.get("x-local-auth-token");
  if (token) {
    const claim = verifySessionToken(token);
    if (claim) {
      ctx.user = await findUserById(claim.userId);
    }
  }
  return ctx;
}
