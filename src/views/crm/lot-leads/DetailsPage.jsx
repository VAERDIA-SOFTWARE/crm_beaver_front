import PropTypes from 'prop-types';

// material-ui
import { Grid, Typography } from '@mui/material';

// project imports
import { useParams } from 'react-router-dom';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import LotLeadsDataCard from './LotLeadsDataCard';
import LeadsDataGrid from './LeadsDataGrid';
import { useGetLotLead } from 'services/lot-leads.service';

const DetailsLotLeadsPage = () => {
  const { lotLeadsId } = useParams();
  const getLotQuery = useGetLotLead(lotLeadsId);
  const lotData = getLotQuery.data;
  localStorage.setItem('LotId', lotLeadsId);

  return (
    <MainCard
      title={`Leads ${lotData?.reference ? '- ' + lotData?.reference : ''}`}
      backButton
      goBackLink={`/lot-leads/list`}
      // secondary={}
    >
      <div>
        {getLotQuery.isSuccess && (
          <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
            <Grid item xs={12}>
              <LotLeadsDataCard title={'Information Du Lot'} clientData={lotData} />
            </Grid>
          </Grid>
        )}
        {getLotQuery.isSuccess && (
          <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
            <Grid item xs={12}>
              <LeadsDataGrid leadsData={lotData?.all_clients} />
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
