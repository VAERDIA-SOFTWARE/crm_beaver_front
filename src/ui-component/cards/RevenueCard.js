import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Card, CardContent, Grid, Typography, useMediaQuery } from '@mui/material';

// =============================|| REVENUE CARD ||============================= //

const RevenueCard = ({ primary, secondary, content, iconPrimary, color }) => {
  const theme = useTheme();
  const matchDownXs = useMediaQuery(theme.breakpoints.down('sm'));

  const IconPrimary = iconPrimary;
  const primaryIcon = iconPrimary ? <IconPrimary fontSize="large" /> : null;

  return (
    <Card sx={{ background: color, position: 'relative', color: '#fff' }}>
      <CardContent>
        <Typography
          variant="body2"
          sx={{
            position: 'absolute',
            right: 13,
            top: 14,
            color: '#fff',
            '&> svg': { width: 100, height: 100, opacity: '0.5' },
            [theme.breakpoints.down('sm')]: {
              top: 13,
              '&> svg': { width: 80, height: 80 }
            }
          }}
        >
          {primaryIcon}
        </Typography>
        <div style={{ display: 'flex' }}>
          <Grid container direction={matchDownXs ? 'column' : 'row'} spacing={1}>
            <Grid item xs={12}>
              <Typography variant="h5" color="inherit">
                {primary}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h3" color="inherit">
                {secondary}
              </Typography>
            </Grid>
          </Grid>
        </div>
      </CardContent>
    </Card>
  );
};

RevenueCard.propTypes = {
  primary: PropTypes.string,
  secondary: PropTypes.string,
  content: PropTypes.string,
  iconPrimary: PropTypes.object,
  color: PropTypes.string
};

export default RevenueCard;
