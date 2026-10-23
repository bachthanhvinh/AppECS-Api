// src/config/cors.ts
import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/apiError";
import { WHITELIST_DOMAINS } from "../utils/constants";
import { env } from "./env";

export const corsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) {
    if (env.nodeEnv === "development") {
      return callback(null, true);
    }

    if (!origin) {
      return callback(null, true);
    }

    if (WHITELIST_DOMAINS.includes(origin)) {
      return callback(null, true);
    }

    return callback(
      new ApiError(
        StatusCodes.FORBIDDEN,
        `${origin} not allowed by our CORS Policy.`,
      ),
    );
  },

  optionsSuccessStatus: 200,
  credentials: true,
};
