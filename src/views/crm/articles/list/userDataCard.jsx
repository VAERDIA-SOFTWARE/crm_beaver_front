import { Grid, Stack, Typography } from '@mui/material';
import React from 'react';
import { gridSpacing } from 'store/constant';
import SubCard from 'ui-component/cards/SubCard';

export default function UserDataCard({ userData, title }) {
  return (
    <SubCard>
      <Typography
        variant="h3"
        style={{
          marginBottom: 20
        }}
        gutterBottom
      >
        {title || 'Informations du Utilisateur'}
      </Typography>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12} sm={6} md={4}>
          <Stack spacing={2}>
            <Typography variant="h4">Informations générales</Typography>
            <Stack spacing={0}>
              {userData?.reference && (
                <Stack direction="row" spacing={1}>
                  <Typography variant="subtitle1">Réference :</Typography>
                  <Typography variant="body2">{userData?.reference}</Typography>
                </Stack>
              )}
              {userData?.name && (
                <Stack direction="row" spacing={1}>
                  <Typography variant="subtitle1">Nom :</Typography>
                  <Typography variant="body2">{userData?.name}</Typography>
                </Stack>
              )}
              {userData?.identifier && (
                <Stack direction="row" spacing={1}>
                  <Typography variant="subtitle1">Identifiant :</Typography>
                  <Typography variant="body2">{userData?.identifier}</Typography>
                </Stack>
              )}
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Stack spacing={2}>
            <Typography variant="h4">Informations de contact</Typography>
            <Stack spacing={0}>
              {userData?.phone_number && (
                <Stack direction="row" spacing={1}>
                  <Typography variant="subtitle1">Numéro de téléphone :</Typography>
                  <Typography variant="body2">{userData?.phone_number}</Typography>
                </Stack>
              )}

              {userData?.email && (
                <Stack direction="row" spacing={1}>
                  <Typography variant="subtitle1">Email :</Typography>
                  <Typography variant="body2">{userData?.email}</Typography>
                </Stack>
              )}
            </Stack>
          </Stack>
        </Grid>
        {userData?.address && (
          <Grid item xs={12} sm={6} md={4}>
            <Stack spacing={2}>
              <Typography variant="h4">Informations résidentielles</Typography>
              <Stack>
                <Stack direction="row" spacing={1}>
                  <Typography variant="subtitle1">Addresse :</Typography>
                  <Typography variant="body2">{userData?.address}</Typography>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Typography variant="subtitle1">Ville :</Typography>
                  <Typography variant="body2">{userData?.city}</Typography>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Typography variant="subtitle1">Code postal :</Typography>
                  <Typography variant="body2">{userData?.postal_code}</Typography>
                </Stack>
              </Stack>
            </Stack>
          </Grid>
        )}
      </Grid>
    </SubCard>
  );
}
