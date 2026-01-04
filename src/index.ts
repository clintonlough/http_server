import express from "express";
import { Request, Response } from "express";

type Middleware = (req: Request, res: Response, next: NextFunction) => void;
type NextFunction = () => void;

const app = express();
const PORT = 8080;

app.use("/app", express.static("./src/app"));

app.get("/healthz", handlerReadiness);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

app.use(middlewareLogResponses)

function handlerReadiness(req: Request, res: Response) {

    const body = "OK"

    res.set('Content-Type', 'text/plain; charset=utf-8');
    res.send(body);
}

function middlewareLogResponses (req: Request, res: Response, next: NextFunction) {
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