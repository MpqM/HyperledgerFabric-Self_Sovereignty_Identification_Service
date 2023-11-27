import { Contract } from "@hyperledger/fabric-gateway";
import logger from "../utils/logger";
import { newFabricConnection } from "./fabric-gateway";
import { DIDSerialized, DIDJson } from "./did-interface";

const utf8Decoder = new TextDecoder();

export async function createDID(org: number, didSerialized: DIDSerialized): Promise<DIDJson> {
  logger.info("FABRIC Submit Transaction to Fabric: CreateDID");
  const contract = await newFabricConnection(org);
  const fabricResultBytes = await contract.submitTransaction(
    "CreateDID",
    didSerialized.id,
    didSerialized.context,
    didSerialized.publicKey,
    didSerialized.auth,
    didSerialized.service
  );
  return JSON.parse(utf8Decoder.decode(fabricResultBytes));
}

export async function updateDID(org: number, didSerialized: DIDSerialized): Promise<DIDJson> {
  logger.info("FABRIC Submit Transaction to Fabric: UpdateDID");
  const contract = await newFabricConnection(org);
  const fabricResultBytes = await contract.submitTransaction(
    "UpdateDID",
    didSerialized.id,
    didSerialized.context,
    didSerialized.publicKey,
    didSerialized.auth,
    didSerialized.service
  );
  return JSON.parse(utf8Decoder.decode(fabricResultBytes));
}

export async function getDID(org: number, didSerializedId: string): Promise<DIDJson> {
  logger.info("FABRIC Evaluate Transaction: GetDID");
  const contract = await newFabricConnection(org);
  const fabricResultBytes = await contract.evaluateTransaction("GetDID", didSerializedId);
  return JSON.parse(utf8Decoder.decode(fabricResultBytes));
}

export async function deleteDID(org: number, didSerializedId: string): Promise<string> {
  logger.info("FABRIC Submit Transaction to Fabric: DeleteDID");
  const contract = await newFabricConnection(org);
  const fabricResultBytes = await contract.submitTransaction("DeleteDID", didSerializedId);
  return utf8Decoder.decode(fabricResultBytes);
}
