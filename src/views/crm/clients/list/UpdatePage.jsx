import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

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
import { useUpdateUser, useGetUser } from 'services/users.service';
import { useGetVilleCodePostals, useGetVilles } from 'services/zone-villes.service';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import renderArrayMultiline from 'utilities/utilities';
import AutoComplete from 'views/forms/components/AutoComplete';
import { useGetSettingsCategoryClient } from 'services/settings.service';

const ClientUpdatePage = () => {
  const { clientId } = useParams();

  const getClientsQuery = useGetUser(clientId);
  const clientData = getClientsQuery?.data?.user;
  const getCategoryClient = useGetSettingsCategoryClient();
  const categoryData = getCategoryClient?.data;
  const updateClientMutation = useUpdateUser(clientId);

  const [formErrors, setFormErrors] = useState({});
  const [formInput, setFormInput] = useState({
    name: '',
    email: '',
    fax: '',
    password: '',
    address: '',
    phone_number: '',
    code_postal: '',
    // ville: 'null',
    type: 1,
    qualifications: '',
    role: 'client',
    couleur: '#000',
    p_category_client_id: ''
  });

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    if (getClientsQuery.isSuccess) {
      setFormInput((f) => {
        return { ...f, ...clientData };
      });
    }
  }, [clientData, getClientsQuery.isSuccess]);

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
      await updateClientMutation.mutateAsync(formInput);

      navigate('/clients/list');
    } catch (error) {
      const errorsObject = error?.response?.data;
      setFormErrors(errorsObject);
    }
  };

  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <MainCard
      headerColor={true}
      title={`Modifier Client12 ${clientData?.reference ? '- ' + clientData?.reference : ''}`}
      backButton
      goBackLink="/clients/list"
    >
      <div>
        <>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  variant="standard"
                  fullWidth
                  label="Nom Complet*"
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
              {/* <Grid item xs={12} md={6}>
                <TextField
                  variant="standard"
                  name="ville"
                  onChange={handleChange}
                  fullWidth
                  label="Ville*"
                  value={formInput?.ville || ''}
                  error={!!formErrors?.data?.ville}
                  helperText={renderArrayMultiline(formErrors?.data?.ville)}
                />
              </Grid> */}

              <Grid item xs={12} md={6}>
                <TextField
                  variant="standard"
                  name="code_postal"
                  onChange={handleChange}
                  fullWidth
                  label="Code Postale*"
                  value={formInput?.code_postal || ''}
                  error={!!formErrors?.data?.code_postal}
                  helperText={renderArrayMultiline(formErrors?.data?.code_postal)}
                />
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
                {clientData && Array.isArray(categoryData) ? (
                  <Autocomplete
                    onChange={(event, newValue) => {
                      setSelectedCategory(newValue);

                      setFormInput((formData) => {
                        return { ...formData, p_category_client_id: newValue?.id };
                      });
                    }}
                    options={categoryData || []}
                    getOptionLabel={(option) => option.intitule}
                    defaultValue={categoryData?.find((e) => clientData?.p_category_client_id === e?.id)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="standard"
                        label="Catégorie*"
                        error={!!formErrors?.data?.p_category_client_id}
                        helperText={renderArrayMultiline(formErrors?.data?.p_category_client_id)}
                      />
                    )}
                  />
                ) : (
                  <Skeleton variant="rounded" width={'100%'} height={50} />
                )}
              </Grid>
              {/* <Grid item xs={12} md={6}>
                <Autocomplete
                  onChange={(event, newValue) => {
                    setSelectedCategory(newValue);

                    setFormInput((formData) => {
                      return { ...formData, type: newValue?.id };
                    });
                  }}
                  options={['Client', 'Lead']}
                  // getOptionLabel={(option) => option.intitule}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      label="Type*"
                      error={!!formErrors?.data?.type}
                      helperText={renderArrayMultiline(formErrors?.data?.type)}
                    />
                  )}
                />
              </Grid> */}
              <Grid item sx={{ display: 'flex', justifyContent: 'flex-end' }} xs={12}>
                <LoadingButton
                  loadingPosition="end"
                  endIcon={<SendIcon />}
                  loading={updateClientMutation.isLoading}
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

ClientUpdatePage.propTypes = {
  open: PropTypes.bool,
  handleCloseDialog: PropTypes.func
};

export default ClientUpdatePage;
