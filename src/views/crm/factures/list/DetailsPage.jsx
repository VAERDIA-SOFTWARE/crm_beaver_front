import EditIcon from '@mui/icons-material/Edit';
import PropTypes from 'prop-types';

// material-ui
import CheckIcon from '@mui/icons-material/Check';
import RemoveIcon from '@mui/icons-material/Remove';
import { Box, Button, Grid, IconButton, Tab, Tabs, Typography } from '@mui/material';
import { useState } from 'react';
import LocalPrintshopRoundedIcon from '@mui/icons-material/LocalPrintshopRounded';
import ReceiptRoundedIcon from '@mui/icons-material/ReceiptRounded';

// project imports
import { Link, useNavigate, useParams } from 'react-router-dom';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';

import { useConfirm } from 'material-ui-confirm';
import { useAnnulerFacture, useGetFacture, useValiderFacture } from 'services/facture.service';
import { LoadingButton } from '@mui/lab';
import CreateFacture from './CreateFacture';

const FactureDetailsPage = () => {
  const { factureId } = useParams();

  const getFactureQuery = useGetFacture(factureId);
  const factureData = getFactureQuery.data;

  const navigate = useNavigate();

  const [value, setValue] = useState(0);
  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const validerFactureMutation = useValiderFacture();
  const annulerFactureMutation = useAnnulerFacture();

  const confirm = useConfirm();

  return (
    <MainCard
      title={`Facture ${factureData?.reference ? '- ' + factureData?.reference : ''}`}
      // title={
      //   <div
      //     style={{
      //       display: 'flex',
      //       alignItems: 'center',
      //       gap: 5
      //     }}
      //   >
      //     <Typography variant="subtitle1">Client - {clientData?.reference}</Typography>
      //     {/* <Tooltip title={`Créé à ${clientData?.created_at}`}>
      //       <IconButton>
      //         <InfoIcon fontSize="small" />
      //       </IconButton>
      //     </Tooltip> */}
      //   </div>
      // }
      backButton
      // goBackLink="/factures/list"
      secondary={
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 15
          }}
        >
          {factureData?.status == 0 && (
            <LoadingButton
              disabled={annulerFactureMutation.isLoading}
              loadingPosition="start"
              loading={validerFactureMutation.isLoading}
              variant="contained"
              startIcon={<CheckIcon />}
              color="secondary"
              size="large"
              onClick={(e) => {
                confirm({
                  description: `Êtes-vous sûr de vouloir de valider ${factureData?.reference}.`,
                  title: `Veuillez confirmer la validation`
                })
                  .then(() => validerFactureMutation.mutateAsync({ factureId }))
                  .catch(() => console.log('Deactivation cancelled.'));
              }}
            >
              Valider
            </LoadingButton>
          )}

          {factureData?.status == 0 && (
            <LoadingButton
              disabled={validerFactureMutation.isLoading}
              loadingPosition="start"
              loading={annulerFactureMutation.isLoading}
              variant="outlined"
              startIcon={<RemoveIcon />}
              color="error"
              size="large"
              onClick={async (e) => {
                confirm({
                  description: `Êtes-vous sûr de vouloir d'annuler ${factureData?.reference}.`,
                  title: `Veuillez confirmer l'annulation`
                })
                  .then(() =>
                    annulerFactureMutation.mutateAsync({
                      factureId
                    })
                  )
                  .catch(() => console.log('Deactivation cancelled.'));
              }}
            >
              Annuler
            </LoadingButton>
          )}

          {factureData?.status == 1 && (
            <LoadingButton
              startIcon={<ReceiptRoundedIcon />}
              loadingIndicator="start"
              variant="outlined"
              color="secondary"
              size="large"
              onClick={(e) => {
                // handleOpenEditDialog(e);
                navigate(`/factures/${factureId}/generer-avoir`);
              }}
            >
              Facture d'avoir
            </LoadingButton>
          )}

          {'factureData?.status == 1' && (
            <Link to={`${process.env.REACT_APP_API_URL}commandes/factures/${factureId}/pdf`} target="_blank">
              <LoadingButton variant="contained" color="secondary" size="large" startIcon={<LocalPrintshopRoundedIcon />}>
                Imprimer
              </LoadingButton>
            </Link>
          )}

          {factureData?.status == 0 && (
            <IconButton
              color="secondary"
              size="large"
              onClick={(e) => {
                navigate(`/factures/${factureId}/update`);
              }}
            >
              <EditIcon sx={{ fontSize: '1.3rem' }} />
            </IconButton>
          )}
          {/* <Typography variant="subtitle1">Created at {clientData?.created_at}</Typography> */}
        </div>
      }
    >
      <div>
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
          <Tab to="#" label="Facture" {...a11yProps(0)} />
          {/* <Tab to="#" label="Document" {...a11yProps(1)} /> */}
        </Tabs>

        <TabPanel value={value} index={0}>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12} md={12}>
              <CreateFacture readOnly hideTitle />
            </Grid>
          </Grid>
        </TabPanel>
        {false && (
          <TabPanel value={value} index={1}>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12} md={12}>
                {/* <SubCard> */}
                <iframe
                  title="pdf"
                  src={`${process.env.REACT_APP_API_URL}commandes/factures/${factureId}/pdf`}
                  width="100%"
                  height="900px"
                  style={{
                    borderRadius: 10,
                    borderColor: '#90caf975',
                    boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
                    border: '0px solid'
                  }}
                ></iframe>
                {/* </SubCard> */}
              </Grid>
            </Grid>
          </TabPanel>
        )}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'end',
          marginTop: 40
        }}
      >
        <Typography variant="h5">Créé le {factureData?.created_at}</Typography>
      </div>
    </MainCard>
  );
};

FactureDetailsPage.propTypes = {
  open: PropTypes.bool,
  handleCloseDialog: PropTypes.func
};

export default FactureDetailsPage;

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
