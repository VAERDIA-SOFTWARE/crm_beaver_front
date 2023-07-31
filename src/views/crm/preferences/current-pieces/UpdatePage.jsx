// import { useEffect, useState } from 'react';

// // material-ui
// import SendIcon from '@mui/icons-material/Send';
// import { Grid, TextField } from '@mui/material';

// // project imports
// import { LoadingButton } from '@mui/lab';
// import {
//   useGetSettingsCurrentPiecesDetails,
//   useUpdateSettingsCurrentPiecesDetails,
//   useUpdateSettingsPreferences
// } from 'services/settings.service';
// import { gridSpacing } from 'store/constant';
// import MainCard from 'ui-component/cards/MainCard';
// import renderArrayMultiline from 'utilities/utilities';
// import { useParams } from 'react-router-dom';

// const SettingsCurrentPiecesUpdatePage = () => {
//   const { currentPieceId } = useParams();

//   const [formErrors, setFormErrors] = useState({});
//   const [formInput, setFormInput] = useState({
//     format: ''
//   });

//   const updateSettingsCurrentPiecesMutation = useUpdateSettingsCurrentPiecesDetails();
//   const useGetSettingsCurrentPiecesDetailsQuery = useGetSettingsCurrentPiecesDetails({ id: currentPieceId });
//   const settingsCurrentPiecesDetailsData = useGetSettingsCurrentPiecesDetailsQuery.data;

//   useEffect(() => {
//     if (useGetSettingsCurrentPiecesDetailsQuery.isSuccess) {
//       setFormInput((f) => {
//         return { ...f, ...settingsCurrentPiecesDetailsData };
//       });
//     }
//   }, [settingsCurrentPiecesDetailsData, useGetSettingsCurrentPiecesDetailsQuery.isSuccess]);

//   const handleChange = (e) => {
//     setFormInput({
//       ...formInput,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setFormErrors({});

//     try {
//       await updateSettingsCurrentPiecesMutation.mutateAsync({
//         id: currentPieceId,
//         values: formInput
//       });
//     } catch (error) {
//       const errorsObject = error?.response?.data;
//       setFormErrors(errorsObject);
//     }
//   };

//   return (
//     <MainCard title={`Référence`}>
//       <div>
//         <form onSubmit={handleSubmit} noValidate>
//           <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
//             {/* <Grid item xs={12} md={6}>
//                 <TextField variant="standard" fullWidth label="Référence*" value={formInput?.reference || ''} disabled />
//               </Grid> */}
//             <Grid item xs={12} md={6}>
//               <TextField
//                 variant="standard"
//                 fullWidth
//                 label="Format"
//                 value={formInput?.format ?? ''}
//                 name="name"
//                 onChange={handleChange}
//                 error={!!formErrors?.data?.format}
//                 helperText={renderArrayMultiline(formErrors?.data?.format)}
//               />
//             </Grid>

//             <Grid item sx={{ display: 'flex', justifyContent: 'flex-end' }} xs={12}>
//               <LoadingButton
//                 loadingPosition="end"
//                 endIcon={<SendIcon />}
//                 loading={updateSettingsCurrentPiecesMutation.isLoading}
//                 variant="contained"
//                 type="submit"
//               >
//                 Sauvegarder
//               </LoadingButton>
//             </Grid>
//           </Grid>
//         </form>
//       </div>
//     </MainCard>
//   );
// };

// export default SettingsCurrentPiecesUpdatePage;
