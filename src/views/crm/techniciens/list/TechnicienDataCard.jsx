import { Grid, Stack, Typography } from '@mui/material';
import React from 'react';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';

export default function TechnicienDataCard({ data }) {
  return (
    <MainCard title="Informations du technicien">
      {/* <Typography
        variant="h3"
        style={{
          marginBottom: 20
        }}
        gutterBottom
      >
        Informations du technicien
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
                <Typography variant="body2">{data?.reference}</Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Typography variant="subtitle1">Intitulé :</Typography>
                <Typography variant="body2">{data?.name}</Typography>
              </Stack>
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
              <Stack direction="row" spacing={1}>
                <Typography variant="subtitle1">Numéro de téléphone :</Typography>
                <Typography variant="body2">{data?.phone_number}</Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Typography variant="subtitle1">Email :</Typography>
                <Typography variant="body2">{data?.email}</Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Typography variant="subtitle1">Fax :</Typography>
                <Typography variant="body2">{data?.fax}</Typography>
              </Stack>
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Stack spacing={2}>
            <Typography variant="h4">Informations résidentielles</Typography>
            <Stack>
              <Stack direction="row" spacing={1}>
                <Typography variant="subtitle1">Addresse :</Typography>
                <Typography variant="body2">{data?.address}</Typography>
              </Stack>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </MainCard>
  );
}
