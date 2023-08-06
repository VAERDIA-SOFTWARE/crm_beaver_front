import {
  Card,
  CardContent,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  Fade,
  FormControlLabel,
  Grid,
  IconButton,
  Typography,
  useMediaQuery
} from '@mui/material';
import { styled, Stack } from '@mui/system';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import EngineeringOutlinedIcon from '@mui/icons-material/EngineeringOutlined';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import RequestQuoteOutlinedIcon from '@mui/icons-material/RequestQuoteOutlined';
import { useState, useEffect } from 'react';
import { useOpenWeather } from 'react-open-weather';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';

const WidgetDashboard = ({
  handleOpenDialog,
  handleCloseDialog,
  open,
  cardInformation,
  setCardInformation,
  theme,
  loggedinUser,
  bgcolor
}) => {
  const [position, setPosition] = useState({ lat: null, lon: null });
  const { data } = useOpenWeather({
    key: 'ca47382a80733cff8869b6e0527167da',
    lat: position?.lat,
    lon: position?.lon,
    lang: 'fr',
    unit: 'metric'
  });
  const matchDownXs = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPosition({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          toast.error("Impossible d'extraire votre geolocalisation");
        }
      );
    }
  }, []);
  return (
    <MainCard
      sx={{ boxShadow: 'unset' }}
      settingsIcon={true}
      handleOpenDialog={handleOpenDialog}
      boxShadow={false}
      shadow={false}
      border={false}
      title="Informations Generales mensuelle"
    >
      {open && open === true && (
        <CustomizedDialogs
          open={open}
          onClose={handleCloseDialog}
          cardInformation={cardInformation}
          setCardInformation={setCardInformation}
        />
      )}
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12} lg={3} sm={6}>
          <Card sx={{ bgcolor: bgcolor || '', position: 'relative' }}>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item xs={4} sx={{ background: theme.palette.secondary.main, py: 3.5, px: 0 }}>
                <Typography
                  variant="h5"
                  sx={{
                    textAlign: 'center',
                    color: '#fff',
                    '& > svg': {
                      width: 32,
                      height: 32
                    }
                  }}
                  align="center"
                >
                  <WbSunnyOutlinedIcon />
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Grid
                  container
                  direction="column"
                  justifyContent="space-between"
                  spacing={1}
                  alignItems={matchDownXs ? 'center' : 'flex-start'}
                >
                  <Grid item sm={12}>
                    <Typography variant="h3" sx={{ color: bgcolor ? '#fff' : '', ml: 2 }}>
                      Bonjour {loggedinUser?.name}
                    </Typography>
                  </Grid>
                  <Grid item sm={12}>
                    <Typography variant="body2" align="left" sx={{ color: bgcolor ? '#fff' : 'grey.700', ml: 2 }}>
                      {data?.current?.temperature?.current} <sup>°</sup>
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Card>
        </Grid>
        {cardInformation
          .filter((element) => element.default && loggedinUser?.resources[element?.ressource]?.authorized === true)
          .map((element) => (
            <Fade in={true} out={true} timeout={500} key={element.id}>
              <Grid item xs={12} lg={3} sm={6}>
                <ReportCard
                  matchDownXs={matchDownXs}
                  cardInformation={cardInformation}
                  setCardInformation={setCardInformation}
                  primary={element.primaryData}
                  secondary={element.title}
                  color={theme.palette[element.color]?.main}
                  theme={theme}
                  iconPrimary={getIconComponent(element.icon)}
                />
              </Grid>
            </Fade>
          ))}
      </Grid>
    </MainCard>
  );
};
export default WidgetDashboard;

// Dialogs Parts
const CustomizedDialogs = ({ open, onClose, cardInformation, setCardInformation }) => {
  return (
    <BootstrapDialog open={open} onClose={onClose} aria-labelledby="customized-dialog-title">
      <BootstrapDialogTitle open={open} onClose={onClose} id="customized-dialog-title">
        Cartes disponibles
      </BootstrapDialogTitle>
      <DialogContent dividers>
        <ModalContent cardInformation={cardInformation} setCardInformation={setCardInformation} />
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
  const updatedCardInfo = cardInformation.map((item) => {
    return { ...item };
  });

  const selectedItemCount = updatedCardInfo.filter((item) => item.default).length;

  const handleChangeState = (event) => {
    const { name, checked } = event.target;
    const updatedCardInfo = cardInformation.map((item) => {
      if (item.id === Number(name)) {
        return { ...item, default: checked };
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
                    name={item.id.toString()}
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

//    Cards widget layout

const ReportCard = ({ primary, secondary, iconPrimary, color, cardInformation, setCardInformation, theme, bgcolor, matchDownXs }) => {
  return (
    <Card sx={{ bgcolor: bgcolor || '', position: 'relative' }}>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item xs={4} sx={{ background: color, py: 3.5, px: 0 }}>
          <Typography
            variant="h5"
            sx={{
              textAlign: 'center',
              color: '#fff',
              '& > svg': {
                width: 32,
                height: 32
              }
            }}
            align="center"
          >
            {iconPrimary}
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Grid container direction="column" justifyContent="space-between" spacing={1} alignItems={matchDownXs ? 'center' : 'flex-start'}>
            <Grid item sm={12}>
              <Typography variant="h3" sx={{ color: bgcolor ? '#fff' : '', ml: 2 }}>
                {primary}
              </Typography>
            </Grid>
            <Grid item sm={12}>
              <Typography variant="body2" align="left" sx={{ color: bgcolor ? '#fff' : 'grey.700', ml: 2 }}>
                {secondary}

                {/* <span style={{ color }}>{secondarySub}</span>{' '} */}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
};

const iconMap = {
  EditIcon,
  GroupAddOutlinedIcon,
  EngineeringOutlinedIcon,
  ReceiptOutlinedIcon,
  RequestQuoteOutlinedIcon
  // Add more mappings as needed
};

export const getIconComponent = (iconName) => {
  const IconComponent = iconMap[iconName];
  return IconComponent ? <IconComponent /> : null;
};
