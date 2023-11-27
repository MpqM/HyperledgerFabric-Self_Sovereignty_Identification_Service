// DID
export interface DIDJson {
  id: string;
  context: string;
  publicKey: Array<{ id: string; type: string; controller: string; publicKeyPem: string; }>;
  auth: Array<{ id: string[] }>;
  service: Array<{ id: string; type: string; serviceEndpoint: string }>;
  privateKeyPem?: string;
}

export interface DIDSerialized {
  context: string;
  id: string;
  publicKey: string;
  auth: string;
  service: string;
}

export interface DIDAuthChallenge {
  challenge: string;
}

export interface DIDAuthSignature {
  challenge: string;
  privateKeyPem: string;
}

export interface DIDAuthResponse {
  challenge: string;
  id: string;
  signature: string;
}

export interface DIDAuthResult {
  challenge: string;
  signature: string;
  privateKeyPem: string;
  response: boolean;
}

// Issuer
export interface RegisterCredential {
  username: string;
  didId: string;
  password: string;
}

export interface LoginCredential {
  username: string;
  password: string;
}

export interface IUser {
  username: string;
  didId: string;
  password: string;
}

export interface IUniv {
  name: string;
  age: string;
  gender: string;
  graduationDate: string;
  major: string;
  gpa: string;
}

export interface IIden {
  name: string;
  age: string;
  gender: string;
  address: string;
}

// VC
export interface IssueVCInput { 
  type: string; 
  vcType: string;
  holderDIDId: string; 
  issuerDIDId: string; 
  issuerPrivateKeyPem: string; 
}

export interface IIdenVCJson {
  context: string[];
  id: string;
  type: string[];
  issuer: string;
  issuanceDate: string;
  expirationDate: string;
  credentialSubject: {
    id: string;
    personalInfo: {
      name: string;
      age: string;
      gender: string;
      address: string;
    };
  };
  proof: {
    type: string;
    created: string;
    creator: string;
    verificationMethod: string;
    jws: string;
  };
}

export interface IUnivVCJson {
  context: string[];
  id: string;
  type: string[];
  issuer: string;
  issuanceDate: string;
  expirationDate: string;
  credentialSubject: {
    id: string;
    degree: {
      name: string;
      age: string;
      gender: string;
      graduationDate: string;
      major: string;
      gpa: string;
    };
  };
  proof: {
    type: string;
    created: string;
    creator: string;
    verificationMethod: string;
    jws: string;
  };
}

// VP
export interface IssueVPInput {
  type: string;
  challenge: string;
  holderDIDId: string;
  holderPrivateKeyPem: string;
  iUnivVCJson: IUnivVCJson;
  iIdenVCJson: IIdenVCJson;
}

export interface VPJson {
  context: string[];
  id: string;
  type: string[];
  verifiableCredential: {
    iUnivVCJson:IUnivVCJson;
    iIdenVCJson:IIdenVCJson;
  }
  proof: {
    type: string;
    created: string;
    challenge: string;
    domain: string;
    verificationMethod: string;
    jws: string;
    proofPurpose: string;
  };
}

export interface VerifyVPResult{
  iUnivVCIsValid: boolean
  iIdenVCIsValid: boolean
  vpIsValid: boolean
}
