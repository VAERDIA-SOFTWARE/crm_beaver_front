import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import SendIcon from '@mui/icons-material/Send';
import {
  Autocomplete,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  Skeleton,
  Switch,
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
import { useCreateJourFerie } from 'services/settings.service';

const JourFerieCreatePage = () => {
  const { jourFerieId } = useParams();

  const [formErrors, setFormErrors] = useState({});
  const [formInput, setFormInput] = useState({
    appartient_a: 2,
    nom: '',
    active: 0
  });

  const createJourFerieMutation = useCreateJourFerie(jourFerieId);

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
      await createJourFerieMutation.mutateAsync(formInput);

      navigate('/settings/jour-ferie');
    } catch (error) {
      const errorsObject = error?.response?.data;
      setFormErrors(errorsObject);
    }
  };

  return (
    <MainCard title="Ajouter Jour Férié" backButton goBackLink="/settings/jour-ferie">
      <div>
        <>
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
                  loadingPosition="end"
                  endIcon={<SendIcon />}
                  loading={createJourFerieMutation.isLoading}
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

JourFerieCreatePage.propTypes = {
  open: PropTypes.bool,
  handleCloseDialog: PropTypes.func
};

export default JourFerieCreatePage;
