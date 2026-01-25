import * as argon2 from "argon2";
import express from "express";
import type { Request } from "express";
import { PermissionError } from "./error.js";
import jwt, {JwtPayload} from "jsonwebtoken";
import crypto from "crypto";
import { createRefreshToken } from "./db/queries/refresh_tokens.js";

//Password functions - may end up defunct?

export async function hashPassword(password: string): Promise<string> {
    try {
        const hash = await argon2.hash(password);
        return hash;
    } catch (err) {
        throw new Error("An error has occured");
    }
}

export async function checkPasswordHash(password: string, hash: string): Promise<boolean> {
    try {
        if (await argon2.verify(hash, password)) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        throw new Error("An error has occured");
    }
}

// API Key Functions

export type Payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export function makeJWT(userID: string, expiresIn: number, secret: string): string {

    const currentTime = Math.floor(Date.now() / 1000);
    const expiry = currentTime + expiresIn; //expiresIn in ms

    const payload: Payload = {
        iss: "chirpy",
        sub: userID,
        iat: currentTime,
        exp: expiry,
    };

    const token = jwt.sign(payload, secret);
    return token;
}

export function validateJWT(tokenString: string, secret: string): string {
    try {
        const verified = jwt.verify(tokenString, secret);
        const userID = verified.sub;
        return String(userID);
    } catch (err) {
        throw new PermissionError("Invalid Token");
    }
}

export function getBearerToken(req: Request): string {
    try {
        const header = String(req.get("Authorization"));
        const stripped = header.replace(/^Bearer /, "");
        return stripped;
    } catch (err) {
        throw new PermissionError("Invalid Authorization");
    }
}

export async function makeRefreshToken(userID: string): Promise<string> {
    const buf = crypto.randomBytes(32);
    const token = buf.toString('hex');
    const expiryDate = new Date(Date.now() + (60 * 24 * 60 * 60 * 1000));
    const newToken = await createRefreshToken(userID, token, expiryDate);
    return newToken.token;
}

export function getAPIKey(req: Request): string {
    try {
        const header = String(req.get("Authorization"));
        const stripped = header.replace(/^ApiKey /, "");
        return stripped;
    } catch (err) {
        throw new PermissionError("Invalid Authorization");
    }
}