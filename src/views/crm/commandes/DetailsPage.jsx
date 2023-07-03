import PropTypes from 'prop-types';
import { useState } from 'react';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import RemoveCircleOutlineRoundedIcon from '@mui/icons-material/RemoveCircleOutlineRounded';

// material-ui
import { Box, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Tab, Tabs, Typography } from '@mui/material';

// project imports
import { useParams } from 'react-router-dom';
import { useGetLotChantier, useValidateLot } from 'services/lot-chantiers.service';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import SatisfactionChartCard from 'views/widget/Chart/SatisfactionChartCard';
import ChantiersList from '../chantiers';
import ClientDataCard from '../clients/list/ClientDataCard';
import ContractDataCard from '../contrats/ContractDataCard';
import chartData from './chart-data/ChantierChartData';
import LotChantierDataCard from './LotChantierDataCard';
import useAuth from 'hooks/useAuth';
import { LoadingButton } from '@mui/lab';
import ValidateCard from './ValidateCard';
import { useConfirm } from 'material-ui-confirm';
import renderArrayMultiline from 'utilities/utilities';
import ContentPasteRoundedIcon from '@mui/icons-material/ContentPasteRounded';
import ContentPasteOffRoundedIcon from '@mui/icons-material/ContentPasteOffRounded';
import { useGetInspectionsStatsByCommande } from 'services/inspections.service';
import FacturesList from '../factures/list';
function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}

const DetailsLotChantierPage = () => {
  const { commandeId: lotChantierId } = useParams();
  const confirm = useConfirm();
  const [formInput, setFormInput] = useState({
    comment: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const getLotChantierQuery = useGetLotChantier(lotChantierId);
  const validateLotMutation = useValidateLot(lotChantierId);
  const lotChantierData = getLotChantierQuery.data;
  const { logout, user } = useAuth();
  const inspectionsStatsByCommandeQuery = useGetInspectionsStatsByCommande(lotChantierId);
  const inspectionsStatsByCommandeData = inspectionsStatsByCommandeQuery?.data;
  const [tabValue, setTabValue] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [validated, setValidated] = useState(false);

  const [chantiersTab, setChantierTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleChantierTabChange = (event, newValue) => {
    setChantierTab(newValue);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});

    try {
      await validateLotMutation.mutateAsync({ ...formInput, validated: 0 });
      setConfirmOpen(false);
    } catch (error) {
      const errorsObject = error?.response?.data;
      setFormErrors(errorsObject);
    }
  };
  const circle = (item, title) => {
    return (
      <div>
        <div
          style={{
            width: 'auto',
            height: 'auto',
            padding: '0.2rem',
            paddingLeft: '0.4rem',
            paddingRight: '0.4rem',
            color: 'white',
            backgroundColor: item,
            borderRadius: 9999
          }}
        >
          {title}
        </div>
      </div>
    );
  };
  return (
    <MainCard
      title={`Commande ${lotChantierData?.reference ? '- ' + lotChantierData?.reference : ''}`}
      backButton
      goBackLink={`/commandes/list`}
      secondary={
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5
          }}
        >
          {user?.role.includes('admin') && lotChantierData?.validated === -1 && (
            <>
              <LoadingButton
                loadingPosition="start"
                startIcon={<CheckRoundedIcon />}
                loading={validateLotMutation.isLoading}
                onClick={async () => {
                  if (!lotChantierData?.generate_inspections) {
                    try {
                      await confirm({
                        title: `Vous n'avez pas choisi de progrée Interventions!`,
                        description: `Êtes-vous sûr de vouloir continuer ?`
                      });

                      await validateLotMutation.mutateAsync({ validated: 1 });
                    } catch (error) {
                      console.log('Utilisateur supprimé avec succès.');
                    } finally {
                      return null;
                    }
                  }

                  validateLotMutation.mutateAsync({ validated: 1 });
                }}
                variant="contained"
                type="submit"
              >
                Valider Commande
              </LoadingButton>
              <LoadingButton
                sx={{
                  backgroundColor: 'rgb(239, 68, 68)'
                }}
                loadingPosition="start"
                startIcon={<RemoveCircleOutlineRoundedIcon />}
                loading={validateLotMutation.isLoading}
                onClick={() => {
                  setConfirmOpen(true);
                }}
                variant="contained"
                type="submit"
              >
                Invalider Commande
              </LoadingButton>
              <ConfirmDialog
                setValidated={setValidated}
                setFormInput={setFormInput}
                formInput={formInput}
                formErrors={formErrors}
                handleSubmit={handleSubmit}
                open={confirmOpen}
                setOpen={setConfirmOpen}
              ></ConfirmDialog>
            </>
          )}
          {!user?.role.includes('admin') && lotChantierData?.validated === -1 && (
            <Typography variant="body2">{circle('#1e88e5', 'Nouveau')}</Typography>
          )}
          {lotChantierData?.validated !== -1 && (
            <div style={{ marginRight: '2rem' }}>
              {lotChantierData?.validated === 1 && <ContentPasteRoundedIcon sx={{ color: '#16a34a' }} />}
              {lotChantierData?.validated === 0 && <ContentPasteOffRoundedIcon sx={{ color: '#dc2626' }} />}
            </div>
          )}
        </div>
      }
    >
      <div>
        <Tabs
          value={tabValue}
          indicatorColor="primary"
          onChange={handleTabChange}
          sx={{
            mb: 3,
            minHeight: 'auto',
            '& button': {
              minWidth: 100
            },
            '& a': {
              minHeight: 'auto',
              minWidth: 10,
              py: 1.5,
              px: 1,
              mr: 2.25,
              color: 'grey.600'
            },
            '& a.Mui-selected': {
              color: 'primary.main'
            }
          }}
          variant="scrollable"
        >
          <Tab to="#" label="Informations générales" />
          <Tab to="#" label="Factures" />
        </Tabs>
        <TabPanel value={tabValue} index={0}>
          <div>
            <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
              {/* {user?.role.includes('admin') && (
                <Grid item xs={12}>
                  <ValidateCard clientData={lotChantierData} />
                </Grid>
              )} */}
              {/* {false && !lotChantierData?.generate_inspections && (
                <Grid item xs={12}>
                  <Typography variant="h3">Vous n'avez pas choisi de pourcentage d'échantillonnage!</Typography>
                </Grid>
              )} */}
              <Grid item xs={12}>
                <ClientDataCard clientData={lotChantierData?.contrat?.user} />
              </Grid>
              <Grid item xs={12} md={6}>
                <LotChantierDataCard
                  data={lotChantierData}
                  user={user}
                  sx={{
                    minHeight: '100%'
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                {inspectionsStatsByCommandeData && (
                  <SatisfactionChartCard
                    // chartData={chartData}
                    chartData={{
                      height: 300,
                      type: 'pie',
                      options: {
                        // colors: inspectionsStatsByCommandeData?.colors,
                        chart: {
                          id: 'chantier-chart'
                        },
                        // labels: ['Intervention Crée', 'Intervention terminée', 'Intervention Validée', 'Rapport Generé'],
                        labels: inspectionsStatsByCommandeData?.labels,
                        legend: {
                          show: true,
                          position: 'bottom',
                          fontFamily: 'inherit',
                          labels: {
                            colors: 'inherit'
                          }
                        },
                        dataLabels: {
                          enabled: true,
                          dropShadow: {
                            enabled: false
                          }
                        },
                        theme: {
                          monochrome: {
                            enabled: true
                          }
                        }
                      },
                      // series: inspectionsStatsByCommandeData?.series
                      series: [66, 50, 40, 30]
                    }}
                    title="Interventions"
                  />
                )}
              </Grid>
              <Grid item xs={12}>
                <ContractDataCard contratData={lotChantierData?.contrat} />
              </Grid>

              {/* <Grid item md={4}>
                <SatisfactionChartCard chartData={chartData} title="Inspections" />
              </Grid> */}
            </Grid>
          </div>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
            <Grid item xs={12}>
              <FacturesList title=" " commandeId={lotChantierId} />
            </Grid>
          </Grid>
        </TabPanel>

        <div
          style={{
            display: 'flex',
            justifyContent: 'end',
            marginTop: 40
          }}
        >
          <Typography variant="h5">Créé le {lotChantierData?.created_at}</Typography>
        </div>
      </div>
    </MainCard>
  );
};
const ConfirmDialog = (props) => {
  const { open, setOpen, formInput, formErrors, setFormInput, handleSubmit } = props;
  const handleChange = (e) => {
    setFormInput({
      ...formInput,
      [e.target.name]: e.target.value
    });
  };
  return (
    <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby="confirm-dialog">
      <div style={{ maxWidth: '37rem', width: '37rem' }}>
        <DialogTitle id="confirm-dialog">Confirmeé</DialogTitle>
        <DialogContent>
          <TextField
            multiline
            rows={4}
            variant="standard"
            fullWidth
            label="commentaire"
            value={formInput?.comment || ''}
            name="comment"
            onChange={handleChange}
            error={!!formErrors?.comment}
            helperText={renderArrayMultiline(formErrors?.comment)}
          />
        </DialogContent>
        <DialogActions>
          <LoadingButton variant="contained" onClick={() => setOpen(false)}>
            Non
          </LoadingButton>
          <LoadingButton variant="contained" onClick={handleSubmit}>
            Oui
          </LoadingButton>
        </DialogActions>
      </div>
    </Dialog>
  );
};
DetailsLotChantierPage.propTypes = {
  open: PropTypes.bool,
  handleCloseDialog: PropTypes.func
};

export default DetailsLotChantierPage;
