import { Request, Response } from "express";
import { getUserByEmail } from "../db/queries/users.js";
import { hashPassword, checkPasswordHash, makeJWT,  } from "../auth.js";
import { PermissionError } from "../error.js";
import { config } from "../config.js";

export async function handlerLogin(req: Request, res: Response) {

    const email = req.body.email;
    const password = req.body.password;
    let expiresInSeconds = req.body.expiresInSeconds ?? 3600;
    if (expiresInSeconds > 3600) {
        expiresInSeconds = 3600;
    };
    try {
        const user = await getUserByEmail(email);
        const verified = await checkPasswordHash(password, user.password);
        if (verified === true) {
            const token = makeJWT(user.id, expiresInSeconds,config.api.secret);
            const resBody = {
                id: user.id,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                email: user.email,
                token: token,
            };
            res.status(200).send(resBody);
        } else {
            throw new PermissionError("Incorrect email or password");
        }

    } catch (err) {
        throw new PermissionError("Incorrect email or password");
    }
}