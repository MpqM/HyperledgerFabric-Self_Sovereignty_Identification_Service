import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { DIDJson } from "../network/Interface";
import * as SSIapi from "../network/SSIapi";

interface IssueDIDModalProps { getDIDJson: (didJson: DIDJson | null) => void; }

const IssueDIDModal = ({ getDIDJson }: IssueDIDModalProps) => {
    const [show, setShow] = useState(false);
    const [type, setType] = useState('');

    const onSubmit = async () => {
        try {
            const didJson = await SSIapi.issueDID(type)
            setShow(false);
            getDIDJson(didJson);
        } catch (error) { console.log(error) }
    }

    return (
        <>
            <Button variant="dark" onClick={() => setShow(true)}>IssueDID</Button>
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton><Modal.Title>IssueDID</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="d-flex">
                            <Form.Label className="me-3">Choose Crypto Type:</Form.Label>
                            <Form.Check
                                className="me-3"
                                type="radio"
                                label="RSA"
                                value="rsa"
                                checked={type === "rsa"}
                                onChange={(e) => setType(e.target.value)}
                            />
                            <Form.Check
                                type="radio"
                                label="ECC"
                                value="ecc"
                                checked={type === "ecc"}
                                onChange={(e) => setType(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    {(type === "ecc" || type === "rsa") && ( <Button variant="secondary" onClick={onSubmit}>Submit</Button> )}
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default IssueDIDModal