import { useState } from "react";
import AuthDIDModal from "../components/AuthDIDModal";
import GetDIDModal from "../components/GetDIDModal";
import HolderViewer from "../components/HolderViewer";
import IssueDIDModal from "../components/IssueDIDModal";
import IssueVPModal from "../components/IssueVPModal";
import { DIDAuthResult, DIDJson, VPJson } from "../network/Interface";
import "../styles/Page.css";

const Holder = () => {
  const [didJson, setDIDJson] = useState<DIDJson|null>(null)
  const [didAuthResult, setDIDAuthResult] = useState<DIDAuthResult | null>(null)
  const [roleAuth, setRoleAuth] = useState({ req: "ssi", res: "holder" })
  
  const getDIDJson = (didJson: DIDJson | null) => { setDIDJson(didJson)}
  const getDIDAuthResult = (didAuthResult: DIDAuthResult | null) => {setDIDAuthResult(didAuthResult)}

  return (
    <div className='holder'>
      <div className='container'>
        <GetDIDModal getDIDJson={(didJson) => getDIDJson(didJson)} />
        <IssueDIDModal getDIDJson={(didJson) => getDIDJson(didJson)}/>
        <AuthDIDModal roleAuth={roleAuth} getDIDAuthResult={(didAuthResult) => getDIDAuthResult(didAuthResult)}/>
        <IssueVPModal/>
      </div>
        <HolderViewer didJson={didJson} didAuthResult={didAuthResult}/>
      </div> 
    )
  }
  
export default Holder