import { async } from '@firebase/util';
import { LoadingButton } from '@mui/lab';
import { Autocomplete, Grid, TextField } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import moment from 'moment';
import { useState } from 'react';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import renderArrayMultiline from 'utilities/utilities';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { useCreateReglement, useGetReglementsMode } from 'services/reglements.service';
import SendIcon from '@mui/icons-material/Send';
import { Navigate, useNavigate } from 'react-router-dom';
import { useGetUsers } from 'services/users.service';
import { useGetFactures } from 'services/facture.service';

const CreateReglement = () => {
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({});
  const [formInput, setFormInput] = useState({
    libelle: '',
    p_mode_de_reglement_id: '',
    date_echeance: new Date(),
    date: new Date(),
    reference_cheque: '',
    reference_traite: '',
    montant: '',
    factures: [],
    client_id: ''
  });
  const useGetModeReglementQuery = useGetReglementsMode();
  const reglementMode = useGetModeReglementQuery?.data;
  const useGetFactureQuery = useGetFactures({ paginated: false, clientId: formInput?.client_id, status: '17,' });
  const factureData = useGetFactureQuery?.data;
  const createReglementMutation = useCreateReglement();
  const getClientsQuery = useGetUsers({ type: '1', paginated: false, role: 'client' });

  const [selectedFacture, setSelectedFacture] = useState(null);
  const [selectedReglementMode, setSelectedReglementMode] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});

    try {
      const formattedInput = {
        ...formInput,
        date: moment(formInput?.date).format('YYYY-MM-DD'),
        date_echeance: moment(formInput?.date_echeance).format('YYYY-MM-DD')
      };
      await createReglementMutation.mutateAsync(formattedInput);

      navigate('/reglements/list');
    } catch (error) {
      const errorsObject = error?.response?.data;
      setFormErrors(errorsObject);
    }
  };
  const handleChange = (e) => {
    setFormInput({
      ...formInput,
      [e.target.name]: e.target.value
    });
  };
  console.log(formInput);
  return (
    <MainCard title={`Ajouter Reglement`} backButton goBackLink="/reglements/list">
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  variant="standard"
                  fullWidth
                  label="Libelle*"
                  value={formInput?.libelle || ''}
                  name="libelle"
                  onChange={handleChange}
                  error={!!formErrors?.data?.libelle}
                  helperText={renderArrayMultiline(formErrors?.data?.libelle)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  onChange={(event, newValue) => {
                    setFormInput((formData) => {
                      return { ...formData, client_id: newValue?.id };
                    });
                  }}
                  options={getClientsQuery?.data || []}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      label="Client*"
                      error={!!formErrors?.data?.client_id}
                      helperText={renderArrayMultiline(formErrors?.data?.client_id)}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  onChange={(event, newValue) => {
                    setSelectedReglementMode(newValue);

                    setFormInput((formData) => {
                      return { ...formData, p_mode_de_reglement_id: newValue?.id };
                    });
                  }}
                  options={reglementMode || []}
                  getOptionLabel={(option) => option.intitule}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      label="Catégorie*"
                      error={!!formErrors?.data?.p_mode_de_reglement_id}
                      helperText={renderArrayMultiline(formErrors?.data?.p_mode_de_reglement_id)}
                    />
                  )}
                />
              </Grid>
              {selectedReglementMode?.intitule === 'cheque' && (
                <Grid item xs={12} md={6}>
                  <TextField
                    variant="standard"
                    fullWidth
                    label="Reference cheque"
                    value={formInput?.reference_cheque || ''}
                    name="reference_cheque"
                    onChange={handleChange}
                    error={!!formErrors?.data?.reference_cheque}
                    helperText={renderArrayMultiline(formErrors?.data?.reference_cheque)}
                  />
                </Grid>
              )}
              {selectedReglementMode?.intitule === 'traite' && (
                <Grid item xs={12} md={6}>
                  <TextField
                    variant="standard"
                    fullWidth
                    label="Reference traite"
                    value={formInput?.reference_traite || ''}
                    name="reference_traite"
                    onChange={handleChange}
                    error={!!formErrors?.data?.reference_traite}
                    helperText={renderArrayMultiline(formErrors?.data?.reference_traite)}
                  />
                </Grid>
              )}
              <Grid item xs={12} md={6}>
                <TextField
                  variant="standard"
                  type="number"
                  fullWidth
                  label="Montant*"
                  value={formInput?.montant || ''}
                  name="montant"
                  onChange={handleChange}
                  error={!!formErrors?.data?.montant}
                  helperText={renderArrayMultiline(formErrors?.data?.montant)}
                />
              </Grid>
              {(selectedReglementMode?.intitule === 'traite' || selectedReglementMode?.intitule === 'cheque') && (
                <Grid item xs={12} md={6}>
                  <DesktopDatePicker
                    label="Date écheance"
                    inputFormat="dd/MM/yyyy"
                    value={moment(formInput?.date_echeance).format('YYYY-MM-DD')}
                    onChange={(v) => {
                      try {
                        setFormInput((f) => {
                          return { ...f, date_echeance: v };
                        });
                      } catch (error) {}
                    }}
                    renderInput={(params) => (
                      <TextField
                        fullWidth
                        required
                        variant="standard"
                        {...params}
                        error={!!formErrors?.data?.date_echeance}
                        helperText={renderArrayMultiline(formErrors?.data?.date_echeance)}
                      />
                    )}
                  />
                </Grid>
              )}
              {/* <Grid item xs={12} md={6}>
                <DesktopDatePicker
                  label="Date du création"
                  inputFormat="dd/MM/yyyy"
                  value={moment(formInput?.date).format('YYYY-MM-DD')}
                  onChange={(v) => {
                    try {
                      setFormInput((f) => {
                        return { ...f, date: v };
                      });
                    } catch (error) {}
                  }}
                  renderInput={(params) => (
                    <TextField
                      fullWidth
                      required
                      variant="standard"
                      {...params}
                      error={!!formErrors?.data?.date}
                      helperText={renderArrayMultiline(formErrors?.data?.date)}
                    />
                  )}
                />
              </Grid> */}

              <Grid item xs={12} md={6}>
                <Autocomplete
                  multiple
                  onChange={(event, newValue) => {
                    setSelectedFacture(newValue);

                    setFormInput((formData) => {
                      return {
                        ...formData,
                        factures: newValue.map((facture) => {
                          return {
                            d_facture_entete_id: facture.id
                          };
                        })
                      };
                    });
                  }}
                  options={factureData || []}
                  getOptionLabel={(option) => option.reference}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      label="Factures"
                      error={!!formErrors?.data?.listFacture}
                      helperText={renderArrayMultiline(formErrors?.data?.listFacture)}
                    />
                  )}
                />
              </Grid>
              <Grid item sx={{ display: 'flex', justifyContent: 'flex-end' }} xs={12}>
                <LoadingButton
                  loadingPosition="end"
                  endIcon={<SendIcon />}
                  loading={createReglementMutation.isLoading}
                  variant="contained"
                  type="submit"
                >
                  Ajouter
                </LoadingButton>
              </Grid>
            </Grid>
          </form>
        </>
      </LocalizationProvider>
    </MainCard>
  );
};
export default CreateReglement;
