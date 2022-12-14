import React, { useState } from "react";
import {Button, Modal } from "react-bootstrap";

const ModalTop = ({ info }) => {

    const [show, setShow] = useState(true);

    const handleClose = () => {
        setShow(false);
        setTimeout(backToPreviousState, 5000);
    }
    const backToPreviousState = () => setShow(true);

    return (
        <>
            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>{ info.title }</Modal.Title>
                </Modal.Header>
                <Modal.Body>{ info.text }</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleClose}>Ok</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalTop