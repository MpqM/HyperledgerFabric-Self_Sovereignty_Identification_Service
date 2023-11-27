
import { ConflictError } from "../network/HttpErrors";
import * as SSIapi from "../network/SSIapi";
import { IUser, RegisterCredential } from "../network/Interface";
import { Button, Form, Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
interface RequireVPModalProps {
    roleAuth: {req: string, res: string}
}
const RequireVPModal = ({roleAuth}: RequireVPModalProps ) => {
    const [show, setShow] = useState(false);
    const [challenge, setChallenge] = useState('');
    useEffect(() => {
        if(show) {
            const authDIDChallenge = async() => {
                try {
                    const challenge = await SSIapi.authDIDChallenge(roleAuth.req);
                    setChallenge(challenge);
                    localStorage.setItem('vChallenge', challenge);
                } catch(error) { console.log(error);} }
            authDIDChallenge()
        }
    }, [show])

    const onSubmit = () => {setShow(false);}

    return (
        <>
        <Button variant="dark" onClick={() => setShow(true)}> ReqVP </Button>
        <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton><Modal.Title>ReqVP</Modal.Title></Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Text>VC: iden, univ</Form.Text>
                    <br />
                    <Form.Text>challegne: {challenge}</Form.Text> 
                </Form>
            </Modal.Body>
            <Modal.Footer> <Button variant="secondary" onClick={onSubmit}> close </Button></Modal.Footer>
        </Modal>
        </>
    );
};

export default RequireVPModal;