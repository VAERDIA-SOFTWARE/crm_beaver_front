import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import { Autocomplete, Divider, Grid, Skeleton, TextField, Typography } from '@mui/material';

// project imports
import { LoadingButton } from '@mui/lab';
import { useConfirm } from 'material-ui-confirm';
import { useNavigate, useParams } from 'react-router-dom';
import { useDeleteUserMutation, useGetUser, useToggleUserStatus, useUpdateUser } from 'services/users.service';
import { useGetVilleCodePostals, useGetVilles } from 'services/zone-villes.service';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import renderArrayMultiline from 'utilities/utilities';

const ClientUpdatePage = () => {
  const { userId } = useParams();

  const [formErrors, setFormErrors] = useState({});
  const [formInput, setFormInput] = useState({
    default_pagination: '',
    email: '',
    fax: '',
    address: '',
    phone_number: '',
    password: '',
    identifient_fiscal: '',
    identifient_tva: '',
    interlocuteur: '',
    code_postal: '',
    ville: ''
  });

  const toggleClientStatusMutation = useToggleUserStatus(userId);
  const deleteClientMutation = useDeleteUserMutation(userId);
  const updateClientMutation = useUpdateUser(userId);
  const getClientQuery = useGetUser(userId);
  const clientData = getClientQuery.data?.user;
  const getVillesQuery = useGetVilles();
  const getVilleCodePostalsQuery = useGetVilleCodePostals({ villeId: formInput?.ville });
  const villeCodePostalsData = getVilleCodePostalsQuery.data;

  const navigate = useNavigate();

  const confirm = useConfirm();

  useEffect(() => {
    if (getClientQuery.isSuccess) {
      setFormInput((f) => {
        return { ...f, ...clientData, ville: clientData?.detail_ville?.id };
      });
    }
  }, [clientData, getClientQuery.isSuccess]);

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
      await updateClientMutation.mutateAsync({
        ...formInput
        // ville: getVillesQuery?.data?.find((e) => formInput?.ville === e?.id)?.nom
      });
    } catch (error) {
      const errorsObject = error?.response?.data;
      setFormErrors(errorsObject);
    }
  };

  return (
    <MainCard
      title={`Client ${clientData?.reference ? '- ' + clientData?.reference : ''}`}
      backButton
      goBackLink={`/clients/${userId}/details`}
    >
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
                <TextField variant="standard" fullWidth label="Référence*" value={formInput?.reference || ''} disabled />
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
                  label="Identifiant fiscale (SIRET) *"
                  value={formInput?.name || ''}
                  name="name"
                  onChange={handleChange}
                  error={!!formErrors?.data?.name}
                  helperText={renderArrayMultiline(formErrors?.data?.name)}
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <TextField
                  variant="standard"
                  fullWidth
                  label="Informations*"
                  value={formInput?.commentaires || ''}
                  name="commentaires"
                  onChange={handleChange}
                  error={!!formErrors?.data?.commentaires}
                  helperText={renderArrayMultiline(formErrors?.data?.commentaires)}
                  multiline
                  rows={4}
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
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h5" component="div">
                  C. Infos résidentielles:
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                {clientData && Array.isArray(getVillesQuery?.data) ? (
                  <Autocomplete
                    onChange={(event, newValue) => {
                      setFormInput((formData) => {
                        return { ...formData, ville: newValue?.id };
                      });
                    }}
                    defaultValue={getVillesQuery?.data?.find((e) => clientData?.detail_ville?.id === e?.id)}
                    options={getVillesQuery?.data || []}
                    getOptionLabel={(option) => option?.nom}
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
                ) : (
                  <Skeleton variant="rounded" width={'100%'} height={40} />
                )}
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

              <Grid item xs={12} md={6}>
                {Array.isArray(villeCodePostalsData) ? (
                  <Autocomplete
                    onChange={(event, newValue) => {
                      setFormInput((formData) => {
                        return { ...formData, code_postal: newValue?.code };
                      });
                    }}
                    defaultValue={villeCodePostalsData?.find((e) => clientData?.code_postal === e?.code)}
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
                  disabled={getClientQuery.isLoading}
                  loadingPosition="end"
                  endIcon={<SendIcon />}
                  loading={updateClientMutation.isLoading}
                  variant="contained"
                  type="submit"
                >
                  Sauvegarder
                </LoadingButton>
              </Grid>
            </Grid>
          </form>
          <Divider
            style={{
              margin: 20
            }}
          />
          <div
            style={{
              display: 'flex',
              gap: 10,
              justifyContent: 'start'
            }}
          >
            <LoadingButton
              disabled={getClientQuery.isLoading}
              loading={toggleClientStatusMutation.isLoading}
              variant="outlined"
              onClick={() =>
                confirm({
                  description: `Êtes-vous sûr de vouloir ${clientData?.active_status ? 'désactiver' : 'activer'} ${clientData?.name}.`,
                  title: `Veuillez confirmer ${clientData?.active_status ? 'la désactivation' : "l'activation"}`
                })
                  .then(() => toggleClientStatusMutation.mutate())
                  .catch(() => console.log('Deactivation cancelled.'))
              }
            >
              {clientData?.active_status ? 'Désactiver' : 'Activer'}
            </LoadingButton>

            <LoadingButton
              disabled={getClientQuery.isLoading}
              loadingPosition="start"
              startIcon={<DeleteIcon />}
              loading={deleteClientMutation.isLoading}
              variant="outlined"
              color="error"
              onClick={() =>
                confirm({
                  description: `Êtes-vous sûr de vouloir supprimer ${clientData?.name}.`,
                  title: `Veuillez confirmer la suppression`
                })
                  .then(async () => {
                    try {
                      await deleteClientMutation.mutateAsync();
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
          </div>
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
