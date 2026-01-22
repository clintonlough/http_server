import { Request, Response } from "express";
import { PermissionError } from "../error.js";
import { revokeToken } from "../db/queries/refresh_tokens.js";

export async function handlerRevoke(auth: string, res: Response) {
    if (!auth || !auth.startsWith("Bearer ")) {
        throw new PermissionError("No Refresh Token Provided");
    }
    const tokenFromHeader =  auth.replace(/^Bearer /, "");
    const revoked = await revokeToken(tokenFromHeader);
    if (revoked) {
        res.status(204).send();
    } else {
        res.status(401).send();
    }

}