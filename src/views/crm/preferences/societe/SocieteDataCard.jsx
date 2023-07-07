import { Grid, Stack, Typography } from '@mui/material';
import { gridSpacing } from 'store/constant';
import SubCard from 'ui-component/cards/SubCard';

export function SocieteDataCard({ data }) {
  return (
    <Grid container spacing={gridSpacing} rowSpacing={5}>
      <Grid item xs={12}>
        <SocieteGeneraleDataCard data={data} />
      </Grid>
      <Grid item xs={12}>
        <SocieteContactDataCard data={data} />
      </Grid>
      <Grid item xs={12}>
        <SocieteAddresseDataCard data={data} />
      </Grid>
    </Grid>
  );
}

export function SocieteGeneraleDataCard({ data }) {
  return (
    <SubCard title="Générale">
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12} sm={6} md={4}>
          <Stack spacing={2}>
            {/* <Typography variant="h4">Chantier</Typography> */}
            <Stack>
              <Stack direction="row" spacing={1}>
                <Typography variant="subtitle1">Intitulé :</Typography>
                <Typography variant="body2">{data?.intitule}</Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Typography variant="subtitle1">Devise :</Typography>
                <Typography variant="body2">{data?.devise}</Typography>
              </Stack>

              <Stack direction="row" spacing={1}>
                <Typography variant="subtitle1">Matricule fiscale :</Typography>
                <Typography variant="body2">{data?.matricule_fisacale}</Typography>
              </Stack>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </SubCard>
  );
}

export function SocieteContactDataCard({ data }) {
  return (
    <SubCard title="Contact">
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12} sm={6} md={4}>
          <Stack spacing={2}>
            {/* <Typography variant="h4">Chantier</Typography> */}
            <Stack>
              <Stack direction="row" spacing={1}>
                <Typography variant="subtitle1">E-mail :</Typography>
                <Typography variant="body2">{data?.mail}</Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Typography variant="subtitle1">Téléphone 1 :</Typography>
                <Typography variant="body2">{data?.telephone_1}</Typography>
              </Stack>

              <Stack direction="row" spacing={1}>
                <Typography variant="subtitle1">Téléphone 2 :</Typography>
                <Typography variant="body2">{data?.telephone_2}</Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Typography variant="subtitle1">Téléphone FAX :</Typography>
                <Typography variant="body2">{data?.fax}</Typography>
              </Stack>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </SubCard>
  );
}

export function SocieteAddresseDataCard({ data }) {
  return (
    <SubCard title="Adresse">
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12} sm={12} md={12}>
          <Stack spacing={2}>
            {/* <Typography variant="h4">Addresse</Typography> */}
            <Stack>
              {/* <Stack direction="row" spacing={1}>
                <Typography variant="subtitle1">Location :</Typography>
                <Typography variant="body2">{data?.location}</Typography>
              </Stack> */}
              <Stack direction="row" spacing={1}>
                <Typography variant="subtitle1">Code postale :</Typography>
                <Typography variant="body2">{data?.code_postale}</Typography>
              </Stack>

              <Stack direction="row" spacing={1}>
                <Typography variant="subtitle1">Pays :</Typography>
                <Typography variant="body2">{data?.pays}</Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Typography variant="subtitle1">Complément :</Typography>
                <Typography variant="body2">{data?.complement}</Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Typography variant="subtitle1">Ville :</Typography>
                <Typography variant="body2">{data?.ville}</Typography>
              </Stack>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </SubCard>
  );
}
