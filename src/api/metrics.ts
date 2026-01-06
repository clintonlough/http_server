import { Request, Response } from "express";
import { config } from "../config.js";

export function handlerMetrics(req: Request, res: Response) {
  res.send(`Hits: ${config.fileServerHits}`);
}