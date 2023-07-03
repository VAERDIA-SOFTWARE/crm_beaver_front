import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';

// assets
import ArrowRightAltRoundedIcon from '@mui/icons-material/ArrowRightAltRounded';
import { textAlign } from '@mui/system';
import Box from '@mui/material/Box';
import { useGetColors } from 'services/users.service';

// ==============================|| BILL CARD ||============================== //

const Colors = () => {
  const theme = useTheme();
  const getColorsQuery = useGetColors();
  const getColorsData = getColorsQuery.data;

  return (
    <Box sx={{ marginTop: '5rem' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 14,
            justifyContent: 'center',
            flexDirection: 'column',

            alignItems: 'center',
            padding: 20,
            paddingTop: 15,
            paddingBottom: 15,
            flexWrap: 'wrap'
          }}
        >
          <div style={{ fontWeight: '500', textOverflow: 'ellipsis' }}>Technicien : </div>
          <div style={{ display: 'flex', columnGap: '1rem', flexDirection: 'column', rowGap: '1rem' }}>
            {getColorsData?.map((e) => (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}
              >
                <div style={{ width: 10, height: 10, backgroundColor: e?.couleur, borderRadius: 9999 }} />
                {e?.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Box>
    // <Card sx={{ borderLeft: '10px solid', borderColor: color, background: bg }}>
  );
};

Colors.propTypes = {
  inspectionsStatutData: PropTypes.array,
  inspectionsEtatData: PropTypes.array
};

export default Colors;
