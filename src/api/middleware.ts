import express from "express";
import { Request, Response } from "express";
import { config } from "../config.js";
import { LengthError, PermissionError, ForbiddenError,NotFoundError } from "../error.js";

export type Middleware = (req: Request, res: Response, next: NextFunction) => void;
export type NextFunction = () => void;

export function middlewareLogResponse (req: Request, res: Response, next: NextFunction) {
  res.on("finish", () => {
  if (res.statusCode != 200) {
    const method = req.method;
    const url = req.url;
    const status = res.statusCode;
    console.log(`[NON-OK] ${method} ${url} - Status: ${status}`);
  }
});
  next();
}

export function middlewareMetricsInc(req: Request, res: Response, next: NextFunction) {
  config.api.fileServerHits += 1;
  next();
}

export function MiddlewareErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof LengthError) {
    res.status(400).send({ "error": "Chirp is too long. Max length is 140" });
  } else if (err instanceof PermissionError) {
    res.status(401).send({ "error": "Permission Error"});
  } else if (err instanceof ForbiddenError) {
    res.status(403).send({ "error": "Error: Forbidden"});
  } else if (err instanceof NotFoundError) {
    res.status(404).send({ "error": "Error: Not Found"});
  } else {
    res.status(500).send({ "error": "Internal Server Error"});
  }
}