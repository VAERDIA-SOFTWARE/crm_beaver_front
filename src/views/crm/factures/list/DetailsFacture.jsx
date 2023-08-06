import React, { useEffect, useState } from 'react';
// material-ui
import { Autocomplete, Divider, Grid, Stack, TextField } from '@mui/material';
// project imports
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import InputLabel from 'ui-component/extended/Form/InputLabel';
// third-party
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetFacture, useGetHeaderTotal } from 'services/facture.service';
import LogoText from 'ui-component/LogoText';
import TotalCard from './CreateFacture/TotalCard';

function DetailsFacture({ facture }) {
  const { commandeId, factureId } = useParams();

  const [productsData, setProductsData] = useState([]);

  const getFactureQuery = useGetFacture(factureId);

  const [dateFacture, setDateFacture] = React.useState(new Date());

  const navigate = useNavigate();

  const [allAmounts, setAllAmounts] = useState({
    subTotal: 0,
    appliedTaxValue: 0.1,
    appliedDiscountValue: 0.05,
    taxesAmount: 0,
    discountAmount: 0,
    totalAmount: 0
  });

  const useGetFactureTotalQuery = useGetHeaderTotal(productsData);
  // for calculating cost of all orders
  const getTotalAmounts = () => {
    const amounts = {
      subTotal: 0,
      appliedTaxValue: 0.1,
      appliedDiscountValue: 0.05,
      taxesAmount: 0,
      discountAmount: 0,
      totalAmount: 0
    };
    productsData.forEach((item) => {
      amounts.subTotal += item.total;
    });
    amounts.taxesAmount = amounts.subTotal * amounts.appliedTaxValue;
    amounts.discountAmount = (amounts.subTotal + amounts.taxesAmount) * amounts.appliedDiscountValue;
    amounts.totalAmount = amounts.subTotal + amounts.taxesAmount - amounts.discountAmount;
    setAllAmounts(amounts);
  };

  // calculates costs when order-details change
  useEffect(() => {
    getTotalAmounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productsData]);

  return (
    <>
      <MainCard
        title="Details Facture"
        secondary={
          <div>
            <img
              src={LogoText()}
              alt="Maison Beaver"
              height="40"
              style={{
                objectFit: 'contain'
              }}
            />
          </div>
        }
      >
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={4}>
            <Stack>
              <InputLabel>Référence Commande</InputLabel>
              <TextField disabled fullWidth value={facture?.reference || getFactureQuery.data?.d_lot_chantier_id} />
            </Stack>
          </Grid>

          <TotalCard productsData={productsData} allAmounts={allAmounts} useGetFactureTotalQuery={useGetFactureTotalQuery} />

          {false && (
            <Grid item xs={12}>
              <Stack>
                <InputLabel required>Terms and Condition:</InputLabel>
                <TextField
                  fullWidth
                  id="customerAddress"
                  name="customerAddress"
                  defaultValue="I acknowledge terms and conditions."
                  multiline
                  placeholder="Enter Address"
                />
              </Stack>
            </Grid>
          )}
          {false && (
            <Grid item xs={12}>
              <Divider />
            </Grid>
          )}
        </Grid>
      </MainCard>
    </>
  );
}

export default DetailsFacture;

// function AjoutArticle({ setAddItemClicked, handleAddItem, productsData, localCommandesArticlesData, deleteProductHandler, readOnly }) {
//   const [isModalOpen, setisModalOpen] = useState(false);
//   const [isSelectModalOpen, setisSelectModalOpen] = useState(false);

//   return (
//     <div>
//       <div
//         style={{
//           display: 'flex',
//           gap: 8,
//           alignItems: 'center'
//         }}
//       >
//         <Button
//           variant="text"
//           onClick={() => {
//             // setAddItemClicked(true);
//             setisModalOpen(true);
//           }}
//         >
//           + Ajouter Article
//         </Button>
//         {/* <Dialog maxWidth="md" fullWidth onClose={() => setisModalOpen(false)} open={isModalOpen} sx={{ '& .MuiDialog-paper': { p: 0 } }}>
//           <EditArticleForm setisModalOpen={setisModalOpen} handleAddItem={handleAddItem} readOnly={readOnly} />
//         </Dialog> */}

//         <Button
//           variant="text"
//           startIcon={<ChecklistRoundedIcon />}
//           onClick={() => {
//             // setAddItemClicked(true);
//             setisSelectModalOpen(true);
//           }}
//         >
//           Sélectionner Article
//         </Button>
//         {/* <Dialog
//           maxWidth="md"
//           fullWidth
//           onClose={() => setisSelectModalOpen(false)}
//           open={isSelectModalOpen}
//           sx={{ '& .MuiDialog-paper': { p: 0 } }}
//         >
//           <ArticlesQueryList
//             deleteProductHandler={deleteProductHandler}
//             handleAddItem={handleAddItem}
//             setisSelectModalOpen={setisSelectModalOpen}
//             localCommandesArticlesData={localCommandesArticlesData}
//             productsData={productsData}
//           />
//         </Dialog> */}
//       </div>
//     </div>
//   );
// }
