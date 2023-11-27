import { useEffect, useState } from "react";
import { DIDAuthResult, DIDJson, IIdenVCJson, IUnivVCJson, VPJson, } from "../network/Interface";
import "../styles/Viewer.css";

interface HolderViewerProps {
  didJson?: DIDJson | null;
  didAuthResult?: DIDAuthResult | null;
}

const HolderViewer = ({ didJson, didAuthResult }: HolderViewerProps) => {
  const [didJsonArray, setDIDJsonArray] = useState<DIDJson[]>(JSON.parse(localStorage.getItem("hDIDJsonArray") || '[]'));
  const [didAuthResultArray, setDIDAuthResultArray] = useState<DIDAuthResult[]>(JSON.parse(localStorage.getItem("hDIDAuthResultArray") || '[]'));
  const [iUnivVCJson, setIUnivVCJson] = useState<IUnivVCJson>(JSON.parse(localStorage.getItem("iUnivVCJson") || '{}'));
  const [iIdenVCJson, setIIdenVCJson] = useState<IIdenVCJson>(JSON.parse(localStorage.getItem("iIdenVCJson") || '{}'));
  const [vpJson, setVPJson] = useState<VPJson>(JSON.parse(localStorage.getItem("hVPJson") || '{}'));
  const dividingLine ="=============================================================================================================================";

  useEffect(() => { if (didJson != null) { setDIDJsonArray((prevDIDJsonArray) => [didJson, ...prevDIDJsonArray]); } }, [didJson]);
  useEffect(() => { if (didAuthResult != null) { setDIDAuthResultArray((prevDIDAuthResultArray) => [didAuthResult, ...prevDIDAuthResultArray]); } }, [didAuthResult]);

  const didJsonData = didJsonArray.map((didJson) => JSON.stringify(didJson, null, 2)).join("\n" + dividingLine + "\n");
  const didAuthResultData = didAuthResultArray.map((didAuthResult) => JSON.stringify(didAuthResult, null, 2)).join("\n" + dividingLine + "\n");
  const iUnivVCJsonData = JSON.stringify(iUnivVCJson, null, 2);
  const iIdenVCJsonData = JSON.stringify(iIdenVCJson, null, 2);
  const vpJsonData = JSON.stringify(vpJson, null, 2)
  useEffect(() => { localStorage.setItem("hDIDJsonArray", JSON.stringify(didJsonArray)); }, [didJsonData]);
  useEffect(() => { localStorage.setItem("hDIDAuthResultArray", JSON.stringify(didAuthResultArray)); }, [didAuthResultData]);

  return (
    <div className="viewer">
      {Object.keys(vpJson).length > 0 
      ? (
          <div className="container1">
            {didJsonArray.length > 0 && (<pre className="section-left">{didJsonData}</pre> )}
            { <pre className="section-right">{vpJsonData} </pre> }
          </div>
        )
      : (
          <div className="container1">
            {didJsonArray.length > 0 && ( <pre className="section-left">{didJsonData}</pre> )}
            {didAuthResultArray.length > 0 && ( <pre className="section-right">{didAuthResultData}</pre> )}
          </div>
        )
      }
      <div className="container1">
        {iUnivVCJsonData != "{}" && ( <pre className="section-left">{iUnivVCJsonData}</pre> )}
        {iIdenVCJsonData != "{}" && ( <pre className="section-right">{iIdenVCJsonData}</pre> )}
      </div>
    </div>
  );
};

export default HolderViewer;
