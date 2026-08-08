import { Router } from "express";

import {
  analyzeRepository,
  chatWithRepository,
  generateRepositoryReport,
  getRepositoryFileTree,
  getRepositoryFile,
} from "../controllers/repository.controller";


const router = Router();


router.post(
  "/analyze",
  analyzeRepository
);


router.post(
  "/chat",
  chatWithRepository
);


router.post(
  "/report",
  generateRepositoryReport
);


router.get(
  "/files",
  getRepositoryFileTree
);


router.get(
  "/file",
  getRepositoryFile
);


export default router;