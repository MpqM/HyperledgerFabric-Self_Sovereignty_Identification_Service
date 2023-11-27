import { ConflictError, InternalError, UnauthorizedError, } from "./HttpErrors";
import { DIDAuthResponse, DIDAuthSignature, DIDJson, IIden, IIdenVCJson, IUniv, IUnivVCJson, IUser, IssueVCInput, IssueVPInput, LoginCredential, RegisterCredential, VPJson, VerifyVPResult } from "./Interface";

async function fetchData(input: RequestInfo, init?: RequestInit) {
    const response = await fetch(input, init);
    if (response.ok) { return response; }
    else {
        const errorBody = await response.json();
        const errorMessage = errorBody.error;
        if (response.status === 401) { throw new UnauthorizedError(errorMessage); }
        else if (response.status === 409) { throw new ConflictError(errorMessage); }
        else if (response.status === 500){ throw new InternalError(errorMessage); }
        throw Error("Request failed with status: " + response.status + ", message: " + errorMessage);
    }
}

export async function getDID(id: string): Promise<DIDJson> {
    const response = await fetchData("ssi/getdid/"+id, {method: "GET"});
    return response.json();
}

export async function issueDID(type: string): Promise<DIDJson> {
    const response = await fetchData("ssi/issuedid/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({type: type}),
    })
    return response.json();
}

export async function authDIDChallenge(role: string): Promise<string> {
    const response = await fetchData(`${role}/authdidchallenge`, {method: "GET",});
    return response.json();
}

export async function authDIDSignature(role: string, didAuthSignature:DIDAuthSignature): Promise<string> {
    const response = await fetchData(`${role}/authdidsignature`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(didAuthSignature),
    })
    return response.json();
}

export async function authDIDResponse(role: string, didAuthResponse: DIDAuthResponse): Promise<boolean> {
    const response = await fetchData(`${role}/authdidresponse`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(didAuthResponse),
    })
    return response.json();
}

export async function getAuth(): Promise<IUser> {
    const response = await fetchData("issuer/getauth", {method:"GET"});
    return response.json();
}

export async function register(registerCredential: RegisterCredential): Promise<IUser> {
    const response = await fetchData("/issuer/register", {
        method: "POST",
        headers: { "Content-Type": "application/json", },
        body: JSON.stringify(registerCredential),
    });
    return response.json();
}

export async function login(loginCredential: LoginCredential): Promise<IUser> {
    const response = await fetchData("/issuer/login", {
        method: "POST",
        headers: { "Content-Type": "application/json", },
        body: JSON.stringify(loginCredential),
    });
    return response.json();
}

export async function logout() {
    await fetchData("/issuer/logout", {method: "Post"});
}

export async function createIUniv(iUniv: IUniv): Promise<IUniv> {
    const response = await fetchData("/issuer/createiuniv", {
        method: "POST",
        headers: { "Content-Type": "application/json", },
        body: JSON.stringify(iUniv),
    });
    return response.json();
}

export async function createIIden(iIden: IIden): Promise<IIden> {
    const response = await fetchData("/issuer/createiiden", {
        method: "POST",
        headers: { "Content-Type": "application/json", },
        body: JSON.stringify(iIden),
    });
    return response.json();
}

export async function getIUnivs(): Promise<IUniv[]> {
    const response = await fetchData("/issuer/getiunivs", {method: "GET"});
    return response.json();
}

export async function getIIdens(): Promise<IIden[]> {
    const response = await fetchData("/issuer/getiidens", {method: "GET"});
    return response.json();
}

export async function issueVC(issueVCInput: IssueVCInput): Promise<IUnivVCJson|IIdenVCJson> {
    const response = await fetchData("/issuer/issuevc", {
        method: "POST",
        headers: { "Content-Type": "application/json", },
        body: JSON.stringify(issueVCInput),
    });
    return response.json();
}

export async function issueVP(issueVPInput: IssueVPInput): Promise<VPJson> {
    const response = await fetchData("/holder/issuevp", {
        method: "POST",
        headers: { "Content-Type": "application/json", },
        body: JSON.stringify(issueVPInput),
    });
    return response.json();
}

export async function verifyVP(vpJson: VPJson): Promise<VerifyVPResult> {
    const response = await fetchData("/verifier/verifyvp", {
        method: "POST",
        headers: { "Content-Type": "application/json", },
        body: JSON.stringify(vpJson),
    });
    return response.json();
}