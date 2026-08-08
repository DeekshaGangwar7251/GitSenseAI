import { Router } from "express";

import {
  analyzeRepository,
  chatWithRepository,
  generateRepositoryReport,
} from "../controllers/repository.controller";

const router = Router();

router.post("/analyze", analyzeRepository);

router.post("/chat", chatWithRepository);

router.post(
  "/report",
  generateRepositoryReport
);

export default router;