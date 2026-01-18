import { Request, Response } from "express";
import { LengthError } from "../error.js";
import { createChirp, getAllChirps, getChirpById } from "../db/queries/chirps.js";
import { getBearerToken, validateJWT } from "../auth.js";
import { config } from "../config.js";

export async function handlerCreateChirp(req: Request, res: Response) {
  const chirpContent = req.body.body;
  const token = getBearerToken(req);
  const validUser = validateJWT(token,config.api.secret);

  if (validUser) {
    if (chirpContent.length > 140) {
      throw new LengthError("Tweet too long");
    } else {
      const cleanedBody = filterProfanity(chirpContent);
      //write chirp to the database
      const result = await createChirp({body: cleanedBody, userId: validUser});
      const resBody = {
          body: result.body,
          createdAt: result.createdAt,
          id: result.id,
          updatedAt: result.updatedAt,
          userId: result.userId,
      };

      res.status(201).send(resBody);
    }
  }
}

function filterProfanity(body: string) {
  const profanity = new Set(["kerfuffle", "sharbert", "fornax"]);
  const bodyArray = body.split(" ");

  const replaced: string[] = bodyArray.map(word =>
    profanity.has(word.toLowerCase()) ? "****" : word
  );

  return replaced.join(" ");

}

export async function handlerGetAllChirps(req: Request, res: Response) {
    const allChirps = await getAllChirps();
    let chirpList = [];
    for (const chirp of allChirps) {
        chirpList.push({
        body: chirp.body,
        createdAt: chirp.createdAt,
        id: chirp.id,
        updatedAt: chirp.updatedAt,
        userId: chirp.userId,
    });
    }
    res.status(200).send(chirpList);
};

export async function handlerGetChirp(req: Request, res: Response) {
    const id = req.params.chirpID;
    const chirp = await getChirpById(id);
    if (chirp) {
        const resBody = {
            body: chirp.body,
            createdAt: chirp.createdAt,
            id: chirp.id,
            updatedAt: chirp.updatedAt,
            userId: chirp.userId,
        };
        res.status(200).send(resBody);
    } else {
        res.status(404).send("chirp not found");
    }
};