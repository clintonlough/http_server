import express from "express";
import { middlewareLogResponse, middlewareMetricsInc } from "./api/middleware.js";
import { handlerReadiness } from "./api/readiness.js";
import { handlerMetrics } from "./api/metrics.js";
import { handlerReset } from "./api/reset.js";

const app = express();
const PORT = 8080;

//Sets global logging of all events
app.use(middlewareLogResponse)

// Increments hits for statis files served
app.use("/app", middlewareMetricsInc, express.static("./src/app"));

// Regular routes
app.get("/healthz", handlerReadiness);
app.get('/metrics', handlerMetrics);
app.get('/reset', handlerReset);




app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});







