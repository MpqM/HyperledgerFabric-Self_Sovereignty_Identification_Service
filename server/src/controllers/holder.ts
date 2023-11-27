import { RequestHandler } from "express";
import { generateVPJson } from "../ssi/vcvp-helper";
import { IIdenVCJson, IUnivVCJson } from "../ssi/vcvp-interface";
import { generateSignature } from "../utils/crypto";

export const authDIDSignature: RequestHandler = async (req, res, next) => {
  const { challenge, privateKeyPem } = req.body;
  try {
    const didAuthSignature = await generateSignature(challenge, privateKeyPem);
    res.status(200).json(didAuthSignature);
  } catch (error) { next(error); }
};

interface IssueVPInput { type: string; challenge: string; holderDIDId: string; holderPrivateKeyPem: string; iUnivVCJson: IUnivVCJson; iIdenVCJson: IIdenVCJson }
export const issueVP: RequestHandler<unknown, unknown, IssueVPInput, unknown>  = async (req, res, next) => {
  const { type, challenge, holderDIDId, holderPrivateKeyPem, iUnivVCJson, iIdenVCJson } = req.body;
  try{
    const vpJson = await generateVPJson(type, challenge, holderDIDId, holderPrivateKeyPem, iUnivVCJson, iIdenVCJson);
    res.status(200).json(vpJson);
  } catch (error) { next(error); }
};