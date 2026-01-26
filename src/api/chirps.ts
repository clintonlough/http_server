import { Request, Response } from "express";
import { LengthError } from "../error.js";
import { createChirp, getAllChirps, getChirpById, deleteChirp } from "../db/queries/chirps.js";
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
  //Check for optional author id query parameter
    let authorId = "";
    let sort = "asc";
    let authorIdQuery = req.query.authorId;
    let sortQuery = req.query.sort;
    if (typeof authorIdQuery === "string") {
      authorId = authorIdQuery;
    }
    if (typeof sortQuery === "string") {
      sort = sortQuery;
    }

    const allChirps = await getAllChirps();
    let chirpList = [];
    if (authorId) {
      for (const chirp of allChirps) {
        if (chirp.userId === authorId) {
          chirpList.push({
          body: chirp.body,
          createdAt: chirp.createdAt,
          id: chirp.id,
          updatedAt: chirp.updatedAt,
          userId: chirp.userId,
          });
        }
      }
    } else {
      for (const chirp of allChirps) {
          chirpList.push({
          body: chirp.body,
          createdAt: chirp.createdAt,
          id: chirp.id,
          updatedAt: chirp.updatedAt,
          userId: chirp.userId,
          });
      }
    }
    //sort chirpList
    if (sort === "desc") {
      chirpList.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } else {
      chirpList.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    }

    //return result
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

export async function handlerDeleteChirp(req: Request, res: Response) {

  const chirpID = req.params.chirpID;
  const chirp = await getChirpById(chirpID);

  const token = getBearerToken(req);
  const userID = validateJWT(token, config.api.secret);

  if (chirp) {
    if (userID === chirp.userId) {
      await deleteChirp(chirpID);
      return res.status(204).send("Chirp Deleted");
    } else { 
      return res.status(403).send("permission denied");
    }
  } else {
    return res.status(404).send("Chirp not found");
  }
};
