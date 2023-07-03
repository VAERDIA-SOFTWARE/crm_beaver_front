import { v4 as uuidv4 } from 'uuid';

// material-ui
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import RemoveCircleOutlineRoundedIcon from '@mui/icons-material/RemoveCircleOutlineRounded';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import { useEffect, useState } from 'react';
import { gridSpacing } from 'store/constant';
import {
  calculateMontantHT,
  calculateMontantHTNet,
  calculateMontantTTC,
  calculateMontantTVA,
  calculatePrixUnitaireHTNet,
  calculatePrixUnitaireTTC
} from './AddItemForm';

function ArticlesList({
  data,
  deleteProductHandler,
  handleUpdateEvent,
  isSelectMode = false,
  handleAddItem,
  localCommandesArticlesData,
  productsData,
  readOnly
}) {
  return (
    <>
      {data?.length ? (
        <Grid item xs={12}>
          <TableContainer>
            <Table>
              <TableHead
                style={{
                  backgroundColor: '#243b5a'
                }}
              >
                <TableRow>
                  <TableCell sx={{ pl: 3, whiteSpace: 'nowrap', borderTopLeftRadius: 15, color: 'white !important' }}>
                    Benificiaire
                  </TableCell>
                  <TableCell sx={{ pl: 3, whiteSpace: 'nowrap', bborderTopLeftRadius: 15, color: 'white !important' }} align="left">
                    Opération
                  </TableCell>
                  <TableCell sx={{ pl: 3, whiteSpace: 'nowrap', bborderTopLeftRadius: 15, color: 'white !important' }} align="left">
                    Quantité
                  </TableCell>
                  <TableCell sx={{ pl: 3, whiteSpace: 'nowrap', bborderTopLeftRadius: 15, color: 'white !important' }} align="left">
                    Prix Unitaire HT
                  </TableCell>
                  {/* <TableCell align="left">Prix Unitaire HTNet</TableCell> */}
                  {/* <TableCell align="left">Prix Unitaire TTC</TableCell> */}
                  <TableCell sx={{ pl: 3, whiteSpace: 'nowrap', bborderTopLeftRadius: 15, color: 'white !important' }} align="left">
                    Remise
                  </TableCell>
                  <TableCell sx={{ pl: 3, whiteSpace: 'nowrap', bborderTopLeftRadius: 15, color: 'white !important' }} align="left">
                    Montant HTNet
                  </TableCell>
                  <TableCell sx={{ pl: 3, whiteSpace: 'nowrap', bborderTopLeftRadius: 15, color: 'white !important' }} align="left">
                    Montant TTC
                  </TableCell>
                  {/* <TableCell align="left">Montant HT</TableCell> */}
                  {/* <TableCell align="left">Montant TVA</TableCell> */}
                  {/* <TableCell align="left">Taux Tva</TableCell> */}
                  <TableCell
                    sx={{ pl: 3, whiteSpace: 'nowrap', borderTopRightRadius: 15, color: 'white !important', pr: 3 }}
                    align="left"
                  />
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.map((row, index) => (
                  <ArticleRow
                    productsData={productsData}
                    localCommandesArticlesData={localCommandesArticlesData}
                    isSelectMode={isSelectMode}
                    key={row?.id}
                    article={row}
                    deleteProductHandler={deleteProductHandler}
                    handleUpdateEvent={handleUpdateEvent}
                    handleAddItem={handleAddItem}
                    readOnly={readOnly}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      ) : null}
    </>
  );
}

export default ArticlesList;

function ArticleRow({
  article,
  deleteProductHandler,
  handleUpdateEvent,
  isSelectMode,
  handleAddItem,
  localCommandesArticlesData,
  productsData,
  readOnly
}) {
  const [isModalOpen, setisModalOpen] = useState(false);
  const isArticleSelected = productsData?.find((e) => e?.id == article?.id);

  return (
    <TableRow key={article?.benificiaire}>
      <TableCell
        sx={{ pl: 3, minWidth: 200 }}
        style={
          {
            // backgroundColor: !article?.benificiaire ? '#d6d6d6' : 'transparent'
          }
        }
      >
        <Typography align="left" variant="subtitle1">
          {article?.benificiaire == '' ? 'N/A' : article?.benificiaire}
        </Typography>
        {/* <Typography align="left" variant="body2">
        {article?.designation_article}
      </Typography> */}
      </TableCell>
      <TableCell
        align="left"
        style={
          {
            // backgroundColor: !article?.benificiaire ? '#d6d6d6' : 'transparent'
          }
        }
      >
        {article?.designation_article == '' ? 'N/A' : article?.designation_article}
      </TableCell>
      <TableCell align="left">{article?.qte}</TableCell>
      <TableCell align="left">{`${article?.prix_unitaire_HT} ${
        article?.unite?.intitule ? article?.unite?.id != 1 && ('(' + article?.unite?.intitule + ')' ?? '') : ''
      } `}</TableCell>
      {/* <TableCell align="left">{article?.prix_unitaire_HTNet}</TableCell> */}
      {/* <TableCell align="left">{article?.prix_unitaire_TTC}</TableCell> */}
      <TableCell align="left">{article?.remise}</TableCell>
      <TableCell align="left">{article?.montant_HTNet}</TableCell>
      <TableCell align="left">{article?.montant_TTC}</TableCell>
      {/* <TableCell align="left">{article?.montant_HT}</TableCell> */}
      {/* <TableCell align="left">{article?.montant_TVA}</TableCell> */}
      {/* <TableCell align="left">{article?.TauxTva}</TableCell> */}
      <TableCell sx={{ pr: 1 }} align="left">
        <div
          style={{
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {!isSelectMode && (
            <>
              <div>
                <IconButton color="primary" size="small" onClick={() => setisModalOpen(true)}>
                  <VisibilityRoundedIcon fontSize="small" />
                </IconButton>
                <Dialog
                  maxWidth="md"
                  fullWidth
                  onClose={() => setisModalOpen(false)}
                  open={isModalOpen}
                  sx={{ '& .MuiDialog-paper': { p: 0 } }}
                >
                  <EditArticleForm
                    readOnly={readOnly}
                    editMode={true}
                    article={article}
                    setisModalOpen={setisModalOpen}
                    // onCancel={handleModalClose}
                    // handleDelete={handleEventDelete}
                    // handleAddItem={handleAddItem}
                    handleUpdateEvent={handleUpdateEvent}
                  />
                </Dialog>
              </div>
              {!readOnly && (
                <IconButton color="error" size="small" onClick={() => deleteProductHandler(article?.id)}>
                  <DeleteTwoToneIcon fontSize="small" />
                </IconButton>
              )}
            </>
          )}

          {isSelectMode && !isArticleSelected && (
            <IconButton color="primary" size="small" onClick={() => handleAddItem(article)}>
              <AddCircleOutlineRoundedIcon fontSize="small" />
            </IconButton>
          )}

          {isSelectMode && isArticleSelected && (
            <IconButton color="error" size="small" onClick={() => deleteProductHandler(article?.id)}>
              <RemoveCircleOutlineRoundedIcon fontSize="small" />
            </IconButton>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}

export function EditArticleForm({ article, handleAddItem, handleUpdateEvent, setAddItemClicked, setisModalOpen, readOnly }) {
  const isEditMode = !!article;

  const [itemForm, setItemForm] = useState({
    benificiaire: '',
    designation_article: '',
    qte: 1,
    prix_unitaire_HT: 0,
    prix_unitaire_HTNet: 0,
    prix_unitaire_TTC: 0,
    montant_HTNet: 0,
    montant_TTC: 0,
    montant_HT: 0,
    montant_TVA: 0,
    TauxTva: 0,
    remise: 0,
    id: uuidv4()
  });

  useEffect(() => {
    if (article) {
      setItemForm((f) => {
        return {
          ...f,
          ...article
        };
      });
    }

    return () => {};
  }, [article]);

  const errors = {};

  useEffect(() => {
    setItemForm((f) => {
      return {
        ...f,
        prix_unitaire_HTNet: calculatePrixUnitaireHTNet(itemForm?.prix_unitaire_HT, itemForm?.remise),
        prix_unitaire_TTC: calculatePrixUnitaireTTC(itemForm?.prix_unitaire_HT, itemForm?.TauxTva),
        montant_HTNet: calculateMontantHTNet(itemForm?.prix_unitaire_HTNet, itemForm?.qte),
        montant_TTC: calculateMontantTTC(itemForm?.prix_unitaire_TTC, itemForm?.qte),
        montant_HT: calculateMontantHT(itemForm?.prix_unitaire_HT, itemForm?.qte),
        montant_TVA: calculateMontantTVA(itemForm?.montant_TTC, itemForm?.montant_HT)
      };
    });

    return () => {};
  }, [
    itemForm?.TauxTva,
    itemForm?.montant_HT,
    itemForm?.montant_TTC,
    itemForm?.prix_unitaire_HT,
    itemForm?.prix_unitaire_HTNet,
    itemForm?.prix_unitaire_TTC,
    itemForm?.qte,
    itemForm?.remise
  ]);

  const handleChange = (event) => {
    const value = event.target.value;
    let newValue = null;
    setItemForm({ ...itemForm, [event.target.name]: newValue || value });
  };

  const handleOk = (e) => {
    e.preventDefault();
    const data = {
      ...itemForm
      // totalAmount: amount,
      // selectedQuantity
    };

    // handleAddItem(data);

    if (isEditMode) {
      handleUpdateEvent(data);
    } else {
      handleAddItem(data);
    }
    setisModalOpen(false);
  };

  return (
    <>
      {readOnly && <DialogTitle>{'Détails article'}</DialogTitle>}
      {!readOnly && <DialogTitle>{isEditMode ? 'Modifier article' : 'Ajouter article'}</DialogTitle>}

      <Divider />

      <DialogContent sx={{ p: 3 }}>
        <form onSubmit={handleOk} id="Form1">
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12} md={4}>
              <Stack spacing={1}>
                <Typography variant="subtitle1" id="itemQuantity">
                  Benificiaire
                </Typography>
                <TextField
                  inputProps={{
                    form: 'Form1'
                  }}
                  required
                  disabled={readOnly || !article?.chantier_id}
                  fullWidth
                  type="text"
                  name="benificiaire"
                  value={itemForm?.benificiaire}
                  onChange={handleChange}
                  error={Boolean(errors.benificiaire)}
                  helperText={errors.benificiaire}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Stack spacing={1}>
                <Typography variant="subtitle1" id="itemAmount">
                  Désignation
                </Typography>
                <TextField
                  disabled={readOnly}
                  inputProps={{
                    form: 'Form1'
                  }}
                  required
                  fullWidth
                  type="text"
                  name="designation_article"
                  value={itemForm?.designation_article}
                  onChange={handleChange}
                  error={Boolean(errors.designation_article)}
                  helperText={errors.designation_article}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Stack spacing={1}>
                <Typography variant="subtitle1" id="itemAmount">
                  Quantité
                </Typography>
                <TextField
                  disabled={readOnly}
                  inputProps={{
                    form: 'Form1'
                  }}
                  required
                  fullWidth
                  type="number"
                  name="qte"
                  value={itemForm?.qte}
                  onChange={handleChange}
                  error={Boolean(errors.qte)}
                  helperText={errors.qte}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Stack spacing={1}>
                <Typography variant="subtitle1" id="itemAmount">
                  Prix Unitaire HT
                </Typography>
                <TextField
                  disabled={readOnly}
                  inputProps={{
                    form: 'Form1'
                  }}
                  required
                  fullWidth
                  type="number"
                  name="prix_unitaire_HT"
                  value={itemForm?.prix_unitaire_HT}
                  onChange={handleChange}
                  error={Boolean(errors.prix_unitaire_HT)}
                  helperText={errors.prix_unitaire_HT}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Stack spacing={1}>
                <Typography variant="subtitle1" id="itemAmount">
                  Remise (%)
                </Typography>
                <TextField
                  disabled={readOnly}
                  inputProps={{
                    form: 'Form1'
                  }}
                  required
                  fullWidth
                  type="number"
                  name="remise"
                  value={itemForm?.remise}
                  onChange={handleChange}
                  error={Boolean(errors.remise)}
                  helperText={errors.remise}
                />{' '}
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Stack spacing={1}>
                <Typography variant="subtitle1" id="itemAmount">
                  Taux Tva (%)
                </Typography>
                <TextField
                  disabled={readOnly}
                  required
                  inputProps={{
                    form: 'Form1'
                  }}
                  fullWidth
                  type="number"
                  name="TauxTva"
                  value={itemForm?.TauxTva}
                  onChange={handleChange}
                  error={Boolean(errors.TauxTva)}
                  helperText={errors.TauxTva}
                />{' '}
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Stack spacing={1}>
                <Typography variant="subtitle1" id="itemAmount">
                  Prix Unitaire HTNet
                </Typography>
                <TextField
                  inputProps={{
                    form: 'Form1'
                  }}
                  disabled
                  fullWidth
                  type="number"
                  name="prix_unitaire_HTNet"
                  value={itemForm?.prix_unitaire_HTNet}
                  onChange={handleChange}
                  error={Boolean(errors.prix_unitaire_HTNet)}
                  helperText={errors.prix_unitaire_HTNet}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Stack spacing={1}>
                <Typography variant="subtitle1" id="itemAmount">
                  Prix Unitaire TTC
                </Typography>
                <TextField
                  inputProps={{
                    form: 'Form1'
                  }}
                  disabled
                  fullWidth
                  type="number"
                  name="prix_unitaire_TTC"
                  value={itemForm?.prix_unitaire_TTC}
                  onChange={handleChange}
                  error={Boolean(errors.prix_unitaire_TTC)}
                  helperText={errors.prix_unitaire_TTC}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Stack spacing={1}>
                <Typography variant="subtitle1" id="itemAmount">
                  Montant HTNet
                </Typography>
                <TextField
                  inputProps={{
                    form: 'Form1'
                  }}
                  disabled
                  fullWidth
                  type="number"
                  name="montant_HTNet"
                  value={itemForm?.montant_HTNet}
                  onChange={handleChange}
                  error={Boolean(errors.montant_HTNet)}
                  helperText={errors.montant_HTNet}
                />{' '}
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Stack spacing={1}>
                <Typography variant="subtitle1" id="itemAmount">
                  Montant TTC
                </Typography>
                <TextField
                  inputProps={{
                    form: 'Form1'
                  }}
                  disabled
                  fullWidth
                  type="number"
                  name="montant_TTC"
                  value={itemForm?.montant_TTC}
                  onChange={handleChange}
                  error={Boolean(errors.montant_TTC)}
                  helperText={errors.montant_TTC}
                />{' '}
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Stack spacing={1}>
                <Typography variant="subtitle1" id="itemAmount">
                  Montant HT
                </Typography>
                <TextField
                  inputProps={{
                    form: 'Form1'
                  }}
                  disabled
                  fullWidth
                  type="number"
                  name="montant_HT"
                  value={itemForm?.montant_HT}
                  onChange={handleChange}
                  error={Boolean(errors.montant_HT)}
                  helperText={errors.montant_HT}
                />{' '}
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Stack spacing={1}>
                <Typography variant="subtitle1" id="itemAmount">
                  Montant TVA
                </Typography>
                <TextField
                  inputProps={{
                    form: 'Form1'
                  }}
                  disabled
                  fullWidth
                  type="number"
                  name="montant_TVA"
                  value={itemForm?.montant_TVA}
                  onChange={handleChange}
                  error={Boolean(errors.montant_TVA)}
                  helperText={errors.montant_TVA}
                />{' '}
              </Stack>
            </Grid>

            <Grid item container justifyContent="flex-end">
              <Stack direction="row" spacing={1} alignItems="center">
                <Button color="error" onClick={() => setisModalOpen(false)}>
                  {readOnly ? 'Fermer' : 'Annuler'}
                </Button>
                {!readOnly && (
                  <Button
                    form="Form1"
                    // disabled={!ItemForm?.id || !selectedQuantity || Boolean(errors.quantityError)}
                    variant="contained"
                    size="small"
                    // onClick={handleOk}
                    type="submit"
                  >
                    {isEditMode ? 'Modifier' : 'Ajouter'}
                  </Button>
                )}
              </Stack>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </>
  );
}

export function ArticlesQueryList({ localCommandesArticlesData, handleAddItem, productsData, deleteProductHandler }) {
  return (
    <>
      <DialogTitle>{'Liste des articles existants'}</DialogTitle>

      <Divider />

      <DialogContent sx={{ p: 3 }}>
        {!localCommandesArticlesData?.length && 'Aucun article trouvé'}
        {localCommandesArticlesData && (
          <ArticlesList
            deleteProductHandler={deleteProductHandler}
            localCommandesArticlesData={localCommandesArticlesData}
            isSelectMode
            data={localCommandesArticlesData}
            handleAddItem={handleAddItem}
            productsData={productsData}
          />
        )}
      </DialogContent>
    </>
  );
}
