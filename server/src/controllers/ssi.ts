import { RequestHandler } from "express";
import { generateDIDJson, serializeDIDJson, serializeDIDJsonId } from "../ssi/did-helper";
import * as contractOperation from "../ssi/did-operation";
import { generateKeyInfo, verifySignature } from "../utils/crypto";

export const createDID: RequestHandler = async (req, res, next) => {
  const didSerialized = serializeDIDJson(req.body);
  try {
    const didJson = await contractOperation.createDID(1, didSerialized);
    res.status(200).json(didJson);
  } catch (error) { next(error); }
};

export const updateDID: RequestHandler = async (req, res, next) => {
  const didSerialized = serializeDIDJson({ id: req.params.id, ...req.body, });
  try {
    const didJson = await contractOperation.updateDID(1, didSerialized);
    res.status(200).json(didJson);
  } catch (error) { next(error); }
};

export const getDID: RequestHandler = async (req, res, next) => {
  const didSerializedId = serializeDIDJsonId(req.params.id);
  try {
    const didJson = await contractOperation.getDID(1, didSerializedId);
    res.status(200).json(didJson);
  } catch (error) { next(error); }
};

export const deleteDID: RequestHandler = async (req, res, next) => {
  const didSerializedId = serializeDIDJsonId(req.params.id);
  try {
    await contractOperation.deleteDID(1, didSerializedId);
    res.status(200).json("Success, Submit Transaction to Fabric: DeleteDIDDoc");
  } catch (error) { next(error); }
};

export const issueDID: RequestHandler = async (req, res, next) => {
  const { type } = req.body;
  try {
    const keyInfo = await generateKeyInfo(type);
    let didJson = generateDIDJson(keyInfo, type);
    const didSerialized = serializeDIDJson(didJson);
    didJson = await contractOperation.createDID(1, didSerialized);
    res.status(200).json({ ...didJson, privateKeyPem: keyInfo.privateKeyPem });
  } catch (error) { next(error); }
};

export const authDIDChallenge: RequestHandler = async (req, res, next) => {
  try {
    res.status(200).json(Math.random().toString(36).substring(7));
  } catch (error) { next(error); }
};

export const authDIDResponse: RequestHandler = async (req, res, next) => {
  const { challenge, id, signature } = req.body;
  const didSerializedId = serializeDIDJsonId(id);
  try {
    const didJson = await contractOperation.getDID(1, didSerializedId);
    const publicKey = Object(didJson.publicKey[0]);
    const isValid = await verifySignature(challenge, signature, publicKey.publicKeyPem);
    res.status(200).json(isValid);
  } catch (error) { next(error); }
};