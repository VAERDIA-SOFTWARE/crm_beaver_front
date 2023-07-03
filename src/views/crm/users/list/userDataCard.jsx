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
              {/* <Typography variant="h6" sx={{ mb: 1 }}>
                Credit Card
              </Typography> */}
              <Stack direction="row" spacing={1}>
                <Typography variant="subtitle1">Référence :</Typography>
                <Typography variant="body2">{userData?.reference}</Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Typography variant="subtitle1">Intitulé :</Typography>
                <Typography variant="body2">{userData?.name}</Typography>
              </Stack>
              {userData?.identifient_fiscal && (
                <Stack direction="row" spacing={1}>
                  <Typography variant="subtitle1">Identifiant Fiscal :</Typography>
                  <Typography variant="body2">{userData?.identifient_fiscal}</Typography>
                </Stack>
              )}
              {userData?.identifient_tva && (
                <Stack direction="row" spacing={1}>
                  <Typography variant="subtitle1">Identifiant TVA :</Typography>
                  <Typography variant="body2">{userData?.identifient_tva}</Typography>
                </Stack>
              )}
              {userData?.interlocuteur && (
                <Stack direction="row" spacing={1}>
                  <Typography variant="subtitle1">Interlocuteur :</Typography>
                  <Typography variant="body2">{userData?.interlocuteur}</Typography>
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
              <Stack direction="row" spacing={1}>
                <Typography variant="subtitle1">Numéro de téléphone :</Typography>
                <Typography variant="body2">{userData?.phone_number}</Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Typography variant="subtitle1">Email :</Typography>
                <Typography variant="body2">{userData?.email}</Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Typography variant="subtitle1">Fax :</Typography>
                <Typography variant="body2">{userData?.fax}</Typography>
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
                <Typography variant="body2">{userData?.address}</Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Typography variant="subtitle1">Ville :</Typography>
                <Typography variant="body2">{userData?.ville}</Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Typography variant="subtitle1">Code postal :</Typography>
                <Typography variant="body2">{userData?.code_postal}</Typography>
              </Stack>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </SubCard>
  );
}
