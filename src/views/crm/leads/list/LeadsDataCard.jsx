import { Grid, Stack, Typography } from '@mui/material';
import React from 'react';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';

export default function ClientDataCard({ clientData, title }) {
  return (
    <MainCard title={title || 'Informations du leads'}>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12} sm={6} md={4}>
          <Stack spacing={2}>
            <Typography variant="h4">Informations générales</Typography>
            <Stack spacing={0}>
              {clientData?.reference && (
                <Stack direction="row" spacing={1}>
                  <Typography variant="subtitle1">Référence :</Typography>
                  <Typography variant="body2">{clientData?.reference}</Typography>
                </Stack>
              )}
              {clientData?.name && (
                <Stack direction="row" spacing={1}>
                  <Typography variant="subtitle1">Intitulé :</Typography>
                  <Typography variant="body2">{clientData?.name}</Typography>
                </Stack>
              )}
              {clientData?.category?.intitule && (
                <Stack direction="row" spacing={1}>
                  <Typography variant="subtitle1">Catégorie :</Typography>
                  <Typography variant="body2">{clientData?.category?.intitule}</Typography>
                </Stack>
              )}
              {clientData?.societe && (
                <Stack direction="row" spacing={1}>
                  <Typography variant="subtitle1">Societé :</Typography>
                  <Typography variant="body2">{clientData?.societe}</Typography>
                </Stack>
              )}
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Stack spacing={2}>
            <Typography variant="h4">Informations de contact</Typography>
            <Stack spacing={0}>
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
        {(clientData?.address || clientData?.ville || clientData?.code_postal) && (
          <Grid item xs={12} sm={6} md={4}>
            <Stack spacing={2}>
              <Typography variant="h4">Informations résidentielles</Typography>
              <Stack>
                {clientData?.address && (
                  <>
                    <Stack direction="row" spacing={1}>
                      <Typography variant="subtitle1">Addresse :</Typography>
                      <Typography sx={{ textAlign: 'center', maxWidth: 250 }} variant="body2">
                        {clientData?.address}
                      </Typography>
                    </Stack>
                  </>
                )}
                {clientData?.ville && (
                  <Stack direction="row" spacing={1}>
                    <Typography variant="subtitle1">Ville :</Typography>
                    <Typography variant="body2">{clientData?.ville}</Typography>
                  </Stack>
                )}
                {clientData?.code_postal && (
                  <Stack direction="row" spacing={1}>
                    <Typography variant="subtitle1">Code postal :</Typography>
                    <Typography variant="body2">{clientData?.code_postal}</Typography>
                  </Stack>
                )}
              </Stack>
            </Stack>
          </Grid>
        )}
      </Grid>
    </MainCard>
  );
}
