import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

// material-ui
import { Button, FormControl, Grid, MenuItem, OutlinedInput, Select, Stack, TextField, Typography } from '@mui/material';

// project imports
import { gridSpacing } from 'store/constant';

function AddItemForm({ handleAddItem, setAddItemClicked }) {
  const [itemForm, setItemForm] = useState({
    benificiaire: '',
    designation_article: '',
    qte: 0,
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
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [amount, setAmount] = useState(0);
  const [errors, setErrors] = useState({
    quantityError: ''
  });

  const itemList = [
    {
      id: 111,
      name: 'Product Name 1',
      amount: 260,
      desc: 'Product Description 1'
    },
    {
      id: 112,
      name: 'Product Name 2',
      amount: 200,
      desc: 'Product Description 2'
    },
    {
      id: 113,
      name: 'Product Name 3',
      amount: 300,
      desc: 'Product Description 3'
    }
  ];

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
    // switch (event.target.name) {
    //   case 'prix_unitaire_HTNet':
    //     newValue = calculatePrixUnitaireHTNet(itemForm?.prix_unitaire_HT, itemForm?.remise);
    //     break;
    //   case 'prix_unitaire_TTC':
    //     newValue = calculatePrixUnitaireTTC(itemForm?.prix_unitaire_HT, itemForm?.TauxTva);
    //     break;
    //   case 'montant_HTNet':
    //     newValue = calculateMontantHTNet(itemForm?.prix_unitaire_HTNet, itemForm?.qte);
    //     break;
    //   case 'montant_TTC':
    //     newValue = calculateMontantTTC(itemForm?.prix_unitaire_TTC, itemForm?.qte);
    //     break;
    //   case 'montant_HT':
    //     newValue = calculateMontantHT(itemForm?.prix_unitaire_HT, itemForm?.qte);
    //     break;
    //   case 'montant_TVA':
    //     newValue = calculateMontantTVA(itemForm?.montant_TTC, itemForm?.montant_HT);
    //     break;

    //   default:
    //     break;
    // }

    setItemForm({ ...itemForm, [event.target.name]: newValue || value });
  };

  const handleOk = () => {
    const data = {
      ...itemForm
      // totalAmount: amount,
      // selectedQuantity
    };

    handleAddItem(data);
  };

  return (
    <>
      <Grid container spacing={gridSpacing}>
        {false && (
          <Grid item xs={12} md={4}>
            <Stack spacing={1}>
              <Typography variant="subtitle1">Product Name</Typography>
              <FormControl>
                <Select
                  fullWidth
                  displayEmpty
                  value={itemForm?.id || ''}
                  onChange={handleChange}
                  input={<OutlinedInput />}
                  renderValue={(selected) => {
                    if (selected.length === 0) {
                      return (
                        <Typography color="textSecondary" sx={{ lineHeight: '1.4375em' }}>
                          Select Product
                        </Typography>
                      );
                    }

                    const selectedData = itemList.filter((item) => item.id === selected)[0];

                    return (
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%' }}>
                        <Typography variant="subtitle1" sx={{ lineHeight: '1.4375em' }}>
                          {selectedData.name}
                        </Typography>
                        <Typography>Rate : {selectedData.amount}</Typography>
                      </Stack>
                    );
                  }}
                  inputProps={{ 'aria-label': 'Without label' }}
                >
                  <MenuItem disabled value="">
                    <Typography color="textSecondary">Select Product</Typography>
                  </MenuItem>
                  {itemList.map((item, i) => (
                    <MenuItem key={i} value={item.id}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%' }}>
                        <Typography variant="subtitle1">{item.name}</Typography>
                        <Typography>Rate : {item.amount}</Typography>
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </Grid>
        )}
        <Grid item xs={12} md={2}>
          <Stack spacing={1}>
            <Typography variant="subtitle1" id="itemQuantity">
              Benificiaire
            </Typography>
            <TextField
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
        <Grid item xs={12} md={2}>
          <Stack spacing={1}>
            <Typography variant="subtitle1" id="itemAmount">
              Opération
            </Typography>
            <TextField
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
        <Grid item xs={12} md={2}>
          <Stack spacing={1}>
            <Typography variant="subtitle1" id="itemAmount">
              Quantité
            </Typography>
            <TextField
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
        <Grid item xs={12} md={2}>
          <Stack spacing={1}>
            <Typography variant="subtitle1" id="itemAmount">
              Prix Unitaire HT
            </Typography>
            <TextField
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
        <Grid item xs={12} md={2}>
          <Stack spacing={1}>
            <Typography variant="subtitle1" id="itemAmount">
              Remise (%)
            </Typography>
            <TextField
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
        <Grid item xs={12} md={2}>
          <Stack spacing={1}>
            <Typography variant="subtitle1" id="itemAmount">
              Prix Unitaire HTNet
            </Typography>
            <TextField
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
        <Grid item xs={12} md={2}>
          <Stack spacing={1}>
            <Typography variant="subtitle1" id="itemAmount">
              Prix Unitaire TTC
            </Typography>
            <TextField
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
        <Grid item xs={12} md={2}>
          <Stack spacing={1}>
            <Typography variant="subtitle1" id="itemAmount">
              Montant HTNet
            </Typography>
            <TextField
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
        <Grid item xs={12} md={2}>
          <Stack spacing={1}>
            <Typography variant="subtitle1" id="itemAmount">
              Montant TTC
            </Typography>
            <TextField
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
        <Grid item xs={12} md={2}>
          <Stack spacing={1}>
            <Typography variant="subtitle1" id="itemAmount">
              Montant HT
            </Typography>
            <TextField
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
        <Grid item xs={12} md={2}>
          <Stack spacing={1}>
            <Typography variant="subtitle1" id="itemAmount">
              Montant TVA
            </Typography>
            <TextField
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
        <Grid item xs={12} md={2}>
          <Stack spacing={1}>
            <Typography variant="subtitle1" id="itemAmount">
              Taux Tva (%)
            </Typography>
            <TextField
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
        <Grid item container justifyContent="flex-end">
          <Stack direction="row" spacing={1} alignItems="center">
            <Button color="error" onClick={() => setAddItemClicked(false)}>
              Annuler
            </Button>
            <Button
              // disabled={!ItemForm?.id || !selectedQuantity || Boolean(errors.quantityError)}
              variant="contained"
              size="small"
              onClick={handleOk}
            >
              Ajouter
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}

export default AddItemForm;

export function calculateMontantTVA(montant_ttc, montantHt) {
  return montant_ttc - montantHt;
}

export function calculateMontantHTNet(prix_unitaire_HTNet, qte) {
  return prix_unitaire_HTNet * qte;
}

export function calculateMontantTTC(prix_unitaire_TTC, qte) {
  return prix_unitaire_TTC * qte;
}

export function calculateMontantHT(prix_unitaire_HT, qte) {
  return prix_unitaire_HT * qte;
}

export function calculatePrixUnitaireTTC(prixU_HT, tva) {
  return prixU_HT + prixU_HT * tva;
}

export function calculatePrixUnitaireHTNet(prixU_HT, remise) {
  return prixU_HT - prixU_HT * (remise / 100);
}
