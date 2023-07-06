import EditIcon from '@mui/icons-material/Edit';
import PropTypes from 'prop-types';

// material-ui
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Tab, Tabs, TextField, Typography } from '@mui/material';

// project imports
import ContentPasteOffRoundedIcon from '@mui/icons-material/ContentPasteOffRounded';
import ContentPasteRoundedIcon from '@mui/icons-material/ContentPasteRounded';
import { LoadingButton } from '@mui/lab';
import { format } from 'date-fns';
import useAuth from 'hooks/useAuth';
import { useNavigate, useParams } from 'react-router-dom';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import renderArrayMultiline from 'utilities/utilities';
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

function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}
const ConfirmDialog = (props) => {
  const { open, setOpen, formInput, formErrors, setFormInput, handleSubmit } = props;
  const handleChange = (e) => {
    setFormInput({
      ...formInput,
      [e.target.name]: e.target.value
    });
  };
  return (
    <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby="confirm-dialog">
      <div style={{ maxWidth: '37rem', width: '37rem' }}>
        <DialogTitle id="confirm-dialog">Confirmeé</DialogTitle>
        <DialogContent>
          <TextField
            multiline
            rows={4}
            variant="standard"
            fullWidth
            label="commentaire"
            value={formInput?.comment || ''}
            name="comment"
            onChange={handleChange}
            error={!!formErrors?.comment}
            helperText={renderArrayMultiline(formErrors?.comment)}
          />
        </DialogContent>
        <DialogActions>
          <LoadingButton variant="contained" onClick={() => setOpen(false)}>
            Non
          </LoadingButton>
          <LoadingButton variant="contained" onClick={handleSubmit}>
            Oui
          </LoadingButton>
        </DialogActions>
      </div>
    </Dialog>
  );
};
