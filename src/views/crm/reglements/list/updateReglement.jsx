import { useEffect, useState } from 'react';
// material-ui
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import { Autocomplete, Divider, Grid, Skeleton, TextField, Typography } from '@mui/material';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';

// project imports
import { LoadingButton } from '@mui/lab';
import { useConfirm } from 'material-ui-confirm';
import { useNavigate, useParams } from 'react-router-dom';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import renderArrayMultiline from 'utilities/utilities';
import {
  useDeleteReglementMutation,
  useGetFactures,
  useGetReglement,
  useGetReglementsMode,
  useUpdateReglement
} from 'services/reglements.service';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import moment from 'moment';

const UpdateReglement = () => {
  const { reglementId } = useParams();

  const [formErrors, setFormErrors] = useState({});
  const [formInput, setFormInput] = useState({
    libelle: '',
    p_mode_de_reglement_id: '',
    date_echeance: '',
    date: '',
    reference_cheque: '',
    reference_traite: '',
    montant: '',
    listFacture: ''
  });

  const [selectedFacture, setSelectedFacture] = useState(null);
  const [selectedreglementMode, setSelectedReglementMode] = useState(null);
  const useGetFactureQuery = useGetFactures();
  const factureData = useGetFactureQuery?.data?.factures?.data;
  const deleteReglementMutation = useDeleteReglementMutation(reglementId);
  const updateReglementMutation = useUpdateReglement(reglementId);
  const getReglementsQuery = useGetReglement(reglementId);
  const reglementData = getReglementsQuery.data;

  const useGetModeReglementQuery = useGetReglementsMode();
  const reglementMode = useGetModeReglementQuery?.data;

  useEffect(() => {
    if (getReglementsQuery.isSuccess) {
      setFormInput((f) => {
        return {
          ...f,
          // p_mode_de_reglement_id: reglementData?.p_mode_de_reglement_id,
          listFacture: reglementData.factures,
          ...reglementData
        };
      });
    }
  }, [reglementData, getReglementsQuery.isSuccess]);

  const navigate = useNavigate();

  const confirm = useConfirm();

  const handleChange = (e) => {
    setFormInput({
      ...formInput,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});
    const formattedFormInput = {
      ...formInput,
      date: moment(formInput.date).format('YYYY-MM-DD'),
      date_echeance: moment(formInput.date_echeance).format('YYYY-MM-DD hh:mm')
    };
    try {
      await updateReglementMutation.mutateAsync({
        ...formattedFormInput
      });
    } catch (error) {
      const errorsObject = error?.response?.data;
      setFormErrors(errorsObject);
    }
  };

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
                <TextField
                  variant="standard"
                  fullWidth
                  label="reference_cheque*"
                  value={formInput?.reference_cheque || ''}
                  name="reference_cheque"
                  onChange={handleChange}
                  error={!!formErrors?.data?.reference_cheque}
                  helperText={renderArrayMultiline(formErrors?.data?.reference_cheque)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  variant="standard"
                  fullWidth
                  label="reference_traite*"
                  value={formInput?.reference_traite || ''}
                  name="reference_traite"
                  onChange={handleChange}
                  error={!!formErrors?.data?.reference_traite}
                  helperText={renderArrayMultiline(formErrors?.data?.reference_traite)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  variant="standard"
                  fullWidth
                  label="montant*"
                  value={formInput?.montant || ''}
                  name="montant"
                  onChange={handleChange}
                  error={!!formErrors?.data?.montant}
                  helperText={renderArrayMultiline(formErrors?.data?.montant)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DesktopDatePicker
                  label="Date d'echaillance"
                  inputFormat="dd/MM/yyyy"
                  value={formInput?.date_echeance}
                  //   value={moment(formInput?.date_echeance).format('yyyy- mm-mm')}
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
              <Grid item xs={12} md={6}>
                <DesktopDatePicker
                  label="Date"
                  inputFormat="dd/MM/yyyy"
                  value={formInput?.date}
                  //   value={moment(formInput?.date_echeance).format('yyyy- mm-mm')}
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
                  defaultValue={useGetModeReglementQuery?.data?.find((e) => reglementData?.p_mode_de_reglement_id === e?.id)}
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
              <Grid item xs={12} md={6}>
                <Autocomplete
                  multiple
                  onChange={(event, newValue) => {
                    setSelectedFacture(newValue); // Update the selected factures array

                    setFormInput((formData) => {
                      return { ...formData, listFacture: newValue.map((facture) => facture.id) };
                    });
                  }}
                  // onChange={(event, newValue) => {
                  //   setSelectedFacture(newValue);

                  //   setFormInput((formData) => {
                  //     return { ...formData, listFacture: newValue?.id };
                  //   });
                  // }}
                  options={factureData || []}
                  // defaultValue={useGetModeReglementQuery?.data?.find((e) => reglementData?.p_mode_de_reglement_id === e?.id)}

                  getOptionLabel={(option) => option.reference}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      label="Factures*"
                      error={!!formErrors?.data?.listFacture}
                      helperText={renderArrayMultiline(formErrors?.data?.listFacture)}
                    />
                  )}
                />
              </Grid>
              <Grid item sx={{ display: 'flex', justifyContent: 'space-between' }} xs={12}>
                <LoadingButton
                  disabled={getReglementsQuery.isLoading}
                  loadingPosition="start"
                  startIcon={<DeleteIcon />}
                  loading={deleteReglementMutation.isLoading}
                  variant="outlined"
                  color="error"
                  onClick={() =>
                    confirm({
                      description: `Êtes-vous sûr de vouloir supprimer ${reglementData?.libelle}.`,
                      title: `Veuillez confirmer la suppression`
                    })
                      .then(async () => {
                        try {
                          await deleteReglementMutation.mutateAsync();
                          navigate('/reglements/list', {
                            replace: true
                          });
                        } catch (error) {}
                      })
                      .catch(() => console.log('Utilisateur supprimé avec succès.'))
                  }
                >
                  {'Supprimer'}
                </LoadingButton>

                <LoadingButton
                  loadingPosition="end"
                  endIcon={<SendIcon />}
                  loading={updateReglementMutation.isLoading}
                  variant="contained"
                  type="submit"
                >
                  Modifier
                </LoadingButton>
              </Grid>

              <Grid item sx={{ display: 'flex', justifyContent: 'flex-end' }} xs={12}></Grid>
            </Grid>
          </form>
        </>
      </LocalizationProvider>
    </MainCard>
  );
};

export default UpdateReglement;
