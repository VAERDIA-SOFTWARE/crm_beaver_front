import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import SendIcon from '@mui/icons-material/Send';
import { Autocomplete, Grid, Skeleton, TextField } from '@mui/material';

// project imports
import { LoadingButton } from '@mui/lab';
import { DateTimePicker, frFR, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import { useParams } from 'react-router-dom';
import { useGetProposition, useGetInspectionsTechniciens, useUpdateInspection } from 'services/inspections.service';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import renderArrayMultiline from 'utilities/utilities';

const PropositionUpdatePage = () => {
  const { propositionId } = useParams();
  const getPropsitionQuery = useGetProposition(propositionId);
  const propositionData = getPropsitionQuery.data;
  const getInspectionTechniciensQuery = useGetInspectionsTechniciens({ userId: propositionId });
  const inspectionTechniciensData = getInspectionTechniciensQuery.data;

  const updateInspectionMutation = useUpdateInspection();

  const [formErrors, setFormErrors] = useState({});
  const [formInput, setFormInput] = useState({
    debut: null,
    fin: null,
    user_id: null
  });

  useEffect(() => {
    if (getPropsitionQuery.isSuccess) {
      setFormInput((f) => {
        return {
          ...f,
          debut: propositionData?.deb_calendar,
          fin: propositionData?.fin_calendar,
          user_id: propositionData?.technicien?.id
        };
      });
    }
  }, [getPropsitionQuery.isSuccess, propositionData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});

    try {
      await updateInspectionMutation.mutateAsync({ id: propositionId, values: formInput });
    } catch (error) {
      const errorsObject = error?.response?.data;
      setFormErrors(errorsObject);
    }
  };

  return (
    <MainCard
      title={`Proposition ${propositionData?.reference ? '- ' + propositionData?.reference : ''}`}
      backButton
      goBackLink={`/propositions/list`}
    >
      <div>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
            <Grid item xs={12} md={6}>
              <TextField variant="standard" fullWidth label="Référence*" value={propositionData?.reference || ''} disabled />
            </Grid>
            <Grid item xs={12} md={6}></Grid>
            <Grid item xs={12} md={6}>
              {propositionData?.technicien && Array.isArray(inspectionTechniciensData) ? (
                <Autocomplete
                  // value={formInput?.user_id}
                  onChange={(event, newValue) => {
                    setFormInput((formData) => {
                      return { ...formData, user_id: newValue?.id };
                    });
                  }}
                  options={inspectionTechniciensData || []}
                  getOptionLabel={(option) => {
                    return option?.name;

                    // const tech = inspectionTechniciensData?.find((e) => e?.id === option);
                    // return tech?.name;
                  }}
                  defaultValue={inspectionTechniciensData?.find((e) => propositionData?.technicien?.id === e?.id)}
                  renderInput={(params) => <TextField variant="standard" {...params} label="Sélectionner un technicien" />}
                  error={!!formErrors?.data?.user_id}
                  helperText={renderArrayMultiline(formErrors?.data?.user_id)}
                />
              ) : (
                <Skeleton variant="rounded" width={'100%'} height={40} />
              )}
            </Grid>
            <Grid item xs={12} md={6}></Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                // adapterLocale="fr"
                localeText={frFR.components.MuiLocalizationProvider.defaultProps.localeText}
              >
                <DateTimePicker
                  renderInput={(params) => (
                    <TextField
                      variant="standard"
                      {...params}
                      error={!!formErrors?.data?.debut}
                      helperText={renderArrayMultiline(formErrors?.data?.debut)}
                    />
                  )}
                  label="Date début"
                  value={formInput?.debut}
                  onChange={(v) => {
                    try {
                      const formattedDate = format(v, 'yyyy-MM-dd hh:mm');
                      setFormInput((f) => {
                        return { ...f, debut: formattedDate };
                      });
                    } catch (error) {}
                  }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} md={6}>
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                // adapterLocale="fr"
                localeText={frFR.components.MuiLocalizationProvider.defaultProps.localeText}
              >
                <DateTimePicker
                  renderInput={(params) => (
                    <TextField
                      variant="standard"
                      {...params}
                      error={!!formErrors?.data?.fin}
                      helperText={renderArrayMultiline(formErrors?.data?.fin)}
                    />
                  )}
                  label="Date fin"
                  value={formInput?.fin}
                  onChange={(v) => {
                    try {
                      const formattedDate = format(v, 'yyyy-MM-dd hh:mm');
                      setFormInput((f) => {
                        return { ...f, fin: formattedDate };
                      });
                    } catch (error) {}
                  }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item sx={{ display: 'flex', justifyContent: 'flex-end' }} xs={12}>
              <LoadingButton
                loadingPosition="end"
                endIcon={<SendIcon />}
                loading={updateInspectionMutation.isLoading}
                variant="contained"
                type="submit"
              >
                Modifier
              </LoadingButton>
            </Grid>
          </Grid>
        </form>
        {/* <Divider
          style={{
            margin: 20
          }}
        /> */}
        {/* <div
          style={{
            display: 'flex',
            gap: 10,
              justifyContent: 'start'
          }}
        >
          <LoadingButton
            loading={toggleClientStatusMutation.isLoading}
            variant="outlined"
            onClick={() =>
              confirm({
                description: `Êtes-vous sûr de vouloir ${inspectionData?.active_status ? 'désactiver' : 'activer'} ${
                  inspectionData?.name
                }.`,
                title: `Veuillez confirmer ${inspectionData?.active_status ? 'la désactivation' : "l'activation"}`
              })
                .then(() => toggleClientStatusMutation.mutate())
                .catch(() => console.log('Deactivation cancelled.'))
            }
          >
            {inspectionData?.active_status ? 'Désactiver' : 'Activer'}
          </LoadingButton>

          <LoadingButton
            loadingPosition="start"
            startIcon={<DeleteIcon />}
            loading={deleteUserMutation.isLoading}
            variant="outlined"
            color="error"
            onClick={() =>
              confirm({
                description: `Êtes-vous sûr de vouloir supprimer ${inspectionData?.name}.`,
                title: `Veuillez confirmer la suppression`
              })
                .then(async () => {
                  try {
                    await deleteUserMutation.mutateAsync();
                    navigate('/clients/list', {
                      replace: true
                    });
                  } catch (error) {}
                })
                .catch(() => console.log('Utilisateur supprimé avec succès.'))
            }
          >
            {'Supprimer'}
          </LoadingButton>
        </div> */}
      </div>
    </MainCard>
  );
};

PropositionUpdatePage.propTypes = {
  open: PropTypes.bool,
  handleCloseDialog: PropTypes.func
};

export default PropositionUpdatePage;
