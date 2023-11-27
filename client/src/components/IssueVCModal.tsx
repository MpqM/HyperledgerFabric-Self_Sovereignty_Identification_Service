import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { DIDJson, IIdenVCJson, IUniv, IUnivVCJson, IUser, IssueVCInput } from "../network/Interface";
import * as SSIapi from "../network/SSIapi";

const IssuerVCModal = () => {
    const [show, setShow] = useState(false);
    const [vcType, setVCType] = useState("");
    const [holderDIDId, setHolderDIDId] = useState<IUser["didId"] | string>("");
    const [didJsonArray, setDIDJsonArray] = useState<DIDJson[]>(JSON.parse(localStorage.getItem('iDIDJsonArray') || '[]'));

    useEffect(() => {
        const holderDIDId = async () => {
            const iUser = await SSIapi.getAuth();
            setHolderDIDId(iUser.didId)
        }
        holderDIDId()
    }, [])

    const onSubmit = async () => {
        try {
            const issueVCInput: IssueVCInput = {
                type: didJsonArray[0].publicKey[0].type,
                vcType: vcType,
                holderDIDId: holderDIDId,
                issuerDIDId: didJsonArray[0].id,
                issuerPrivateKeyPem: didJsonArray[0].privateKeyPem as string
            }
            const iUnivVCJson: IUnivVCJson | IIdenVCJson = await SSIapi.issueVC(issueVCInput)
            if (vcType === 'IUniv') { localStorage.setItem("iUnivVCJson", JSON.stringify(iUnivVCJson)) }
            else if (vcType === 'IIden') { localStorage.setItem("iIdenVCJson", JSON.stringify(iUnivVCJson)) }
            setShow(false);
        } catch (error) { console.log(error) }
    }

    return (
        <>
            <Button variant="dark" onClick={() => setShow(true)}> IssueVC </Button>
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton><Modal.Title> IssueVC </Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="d-flex">
                            <Form.Check
                                className="me-3"
                                type="radio"
                                label="Univ"
                                value="IUniv"
                                checked={vcType === 'IUniv'}
                                onChange={(e) => setVCType(e.target.value)}
                            />
                            <Form.Check
                                type="radio"
                                label="Iden"
                                value="IIden"
                                checked={vcType === 'IIden'}
                                onChange={(e) => setVCType(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    {(vcType == "IUniv" || vcType == "IIden") && (
                        <Button variant="secondary" onClick={onSubmit}> Submit </Button>
                    )}
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default IssuerVCModal