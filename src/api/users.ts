import { Request, Response } from "express";
import { createUser, getUserByEmail, updateCredentials } from "../db/queries/users.js";
import { hashPassword, getBearerToken, validateJWT } from "../auth.js";
import { config } from "../config.js";

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

export async function handlerUpdateCredentials(req: Request, res: Response) {
    const token = getBearerToken(req);
    const email = req.body.email;
    const password = req.body.password;

    const user = validateJWT(token, config.api.secret);
    const hashed = await hashPassword(password);

    //write to db
    const userUpdate = await updateCredentials(user, email, password);
    if (userUpdate) {
        const resBody = {
            id: userUpdate.id,
            createdAt: userUpdate.createdAt,
            updatedAt: userUpdate.updatedAt,
            email: userUpdate.email,
        };
        res.status(200).send(resBody);
        return res;
    } else {
        res.status(401).send("An error has occured");
        return res;
    };
};