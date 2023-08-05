// import SaveIcon from '@mui/icons-material/Save';
// import React, { useEffect, useState } from 'react';

// // material-ui
// import {
//   Autocomplete,
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   Divider,
//   Grid,
//   IconButton,
//   Stack,
//   TextField
// } from '@mui/material';

// // project imports
// import { gridSpacing } from 'store/constant';
// import MainCard from 'ui-component/cards/MainCard';
// import InputLabel from 'ui-component/extended/Form/InputLabel';
// import { v4 as uuidv4 } from 'uuid';
// import AddItemForm from './AddItemForm';

// // third-party
// import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { useLocation, useNavigate, useParams } from 'react-router-dom';
// import { useGetCommandeArticles, useGetCommandes } from 'services/commandes.service';
// import {
//   useCreateFacture,
//   useCreateFactureAvoir,
//   useGetFacture,
//   useGetFactureNextReference,
//   useGetFactureTotal,
//   useUpdateFacture
// } from 'services/facture.service';
// import { useGetLotChantier } from 'services/lot-chantiers.service';
// import LogoText from 'ui-component/LogoText';
// import ArticlesList, { ArticlesQueryList, EditArticleForm } from './ArticlesList';
// import TotalCard from './TotalCard';
// import ChecklistRoundedIcon from '@mui/icons-material/ChecklistRounded';
// import { LoadingButton } from '@mui/lab';
// import { useGetContrat, useGetContrats } from 'services/contrats.service';

// function CreateFacture({ readOnly = false, hideTitle = false }) {
//   const { contractId, factureId } = useParams();

//   const location = useLocation();

//   const isUpdate = location.pathname?.split('/')?.at(-1) === 'update';
//   const isCreateAvoir = location.pathname?.split('/')?.at(-1) === 'generer-avoir';
//   const isCreateNonAvoir = location.pathname?.split('/')?.at(-1) === 'create';
//   const getCommandesQuery = useGetContrats({ paginated: false });

//   const [selectedContractId, setSelectedContractId] = useState(contractId);

//   const [productsData, setProductsData] = useState([]);
//   const [localCommandesArticlesData, setLocalCommandesArticlesData] = useState([]);

//   const getFactureQuery = useGetFacture(factureId);

//   const [dateFacture, setDateFacture] = React.useState(new Date());

//   const getCommandeQuery = useGetContrat(selectedContractId || getFactureQuery.data?.d_contrat_id);

//   const [open, setOpen] = useState(false);
//   const commandeArticlesQuery = useGetCommandeArticles({ contractId: selectedContractId || getFactureQuery.data?.d_lot_chantier_id });

//   const createFactureMutation = useCreateFacture();
//   const createFactureAvoirMutation = useCreateFactureAvoir();
//   const updateFactureMutation = useUpdateFacture();

//   const nextRef = useGetFactureNextReference();

//   const navigate = useNavigate();

//   async function handleSubmit(e) {
//     if (e) {
//       e.preventDefault();
//     }

//     let res = null;

//     if (isUpdate) {
//       res = await updateFactureMutation.mutateAsync({
//         lotChantierId: getFactureQuery.data?.d_lot_chantier_id || selectedContractId,
//         factureId: factureId,
//         body: {
//           // type: getFactureQuery?.data?.type,
//           factureLignes: productsData,
//           date_facture: dateFacture
//         }
//       });
//     } else if (isCreateAvoir) {
//       res = await createFactureAvoirMutation.mutateAsync({
//         lotChantierId: getFactureQuery.data?.d_lot_chantier_id || selectedContractId,
//         factureId: factureId,
//         body: {
//           type: '1',
//           factureLignes: productsData,
//           date_facture: dateFacture
//         }
//       });
//     } else {
//       res = await createFactureMutation.mutateAsync({
//         lotChantierId: getFactureQuery.data?.d_lot_chantier_id || selectedContractId,
//         body: {
//           type: '0',
//           factureLignes: productsData,
//           date_facture: dateFacture
//         }
//       });
//     }
//     navigate(`/factures/${res?.data?.id}`);
//     // setOpen(true);
//   }

//   const [allAmounts, setAllAmounts] = useState({
//     subTotal: 0,
//     appliedTaxValue: 0.1,
//     appliedDiscountValue: 0.05,
//     taxesAmount: 0,
//     discountAmount: 0,
//     totalAmount: 0
//   });

//   useEffect(() => {
//     if (factureId && getFactureQuery.isSuccess) {
//       setProductsData(
//         getFactureQuery.data?.facture_lignes?.map((e) => {
//           return {
//             ...e
//             // id: uuidv4()
//           };
//         })
//       );
//     }

//     return () => {};
//   }, [factureId, getFactureQuery.data?.facture_lignes, getFactureQuery.isSuccess]);

//   useEffect(() => {
//     if (getCommandeQuery.isSuccess) {
//       setLocalCommandesArticlesData(
//         getCommandeQuery?.data?.operations?.map((e) => {
//           return {
//             ...e
//           };
//         })
//       );
//     }

//     return () => {};
//   }, [getCommandeQuery.data, getCommandeQuery.isSuccess]);

//   const useGetFactureTotalQuery = useGetFactureTotal(productsData);

//   const [addItemClicked, setAddItemClicked] = useState(false);

//   // for calculating cost of all orders
//   const getTotalAmounts = () => {
//     const amounts = {
//       subTotal: 0,
//       appliedTaxValue: 0.1,
//       appliedDiscountValue: 0.05,
//       taxesAmount: 0,
//       discountAmount: 0,
//       totalAmount: 0
//     };
//     productsData.forEach((item) => {
//       amounts.subTotal += item.total;
//     });
//     amounts.taxesAmount = amounts.subTotal * amounts.appliedTaxValue;
//     amounts.discountAmount = (amounts.subTotal + amounts.taxesAmount) * amounts.appliedDiscountValue;
//     amounts.totalAmount = amounts.subTotal + amounts.taxesAmount - amounts.discountAmount;
//     setAllAmounts(amounts);
//   };

//   // calculates costs when order-details change
//   useEffect(() => {
//     getTotalAmounts();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [productsData]);

//   // to delete row in order details
//   const deleteProductHandler = (id) => {
//     setProductsData(productsData.filter((item) => item.id != id));
//   };

//   const handleUpdateEvent = (item) => {
//     setProductsData(
//       productsData.map((i) => {
//         if (i.id == item?.id) {
//           return { ...i, ...item };
//         }
//         return i;
//       })
//     );
//   };

//   // Dialog Handler
//   const handleDialogOk = () => {
//     setOpen(false);
//     // formik.resetForm();
//   };

//   // add item handler
//   const handleAddItem = (addingData) => {
//     setProductsData([
//       ...productsData,
//       addingData
//       // {
//       //   id: addingData.id,
//       //   product: addingData.name,
//       //   description: addingData.desc,
//       //   quantity: addingData.selectedQuantity,
//       //   amount: addingData.amount,
//       //   total: addingData.totalAmount
//       // }
//     ]);

//     setAddItemClicked(false);
//   };

//   return (
//     <>
//       <MainCard
//         title={
//           <>
//             {isCreateAvoir && (factureId ? `Générer Facture d'avoir - ${getFactureQuery?.data?.reference ?? ''}` : '')}
//             {isCreateNonAvoir && `Générer Facture`}

//             {readOnly && !hideTitle && (factureId ? `Facture - ${getFactureQuery?.data?.reference ?? ''}` : '')}
//             {isUpdate && !hideTitle && (factureId ? `Modifer Facture - ${getFactureQuery?.data?.reference ?? ''}` : '')}
//           </>
//         }
//         secondary={
//           <div>
//             <img
//               src={LogoText()}
//               alt="Maison Beaver"
//               height="40"
//               style={{
//                 objectFit: 'contain'
//               }}
//             />
//           </div>
//         }
//       >
//         {/* <form onSubmit={handleSubmit} > */}
//         <Grid container spacing={gridSpacing}>
//           <Grid item xs={12} md={4}>
//             <Stack>
//               <InputLabel>Référence Facture</InputLabel>
//               <TextField disabled value={nextRef.data?.prochaine_facture} fullWidth />
//             </Stack>
//           </Grid>
//           <Grid item xs={12}>
//             <Divider />
//           </Grid>

//           {!isUpdate && !isCreateAvoir && readOnly && !contractId && getCommandesQuery?.data && getFactureQuery.data?.d_lot_chantier_id && (
//             <Grid item xs={12} md={4}>
//               <InputLabel>Référence contrat</InputLabel>
//               <Autocomplete
//                 disabled={readOnly}
//                 onChange={(event, newValue) => {
//                   setSelectedContractId(() => {
//                     return newValue?.id;
//                   });
//                 }}
//                 multiple={false}
//                 options={getCommandesQuery?.data || []}
//                 getOptionLabel={(option) => option?.reference + ' - ' + option?.created_at}
//                 defaultValue={getCommandesQuery?.data?.find((e) => e?.id === getFactureQuery.data?.d_lot_chantier_id)}
//                 renderInput={(params) => (
//                   <TextField
//                     // variant="standard"
//                     {...params}
//                     // label="Référence contrat*"
//                     // error={!!formErrors?.data?.user_id}
//                     // helperText={renderArrayMultiline(formErrors?.data?.user_id)}
//                   />
//                 )}
//               />
//             </Grid>
//           )}

//           {!isUpdate && !isCreateAvoir && !readOnly && !contractId && getCommandesQuery?.data && (
//             <Grid item xs={12} md={4}>
//               <InputLabel>Référence contrat</InputLabel>
//               <Autocomplete
//                 disabled={readOnly}
//                 onChange={(event, newValue) => {
//                   setSelectedContractId(() => {
//                     return newValue?.id;
//                   });
//                 }}
//                 multiple={false}
//                 options={getCommandesQuery?.data || []}
//                 getOptionLabel={(option) => option?.reference}
//                 // defaultValue={getCommandesQuery?.data?.find((e) => e?.id == getFactureQuery.data?.d_lot_chantier_id)}
//                 renderInput={(params) => (
//                   <TextField
//                     // variant="standard"
//                     {...params}
//                     // label="Référence contrat*"
//                     // error={!!formErrors?.data?.user_id}
//                     // helperText={renderArrayMultiline(formErrors?.data?.user_id)}
//                   />
//                 )}
//               />
//             </Grid>
//           )}

//           {(isUpdate || contractId) && (
//             <Grid item xs={12} md={4}>
//               <Stack>
//                 <InputLabel>Référence contrat</InputLabel>
//                 <TextField disabled fullWidth value={getCommandeQuery?.data?.reference || getFactureQuery.data?.d_lot_chantier_id} />
//               </Stack>
//             </Grid>
//           )}

//           {isCreateAvoir && (
//             <Grid item xs={12} md={4}>
//               <Stack>
//                 <InputLabel>Référence contrat</InputLabel>
//                 <TextField disabled fullWidth value={getFactureQuery?.data?.d_lot_chantier_id} />
//               </Stack>
//             </Grid>
//           )}

//           <Grid item xs={12} md={4}>
//             <Stack>
//               <InputLabel>Référence Contrat</InputLabel>
//               <TextField disabled fullWidth value={getCommandeQuery?.data?.contrat?.reference} />
//             </Stack>
//           </Grid>
//           <Grid item xs={12} md={4}>
//             <Stack>
//               <InputLabel>Intitulé Client</InputLabel>
//               <TextField disabled fullWidth value={getCommandeQuery?.data?.contrat?.user?.name} />
//             </Stack>
//           </Grid>

//           <Grid item xs={12}>
//             <Divider />
//           </Grid>
//           <Grid item xs={12} md={2}>
//             <Stack>
//               <InputLabel required>Date Facture</InputLabel>
//               <LocalizationProvider dateAdapter={AdapterDateFns}>
//                 <DatePicker
//                   disabled={!!readOnly}
//                   inputFormat="dd/MM/yyyy"
//                   renderInput={(props) => <TextField fullWidth {...props} />}
//                   value={dateFacture}
//                   onChange={(newValue) => {
//                     setDateFacture(newValue);
//                   }}
//                 />
//               </LocalizationProvider>
//             </Stack>
//           </Grid>
//           {/* <Grid item xs={12} md={6}>
//               <Stack>
//                 <InputLabel required>Status</InputLabel>
//                 <Select
//                   id="orderStatus"
//                   name="orderStatus"
//                   defaultValue={formik.values.orderStatus}
//                   value={formik.values.orderStatus}
//                   onChange={formik.handleChange}
//                 >
//                   <MenuItem value="pending">Pending</MenuItem>
//                   <MenuItem value="refund">Refund</MenuItem>
//                   <MenuItem value="paid">Paid</MenuItem>
//                 </Select>
//                 {formik.errors.orderStatus && <FormHelperText error>{formik.errors.orderStatus}</FormHelperText>}
//               </Stack>
//             </Grid> */}
//           <Grid item xs={12}>
//             <Divider />
//           </Grid>

//           {(isUpdate || !factureId) && !addItemClicked ? (
//             <Grid item xs={12}>
//               <div
//                 style={{
//                   display: 'flex',
//                   justifyContent: 'end'
//                 }}
//               >
//                 <AjoutArticle
//                   deleteProductHandler={deleteProductHandler}
//                   setAddItemClicked={setAddItemClicked}
//                   handleAddItem={handleAddItem}
//                   productsData={productsData}
//                   localCommandesArticlesData={localCommandesArticlesData}
//                 />
//               </div>
//             </Grid>
//           ) : null}

//           {productsData && (
//             <ArticlesList
//               data={productsData}
//               deleteProductHandler={deleteProductHandler}
//               handleUpdateEvent={handleUpdateEvent}
//               productsData={productsData}
//               readOnly={readOnly}
//             />
//           )}

//           {false && addItemClicked && (
//             <Grid item xs={12}>
//               <AddItemForm handleAddItem={handleAddItem} setAddItemClicked={setAddItemClicked} />
//             </Grid>
//           )}

//           {(isUpdate || !factureId) && !addItemClicked && productsData?.length ? (
//             <Grid item xs={12}>
//               <div
//                 style={{
//                   display: 'flex',
//                   justifyContent: 'end'
//                 }}
//               >
//                 <AjoutArticle
//                   readOnly={readOnly}
//                   deleteProductHandler={deleteProductHandler}
//                   setAddItemClicked={setAddItemClicked}
//                   handleAddItem={handleAddItem}
//                   productsData={productsData}
//                   localCommandesArticlesData={localCommandesArticlesData}
//                 />
//               </div>
//             </Grid>
//           ) : null}

//           <Grid item xs={12}>
//             <Divider />
//           </Grid>

//           <TotalCard productsData={productsData} allAmounts={allAmounts} useGetFactureTotalQuery={useGetFactureTotalQuery} />

//           {false && (
//             <Grid item xs={12}>
//               <Stack>
//                 <InputLabel required>Terms and Condition:</InputLabel>
//                 <TextField
//                   fullWidth
//                   id="customerAddress"
//                   name="customerAddress"
//                   defaultValue="I acknowledge terms and conditions."
//                   multiline
//                   placeholder="Enter Address"
//                 />
//               </Stack>
//             </Grid>
//           )}
//           {false && (
//             <Grid item xs={12}>
//               <Divider />
//             </Grid>
//           )}
//           {!readOnly && (
//             <Grid item sx={{ display: 'flex', justifyContent: 'flex-end' }} xs={12}>
//               <LoadingButton
//                 variant="contained"
//                 // type="submit"
//                 onClick={handleSubmit}
//                 loadingPosition="start"
//                 startIcon={<SaveIcon />}
//                 loading={createFactureMutation.isLoading || createFactureAvoirMutation.isLoading}
//               >
//                 {isUpdate ? 'Modifier Facture' : ''}
//                 {isCreateNonAvoir ? 'Générer Facture' : ''}

//                 {isCreateAvoir ? "Générer Facture d'avoir" : ''}
//               </LoadingButton>
//             </Grid>
//           )}
//           <Grid item>
//             <Dialog open={open}>
//               <DialogContent>
//                 <DialogContentText sx={{ fontWeight: 500, color: `secondary.dark` }}>Facture créée avec succes</DialogContentText>
//               </DialogContent>
//               <DialogActions sx={{ pr: '20px' }}>
//                 <Button autoFocus variant="contained" onClick={handleDialogOk}>
//                   Ok
//                 </Button>
//               </DialogActions>
//             </Dialog>
//           </Grid>
//         </Grid>
//         {/* </form> */}
//       </MainCard>
//     </>
//   );
// }

// export default CreateFacture;

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
//         <Dialog maxWidth="md" fullWidth onClose={() => setisModalOpen(false)} open={isModalOpen} sx={{ '& .MuiDialog-paper': { p: 0 } }}>
//           <EditArticleForm setisModalOpen={setisModalOpen} handleAddItem={handleAddItem} readOnly={readOnly} />
//         </Dialog>

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
//         <Dialog
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
//         </Dialog>
//       </div>
//     </div>
//   );
// }
