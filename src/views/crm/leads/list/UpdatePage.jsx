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
import { useUpdateUser, useGetUser, useDeleteUser } from 'services/users.service';
import { useGetVilleCodePostals, useGetVilles } from 'services/zone-villes.service';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import renderArrayMultiline from 'utilities/utilities';
import AutoComplete from 'views/forms/components/AutoComplete';
import { useGetSettingsCategoryClient } from 'services/settings.service';
import DeleteIcon from '@mui/icons-material/Delete';
import { useConfirm } from 'material-ui-confirm';

const LeadsUpdatePage = () => {
  const { leadsId } = useParams();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const confirm = useConfirm();

  const getLeadsQuery = useGetUser(leadsId);
  const clientData = getLeadsQuery?.data?.user;
  const getCategoryClient = useGetSettingsCategoryClient();
  const categoryData = getCategoryClient?.data;
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
    type: 0,
    qualifications: '',
    role: 'client',
    couleur: '#000',
    p_category_client_id: ''
  });

  const createClientMutation = useUpdateUser(leadsId);
  const deleteMutation = useDeleteUser(leadsId);

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    if (getLeadsQuery.isSuccess) {
      setFormInput((f) => {
        return { ...f, ...clientData };
      });
    }
  }, [clientData, getLeadsQuery.isSuccess]);

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

      navigate('/leads/list');
    } catch (error) {
      const errorsObject = error?.response?.data;
      setFormErrors(errorsObject);
    }
  };

  return (
    <MainCard
      headerColor={true}
      title={`Modifier ${clientData?.type === 0 ? 'Leads' : 'Client'} ${clientData?.reference ? '- ' + clientData?.reference : ''}`}
      backButton
      goBackLink={-1}
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
              <Grid item sx={{ display: 'flex', justifyContent: 'space-between' }} xs={12}>
                {/* <LoadingButton
                  loadingPosition="end"
                  endIcon={<SendIcon />}
                  loading={createClientMutation.isLoading}
                  variant="contained"
                  onClick={async (e) => {
                    await deleteMutation.mutateAsync();
                    navigate(`/leads/list`);
                  }}
                >
                  Suppirmer
                </LoadingButton> */}
                <LoadingButton
                  disabled={deleteMutation.isLoading}
                  loadingPosition="start"
                  startIcon={<DeleteIcon />}
                  loading={deleteMutation.isLoading}
                  variant="outlined"
                  color="error"
                  onClick={() =>
                    confirm({
                      description: `Êtes-vous sûr de vouloir supprimer: ${formInput?.name}.`,
                      title: `Veuillez confirmer la suppression`
                    })
                      .then(async () => {
                        try {
                          await deleteMutation.mutateAsync();
                          navigate('/leads/list', {
                            replace: true
                          });
                        } catch (error) {}
                      })
                      .catch(() => console.log('Utilisateur supprimé avec succès.'))
                  }
                >
                  {'Supprimer'}
                </LoadingButton>
                <LoadingButton
                  loadingPosition="end"
                  endIcon={<SendIcon />}
                  loading={createClientMutation.isLoading}
                  variant="contained"
                  type="submit"
                >
                  Modifier
                </LoadingButton>
              </Grid>
            </Grid>
          </form>
        </>
      </div>
    </MainCard>
  );
};

LeadsUpdatePage.propTypes = {
  open: PropTypes.bool,
  handleCloseDialog: PropTypes.func
};

export default LeadsUpdatePage;
