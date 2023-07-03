import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import SendIcon from '@mui/icons-material/Send';
import { Grid, TextField } from '@mui/material';

// project imports
import { LoadingButton } from '@mui/lab';
import { DatePicker, LocalizationProvider, frFR } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import { useNavigate, useParams } from 'react-router-dom';
import { useCreateJourFerieChild } from 'services/settings.service';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import renderArrayMultiline from 'utilities/utilities';

const JourFerieChildCreatePage = () => {
  const { parentId } = useParams();
  const [formErrors, setFormErrors] = useState({});
  const [formInput, setFormInput] = useState({
    date: null,
    nom: '',
    p_calendrier_id: parentId
  });

  const createJourFerieChildMutation = useCreateJourFerieChild();

  const navigate = useNavigate();

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
      await createJourFerieChildMutation.mutateAsync(formInput);

      navigate(`/settings/jour-ferie/${parentId}/jour-ferie-children/list`);
    } catch (error) {
      const errorsObject = error?.response?.data;
      setFormErrors(errorsObject);
    }
  };

  return (
    <MainCard title="Ajouter Jour Férié" backButton goBackLink={`/settings/jour-ferie/${parentId}/jour-ferie-children/list`}>
      <div>
        <form onSubmit={handleSubmit}>
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

            <Grid item sx={{ display: 'flex', justifyContent: 'flex-end' }} xs={12}>
              <LoadingButton
                loadingPosition="end"
                endIcon={<SendIcon />}
                loading={createJourFerieChildMutation.isLoading}
                variant="contained"
                type="submit"
              >
                Ajouter
              </LoadingButton>
            </Grid>
          </Grid>
        </form>
      </div>
    </MainCard>
  );
};

JourFerieChildCreatePage.propTypes = {
  open: PropTypes.bool,
  handleCloseDialog: PropTypes.func
};

export default JourFerieChildCreatePage;
