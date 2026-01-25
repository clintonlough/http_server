import { db } from "../index.js";
import { NewUser, users } from "../schema.js";
import { eq } from "drizzle-orm";

export async function createUser(user: NewUser) {
  const [result] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function deleteUsers() {
  await db.delete(users);
}

export async function getUserByEmail(email: string) {
  const [result] = await db
    .select()
    .from(users)
    .where(eq(users.email, email));
  
    return result;
}

export async function updateCredentials(user: string , email: string, password: string) {
  const [result] = await db.update(users)
  .set({
    email: email,
    password: password,
    updatedAt: new Date()
  })
  .where(eq(users.id,user))
  .returning();

  return result;
}