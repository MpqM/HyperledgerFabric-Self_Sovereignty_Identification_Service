import { RequestHandler } from "express";
import { serializeDIDJsonId } from "../ssi/did-helper";
import * as contractOperation from "../ssi/did-operation";
import { generateIIdenVCMessage, generateIUnivVCMessage, generateVPmessage } from "../ssi/vcvp-helper";
import { VPJson } from "../ssi/vcvp-interface";
import { verifySignature } from "../utils/crypto";

export const authDIDChallenge: RequestHandler = async (req, res, next) => {
    try {
      res.status(200).json(Math.random().toString(36).substring(7));
    } catch (error) { next(error); }
};

export const verifyVP: RequestHandler<unknown, unknown, VPJson, unknown> = async (req, res, next) => {
  const { id, verifiableCredential, proof } = req.body
  const iUnivVCMessage = await generateIUnivVCMessage(verifiableCredential.iUnivVCJson)
  const iIdenVCMessage = await generateIIdenVCMessage(verifiableCredential.iIdenVCJson)
  const vpMessage = await generateVPmessage(req.body)
  const issuerDIDId = verifiableCredential.iUnivVCJson.proof.verificationMethod.replace(/#key-\d+/g, "");
  try {
    const didSerializedIdIssuer = serializeDIDJsonId(issuerDIDId);
    const issuerdidJson = await contractOperation.getDID(3, didSerializedIdIssuer);
    const publicKeyIssuer = Object(issuerdidJson.publicKey[0]);
    const didSerializedIdHolder = serializeDIDJsonId(id);
    const holderdidJson = await contractOperation.getDID(3, didSerializedIdHolder);
    const publicKeyHolder = Object(holderdidJson.publicKey[0]);
    const iUnivVCIsValid = await verifySignature(JSON.stringify(iUnivVCMessage), verifiableCredential.iUnivVCJson.proof.jws, publicKeyIssuer.publicKeyPem);
    const iIdenVCIsValid = await verifySignature(JSON.stringify(iIdenVCMessage), verifiableCredential.iIdenVCJson.proof.jws, publicKeyIssuer.publicKeyPem);
    const vpIsValid = await verifySignature(JSON.stringify(vpMessage), proof.jws, publicKeyHolder.publicKeyPem);
    res.status(200).json({iUnivVCIsValid, iIdenVCIsValid, vpIsValid});
  } catch (error) { next(error); }
};
