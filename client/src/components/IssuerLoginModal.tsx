import { useState } from "react";
import { ConflictError } from "../network/HttpErrors";
import * as SSIapi from "../network/SSIapi";
import { IUser, LoginCredential, RegisterCredential } from "../network/Interface";
import { Button, Form, Modal } from "react-bootstrap";

interface IssuerLoginModalModalProps {
    onLoginSuccessful: (iUser: IUser) => void;
}

const IssuerLoginModal = ({ onLoginSuccessful }: IssuerLoginModalModalProps) => {
    const [show, setShow] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    async function onSubmit() {
        try {
            const loginCredential: LoginCredential = {
                username: username,
                password: password,
            }
            const iUser = await SSIapi.login(loginCredential);
            onLoginSuccessful(iUser);
            setShow(false);
        } catch (error) { console.error(error); }
    }

    return (
        <>
            <Button variant="dark" onClick={() => setShow(true)}> Login </Button>
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton><Modal.Title>Login</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Control
                            className="mb-3"
                            type="text"
                            placeholder="username"
                            autoFocus
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
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

export default IssuerLoginModal;