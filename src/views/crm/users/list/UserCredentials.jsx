import { Grid, Stack, TextField, Typography } from '@mui/material';
import React from 'react';
import SubCard from 'ui-component/cards/SubCard';
import Switch from '@mui/material/Switch';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';
import { cloneDeep, isEqual } from 'lodash';
import MainCard from 'ui-component/cards/MainCard';
import { useChangeMyLoginCredentials } from 'services/users.service';
import renderArrayMultiline from 'utilities/utilities';
import useAuth from 'hooks/useAuth';

export default function UserCredentials() {
  const [formErrors, setFormErrors] = React.useState({});
  const changeLoginCredentialsMutation = useChangeMyLoginCredentials();
  const [formInput, setFormInput] = React.useState({
    email: '',
    password: ''
  });
  const { logout, user } = useAuth();
  const handleChange = (e) => {
    setFormInput({
      ...formInput,
      [e.target.name]: e.target.value
    });
  };

  React.useEffect(() => {
    setFormInput((f) => {
      return { ...f, email: user?.email, password: user?.password };
    });
  }, [user]);

  return (
    <MainCard title="Accès distant" content={false}>
      <Grid
        container
        spacing={10}
        rowSpacing={5}
        sx={{
          padding: 2
        }}
      >
        <>
          <Grid item xs={12} md={6}>
            <TextField
              variant="standard"
              fullWidth
              label="E-mail*"
              value={formInput?.email || ''}
              name="email"
              onChange={handleChange}
              error={!!formErrors?.data?.email}
              helperText={renderArrayMultiline(formErrors?.data?.email)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              variant="standard"
              fullWidth
              label="Mot de passe*"
              value={formInput?.password || ''}
              name="password"
              onChange={handleChange}
              error={!!formErrors?.data?.password}
              helperText={renderArrayMultiline(formErrors?.data?.password)}
            />
          </Grid>
          <Grid item xs={12} md={6}></Grid>
          <Grid item xs={12} md={6}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <LoadingButton
                loadingPosition="start"
                startIcon={<SaveIcon />}
                loading={!formInput || changeLoginCredentialsMutation.isLoading}
                disabled={isEqual(formInput, { email: user?.email, password: user?.password })}
                color={'secondary'}
                variant="contained"
                onClick={async () => {
                  changeLoginCredentialsMutation.mutateAsync(formInput);
                }}
              >
                {'Sauvegarder'}
              </LoadingButton>
            </div>
          </Grid>
        </>
      </Grid>
    </MainCard>
  );
}
