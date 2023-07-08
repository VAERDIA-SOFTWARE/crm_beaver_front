import {
  Autocomplete,
  Button,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from '@mui/material';
import { Box, Stack } from '@mui/system';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import moment from 'moment';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useGetUsers } from 'services/users.service';
import renderArrayMultiline from 'utilities/utilities';
import PropTypes from 'prop-types';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { useCreateContrat, useGetContrat, useGetMarquePAC } from 'services/contrats.service';
import { useGetModeInterventions } from 'services/interventions.service';
import { useCreateArticleContrat } from 'services/articles.service';
import InterventionRows from './ArticleRow';

const DetailsInterventions = ({ handleNext, handleBack }) => {
  const duration = localStorage.getItem('duree');
  console.log('====================================');
  console.log(duration);
  console.log('====================================');
  const contractId = localStorage.getItem('contractId');

  const location = useLocation();
  const clientId = location.state?.clientId;
  const [formErrors, setFormErrors] = useState({});
  const [formInput, setFormInput] = useState({
    mode_id: '',
    nb_interventions: '',
    article: [{ prix_unitaire: '', remise: '', date_prevu: '' }]
  });
  const handleChange = (e) => {
    setFormInput({
      ...formInput,
      [e.target.name]: e?.target?.value
    });
  };
  const createArticleContratMutation = useCreateArticleContrat({ contractId });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});

    try {
      const formattedInput = {
        ...formInput,
        date_debut: format(formInput?.date_debut, 'yyyy-MM-dd'),
        date_fin: format(formInput?.date_fin, 'yyyy-MM-dd'),
        mise_en_place_date: format(formInput?.date_debut, 'yyyy-MM-dd')
      };
      await createArticleContratMutation.mutateAsync(formattedInput);
      handleNext(1);
      //   navigate('/contrats/list');
    } catch (error) {
      const errorsObject = error?.response?.data;
      setFormErrors(errorsObject);
    }
  };
  const getContractQuery = useGetContrat(contractId);
  const contractData = getContractQuery?.data;

  const getModeInterventionsQuery = useGetModeInterventions();

  const [selectedModeValue, setSelectedModeValue] = useState('');
  const [selectedModeIntitule, setSelectedModeIntitule] = useState('');
  return (
    <Box component="form" noValidate onSubmit={handleSubmit} autoComplete="off">
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              variant="standard"
              type="number"
              fullWidth
              label="Nombre des Interventions"
              value={formInput?.nb_interventions || ''}
              name="nb_interventions"
              onChange={handleChange}
              error={!!formErrors?.data?.nb_interventions}
              helperText={renderArrayMultiline(formErrors?.data?.nb_interventions)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Autocomplete
              onChange={(event, newValue) => {
                setFormInput((formData) => {
                  return { ...formData, mode_id: newValue?.id };
                });
                setSelectedModeValue(newValue?.valeur);
                setSelectedModeIntitule(newValue?.intitule);
              }}
              multiple={false}
              options={getModeInterventionsQuery?.data || []}
              getOptionLabel={(option) => option?.intitule}
              renderInput={(params) => (
                <TextField
                  required
                  variant="standard"
                  {...params}
                  label="Selectionner une Mode"
                  error={!!formErrors?.data?.mode_id}
                  helperText={renderArrayMultiline(formErrors?.data?.mode_id)}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={4}>
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
          <Divider />

          {formInput?.mode_id !== '0' && formInput?.nb_interventions > 0 && (
            <Grid container spacing={2}>
              <InterventionRows
                selectedMode={formInput?.mode_id}
                selectedModeValue={selectedModeValue}
                // selectedModeIntitule={selectedModeIntitule}
                duration={duration}
                nbrInterventions={formInput?.nb_interventions}
                contratStartDate={contractData?.date_debut}
                contratEndDate={contractData?.date_fin}
              />
            </Grid>
            // <>test</>
          )}
          <Grid item xs={12}>
            <Stack direction="row" justifyContent="space-between">
              <Button onClick={handleBack} sx={{ my: 3, ml: 1 }}>
                Back
              </Button>
              <AnimateButton>
                <Button variant="contained" type="submit" sx={{ my: 3, ml: 1 }}>
                  Next
                </Button>
              </AnimateButton>
            </Stack>
          </Grid>
        </Grid>
      </LocalizationProvider>
    </Box>
  );
};
DetailsInterventions.propTypes = {
  shippingData: PropTypes.object,
  setShippingData: PropTypes.func,
  handleNext: PropTypes.func
};
export default DetailsInterventions;
