import { Grid, Stack, Typography } from '@mui/material';
import React from 'react';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';

export default function LotLeadsDataCard({ clientData, title }) {
  return (
    <MainCard title={title || 'Informations du client'}>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12} sm={6} md={6}>
          <Stack spacing={2}>
            <Typography variant="h4">Informations générales</Typography>
            <Stack spacing={0}>
              {clientData?.reference && (
                <Stack direction="row" spacing={1}>
                  <Typography variant="subtitle1">Référence :</Typography>
                  <Typography variant="body2">{clientData?.reference}</Typography>
                </Stack>
              )}
              <Stack direction="row" spacing={1}>
                <Typography variant="subtitle1">Nombre de Leads :</Typography>
                <Typography variant="body2">{clientData?.nombre_leads}</Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Typography variant="subtitle1">Leads Tranféré en Client :</Typography>
                <Typography variant="body2">{clientData?.nombre_clients}</Typography>
              </Stack>
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <Stack spacing={2}>
            <Typography variant="h4">Informations de contact</Typography>
            <Stack spacing={0}>
              {clientData?.creator_user?.name && (
                <Stack direction="row" spacing={1}>
                  <Typography variant="subtitle1">Créateur :</Typography>
                  <Typography variant="body2">{clientData?.creator_user?.name}</Typography>
                </Stack>
              )}
              {clientData?.creator_user?.email && (
                <Stack direction="row" spacing={1}>
                  <Typography variant="subtitle1">Email :</Typography>
                  <Typography variant="body2">{clientData?.creator_user?.email}</Typography>
                </Stack>
              )}
              {clientData?.creator_user?.phone_number && (
                <Stack direction="row" spacing={1}>
                  <Typography variant="subtitle1">N° de téléphone :</Typography>
                  <Typography variant="body2">{clientData?.creator_user?.phone_number}</Typography>
                </Stack>
              )}
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </MainCard>
  );
}
