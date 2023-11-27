// Fabric Connection Info
import "dotenv/config";
import env from "../utils/validate-env";

export interface FabricConnectionInfo {
  channelName: string;
  chaincodeName: string;
  mspId: string;
  cryptoPath: string;
  keyDirectoryPath: string;
  certPath: string;
  tlsCertPath: string;
  peerEndpoint: string;
  peerHostAlias: string;
}

export const org1ConnectionInfo: FabricConnectionInfo = {
  channelName: env.CHANNEL_NAME,
  chaincodeName: env.CHAINCODE_NAME,
  mspId: env.ORG1_MSP_ID,
  cryptoPath: env.ORG1_CRYPTO_PATH,
  keyDirectoryPath: env.ORG1_KEY_DIRECTORY_PATH,
  certPath: env.ORG1_CERT_PATH,
  tlsCertPath: env.ORG1_TLS_CERT_PATH,
  peerEndpoint: env.ORG1_PEER_ENDPOINT,
  peerHostAlias: env.ORG1_PEER_HOST_ALIAS,
};

export const org2ConnectionInfo: FabricConnectionInfo = {
  channelName: env.CHANNEL_NAME,
  chaincodeName: env.CHAINCODE_NAME,
  mspId: env.ORG2_MSP_ID,
  cryptoPath: env.ORG2_CRYPTO_PATH,
  keyDirectoryPath: env.ORG2_KEY_DIRECTORY_PATH,
  certPath: env.ORG2_CERT_PATH,
  tlsCertPath: env.ORG2_TLS_CERT_PATH,
  peerEndpoint: env.ORG2_PEER_ENDPOINT,
  peerHostAlias: env.ORG2_PEER_HOST_ALIAS,
};

export const org3ConnectionInfo: FabricConnectionInfo = {
  channelName: env.CHANNEL_NAME,
  chaincodeName: env.CHAINCODE_NAME,
  mspId: env.ORG3_MSP_ID,
  cryptoPath: env.ORG3_CRYPTO_PATH,
  keyDirectoryPath: env.ORG3_KEY_DIRECTORY_PATH,
  certPath: env.ORG3_CERT_PATH,
  tlsCertPath: env.ORG3_TLS_CERT_PATH,
  peerEndpoint: env.ORG3_PEER_ENDPOINT,
  peerHostAlias: env.ORG3_PEER_HOST_ALIAS,
};
