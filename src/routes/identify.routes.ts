import { Router } from "express";
import { identifyContact } from "../controllers/identify.controller";

const router = Router();

router.post("/identify", identifyContact);

export default router;