import { Request, Response } from "express";
import { getUserByEmail } from "../db/queries/users.js";
import { hashPassword, checkPasswordHash } from "../auth.js";
import { PermissionError } from "../error.js";

export async function handlerLogin(req: Request, res: Response) {

    const email = req.body.email;
    const password = req.body.password;
    try {
        const user = await getUserByEmail(email);
        const verified = await checkPasswordHash(password, user.password);
        if (verified === true) {
            const resBody = {
                id: user.id,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                email: user.email,
            };
            res.status(200).send(resBody);
        } else {
            throw new PermissionError("Incorrect email or password");
        }

    } catch (err) {
        throw new PermissionError("Incorrect email or password");
    }
}