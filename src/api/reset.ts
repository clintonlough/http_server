import { Request, Response } from "express";
import { config } from "../config.js";
import { deleteUsers } from "../db/queries/users.js";
import { ForbiddenError } from "../error.js";

export async function handlerReset(req: Request, res: Response) {
  if (config.api.platform === "dev") {

    //Reset Server Hits
    config.api.fileServerHits = 0;

    //Reset User Database
    const result = await deleteUsers();
    res.status(200).json({ status: "successful reset" });
  } else {
    throw new ForbiddenError("Forbidden");
  }

}