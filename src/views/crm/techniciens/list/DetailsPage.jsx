import EditIcon from '@mui/icons-material/Edit';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import { Box, Grid, IconButton, Tab, Tabs, Typography } from '@mui/material';

// project imports
import { useNavigate, useParams } from 'react-router-dom';
import { useGetUser, useGetUserPermissions } from 'services/users.service';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import ClientDataCard from 'views/crm/clients/list/ClientDataCard';
import AuthToggleCard from 'views/crm/users/list/AuthToggleCard';
import AccessDataCard from 'views/crm/users/list/AccessDataCard';

const TechnicienDetailsPage = () => {
  const { technicienId } = useParams();

  const getTechnicienQuery = useGetUser(technicienId);
  const technicienData = getTechnicienQuery.data?.user;

  const navigate = useNavigate();

  const [value, setValue] = useState(0);
  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };
  const [toggleAuth, setToggleAuth] = useState(false);
  const getUserPermissionsQuery = useGetUserPermissions(technicienId);
  useEffect(() => {
    setToggleAuth(technicienData?.auth);
  }, [technicienData, getTechnicienQuery.isSuccess]);

  const userPermissionsData = getUserPermissionsQuery?.data;

  return (
    <MainCard
      title={`Collaborateur ${technicienData?.reference ? '- ' + technicienData?.reference : ''}`}
      circle={technicienData?.couleur}
      backButton
      goBackLink="/techniciens/list"
      secondary={
        <IconButton
          color="secondary"
          size="large"
          onClick={(e) => {
            // handleOpenEditDialog(e);
            navigate(`/techniciens/${technicienId}/update`);
          }}
        >
          <EditIcon sx={{ fontSize: '1.3rem' }} />
        </IconButton>
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
          <Tab to="#" label="Collaborateur" {...a11yProps(0)} />
          {/* <Tab to="#" label="Chantiers" {...a11yProps(1)} /> */}
          <Tab to="#" label="Interventions" {...a11yProps(2)} />
          <Tab to="#" label="Accès" {...a11yProps(3)} />
        </Tabs>

        <TabPanel value={value} index={0}>
          <>
            <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
              <Grid item xs={12}>
                <ClientDataCard clientData={technicienData} title="Informations du contact" />
              </Grid>

              <Grid item md={4}>
                {/* <HistoriqueCard
                  isLoading={false}
                  title="Qualifications"
                  data={technicienData?.operations}
                  style={{
                    height: 400
                  }}
                /> */}
              </Grid>
              <Grid item md={4}>
                {/* <HistoriqueCard
                  isLoading={false}
                  title="Zones de travail"
                  data={technicienData?.zone_villes}
                  style={{
                    height: 400
                  }}
                /> */}
              </Grid>
            </Grid>
          </>
        </TabPanel>

        <TabPanel value={value} index={1}>
          <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
            <Grid item xs={12}>
              {/* <ChantierList
                title=""
                // inspectionChantierFilter={1}
                // etatFilter={0}
                disableFilters
                disableCreate
                disableCheckboxSelection={true}
                userId={technicienId}
                genererInspections
              /> */}
            </Grid>
          </Grid>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
            <Grid item xs={12}>
              liste des interventions
              {/* <InspectionsList
                title=""
                disableFilters
                disableCreate
                disableCheckboxSelection={true}
                userId={technicienId}
                genererInspections
              /> */}
            </Grid>
          </Grid>
        </TabPanel>
        <TabPanel value={value} index={3}>
          <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
            <Grid item xs={12} sx={{ marginBottom: '2rem' }}>
              <AuthToggleCard toggleAuth={toggleAuth} setToggleAuth={setToggleAuth} userData={technicienData} userId={technicienId} />
            </Grid>
          </Grid>

          <Grid item xs={12}>
            {Array.isArray(userPermissionsData) && <AccessDataCard userPermissionsData={userPermissionsData} userId={technicienId} />}
          </Grid>
        </TabPanel>
        <div
          style={{
            display: 'flex',
            justifyContent: 'end',
            marginTop: 40
          }}
        >
          <Typography variant="h5">Créé le {technicienData?.created_at}</Typography>
        </div>
      </div>
    </MainCard>
  );
};

TechnicienDetailsPage.propTypes = {
  open: PropTypes.bool,
  handleCloseDialog: PropTypes.func
};

export default TechnicienDetailsPage;

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
