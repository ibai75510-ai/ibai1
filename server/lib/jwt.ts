import jwt from "jsonwebtoken";
import { env } from "./env";

export type SessionPayload = {
  userId: number;
  username: string;
};

export function signSessionToken(payload: SessionPayload): string {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: "30d" });
}

export function verifySessionToken(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, env.jwtSecret) as SessionPayload;
  } catch {
    return null;
  }
}
