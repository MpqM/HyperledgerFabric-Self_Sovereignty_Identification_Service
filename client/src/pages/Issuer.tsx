import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import AuthDIDModal from "../components/AuthDIDModal";
import IssueDIDModal from "../components/IssueDIDModal";
import IssuerVCModal from "../components/IssueVCModal";
import IssuerIIdenModal from "../components/IssuerIdenModal";
import IssuerLoginModal from "../components/IssuerLoginModal";
import IssuerRegisterModal from "../components/IssuerRegisterModal";
import IssuerIUnivModal from "../components/IssuerUnivModal";
import IssuerViewer from "../components/IssuerViewer";
import { DIDAuthResult, DIDJson, IUser } from "../network/Interface";
import * as SSIapi from "../network/SSIapi";
import "../styles/Page.css";

const Issuer = () => {
  const [didJson, setDIDJson] = useState<DIDJson|null>(null)
  const [didAuthResult, setDIDAuthResult] = useState<DIDAuthResult | null>(null)
  const [loggedInIUser, setLoggedInIUser] = useState<IUser | null>(null)
  const [roleAuth, setRoleAuth] = useState({ req: "issuer", res: "holder" })
  
  const getDIDJson = (didJson: DIDJson | null) => { setDIDJson(didJson)}
  const getDIDAuthResult = (didAuthResult: DIDAuthResult | null) => {setDIDAuthResult(didAuthResult)}

  useEffect(() => {
		async function fetchLoggedInUser() {
			try {
				const user = await SSIapi.getAuth(); 
				setLoggedInIUser(user);
			} catch (error) { console.error(error); }
		}
		fetchLoggedInUser();
	}, []);

  async function logout() {
    try {
      await SSIapi.logout();
      setLoggedInIUser(null)
    } catch (error) { console.error(error); }
  }

  return (
    <div className='issuer'>
      {loggedInIUser 
      ?
        <>
          <div className='container'>
            <IssueDIDModal getDIDJson={(didJson) => getDIDJson(didJson)}/>
            <AuthDIDModal roleAuth={roleAuth} getDIDAuthResult={(didAuthResult) => getDIDAuthResult(didAuthResult)}/>
            <IssuerIUnivModal/>
            <IssuerIIdenModal/>
            { didAuthResult?.response===true && <IssuerVCModal/> }
            {/* <IssuerVCModal/> */}
            <Button variant="dark" onClick={logout}>logout: {loggedInIUser.username}</Button>
          </div>
          <IssuerViewer didJson={didJson} didAuthResult={didAuthResult}/>
        </>
      :
        <>
          <div className='container'>
            <IssuerRegisterModal onRegisterSuccessful={(iUser) => {setLoggedInIUser(iUser)}}/>
            <IssuerLoginModal onLoginSuccessful={(iUser) => {setLoggedInIUser(iUser)}}/>
          </div>
        </>
      }
    </div>
  )
}
  
export default Issuer