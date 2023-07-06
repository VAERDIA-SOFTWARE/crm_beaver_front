import EditIcon from '@mui/icons-material/Edit';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import { Box, Grid, IconButton, Stack, Tab, Tabs, Typography } from '@mui/material';

// project imports
import { useNavigate, useParams } from 'react-router-dom';

import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import UserDataCard from './userDataCard';

import { useGetUser } from 'services/users.service';
import AccessDataCard from './AccessDataCard';
import AuthToggleCard from './AuthToggleCard';

const UserDetailsPage = () => {
  const { userId } = useParams();

  const getUserQuery = useGetUser(userId);
  const userData = getUserQuery.data;
  const [toggleAuth, setToggleAuth] = useState(false);
  const navigate = useNavigate();

  const [value, setValue] = useState(0);
  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };
  useEffect(() => {
    setToggleAuth(userData?.authentication);
  }, [userData]);

  return (
    <MainCard
      title={`User ${userData?.reference ? '- ' + userData?.reference : ''}`}
      circle={userData?.color}
      backButton
      goBackLink="/users/list"
      secondary={
        <IconButton
          color="secondary"
          size="large"
          onClick={(e) => {
            // handleOpenEditDialog(e);
            navigate(`/users/${userId}/update`);
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
          <Tab to="#" label="User" {...a11yProps(0)} />
          <Tab to="#" label="Accès" {...a11yProps(0)} />
        </Tabs>

        <TabPanel value={value} index={0}>
          <>
            <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
              <Grid item xs={12}>
                <UserDataCard userData={userData} title="Informations du contact" />
              </Grid>

              {/* <Grid item md={4}>
                <HistoriqueCard
                  isLoading={false}
                  title="Qualifications"
                  data={userData?.operations}
                  style={{
                    height: 400
                  }}
                />
              </Grid>
              <Grid item md={4}>
                <HistoriqueCard
                  isLoading={false}
                  title="Zones de travail"
                  data={userData?.zone_villes}
                  style={{
                    height: 400
                  }}
                />
              </Grid> */}
            </Grid>
          </>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <>
            <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
              <Grid item xs={12}>
                <AuthToggleCard toggleAuth={toggleAuth} setToggleAuth={setToggleAuth} userData={userData} userId={userData?.id} />
              </Grid>

              {/* <Grid item md={4}>
                <HistoriqueCard
                  isLoading={false}
                  title="Qualifications"
                  data={userData?.operations}
                  style={{
                    height: 400
                  }}
                />
              </Grid>
              <Grid item md={4}>
                <HistoriqueCard
                  isLoading={false}
                  title="Zones de travail"
                  data={userData?.zone_villes}
                  style={{
                    height: 400
                  }}
                />
              </Grid> */}
            </Grid>
          </>
        </TabPanel>
        <div
          style={{
            display: 'flex',
            justifyContent: 'end',
            marginTop: 40
          }}
        >
          <Typography variant="h5">Créé le {userData?.created_at}</Typography>
        </div>
      </div>
    </MainCard>
  );
};

UserDetailsPage.propTypes = {
  open: PropTypes.bool,
  handleCloseDialog: PropTypes.func
};

export default UserDetailsPage;

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
