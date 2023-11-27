import { useState } from "react";
import { ConflictError } from "../network/HttpErrors";
import * as SSIapi from "../network/SSIapi";
import { IUser, RegisterCredential } from "../network/Interface";
import { Button, Form, Modal } from "react-bootstrap";

interface IssuerRegisterModalProps {
    onRegisterSuccessful: (iUser: IUser) => void;
}

const IssuerRegisterModal = ({ onRegisterSuccessful }: IssuerRegisterModalProps) => {
    const [show, setShow] = useState(false);
    const [username, setUsername] = useState("");
    const [didId, setDIDId] = useState("");
    const [password, setPassword] = useState("");

    async function onSubmit() {
        try {
            const registerCredentials: RegisterCredential = {
                username: username,
                didId: didId,
                password: password,
            }
            const newIUser = await SSIapi.register(registerCredentials);
            onRegisterSuccessful(newIUser);
            setShow(false);
        } catch (error) { console.error(error); }
    }

    return (
        <>
        <Button variant="dark" onClick={() => setShow(true)}> Register </Button>
        <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton><Modal.Title>Register</Modal.Title></Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Control
                        className="mb-3"
                        type="text" 
                        placeholder="USERNAME" 
                        autoFocus
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <Form.Control 
                        className="mb-3"
                        type="text" 
                        placeholder="DID ID" 
                        autoFocus
                        value={didId}
                        onChange={(e) => setDIDId(e.target.value)}
                    />
                    <Form.Control 
                        type="text" 
                        placeholder="password" 
                        autoFocus
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form>
            </Modal.Body>
            <Modal.Footer> <Button variant="secondary" onClick={onSubmit}> Submit </Button></Modal.Footer>
        </Modal>
        </>
    );
};

export default IssuerRegisterModal;