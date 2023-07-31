import { Typography } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';

export default function PropostionDataCard({ title, showEtat = true, data, inspectionsStatutData, inspectionsEtatData }) {
  const circle = (item, title) => {
    return (
      <div>
        <div
          style={{
            width: 'auto',
            height: 'auto',
            padding: '0.2rem',
            paddingLeft: '0.4rem',
            paddingRight: '0.4rem',
            color: 'white',
            backgroundColor: item?.couleur,
            borderRadius: 9999
          }}
        >
          {title}
        </div>
      </div>
    );
  };

  return (
    <MainCard title={title}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', columnGap: '1rem', alignItems: 'center', justifyContent: 'space-around' }}>
          {/* <div style={{ display: 'flex', columnGap: '1rem', alignItems: 'center' }}>
            <Typography variant="subtitle1">Etat :</Typography>
            <Typography variant="body2">{circle(currentEtat)}</Typography>
          </div>
          <div style={{ display: 'flex', columnGap: '1rem', alignItems: 'center' }}>
            <Typography variant="subtitle1">Statut :</Typography>
            {data?.etat >= 2 ? <Typography variant="body2">{circle(currentStatus)}</Typography> : 'N/A'}
          </div> */}

          <div style={{ display: 'flex', flexDirection: 'column', columnGap: '1rem' }}>
            <div style={{ display: 'flex', columnGap: '1rem', alignItems: 'center' }}>
              <Typography variant="subtitle1">Date début prévue :</Typography>
              <Typography variant="body2">{data?.date}</Typography>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', columnGap: '1rem' }}>
            <div style={{ display: 'flex', columnGap: '1rem', alignItems: 'center' }}>
              <Typography variant="subtitle1">Date fin prévue :</Typography>
              <Typography variant="body2">{data?.fin}</Typography>
            </div>
          </div>
        </div>
      </div>
      {/* <Grid container spacing={gridSpacing}>
        <Grid item xs={12} sm={6} md={4}></Grid>
      </Grid> */}
    </MainCard>
  );
}
