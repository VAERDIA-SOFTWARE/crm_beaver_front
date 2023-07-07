import { Autocomplete, Button, Grid, TextField } from '@mui/material';
import { Box, Stack } from '@mui/system';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import moment from 'moment';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGetUsers } from 'services/users.service';
import renderArrayMultiline from 'utilities/utilities';
import PropTypes from 'prop-types';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { useCreateContrat } from 'services/contrats.service';

const InformationsGenerales = ({ setErrorIndex, handleNext, handleBack }) => {
  const location = useLocation();
  const clientId = location.state?.clientId;
  const [formErrors, setFormErrors] = useState({});
  const [formInput, setFormInput] = useState({
    titre: '',
    date_debut: new Date(),
    date_fin: new Date(),
    description: '',
    client_id: clientId || null,
    nb_interventions: null,
    marque_pac_parents: [],
    mise_en_place_date: new Date()
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormInput({
      ...formInput,
      [e.target.name]: e.target.value
    });
  };
  const createClientMutation = useCreateContrat({ clientId });

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

      const formData = new FormData();
      for (let key in formattedInput) {
        formData.append(key, formattedInput[key]);
      }
      await createClientMutation.mutateAsync(formattedInput);
      handleNext(1);
      //   navigate('/contrats/list');
    } catch (error) {
      const errorsObject = error?.response?.data;
      setFormErrors(errorsObject);
    }
  };

  const getClientsQuery = useGetUsers({ role: 'client', paginated: false });
  return (
    <Box component="form" noValidate onSubmit={handleSubmit} autoComplete="off">
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              variant="standard"
              fullWidth
              label="Description"
              value={formInput?.titre || ''}
              name="titre"
              onChange={handleChange}
              error={!!formErrors?.data?.titre}
              helperText={renderArrayMultiline(formErrors?.data?.titre)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Autocomplete
              onChange={(event, newValue) => {
                setFormInput((formData) => {
                  return { ...formData, client_id: newValue?.id };
                });
              }}
              multiple={false}
              options={getClientsQuery?.data || []}
              getOptionLabel={(option) => option?.name}
              renderInput={(params) => (
                <TextField
                  required
                  variant="standard"
                  {...params}
                  label="Client*"
                  error={!!formErrors?.data?.client_id}
                  helperText={renderArrayMultiline(formErrors?.data?.client_id)}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Autocomplete
              onChange={(event, newValue) => {
                setFormInput((formData) => {
                  return { ...formData, marque_pac_parents: newValue ? newValue.map((value) => value.id) : [] };
                });
              }}
              multiple
              options={getClientsQuery?.data || []}
              getOptionLabel={(option) => option?.name}
              renderInput={(params) => (
                <TextField
                  required
                  variant="standard"
                  {...params}
                  label="Marque PAC*"
                  error={!!formErrors?.data?.marque_pac_parents}
                  helperText={renderArrayMultiline(formErrors?.data?.marque_pac_parents)}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <DesktopDatePicker
              label="Date de premiére Mise En Place"
              inputFormat="dd/MM/yyyy"
              value={moment(formInput?.mise_en_place_date, 'DD-MM-YYYY').toDate()}
              onChange={(v) => {
                try {
                  setFormInput((f) => {
                    return { ...f, mise_en_place_date: v };
                  });
                } catch (error) {}
              }}
              renderInput={(params) => (
                <TextField
                  required
                  variant="standard"
                  {...params}
                  error={!!formErrors?.data?.mise_en_place_date}
                  helperText={renderArrayMultiline(formErrors?.data?.mise_en_place_date)}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <DesktopDatePicker
              label="Date de début"
              inputFormat="dd/MM/yyyy"
              value={moment(formInput?.date_debut, 'DD-MM-YYYY').toDate()}
              onChange={(v) => {
                try {
                  setFormInput((f) => {
                    return { ...f, date_debut: v };
                  });
                } catch (error) {}
              }}
              renderInput={(params) => (
                <TextField
                  required
                  variant="standard"
                  {...params}
                  error={!!formErrors?.data?.date_debut}
                  helperText={renderArrayMultiline(formErrors?.data?.date_debut)}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <DesktopDatePicker
              label="Date de fin"
              inputFormat="dd/MM/yyyy"
              value={moment(formInput?.date_fin, 'DD-MM-YYYY').toDate()}
              onChange={(v) =>
                setFormInput((f) => {
                  return { ...f, date_fin: v };
                })
              }
              renderInput={(params) => (
                <TextField
                  required
                  variant="standard"
                  {...params}
                  error={!!formErrors?.data?.date_fin}
                  helperText={renderArrayMultiline(formErrors?.data?.date_fin)}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              variant="standard"
              fullWidth
              label="Description"
              value={formInput?.description || ''}
              name="description"
              onChange={handleChange}
              error={!!formErrors?.data?.description}
              helperText={renderArrayMultiline(formErrors?.data?.description)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              variant="standard"
              fullWidth
              label="Nombre d'interventions"
              value={formInput?.nb_interventions || ''}
              name="nb_interventions"
              onChange={handleChange}
              error={!!formErrors?.data?.nb_interventions}
              helperText={renderArrayMultiline(formErrors?.data?.nb_interventions)}
            />
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row" justifyContent="flex-end">
              <AnimateButton>
                <Button variant="contained" sx={{ my: 3, ml: 1 }} type="submit" onClick={() => setErrorIndex(0)}>
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
InformationsGenerales.propTypes = {
  shippingData: PropTypes.object,
  setShippingData: PropTypes.func,
  handleNext: PropTypes.func,
  setErrorIndex: PropTypes.func
};
export default InformationsGenerales;
