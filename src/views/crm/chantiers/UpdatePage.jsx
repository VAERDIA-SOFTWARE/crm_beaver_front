import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import SaveIcon from '@mui/icons-material/Save';
import { Divider, Grid, TextField, Typography } from '@mui/material';

// project imports
import { LoadingButton } from '@mui/lab';
import { useParams } from 'react-router-dom';
import { useGetChantier } from 'services/chantier.service';
import { useUpdateUser } from 'services/users.service';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import renderArrayMultiline from 'utilities/utilities';
import useAuth from 'hooks/useAuth';

const ChantierUpdatePage = () => {
  const { chantierId } = useParams();
  const updateClientMutation = useUpdateUser(chantierId);
  const getChantierQuery = useGetChantier(chantierId);
  const chantierData = getChantierQuery.data;

  const [formErrors, setFormErrors] = useState({});
  const [formInput, setFormInput] = useState({
    reference: '',
    date_commande: '',
    donneur_ordre: '',
    num_serie: '',
    nom_benificiaire: '',
    prenom_benificiary: '',
    presonne_morale: '',
    adresse: '',
    code_postal: '',
    ville: '',
    telephone_1: '',
    telephone_2: '',
    operation_controller: '',
    date_devis: '',
    date_facture: '',
    materiaux: '',
    commentaires: '',
    etat: '',
    a_inspecter: '',
    date_etat: '',
    location: '',
    location_prevu: '',
    p_operation_id: '',
    d_lot_chantier_id: '',
    lot_chantier: ''
  });

  useEffect(() => {
    if (getChantierQuery.isSuccess) {
      setFormInput((f) => {
        return { ...f, ...chantierData };
      });
    }
  }, [chantierData, getChantierQuery.isSuccess]);

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
    } catch (error) {
      const errorsObject = error?.response?.data;
      setFormErrors(errorsObject);
    }
  };

  return (
    <MainCard
      title={`Contrat ${chantierData?.reference ? '- ' + chantierData?.reference : ''}`}
      backButton
      goBackLink={`/chantiers/${chantierId}/details`}
    >
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
              value={formInput?.date_commande || ''}
              name="date_commande"
              onChange={handleChange}
              error={!!formErrors?.data?.date_commande}
              helperText={renderArrayMultiline(formErrors?.data?.name)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              variant="standard"
              name="donneur_ordre"
              onChange={handleChange}
              fullWidth
              label="Adresse*"
              value={formInput?.donneur_ordre || ''}
              error={!!formErrors?.data?.donneur_ordre}
              helperText={renderArrayMultiline(formErrors?.data?.address)}
            />
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>{' '}
          <Grid item xs={12}>
            <Typography variant="h5" component="div">
              B. Informations de contact:
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              variant="standard"
              name="num_serie"
              onChange={handleChange}
              fullWidth
              label="Numéro de téléphone*"
              value={formInput?.num_serie || ''}
              error={!!!!formErrors?.data?.num_serie}
              helperText={renderArrayMultiline(formErrors?.data?.phone_number)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              variant="standard"
              fullWidth
              label="E-mail*"
              value={formInput?.nom_benificiaire || ''}
              name="nom_benificiaire"
              onChange={handleChange}
              error={!!formErrors?.data?.nom_benificiaire}
              helperText={renderArrayMultiline(formErrors?.data?.email)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              variant="standard"
              name="prenom_benificiary"
              onChange={handleChange}
              fullWidth
              label="prenom_benificiary*"
              value={formInput?.prenom_benificiary || ''}
              error={!!!!formErrors?.data?.prenom_benificiary}
              helperText={renderArrayMultiline(formErrors?.data?.fax)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              variant="standard"
              name="presonne_morale"
              onChange={handleChange}
              fullWidth
              label="Identifiant Fiscal*"
              value={formInput?.presonne_morale || ''}
              error={!!!!formErrors?.data?.presonne_morale}
              helperText={renderArrayMultiline(formErrors?.data?.identifient_fiscal)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              variant="standard"
              name="adresse"
              onChange={handleChange}
              fullWidth
              label="Identifiant TVA*"
              value={formInput?.adresse || ''}
              error={!!!!formErrors?.data?.adresse}
              helperText={renderArrayMultiline(formErrors?.data?.identifient_tva)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              variant="standard"
              name="code_postal"
              onChange={handleChange}
              fullWidth
              label="Interlocuteur*"
              value={formInput?.code_postal || ''}
              error={!!!!formErrors?.data?.code_postal}
              helperText={renderArrayMultiline(formErrors?.data?.interlocuteur)}
            />
          </Grid>
          <Grid item sx={{ display: 'flex', justifyContent: 'flex-end' }} xs={12}>
            <LoadingButton
              loadingPosition="start"
              startIcon={<SaveIcon />}
              loading={updateClientMutation.isLoading}
              variant="contained"
              type="submit"
            >
              Modifier
            </LoadingButton>
          </Grid>
        </Grid>
      </form>
    </MainCard>
  );
};

ChantierUpdatePage.propTypes = {
  open: PropTypes.bool,
  handleCloseDialog: PropTypes.func
};

export default ChantierUpdatePage;
