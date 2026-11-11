import express from "express";
import { generateSignature } from "../../controllers/upload.controller";

export const router = express.Router();

router.route("/signature").get(generateSignature);

export const uploadRouter = router;
