import PropTypes from 'prop-types';

// material-ui

// assets
import Box from '@mui/material/Box';

// ==============================|| BILL CARD ||============================== //

const EtatStaus = ({ inspectionsStatutData, inspectionsEtatData }) => {
  return (
    <Box sx={{ marginTop: '1rem' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column'
          // alignItems: 'center',
          // justifyContent: 'center'
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 14,
            justifyContent: 'center',
            flexDirection: 'column',

            // alignItems: 'center',
            padding: 20,
            paddingTop: 15,
            paddingBottom: 15,
            flexWrap: 'wrap'
          }}
        >
          <div style={{ fontWeight: '500', textOverflow: 'ellipsis' }}>État</div>
          <div style={{ display: 'flex', columnGap: '1rem', flexDirection: 'column', gap: 5 }}>
            {inspectionsEtatData?.map((e) => (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}
              >
                <div style={{ width: 10, height: 10, backgroundColor: e?.couleur, borderRadius: 9999 }} />
                {e?.nom}
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            // justifyContent: 'center',
            flexDirection: 'column',

            gap: 14,
            // alignItems: 'center',
            padding: 20,
            paddingTop: 15,
            paddingBottom: 15,
            flexWrap: 'wrap'
          }}
        >
          <div style={{ fontWeight: '500', textOverflow: 'ellipsis' }}>Statut</div>
          <div style={{ display: 'flex', columnGap: '1rem', flexDirection: 'column', gap: 5 }}>
            {inspectionsStatutData?.map((e) => (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}
              >
                <div style={{ width: 10, height: 10, backgroundColor: e?.couleur, borderRadius: 9999 }} />
                {e?.nom}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Box>
    // <Card sx={{ borderLeft: '10px solid', borderColor: color, background: bg }}>
  );
};

EtatStaus.propTypes = {
  inspectionsStatutData: PropTypes.array,
  inspectionsEtatData: PropTypes.array
};

export default EtatStaus;
