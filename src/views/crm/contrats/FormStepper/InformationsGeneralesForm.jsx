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
import { useGetModeInterventions } from 'services/interventions.service';

const InformationsGenerales = ({ handleNext, contractId, setcontractId, contractForm, setContractForm }) => {
  const [formErrors, setFormErrors] = useState({});

  // const navigate = useNavigate();

  const handleChange = (e) => {
    setContractForm({
      ...contractForm,
      [e.target.name]: e.target.value
    });
  };

  const createClientMutation = useCreateContrat();
  const updateClientMutation = useUpdateContrat();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});
    try {
      const formattedInput = {
        ...contractForm,
        date_debut: moment(contractForm?.date_debut).format('YYYY-MM-DD'),
        date_fin: moment(contractForm?.date_fin).format('YYYY-MM-DD'),
        mise_en_place_date: moment(contractForm?.date_debut).format('YYYY-MM-DD')
      };
      if (!contractForm?.id) {
        const response = await createClientMutation.mutateAsync(formattedInput);
        setContractForm({ ...contractForm, id: response?.data?.id });
      } else {
        const response = await updateClientMutation.mutateAsync(formattedInput);
        setContractForm({ ...contractForm, ...response?.data });
      }

      handleNext(1);
    } catch (error) {
      const errorsObject = error?.response?.data;
      setFormErrors(errorsObject);
      console.log(error, 'azeaz');
    }
  };

  const getClientsQuery = useGetUsers({ role: 'client', paginated: false });
  const getMarquePACQuery = useGetMarquePAC();
  const getModeFacturationsQuery = useGetModeFacturations();
  const getModeInterventionsQuery = useGetModeInterventions();

  const startDate = moment(contractForm?.date_debut, 'YYYY-MM-DD HH:mm:ss');
  const endDate = moment(contractForm?.date_fin, 'YYYY-MM-DD HH:mm:ss');
  const duration = endDate.diff(startDate, 'days');
  return (
    <Box component="form" noValidate onSubmit={handleSubmit} autoComplete="off">
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12}>
            <TextField
              variant="standard"
              fullWidth
              label="Titre"
              value={contractForm?.titre || ''}
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
              value={contractForm?.description || ''}
              name="description"
              onChange={handleChange}
              error={!!formErrors?.data?.description}
              helperText={renderArrayMultiline(formErrors?.data?.description)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            {getClientsQuery?.data && getClientsQuery?.isSuccess ? (
              <Autocomplete
                onChange={(event, newValue) => {
                  setContractForm((formData) => {
                    return { ...formData, client_id: newValue?.id };
                  });
                }}
                multiple={false}
                defaultValue={getClientsQuery?.data?.find((item) => item?.id === contractForm?.client_id)}
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
            {getMarquePACQuery?.data && getMarquePACQuery?.isSuccess ? (
              <Autocomplete
                onChange={(event, newValue) => {
                  setContractForm((formData) => {
                    return { ...formData, marque_pac_parents: newValue ? newValue.map((value) => value.code) : [] };
                  });
                }}
                multiple
                options={getMarquePACQuery?.data || []}
                getOptionLabel={(option) => option?.titre}
                defaultValue={returnEqualValuesInArray(getMarquePACQuery?.data, contractForm?.marque_pac_parents, 'code')}
                // defaultValue={getMarquePACQuery?.data?.find((item) => item?.code === contractForm?.marque_pac_parents)}
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
            {getModeFacturationsQuery?.data && getModeFacturationsQuery?.isSuccess ? (
              <Autocomplete
                onChange={(event, newValue) => {
                  setContractForm((formData) => {
                    return { ...formData, facture_mode_id: newValue?.id };
                  });
                }}
                options={getModeFacturationsQuery?.data || []}
                defaultValue={getModeFacturationsQuery?.data?.find((item) => item?.id === contractForm?.facture_mode_id)}
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
              value={moment(contractForm?.mise_en_place_date).format('YYYY-MM-DD HH:mm:ss')}
              onChange={(v) => {
                try {
                  setContractForm((f) => {
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
              value={moment(contractForm?.date_debut).format('YYYY-MM-DD HH:mm:ss')}
              onChange={(v) => {
                try {
                  setContractForm((f) => {
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
              value={moment(contractForm?.date_fin).format('YYYY-MM-DD HH:mm:ss')}
              onChange={(v) =>
                setContractForm((f) => {
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
          <Grid item xs={12} md={3}>
            {getModeInterventionsQuery?.isSuccess && getModeInterventionsQuery?.data ? (
              <Autocomplete
                onChange={(event, newValue) => {
                  setContractForm((formData) => {
                    return { ...formData, mode_id: newValue?.id };
                  });
                }}
                multiple={false}
                defaultValue={getModeInterventionsQuery?.data?.find((item) => item?.id === contractForm?.mode_id)}
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
            ) : (
              <Skeleton variant="rounded" width={'100%'} height={40} />
            )}
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              variant="standard"
              type="number"
              fullWidth
              label="Nombre des Interventions"
              value={contractForm?.nb_interventions || ''}
              name="nb_interventions"
              onChange={handleChange}
              error={!!formErrors?.data?.nb_interventions}
              helperText={renderArrayMultiline(formErrors?.data?.nb_interventions)}
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

const returnEqualValuesInArray = (a, b, field) => {
  const t = [];
  try {
    a?.forEach((aElement) => {
      b?.forEach((bElement) => {
        if (aElement[field] === bElement) {
          t.push(aElement);
        }
      });
    });
    return t;
  } catch (error) {
    return [];
  }
};
