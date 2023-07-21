import EditIcon from '@mui/icons-material/Edit';
import PropTypes from 'prop-types';

// material-ui
import { Grid, IconButton, Typography } from '@mui/material';

// project imports
import { useNavigate, useParams } from 'react-router-dom';

import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import { useGetArticle } from 'services/articles.service';
import DevisDataCard from './DevisDataCard';

const UserDetailsPage = () => {
  const { devisId } = useParams();

  const getUserQuery = useGetArticle(devisId);
  const userData = getUserQuery.data;

  console.log('====================================');
  console.log(userData);
  console.log('====================================');
  const navigate = useNavigate();

  return (
    <MainCard
      title={`Devis ${userData?.reference ? '- ' + userData?.reference : ''}`}
      backButton
      goBackLink="/devis/list"
      secondary={
        <IconButton
          color="secondary"
          size="large"
          onClick={(e) => {
            navigate(`/devis/${devisId}/update`);
          }}
        >
          <EditIcon sx={{ fontSize: '1.3rem' }} />
        </IconButton>
      }
    >
      <div>
        <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
          <Grid item xs={12}>
            <DevisDataCard userData={userData} title="Informations du Devis" />
          </Grid>
        </Grid>
        <div
          style={{
            display: 'flex',
            justifyContent: 'end',
            marginTop: 40
          }}
        >
          <Typography variant="h5">Créé le {userData?.created_at}</Typography>
        </div>
      </div>
    </MainCard>
  );
};

UserDetailsPage.propTypes = {
  open: PropTypes.bool,
  handleCloseDialog: PropTypes.func
};

export default UserDetailsPage;
