import express from "express";
import * as ssiController from "../controllers/ssi";

const router = express.Router();

router.post("/createdid", ssiController.createDID);

router.patch("/updatedid/:id", ssiController.updateDID);

router.delete("/deletedid/:id", ssiController.deleteDID);

router.get("/getdid/:id", ssiController.getDID);

router.post("/issuedid", ssiController.issueDID);

router.get("/authdidchallenge", ssiController.authDIDChallenge);

router.post("/authdidresponse", ssiController.authDIDResponse);

export default router;
