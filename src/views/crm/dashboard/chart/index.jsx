import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import { CardContent, Checkbox, Dialog, DialogContent, DialogTitle, FormControlLabel, Grid, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';
import Chart from 'react-apexcharts';

const ChartDashboard = ({
  handleOpenChartDialog,
  handleCloseChartDialog,
  openCharts,
  chartsInformations,
  setChartsInformations,
  loggedinUser
}) => {
  console.log(loggedinUser?.resources);
  return (
    <MainCard
      settingsIcon={true}
      handleOpenDialog={handleOpenChartDialog}
      sx={{ boxShadow: 'unset' }}
      shadow={false}
      border={false}
      title="Statistiques"
    >
      {openCharts && openCharts === true && (
        <CustomizedDialogs
          open={openCharts}
          onClose={handleCloseChartDialog}
          cardInformation={chartsInformations}
          setCardInformation={setChartsInformations}
        />
      )}
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12} lg={12} md={12}>
          <Grid container spacing={gridSpacing}>
            <Grid container spacing={gridSpacing}>
              {chartsInformations
                .filter((element) => element.default && loggedinUser?.resources[element?.ressource]?.authorized === true)
                .map((element) => (
                  <Grid item xs={12} lg={4} sm={6} key={element.id}>
                    <AreaChartCard chartsInformations={element} setChartsInformations={setChartsInformations} />
                  </Grid>
                ))}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </MainCard>
  );
};
export default ChartDashboard;

// Modal Parts
const CustomizedDialogs = ({ open, onClose, reportCard, setReportCard, cardInformation, setCardInformation }) => {
  return (
    <BootstrapDialog open={open} onClose={onClose} aria-labelledby="customized-dialog-title">
      <BootstrapDialogTitle open={open} onClose={onClose} id="customized-dialog-title">
        Statistiques disponibles
      </BootstrapDialogTitle>
      <DialogContent dividers>
        <ModalContent
          reportCard={reportCard}
          setReportCard={setReportCard}
          cardInformation={cardInformation}
          setCardInformation={setCardInformation}
        />
      </DialogContent>
    </BootstrapDialog>
  );
};
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuDialogContent-root': {
    padding: theme.spacing(2)
  },
  '& .MuDialogActions-root': {
    padding: theme.spacing(1)
  }
}));
const BootstrapDialogTitle = ({ children, onClose, ...other }) => (
  <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
    {children}
    {onClose ? (
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 10,
          top: 10,
          color: (theme) => theme.palette.grey[500]
        }}
      >
        <CloseIcon />
      </IconButton>
    ) : null}
  </DialogTitle>
);

const ModalContent = ({ cardInformation, setCardInformation }) => {
  const handleChangeState = (event) => {
    const { name, checked } = event.target;
    const updatedCardInfo = cardInformation.map((item) => {
      if (item.id === Number(name)) {
        return { ...item, default: checked };
      }
      return item;
    });
    const selectedItems = updatedCardInfo.filter((item) => item.default);
    if (selectedItems.length <= 3) {
      setCardInformation(updatedCardInfo);
    } else {
      toast.error('Vous ne pouvez pas choisir plus que trois courbes ');
    }
  };

  return (
    <CardContent>
      {cardInformation.length > 0 && (
        <Grid container spacing={0}>
          {cardInformation.map((item) => (
            <Grid item xs={12} key={item.id}>
              <FormControlLabel
                control={<Checkbox checked={item.default} onChange={handleChangeState} name={item.id} color="primary" />}
                label={item.title}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </CardContent>
  );
};

// component card
const AreaChartCard = ({ chartsInformations }) => {
  const chartData = {
    series: [
      {
        name: chartsInformations.title,
        data: chartsInformations.data
      }
    ],
    options: {
      chart: {
        type: 'area',
        height: 350,
        toolbar: {
          show: false
        }
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      },
      yaxis: {},
      legend: {
        show: true,
        position: 'bottom'
      },
      title: {
        text: chartsInformations.title,
        align: 'center',

        margin: 10,
        offsetX: 0,
        offsetY: 0,
        floating: false,
        style: {
          fontSize: '14px',
          fontWeight: 'bold',
          fontFamily: undefined,
          color: '#263238'
        }
      }
    }
  };

  return <Chart {...chartData} />;
};
