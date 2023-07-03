import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import { Box, Grid, Tab, Tabs, Typography } from '@mui/material';

// project imports
import { useParams } from 'react-router-dom';
import { useGetLotChantier } from 'services/lot-chantiers.service';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import ChantiersList from './';
import useAuth from 'hooks/useAuth';
import LeadsList from './index2';
import ClientsList from '../preferences/current-pieces';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}

const UpdateLotChantierPage = () => {
  const { lotChantierId } = useParams();

  const getLotChantierQuery = useGetLotChantier(lotChantierId);
  const lotChantierData = getLotChantierQuery.data;
  const { logout, user } = useAuth();
  const [tabValue, setTabValue] = useState(0);

  const [chantiersTab, setChantierTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleChantierTabChange = (event, newValue) => {
    setChantierTab(newValue);
  };

  return (
    <MainCard title={`Liste des Clients `}>
      {user?.role.includes('admin') ? (
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
            aria-label="simple tabs example"
            variant="scrollable"
          >
            <Tab to="#" label="Leads" />
            <Tab to="#" label="Clients" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            {/* <Tabs
            value={chantiersTab}
            indicatorColor="primary"
            onChange={handleChantierTabChange}
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
            <Tab to="#" label="Nouveaux Chantiers" />
            <Tab to="#" label="Chantiers a inspecter" />
            <Tab to="#" label="Contrats inspectés" />
          </Tabs> */}
            <TabPanel value={chantiersTab} index={0}>
              <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
                <Grid item xs={12}>
                  <ChantiersList
                    title=""
                    a_inspecterFilter={1}
                    disableFilters
                    disableCreate
                    disableCheckboxSelection={true}
                    //   genererInspections
                  />
                </Grid>
              </Grid>
            </TabPanel>
            {/* <TabPanel value={chantiersTab} index={1}>
            <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
              <Grid item xs={12}>
                <ChantiersList
                  title=" "
                  etatFilter={1}
                  a_inspecterFilter={1}
                  disableFilters
                  disableCreate
                  disableCheckboxSelection={true}
                />
              </Grid>
            </Grid>
          </TabPanel>
          <TabPanel value={chantiersTab} index={2}>
            <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
              <Grid item xs={12}>
                <ChantiersList title="" etatFilter={3} a_inspecterFilter={1} disableFilters disableCreate disableCheckboxSelection={true} />
              </Grid>
            </Grid>
          </TabPanel> */}
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
              <Grid item xs={12}>
                <LeadsList
                  title=""
                  etatFilter={0}
                  a_inspecterFilter={0}
                  disableFilters
                  disableCreate
                  disableCheckboxSelection={true}
                  // echantionnerButton
                />
              </Grid>
            </Grid>
          </TabPanel>
        </div>
      ) : (
        <div>
          <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
            <Grid item xs={12}>
              <ClientsList
                title=""
                a_inspecterFilter={1}
                disableFilters
                disableCreate
                disableCheckboxSelection={true}
                //   genererInspections
              />
            </Grid>
          </Grid>
        </div>
      )}
    </MainCard>
  );
};

UpdateLotChantierPage.propTypes = {
  open: PropTypes.bool,
  handleCloseDialog: PropTypes.func
};

export default UpdateLotChantierPage;
