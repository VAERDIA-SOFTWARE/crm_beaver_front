import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { Box, Grid, Tab, Tabs, Typography } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ContentPasteOffRoundedIcon from '@mui/icons-material/ContentPasteOffRounded';
import RemoveDoneRoundedIcon from '@mui/icons-material/RemoveDoneRounded';
import DoneAllRoundedIcon from '@mui/icons-material/DoneAllRounded';
import AssignmentTurnedInRoundedIcon from '@mui/icons-material/AssignmentTurnedInRounded';

// project imports
import { LoadingButton } from '@mui/lab';
import { useParams } from 'react-router-dom';
import { useGetChantier, useGetChantierHistorique } from 'services/chantier.service';
import { useEchantionner, useGenerateInspections, useSwitchInspectionProposition } from 'services/lot-chantiers.service';
import { gridSpacing } from 'store/constant';
import HoverDataCard from 'ui-component/cards/HoverDataCard';
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';
import ClientDataCard from '../clients/list/ClientDataCard';
import LotChantierDataCard from '../lot-chantier/LotChantierDataCard';
import ChantierDataCard from './ChantierDataCard';
import HistoriqueCard from './HistoriqueCard';
import useAuth from 'hooks/useAuth';
import { useTheme } from '@mui/styles';
import { useConfirm } from 'material-ui-confirm';
import { useGetInspection, useValiderPropositions } from 'services/inspections.service';
import InspectionDataCard from '../inspections/InspectionDataCard';

const ChantierDetailsPage = ({ open, handleCloseDialog, getZonesVillesQuery }) => {
  const { chantierId } = useParams();
  const getChantierQuery = useGetChantier(chantierId);
  const chantierData = getChantierQuery.data;
  const getChantierHistoriqueQuery = useGetChantierHistorique({ chantierId });
  const [formInput, setFormInput] = useState({
    reference: '',
    date_commande: '',
    donneur_ordre: '',
    num_serie: '',
    nom_benificiaire: '',
    prenom_benificiary: '',
    presonne_morale: '',
    adresse: '',
    code_postal: '',
    ville: '',
    telephone_1: '',
    telephone_2: '',
    operation_controller: '',
    date_devis: '',
    date_facture: '',
    materiaux: '',
    commentaires: '',
    etat: '',
    a_inspecter: '',
    date_etat: '',
    location: '',
    location_prevu: '',
    p_operation_id: '',
    d_lot_chantier_id: '',
    lot_chantier: ''
  });

  useEffect(() => {
    if (getChantierQuery.isSuccess) {
      setFormInput((f) => {
        return { ...f, ...chantierData };
      });
    }
  }, [getChantierQuery.isSuccess]);

  const [activeTab, setActiveTab] = useState(0);
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const [activeRapportTab, setActiveRapportTab] = useState(0);
  const handleRapportTabChange = (event, newValue) => {
    setActiveRapportTab(newValue);
  };
  const generateInspectionsMutation = useGenerateInspections();
  const SwitchInspectionPropositionMutation = useSwitchInspectionProposition();
  const echantionnerMutation = useEchantionner();
  const theme = useTheme();
  const confirm = useConfirm();
  const validerPropositionsMutation = useValiderPropositions();

  const getInspectionQuery = useGetInspection(
    chantierData?.inspection_proposition?.id,
    chantierData?.etat > 1,
    getChantierQuery.isFetching
  );
  // const inspectionsEtatData = getInspectionQuery.data?.etats;
  // const inspectionsStatutData = getInspectionQuery.data?.status;
  const title = 'Inspection Data Card';

  const showEtat = true;

  const data = {
    etat: 2,
    statu: 1,
    etat_inspection: {
      nom: 'In Progress',
      couleur: '#ff9800'
    },
    status_inspection: {
      nom: 'Pending',
      couleur: '#f44336'
    },
    debut: '2023-06-16',
    date: '2023-06-15',
    fin: '2023-06-18',
    fin_prevu: '2023-06-20'
  };

  const inspectionsStatutData = [
    {
      statu: 1,
      nom: 'Pending',
      couleur: '#f44336'
    },
    {
      statu: 2,
      nom: 'Completed',
      couleur: '#4caf50'
    }
  ];

  const inspectionsEtatData = [
    {
      etat: 1,
      nom: 'New',
      couleur: '#2196f3'
    },
    {
      etat: 2,
      nom: 'In Progress',
      couleur: '#ff9800'
    },
    {
      etat: 3,
      nom: 'Completed',
      couleur: '#4caf50'
    }
  ];

  return (
    <MainCard
      title={`Contrat ${chantierData?.reference ? '- ' + chantierData?.reference : ''}`}
      backButton
      goBackLink="/chantiers/list"
      secondary={
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5
          }}
        >
          {chantierData?.etat === 0 &&
            (chantierData?.a_inspecter === 1 ? (
              <LoadingButton
                startIcon={<SaveIcon />}
                loadingPosition="start"
                loading={generateInspectionsMutation.isLoading}
                onClick={() => {
                  generateInspectionsMutation.mutate({
                    LotChantierId: chantierData?.lot_chantier?.id,
                    values: { chantiers: [chantierData?.id] }
                  });
                }}
                variant="contained"
                type="submit"
              >
                Générer Intervention
              </LoadingButton>
            ) : (
              <LoadingButton
                startIcon={<DoneAllRoundedIcon />}
                loadingPosition="start"
                loading={echantionnerMutation.isLoading}
                onClick={() => {
                  echantionnerMutation.mutate({
                    LotChantierId: chantierData?.lot_chantier?.id,
                    values: { chantiers: [chantierData?.id] }
                  });
                }}
                variant="contained"
                type="submit"
              >
                Echantionner
              </LoadingButton>
            ))}

          {chantierData?.etat === 0 && chantierData?.a_inspecter === 1 && (
            <LoadingButton
              startIcon={<RemoveDoneRoundedIcon />}
              loadingPosition="start"
              loading={SwitchInspectionPropositionMutation.isLoading}
              onClick={() => {
                confirm({
                  description: `Êtes-vous sûr de vouloir déséchantillonnerannuler interventions ${chantierData?.reference}.`,
                  title: `Veuillez confirmer le déséchantillonnage`
                })
                  .then(() =>
                    SwitchInspectionPropositionMutation.mutate({
                      chantierId: chantierId
                    })
                  )
                  .catch(() => console.log('Deactivation cancelled.'));
              }}
              variant="contained"
              type="submit"
              sx={{ background: theme.palette.error.main, '&:hover': { background: theme.palette.error.dark } }}
            >
              Déséchantillonner
            </LoadingButton>
          )}

          {chantierData?.etat === 1 && (
            <LoadingButton
              startIcon={<AssignmentTurnedInRoundedIcon />}
              loadingPosition="start"
              loading={validerPropositionsMutation.isLoading}
              onClick={() => {
                confirm({
                  description: `Êtes-vous sûr de vouloir valider la proposition du ${chantierData?.reference}.`,
                  title: `Veuillez confirmer la validation`
                })
                  .then(() =>
                    validerPropositionsMutation.mutate({
                      values: { propositions: [chantierData?.inspection_proposition?.id] }
                    })
                  )
                  .catch(() => console.log('Deactivation cancelled.'));
              }}
              variant="contained"
              type="submit"
              // sx={{ background: theme.palette.error.main, '&:hover': { background: theme.palette.error.dark } }}
            >
              Valider proposition
            </LoadingButton>
          )}

          {chantierData?.etat === 1 && (
            <LoadingButton
              startIcon={<ContentPasteOffRoundedIcon />}
              loadingPosition="start"
              loading={SwitchInspectionPropositionMutation.isLoading}
              onClick={() => {
                confirm({
                  description: `Êtes-vous sûr de vouloir annuler proposition du ${chantierData?.reference}.`,
                  title: `Veuillez confirmer l'annulation`
                })
                  .then(() =>
                    SwitchInspectionPropositionMutation.mutate({
                      chantierId: chantierId
                    })
                  )
                  .catch(() => console.log('Deactivation cancelled.'));
              }}
              variant="contained"
              type="submit"
              sx={{ background: theme.palette.error.main, '&:hover': { background: theme.palette.error.dark } }}
            >
              Annuler proposition
            </LoadingButton>
          )}

          {chantierData?.etat === 2 && (
            <LoadingButton
              startIcon={<ContentPasteOffRoundedIcon />}
              loadingPosition="start"
              loading={SwitchInspectionPropositionMutation.isLoading}
              onClick={() => {
                confirm({
                  description: `Êtes-vous sûr de vouloir annuler interventions du ${chantierData?.reference}.`,
                  title: `Veuillez confirmer l'annulation`
                })
                  .then(() =>
                    SwitchInspectionPropositionMutation.mutate({
                      chantierId: chantierId
                    })
                  )
                  .catch(() => console.log('Deactivation cancelled.'));
              }}
              variant="contained"
              type="submit"
              sx={{ background: theme.palette.error.main, '&:hover': { background: theme.palette.error.dark } }}
            >
              Annuler Intervention
            </LoadingButton>
          )}
        </div>
      }
    >
      {/* <div
        style={{
          marginBottom: 25
        }}
      >
        <Dashboard />
      </div> */}

      <Tabs
        value={activeTab}
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
        <Tab to="#" label="Contrat" />
        <Tab to="#" label="Rapport" />
      </Tabs>

      <TabPanel value={activeTab} index={0}>
        <Grid container spacing={gridSpacing} rowSpacing={5}>
          {false && (
            <Grid
              container
              item
              md={12}
              spacing={gridSpacing}
              style={{
                width: '100%'
              }}
            >
              <Grid item md={4}>
                <HoverDataCard
                  title="Nombre des Interventions validées"
                  iconPrimary={ArrowUpwardIcon}
                  primary={32}
                  secondary="6% depuis les 3 derniers mois"
                  // color={theme.palette.success.dark}
                />
              </Grid>
              <Grid item md={4}>
                <HoverDataCard
                  title="Nombre des Interventions rapportées"
                  iconPrimary={ArrowUpwardIcon}
                  primary={28}
                  secondary="6% depuis les 3 derniers mois"
                  // color={theme.palette.success.dark}
                />
              </Grid>
              <Grid item md={4}>
                <HoverDataCard
                  title="Nombre des Contrats"
                  iconPrimary={ArrowUpwardIcon}
                  primary={45}
                  secondary="6% depuis les 3 derniers mois"
                  // color={theme.palette.success.dark}
                />
              </Grid>
            </Grid>
          )}

          {chantierData?.inspection_proposition?.id && (
            <Grid item xs={12}>
              {/* <EtatStaus inspectionsStatutData={inspectionsStatutData} inspectionsEtatData={inspectionsEtatData} /> */}
              {/* <InspectionDataCard
              showEtat={chantierData?.etat > 1}
              title={chantierData?.etat === 1 ? 'Proposition' : '' || chantierData?.etat > 1 ? 'Intervention' : ''}
              data={chantierData?.inspection_proposition}
              inspectionsStatutData={inspectionsStatutData}
              inspectionsEtatData={inspectionsEtatData}
            /> */}
              <InspectionDataCard
                title={title}
                showEtat={showEtat}
                data={data}
                inspectionsStatutData={inspectionsStatutData}
                inspectionsEtatData={inspectionsEtatData}
              />
            </Grid>
          )}
          <Grid item xs={12}>
            <ChantierDataCard data={formInput} />
          </Grid>
          <Grid item xs={12}>
            <LotChantierDataCard data={formInput?.lot_chantier} />
          </Grid>
          {/* <Grid item md={4}>
            <SatisfactionChartCard chartData={chartData.SatisfactionChartCardData} title="Inspections" />
          </Grid> */}
          <Grid item xs={12}>
            <ClientDataCard clientData={chantierData?.lot_chantier?.contrat?.user} />
          </Grid>
        </Grid>
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={9}>
            <SubCard>
              <iframe
                title="pdf"
                src={`${process.env.REACT_APP_API_URL}chantiers/${chantierData?.id}/rapport`}
                width="100%"
                height="900px"
                style={{
                  borderRadius: 10,
                  borderColor: '#90caf975',
                  boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
                  border: '0px solid'
                }}
              ></iframe>
            </SubCard>
          </Grid>

          <Grid item xs={12} md={3}>
            <HistoriqueCard title="Historique" data={getChantierHistoriqueQuery?.data} />
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
        <Typography variant="h5">Créé le {chantierData?.created_at}</Typography>
      </div>
    </MainCard>
  );
};

ChantierDetailsPage.propTypes = {
  open: PropTypes.bool,
  handleCloseDialog: PropTypes.func
};

export default ChantierDetailsPage;

function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}
