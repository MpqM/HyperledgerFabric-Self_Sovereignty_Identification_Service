import * as crypto from "crypto";
import { IUnivVCMessage } from "../ssi/vcvp-interface";

export interface KeyInfo  {
  privateKeyPem: string;
  publicKeyPem: string;
  publicKeyHash: string;
}

export async function generateKeyInfo( type: string ): Promise<KeyInfo> {
  if (type === "rsa") { return await generateRSAKeyInfo(); }
  else if(type === "ecc") { return await generateECCKeyInfo(); }
  else { return await generateECCKeyInfo(); }
}

async function generateRSAKeyInfo(): Promise<KeyInfo> {
  const rsaKeyPair = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  });
  const publicKeyHash = crypto.createHash("sha256").update(rsaKeyPair.publicKey).digest("hex");
  return {
    privateKeyPem: rsaKeyPair.privateKey,
    publicKeyPem: rsaKeyPair.publicKey,
    publicKeyHash: publicKeyHash,
  };
}

async function generateECCKeyInfo(): Promise<KeyInfo> {
  const eccKeyPair = crypto.generateKeyPairSync("ec", {
    namedCurve: "secp256k1",
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  });
  const publicKeyHash = crypto.createHash("sha256").update(eccKeyPair.publicKey).digest("hex");
  return {
    privateKeyPem: eccKeyPair.privateKey,
    publicKeyPem: eccKeyPair.publicKey,
    publicKeyHash: publicKeyHash,
  };
}


export async function generateSignature(dataToSign: string, privateKeyPem: string): Promise<string> {
  const sign = crypto.createSign("sha256");
  sign.update(dataToSign);
  return sign.sign(privateKeyPem, "hex");
}


export async function verifySignature(dataToSign: string, signature: string, publicKeyPem: string): Promise<boolean> {
  const verify = crypto.createVerify("sha256");
  verify.update(dataToSign);
  const isVerified = verify.verify(publicKeyPem, signature, "hex");
  if (isVerified) { return true; }
  else { return false; }
}
