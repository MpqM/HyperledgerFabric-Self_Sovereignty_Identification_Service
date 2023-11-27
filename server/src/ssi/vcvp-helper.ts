import { generateSignature } from "../utils/crypto";
import { IIdenSubjectData, IIdenVCJson, IIdenVCMessage, IUnivSubjectData, IUnivVCJson, IUnivVCMessage, VPJson, VPMessage } from "./vcvp-interface";

export async function generateIUnivVCJson(
  issuerDIDId: string,
  issuerPrivateKeyPem: string,
  holderUserId: string,
  holderDIDId: string,
  iUnivSubjectData: IUnivSubjectData,
  type: string
): Promise<IUnivVCJson> {
  const { name, age, gender, graduationDate, major, gpa } = iUnivSubjectData;
  const iUnivVCMessage = {
    context: ["https://www.w3.org/2018/credentials/v1"],
    id: `http://localhost:3000/ssi/vc/${holderUserId}`,
    type: ["VerifiableCredential"],
    issuer: `${issuerDIDId}`,
    issuanceDate: new Date().toISOString(),
    expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    credentialSubject: {
      id: `${holderDIDId}`,
      degree: {
        name: `${name}`,
        age: `${age}`,
        gender: `${gender}`,
        graduationDate: `${graduationDate}`,
        major: `${major}`,
        gpa: `${gpa}`,
      },
    },
  };
  const jws = await generateSignature(JSON.stringify(iUnivVCMessage), issuerPrivateKeyPem);
  return {
    ...iUnivVCMessage,
    proof: {
      type: `${type}`,
      created: new Date().toISOString(),
      creator: "Issuer University",
      verificationMethod: `${issuerDIDId}#key-1`,
      jws: `${jws}`,
    },
  };
}

export async function generateIIdenVCJson(
  issuerDIDId: string,
  issuerPrivateKeyPem: string,
  holderUserId: string,
  holderDIDId: string,
  iIdenSubjectData: IIdenSubjectData,
  type: string
): Promise<IIdenVCJson> {
  const { name, age, gender, address } = iIdenSubjectData;
  const iIdenVCMessage = {
    context: ["https://www.w3.org/2018/credentials/v1"],
    id: `http://localhost:3000/ssi/vc/${holderUserId}`,
    type: ["VerifiableCredential"],
    issuer: `${issuerDIDId}`,
    issuanceDate: new Date().toISOString(),
    expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    credentialSubject: {
      id: `${holderDIDId}`,
      personalInfo: {
        name: `${name}`,
        age: `${age}`,
        gender: `${gender}`,
        address: `${address}`,
      },
    },
  };
  const jws = await generateSignature(JSON.stringify(iIdenVCMessage), issuerPrivateKeyPem);
  return {
    ...iIdenVCMessage,
    proof: {
      type: `${type}`,
      created: new Date().toISOString(),
      creator: "Issuer University",
      verificationMethod: `${issuerDIDId}#key-1`,
      jws: `${jws}`,
    },
  };
}

export async function generateVPJson(type: string, challenge:string, holderDIDId: string, holderPrivateKeyPem: string, iUnivVCJson: IUnivVCJson, iIdenVCJson:IIdenVCJson): Promise<VPJson> {
  const vpMessage = {
    context: ["https://www.w3.org/2018/credentials/v1"],
    id: `${holderDIDId}`,
    type: ["VerifiablePresentation"],
    verifiableCredential: {
      iUnivVCJson: iUnivVCJson,
      iIdenVCJson: iIdenVCJson
    }
  }
  
    const jws = await generateSignature(JSON.stringify(vpMessage), holderPrivateKeyPem);
    return {
      ...vpMessage,
      proof: {
        type: `${type}`,
        created: new Date().toISOString(),
        challenge: `${challenge}`,
        domain: "http://localhost:3000/verifier",
        verificationMethod: `${holderDIDId}#key-1`,
        jws: `${jws}`,
        proofPurpose: "authentication"
      },
    };
}

export async function generateIUnivVCMessage(iUnivVCJson: IUnivVCJson): Promise<IUnivVCMessage> {
  const iUnivVCMessage = {
    context: iUnivVCJson.context,
    id: iUnivVCJson.id,
    type: iUnivVCJson.type,
    issuer: iUnivVCJson.issuer,
    issuanceDate: iUnivVCJson.issuanceDate,
    expirationDate: iUnivVCJson.expirationDate,
    credentialSubject: {
      id: iUnivVCJson.credentialSubject.id,
      degree: {
        name: iUnivVCJson.credentialSubject.degree.name,
        age: iUnivVCJson.credentialSubject.degree.age,
        gender: iUnivVCJson.credentialSubject.degree.gender,
        graduationDate: iUnivVCJson.credentialSubject.degree.graduationDate,
        major: iUnivVCJson.credentialSubject.degree.major,
        gpa: iUnivVCJson.credentialSubject.degree.gpa,
      },
    },
  };
  return iUnivVCMessage
}

export async function generateIIdenVCMessage(iIdenVCJson: IIdenVCJson): Promise<IIdenVCMessage> {
  const iIdenVCMessage = {
    context: iIdenVCJson.context,
    id: iIdenVCJson.id,
    type: iIdenVCJson.type,
    issuer: iIdenVCJson.issuer,
    issuanceDate: iIdenVCJson.issuanceDate,
    expirationDate: iIdenVCJson.expirationDate,
    credentialSubject: {
      id: iIdenVCJson.credentialSubject.id,
      personalInfo: {
        name: iIdenVCJson.credentialSubject.personalInfo.name,
        age: iIdenVCJson.credentialSubject.personalInfo.age,
        gender: iIdenVCJson.credentialSubject.personalInfo.gender,
        address: iIdenVCJson.credentialSubject.personalInfo.address
      },
    },
  };
  return iIdenVCMessage
}

export async function generateVPmessage(vpJson: VPJson): Promise<VPMessage> {
  const vpMessage = {
    context: vpJson.context,
    id: vpJson.id,
    type: vpJson.type,
    verifiableCredential: {
      iUnivVCJson: vpJson.verifiableCredential.iUnivVCJson,
      iIdenVCJson: vpJson.verifiableCredential.iIdenVCJson
    }
  }
  return vpMessage
}