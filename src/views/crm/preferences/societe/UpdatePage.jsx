import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';

// material-ui
import { Divider, Grid, TextField, Typography } from '@mui/material';

// project imports
import { LoadingButton } from '@mui/lab';
import { useConfirm } from 'material-ui-confirm';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCreateSociete, useDeleteSociete, useGetSocieteSettingsById, useUpdateSociete } from 'services/settings.service';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import renderArrayMultiline from 'utilities/utilities';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import moment from 'moment';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const SocieteUpdatePage = () => {
  const { societeId } = useParams();

  const [formErrors, setFormErrors] = useState({});
  const [formInput, setFormInput] = useState({
    intitule: '',
    devise: '',
    matricule_fisacale: '',
    mail: '',
    telephone_1: '',
    telephone_2: '',
    fax: '',
    location: null,
    code_postale: '',
    pays: '',
    ville: '',
    complement: '',
    adresse: '',
    interlocuteur_societe: '',
    interlocuteur_telephone: ''
  });

  const deleteSocieteMutation = useDeleteSociete(societeId);
  const updateSocieteMutation = useUpdateSociete(societeId);
  const createSocieteMutation = useCreateSociete();
  const getSocieteQuery = useGetSocieteSettingsById({ societeId });
  const societeData = getSocieteQuery.data;

  const navigate = useNavigate();
  const confirm = useConfirm();

  useEffect(() => {
    if (getSocieteQuery.isSuccess) {
      setFormInput((f) => {
        return { ...f, ...societeData };
      });
    }
  }, [societeData, getSocieteQuery.isSuccess]);

  const handleChange = (e) => {
    setFormInput({
      ...formInput,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});

    if (getSocieteQuery.isSuccess) {
      try {
        await updateSocieteMutation.mutateAsync(formInput);
      } catch (error) {
        const errorsObject = error?.response?.data;
        setFormErrors(errorsObject);
      }
    } else {
      try {
        await createSocieteMutation.mutateAsync(formInput);
      } catch (error) {
        const errorsObject = error?.response?.data;
        setFormErrors(errorsObject);
      }
    }
  };

  return (
    <MainCard title={`Société ${societeData?.intitule ? '- ' + societeData?.intitule : ''}`} backButton goBackLink={`/settings/societe`}>
      <div>
        <>
          <form onSubmit={handleSubmit} noValidate>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
                <Grid item xs={12}>
                  <Typography variant="h5" component="div">
                    A. Informations générales:
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      variant="standard"
                      fullWidth
                      label="Intitulé"
                      value={formInput?.intitule || ''}
                      name="intitule"
                      onChange={handleChange}
                      error={!!formErrors?.data?.intitule}
                      helperText={renderArrayMultiline(formErrors?.data?.intitule)}
                    />
                  </Grid>{' '}
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    variant="standard"
                    fullWidth
                    label="Devise"
                    value={formInput?.devise || ''}
                    name="devise"
                    onChange={handleChange}
                    error={!!formErrors?.data?.devise}
                    helperText={renderArrayMultiline(formErrors?.data?.devise)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    variant="standard"
                    fullWidth
                    label="Matricule Fisacale"
                    value={formInput?.matricule_fisacale || ''}
                    name="matricule_fisacale"
                    onChange={handleChange}
                    error={!!formErrors?.data?.matricule_fisacale}
                    helperText={renderArrayMultiline(formErrors?.data?.matricule_fisacale)}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h5" component="div">
                    B. interlocuteur:
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    variant="standard"
                    fullWidth
                    label="Intitulé"
                    value={formInput?.interlocuteur_societe || ''}
                    name="interlocuteur_societe"
                    onChange={handleChange}
                    error={!!formErrors?.data?.interlocuteur_societe}
                    helperText={renderArrayMultiline(formErrors?.data?.interlocuteur_societe)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    variant="standard"
                    fullWidth
                    label="Telephone"
                    value={formInput?.interlocuteur_telephone || ''}
                    name="interlocuteur_telephone"
                    onChange={handleChange}
                    error={!!formErrors?.data?.interlocuteur_telephone}
                    helperText={renderArrayMultiline(formErrors?.data?.interlocuteur_telephone)}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h5" component="div">
                    C. Informations de contact:
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    variant="standard"
                    name="mail"
                    onChange={handleChange}
                    fullWidth
                    label="E-mail"
                    value={formInput?.mail || ''}
                    error={!!!!formErrors?.data?.mail}
                    helperText={renderArrayMultiline(formErrors?.data?.mail)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    variant="standard"
                    fullWidth
                    label="Téléphone 1"
                    value={formInput?.telephone_1 || ''}
                    name="telephone_1"
                    onChange={handleChange}
                    error={!!formErrors?.data?.telephone_1}
                    helperText={renderArrayMultiline(formErrors?.data?.telephone_1)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    variant="standard"
                    name="telephone_2"
                    onChange={handleChange}
                    fullWidth
                    label="Téléphone 2"
                    value={formInput?.telephone_2 || ''}
                    error={!!!!formErrors?.data?.telephone_2}
                    helperText={renderArrayMultiline(formErrors?.data?.telephone_2)}
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

                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h5" component="div">
                    D. Adresse:
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    variant="standard"
                    name="adresse"
                    onChange={handleChange}
                    fullWidth
                    label="Adresse"
                    value={formInput?.adresse || ''}
                    error={!!formErrors?.data?.adresse}
                    helperText={renderArrayMultiline(formErrors?.data?.adresse)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    variant="standard"
                    name="code_postale"
                    onChange={handleChange}
                    fullWidth
                    label="Code Postale"
                    value={formInput?.code_postale || ''}
                    error={!!formErrors?.data?.code_postale}
                    helperText={renderArrayMultiline(formErrors?.data?.code_postale)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    variant="standard"
                    name="pays"
                    onChange={handleChange}
                    fullWidth
                    label="Pays"
                    value={formInput?.pays || ''}
                    error={!!formErrors?.data?.pays}
                    helperText={renderArrayMultiline(formErrors?.data?.pays)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    variant="standard"
                    name="ville"
                    onChange={handleChange}
                    fullWidth
                    label="Ville"
                    value={formInput?.ville || ''}
                    error={!!formErrors?.data?.ville}
                    helperText={renderArrayMultiline(formErrors?.data?.ville)}
                  />
                </Grid>
                {/* <Grid item xs={12} md={6}>
                  <TextField
                    variant="standard"
                    name="location"
                    onChange={handleChange}
                    fullWidth
                    label="Location"
                    value={formInput?.location || ''}
                    error={!!formErrors?.data?.location}
                    helperText={renderArrayMultiline(formErrors?.data?.location)}
                  />
                </Grid> */}
                <Grid item xs={12} md={6}>
                  <TextField
                    variant="standard"
                    name="complement"
                    onChange={handleChange}
                    fullWidth
                    label="Complément"
                    value={formInput?.complement || ''}
                    error={!!formErrors?.data?.complement}
                    helperText={renderArrayMultiline(formErrors?.data?.complement)}
                  />
                </Grid>

                <Grid item sx={{ display: 'flex', justifyContent: 'flex-end' }} xs={12}>
                  <LoadingButton
                    disabled={getSocieteQuery.isLoading}
                    loadingPosition="end"
                    endIcon={<SendIcon />}
                    loading={updateSocieteMutation.isLoading}
                    variant="contained"
                    type="submit"
                  >
                    Sauvegarder
                  </LoadingButton>
                </Grid>
              </Grid>
            </LocalizationProvider>
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
              disabled={getSocieteQuery.isLoading}
              loadingPosition="start"
              startIcon={<DeleteIcon />}
              loading={deleteSocieteMutation.isLoading}
              variant="outlined"
              color="error"
              onClick={() =>
                confirm({
                  description: `Êtes-vous sûr de vouloir supprimer ${societeData?.intitule}.`,
                  title: `Veuillez confirmer la suppression`
                })
                  .then(async () => {
                    try {
                      await deleteSocieteMutation.mutateAsync();
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

export default SocieteUpdatePage;
