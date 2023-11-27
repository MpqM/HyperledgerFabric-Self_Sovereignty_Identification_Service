import { useEffect, useState } from "react";
import { DIDAuthResult, DIDJson, IIden, IUniv } from "../network/Interface";
import "../styles/Viewer.css";
import * as SSIapi from "../network/SSIapi";

interface IssuerViewerProps {
    didJson?: DIDJson | null
    didAuthResult?: DIDAuthResult | null
}

const IssuerViewer = ({didJson, didAuthResult}: IssuerViewerProps) => {
    const [didJsonArray, setDIDJsonArray] =  useState<DIDJson[]>(JSON.parse(localStorage.getItem('iDIDJsonArray') || '[]') );
    const [didAuthResultArray, setDIDAuthResultArray] = useState<DIDAuthResult[]>(JSON.parse(localStorage.getItem('iDIDAuthResultArray') || '[]'));
    const [iUnivs, setIUnivs] = useState<IUniv[]|null>(null)
    const [iIdens, setIIdens] = useState<IIden[]|null>(null)
    const  dividingLine= "============================================================================================================================="
    
    useEffect(() => {
      async function getIUnivs() {
        try {
            const iUnivs = await SSIapi.getIUnivs()
            setIUnivs(iUnivs)
            const iIdens = await SSIapi.getIIdens()
            setIIdens(iIdens)
        } catch (error) { console.error(error); }
      }
      const intervalId = setInterval(getIUnivs, 10000);
      return () => { clearInterval(intervalId); };
    }, [])
    
    useEffect(() => { if (didJson != null) { setDIDJsonArray((prevDIDJsonArray) => [didJson, ...prevDIDJsonArray ]); } }, [didJson]);
    useEffect(() => { if (didAuthResult != null) { setDIDAuthResultArray((prevDIDAuthResultArray) => [didAuthResult, ...prevDIDAuthResultArray]); } }, [didAuthResult]);

    const didJsonData = didJsonArray.map((didJson) => JSON.stringify(didJson, null, 2)).join("\n"+dividingLine+"\n");
    const didAuthResultData = didAuthResultArray.map((didAuthResult) => JSON.stringify(didAuthResult, null, 2)).join("\n"+dividingLine+"\n");
    const iUnivsData =iUnivs?.map((iUniv: IUniv) => JSON.stringify(iUniv, null, 2)).join("\n"+dividingLine+"\n");
    const iIdensData =iIdens?.map((iIdens: IIden) => JSON.stringify(iIdens, null, 2)).join("\n"+dividingLine+"\n");
    
    useEffect(() => { localStorage.setItem("iDIDJsonArray", JSON.stringify(didJsonArray)); }, [didJsonData]);
    useEffect(() => { localStorage.setItem("iDIDAuthResultArray",JSON.stringify(didAuthResultArray)); }, [didAuthResultData]);

    return (
        <div className="viewer">
            <div className="container1">
                {didJsonArray.length > 0 && <pre className="section-left">{didJsonData}</pre>}
                {didAuthResultArray.length > 0 && <pre className="section-right">{didAuthResultData}</pre>}
            </div>
            <div className="container1">
                {iUnivs && iUnivs?.length > 0 && <pre className="section-left">{iUnivsData}</pre>}
                {iIdens && iIdens?.length > 0 && <pre className="section-right">{iIdensData}</pre>}
            </div>
        </div>
    );
}

export default IssuerViewer