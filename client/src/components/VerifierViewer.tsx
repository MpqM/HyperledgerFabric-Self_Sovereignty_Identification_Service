import { useEffect, useState } from "react";
import { DIDAuthResult, DIDJson, IIdenVCJson, IUnivVCJson, VPJson, VerifyVPResult, } from "../network/Interface";
import "../styles/Viewer.css";
interface VerifierViewerProps {
  verifyVPResult: VerifyVPResult | null
}
const VerifierViewer = ({verifyVPResult}: VerifierViewerProps) => {
  const [vpJson, setVPJson] = useState<VPJson>(JSON.parse(localStorage.getItem("vVPJson") || '{}'));
  const vpJsonData = JSON.stringify(vpJson, null, 2)
  const verifyVPResultData = JSON.stringify(verifyVPResult, null, 2)
  return (
    <div className="viewer">
      { Object.keys(vpJson).length > 0 && (
          <div className="container1">
            <pre className="section-left">{vpJsonData}</pre>
            {verifyVPResult !== null && <pre className="section-right">{verifyVPResultData}</pre>}
          </div>
          )
        }
    </div>
  );
};

export default VerifierViewer;
