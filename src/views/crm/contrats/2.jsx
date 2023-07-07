import React from 'react';

// material-ui
import { Button, Step, Stepper, StepLabel, Stack, Typography, Grid, TextField, MenuItem } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { Box } from '@mui/system';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import TextEditor from './TextEditor';
import { useGetUsers } from 'services/users.service';
import { useState } from 'react';

// step options
const steps = ['Shipping address', 'Payment details', 'Review your order'];

const InformationsGenerales = ({
  clientLead,
  clients,
  marquePAC,
  handleFirstMiseEnPlaceDateChange,
  handleClientLeadChange,
  handleMarquePACChange,
  firstMiseEnPlaceDate,
  handleContratStartDateChange,
  contratStartDate,
  duration,
  contratEndDate,
  handleContratEndDateChange
}) => {
  return (
    <Box component="form" noValidate autoComplete="off">
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              id="clientLead"
              select
              fullWidth
              variant="standard"
              label="Client / Lead"
              defaultValue="1"
              value={clientLead}
              onChange={handleClientLeadChange}
              helperText="Veuillez sélectionner un client / lead"
              required
            >
              {clients.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="marque-pac"
              fullWidth
              variant="standard"
              label="Marque PAC"
              placeholder="Marque PAC"
              value={marquePAC || 'Marque PAC'}
              onChange={handleMarquePACChange}
              helperText="Veuillez sélectionner une marque PAC"
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <DesktopDatePicker
              label="Date de 1er Mise En Place"
              inputFormat="dd/MM/yyyy"
              value={firstMiseEnPlaceDate}
              onChange={handleFirstMiseEnPlaceDateChange}
              renderInput={(params) => <TextField fullWidth variant="standard" required {...params} />}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <DesktopDatePicker
              label="Date Début Contrat"
              inputFormat="dd/MM/yyyy"
              value={contratStartDate}
              onChange={handleContratStartDateChange}
              renderInput={(params) => <TextField fullWidth variant="standard" required {...params} />}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <DesktopDatePicker
              label="Date Fin Contrat"
              inputFormat="dd/MM/yyyy"
              value={contratEndDate}
              onChange={handleContratEndDateChange}
              renderInput={(params) => <TextField fullWidth variant="standard" required {...params} />}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="duree"
              fullWidth
              variant="standard"
              label="Durée en Jours"
              placeholder="Durée en Jours"
              value={duration}
              disabled
            />
          </Grid>
        </Grid>
      </LocalizationProvider>
    </Box>
  );
};

const DetailsInterventions = ({
  generateInterventionRows,
  nbrInterventions,
  handleNbrInterventionsChange,
  par,
  handlePar,
  interv,
  duration
}) => {
  return (
    <Box>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <TextField
              type="Number"
              id="nbr-interv"
              fullWidth
              variant="standard"
              label="Nombre d'interventions"
              placeholder="Nombre d'interventions"
              value={nbrInterventions}
              onChange={handleNbrInterventionsChange}
              helperText="Veuillez Selectionner Nombre d'interventions"
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              id="mode"
              select
              fullWidth
              variant="standard"
              label="Mode"
              defaultValue="0"
              value={par}
              onChange={handlePar}
              helperText="Veuillez Selectionner un Choix"
            >
              {interv.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={4}>
            <TextField
              id="duree"
              fullWidth
              variant="standard"
              label="Durée en Jours"
              placeholder="Durée en Jours"
              value={duration}
              disabled
            />
          </Grid>
        </Grid>

        {par !== '0' && nbrInterventions > 0 && (
          <Grid container spacing={2}>
            {generateInterventionRows()}
          </Grid>
        )}
      </LocalizationProvider>
    </Box>
  );
};
const DetailsContract = () => {
  return (
    <Box>
      {/* <TextEditor /> */}
      <div>
        <MainCard content={true}>
          <div>
            <TextEditor />
          </div>
        </MainCard>
      </div>
    </Box>
  );
};
const ModaliteFacturation = ({ modFacturation, handleModFacturationChange, modality }) => {
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            id="mode-facturation"
            select
            fullWidth
            variant="standard"
            label="Modalité de Facturation"
            defaultValue="0"
            value={modFacturation}
            onChange={handleModFacturationChange}
            helperText="Veuillez Selectionner La Modalité de Facturation"
          >
            {modality.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
    </Box>
  );
};

function getStepContent(step) {
  switch (step) {
    case 0:
      return <InformationsGenerales />;
    // case 1:
    //   return <DetailsInterventions />;
    // case 2:
    //   return <DetailsContract />;
    default:
      throw new Error('Unknown step');
  }
}

// const ContratCreatePage = () => {
//   const [activeStep, setActiveStep] = React.useState(0);

//   const handleNext = () => {
//     setActiveStep(activeStep + 1);
//   };

//   const handleBack = () => {
//     setActiveStep(activeStep - 1);
//   };

//   return (
//     <MainCard title="Basic">
//       <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
//         {steps.map((label) => (
//           <Step key={label}>
//             <StepLabel>{label}</StepLabel>
//           </Step>
//         ))}
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
//                 <Button variant="contained" color="error" onClick={() => setActiveStep(0)} sx={{ my: 3, ml: 1 }}>
//                   Reset
//                 </Button>
//               </AnimateButton>
//             </Stack>
//           </>
//         ) : (
//           <>
//             {getStepContent(activeStep)}
//             <Stack direction="row" justifyContent={activeStep !== 0 ? 'space-between' : 'flex-end'}>
//               {activeStep !== 0 && (
//                 <Button onClick={handleBack} sx={{ my: 3, ml: 1 }}>
//                   Back
//                 </Button>
//               )}
//               <AnimateButton>
//                 <Button variant="contained" onClick={handleNext} sx={{ my: 3, ml: 1 }}>
//                   {activeStep === steps.length - 1 ? 'Place order' : 'Next'}
//                 </Button>
//               </AnimateButton>
//             </Stack>
//           </>
//         )}
//       </>
//     </MainCard>
//   );
// };

const ContratCreatePage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [clientData, setClientData] = useState({});
  const [errorIndex, setErrorIndex] = useState(null);
  const getClientsQuery = useGetUsers({ role: 'client', paginated: false });
  const [formErrors, setFormErrors] = useState({});
  const [formInput, setFormInput] = useState({
    title: '',
    date_debut: '',
    date_fin: '',
    description: '',
    pdf_path: '',
    client_id: '',
    nb_interventions: '',
    mise_en_place_date: '',
    marque_pac_parents: ''
  });
  const handleChange = (e) => {
    setFormInput({
      ...formInput,
      [e.target.name]: e.target.value
    });
  };

  console.log(getClientsQuery);

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
                  // onClick={() => {
                  //   setShippingData({});
                  //   setPaymentData({});
                  //   setActiveStep(0);
                  // }}
                  sx={{ my: 3, ml: 1 }}
                >
                  Reset
                </Button>
              </AnimateButton>
            </Stack>
          </>
        ) : (
          <>
            {getStepContent(activeStep, handleNext, handleBack, setErrorIndex, clientData, setClientData, formInput, setFormInput)}
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
export default ContratCreatePage;
