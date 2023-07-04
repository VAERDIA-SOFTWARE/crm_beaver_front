import { Grid, Stack, Typography } from '@mui/material';
import React from 'react';
import { gridSpacing } from 'store/constant';
import SubCard from 'ui-component/cards/SubCard';

export default function ValidateCard({ lotChantierData, title }) {
  const [validated, setValidated] = React.useState(null);
  React.useEffect(() => {
    setValidated(lotChantierData?.validated);
  }, [lotChantierData]);

  return (
    <SubCard>
      <Typography
        variant="h3"
        style={{
          marginBottom: 20
        }}
        gutterBottom
      >
        Etat Commande
      </Typography>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12} sm={6} md={4}></Grid>
      </Grid>
    </SubCard>
  );
}
