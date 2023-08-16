import EditIcon from '@mui/icons-material/Edit';
import PropTypes from 'prop-types';

// material-ui
import { Grid, IconButton, Typography } from '@mui/material';

// project imports
import { useNavigate, useParams } from 'react-router-dom';

import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import { useGetArticle } from 'services/articles.service';
import ArticleDataCard from './articleDataCard';

const UserDetailsPage = () => {
  const { articleId } = useParams();

  const getUserQuery = useGetArticle(articleId);
  const userData = getUserQuery.data;

  const navigate = useNavigate();

  return (
    <MainCard
      headerColor={true}
      title={`Article ${userData?.reference ? '- ' + userData?.reference : ''}`}
      backButton
      goBackLink="/articles/list"
      secondary={
        <IconButton
          color="white"
          size="large"
          onClick={(e) => {
            navigate(`/articles/${articleId}/update`);
          }}
        >
          <EditIcon sx={{ fontSize: '1.3rem' }} />
        </IconButton>
      }
    >
      <div>
        <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
          <Grid item xs={12}>
            <ArticleDataCard userData={userData} title="Informations du article" />
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
