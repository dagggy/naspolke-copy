import React, {useState} from "react";
import KrsUserInput from "./krsInput/KrsUserInput";
import CompanyForm from "./companyForm/CompanyForm";
import {ModalErrorMessage} from "./companyForm/ModalFormKrsInputError";
import {Company} from "../../classes/company/Company";
import {Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import CompanyContextProvider from "./companyForm/CompanyContext";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import {Card, Typography} from "@material-ui/core";
import MKButton from "../../mkFiles/components/MKButton";
import {useLocation, useNavigate} from "react-router-dom";


const AddCompany = () => {

    const axiosPrivate = useAxiosPrivate();

    const [companyDataForm, setCompanyDataForm] = useState(<div/>);
    const [hideKrsInput, setHideKrsInput] = useState("block")
    const [companyFound, setCompanyFound] = useState(false);
    const [verifyDialogIsOpen, setVerifyDialogIsOpen] = useState(false);
    const [addCompanyInfo, setAddCompanyInfo] = useState("");
    const [toNavigate, setToNavigate] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/userpanel";


    const hideModal = () => {
      setCompanyDataForm(<div/>);
        setCompanyFound(false);
    }

    const handleClose = () => {
        setVerifyDialogIsOpen(false);
        if (toNavigate) {
            navigate(from, {replace: true});
        }
    }

    const handleOpen = (addingData, ifNavigate) => {
        setAddCompanyInfo(addingData);
        setVerifyDialogIsOpen(true);
        setToNavigate(ifNavigate);
    }

    const addCompanyForm = (data, companyName="") => {
        setCompanyFound(true);
        if (data === 404) {
            setCompanyDataForm(<ModalErrorMessage hide={hideModal}
                                                  messageTitle="Nie znaleziono.."
                                                  message={"Nie znaleziono firmy o podanym numerze KRS. " +
                                                      "Sprawd?? jego popranowno???? lub uzupe??nij dane samodzielnie"}
                                                  closeAndDisplay={closeAndDisplay}/>)
        } else if (data === 503) {
            setCompanyDataForm(<ModalErrorMessage hide={hideModal}
                                                  messageTitle={"Problem.."}
                                                  message={"Przepraszamy.. Z uwagi na przerw?? techniczn?? nie mo??na pobra?? danych sp????ki. " +
                                                      "Mo??esz spr??bowa?? p????niej lub uzupe??ni?? dane samodzielnie"}
                                                  closeAndDisplay={closeAndDisplay}/>)
        }  else if (data === 422) {
            console.log("ok")
            setCompanyDataForm(<ModalErrorMessage hide={hideModal}
                                                  messageTitle={"Problem.."}
                                                  message={`Przepraszamy "${companyName}" nie mo??e zosta?? dodana.` +
                                                      "Obecna wersja programu umo??liwia prawid??ow?? obs??ug?? wy????cznie sp????ek z ograniczon?? odpowiedzialno??ci??." +
                                                      "Mo??esz doda?? inn?? sp????ke samodzielnie lub anulowa??"}
                                                  closeAndDisplay={closeAndDisplay}/>)
        }else if (data.length === 3) {
            setCompanyDataForm(<ModalErrorMessage hide={hideModal}
                                                  messageTitle={"Problem.."}
                                                  message={"Wyst??pi?? problem z po??aczeniem. Mo??esz spr??bowa?? p????niej lub uzupe??ni?? dane samodzielnie"}
                                                  closeAndDisplay={closeAndDisplay}/>)
        } else if (data.data===null){
            setCompanyDataForm(<ModalErrorMessage hide={hideModal}
                                                  messageTitle={"Problem.."}
                                                  message={"Ta sp????ka zosta??a ju?? dodana. Sprawd?? Twoje repozytorium"}
                                                  closeAndDisplay={closeAndDisplay}/>)
        } else {
            setCompanyFound(true);
              const company = checkForCompanyData(data.data)
            setHideKrsInput("none")
              setCompanyDataForm(
                  <CompanyContextProvider company={company}>
                    <CompanyForm company={company} saveData={saveDataIntoDb}/>
                  </CompanyContextProvider>
              );
          }
      }

    function saveDataIntoDb(data){
        axiosPrivate.post("/add-company/", data)
            .then((response) => {
                if (response.status === 201) {
                    handleOpen(`Sp????ka ${response.data} zosta??a pomy??lnie dodana`, true);
                }
            })
            .catch((error) => {
                console.log(error)

                // alert(`Wyst??pi?? b????d. Sp????ka nie zosta??a dodana. Spr??buj ponownie p????niej.`)

                handleOpen(`Wyst??pi?? b????d. Sp????ka nie zosta??a dodana. Spr??buj ponownie p????niej.`, false);

            })
    }

    const closeAndDisplay = () => {
        setCompanyDataForm(<CompanyContextProvider company={new Company(null)}>
            <CompanyForm />
        </CompanyContextProvider>)
    }

    function checkForCompanyData(data) {
        if (data !== null) {
            return new Company(data)
        } else {
            return null;
        }
    }
    return (
        <div>
            <Card style={{ height: '10vh' }}>
                <Box sx={{ mx: "auto", width: 400, textAlign: 'center' }}>
                    <Typography variant="h3" component="div">Dodaj sp????k??</Typography>
                </Box>
            </Card><br/>
            {companyFound ?
            <Card><br/>
                <Box sx={{ mx: "auto" }}>
                    {companyDataForm}
                </Box>
            </Card> :
            <Card style={{ height: '15rem' }}>
                <Box sx={{ mx: "auto", width: 500 }}>
                    <Box style={{display: hideKrsInput, justifyContent:'center', alignItems:'center', height: '300vh'}}>
                        <KrsUserInput addCompanyData={addCompanyForm}/>
                    </Box>
                </Box>
            </Card>
            }
            {verifyDialogIsOpen &&
                <Dialog
                    open={verifyDialogIsOpen}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title" style={{ textAlign: 'center' }}>
                        {"U??ytkowniku"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {addCompanyInfo}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <MKButton onClick={handleClose} variant="gradient" color="info" fullWidth>Ok</MKButton>
                    </DialogActions>
                </Dialog>
            }
        </div>
    )
}

export default AddCompany;
