import { KeyInfo } from "../utils/crypto";
import { DIDSerialized, DIDJson } from "./did-interface";

export function serializeDIDJson(didJson: DIDJson): DIDSerialized {
  const id = JSON.stringify(didJson.id).replace(/"/g, "");
  const context = JSON.stringify(didJson.context).replace(/"/g, "");
  const publicKey = "[" + didJson.publicKey.map(key => JSON.stringify(key)).join(", ") + "]"
  const auth = "[" + didJson.auth.map((key) => JSON.stringify(key)).join(", ") + "]"
  const service = "[" + didJson.service.map((key) => JSON.stringify(key)).join(", ") + "]"
  return { id, context, publicKey, auth, service }
}

export function serializeDIDJsonId(id: string): DIDSerialized["id"] { return JSON.stringify(id).replace(/"/g, ""); }

export function generateDIDJson(KeyInfo: KeyInfo, type: string): DIDJson {
  const id = `did:hlf:${KeyInfo.publicKeyHash}`;
  return {
    id: `did:hlf:${KeyInfo.publicKeyHash}`,
    context: "https://www.w3.org/ns/did/v1",
    publicKey: [
      {
        id: `did:hlf:${KeyInfo.publicKeyHash}#keys-1`,
        type: `${type}`,
        controller: `did:hlf:${KeyInfo.publicKeyHash}`,
        publicKeyPem: `${KeyInfo.publicKeyPem}`,
      },
    ],
    auth: [`did:hlf:${KeyInfo.publicKeyHash}#auth-1`,],
    service: [
      {
        id: "did:hlf:ssi",
        type: "did",
        serviceEndpoint: "http://localhost:3000/ssi/did",
      },
    ],
  };
}

