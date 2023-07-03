import * as React from 'react';

// material-ui
import { Box, Fab, Grid, IconButton, Menu, MenuItem, TextField, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project imports
import MainCard from 'ui-component/cards/MainCard';

// assets

import { useChangeMyLoginCredentials, useGetUsers } from 'services/users.service';
import useAuth from 'hooks/useAuth';
import renderArrayMultiline from 'utilities/utilities';
import { LoadingButton } from '@mui/lab';
import { cloneDeep, isEqual } from 'lodash';
import SaveIcon from '@mui/icons-material/Save';

const Credentials = () => {
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
  const handleSubmit = async (e) => {
    try {
      await changeLoginCredentialsMutation.mutateAsync(formInput);
    } catch (error) {
      const errorsObject = error?.response?.data;
      setFormErrors(errorsObject);
    }
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
              type="password"
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
                onClick={handleSubmit}
              >
                {'Sauvegarder'}
              </LoadingButton>
            </div>
          </Grid>
        </>
      </Grid>
    </MainCard>
  );
};

export default Credentials;
