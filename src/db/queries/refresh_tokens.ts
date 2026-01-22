import { db } from "../index.js";
import { NewRefreshToken, refresh_tokens } from "../schema.js";
import { eq, notBetween, sql } from "drizzle-orm";

export async function createRefreshToken(userId: string, token: string, expiresAt: Date) {
    const [result] = await db.insert(refresh_tokens).values({
    token,
    userId,
    expiresAt,
    revokedAt: null,
    })
    .onConflictDoNothing()
    .returning();
  return result;
};

export async function getRefreshToken(token: string){
    const [result] = await db.select()
    .from(refresh_tokens)
    .where(eq(refresh_tokens.token, token));

    return result;
};

export async function revokeToken(token: string): Promise<Boolean> {
const [result] = await db
  .update(refresh_tokens)
  .set({
    revokedAt: new Date(),
    updatedAt: new Date(),
  })
  .where(eq(refresh_tokens.token, token))
  .returning();

  if (result) {
    return true;
  } else {
    return false;
  }
};