
import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { DIDJson, IIdenVCJson, IUnivVCJson, IssueVPInput, VPJson } from "../network/Interface";
import * as SSIapi from "../network/SSIapi";

const IssueVPModal = () => {
    const [show, setShow] = useState(false);
    const [username, setUsername] = useState("");
    const [didId, setDIDId] = useState("");
    const [password, setPassword] = useState("");
    const [challenge, setChallenge] = useState(localStorage.getItem('vChallenge') || '');
    const [checkValue, setCheckValue] = useState(false);
    const [didJsonArray, setDIDJsonArray] = useState<DIDJson[]>(JSON.parse(localStorage.getItem("hDIDJsonArray") || '[]'));
    const [iUnivVCJson, setIUnivVCJson] = useState<IUnivVCJson>(JSON.parse(localStorage.getItem("iUnivVCJson") || '{}'));
    const [iIdenVCJson, setIIdenVCJson] = useState<IIdenVCJson>(JSON.parse(localStorage.getItem("iIdenVCJson") || '{}'));
    
    async function onSubmit() {
        try {
            const issueVPinput: IssueVPInput = {
                type: didJsonArray[0].publicKey[0].type, 
                challenge: challenge,
                holderDIDId: didJsonArray[0].id,
                holderPrivateKeyPem: didJsonArray[0].privateKeyPem as string,
                iUnivVCJson: iUnivVCJson,
                iIdenVCJson: iIdenVCJson
            }
            const vpJson = await SSIapi.issueVP(issueVPinput);
            localStorage.setItem('hVPJson', JSON.stringify(vpJson))
            setShow(false);
        } catch (error) { console.error(error); }
    }

    return (
        <>
        <Button variant="dark" onClick={() => setShow(true)}> IssueVP </Button>
        <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton><Modal.Title>IssueVP</Modal.Title></Modal.Header>
            <Modal.Body>
            <Form>
                <Form.Text>DID</Form.Text>
                { didJsonArray.length > 0 && iUnivVCJson && iIdenVCJson
                    ? (
                        <>
                        <pre>{JSON.stringify(didJsonArray[0].id)}</pre>
                        <pre>{JSON.stringify(didJsonArray[0]?.privateKeyPem)}</pre>
                        <Form.Text>VC</Form.Text>
                        <pre>{JSON.stringify(iUnivVCJson)}</pre>
                        <pre>{JSON.stringify(iIdenVCJson)}</pre>
                        </>
                    )
                    : (
                        <>
                        <pre>{JSON.stringify(didJsonArray)}</pre>
                        <pre>{JSON.stringify(didJsonArray)}</pre>
                        <Form.Text>VC</Form.Text>
                        <pre>{JSON.stringify(iUnivVCJson)}</pre>
                        <pre>{JSON.stringify(iIdenVCJson)}</pre>
                        </>
                    )
                }
            </Form>
            </Modal.Body>
            <Modal.Footer> 
                {   didJsonArray.length > 0 && iUnivVCJson && iIdenVCJson 
                 ? <Button variant="secondary" onClick={onSubmit}> Submit </Button>
                 : <Form.Text>you don't have a value, get the vc and id again</Form.Text>
                }

            </Modal.Footer>
        </Modal>
        </>
    );
};

export default IssueVPModal;