import { Grid, Stack, Typography } from '@mui/material';
import React from 'react';
import { gridSpacing } from 'store/constant';
import SubCard from 'ui-component/cards/SubCard';

export default function PointageDataCard({ userData, title }) {
  return (
    <SubCard>
      <Typography
        variant="h3"
        style={{
          marginBottom: 20
        }}
        gutterBottom
      >
        {title}
      </Typography>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12} md={6}>
          <Stack spacing={2}>
            <Stack spacing={0}>
              {userData?.reference && (
                <Stack direction="row" spacing={1}>
                  <Typography variant="subtitle1">Réference :</Typography>
                  <Typography variant="body2">{userData?.reference}</Typography>
                </Stack>
              )}
              {userData?.nom && (
                <Stack direction="row" spacing={1}>
                  <Typography variant="subtitle1">Nom :</Typography>
                  <Typography variant="body2">{userData?.nom}</Typography>
                </Stack>
              )}
              {userData?.prix_unitaire && (
                <Stack direction="row" spacing={1}>
                  <Typography variant="subtitle1">Prix Unitaire :</Typography>
                  <Typography variant="body2">{userData?.prix_unitaire}</Typography>
                </Stack>
              )}
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          <Stack spacing={2}>
            <Stack spacing={0}>
              {userData?.remise && (
                <Stack direction="row" spacing={1}>
                  <Typography variant="subtitle1">Remise :</Typography>
                  <Typography variant="body2">{userData?.remise}</Typography>
                </Stack>
              )}
              {userData?.unite && (
                <Stack direction="row" spacing={1}>
                  <Typography variant="subtitle1">Unité :</Typography>
                  <Typography variant="body2">{userData?.unite?.intitule}</Typography>
                </Stack>
              )}
              {userData?.parent && (
                <Stack direction="row" spacing={1}>
                  <Typography variant="subtitle1">Liée à Marque :</Typography>
                  <Typography variant="body2">{userData?.parent}</Typography>
                </Stack>
              )}
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </SubCard>
  );
}
