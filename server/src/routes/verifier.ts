import express from "express";
import * as verifierController from "../controllers/verifier";

const router = express.Router();

router.get("/authdidchallenge", verifierController.authDIDChallenge);

router.post("/verifyvp", verifierController.verifyVP);

export default router;
