import PropTypes from 'prop-types';

// material-ui
import { Grid, Typography } from '@mui/material';

// third-party
import Chart from 'react-apexcharts';

// project imports
import MainCard from 'ui-component/cards/MainCard';

const PieChartCard = ({ chartDataa = [], title }) => {
  let labels = [];
  let values = [];

  if (Array.isArray(chartDataa)) {
    labels = chartDataa?.map((e) => e?.name);
    values = chartDataa?.map((e) => e?.data);
  }

  const chartData = {
    height: 300,
    type: 'pie',
    options: {
      chart: {
        id: 'satisfaction-chart'
      },
      labels: labels || [],
      legend: {
        show: true,
        position: 'bottom',
        fontFamily: 'inherit',
        labels: {
          colors: 'inherit'
        }
      },
      dataLabels: {
        enabled: true,
        dropShadow: {
          enabled: false
        }
      },
      theme: {
        monochrome: {
          enabled: true
        }
      }
    },
    series: values || []
  };

  return (
    <MainCard>
      <Grid container direction="column" spacing={1}>
        <Grid item>
          <Typography variant="subtitle1">{title || 'Chantiers'}</Typography>
        </Grid>
        <Grid item>
          <Chart {...chartData} />
        </Grid>
      </Grid>
    </MainCard>
  );
};

PieChartCard.propTypes = {
  chartData: PropTypes.object
};

export default PieChartCard;
