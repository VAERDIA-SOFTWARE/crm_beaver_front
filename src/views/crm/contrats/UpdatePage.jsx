import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Button, Grid, MenuItem, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import { Box } from '@mui/system';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { useState } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import TextEditor from './TextEditor';
import { useNavigate } from 'react-router-dom';

const ContratCreatePage = () => {
  // States
  const [activeTab, setActiveTab] = useState('1');
  const navigate = useNavigate();

  // TAB 1

  const [clientLead, setClientLead] = useState('0');
  const [marquePAC, setMarquePAC] = useState('');
  const [firstMiseEnPlaceDate, setFirstMiseEnPlaceDate] = useState(null);
  const [contratStartDate, setContratStartDate] = useState(null);
  const [contratEndDate, setContratEndDate] = useState(null);
  const [duration, setDuration] = useState(0);

  // TAB 2

  const [nbrInterventions, setNbrInterventions] = useState('');
  const [interventionDates, setInterventionDates] = useState([]);

  // TAB 3
  const [par, setPar] = useState('0');

  // TAB 4
  const [modFacturation, setModFacturation] = useState('0');

  // Handlers

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // TAB 1

  const handleClientLeadChange = (event) => {
    setClientLead(event.target.value);
  };

  const handleMarquePACChange = (event) => {
    setMarquePAC(event.target.value);
  };

  const handleFirstMiseEnPlaceDateChange = (date) => {
    setFirstMiseEnPlaceDate(date);
  };

  const handleContratStartDateChange = (date) => {
    setContratStartDate(date);
  };

  const handleContratEndDateChange = (date) => {
    setContratEndDate(date);
    const diffInTime = date.getTime() - contratStartDate.getTime();
    const diffInDays = Math.ceil(diffInTime / (1000 * 3600 * 24));
    setDuration(diffInDays);
  };

  // TAB 2
  const handleNbrInterventionsChange = (event) => {
    const value = event.target.value;
    setNbrInterventions(value);

    const dates = Array.from({ length: value }, () => null);
    setInterventionDates(dates);
  };

  const handlePar = (event) => {
    setPar(event.target.value);
  };

  const handleInterventionDateChange = (index, date) => {
    setInterventionDates((prevDates) => {
      const updatedDates = [...prevDates];
      updatedDates[index] = date;
      return updatedDates;
    });
  };

  // TAB 3

  // TAB 4
  const handleModFacturationChange = (event) => {
    setModFacturation(event.target.value);
  };

  // Client / Leads Select

  const clients = [
    {
      value: '0',
      label: 'Client / Lead'
    },
    {
      value: '1',
      label: 'Client 1'
    },
    {
      value: '2',
      label: 'Client 2'
    },
    {
      value: '3',
      label: 'Client 3'
    },
    {
      value: '4',
      label: 'Lead 1'
    },
    {
      value: '5',
      label: 'Lead 2'
    },
    {
      value: '6',
      label: 'Lead 3'
    }
  ];

  // Modalité de Facturation Select

  const modality = [
    {
      value: '0',
      label: 'Modalité de Facturation'
    },
    {
      value: '1',
      label: 'Par Mois'
    },
    {
      value: '2',
      label: 'Par An'
    },
    {
      value: '3',
      label: 'Par Triméstre'
    },
    {
      value: '4',
      label: 'Par Semestre'
    }
  ];
  const generateInterventionRows = () => {
    if (par === '1' && duration > 0) {
      const numberOfMonths = Math.ceil(duration / 30); // Assuming each month has 30 days
      const rows = [];

      for (let i = 0; i < numberOfMonths; i++) {
        for (let j = 0; j < nbrInterventions; j++) {
          const interventionIndex = i * nbrInterventions + j;
          rows.push(
            <TableRow key={interventionIndex}>
              <TableCell>
                Intervention {interventionIndex + 1} Moi {i + 1}
              </TableCell>
              <TableCell>
                <DesktopDatePicker
                  label={`Intervention ${interventionIndex + 1} Date`}
                  inputFormat="dd/MM/yyyy"
                  value={interventionDates[interventionIndex]}
                  onChange={(date) => handleInterventionDateChange(interventionIndex, date)}
                  renderInput={(params) => <TextField fullWidth variant="standard" {...params} />}
                  minDate={contratStartDate}
                  maxDate={contratEndDate}
                />
              </TableCell>
            </TableRow>
          );
        }
      }

      return (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Intervention</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{rows}</TableBody>
          </Table>
        </TableContainer>
      );
    }
    if (par === '2' && duration > 0) {
      const numberOfYears = Math.ceil(duration / 365); // Assuming each month has 30 days
      const rows = [];

      for (let i = 0; i < numberOfYears; i++) {
        for (let j = 0; j < nbrInterventions; j++) {
          const interventionIndex = i * nbrInterventions + j;
          rows.push(
            <TableRow key={interventionIndex}>
              <TableCell>
                Intervention {interventionIndex + 1} An {i + 1}
              </TableCell>
              <TableCell>
                <DesktopDatePicker
                  label={`Intervention ${interventionIndex + 1} Date`}
                  inputFormat="dd/MM/yyyy"
                  value={interventionDates[interventionIndex]}
                  onChange={(date) => handleInterventionDateChange(interventionIndex, date)}
                  renderInput={(params) => <TextField fullWidth variant="standard" {...params} />}
                  minDate={contratStartDate}
                  maxDate={contratEndDate}
                />
              </TableCell>
            </TableRow>
          );
        }
      }

      return (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Intervention</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{rows}</TableBody>
          </Table>
        </TableContainer>
      );
    }

    return null;
  };

  const interv = [
    {
      value: '0',
      label: 'Par Mois / Par An'
    },
    {
      value: '1',
      label: 'Par Mois'
    },
    {
      value: '2',
      label: 'Par An'
    }
  ];
  const handlePreviousTab = () => {
    setActiveTab((prevTab) => {
      const previousTab = parseInt(prevTab) - 1;
      return previousTab.toString();
    });
  };

  const handleNextTab = () => {
    if (activeTab === '1') {
      // Validate form for Tab 1
      if (clientLead !== '0' && marquePAC !== '' && firstMiseEnPlaceDate && contratStartDate && contratEndDate && duration > 0) {
        setActiveTab('2');
      }
    } else if (activeTab === '2') {
      // Validate form for Tab 2
      if (nbrInterventions !== '' && par !== '0' && duration > 0 && interventionDates.length === parseInt(nbrInterventions)) {
        setActiveTab('3');
      }
    } else if (activeTab === '3') {
      // Validate form for Tab 3 (assuming there is a form to validate)
      // You can add your own form validation logic here
      setActiveTab('4');
    }
  };

  const handleSubmit = () => {
    // Validate form for Tab 4 (assuming there is a form to validate)
    // You can add your own form validation logic here
    if (modFacturation !== '0') {
      // Gather form data
      const formData = {
        clientLead,
        marquePAC,
        firstMiseEnPlaceDate,
        contratStartDate,
        contratEndDate,
        duration,
        nbrInterventions,
        par,
        modFacturation
      };
      console.log('formData', formData);
      localStorage.setItem('formData', JSON.stringify(formData));

      // Perform any additional actions (e.g., saving data)

      // Redirect or navigate to the desired page
      navigate('/contrats/list');
    }
  };

  return (
    <MainCard title="Editer un Contrat" backButton>
      <TabContext value={activeTab}>
        <TabList>
          <Tab label="Informations Générales" value="1" disabled />
          <Tab label="Détails de l'interventions" value="2" disabled />
          <Tab label="Détails du contrat" value="3" disabled />
          <Tab label="Modalité de Facturation" value="4" disabled />
        </TabList>
        <TabPanel value="1">
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
        </TabPanel>
        <TabPanel value="2">
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
        </TabPanel>
        <TabPanel value="3">
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
        </TabPanel>
        <TabPanel value="4">
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
        </TabPanel>
        <Box mt={2} display="flex" justifyContent="space-between">
          {activeTab !== '1' ? (
            <Button variant="contained" color="primary" onClick={handlePreviousTab}>
              Previous
            </Button>
          ) : (
            <Button variant="contained" color="primary" onClick={handlePreviousTab} disabled>
              Previous
            </Button>
          )}
          {activeTab !== '4' ? (
            <Button variant="contained" color="primary" onClick={handleNextTab}>
              Next
            </Button>
          ) : (
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit
            </Button>
          )}
        </Box>
      </TabContext>
    </MainCard>
  );
};

export default ContratCreatePage;
