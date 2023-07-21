import React from 'react';

// material-ui
import { Button, Step, Stepper, StepLabel, Stack, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import InformationsGenerales from './InformationsGeneralesForm';
import ContratSqueletteDetails from './ContratDetailsForm';
import ContratSquelette from './ContratDetails';
import DetailsInterventions from './OperationsDetailsForm';

// step options
const steps = ['Crée contrat', 'Ajouter Details Interventions', 'Modifier Détails Contrats', 'Consulter Contrats'];

const getStepContent = (step, handleNext, handleBack, setErrorIndex, contractId, setcontractId) => {
  switch (step) {
    case 0:
      return (
        <InformationsGenerales
          handleNext={handleNext}
          contractId={contractId}
          setcontractId={setcontractId}
          setErrorIndex={setErrorIndex}
        />
      );
    case 1:
      return <DetailsInterventions handleNext={handleNext} contractId={contractId} handleBack={handleBack} setErrorIndex={setErrorIndex} />;
    case 2:
      return (
        <ContratSqueletteDetails
          step={step}
          handleNext={handleNext}
          contractId={contractId}
          handleBack={handleBack}
          setErrorIndex={setErrorIndex}
        />
      );
    case 3:
      return <ContratSquelette handleNext={handleNext} contractId={contractId} handleBack={handleBack} setErrorIndex={setErrorIndex} />;
    default:
      throw new Error('Unknown step');
  }
};

const CreatePage = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [errorIndex, setErrorIndex] = React.useState(null);
  const [contractId, setcontractId] = React.useState('');

  const handleNext = () => {
    setActiveStep(activeStep + 1);
    setErrorIndex(null);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

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
            {getStepContent(activeStep, handleNext, handleBack, setErrorIndex, contractId, setcontractId)}
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
