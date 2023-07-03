// material-ui
import { Grid, LinearProgress, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// ===========================|| WIDGET STATISTICS - CUSTOMER SATISFACTION ||=========================== //

const CustomerSatisfactionCard = ({ childStats = [], title, mainStats }) => {
  return (
    <MainCard title={title} headerColor color="#195A82">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h3" align="center">
            {mainStats}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <LinearProgress variant="determinate" value={100} color="primary" />
        </Grid>
        <Grid item xs={12}>
          <Grid container justifyContent={childStats.length === 1 ? 'center' : 'flex-start'} spacing={gridSpacing}>
            {childStats.map((item) => (
              <Grid item xs={4} container justifyContent="center" alignItems="center" spacing={1}>
                <div>
                  <Grid item xs={12} sx={{ minHeight: '50px' }}>
                    <Typography sx={{ textAlign: 'center', color: item?.status_color }} variant="subtitle2">
                      {item?.title}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography sx={{ textAlign: 'center', color: item?.status_color }} variant="h5">
                      {item?.count}
                    </Typography>
                  </Grid>
                </div>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default CustomerSatisfactionCard;
