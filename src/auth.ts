import * as argon2 from "argon2";
import { PermissionError } from "./error.js";
import jwt, {JwtPayload} from "jsonwebtoken";

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
    const expiry = currentTime + expiresIn;

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