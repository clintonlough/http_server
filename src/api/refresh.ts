import { Request, Response } from "express";
import { getRefreshToken } from "../db/queries/refresh_tokens.js";
import { makeJWT } from "../auth.js";
import { PermissionError } from "../error.js";
import { config } from "../config.js";

export async function handlerRefresh(auth: string, res: Response) {
    if (!auth || !auth.startsWith("Bearer ")) {
        throw new PermissionError("No Refresh Token Provided");
    }
    const tokenFromHeader =  auth.replace(/^Bearer /, "");
    const tokenFromDatabase = await getRefreshToken(tokenFromHeader);

    const expired = check_expired(tokenFromDatabase.expiresAt);
    if (!tokenFromDatabase || tokenFromDatabase.revokedAt || expired) {
        return res.status(401).send("Token invalid");
    }
    const expiresIn = 60*60*1000;
    const accessToken = makeJWT(tokenFromDatabase.userId, expiresIn,config.api.secret);
    return res.status(200).send({ "token": accessToken });
}

function check_expired(expiresAt: Date): Boolean {
    const now = new Date();
    if (expiresAt < now) {
        return true;
    } else {
        return false;
    }
}