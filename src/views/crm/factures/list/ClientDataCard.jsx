import { Grid, Stack, Typography } from '@mui/material';
import React from 'react';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';

export default function ClientDataCard({ clientData, title }) {
  return (
    <MainCard title={title || 'Informations du client'}>
      {/* <Typography
        variant="h3"
        style={{
          marginBottom: 20
        }}
        gutterBottom
      >
        
      </Typography> */}
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12} sm={6} md={4}>
          <Stack spacing={2}>
            <Typography variant="h4">Informations générales</Typography>
            <Stack spacing={0}>
              {/* <Typography variant="h6" sx={{ mb: 1 }}>
                Credit Card
              </Typography> */}
              <Stack direction="row" spacing={1}>
                <Typography variant="subtitle1">Référence :</Typography>
                <Typography variant="body2">{clientData?.reference}</Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Typography variant="subtitle1">Intitulé :</Typography>
                <Typography variant="body2">{clientData?.name}</Typography>
              </Stack>
              {clientData?.identifient_fiscal && (
                <Stack direction="row" spacing={1}>
                  <Typography variant="subtitle1">Identifiant Fiscal :</Typography>
                  <Typography variant="body2">{clientData?.identifient_fiscal}</Typography>
                </Stack>
              )}
              {clientData?.identifient_tva && (
                <Stack direction="row" spacing={1}>
                  <Typography variant="subtitle1">Identifiant TVA :</Typography>
                  <Typography variant="body2">{clientData?.identifient_tva}</Typography>
                </Stack>
              )}
              {clientData?.interlocuteur && (
                <Stack direction="row" spacing={1}>
                  <Typography variant="subtitle1">Interlocuteur :</Typography>
                  <Typography variant="body2">{clientData?.interlocuteur}</Typography>
                </Stack>
              )}
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Stack spacing={2}>
            <Typography variant="h4">Informations de contact</Typography>
            <Stack spacing={0}>
              {/* <Typography variant="h6" sx={{ mb: 1 }}>
                Carrier
              </Typography> */}
              {clientData?.phone_number && (
                <Stack direction="row" spacing={1}>
                  <Typography variant="subtitle1">Numéro de téléphone :</Typography>
                  <Typography variant="body2">{clientData?.phone_number}</Typography>
                </Stack>
              )}
              {clientData?.email && (
                <Stack direction="row" spacing={1}>
                  <Typography variant="subtitle1">Email :</Typography>
                  <Typography variant="body2">{clientData?.email}</Typography>
                </Stack>
              )}
              {clientData?.fax && (
                <Stack direction="row" spacing={1}>
                  <Typography variant="subtitle1">Fax :</Typography>
                  <Typography variant="body2">{clientData?.fax}</Typography>
                </Stack>
              )}
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Stack spacing={2}>
            <Typography variant="h4">Informations résidentielles</Typography>
            <Stack>
              <Stack direction="row" spacing={1}>
                <Typography variant="subtitle1">Addresse :</Typography>
                <Typography variant="body2">{clientData?.address}</Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Typography variant="subtitle1">Ville :</Typography>
                <Typography variant="body2">{clientData?.ville}</Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Typography variant="subtitle1">Code postal :</Typography>
                <Typography variant="body2">{clientData?.code_postal}</Typography>
              </Stack>
            </Stack>
          </Stack>
        </Grid>
        {clientData?.signature && (
          <Grid item xs={12} sm={6} md={4}>
            <Stack spacing={2}>
              <Typography variant="h4">Signature</Typography>
              <Stack>
                <Stack direction="row" spacing={1}>
                  <img src={clientData?.signature} alt="" />
                </Stack>
              </Stack>
            </Stack>
          </Grid>
        )}
      </Grid>
    </MainCard>
  );
}
