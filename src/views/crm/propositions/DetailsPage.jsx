import PropTypes from 'prop-types';

// material-ui
import EditIcon from '@mui/icons-material/Edit';
import { Box, Grid, IconButton, Typography } from '@mui/material';

// project imports
import { useNavigate, useParams } from 'react-router-dom';
import { useGetChantier } from 'services/chantier.service';
import { useGetProposition } from 'services/inspections.service';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import TechnicienDataCard from '../techniciens/list/TechnicienDataCard';
import InspectionDataCard from '../interventions/InspectionDataCard';
import PropostionDataCard from './PropostionDataCard';
import ClientDataCard from '../clients/list/ClientDataCard';

const PropositionDetailsPage = () => {
  const { propositionId } = useParams();

  const getInspectionQuery = useGetProposition(propositionId);
  const inspectionData = getInspectionQuery.data;

  const getChantierQuery = useGetChantier(inspectionData?.d_chantier_id);

  const navigate = useNavigate();

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
          <PropostionDataCard showEtat={false} data={inspectionData} inspectionsEtatData={inspectionData} />
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
        <Grid item xs={12}>
          <ClientDataCard clientData={inspectionData?.client} title={'Informations du client'} />
        </Grid>

        <Grid item xs={12}>
          <TechnicienDataCard data={inspectionData?.collaborator} />
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
