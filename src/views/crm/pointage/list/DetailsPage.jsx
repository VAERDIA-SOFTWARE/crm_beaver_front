import EditIcon from '@mui/icons-material/Edit';
import PropTypes from 'prop-types';

// material-ui
import { Grid, IconButton, Typography } from '@mui/material';

// project imports
import { useNavigate, useParams } from 'react-router-dom';

import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import { useGetArticle } from 'services/articles.service';
import PointageDataCard from './PointageDataCard';

const UserDetailsPage = ({ pointageList }) => {
  console.log(pointageList);
  const { devisId } = useParams();

  const getUserQuery = useGetArticle(devisId);
  const userData = getUserQuery.data;

  return (
    <MainCard
      title={`Pointage du Technicien ${userData?.reference ? '- ' + userData?.reference : ''}`}
      backButton
      goBackLink="/pointage/list"
    >
      <div>
        <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
          <Grid item xs={12}>
            <PointageDataCard userData={userData} title="Historique de Pointage" />
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
