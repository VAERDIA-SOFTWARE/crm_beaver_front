import { useState } from 'react';

// material-ui
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import { Grid, TextField } from '@mui/material';

// project imports
import { LoadingButton } from '@mui/lab';
import { useLocation, useNavigate } from 'react-router-dom';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import renderArrayMultiline from 'utilities/utilities';
import { useCreateSettingsCategoryClient } from 'services/settings.service';

const CategorieCreatePage = () => {
  const location = useLocation();
  const goBackLink = location.state?.goBackLink;
  const createCategorieMutation = useCreateSettingsCategoryClient();
  const [formErrors, setFormErrors] = useState({});
  const [formInput, setFormInput] = useState({
    intitule: ''
  });

  const navigate = useNavigate();

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
      const f = {
        ...formInput
      };
      const formData = new FormData();
      for (let key in f) {
        formData.append(key, f[key]);
      }

      const res = await createCategorieMutation.mutateAsync(formData);
      navigate('/admin/categories-clients');
    } catch (error) {
      const errorsObject = error?.response?.data;
      setFormErrors(errorsObject);
    }
  };

  return (
    <MainCard title="Ajouter Catégorie ClieuseCreateSettingsCategoryClient" backButton goBackLink={goBackLink}>
      <div
        style={{
          maxWidth: 2000,
          marginLeft: 'auto',
          marginRight: 'auto'
        }}
      >
        <form onSubmit={handleSubmit} noValidate>
          <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
            <Grid item xs={12} md={6}>
              <TextField
                variant="standard"
                fullWidth
                label="Intitule"
                value={formInput?.intitule || ''}
                name="intitule"
                onChange={handleChange}
                error={!!formErrors?.data?.intitule}
                helperText={renderArrayMultiline(formErrors?.data?.intitule)}
              />
            </Grid>

            <Grid item sx={{ display: 'flex', justifyContent: 'flex-end' }} xs={12}>
              <LoadingButton
                loadingPosition="end"
                endIcon={<NavigateNextRoundedIcon />}
                loading={createCategorieMutation.isLoading}
                variant="contained"
                type="submit"
              >
                Créer
              </LoadingButton>
            </Grid>
          </Grid>
        </form>
      </div>
    </MainCard>
  );
};

export default CategorieCreatePage;
