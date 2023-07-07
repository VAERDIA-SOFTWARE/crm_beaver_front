import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import SendIcon from '@mui/icons-material/Send';
import { Grid, TextField } from '@mui/material';

// project imports
import { LoadingButton } from '@mui/lab';
import { useGetSettingsPreferences, useUpdateSettingsPreferences } from 'services/settings.service';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import renderArrayMultiline from 'utilities/utilities';

const SettingsPreferencesPage = () => {
  const [formErrors, setFormErrors] = useState({});
  const [formInput, setFormInput] = useState({
    max_interventions: '',
    percentage: '',
    max_intervention_hours: '',
    max_interventions_par: '',
    default_pagination: '',
    intervention_color: '',
    validated_intervention_color: '',
    taux_tva: '',
    contract_notice_days: '',
    echantillonnage: ''
  });

  const updateSettingsPreferencesMutation = useUpdateSettingsPreferences();
  const useGetSettingsPreferencesQuery = useGetSettingsPreferences();
  const settingsPreferencesData = useGetSettingsPreferencesQuery;
  // console.log('====================================');
  // console.log(useGetSettingsPreferencesQuery);
  // console.log('====================================');

  useEffect(() => {
    if (useGetSettingsPreferencesQuery.isSuccess) {
      setFormInput((f) => {
        return { ...f, ...settingsPreferencesData };
      });
    }
  }, [settingsPreferencesData, useGetSettingsPreferencesQuery.isSuccess]);
  console.log(formInput);
  const handleChange = (e) => {
    setFormInput({
      ...formInput,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});

    try {
      await updateSettingsPreferencesMutation.mutateAsync({
        ...formInput
      });
    } catch (error) {
      const errorsObject = error?.response?.data;
      setFormErrors(errorsObject);
    }
  };

  return (
    <MainCard title={`Préférences`}>
      <div>
        <form onSubmit={handleSubmit} noValidate>
          <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
            {/* <Grid item xs={12} md={6}>
                <TextField variant="standard" fullWidth label="Référence*" value={formInput?.reference || ''} disabled />
              </Grid> */}
            <Grid item xs={12} md={6}>
              <TextField
                variant="standard"
                fullWidth
                label="Pagination"
                value={formInput?.default_pagination ?? ''}
                name="default_pagination"
                onChange={handleChange}
                error={!!formErrors?.data?.default_pagination}
                helperText={renderArrayMultiline(formErrors?.data?.default_pagination)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                variant="standard"
                name="max_interventions"
                onChange={handleChange}
                fullWidth
                label="Max inspections par jour"
                value={formInput?.max_interventions ?? ''}
                error={!!!!formErrors?.data?.max_interventions}
                helperText={renderArrayMultiline(formErrors?.data?.max_interventions)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                variant="standard"
                name="max_interventions_par"
                onChange={handleChange}
                fullWidth
                label="Max inspections par"
                value={formInput?.max_interventions_par ?? ''}
                error={!!!!formErrors?.data?.max_interventions_par}
                helperText={renderArrayMultiline(formErrors?.data?.max_interventions_par)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                variant="standard"
                name="max_interventions_hours"
                onChange={handleChange}
                fullWidth
                label="Durée d'interventions"
                value={formInput?.max_interventions_hours ?? ''}
                error={!!!!formErrors?.data?.max_interventions_hours}
                helperText={renderArrayMultiline(formErrors?.data?.max_interventions_hours)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                variant="standard"
                name="taux_tva"
                onChange={handleChange}
                fullWidth
                label="Taux TVA"
                value={formInput?.taux_tva ?? ''}
                error={!!!!formErrors?.data?.taux_tva}
                helperText={renderArrayMultiline(formErrors?.data?.taux_tva)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                variant="standard"
                name="percentage"
                onChange={handleChange}
                fullWidth
                label="Pourcentage"
                value={formInput?.percentage ?? ''}
                error={!!!!formErrors?.data?.percentage}
                helperText={renderArrayMultiline(formErrors?.data?.percentage)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <div
                style={{
                  marginBottom: 4
                }}
              >
                <label htmlFor="intervention_color">Couleur Intervention Planifier</label>
              </div>
              <input
                id="intervention_color"
                onChange={handleChange}
                name="intervention_color"
                type="color"
                value={formInput?.intervention_color}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <div
                style={{
                  marginBottom: 4
                }}
              >
                <label htmlFor="validated_intervention_color">Couleur Intervention Terminer</label>
              </div>
              <input
                id="validated_intervention_color"
                onChange={handleChange}
                name="validated_intervention_color"
                type="color"
                value={formInput?.validated_intervention_color}
              />
            </Grid>
            <Grid item sx={{ display: 'flex', justifyContent: 'flex-end' }} xs={12}>
              <LoadingButton
                loadingPosition="end"
                endIcon={<SendIcon />}
                loading={updateSettingsPreferencesMutation.isLoading}
                variant="contained"
                type="submit"
              >
                Sauvegarder
              </LoadingButton>
            </Grid>
          </Grid>
        </form>
      </div>
    </MainCard>
  );
};

SettingsPreferencesPage.propTypes = {
  open: PropTypes.bool,
  handleCloseDialog: PropTypes.func
};

export default SettingsPreferencesPage;
