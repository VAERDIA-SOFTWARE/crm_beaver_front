import React, { useState } from 'react';

// material-ui
import { Button, Step, Stepper, StepLabel, Stack, Typography, CircularProgress } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import InformationsGenerales from './InformationsGeneralesForm';
import ContratSqueletteDetails from './ContratDetailsForm';
import ContratSquelette from './ContratDetails';
import DetailsInterventions from './OperationsDetailsForm';
import { useLocation } from 'react-router-dom';
import { useGetContrat } from 'services/contrats.service';
import { useEffect } from 'react';
import moment from 'moment/moment';
import { Box } from '@mui/system';

// step options
const steps = ['Crée contrat', 'Ajouter Details Interventions', 'Modifier Détails Contrats', 'Consulter Contrats'];

const stepContent = (contractForm, setContractForm, step, handleNext, handleBack, setErrorIndex, contractId, setcontractId) => {
  console.log(contractForm);
  switch (step) {
    case 0:
      return (
        <InformationsGenerales
          contractForm={contractForm}
          setContractForm={setContractForm}
          handleNext={handleNext}
          contractId={contractId}
          setcontractId={setcontractId}
          setErrorIndex={setErrorIndex}
        />
      );
    case 1:
      return (
        <DetailsInterventions
          handleNext={handleNext}
          contractForm={contractForm}
          setContractForm={setContractForm}
          handleBack={handleBack}
          setErrorIndex={setErrorIndex}
        />
      );
    case 2:
      return (
        <ContratSqueletteDetails
          step={step}
          handleNext={handleNext}
          contractForm={contractForm}
          handleBack={handleBack}
          setErrorIndex={setErrorIndex}
        />
      );
    case 3:
      return <ContratSquelette handleNext={handleNext} contractId={contractId} handleBack={handleBack} setErrorIndex={setErrorIndex} />;
    default:
      return <></>;
  }
};

const CreatePage = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [errorIndex, setErrorIndex] = React.useState(null);
  const location = useLocation();
  const clientId = location.state?.clientId;
  const handleNext = () => {
    setActiveStep(activeStep + 1);
    setErrorIndex(null);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };
  const [contractForm, setContractForm] = useState({
    id: null,
    titre: '',
    description: '',
    date_debut: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
    date_fin: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
    client_id: clientId || null,
    marque_pac_parents: '',
    mise_en_place_date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
    facture_mode_id: '',
    mode_id: 1,
    nb_interventions: 1,
    articles: '',
    operations: []
  });
  const getContractQuery = useGetContrat(contractForm?.id);
  const ContractData = getContractQuery?.data;
  useEffect(() => {
    if (getContractQuery?.isSuccess && activeStep) {
      setContractForm((f) => {
        return {
          ...f,
          ...ContractData
        };
      });
    }
  }, [getContractQuery?.isSuccess, ContractData, activeStep]);
  return (
    <MainCard title="Crée Contrat">
      <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
        {steps.map((label, index) => {
          const labelProps = {};

          if (index === errorIndex) {
            labelProps.optional = (
              <Typography variant="caption" color="error">
                Error
              </Typography>
            );

            labelProps.error = true;
          }

          return (
            <Step key={label}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <>
        {activeStep === steps.length ? (
          <>
            {/* <Typography variant="h5" gutterBottom>
              Thank you for your order.
            </Typography>
            <Typography variant="subtitle1">
              Your order number is #2001539. We have emailed your order confirmation, and will send you an update when your order has
              shipped.
            </Typography>
            <Stack direction="row" justifyContent="flex-end">
              <AnimateButton>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => {
                    setActiveStep(0);
                  }}
                  sx={{ my: 3, ml: 1 }}
                >
                  Reset
                </Button>
              </AnimateButton>
            </Stack> */}
          </>
        ) : (
          <>
            {!getContractQuery?.isFetching ? (
              stepContent(contractForm, setContractForm, activeStep, handleNext, handleBack, setErrorIndex)
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <CircularProgress sx={{ width: 100 }} />
              </Box>
            )}
            {/* {getStepContent(contractForm, setContractForm, activeStep, handleNext, handleBack, setErrorIndex, contractId, setcontractId)} */}
            {/* {activeStep === steps.length - 1 && (
              <Stack direction="row" justifyContent={activeStep !== 0 ? 'space-between' : 'flex-end'}>
                {activeStep !== 0 && (
                  <Button onClick={handleBack} sx={{ my: 3, ml: 1 }}>
                    Back
                  </Button>
                )}
                <AnimateButton>
                  <Button variant="contained" onClick={handleNext} sx={{ my: 3, ml: 1 }}>
                    {activeStep === steps.length - 1 ? 'Place order' : 'Next'}
                  </Button>
                </AnimateButton>
              </Stack>
            )} */}
          </>
        )}
      </>
    </MainCard>
  );
};

export default CreatePage;
