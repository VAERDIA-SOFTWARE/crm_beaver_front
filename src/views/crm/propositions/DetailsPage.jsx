import PropTypes from 'prop-types';

// material-ui
import AssignmentReturnedIcon from '@mui/icons-material/AssignmentReturned';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import EditIcon from '@mui/icons-material/Edit';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Box, Button, Grid, IconButton, SwipeableDrawer, Tab, Tabs, Tooltip, Typography } from '@mui/material';

// project imports
import { LoadingButton } from '@mui/lab';
import { useState, Fragment, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetChantier, useGetChantierHistorique } from 'services/chantier.service';
import {
  useGenererInspectionsRapport,
  useGetInspection,
  useGetInspectionFormulaire,
  useGetProposition,
  useValidateInspections
} from 'services/inspections.service';
import { gridSpacing } from 'store/constant';
import EtatStaus from 'ui-component/cards/EtatStatus';
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';
import ChantierDataCard from '../chantiers/ChantierDataCard';
import TechnicienDataCard from '../techniciens/list/TechnicienDataCard';
import InspectionDataCard from '../inspections/InspectionDataCard';
import InfoIcon from '@mui/icons-material/Info';
import useAuth from 'hooks/useAuth';

const PropositionDetailsPage = () => {
  const { propositionId } = useParams();

  const getInspectionQuery = useGetProposition(propositionId);
  const inspectionData = getInspectionQuery.data;

  const getChantierHistoriqueQuery = useGetChantierHistorique({ chantierId: inspectionData?.d_chantier_id });

  const getChantierQuery = useGetChantier(inspectionData?.d_chantier_id);
  const chantierData = getChantierQuery.data;

  const inspectionsEtatData = getInspectionQuery.data?.etats;
  const inspectionsStatutData = getInspectionQuery.data?.status;
  const { logout, user } = useAuth();

  // const [fetchedRapport, setFetchedRapport] = useState(null);

  // useEffect(() => {
  //   async function fetchRapport(params) {
  //     const res = await axiosClient.get(`${process.env.REACT_APP_API_URL}rapports/${inspectionData?.id}/download-pdf`);
  //     return res.data;
  //   }
  //   // Fetch the content using the method of your choice
  //   const fetchedContent = fetchRapport().then((e) => setFetchedRapport(fetchedContent));
  // }, [inspectionData?.id]);

  const navigate = useNavigate();
  const generateInspectionsRapportMutation = useGenererInspectionsRapport();
  const validateInspectionsMutation = useValidateInspections();
  const [togleState, setTogleState] = useState(false);

  const [activeTab, setActiveTab] = useState(0);
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const [activeRapportTab, setActiveRapportTab] = useState(0);
  const handleRapportTabChange = (event, newValue) => {
    setActiveRapportTab(newValue);
  };
  const toggleDrawer = (open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setTogleState(open);
  };

  return (
    <MainCard
      title={`Proposition ${inspectionData?.reference ? '- ' + inspectionData?.reference : ''}`}
      backButton
      goBackLink="/propositions/list"
      secondary={
        <IconButton
          color="secondary"
          size="large"
          onClick={(e) => {
            navigate(`/propositions/${propositionId}/update`);
          }}
        >
          <EditIcon sx={{ fontSize: '1.3rem' }} />
        </IconButton>
      }
    >
      <Grid container spacing={gridSpacing} rowSpacing={5}>
        <Grid item xs={12}>
          {/* <EtatStaus inspectionsStatutData={inspectionsStatutData} inspectionsEtatData={inspectionsEtatData} /> */}
          <InspectionDataCard
            showEtat={false}
            data={inspectionData}
            inspectionsStatutData={inspectionsStatutData}
            inspectionsEtatData={inspectionsEtatData}
          />
        </Grid>
        {/* <Grid
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
              title="Nombre des inspections validées"
              iconPrimary={ArrowUpwardIcon}
              primary={32}
              secondary="6% depuis les 3 derniers mois"
            />
          </Grid>
          <Grid item md={4}>
            <HoverDataCard
              title="Nombre des inspections rapportées"
              iconPrimary={ArrowUpwardIcon}
              primary={28}
              secondary="6% depuis les 3 derniers mois"
            />
          </Grid>
          <Grid item md={4}>
            <HoverDataCard
              title="Nombre des Contrats"
              iconPrimary={ArrowUpwardIcon}
              primary={45}
              secondary="6% depuis les 3 derniers mois"
            />
          </Grid>
        </Grid> */}
        {getChantierQuery.isSuccess && (
          <Grid item xs={12}>
            <ChantierDataCard data={chantierData} showButton />
          </Grid>
        )}

        <Grid item xs={12}>
          <TechnicienDataCard data={inspectionData?.technicien} />
        </Grid>
        {/* <Grid item xs={12}>
          <LotChantierDataCard lotChantierData={formInput?.lot_chantier} />
        </Grid>
        <Grid item md={4}>
          <SatisfactionChartCard chartData={chartData.SatisfactionChartCardData} title="Inspections" />
        </Grid>
        */}
      </Grid>

      <div
        style={{
          display: 'flex',
          justifyContent: 'end',
          marginTop: 40
        }}
      >
        <Typography variant="h5">Créé le {inspectionData?.created_at}</Typography>
      </div>
    </MainCard>
  );
};

PropositionDetailsPage.propTypes = {
  open: PropTypes.bool,
  handleCloseDialog: PropTypes.func
};

export default PropositionDetailsPage;

function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}
