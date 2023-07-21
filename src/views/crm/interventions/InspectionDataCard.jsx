import { Typography } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';

export default function InspectionDataCard({ title, showEtat = true, data, inspectionsStatutData, inspectionsEtatData }) {
  const currentEtat = inspectionsEtatData?.find((e) => data?.etat === e?.etat);
  const currentStatus = inspectionsStatutData?.find((e) => data?.statu === e?.statu);

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
          {showEtat && (
            <div style={{ display: 'flex', flexDirection: 'column', columnGap: '1rem' }}>
              {data?.etat !== 3 && (
                <div style={{ display: 'flex', columnGap: '1rem', alignItems: 'center' }}>
                  <Typography variant="subtitle1">Etat :</Typography>
                  <div
                    style={{
                      display: 'flex',
                      gap: 5,
                      flexWrap: 'wrap',
                      alignItems: 'center'
                    }}
                  >
                    <Typography variant="body2">{circle(currentEtat, data?.etat_inspection?.nom)}</Typography>
                    {/* <Typography variant="body2">{data?.etat_inspection?.nom}</Typography> */}
                  </div>
                </div>
              )}
              {data?.etat === 3 && (
                <div style={{ display: 'flex', columnGap: '1rem', alignItems: 'center' }}>
                  <Typography variant="subtitle1">Statut :</Typography>
                  <div
                    style={{
                      display: 'flex',
                      gap: 5,
                      flexWrap: 'wrap',
                      alignItems: 'center'
                    }}
                  >
                    <Typography variant="body2">{circle(currentStatus, data?.status_inspection?.nom)}</Typography>
                    {/* <Typography variant="body2">{data?.status_inspection?.nom}</Typography> */}
                  </div>
                </div>
              )}
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', columnGap: '1rem' }}>
            <div style={{ display: 'flex', columnGap: '1rem', alignItems: 'center' }}>
              <Typography variant="subtitle1">Date début :</Typography>
              <Typography variant="body2">{data?.debut}</Typography>
            </div>
            <div style={{ display: 'flex', columnGap: '1rem', alignItems: 'center' }}>
              <Typography variant="subtitle1">Date début prévue :</Typography>
              <Typography variant="body2">{data?.date}</Typography>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', columnGap: '1rem' }}>
            <div style={{ display: 'flex', columnGap: '1rem', alignItems: 'center' }}>
              <Typography variant="subtitle1">Date fin :</Typography>
              <Typography variant="body2">{data?.fin}</Typography>
            </div>
            <div style={{ display: 'flex', columnGap: '1rem', alignItems: 'center' }}>
              <Typography variant="subtitle1">Date fin prévue :</Typography>
              <Typography variant="body2">{data?.fin_prevu}</Typography>
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
