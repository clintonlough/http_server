import { Request, Response } from "express";
import { createUser, getUserByEmail, updateCredentials, updateMembership } from "../db/queries/users.js";
import { hashPassword, getBearerToken, validateJWT, getAPIKey } from "../auth.js";
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
        isChirpyRed: newUser.isChirpyRed
    };

    res.status(201).send(resBody);
};

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
            isChirpyRed: userUpdate.isChirpyRed
        };
        res.status(200).send(resBody);
        return res;
    } else {
        res.status(401).send("An error has occured");
        return res;
    };
};

export async function handlerUpdateMembership(req: Request, res: Response){
    //validate webhook
    const event = req.body.event;
    const userID = req.body.data.userId;
    const apiKey = getAPIKey(req);
    if (apiKey === config.api.polkaKey) {
        if (event === "user.upgraded"){
            const result = await updateMembership(userID);
            if (result) {
                if (result.isChirpyRed === true) {
                    return res.status(204).send({});
                } 
            } else {
                return res.status(404).send("User not found");
            };
        } else {
            return res.status(204).send("Incorrect event");
        };
    } else {
        return res.status(401).send("Permission Denied");
    }


}