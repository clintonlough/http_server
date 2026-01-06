import { Request, Response } from "express";

export function handlerReadiness(req: Request, res: Response) {

    const body = "OK"

    res.set('Content-Type', 'text/plain; charset=utf-8');
    res.send(body);
}