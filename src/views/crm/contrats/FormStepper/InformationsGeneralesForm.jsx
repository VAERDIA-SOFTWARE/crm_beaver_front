import { Autocomplete, Button, Grid, Skeleton, TextField } from '@mui/material';
import { Box, Stack } from '@mui/system';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGetUsers } from 'services/users.service';
import renderArrayMultiline from 'utilities/utilities';
import PropTypes from 'prop-types';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { useCreateContrat, useGetContrat, useGetMarquePAC, useGetModeFacturations, useUpdateContrat } from 'services/contrats.service';

const InformationsGenerales = ({ handleNext, contractId, setcontractId }) => {
  const location = useLocation();
  const clientId = location.state?.clientId;
  const [formErrors, setFormErrors] = useState({});
  const [formInput, setFormInput] = useState({
    titre: '',
    description: '',
    date_debut: new Date(),
    date_fin: new Date(),
    client_id: clientId || null,
    nb_interventions: '0',
    marque_pac_parents: '',
    mise_en_place_date: new Date(),
    facture_mode_id: ''
  });
  // const navigate = useNavigate();

  const getContractQuery = useGetContrat(contractId);
  const contratData = getContractQuery.data;

  console.log('============contratData===========');
  console.log(contratData);
  console.log('====================================');

  const handleChange = (e) => {
    setFormInput({
      ...formInput,
      [e.target.name]: e.target.value
    });
  };

  const createClientMutation = useCreateContrat({ clientId });
  const updateClientMutation = useUpdateContrat(contractId);
  console.log('================aaaaaaaaaa====================');
  console.log(contractId);
  console.log('====================================');
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
      if (contractId) {
        const response = await createClientMutation.mutateAsync(formattedInput);
        setcontractId(response?.data?.id);
      } else {
        await updateClientMutation.mutateAsync(formattedInput);
      }

      handleNext(1);
    } catch (error) {
      const errorsObject = error?.response?.data;
      setFormErrors(errorsObject);
    }
  };

  const getClientsQuery = useGetUsers({ role: 'client', paginated: false });
  const getMarquePACQuery = useGetMarquePAC();
  const getModeFacturationsQuery = useGetModeFacturations();

  const startDate = moment(formInput?.date_debut, 'DD-MM-YYYY');
  const endDate = moment(formInput?.date_fin, 'DD-MM-YYYY');
  const duration = endDate.diff(startDate, 'days');

  localStorage.setItem('duree', duration);

  useEffect(() => {
    if (getContractQuery.isSuccess) {
      setFormInput((f) => {
        return { ...f, ...contratData };
      });
    }
  }, [contratData, getContractQuery.isSuccess]);

  return (
    <Box component="form" noValidate onSubmit={handleSubmit} autoComplete="off">
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12}>
            <TextField
              variant="standard"
              fullWidth
              label="Titre"
              value={formInput?.titre || ''}
              name="titre"
              onChange={handleChange}
              error={!!formErrors?.data?.titre}
              helperText={renderArrayMultiline(formErrors?.data?.titre)}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              variant="standard"
              fullWidth
              multiline
              rows={'3'}
              label="Description"
              value={formInput?.description || ''}
              name="description"
              onChange={handleChange}
              error={!!formErrors?.data?.description}
              helperText={renderArrayMultiline(formErrors?.data?.description)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            {getClientsQuery?.data ? (
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
                    label="Client"
                    error={!!formErrors?.data?.client_id}
                    helperText={renderArrayMultiline(formErrors?.data?.client_id)}
                  />
                )}
              />
            ) : (
              <Skeleton variant="rounded" width={'100%'} height={40} />
            )}
          </Grid>
          <Grid item xs={12} md={4}>
            {getMarquePACQuery?.data ? (
              <Autocomplete
                onChange={(event, newValue) => {
                  setFormInput((formData) => {
                    return { ...formData, marque_pac_parents: newValue ? newValue.map((value) => value.code) : [] };
                  });
                }}
                multiple
                options={getMarquePACQuery?.data || []}
                getOptionLabel={(option) => option?.titre}
                renderInput={(params) => (
                  <TextField
                    required
                    variant="standard"
                    {...params}
                    label="Marque PAC"
                    error={!!formErrors?.data?.marque_pac_parents}
                    helperText={renderArrayMultiline(formErrors?.data?.marque_pac_parents)}
                  />
                )}
              />
            ) : (
              <Skeleton variant="rounded" width={'100%'} height={40} />
            )}
          </Grid>
          <Grid item xs={12} md={4}>
            {getModeFacturationsQuery?.data ? (
              <Autocomplete
                onChange={(event, newValue) => {
                  setFormInput((formData) => {
                    return { ...formData, facture_mode_id: newValue?.id };
                  });
                }}
                options={getModeFacturationsQuery?.data || []}
                getOptionLabel={(option) => option?.intitule}
                renderInput={(params) => (
                  <TextField
                    required
                    variant="standard"
                    {...params}
                    label="Mode Facturation"
                    error={!!formErrors?.data?.facture_mode_id}
                    helperText={renderArrayMultiline(formErrors?.data?.facture_mode_id)}
                  />
                )}
              />
            ) : (
              <Skeleton variant="rounded" width={'100%'} height={40} />
            )}
          </Grid>
          <Grid item xs={12} md={3}>
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
                  fullWidth
                  variant="standard"
                  {...params}
                  error={!!formErrors?.data?.mise_en_place_date}
                  helperText={renderArrayMultiline(formErrors?.data?.mise_en_place_date)}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={3}>
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
                  fullWidth
                  required
                  variant="standard"
                  {...params}
                  error={!!formErrors?.data?.date_debut}
                  helperText={renderArrayMultiline(formErrors?.data?.date_debut)}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={3}>
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
                  fullWidth
                  required
                  variant="standard"
                  {...params}
                  error={!!formErrors?.data?.date_fin}
                  helperText={renderArrayMultiline(formErrors?.data?.date_fin)}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={3}>
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

          <Grid item xs={12}>
            <Stack direction="row" justifyContent="flex-end">
              <AnimateButton>
                <Button variant="contained" sx={{ my: 3, ml: 1 }} type="submit">
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
  handleNext: PropTypes.func
};
export default InformationsGenerales;
