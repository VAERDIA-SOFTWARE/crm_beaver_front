import { useEffect, useState } from 'react';

// material-ui
import DeleteIcon from '@mui/icons-material/Delete';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import { Divider, Grid, TextField } from '@mui/material';

// project imports
import { LoadingButton } from '@mui/lab';
import { useConfirm } from 'material-ui-confirm';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import renderArrayMultiline from 'utilities/utilities';
import {
  useGetSettingsCategoryArticleById,
  useUpdateSettingsCategoryArticle,
  useDeleteSettingsCategoryArticle
} from 'services/settings.service';

const CategorieUpdatePage = () => {
  const { categorieId } = useParams();
  const location = useLocation();
  const goBackLink = location.state?.goBackLink;

  const deleteCategorieMutation = useDeleteSettingsCategoryArticle(categorieId);

  const confirm = useConfirm();

  const [formErrors, setFormErrors] = useState({});
  const [formInput, setFormInput] = useState({
    intitule: ''
  });

  const getCategorieQuery = useGetSettingsCategoryArticleById(categorieId);
  const categorieQueryData = getCategorieQuery.data;

  useEffect(() => {
    if (getCategorieQuery.isSuccess) {
      setFormInput((f) => {
        return { ...f, ...categorieQueryData };
      });
    }
  }, [categorieQueryData, getCategorieQuery.isSuccess]);

  const updateCategorieMutation = useUpdateSettingsCategoryArticle(categorieId);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormInput({
      ...formInput,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});
  };

  return (
    <MainCard
      title={`Modifier Catégorie Article ${categorieQueryData?.intitule ? '- ' + categorieQueryData?.intitule : ''}`}
      backButton
      goBackLink={goBackLink}
    >
      {' '}
      <div
        style={{
          maxWidth: 2000,
          marginLeft: 'auto',
          marginRight: 'auto'
        }}
      >
        <form onSubmit={handleSubmit} noValidate>
          <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
            <Grid item xs={12} md={6}>
              <TextField
                variant="standard"
                fullWidth
                label="intitule"
                value={formInput?.intitule || ''}
                name="intitule"
                onChange={handleChange}
                error={!!formErrors?.data?.intitule}
                helperText={renderArrayMultiline(formErrors?.data?.intitule)}
              />
            </Grid>

            <Grid item sx={{ display: 'flex', justifyContent: 'flex-end' }} xs={12}>
              <LoadingButton
                loadingPosition="end"
                endIcon={<NavigateNextRoundedIcon />}
                loading={updateCategorieMutation.isLoading}
                onClick={async () => {
                  await updateCategorieMutation.mutateAsync(formInput);
                  navigate(`/admin/categories-articles/${categorieId}/details`, {
                    replace: true
                  });
                }}
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
            disabled={getCategorieQuery.isLoading}
            loadingPosition="start"
            startIcon={<DeleteIcon />}
            loading={deleteCategorieMutation.isLoading}
            variant="outlined"
            color="error"
            onClick={() =>
              confirm({
                description: `Êtes-vous sûr de vouloir supprimer ${categorieQueryData?.intitule}.`,
                title: `Veuillez confirmer la suppression`
              })
                .then(async () => {
                  try {
                    await deleteCategorieMutation.mutateAsync(categorieId);
                    navigate('/admin/categories-articles', {
                      replace: true
                    });
                  } catch (error) {}
                })
                .catch(() => console.log('Catégorie supprimé avec succès.'))
            }
          >
            {'Supprimer'}
          </LoadingButton>
        </div>
      </div>
    </MainCard>
  );
};

export default CategorieUpdatePage;
