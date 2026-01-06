import express from "express";
import { Request, Response } from "express";
import { config } from "../config.js";

export type Middleware = (req: Request, res: Response, next: NextFunction) => void;
type NextFunction = () => void;

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
  config.fileServerHits += 1;
  next();
}