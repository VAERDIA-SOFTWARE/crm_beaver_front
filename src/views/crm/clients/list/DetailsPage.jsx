import EditIcon from '@mui/icons-material/Edit';
import PropTypes from 'prop-types';

// material-ui
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { Box, Divider, Grid, IconButton, Tab, Tabs, TextField, Typography } from '@mui/material';
import { useState, useEffect } from 'react';

// project imports
import { useNavigate, useParams } from 'react-router-dom';
import { useGetUser, useGetUserPermissions, useToggleUserAuth } from 'services/users.service';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import ContratsList from 'views/crm/contrats';
import LotChantierList from 'views/crm/lot-chantier';

import { useGetInspectionsStatistics } from 'services/inspections.service';
import HoverDataCard from 'ui-component/cards/HoverDataCard';
import PieChartCard from './charts/PieChartCard';
import InspectionsBarChart from './charts/InspectionsBarChart';
import ClientDataCard from './ClientDataCard';
import AccessDataCard from 'views/crm/users/list/AccessDataCard';
import AuthToggleCard from 'views/crm/users/list/AuthToggleCard';

const sxDivider = {
  borderColor: 'primary.light'
};

const ClientDetailsPage = () => {
  const { clientId } = useParams();

  const getClientQuery = useGetUser(clientId);
  const getInspectionsStatisticsQuery = useGetInspectionsStatistics({ userId: clientId, yearFilter: 2023 });
  const clientData = getClientQuery.data?.user;
  const chantierStatsData = getClientQuery.data?.chantierStatsArray;
  const contratsStatsData = getClientQuery.data?.contractStatsArray;
  const getUserPermissionsQuery = useGetUserPermissions(clientId);
  const userPermissionsData = getUserPermissionsQuery?.data;
  const [toggleAuth, setToggleAuth] = useState(false);

  const navigate = useNavigate();

  const [value, setValue] = useState(0);
  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    setToggleAuth(clientData?.auth);
  }, [clientData, getClientQuery.isSuccess]);
  return (
    <MainCard
      title={`Client ${clientData?.reference ? '- ' + clientData?.reference : ''}`}
      // title={
      //   <div
      //     style={{
      //       display: 'flex',
      //       alignItems: 'center',
      //       gap: 5
      //     }}
      //   >
      //     <Typography variant="subtitle1">Client - {clientData?.reference}</Typography>
      //     {/* <Tooltip title={`Créé à ${clientData?.created_at}`}>
      //       <IconButton>
      //         <InfoIcon fontSize="small" />
      //       </IconButton>
      //     </Tooltip> */}
      //   </div>
      // }
      backButton
      goBackLink="/clients/list"
      secondary={
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5
          }}
        >
          <IconButton
            color="secondary"
            size="large"
            onClick={(e) => {
              // handleOpenEditDialog(e);
              navigate(`/clients/${clientId}/update`);
            }}
          >
            <EditIcon sx={{ fontSize: '1.3rem' }} />
          </IconButton>
          {/* <Typography variant="subtitle1">Created at {clientData?.created_at}</Typography> */}
        </div>
      }
    >
      <div>
        <Tabs
          value={value}
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
          <Tab to="#" label="Client" {...a11yProps(0)} />
          <Tab to="#" label="Contrats" {...a11yProps(1)} />
          <Tab to="#" label="Commandes" {...a11yProps(2)} />
          <Tab to="#" label="Accès" {...a11yProps(3)} />
        </Tabs>

        <TabPanel value={value} index={0}>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
              <Divider sx={sxDivider} />
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={gridSpacing}>
                <Grid item sm={6} md={4}>
                  <HoverDataCard
                    title="Nombre des contrats"
                    // iconPrimary={ArrowUpwardIcon}
                    primary={getClientQuery.data?.contractStats?.totalContracts}
                    // secondary="6% depuis les 3 derniers mois"
                    // color={theme.palette.success.dark}
                  />
                </Grid>
                <Grid item sm={6} md={4}>
                  <HoverDataCard
                    title="Nombre des commande"
                    // iconPrimary={ArrowUpwardIcon}
                    primary={getClientQuery.data?.nombreTotalLots}
                    // secondary="6% depuis les 3 derniers mois"
                    // color={theme.palette.success.dark}
                  />
                </Grid>
                <Grid item sm={6} md={4}>
                  <HoverDataCard
                    title="Nombre des Contrats"
                    // iconPrimary={ArrowUpwardIcon}
                    primary={getClientQuery.data?.chantierStats?.totalChantiers}
                    // secondary="6% depuis les 3 derniers mois"
                    // color={theme.palette.success.dark}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <ClientDataCard clientData={clientData} />
            </Grid>
            <Grid item xs={12}>
              <Divider sx={sxDivider} />
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={gridSpacing}>
                <Grid item sm={6} md={4}>
                  <PieChartCard chartDataa={chantierStatsData} title="Chantiers" />
                </Grid>
                <Grid item sm={6} md={4}>
                  <PieChartCard chartDataa={contratsStatsData} title="Contrats" />
                </Grid>
                <Grid item sm={6} md={4}>
                  <PieChartCard chartDataa={getInspectionsStatisticsQuery.data?.inspectionsStatsPie} title="Interventions" />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={gridSpacing}>
                <Grid item sm={12} md={12}>
                  <InspectionsBarChart
                    isLoading={false}
                    title="Interventions"
                    chartDataa={getInspectionsStatisticsQuery.data?.inspectionsStatsBar}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
            <Grid item xs={12}>
              <ContratsList
                title=""
                validated={-2}
                inspectionChantierFilter={1}
                etatFilter={0}
                disableFilters
                disableCreate
                disableTopBar={true}
                disableCheckboxSelection={false}
                userId={clientId}
                goBackLink={`/clients/${clientId}/details`}
                genererInspections
              />
            </Grid>
          </Grid>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
            <Grid item xs={12}>
              <LotChantierList
                clientId={clientId}
                goBackLink={`/clients/${clientId}/details`}
                title=""
                inspectionChantierFilter={1}
                etatFilter={0}
                disableFilters
                disableCreate
                disableTopBar={true}
                disableCheckboxSelection={false}
                userId={clientId}
                genererInspections
              />
            </Grid>
          </Grid>
        </TabPanel>
        <TabPanel value={value} index={3}>
          <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
            <Grid item xs={12} sx={{ marginBottom: '2rem' }}>
              <AuthToggleCard toggleAuth={toggleAuth} setToggleAuth={setToggleAuth} userData={clientData} userId={clientId} />
            </Grid>
          </Grid>

          <Grid item xs={12}>
            {Array.isArray(userPermissionsData) && <AccessDataCard userPermissionsData={userPermissionsData} userId={clientId} />}
          </Grid>
        </TabPanel>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'end',
          marginTop: 40
        }}
      >
        <Typography variant="h5">Créé le {clientData?.created_at}</Typography>
      </div>
    </MainCard>
  );
};

ClientDetailsPage.propTypes = {
  open: PropTypes.bool,
  handleCloseDialog: PropTypes.func
};

export default ClientDetailsPage;

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}
