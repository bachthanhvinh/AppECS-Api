import express from "express";
import cors from "cors";
import { env } from "./config/env";
import { notFound } from "./middlewares/notFound";
import { logger } from "./providers/logger";
import { API_V1 } from "./routes/v1";
import { corsOptions } from "./config/cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cookieParser());

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/v1", API_V1);

app.use(notFound);

app.listen(env.port, () => {
  logger.info(`Server is now running on port http://localhost:${env.port}`);
});
