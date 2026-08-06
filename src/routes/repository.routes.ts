import { Router } from "express";
import { analyzeRepository } from "../controllers/repository.controller";
import { chatWithRepository} from "../controllers/repository.controller";
const router = Router();

router.post("/analyze", analyzeRepository);
router.post("/chat", chatWithRepository);

export default router;