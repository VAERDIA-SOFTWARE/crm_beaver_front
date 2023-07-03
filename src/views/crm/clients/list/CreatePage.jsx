import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import SendIcon from '@mui/icons-material/Send';
import {
  Autocomplete,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  Skeleton,
  TextField,
  Typography
} from '@mui/material';

// project imports
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { useNavigate, useParams } from 'react-router-dom';
import { useCreateUser } from 'services/users.service';
import { useGetVilleCodePostals, useGetVilles } from 'services/zone-villes.service';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import renderArrayMultiline from 'utilities/utilities';

const ClientCreatePage = () => {
  const { clientId } = useParams();

  const [formErrors, setFormErrors] = useState({});
  const [formInput, setFormInput] = useState({
    default_pagination: '',
    email: '',
    fax: '',
    password: '',
    address: '',
    phone_number: '',
    identifient_fiscal: '',
    identifient_tva: '',
    interlocuteur_adresse: '',
    interlocuteur_fiscale: '',
    interlocuteur: '',
    code_postal: '',
    ville: '',
    role: 'client'
  });

  const createClientMutation = useCreateUser(clientId);

  const getVilleCodePostalsQuery = useGetVilleCodePostals({ villeId: formInput?.ville });
  const villeCodePostalsData = getVilleCodePostalsQuery.data;

  const getVillesQuery = useGetVilles();

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const navigate = useNavigate();

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
      await createClientMutation.mutateAsync(formInput);

      navigate('/clients/list');
    } catch (error) {
      const errorsObject = error?.response?.data;
      setFormErrors(errorsObject);
    }
  };

  return (
    <MainCard title="Ajouter Client" backButton goBackLink="/clients/list">
      <div>
        <>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
              <Grid item xs={12}>
                <Typography variant="h5" component="div">
                  A. Informations générales:
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  variant="standard"
                  fullWidth
                  label="Nom*"
                  value={formInput?.name || ''}
                  name="name"
                  onChange={handleChange}
                  error={!!formErrors?.data?.name}
                  helperText={renderArrayMultiline(formErrors?.data?.name)}
                />
              </Grid>
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
                  name="address"
                  onChange={handleChange}
                  fullWidth
                  label="Adresse*"
                  value={formInput?.address || ''}
                  error={!!formErrors?.data?.address}
                  helperText={renderArrayMultiline(formErrors?.data?.address)}
                />
              </Grid>

              <Grid item xs={12}>
                <Divider />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h5" component="div">
                  B. Informations de contact:
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  variant="standard"
                  name="phone_number"
                  onChange={handleChange}
                  fullWidth
                  label="Numéro de téléphone*"
                  value={formInput?.phone_number || ''}
                  error={!!!!formErrors?.data?.phone_number}
                  helperText={renderArrayMultiline(formErrors?.data?.phone_number)}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  variant="standard"
                  name="fax"
                  onChange={handleChange}
                  fullWidth
                  label="Fax"
                  value={formInput?.fax || ''}
                  error={!!!!formErrors?.data?.fax}
                  helperText={renderArrayMultiline(formErrors?.data?.fax)}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  variant="standard"
                  name="identifient_fiscal"
                  onChange={handleChange}
                  fullWidth
                  label="Identifiant Fiscal"
                  value={formInput?.identifient_fiscal || ''}
                  error={!!!!formErrors?.data?.identifient_fiscal}
                  helperText={renderArrayMultiline(formErrors?.data?.identifient_fiscal)}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  variant="standard"
                  name="identifient_tva"
                  onChange={handleChange}
                  fullWidth
                  label="Identifiant TVA"
                  value={formInput?.identifient_tva || ''}
                  error={!!!!formErrors?.data?.identifient_tva}
                  helperText={renderArrayMultiline(formErrors?.data?.identifient_tva)}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  variant="standard"
                  name="interlocuteur"
                  onChange={handleChange}
                  fullWidth
                  label="Interlocuteur"
                  value={formInput?.interlocuteur || ''}
                  error={!!!!formErrors?.data?.interlocuteur}
                  helperText={renderArrayMultiline(formErrors?.data?.interlocuteur)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  variant="standard"
                  name="interlocuteur_adresse"
                  onChange={handleChange}
                  fullWidth
                  label="Interlocuteur Adresse"
                  value={formInput?.interlocuteur_adresse || ''}
                  error={!!!!formErrors?.data?.interlocuteur}
                  helperText={renderArrayMultiline(formErrors?.data?.interlocuteur_adresse)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  variant="standard"
                  name="interlocuteur_fiscale"
                  onChange={handleChange}
                  fullWidth
                  label="Interlocuteur Fiscale"
                  value={formInput?.interlocuteur_fiscale || ''}
                  error={!!!!formErrors?.data?.interlocuteur}
                  helperText={renderArrayMultiline(formErrors?.data?.interlocuteur_fiscale)}
                />
              </Grid>

              {false && (
                <Grid item xs={12} md={6}>
                  <FormControl error={!!!!formErrors?.data?.password} sx={{ width: '100%' }} variant="standard">
                    <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                    <Input
                      name="password"
                      id="standard-adornment-password"
                      type={showPassword ? 'text' : 'password'}
                      onChange={handleChange}
                      fullWidth
                      label="Mot de passe"
                      defaultValue=""
                      error={!!formErrors?.data?.password}
                      helperText={renderArrayMultiline(formErrors?.data?.password)}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                    <FormHelperText>{renderArrayMultiline(formErrors?.data?.password)}</FormHelperText>
                  </FormControl>
                </Grid>
              )}

              <Grid item xs={12}>
                <Divider />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h5" component="div">
                  C. Infos résidentielles:
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Autocomplete
                  onChange={(event, newValue) => {
                    // const arr = newValue.map((e) => e?.id);
                    setFormInput((formData) => {
                      return { ...formData, ville: newValue?.id };
                    });
                  }}
                  multiple={false}
                  options={getVillesQuery?.data || []}
                  getOptionLabel={(option) => option?.nom}
                  // defaultValue={[top100Films[0], top100Films[4]]}
                  renderInput={(params) => (
                    <TextField
                      variant="standard"
                      {...params}
                      label="Ville*"
                      error={!!formErrors?.data?.ville}
                      helperText={renderArrayMultiline(formErrors?.data?.ville)}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                {Array.isArray(villeCodePostalsData) ? (
                  <Autocomplete
                    onChange={(event, newValue) => {
                      setFormInput((formData) => {
                        return { ...formData, code_postal: newValue?.code };
                      });
                    }}
                    options={villeCodePostalsData || []}
                    getOptionLabel={(option) => {
                      return option?.code;
                    }}
                    renderInput={(params) => (
                      <TextField
                        variant="standard"
                        {...params}
                        label="Sélectionner un code postal"
                        error={!!formErrors?.data?.code_postal}
                        helperText={renderArrayMultiline(formErrors?.data?.code_postal)}
                      />
                    )}
                  />
                ) : (
                  <Skeleton variant="rounded" width={'100%'} height={40} />
                )}
              </Grid>

              <Grid item sx={{ display: 'flex', justifyContent: 'flex-end' }} xs={12}>
                <LoadingButton
                  loadingPosition="end"
                  endIcon={<SendIcon />}
                  loading={createClientMutation.isLoading}
                  variant="contained"
                  type="submit"
                >
                  Ajouter
                </LoadingButton>
              </Grid>
            </Grid>
          </form>
        </>
      </div>
    </MainCard>
  );
};

ClientCreatePage.propTypes = {
  open: PropTypes.bool,
  handleCloseDialog: PropTypes.func
};

export default ClientCreatePage;
