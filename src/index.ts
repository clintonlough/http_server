import express from "express";
import { middlewareLogResponse, middlewareMetricsInc } from "./api/middleware.js";
import { handlerReadiness } from "./api/readiness.js";
import { handlerMetrics } from "./api/metrics.js";
import { handlerReset } from "./api/reset.js";
import { handlerValidateChirp } from "./api/validate_chirp.js";
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
app.get("/api/healthz", handlerReadiness);

// Admin Endpoints
app.post('/admin/reset', handlerReset);
app.get('/admin/metrics', handlerMetrics);
//app.post('/api/validate_chirp', handlerValidateChirp);
app.post("/api/validate_chirp", async (req, res, next) => {
  try {
    await handlerValidateChirp(req, res);
  } catch (err) {
    next(err); // Pass the error to Express
  }
});

app.use(MiddlewareErrorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}/app`);
});







