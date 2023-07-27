import { Grid, Stack, TextField, Typography } from '@mui/material';
import React from 'react';
import SubCard from 'ui-component/cards/SubCard';
import Switch from '@mui/material/Switch';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';
import { cloneDeep, isEqual } from 'lodash';
import MainCard from 'ui-component/cards/MainCard';
import { useChangeLoginCredentials, useToggleUserAuth } from 'services/users.service';
import renderArrayMultiline from 'utilities/utilities';

export default function AuthToggleCard({ toggleAuth, setToggleAuth, title, userData, userId }) {
  const [formErrors, setFormErrors] = React.useState({});
  const [checked, setChecked] = React.useState(false);
  const toggleUserAuthMutation = useToggleUserAuth(userId);
  const changeLoginCredentialsMutation = useChangeLoginCredentials(userId);
  const [formInput, setFormInput] = React.useState({
    email: '',
    password: ''
  });
  const handleChange = (e) => {
    setFormInput({
      ...formInput,
      [e.target.name]: e.target.value
    });
  };
  const handleToggle = async (event) => {
    setToggleAuth(event.target.checked);
    await toggleUserAuthMutation.mutateAsync({ value: event.target.checked });
  };
  React.useEffect(() => {
    setFormInput((f) => {
      return { ...f, email: userData?.email, password: userData?.password };
    });
  }, [userData]);
  console.log(userData);
  return (
    <MainCard
      title={title ?? 'Accès distant'}
      content={false}
      secondary={<Switch checked={toggleAuth} onChange={(event) => handleToggle(event)} inputProps={{ 'aria-label': 'controlled' }} />}
    >
      <Grid
        container
        spacing={10}
        rowSpacing={5}
        sx={{
          padding: 2
        }}
      >
        {toggleAuth && (
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
                  disabled={isEqual(formInput, { email: userData?.email, password: userData?.password })}
                  color={'secondary'}
                  variant="contained"
                  onClick={async () => {
                    await changeLoginCredentialsMutation.mutateAsync(formInput);
                  }}
                >
                  {'Sauvegarder'}
                </LoadingButton>
              </div>
            </Grid>
          </>
        )}
      </Grid>
    </MainCard>
  );
}
