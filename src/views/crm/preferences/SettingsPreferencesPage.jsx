import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import SendIcon from '@mui/icons-material/Send';
import { Grid, TextField } from '@mui/material';

// project imports
import { LoadingButton } from '@mui/lab';
import {
  useGetInterventionColor,
  useGetSettingsPreferences,
  useUpdateInterventionColors,
  useUpdateSettingsPreferences
} from 'services/settings.service';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import renderArrayMultiline from 'utilities/utilities';
import { useEffect } from 'react';

const SettingsPreferencesPage = () => {
  const [formErrors, setFormErrors] = useState({});
  const [formInput, setFormInput] = useState({
    max_interventions: '',
    percentage: '',
    max_intervention_hours: '',
    max_interventions_par: '',
    default_pagination: '',
    intervention_color: '',
    validated_intervention_color: '',
    taux_tva: '',
    contract_notice_days: ''
  });
  const [interventionColorFormInput, setInterventionColorFormInput] = useState([]);

  const settingsPreferencesQuery = useGetSettingsPreferences();
  const settingsPreferencesData = settingsPreferencesQuery.data;
  const useGetInterventionSettingsQuery = useGetInterventionColor();
  const interventionColorData = useGetInterventionSettingsQuery?.data;
  console.log(interventionColorData, 'interventionColorData');
  useEffect(() => {
    if (settingsPreferencesQuery.isSuccess) {
      setFormInput((f) => {
        return { ...f, ...settingsPreferencesData };
      });
    }
  }, [settingsPreferencesData, settingsPreferencesQuery.isSuccess]);

  const updateSettingsPreferencesMutation = useUpdateSettingsPreferences();
  const updateColorsMutation = useUpdateInterventionColors();

  const handleChange = (e) => {
    setFormInput({
      ...formInput,
      [e.target.name]: e.target.value
    });
  };
  useEffect(() => {
    if (useGetInterventionSettingsQuery.isSuccess) {
      setInterventionColorFormInput([...interventionColorData]);
    }
  }, [useGetInterventionSettingsQuery.isSuccess, interventionColorData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});

    try {
      await updateSettingsPreferencesMutation.mutateAsync({
        ...formInput
      });
      await updateColorsMutation.mutateAsync({
        ...interventionColorFormInput
      });
    } catch (error) {
      const errorsObject = error?.response?.data;
      setFormErrors(errorsObject);
    }
  };
  const handleColorsChange = (index, event) => {
    const { name, value } = event.target;
    setInterventionColorFormInput((prevState) => {
      const updatedInterventionColors = [...prevState];
      updatedInterventionColors[index] = {
        ...updatedInterventionColors[index],
        [name]: value
      };
      return updatedInterventionColors;
    });
  };

  return (
    <>
      {useGetInterventionSettingsQuery.isSuccess && interventionColorFormInput?.length > 0 && (
        <MainCard title={`Préférences`}>
          <div>
            <form onSubmit={handleSubmit} noValidate>
              <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
                <Grid item xs={12} md={6}>
                  <TextField
                    variant="standard"
                    fullWidth
                    label="Pagination"
                    value={formInput?.default_pagination ?? ''}
                    name="default_pagination"
                    onChange={handleChange}
                    error={!!formErrors?.data?.default_pagination}
                    helperText={renderArrayMultiline(formErrors?.data?.default_pagination)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    variant="standard"
                    name="max_interventions"
                    onChange={handleChange}
                    fullWidth
                    label="Max interventions par jour"
                    value={formInput?.max_interventions ?? ''}
                    error={!!!!formErrors?.data?.max_interventions}
                    helperText={renderArrayMultiline(formErrors?.data?.max_interventions)}
                  />
                </Grid>
                {/* <Grid item xs={12} md={6}>
              <TextField
                variant="standard"
                name="max_interventions_hours"
                onChange={handleChange}
                fullWidth
                label="Durée d'interventions"
                value={formInput?.max_interventions_hours ?? ''}
                error={!!!!formErrors?.data?.max_interventions_hours}
                helperText={renderArrayMultiline(formErrors?.data?.max_interventions_hours)}
              />
            </Grid> */}
                <Grid item xs={12} md={6}>
                  <TextField
                    variant="standard"
                    name="taux_tva"
                    onChange={handleChange}
                    fullWidth
                    label="Taux TVA"
                    value={formInput?.taux_tva ?? ''}
                    error={!!!!formErrors?.data?.taux_tva}
                    helperText={renderArrayMultiline(formErrors?.data?.taux_tva)}
                  />
                </Grid>

                {interventionColorFormInput.map((element, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <div style={{ marginBottom: 4 }}>
                      <label htmlFor={`couleur-${index}`}>Couleur {element.nom}</label>
                    </div>
                    <input
                      id={`couleur-${index}`}
                      onChange={(event) => handleColorsChange(index, event)}
                      name="couleur"
                      type="color"
                      value={element.couleur}
                    />
                  </Grid>
                ))}

                <Grid item sx={{ display: 'flex', justifyContent: 'flex-end' }} xs={12}>
                  <LoadingButton
                    loadingPosition="end"
                    endIcon={<SendIcon />}
                    loading={updateSettingsPreferencesMutation.isLoading}
                    variant="contained"
                    type="submit"
                  >
                    Sauvegarder
                  </LoadingButton>
                </Grid>
              </Grid>
            </form>
          </div>
        </MainCard>
      )}
    </>
  );
};

SettingsPreferencesPage.propTypes = {
  open: PropTypes.bool,
  handleCloseDialog: PropTypes.func
};

export default SettingsPreferencesPage;
