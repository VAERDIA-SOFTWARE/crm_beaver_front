import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import { Divider, FormControl, FormControlLabel, FormGroup, Grid, Switch, TextField } from '@mui/material';

// project imports
import { LoadingButton } from '@mui/lab';
import { useConfirm } from 'material-ui-confirm';
import { useNavigate, useParams } from 'react-router-dom';
import { useDeleteJourFerie, useGetJoursFeriesDetails, useUpdateJourFerie } from 'services/settings.service';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import renderArrayMultiline from 'utilities/utilities';

const JourFerieUpdatePage = () => {
  const { jourFerieId } = useParams();

  const [formErrors, setFormErrors] = useState({});
  const [formInput, setFormInput] = useState({
    appartient_a: 2,
    nom: '',
    active: 0
  });

  const deleteClientMutation = useDeleteJourFerie(jourFerieId);
  const updateJourFerieMutation = useUpdateJourFerie(jourFerieId);
  const getJourFerieQuery = useGetJoursFeriesDetails({ id: jourFerieId });
  const jourFerieData = getJourFerieQuery.data;

  const navigate = useNavigate();

  const confirm = useConfirm();

  useEffect(() => {
    if (getJourFerieQuery.isSuccess) {
      setFormInput((f) => {
        return { ...f, ...jourFerieData, active: parseInt(jourFerieData?.active) };
      });
    }
  }, [jourFerieData, getJourFerieQuery.isSuccess]);

  const handleChange = (e) => {
    let targetValue = null;

    if (['active'].includes(e.target.name)) {
      targetValue = e.target.checked ? 1 : 0;
    } else {
      targetValue = e.target.value;
    }

    setFormInput({
      ...formInput,
      [e.target.name]: targetValue
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});

    try {
      await updateJourFerieMutation.mutateAsync({
        ...formInput
      });
    } catch (error) {
      const errorsObject = error?.response?.data;
      setFormErrors(errorsObject);
    }
  };

  return (
    <MainCard title={`Jour Férié ${jourFerieData?.nom ? '- ' + jourFerieData?.nom : ''}`} backButton goBackLink={`/settings/jour-ferie`}>
      <div>
        <>
          <form onSubmit={handleSubmit} noValidate>
            <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  variant="standard"
                  fullWidth
                  label="Nom*"
                  value={formInput?.nom || ''}
                  name="nom"
                  onChange={handleChange}
                  error={!!formErrors?.data?.nom}
                  helperText={renderArrayMultiline(formErrors?.data?.nom)}
                />
              </Grid>
              <Grid item xs={12} md={6}></Grid>
              <Grid item xs={12} md={6}>
                <FormControl>
                  <FormGroup row>
                    <FormControlLabel
                      control={<Switch checked={formInput?.active} name="active" onChange={handleChange} />}
                      label="Active"
                    />
                  </FormGroup>
                </FormControl>
              </Grid>

              <Grid item sx={{ display: 'flex', justifyContent: 'flex-end' }} xs={12}>
                <LoadingButton
                  disabled={getJourFerieQuery.isLoading}
                  loadingPosition="end"
                  endIcon={<SendIcon />}
                  loading={updateJourFerieMutation.isLoading}
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
              justifyContent: 'end'
            }}
          >
            <LoadingButton
              disabled={getJourFerieQuery.isLoading}
              loadingPosition="start"
              startIcon={<DeleteIcon />}
              loading={deleteClientMutation.isLoading}
              variant="outlined"
              color="error"
              onClick={() =>
                confirm({
                  description: `Êtes-vous sûr de vouloir supprimer ${jourFerieData?.nom}.`,
                  title: `Veuillez confirmer la suppression`
                })
                  .then(async () => {
                    try {
                      await deleteClientMutation.mutateAsync();
                      navigate('/settings/jour-ferie', {
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

JourFerieUpdatePage.propTypes = {
  open: PropTypes.bool,
  handleCloseDialog: PropTypes.func
};

export default JourFerieUpdatePage;
