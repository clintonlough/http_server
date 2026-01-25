import { describe, it, expect, beforeAll } from "vitest";
import type { Request } from "express";
import { makeJWT, validateJWT, hashPassword, checkPasswordHash, Payload,getBearerToken, getAPIKey } from "../auth.js";

describe("Password Hashing", () => {
  const password1 = "correctPassword123!";
  const password2 = "anotherPassword456!";
  let hash1: string;
  let hash2: string;

  beforeAll(async () => {
    hash1 = await hashPassword(password1);
    hash2 = await hashPassword(password2);
  });

  it("should return true for the correct password", async () => {
    const result = await checkPasswordHash(password1, hash1);
    expect(result).toBe(true);
  });
});

//Valid JWT Verification
describe("JWT", () => {
  const secret = "shhhh"
  let token1: string;

  beforeAll(async () => {
    token1 = makeJWT("12345", 500, secret);

  });

  it("should return true for the correct correct JWT", async () => {
    const result = validateJWT(token1, secret);
    expect(result).toBe("12345");
  });
});

//Wrong Secret for jWT
describe("JWT", () => {
    const secret1 = "shhhh"
    const secret2 = "baaaah"
    let token1: string;

    it("should throw an error for wrong secret", () => {
    const token = makeJWT("12345", 500, secret1);
    
        expect(() => validateJWT(token, secret2)).toThrow();
    });
});

//Expired Token
describe("JWT", () => {
    const secret = "shhhh"
    let token1: string;

    it("should throw an error for expired token", () => {
    const token = makeJWT("12345", -1, secret);
    
        expect(() => validateJWT(token, secret)).toThrow();
    });
});

//Successful GET Bearer Token
describe("GET bearer token", () => {
    
    const mockRequest = {
      headers: {
        'authorization': 'Bearer mytoken123'
      },
      get: function(headerName: string) {
        return this.headers[headerName.toLowerCase()];
      }
    } as Request;

    it("should return bearer token", () => {
    const token = getBearerToken(mockRequest);
    
        expect(token).toBe("mytoken123");
    });
});

//Successful GET API Key
describe("GET API Key", () => {
    
    const mockRequest = {
      headers: {
        'authorization': 'ApiKey apikey123'
      },
      get: function(headerName: string) {
        return this.headers[headerName.toLowerCase()];
      }
    } as Request;

    it("should return api key", () => {
    const token = getAPIKey(mockRequest);
    
        expect(token).toBe("apikey123");
    });
});