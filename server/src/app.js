import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFoundHandler } from "./middleware/notFound.js";
import apiRoutes from "./routes/index.js";

const app = express();

//  Split the clientUrl env string into an array
const allowedOrigins = env.clientUrl ? env.clientUrl.split(',') : [];

app.use(
  cors({
    // Pass the array here
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(helmet());
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));
app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
