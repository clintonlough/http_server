import { Request, Response } from "express";
import { createUser } from "../db/queries/users.js";
import { hashPassword } from "../auth.js";

export async function handlerCreateUser(req: Request, res: Response) {
const email = req.body.email;
const password = req.body.password;
const hashedPass = await hashPassword(String(password));
const newUser = await createUser({ email: email, password: hashedPass });

const resBody = {
    id: newUser.id,
    createdAt: newUser.createdAt,
    updatedAt: newUser.updatedAt,
    email: newUser.email,
};

res.status(201).send(resBody);
}