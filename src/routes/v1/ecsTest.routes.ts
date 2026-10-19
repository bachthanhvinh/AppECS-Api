import { Router } from "express";

export const ecsTest = Router();

ecsTest.get("/ecsTest", (_req, res) => {
  res.status(200).json({
    sucess: true,
    message: "escTest route is working",
  });
});
