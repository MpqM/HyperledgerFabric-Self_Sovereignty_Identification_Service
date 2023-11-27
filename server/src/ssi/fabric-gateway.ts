import * as grpc from "@grpc/grpc-js";
import { connect, Contract, Identity, Signer, signers } from "@hyperledger/fabric-gateway";
import * as crypto from "crypto";
import { promises as fs } from "fs";
import * as path from "path";
import logger from "../utils/logger";
import { FabricConnectionInfo, org1ConnectionInfo, org2ConnectionInfo, org3ConnectionInfo } from "./connection-info";

let cachedContract: Contract | null = null;
let cachedOrg: number | null = null;

export async function newFabricConnection(org: number): Promise<Contract> {
  if (cachedOrg === org) { return cachedContract as Contract; }
  let connectionInfo;
  switch (org) {
    case 1: connectionInfo = org1ConnectionInfo;
    case 2: connectionInfo = org2ConnectionInfo;
    case 3: connectionInfo = org3ConnectionInfo;
    default: connectionInfo = org1ConnectionInfo;
  }
  logger.info(`Connecting to Fabric Org${org}`);
  const client = await newGrpcConnection(connectionInfo);
  const gateway = connect({
    client,
    identity: await newIdentity(connectionInfo),
    signer: await newSigner(connectionInfo),
    evaluateOptions: () => { return { deadline: Date.now() + 5000 }; },
    endorseOptions: () => { return { deadline: Date.now() + 15000 }; },
    submitOptions: () => { return { deadline: Date.now() + 5000 }; },
    commitStatusOptions: () => { return { deadline: Date.now() + 60000 }; },
  });
  const network = gateway.getNetwork(connectionInfo.channelName);
  const contract = network.getContract(connectionInfo.chaincodeName);
  cachedContract = contract;
  cachedOrg = org;
  return contract;
}

async function newGrpcConnection(connectionInfo: FabricConnectionInfo): Promise<grpc.Client> {
  const tlsRootCert = await fs.readFile(connectionInfo.tlsCertPath);
  const tlsCredentials = grpc.credentials.createSsl(tlsRootCert);
  return new grpc.Client(connectionInfo.peerEndpoint, tlsCredentials, { "grpc.ssl_target_name_override": connectionInfo.peerHostAlias, });
}

async function newIdentity(connectionInfo: FabricConnectionInfo): Promise<Identity> {
  const credentials = await fs.readFile(connectionInfo.certPath);
  return { mspId: connectionInfo.mspId, credentials };
}

async function newSigner(connectionInfo: FabricConnectionInfo): Promise<Signer> {
  const files = await fs.readdir(connectionInfo.keyDirectoryPath);
  const keyPath = path.resolve(connectionInfo.keyDirectoryPath, files[0]);
  const privateKeyPem = await fs.readFile(keyPath);
  const privateKey = crypto.createPrivateKey(privateKeyPem);
  return signers.newPrivateKeySigner(privateKey);
}
