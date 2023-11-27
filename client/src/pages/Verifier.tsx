import { useState } from "react"
import InPutVPModal from "../components/InPutVPModal"
import RequireVPModal from "../components/RequireVPModal"
import SuccessModal from "../components/SuccessModal"
import VerifierViewer from "../components/VerifierViewer"
import VerifyVPModal from "../components/VerifyVPModal"
import { VerifyVPResult } from "../network/Interface"

const Verifier = () => {
  const [roleAuth, setRoleAuth] = useState({ req: "verifier", res: "holder" })
  const [verifyVPResult, setVerifyVPResultn] = useState<VerifyVPResult|null>(null)
  const getVerifyVPResult = (verifyVPResult: VerifyVPResult | null) => { setVerifyVPResultn(verifyVPResult)}

  return (
    <div className='verifier'>
      <div className='container'>
        <RequireVPModal roleAuth={roleAuth} />
        <InPutVPModal />
        <VerifyVPModal getVerifyVPResult={(verifyVPResult) => getVerifyVPResult(verifyVPResult)}/>
        {verifyVPResult && (verifyVPResult.iUnivVCIsValid  && verifyVPResult.iIdenVCIsValid && verifyVPResult.vpIsValid ) === true &&
          <SuccessModal/>
        }
      </div>
      <VerifierViewer verifyVPResult={verifyVPResult}/>
    </div>
  )
}

export default Verifier