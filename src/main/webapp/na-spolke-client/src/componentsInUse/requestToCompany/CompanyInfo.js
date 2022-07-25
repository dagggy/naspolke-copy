import {Container} from "@mui/material";
import "./RequestToCompany.module.css";
import ModalTop from "../modal/ModalTop";
import React, {useState} from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const CompanyInfo = ({ companyData, krsNumber }) => {

    const axiosPrivate = useAxiosPrivate();

    const successfullyRequestMessage = {
        title: "Prośba wysłana",
        text: "Twoja prośba o dołączenie do spółki została wysłana." +
            "Status akceptacji możesz sprawdzić w swoim logu wydarzeń."
    }

    const errorRequestMessage = {
        title: "Nieoczekiwany błąd",
        text: "Niestety coś poszło nie tak. Spróbuj ponownie za kilka minut."
    }

    const [successfullyRequest, setSuccessfullyRequest] = useState(false);
    const [errorRequest, setErrorRequest] = useState(false);
    const backToPreviousSuccessfullyState = () => setSuccessfullyRequest(false);
    const backToPreviousErrorState = () => setErrorRequest(false);

    // //TODO: get User Id from session
    // let [loggedUserId, setLoggedUserId] = useState("");
    // //TODO
    let [messageText, setMessageText] = useState("");

    function handleStatusChange() {
        // setLoggedUserId(loggedUserId = "5bd0f8e1-adf1-4c4d-ac6f-119ece595f3d");
        setMessageText(messageText = "Użytkownik o podanym adresie email wysłał prośbę o dołączenie do spółki");
    }

    // const sendRequest = (e) => {
    //     handleStatusChange();
    //     e.preventDefault();
    //     const userData = {loggedUserId, messageText};
    //     console.log(userData)
    //     fetch(`http://localhost:8080/send-request-for-membership/${krsNumber}`, {
    //         method: "POST",
    //         headers: {"Content-Type": "application/json"},
    //         body: JSON.stringify(userData)
    //     }).then(response => {
    //         if (response.status === 200) {
    //             setSuccessfullyRequest(true);
    //             setTimeout(backToPreviousSuccessfullyState, 4000);
    //             return response.blob();
    //         } else {
    //             setErrorRequest(true);
    //             setTimeout(backToPreviousErrorState, 4000);
    //             throw new Error('Send request failed!');
    //         }
    //     }).catch(() => {console.log("Something went wrong!")})
    // }

    const sendRequest = (e) => {
        handleStatusChange();
        e.preventDefault();
        const userData = {messageText};
        console.log(userData)
        axiosPrivate.post(`/send-request-for-membership/${krsNumber}`, {
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(userData)
        }).then(response => {
            if (response.status === 200) {
                setSuccessfullyRequest(true);
                setTimeout(backToPreviousSuccessfullyState, 4000);
                return response.data;
            } else {
                setErrorRequest(true);
                setTimeout(backToPreviousErrorState, 4000);
                throw new Error('Send request failed!');
            }
        }).catch(() => {console.log("Something went wrong!")})
    }

    return (
        <Container className="request-form-container">
            <h3>{companyData.companyName}</h3>
            <button className="btn btn-success" onClick={sendRequest}>Wyślij prośbę</button>
            {successfullyRequest && <ModalTop info={successfullyRequestMessage} />}
            {errorRequest && <ModalTop info={errorRequestMessage} />}
        </Container>
    )
}

export default CompanyInfo