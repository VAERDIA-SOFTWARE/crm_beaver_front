import PropTypes from 'prop-types';

// material-ui
import { Grid, Typography } from '@mui/material';

// project imports
import { useParams } from 'react-router-dom';
import { useGetLotChantier } from 'services/lot-chantiers.service';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import LotLeadsDataCard from './LotLeadsDataCard';
import LeadsDataGrid from './LeadsDataGrid';

const DetailsLotChantierPage = () => {
  const { lotChantierId } = useParams();
  const getLotChantierQuery = useGetLotChantier(lotChantierId);
  const lotChantierData = getLotChantierQuery.data;

  return (
    <MainCard
      title={`Lead ${lotChantierData?.reference ? '- ' + lotChantierData?.reference : ''}`}
      backButton
      goBackLink={`/lot-chantier/list`}
      // secondary={}
    >
      <div>
        <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
          <Grid item xs={12}>
            <LotLeadsDataCard title={'Information Du Lot'} clientData={lotChantierData?.contrat?.user} />
          </Grid>
        </Grid>
        <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
          <Grid item xs={12}>
            <LeadsDataGrid />
          </Grid>
        </Grid>

        <div
          style={{
            display: 'flex',
            justifyContent: 'end',
            marginTop: 40
          }}
        >
          <Typography variant="h5">Créé le {lotChantierData?.created_at}</Typography>
        </div>
      </div>
    </MainCard>
  );
};

DetailsLotChantierPage.propTypes = {
  open: PropTypes.bool,
  handleCloseDialog: PropTypes.func
};

export default DetailsLotChantierPage;
