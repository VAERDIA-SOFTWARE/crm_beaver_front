import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import { Autocomplete, Divider, Grid, Skeleton, TextField } from '@mui/material';

// project imports
import { LoadingButton } from '@mui/lab';
import { useConfirm } from 'material-ui-confirm';
import { useNavigate, useParams } from 'react-router-dom';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import renderArrayMultiline from 'utilities/utilities';

import { useDeleteArticle, useGetArticle, useUpdateArticle, useToggleArticleStatus } from 'services/articles.service';
import { useGetUnites } from 'services/unite.service';
import { useGetCategories } from 'services/categorie.service';
import { useDeleteModeFacturation, useGetModeFacturation, useUpdateModeFacturation } from 'services/mode-facturation.service';

const UserUpdatePage = () => {
  const { modeFacturationId } = useParams();
  const navigate = useNavigate();

  const deleteArticle = useDeleteModeFacturation(modeFacturationId);
  const updateArticle = useUpdateModeFacturation(modeFacturationId);
  const getArticleQuery = useGetModeFacturation(modeFacturationId);
  const articleData = getArticleQuery.data;
  const unitiesQuery = useGetUnites({});
  const unitiesData = unitiesQuery?.data;
  const categoriesQuery = useGetCategories({});
  const categoriesData = categoriesQuery?.data;
  const [formErrors, setFormErrors] = useState({});
  const [formInput, setFormInput] = useState({
    intitule: ''
  });

  const confirm = useConfirm();
  useEffect(() => {
    if (getArticleQuery.isSuccess) {
      setFormInput((f) => {
        return { ...f, ...articleData };
      });
    }
  }, [articleData, getArticleQuery.isSuccess]);
  const handleChange = (e) => {
    setFormInput({
      ...formInput,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});

    try {
      await updateArticle.mutateAsync(formInput);

      // navigate('/leads/list');
    } catch (error) {
      const errorsObject = error?.response?.data;
      setFormErrors(errorsObject);
    }
  };

  return (
    <MainCard
      headerColor={true}
      title={`Mode Facturation ${articleData?.reference ? '- ' + articleData?.reference : ''}`}
      backButton
      goBackLink={`/settings/mode-facturation`}
    >
      {getArticleQuery.isSuccess && (
        <div>
          <form onSubmit={handleSubmit} noValidate>
            <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  variant="standard"
                  fullWidth
                  label="intitule*"
                  value={formInput?.intitule || ''}
                  name="intitule"
                  onChange={handleChange}
                  error={!!formErrors?.data?.intitule}
                  helperText={renderArrayMultiline(formErrors?.data?.intitule)}
                />
              </Grid>

              <Grid item sx={{ display: 'flex', justifyContent: 'flex-end' }} xs={12}>
                <LoadingButton
                  disabled={getArticleQuery.isLoading}
                  loadingPosition="start"
                  startIcon={<SendIcon />}
                  loading={updateArticle.isLoading}
                  variant="contained"
                  type="submit"
                >
                  Modifier
                </LoadingButton>
              </Grid>
            </Grid>
          </form>
          <Divider
            style={{
              margin: 20
            }}
          />
          <div
            style={{
              display: 'flex',
              gap: 10,
              justifyContent: 'start'
            }}
          >
            <LoadingButton
              disabled={getArticleQuery.isLoading}
              loadingPosition="start"
              startIcon={<DeleteIcon />}
              loading={deleteArticle.isLoading}
              variant="outlined"
              color="error"
              onClick={() =>
                confirm({
                  description: `Êtes-vous sûr de vouloir supprimer ${articleData?.nom}.`,
                  title: `Veuillez confirmer la suppression`
                })
                  .then(async () => {
                    try {
                      await deleteArticle.mutateAsync();
                      navigate('/settings/mode-facturation', {
                        replace: true
                      });
                    } catch (error) {}
                  })
                  .catch(() => console.log('Utilisateur supprimé avec succès.'))
              }
            >
              {'Supprimer'}
            </LoadingButton>
          </div>
        </div>
      )}
    </MainCard>
  );
};

UserUpdatePage.propTypes = {
  open: PropTypes.bool,
  handleCloseDialog: PropTypes.func
};

export default UserUpdatePage;
