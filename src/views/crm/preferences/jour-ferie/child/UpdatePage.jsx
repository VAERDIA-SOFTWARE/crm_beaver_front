import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import { Divider, Grid, TextField } from '@mui/material';

// project imports
import { LoadingButton } from '@mui/lab';
import { useConfirm } from 'material-ui-confirm';
import { useNavigate, useParams } from 'react-router-dom';
import { useDeleteJourFerieChild, useGetJoursFeriesChild, useUpdateJourFerieChild } from 'services/settings.service';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import renderArrayMultiline from 'utilities/utilities';
import { DatePicker, DateTimePicker, LocalizationProvider, frFR } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';

const JourFerieChildUpdatePage = () => {
  const { parentId, jourFerieChildId } = useParams();

  const [formErrors, setFormErrors] = useState({});
  const [formInput, setFormInput] = useState({
    date: null,
    nom: ''
  });

  const deleteClientMutation = useDeleteJourFerieChild(jourFerieChildId);
  const updateJourFerieChildMutation = useUpdateJourFerieChild(jourFerieChildId);
  const getJourFerieChildQuery = useGetJoursFeriesChild({ id: jourFerieChildId });
  const jourFerieData = getJourFerieChildQuery.data;

  const navigate = useNavigate();

  const confirm = useConfirm();

  useEffect(() => {
    if (getJourFerieChildQuery.isSuccess) {
      setFormInput((f) => {
        return { ...f, ...jourFerieData, active: parseInt(jourFerieData?.active) };
      });
    }
  }, [jourFerieData, getJourFerieChildQuery.isSuccess]);

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
      await updateJourFerieChildMutation.mutateAsync({
        ...formInput
      });
    } catch (error) {
      const errorsObject = error?.response?.data;
      setFormErrors(errorsObject);
    }
  };

  return (
    <MainCard
      title={`Jour Férié ${jourFerieData?.nom ? '- ' + jourFerieData?.nom : ''}`}
      backButton
      goBackLink={`/settings/jour-ferie/${parentId}/jour-ferie-children/list`}
    >
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
                <LocalizationProvider
                  dateAdapter={AdapterDateFns}
                  // adapterLocale="fr"
                  localeText={frFR.components.MuiLocalizationProvider.defaultProps.localeText}
                >
                  <DatePicker
                    renderInput={(params) => (
                      <TextField
                        variant="standard"
                        {...params}
                        error={!!formErrors?.data?.date}
                        helperText={renderArrayMultiline(formErrors?.data?.date)}
                      />
                    )}
                    label="Date"
                    value={formInput?.date}
                    onChange={(v) => {
                      try {
                        const formattedDate = format(v, 'yyyy-MM-dd');
                        setFormInput((f) => {
                          return { ...f, date: formattedDate };
                        });
                      } catch (error) {}
                    }}
                  />
                </LocalizationProvider>
              </Grid>

              {/* <Grid item xs={12} md={6}>
                <FormControl>
                  <FormGroup row>
                    <FormControlLabel
                      control={<Switch checked={formInput?.active} name="active" onChange={handleChange} />}
                      label="Active"
                    />
                  </FormGroup>
                </FormControl>
              </Grid> */}

              <Grid item sx={{ display: 'flex', justifyContent: 'flex-end' }} xs={12}>
                <LoadingButton
                  disabled={getJourFerieChildQuery.isLoading}
                  loadingPosition="end"
                  endIcon={<SendIcon />}
                  loading={updateJourFerieChildMutation.isLoading}
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
              disabled={getJourFerieChildQuery.isLoading}
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
                      navigate(`settings/jour-ferie/${jourFerieData?.p_calendrier_id}/jour-ferie-children/list`, {
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

JourFerieChildUpdatePage.propTypes = {
  open: PropTypes.bool,
  handleCloseDialog: PropTypes.func
};

export default JourFerieChildUpdatePage;
