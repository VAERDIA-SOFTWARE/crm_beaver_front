import EditIcon from '@mui/icons-material/Edit';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// material-ui
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { Box, Divider, Grid, IconButton, Tab, Tabs, TextField, Typography } from '@mui/material';

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
import UserDataCard from './userDataCard';
import AccessDataCard from './AccessDataCard';
import renderArrayMultiline from 'utilities/utilities';
import AuthToggleCard from './AuthToggleCard';

const sxDivider = {
  borderColor: 'primary.light'
};

const UsersDetailsPage = () => {
  const { userId } = useParams();
  const [formErrors, setFormErrors] = useState({});
  const [toggleAuth, setToggleAuth] = useState(false);
  const getUserQuery = useGetUser(userId);
  const getUserPermissionsQuery = useGetUserPermissions(userId);
  // const getInspectionsStatisticsQuery = useGetInspectionsStatistics({ userId: userId });
  const userData = getUserQuery?.data?.user;
  const userPermissionsData = getUserPermissionsQuery?.data;
  // const chantierStatsData = getUserQuery.data?.chantierStatsArray;
  // const contratsStatsData = getUserQuery.data?.contractStatsArray;
  const toggleUserAuthMutation = useToggleUserAuth(userId);

  const navigate = useNavigate();

  const [value, setValue] = useState(0);
  const [userRole, setUserRole] = useState(null);
  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };
  useEffect(() => {
    setUserRole(userData?.roles?.[0]?.name);
    setToggleAuth(userData?.auth);
  }, [userData, getUserQuery.isSuccess]);

  return (
    <MainCard
      title={`Utilisateur ${userData?.reference ? '- ' + userData?.reference : ''}`}
      // title={
      //   <div
      //     style={{
      //       display: 'flex',
      //       alignItems: 'center',
      //       gap: 5
      //     }}
      //   >
      //     <Typography variant="subtitle1">Client - {userData?.reference}</Typography>
      //     {/* <Tooltip title={`Créé à ${userData?.created_at}`}>
      //       <IconButton>
      //         <InfoIcon fontSize="small" />
      //       </IconButton>
      //     </Tooltip> */}
      //   </div>
      // }
      backButton
      goBackLink="/users/list"
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
              navigate(`/${userRole}s/${userId}/update`);
            }}
          >
            <EditIcon sx={{ fontSize: '1.3rem' }} />
          </IconButton>
          {/* <Typography variant="subtitle1">Created at {userData?.created_at}</Typography> */}
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
          <Tab to="#" label="Utilisateur" {...a11yProps(0)} />
          <Tab to="#" label="Accès" {...a11yProps(1)} />
          {/* <Tab to="#" label="Lot Contrat" {...a11yProps(2)} /> */}
        </Tabs>

        <TabPanel value={value} index={0}>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
              <Divider sx={sxDivider} />
            </Grid>
            {/* <Grid item xs={12}>
              <Grid container spacing={gridSpacing}>
                <Grid item sm={6} md={4}>
                  <HoverDataCard
                    title="Nombre des contrats"
                    // iconPrimary={ArrowUpwardIcon}
                    primary={getUserQuery.data?.contractStats?.totalContracts}
                    // secondary="6% depuis les 3 derniers mois"
                    // color={theme.palette.success.dark}
                  />
                </Grid>
                <Grid item sm={6} md={4}>
                  <HoverDataCard
                    title="Nombre des lots"
                    // iconPrimary={ArrowUpwardIcon}
                    primary={getUserQuery.data?.nombreTotalLots}
                    // secondary="6% depuis les 3 derniers mois"
                    // color={theme.palette.success.dark}
                  />
                </Grid>
                <Grid item sm={6} md={4}>
                  <HoverDataCard
                    title="Nombre des Contrats"
                    // iconPrimary={ArrowUpwardIcon}
                    primary={getUserQuery.data?.chantierStats?.totalChantiers}
                    // secondary="6% depuis les 3 derniers mois"
                    // color={theme.palette.success.dark}
                  />
                </Grid>
              </Grid>
            </Grid> */}
            <Grid item xs={12}>
              <UserDataCard userData={userData} />
            </Grid>
            <Grid item xs={12}>
              <Divider sx={sxDivider} />
            </Grid>
            {/* <Grid item xs={12}>
              <Grid container spacing={gridSpacing}>
                <Grid item sm={6} md={4}>
                  <PieChartCard chartDataa={chantierStatsData} title="Chantiers" />
                </Grid>
                <Grid item sm={6} md={4}>
                  <PieChartCard chartDataa={contratsStatsData} title="Contrats" />
                </Grid>
                <Grid item sm={6} md={4}>
                  <PieChartCard chartDataa={getInspectionsStatisticsQuery.data?.inspectionsStatsPie} title="Inspections" />
                </Grid>
              </Grid>
            </Grid> */}
            {/* <Grid item xs={12}>
              <Grid container spacing={gridSpacing}>
                <Grid item sm={12} md={12}>
                  <InspectionsBarChart
                    isLoading={false}
                    title="Inspections"
                    chartDataa={getInspectionsStatisticsQuery.data?.inspectionsStatsBar}
                  />
                </Grid>
              </Grid>
            </Grid> */}
          </Grid>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
            <Grid item xs={12} sx={{ marginBottom: '2rem' }}>
              <AuthToggleCard toggleAuth={toggleAuth} setToggleAuth={setToggleAuth} userData={userData} userId={userId} />
            </Grid>
            <Grid item xs={12}>
              {Array.isArray(userPermissionsData) && <AccessDataCard userPermissionsData={userPermissionsData} userId={userId} />}
            </Grid>
          </Grid>
        </TabPanel>
        {/* <TabPanel value={value} index={2}>
          <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
            <Grid item xs={12}>
              <LotChantierList
                title=""
                inspectionChantierFilter={1}
                etatFilter={0}
                disableFilters
                disableCreate
                disableCheckboxSelection={false}
                userId={userId}
                genererInspections
              />
            </Grid>
          </Grid>
        </TabPanel> */}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'end',
          marginTop: 40
        }}
      >
        <Typography variant="h5">Créé le {userData?.created_at}</Typography>
      </div>
    </MainCard>
  );
};

UsersDetailsPage.propTypes = {
  open: PropTypes.bool,
  handleCloseDialog: PropTypes.func
};

export default UsersDetailsPage;

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
