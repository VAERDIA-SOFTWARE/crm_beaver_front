import {
  CardContent,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  Fade,
  FormControlLabel,
  Grid,
  IconButton,
  Typography
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

const WidgetDashboard = ({ handleOpenDialog, handleCloseDialog, open, cardInformation, setCardInformation, theme, loggedinUser }) => {
  const [position, setPosition] = useState({ lat: null, lon: null });
  const { data } = useOpenWeather({
    key: 'ca47382a80733cff8869b6e0527167da',
    lat: position?.lat,
    lon: position?.lon,
    lang: 'fr',
    unit: 'metric'
  });

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
          <MainCard>
            <Stack spacing={1}>
              <Typography variant="h3">
                {data?.current?.temperature?.current} <sup>°</sup>
              </Typography>
              <Typography variant="body1">Bonjour {loggedinUser?.name}</Typography>
            </Stack>
          </MainCard>
        </Grid>
        {cardInformation
          .filter((element) => element.default)
          .map((element) => (
            <Fade in={true} out={true} timeout={500} key={element.id}>
              <Grid item xs={12} lg={3} sm={6}>
                <ReportCard
                  cardInformation={cardInformation}
                  setCardInformation={setCardInformation}
                  primary={element.primaryData}
                  secondary={element.title}
                  color={theme.palette.secondary.main}
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
      toast.error('Vous ne pouvez pas choisir plus que quatre widgets');
    }
  };

  return (
    <CardContent>
      {cardInformation.length > 0 && (
        <Grid container spacing={0}>
          {cardInformation.map((item) => (
            <Grid item xs={12} key={item.id}>
              <FormControlLabel
                control={<Checkbox checked={item.default} onChange={handleChangeState} name={item.id.toString()} color="primary" />}
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

const ReportCard = ({ primary, secondary, iconPrimary, color, cardInformation, setCardInformation }) => {
  return (
    <>
      <MainCard>
        <CustomizedDialogs cardInformation={cardInformation} setCardInformation={setCardInformation} />
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Stack spacing={1}>
              <Typography variant="h3">{primary}</Typography>
              <Typography variant="body1">{secondary}</Typography>
            </Stack>
          </Grid>
          <Grid item>
            <Typography variant="h2" style={{ color }}>
              {iconPrimary}
            </Typography>
          </Grid>
        </Grid>
      </MainCard>
    </>
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
