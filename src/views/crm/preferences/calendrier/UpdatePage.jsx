import { useEffect, useState } from 'react';

// material-ui
import SendIcon from '@mui/icons-material/Send';
import { FormControl, FormControlLabel, FormGroup, Grid, Switch, TextField } from '@mui/material';

// project imports
import { LoadingButton } from '@mui/lab';
import { useParams } from 'react-router-dom';
import { useGetSettingsCalendrierEmploiDetailsSingle, useUpdateSettingsCalendrierEmploiDetails } from 'services/settings.service';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import renderArrayMultiline from 'utilities/utilities';
import { LocalizationProvider, StaticTimePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

const SettingsCurrentPiecesUpdatePage = () => {
  const { calendrierId } = useParams();

  const [formErrors, setFormErrors] = useState({});
  const [formInput, setFormInput] = useState({
    date_deb: '',
    date_fin: ''
  });
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const updateSettingsCurrentPiecesMutation = useUpdateSettingsCalendrierEmploiDetails();
  const useGetSettingsCurrentPiecesDetailsQuery = useGetSettingsCalendrierEmploiDetailsSingle({ id: calendrierId });
  const settingsCurrentPiecesDetailsData = useGetSettingsCurrentPiecesDetailsQuery.data;

  useEffect(() => {
    if (useGetSettingsCurrentPiecesDetailsQuery.isSuccess) {
      setStartDate(startDate.setHours(settingsCurrentPiecesDetailsData.date_deb?.slice(0, 2)));
      setStartDate(startDate.setMinutes(settingsCurrentPiecesDetailsData.date_deb?.slice(3, 5)));
      setEndDate(endDate.setHours(settingsCurrentPiecesDetailsData.date_fin?.slice(0, 2)));
      setEndDate(endDate.setMinutes(settingsCurrentPiecesDetailsData.date_fin?.slice(3, 5)));
      setFormInput((f) => {
        return { ...f, ...settingsCurrentPiecesDetailsData, active: parseInt(settingsCurrentPiecesDetailsData?.active) };
      });
    }
  }, [settingsCurrentPiecesDetailsData, useGetSettingsCurrentPiecesDetailsQuery.isSuccess]);
  console.log(startDate);
  const handleChange = (e, type) => {
    let hours = e.getHours().toString();
    let minutes = e.getMinutes().toString();
    if (hours.length < 2) hours = '0' + hours;
    if (minutes.length < 2) minutes = '0' + minutes;
    if (type === 1) {
      setStartDate(e);
      setFormInput({
        ...formInput,
        date_deb: hours + ':' + minutes
      });
    } else {
      setEndDate(e);
      setFormInput({
        ...formInput,
        date_fin: hours + ':' + minutes
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});

    try {
      await updateSettingsCurrentPiecesMutation.mutateAsync({
        id: calendrierId,
        values: formInput
      });
    } catch (error) {
      const errorsObject = error?.response?.data;
      setFormErrors(errorsObject);
    }
  };
  return (
    <MainCard title={`Calendrier Détails`} backButton goBackLink={`/settings/calendrier/emploi/list/${calendrierId}`}>
      <div>
        {useGetSettingsCurrentPiecesDetailsQuery.isSuccess && (
          <form onSubmit={handleSubmit} noValidate>
            <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
              {/* <Grid item xs={12} md={6}>
                <TextField variant="standard" fullWidth label="Référence*" value={formInput?.reference || ''} disabled />
              </Grid> */}
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Grid item xs={12} md={6}>
                  {/* <TextField
                variant="standard"
                fullWidth
                label="Date Début"
                value={formInput?.date_deb ?? ''}
                name="date_deb"
                onChange={handleChange}
                error={!!formErrors?.data?.date_deb}
                helperText={renderArrayMultiline(formErrors?.data?.date_deb)}
              /> */}

                  <TimePicker
                    views={['hours', 'minutes']}
                    // format="hh:mm"
                    ampm={false}
                    label="Date Début"
                    value={startDate}
                    onChange={(event) => handleChange(event, 1)}
                    onError={!!formErrors?.data?.date_deb}
                    helperText={renderArrayMultiline(formErrors?.data?.date_deb)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TimePicker
                    views={['hours', 'minutes']}
                    // format="hh:mm"
                    ampm={false}
                    label="Date fin"
                    value={endDate}
                    onChange={(event) => handleChange(event, 2)}
                    onError={!!formErrors?.data?.date_fin}
                    helperText={renderArrayMultiline(formErrors?.data?.date_fin)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                  {/* <TextField
                variant="standard"
                fullWidth
                label="Date Fin"
                value={formInput?.date_fin ?? ''}
                name="date_fin"
                onChange={handleChange}
                error={!!formErrors?.data?.date_fin}
                helperText={renderArrayMultiline(formErrors?.data?.date_fin)}
              /> */}
                </Grid>
              </LocalizationProvider>

              <Grid item xs={12} md={6}>
                <FormControl>
                  <FormGroup row>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formInput?.active}
                          name="active"
                          onChange={(e) =>
                            setFormInput({
                              ...formInput,
                              active: e.target.checked ? 1 : 0
                            })
                          }
                        />
                      }
                      label="Disponibilité"
                    />
                  </FormGroup>
                </FormControl>
              </Grid>

              <Grid item sx={{ display: 'flex', justifyContent: 'flex-end' }} xs={12}>
                <LoadingButton
                  loadingPosition="end"
                  endIcon={<SendIcon />}
                  loading={updateSettingsCurrentPiecesMutation.isLoading}
                  variant="contained"
                  type="submit"
                >
                  Sauvegarder
                </LoadingButton>
              </Grid>
            </Grid>
          </form>
        )}
      </div>
    </MainCard>
  );
};

export default SettingsCurrentPiecesUpdatePage;
