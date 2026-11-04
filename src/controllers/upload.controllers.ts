import { Request, Response } from "express";
import { env } from "../config/env";
import cloudinary from "../providers/cloudinary";

export const generateSignature = (_req: Request, res: Response) => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const folder = "ecs-uploads"; 

  const paramsToSign = {
    timestamp,
    folder,
  };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    env.cloudinaryApiSecret as string,
  );

  res.json({
    timestamp,
    signature,
    apiKey: env.cloudinaryApiKey,
    cloudName: env.cloudinaryCloudName,
    folder,
  });
};
