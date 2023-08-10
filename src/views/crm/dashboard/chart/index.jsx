import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import {
  Button,
  CardContent,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton
} from '@mui/material';
import { styled } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';
import Chart from 'react-apexcharts';
import { useEffect, useState } from 'react';
import { useUpdateDashboard } from 'services/dashboard.service';

const ChartDashboard = ({
  handleOpenChartDialog,
  handleCloseChartDialog,
  openCharts,
  chartsInformations,
  setChartsInformations,
  loggedinUser,
  theme
}) => {
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
          handleCloseChartDialog={handleCloseChartDialog}
          cardInformation={chartsInformations}
          setCardInformation={setChartsInformations}
          loggedinUserId={loggedinUser?.id}
        />
      )}
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12} lg={12} md={12}>
          {/* <Grid container spacing={gridSpacing}> */}
          <Grid container spacing={gridSpacing}>
            {chartsInformations
              .filter((element) => element.default)
              .map((element) => (
                <Grid item xs={12} lg={4} sm={6} key={element.id}>
                  <AreaChartCard chartsInformations={element} setChartsInformations={setChartsInformations} theme={theme} />
                </Grid>
              ))}
          </Grid>
          {/* </Grid> */}
        </Grid>
      </Grid>
    </MainCard>
  );
};
export default ChartDashboard;

// Modal Parts
const CustomizedDialogs = ({
  open,
  reportCard,
  setReportCard,
  cardInformation,
  setCardInformation,
  loggedinUserId,
  handleCloseChartDialog
}) => {
  const [formInput, setFormInput] = useState([]);
  const useUpdateDashboardQuery = useUpdateDashboard({ idClient: loggedinUserId, idBlock: 2 });

  useEffect(() => {
    if (cardInformation && cardInformation.length > 0) {
      const newFormInput = cardInformation.map((item) => ({
        name: item.name,
        active: item.default
      }));
      setFormInput(newFormInput);
    }
  }, [cardInformation]);
  const handleChange = async () => {
    try {
      await useUpdateDashboardQuery.mutateAsync(formInput);
      handleCloseChartDialog(false);
    } catch (err) {}
  };

  return (
    <BootstrapDialog open={open} onClose={handleCloseChartDialog} aria-labelledby="customized-dialog-title">
      <BootstrapDialogTitle open={open} onClose={handleCloseChartDialog} id="customized-dialog-title">
        Veuillez choisir jusqu'a 3 Courbes
      </BootstrapDialogTitle>
      <DialogContent dividers>
        <ModalContent
          reportCard={reportCard}
          setReportCard={setReportCard}
          cardInformation={cardInformation}
          setCardInformation={setCardInformation}
        />
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleChange}>
          confirmer
        </Button>
      </DialogActions>
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
  const updatedCardInfo = cardInformation.map((item) => {
    return { ...item };
  });

  const selectedItemCount = updatedCardInfo.filter((item) => item.default === 1).length;

  const handleChangeState = (event) => {
    const { name, checked } = event.target;
    const updatedCardInfo = cardInformation.map((item) => {
      if (item.id === Number(name)) {
        return { ...item, default: checked ? 1 : 0 };
      }
      return item;
    });

    if (selectedItemCount <= 3) {
      setCardInformation(updatedCardInfo);
    }
  };

  return (
    <CardContent>
      {cardInformation.length > 0 && (
        <Grid container spacing={0}>
          {cardInformation.map((item) => (
            <Grid item xs={12} key={item.id}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={item.default}
                    onChange={handleChangeState}
                    name={item.id}
                    color="primary"
                    disabled={!item.default && selectedItemCount >= 3}
                  />
                }
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
const AreaChartCard = ({ chartsInformations, theme }) => {
  const chartData = {
    series: [
      {
        name: chartsInformations.year,
        data: chartsInformations.currentYear,
        color: theme.palette.success.main
      },
      {
        name: chartsInformations.yearSub,
        data: chartsInformations.subYear,
        color: theme.palette.warning.main
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
      stroke: {
        curve: 'smooth'
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
