
import { ConflictError } from "../network/HttpErrors";
import * as SSIapi from "../network/SSIapi";
import { IUser, RegisterCredential } from "../network/Interface";
import { Button, Form, Modal } from "react-bootstrap";
import { useEffect, useState } from "react";

const SuccessModal = ( ) => {
    const [show, setShow] = useState(false);
    const onSubmit = () => {
        setShow(false)
    }
    return (
        <>
        <Button variant="dark" onClick={() => setShow(true)}> Success </Button>
        <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton><Modal.Title>Success</Modal.Title></Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Text>Congratulations</Form.Text>
                </Form>
            </Modal.Body>
            <Modal.Footer> <Button variant="secondary" onClick={onSubmit}> close </Button></Modal.Footer>
        </Modal>
        </>
    );
};

export default SuccessModal;