import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import SendIcon from '@mui/icons-material/Send';
import { Grid, TextField } from '@mui/material';

// project imports
import { LoadingButton } from '@mui/lab';
import {
  useGetSettingsMailer,
  useGetSettingsPreferences,
  useUpdateSettingsMailer,
  useUpdateSettingsPreferences
} from 'services/settings.service';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import renderArrayMultiline from 'utilities/utilities';

const SettingsMailerPage = () => {
  const [formErrors, setFormErrors] = useState({});
  const [formInput, setFormInput] = useState({
    MAIL_HOST: '',
    MAIL_PORT: '',
    MAIL_USERNAME: '',
    MAIL_PASSWORD: '',
    MAIL_ENCRYPTION: '',
    MAIL_FROM_ADDRESS: '',
    MAIL_FROM_NAME: '',
    Smtp: ''
  });

  const updateSettingsPreferencesMutation = useUpdateSettingsMailer();
  const useGetSettingsPreferencesQuery = useGetSettingsMailer();
  const settingsPreferencesData = useGetSettingsPreferencesQuery.data;

  useEffect(() => {
    if (useGetSettingsPreferencesQuery.isSuccess) {
      setFormInput((f) => {
        return { ...f, ...settingsPreferencesData };
      });
    }
  }, [settingsPreferencesData, useGetSettingsPreferencesQuery.isSuccess]);
  console.log(settingsPreferencesData);
  const handleChange = (e) => {
    setFormInput({
      ...formInput,
      [e.target.name]: e.target.value
    });
  };
  console.log(formInput);

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
    <MainCard title={`Configuration E-mail`}>
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
                label="Serveur"
                value={formInput?.MAIL_HOST ?? ''}
                name="MAIL_HOST"
                onChange={handleChange}
                error={!!formErrors?.data?.MAIL_HOST}
                helperText={renderArrayMultiline(formErrors?.data?.MAIL_HOST)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                variant="standard"
                fullWidth
                label="Port"
                value={formInput?.MAIL_PORT ?? ''}
                name="MAIL_PORT"
                onChange={handleChange}
                error={!!formErrors?.data?.MAIL_PORT}
                helperText={renderArrayMultiline(formErrors?.data?.MAIL_PORT)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                variant="standard"
                fullWidth
                label="Nom d'utilisateur"
                value={formInput?.MAIL_USERNAME ?? ''}
                name="MAIL_USERNAME"
                onChange={handleChange}
                error={!!formErrors?.data?.MAIL_USERNAME}
                helperText={renderArrayMultiline(formErrors?.data?.MAIL_USERNAME)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                variant="standard"
                fullWidth
                label="Mot de passe"
                value={formInput?.MAIL_PASSWORD ?? ''}
                name="MAIL_PASSWORD"
                onChange={handleChange}
                error={!!formErrors?.data?.MAIL_PASSWORD}
                helperText={renderArrayMultiline(formErrors?.data?.MAIL_PASSWORD)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                variant="standard"
                fullWidth
                label="Chiffrement du courrier"
                value={formInput?.MAIL_ENCRYPTION ?? ''}
                name="MAIL_ENCRYPTION"
                onChange={handleChange}
                error={!!formErrors?.data?.MAIL_ENCRYPTION}
                helperText={renderArrayMultiline(formErrors?.data?.MAIL_ENCRYPTION)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                variant="standard"
                fullWidth
                label="Courrier de l'adresse"
                value={formInput?.MAIL_FROM_ADDRESS ?? ''}
                name="MAIL_FROM_ADDRESS"
                onChange={handleChange}
                error={!!formErrors?.data?.MAIL_FROM_ADDRESS}
                helperText={renderArrayMultiline(formErrors?.data?.MAIL_FROM_ADDRESS)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                variant="standard"
                fullWidth
                label="Courriel du nom"
                value={formInput?.MAIL_FROM_NAME ?? ''}
                name="MAIL_FROM_NAME"
                onChange={handleChange}
                error={!!formErrors?.data?.MAIL_FROM_NAME}
                helperText={renderArrayMultiline(formErrors?.data?.MAIL_FROM_NAME)}
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

SettingsMailerPage.propTypes = {
  open: PropTypes.bool,
  handleCloseDialog: PropTypes.func
};

export default SettingsMailerPage;
