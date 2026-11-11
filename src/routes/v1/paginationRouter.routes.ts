import express from "express";
import { paginationController } from "../../controllers/pagination.controller";
const router = express.Router();

router.route("/").get(paginationController.pagination);

export const paginationRouter = router;
