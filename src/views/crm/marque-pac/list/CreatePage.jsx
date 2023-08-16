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
import { useCreateModeFacturation } from 'services/mode-facturation.service';

const ArticleCreatePage = () => {
  const navigate = useNavigate();

  const createArticleMutation = useCreateModeFacturation();
  const [formErrors, setFormErrors] = useState({});
  const [formInput, setFormInput] = useState({
    intitule: ''
  });

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

      navigate('/settings/mode-facturation');
    } catch (error) {
      const errorsObject = error?.response?.data;
      setFormErrors(errorsObject);
    }
  };

  return (
    <MainCard
      headerColor={true}
      title={`Ajouter Mode Facturation`}
      // backButton
      // goBackLink={`/articles/${articleId}/details`}
    >
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
