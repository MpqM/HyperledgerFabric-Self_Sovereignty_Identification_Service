import express from "express";
import * as holderController from "../controllers/holder";

const router = express.Router();

router.post("/authdidsignature", holderController.authDIDSignature);

router.post("/issuevp", holderController.issueVP);

export default router;
