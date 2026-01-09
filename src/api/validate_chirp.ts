import { Request, Response } from "express";

export async function handlerValidateChirp(req: Request, res: Response) {
  const chirpBody = req.body.body; // Access the "body" field from the parsed JSON
    
  if (chirpBody.length > 140) {
    // res.status(400).send({ error: "Chirp is too long" });
    throw new Error ();
  } else {
    const cleanedBody = filterProfanity(req.body.body);
    res.status(200).send({ "cleanedBody": cleanedBody });
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