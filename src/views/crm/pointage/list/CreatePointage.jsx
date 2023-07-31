import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { Grid, TextField } from '@mui/material';
import moment from 'moment';
import { useState } from 'react';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const CreatePointage = () => {
  const [formInput, setFormInput] = useState({
    date_debut: '',
    date_fin: '',
    description: '',
    emplacement: '',
    id: null,
    status: null
  });
  const handleSubmit = () => {};

  return (
    <MainCard title={`Ajouter Pointage`}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
              <Grid item xs={12} md={6}>
                <DesktopDatePicker
                  label="Date de début"
                  inputFormat="dd/MM/yyyy"
                  value={moment(formInput?.date_debut).format('YYYY-MM-DD HH:mm:ss')}
                  onChange={(v) => {
                    try {
                      setFormInput((f) => {
                        return { ...f, date_debut: v };
                      });
                    } catch (error) {}
                  }}
                  renderInput={(params) => (
                    <TextField
                      fullWidth
                      required
                      variant="standard"
                      {...params}
                      //   error={!!formErrors?.data?.date_debut}
                      //   helperText={renderArrayMultiline(formErrors?.data?.date_debut)}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <DesktopDatePicker
                  label="Fin du journée"
                  inputFormat="dd/MM/yyyy"
                  value={moment(formInput?.date_fin).format('YYYY-MM-DD HH:mm:ss')}
                  onChange={(v) => {
                    try {
                      setFormInput((f) => {
                        return { ...f, date_fin: v };
                      });
                    } catch (error) {}
                  }}
                  renderInput={(params) => (
                    <TextField
                      fullWidth
                      required
                      variant="standard"
                      {...params}
                      //   error={!!formErrors?.data?.date_debut}
                      //   helperText={renderArrayMultiline(formErrors?.data?.date_debut)}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </form>
        </>
      </LocalizationProvider>
    </MainCard>
  );
};
export default CreatePointage;
