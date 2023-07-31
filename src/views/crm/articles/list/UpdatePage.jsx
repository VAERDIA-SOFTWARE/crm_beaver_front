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

const UserUpdatePage = () => {
  const { articleId } = useParams();
  const navigate = useNavigate();

  const toggleArticleStatusMutation = useToggleArticleStatus(articleId);
  const deleteArticle = useDeleteArticle(articleId);
  const updateArticle = useUpdateArticle(articleId);
  const getArticleQuery = useGetArticle(articleId);
  const articleData = getArticleQuery.data;
  const unitiesQuery = useGetUnites({});
  const unitiesData = unitiesQuery?.data;
  const categoriesQuery = useGetCategories({});
  const categoriesData = categoriesQuery?.data;
  const [formErrors, setFormErrors] = useState({});
  const [formInput, setFormInput] = useState({
    nom: '',
    reference: '',
    prix_unitaire: '',
    remise: '',
    unite_id: '',
    parent: '',
    p_category_article_id: ''
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
      title={`Article ${articleData?.reference ? '- ' + articleData?.reference : ''}`}
      backButton
      goBackLink={`/articles/${articleId}/details`}
    >
      {getArticleQuery.isSuccess && (
        <div>
          <form onSubmit={handleSubmit} noValidate>
            <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
              <Grid item xs={12} md={6}>
                <TextField variant="standard" fullWidth label="Référence*" value={formInput?.reference || ''} disabled />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  variant="standard"
                  fullWidth
                  label="Nom*"
                  value={formInput?.nom || ''}
                  name="nom"
                  onChange={handleChange}
                  error={!!formErrors?.data?.nom}
                  helperText={renderArrayMultiline(formErrors?.data?.nom)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  variant="standard"
                  fullWidth
                  required
                  label="Prix Unitaire"
                  value={formInput?.prix_unitaire || ''}
                  name="prix_unitaire"
                  onChange={handleChange}
                  error={!!formErrors?.data?.prix_unitaire}
                  helperText={renderArrayMultiline(formErrors?.data?.prix_unitaire)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  variant="standard"
                  name="remise"
                  onChange={handleChange}
                  fullWidth
                  label="Remise*"
                  value={formInput?.remise || ''}
                  error={!!formErrors?.data?.remise}
                  helperText={renderArrayMultiline(formErrors?.data?.remise)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                {unitiesData ? (
                  <Autocomplete
                    onChange={(event, newValue) => {
                      setFormInput((formData) => {
                        return { ...formData, unite_id: newValue?.id };
                      });
                    }}
                    multiple={false}
                    defaultValue={unitiesData?.find((item) => item?.id === formInput?.unite_id)}
                    options={unitiesData || []}
                    getOptionLabel={(option) => option?.intitule}
                    renderInput={(params) => (
                      <TextField
                        required
                        variant="standard"
                        {...params}
                        label="Unité"
                        error={!!formErrors?.data?.unite_id}
                        helperText={renderArrayMultiline(formErrors?.data?.unite_id)}
                      />
                    )}
                  />
                ) : (
                  <Skeleton variant="rounded" width={'100%'} height={40} />
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                {categoriesData ? (
                  <Autocomplete
                    onChange={(event, newValue) => {
                      setFormInput((formData) => {
                        return { ...formData, p_category_article_id: newValue?.id };
                      });
                    }}
                    multiple={false}
                    defaultValue={categoriesData?.find((item) => item?.id === formInput?.p_category_article_id)}
                    options={categoriesData || []}
                    getOptionLabel={(option) => option?.intitule}
                    renderInput={(params) => (
                      <TextField
                        required
                        variant="standard"
                        {...params}
                        label="Categorie"
                        error={!!formErrors?.data?.p_category_article_id}
                        helperText={renderArrayMultiline(formErrors?.data?.p_category_article_id)}
                      />
                    )}
                  />
                ) : (
                  <Skeleton variant="rounded" width={'100%'} height={40} />
                )}
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
              loading={toggleArticleStatusMutation.isLoading}
              variant="outlined"
              onClick={() =>
                confirm({
                  description: `Êtes-vous sûr de vouloir ${articleData?.active ? 'désactiver' : 'activer'} ${articleData?.nom}.`,
                  title: `Veuillez confirmer ${articleData?.active ? 'la désactivation' : "l'activation"}`
                })
                  .then(() => toggleArticleStatusMutation.mutate())
                  .catch(() => console.log('Deactivation cancelled.'))
              }
            >
              {articleData?.active ? 'Désactiver' : 'Activer'}
            </LoadingButton>

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
                      navigate('/articles/list', {
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
