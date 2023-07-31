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

import {
  useDeleteArticle,
  useGetArticle,
  useUpdateArticle,
  useToggleArticleStatus,
  useCreateArticleContrat,
  useCreateArticle
} from 'services/articles.service';
import { useGetUnites } from 'services/unite.service';
import { useGetCategories } from 'services/categorie.service';

const ArticleCreatePage = () => {
  const { articleId } = useParams();
  const navigate = useNavigate();

  const createArticleMutation = useCreateArticle();
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
    prix_unitaire: 0,
    remise: 0,
    unite_id: '',
    parent: 1,
    p_category_article_id: ''
  });

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
      await createArticleMutation.mutateAsync(formInput);

      navigate('/articles/list');
    } catch (error) {
      const errorsObject = error?.response?.data;
      setFormErrors(errorsObject);
    }
  };

  return (
    <MainCard
      title={`Ajouter Article`}
      // backButton
      // goBackLink={`/articles/${articleId}/details`}
    >
      <div>
        <form onSubmit={handleSubmit} noValidate>
          <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
            <Grid item xs={12} md={6}>
              <TextField
                variant="standard"
                onChange={handleChange}
                fullWidth
                name="reference"
                label="Référence*"
                value={formInput?.reference || ''}
              />
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
                  // defaultValue={unitiesData?.find((item) => item?.id === formInput?.unite_id)}
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
                  // defaultValue={categoriesData?.find((item) => item?.id === formInput?.p_category_article_id)}
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
                disabled={createArticleMutation.isLoading}
                loadingPosition="start"
                startIcon={<SendIcon />}
                loading={createArticleMutation.isLoading}
                variant="contained"
                type="submit"
              >
                Ajouter
              </LoadingButton>
            </Grid>
          </Grid>
        </form>
      </div>
    </MainCard>
  );
};

ArticleCreatePage.propTypes = {
  open: PropTypes.bool,
  handleCloseDialog: PropTypes.func
};

export default ArticleCreatePage;
