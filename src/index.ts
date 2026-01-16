import express from "express";
import { middlewareLogResponse, middlewareMetricsInc } from "./api/middleware.js";
import { handlerReadiness } from "./api/readiness.js";
import { handlerMetrics } from "./api/metrics.js";
import { handlerReset } from "./api/reset.js";
import { handlerCreateUser } from "./api/users.js";
import { handlerCreateChirp, handlerGetAllChirps, handlerGetChirp } from "./api/chirps.js";
import { handlerLogin } from "./api/login.js";
import { MiddlewareErrorHandler } from "./api/middleware.js";

const app = express();
const PORT = 8080;

//Sets global logging of all events
app.use(middlewareLogResponse)

// Increments hits for statis files served
app.use("/app", middlewareMetricsInc, express.static("./src/app"));

// Built-in JSON body parsing middleware
app.use(express.json());

// API Endpoints
//Check Server status
app.get("/api/healthz", handlerReadiness);
//Create a user
app.post("/api/users", async (req, res, next) => {
  try {
    await handlerCreateUser(req, res);
  } catch (err) {
    next(err); // Pass the error to Express
  }
});
//Get all Chirps
app.get("/api/chirps", async (req, res, next) => {
  try {
    await handlerGetAllChirps(req, res);
  } catch (err) {
    next(err); // Pass the error to Express
  }
});
//get a specific chirp by id
app.get("/api/chirps/:chirpID", async (req, res, next) => {
  try {
    await handlerGetChirp(req, res);
  } catch (err) {
    next(err); // Pass the error to Express
  }
});
//Create a chirp
app.post("/api/chirps", async (req, res, next) => {
  try {
    await handlerCreateChirp(req, res);
  } catch (err) {
    next(err); // Pass the error to Express
  }
});
//logs in a user
app.post("/api/login", async (req, res, next) => {
  try {
    await handlerLogin(req, res);
  } catch (err) {
    next(err); // Pass the error to Express
  }
});

// Admin Endpoints
//Reset all users, chirps and server hits
app.post("/admin/reset", async (req, res, next) => {
  try {
    await handlerReset(req, res);
  } catch (err) {
    next(err); // Pass the error to Express
  }
});
//get data about the server
app.get('/admin/metrics', handlerMetrics);

app.use(MiddlewareErrorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}/app`);
});







