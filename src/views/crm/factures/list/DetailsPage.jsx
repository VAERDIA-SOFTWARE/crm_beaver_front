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
import DetailsFacture from './DetailsFacture';

const FactureDetailsPage = () => {
  const { factureId } = useParams();

  const getFactureQuery = useGetFacture(factureId);
  // const facture = getFactureQuery.data;
  const facture = {
    casted_date_facture: '12-06-2023',
    client_id: 3,
    commentaire: null,
    created_at: '27-07-2023 12:07',
    createur_id: 1,
    d_lot_id: 1,
    date_facture: '12-06-2023',
    facture_lignes: [
      {
        TauxTva: '20.00',
        benificiaire: null,
        commentaire: null,
        created_at: '2023-07-27T12:06:47.000000Z',
        createur_id: 1,
        d_client_id: null,
        d_facture_entete_id: 14,
        d_operation_contrat_id: 1,
        designation_article: 'svsvsvsvs A',
        id: 10,
        montant_HT: '100.00',
        montant_HTNet: '400.00',
        montant_TTC: '280.00',
        montant_TVA: '5.00',
        prix_unitaire_HT: '250.00',
        prix_unitaire_HTNet: '200.00',
        prix_unitaire_TTC: '300.00',
        qte: '2.00',
        reference_operation: null,
        remise: '0.00',
        unite: null,
        unite_ligne: null,
        updated_at: '2023-07-27T12:06:47.000000Z'
      }
    ],
    facture_parent_id: null,
    file_path: null,
    id: 14,
    montant_HTNet_total: '1.00',
    montant_HT_total: '300.00',
    montant_NetaPayer: '0.00',
    montant_Remise: '-900.00',
    montant_TTC_total: '840.00',
    montant_TVA_total: '15.00',
    montant_total: 0,
    montant_total_negatif: 0,
    nature: '0',
    payer: 0,
    reference: 'PRF00004',
    status: '0',
    status_detaille: { etat: null, status: 0, nom: 'Préfacture saisie', couleur: '#AFAFAF' },
    type: '0',
    updated_at: '27-07-2023 12:07',
    user: { nom: 'Test' }
  };

  const navigate = useNavigate();

  const [value, setValue] = useState(0);
  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <MainCard title={`Facture ${facture?.reference ? '- ' + facture?.reference : ''}`} backButton>
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
              {/* <CreateFacture readOnly hideTitle /> */}
              <DetailsFacture facture={facture} />
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
        <Typography variant="h5">Créé le {facture?.created_at}</Typography>
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
