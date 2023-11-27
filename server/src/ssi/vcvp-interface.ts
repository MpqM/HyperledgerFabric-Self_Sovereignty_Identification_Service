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

export interface IUnivSubjectData {
  name: string | undefined;
  age: string | undefined;
  gender: string | undefined;
  graduationDate: string | undefined;
  major: string | undefined;
  gpa: string | undefined;
}

export interface IUnivVCMessage {
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

export interface IIdenSubjectData {
  name: string | undefined;
  age: string | undefined;
  gender: string | undefined;
  address: string | undefined;
}

export interface IIdenVCMessage {
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

export interface VPMessage {
  context: string[];
  id: string;
  type: string[];
  verifiableCredential: {
    iUnivVCJson:IUnivVCJson;
    iIdenVCJson:IIdenVCJson;
  }
}
