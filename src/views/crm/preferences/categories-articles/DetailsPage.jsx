import EditIcon from '@mui/icons-material/Edit';
import PropTypes from 'prop-types';

// material-ui
import { Grid, IconButton, Typography } from '@mui/material';

// project imports
import ContentPasteOffRoundedIcon from '@mui/icons-material/ContentPasteOffRounded';
import ContentPasteRoundedIcon from '@mui/icons-material/ContentPasteRounded';
import { format } from 'date-fns';
import useAuth from 'hooks/useAuth';
import { useNavigate, useParams } from 'react-router-dom';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import CategorieDataCard from './CategorieDataCard';
import { useGetSettingsCategoryArticleById } from 'services/settings.service';

const CategorieDetailsPage = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { categorieId } = useParams();

  const getCategorieQuery = useGetSettingsCategoryArticleById(categorieId);
  const categorieQueryData = getCategorieQuery.data;

  return (
    <MainCard
      title={`Catégorie ${categorieQueryData?.intitule ? '- ' + categorieQueryData?.intitule : ''}`}
      backButton
      goBackLink="/admin/categories-articles"
      secondary={
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5
          }}
        >
          {!user?.role.includes('admin') && categorieQueryData?.validated === -1 && <ContentPasteRoundedIcon sx={{ color: '#ffa500' }} />}
          {categorieQueryData?.validated !== -1 && (
            <div style={{ marginRight: '2rem' }}>
              {categorieQueryData?.validated === 1 && <ContentPasteRoundedIcon sx={{ color: '#16a34a' }} />}
              {categorieQueryData?.validated === 0 && <ContentPasteOffRoundedIcon sx={{ color: '#dc2626' }} />}
            </div>
          )}
          {user?.role.includes('admin') && (
            <IconButton
              color="secondary"
              size="large"
              onClick={(e) => {
                navigate(`/admin/categories-articles/${categorieId}/update`);
              }}
            >
              <EditIcon sx={{ fontSize: '1.3rem' }} />
            </IconButton>
          )}
        </div>
      }
    >
      <div>
        <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
          <Grid item xs={12}>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12} sm={12} md={12}>
                <CategorieDataCard data={categorieQueryData} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <div
          style={{
            display: 'flex',
            justifyContent: 'end',
            marginTop: 40
          }}
        >
          <Typography variant="h5">
            Créé le {categorieQueryData?.created_at && format(new Date(categorieQueryData?.created_at), 'dd/LL/yyyy hh:mm:ss')}
          </Typography>
        </div>
      </div>
    </MainCard>
  );
};

CategorieDetailsPage.propTypes = {
  open: PropTypes.bool,
  handleCloseDialog: PropTypes.func
};

export default CategorieDetailsPage;
