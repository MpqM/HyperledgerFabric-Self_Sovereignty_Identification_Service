import express from "express";
import * as issuerController from "../controllers/issuer";
import { requiresAuth } from "../middlewares/require-auth";

const router = express.Router();

router.get("/getauth", requiresAuth, issuerController.getAuth);

router.post("/register", issuerController.register);

router.post("/login", issuerController.login);

router.post("/logout", requiresAuth, issuerController.logout);

router.post("/createiuniv", requiresAuth, issuerController.createIUniv);

router.post("/createiiden", requiresAuth, issuerController.createIIden);

router.get("/getiunivs", requiresAuth, issuerController.getIUnivs);

router.get("/getiidens", requiresAuth, issuerController.getIIdens);

router.get("/authdidchallenge", issuerController.authDIDChallenge);

router.post("/authdidresponse", issuerController.authDIDResponse);

router.post("/issuevc", requiresAuth, issuerController.issueVC);

export default router;
