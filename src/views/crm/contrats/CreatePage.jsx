// import React from 'react';

// // material-ui
// import { Button, Step, Stepper, StepLabel, Stack, Typography } from '@mui/material';

// // project imports
// import MainCard from 'ui-component/cards/MainCard';
// import AnimateButton from 'ui-component/extended/AnimateButton';

// // step options
// const steps = ['Shipping address', 'Payment details', 'Review your order'];

// const InformationsGenerales = ({
//   clientLead,
//   clients,
//   marquePAC,
//   handleFirstMiseEnPlaceDateChange,
//   handleClientLeadChange,
//   handleMarquePACChange,
//   firstMiseEnPlaceDate,
//   handleContratStartDateChange,
//   contratStartDate,
//   duration,
//   contratEndDate,
//   handleContratEndDateChange
// }) => {
//   return (
//     <Box component="form" noValidate autoComplete="off">
//       <LocalizationProvider dateAdapter={AdapterDateFns}>
//         <Grid container spacing={2}>
//           <Grid item xs={6}>
//             <TextField
//               id="clientLead"
//               select
//               fullWidth
//               variant="standard"
//               label="Client / Lead"
//               defaultValue="1"
//               value={clientLead}
//               onChange={handleClientLeadChange}
//               helperText="Veuillez sélectionner un client / lead"
//               required
//             >
//               {clients.map((option) => (
//                 <MenuItem key={option.value} value={option.value}>
//                   {option.label}
//                 </MenuItem>
//               ))}
//             </TextField>
//           </Grid>
//           <Grid item xs={6}>
//             <TextField
//               id="marque-pac"
//               fullWidth
//               variant="standard"
//               label="Marque PAC"
//               placeholder="Marque PAC"
//               value={marquePAC || 'Marque PAC'}
//               onChange={handleMarquePACChange}
//               helperText="Veuillez sélectionner une marque PAC"
//               required
//             />
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <DesktopDatePicker
//               label="Date de 1er Mise En Place"
//               inputFormat="dd/MM/yyyy"
//               value={firstMiseEnPlaceDate}
//               onChange={handleFirstMiseEnPlaceDateChange}
//               renderInput={(params) => <TextField fullWidth variant="standard" required {...params} />}
//             />
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <DesktopDatePicker
//               label="Date Début Contrat"
//               inputFormat="dd/MM/yyyy"
//               value={contratStartDate}
//               onChange={handleContratStartDateChange}
//               renderInput={(params) => <TextField fullWidth variant="standard" required {...params} />}
//             />
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <DesktopDatePicker
//               label="Date Fin Contrat"
//               inputFormat="dd/MM/yyyy"
//               value={contratEndDate}
//               onChange={handleContratEndDateChange}
//               renderInput={(params) => <TextField fullWidth variant="standard" required {...params} />}
//             />
//           </Grid>
//           <Grid item xs={6}>
//             <TextField
//               id="duree"
//               fullWidth
//               variant="standard"
//               label="Durée en Jours"
//               placeholder="Durée en Jours"
//               value={duration}
//               disabled
//             />
//           </Grid>
//         </Grid>
//       </LocalizationProvider>
//     </Box>
//   );
// };

// const getStepContent = (step, handleNext, handleBack, setErrorIndex, shippingData, setShippingData, paymentData, setPaymentData) => {
//   switch (step) {
//     case 0:
//       return (
//         <InformationsGenerales
//           handleNext={handleNext}
//           setErrorIndex={setErrorIndex}
//           informationsGeneralesData={informationsGeneralesData}
//           setInformationsGeneralesData={setInformationsGeneralesData}
//         />
//       );
//     case 1:
//       return (
//         <PaymentForm
//           handleNext={handleNext}
//           handleBack={handleBack}
//           setErrorIndex={setErrorIndex}
//           paymentData={paymentData}
//           setPaymentData={setPaymentData}
//         />
//       );
//     case 2:
//       return <Review />;
//     default:
//       throw new Error('Unknown step');
//   }
// };

// // ==============================|| FORMS WIZARD - BASIC ||============================== //

// const ValidationWizard = () => {
//   const [activeStep, setActiveStep] = React.useState(0);
//   const [informationsGeneralesData, setInformationsGeneralesData] = React.useState({});
//   const [errorIndex, setErrorIndex] = React.useState(null);

//   const handleNext = () => {
//     setActiveStep(activeStep + 1);
//     setErrorIndex(null);
//   };

//   const handleBack = () => {
//     setActiveStep(activeStep - 1);
//   };

//   return (
//     <MainCard title="Validation">
//       <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
//         {steps.map((label, index) => {
//           const labelProps = {};

//           if (index === errorIndex) {
//             labelProps.optional = (
//               <Typography variant="caption" color="error">
//                 Error
//               </Typography>
//             );

//             labelProps.error = true;
//           }

//           return (
//             <Step key={label}>
//               <StepLabel {...labelProps}>{label}</StepLabel>
//             </Step>
//           );
//         })}
//       </Stepper>
//       <>
//         {activeStep === steps.length ? (
//           <>
//             <Typography variant="h5" gutterBottom>
//               Thank you for your order.
//             </Typography>
//             <Typography variant="subtitle1">
//               Your order number is #2001539. We have emailed your order confirmation, and will send you an update when your order has
//               shipped.
//             </Typography>
//             <Stack direction="row" justifyContent="flex-end">
//               <AnimateButton>
//                 <Button
//                   variant="contained"
//                   color="error"
//                   onClick={() => {
//                     setShippingData({});
//                     setPaymentData({});
//                     setActiveStep(0);
//                   }}
//                   sx={{ my: 3, ml: 1 }}
//                 >
//                   Reset
//                 </Button>
//               </AnimateButton>
//             </Stack>
//           </>
//         ) : (
//           <>
//             {getStepContent(activeStep, handleNext, handleBack, setErrorIndex, informationsGeneralesData, setInformationsGeneralesData)}
//             {activeStep === steps.length - 1 && (
//               <Stack direction="row" justifyContent={activeStep !== 0 ? 'space-between' : 'flex-end'}>
//                 {activeStep !== 0 && (
//                   <Button onClick={handleBack} sx={{ my: 3, ml: 1 }}>
//                     Back
//                   </Button>
//                 )}
//                 <AnimateButton>
//                   <Button variant="contained" onClick={handleNext} sx={{ my: 3, ml: 1 }}>
//                     {activeStep === steps.length - 1 ? 'Place order' : 'Next'}
//                   </Button>
//                 </AnimateButton>
//               </Stack>
//             )}
//           </>
//         )}
//       </>
//     </MainCard>
//   );
// };

// export default ValidationWizard;

import React from 'react';

// material-ui
import { Button, Step, Stepper, StepLabel, Stack, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import ContratDetailsForm from './create-wizard/ContratDetailsForm';
import OperationsDetailsForm from './create-wizard/OperationsDetailsForm';
import Review from './create-wizard/Review';
import InformationsGenerales from './create-wizard/InformationsGeneralesForm';

// step options
const steps = ['Crée contrat', 'Ajouter Details Interventions', 'Modifier Détails Contrats', 'Consulter Contrats', 'Mode Facturation'];

const getStepContent = (step, handleNext, handleBack, setErrorIndex, shippingData, setShippingData, paymentData, setPaymentData) => {
  switch (step) {
    case 0:
      return <InformationsGenerales handleNext={handleNext} setErrorIndex={setErrorIndex} />;
    case 1:
      return (
        <OperationsDetailsForm
          handleNext={handleNext}
          handleBack={handleBack}
          setErrorIndex={setErrorIndex}
          paymentData={paymentData}
          setPaymentData={setPaymentData}
        />
      );
    case 2:
      return <Review />;
    default:
      throw new Error('Unknown step');
  }
};

// ==============================|| FORMS WIZARD - BASIC ||============================== //

const ValidationWizard = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [shippingData, setShippingData] = React.useState({});
  const [paymentData, setPaymentData] = React.useState({});
  const [errorIndex, setErrorIndex] = React.useState(null);
  const [clientData, setClientData] = React.useState({});

  const handleNext = () => {
    setActiveStep(activeStep + 1);
    setErrorIndex(null);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <MainCard title="Contract Wizard">
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
            <Typography variant="h5" gutterBottom>
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
                    setShippingData({});
                    setPaymentData({});
                    setActiveStep(0);
                  }}
                  sx={{ my: 3, ml: 1 }}
                >
                  Reset
                </Button>
              </AnimateButton>
            </Stack>
          </>
        ) : (
          <>
            {getStepContent(activeStep, handleNext, handleBack, setErrorIndex, shippingData, setShippingData, paymentData, setPaymentData)}
            {activeStep === steps.length - 1 && (
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
            )}
          </>
        )}
      </>
    </MainCard>
  );
};

export default ValidationWizard;
