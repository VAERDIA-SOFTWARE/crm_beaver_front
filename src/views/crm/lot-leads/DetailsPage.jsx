import PropTypes from 'prop-types';

// material-ui
import { Grid, Tab, Tabs, Typography } from '@mui/material';

// project imports
import { useParams } from 'react-router-dom';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import LotLeadsDataCard from './LotLeadsDataCard';
import LeadsDataGrid from './LeadsDataGrid';
import { useGetLotLead } from 'services/lot-leads.service';
import { Box } from '@mui/system';
import { useState } from 'react';
import { useGetUsers } from 'services/users.service';

const DetailsLotLeadsPage = () => {
  const { lotLeadsId } = useParams();
  const getLotQuery = useGetLotLead(lotLeadsId);
  const lotData = getLotQuery.data;
  const [value, setValue] = useState(0);
  const [type, setType] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchFilter, setSearchFilter] = useState('');
  const handleTabChange = (event, newValue) => {
    setValue(newValue);
    if (newValue === 1) {
      setType(1);
    } else {
      setType(0);
    }
  };
  const usersQuery = useGetUsers({
    paginated: true,
    searchFilter: searchFilter,
    lot: lotLeadsId,
    pageSize: pageSize,
    page: page,
    role: 'client',
    type: type
  });
  const usersData = usersQuery?.data;
  return (
    <MainCard
      headerColor={true}
      title={`Leads ${lotData?.reference ? '- ' + lotData?.reference : ''}`}
      backButton
      goBackLink={`/lot-leads/list`}
      // secondary={}
    >
      <div>
        {getLotQuery.isSuccess && (
          <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
            <Grid item xs={12}>
              <LotLeadsDataCard title={'Information'} clientData={lotData} />
            </Grid>
          </Grid>
        )}
        {getLotQuery.isSuccess && (
          <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
            <Grid item xs={12}>
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
                <Tab to="#" label="List Leads" {...a11yProps(0)} />
                <Tab to="#" label="List Clients" {...a11yProps(1)} />
              </Tabs>
              <TabPanel value={value} index={0}>
                <LeadsDataGrid
                  page={page}
                  setPage={setPage}
                  pageSize={pageSize}
                  setPageSize={setPageSize}
                  searchFilter={searchFilter}
                  setSearchFilter={setSearchFilter}
                  title="Liste des Leads"
                  generate={true}
                  leadsData={usersData}
                  query={usersQuery}
                />
              </TabPanel>
              <TabPanel value={value} index={1}>
                <LeadsDataGrid
                  query={usersQuery}
                  page={page}
                  setPage={setPage}
                  pageSize={pageSize}
                  setPageSize={setPageSize}
                  searchFilter={searchFilter}
                  setSearchFilter={setSearchFilter}
                  title="Liste des Clients"
                  generate={false}
                  leadsData={usersData}
                />
              </TabPanel>
            </Grid>
          </Grid>
        )}

        <div
          style={{
            display: 'flex',
            justifyContent: 'end',
            marginTop: 40
          }}
        >
          <Typography variant="h5">Créé le aaa {lotData?.created_at}</Typography>
        </div>
      </div>
    </MainCard>
  );
};

DetailsLotLeadsPage.propTypes = {
  open: PropTypes.bool,
  handleCloseDialog: PropTypes.func
};
export default DetailsLotLeadsPage;

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
