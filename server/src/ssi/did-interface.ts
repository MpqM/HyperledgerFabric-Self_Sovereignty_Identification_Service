export interface DIDJson {
  id: string;
  context: string;
  publicKey: Array<{ id: string; type: string; controller: string; publicKeyPem: string }>;
  auth: string[];
  service: Array<{ id: string; type: string; serviceEndpoint: string }>;
}

export interface DIDSerialized {
  context: string;
  id: string;
  publicKey: string;
  auth: string;
  service: string;
}
