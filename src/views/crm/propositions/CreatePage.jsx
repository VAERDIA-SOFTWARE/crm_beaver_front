import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import SendIcon from '@mui/icons-material/Send';
import { Autocomplete, Divider, Grid, TextField } from '@mui/material';

// project imports
import { LoadingButton } from '@mui/lab';
import { useGetChantiers } from 'services/chantier.service';
import { useCreateInspection } from 'services/inspections.service';
import { useGetUsers } from 'services/users.service';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import renderArrayMultiline from 'utilities/utilities';

const InspectionsCreatePage = () => {
  const createInspectionMutation = useCreateInspection();
  const getChantiersQuery = useGetChantiers({ paginated: false });
  const getTechniciensQuery = useGetUsers({ role: 'technicien', paginated: false });

  const [formErrors, setFormErrors] = useState({});

  const [formInput, setFormInput] = useState({
    date_json: '',
    date: '',
    debut: '',
    fin: '',
    statut: ''
  });

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
      await createInspectionMutation.mutateAsync(formInput);
    } catch (error) {
      const errorsObject = error?.response?.data;
      setFormErrors(errorsObject);
    }
  };

  return (
    <MainCard title="Ajouter Intervention" backButton goBackLink="/propositions/list">
      <div>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
            <Grid item xs={12} md={6}>
              <TextField
                variant="standard"
                fullWidth
                label="Date*"
                value={formInput?.date || ''}
                name="date"
                onChange={handleChange}
                error={!!formErrors?.data?.date}
                helperText={renderArrayMultiline(formErrors?.data?.date)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                variant="standard"
                fullWidth
                label="Début*"
                value={formInput?.debut || ''}
                name="debut"
                onChange={handleChange}
                error={!!formErrors?.data?.debut}
                helperText={renderArrayMultiline(formErrors?.data?.debut)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                variant="standard"
                fullWidth
                label="Fin*"
                value={formInput?.fin || ''}
                name="fin"
                onChange={handleChange}
                error={!!formErrors?.data?.fin}
                helperText={renderArrayMultiline(formErrors?.data?.fin)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Autocomplete
                onChange={(event, newValue) => {
                  setFormInput((formData) => {
                    return { ...formData, ville: newValue?.id };
                  });
                }}
                multiple={false}
                options={getChantiersQuery?.data || []}
                getOptionLabel={(option) => option?.id}
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
            </Grid>
            <Grid item xs={12} md={6}>
              <Autocomplete
                onChange={(event, newValue) => {
                  // const arr = newValue.map((e) => e?.id);
                  setFormInput((formData) => {
                    return { ...formData, ville: newValue?.id };
                  });
                }}
                multiple={false}
                options={getTechniciensQuery?.data || []}
                getOptionLabel={(option) => option?.id}
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
            </Grid>
            <Grid item sx={{ display: 'flex', justifyContent: 'flex-end' }} xs={12}>
              <LoadingButton
                loadingPosition="start"
                startIcon={<SendIcon />}
                loading={createInspectionMutation.isLoading}
                variant="contained"
                type="submit"
              >
                Modifier
              </LoadingButton>
            </Grid>
          </Grid>
        </form>
        <Divider
          style={{
            margin: 20
          }}
        />
      </div>
    </MainCard>
  );
};

InspectionsCreatePage.propTypes = {
  open: PropTypes.bool,
  handleCloseDialog: PropTypes.func
};

export default InspectionsCreatePage;
