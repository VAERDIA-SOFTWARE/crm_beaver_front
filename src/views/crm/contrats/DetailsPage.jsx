import EditIcon from '@mui/icons-material/Edit';
import PropTypes from 'prop-types';

// material-ui
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@mui/material';

// project imports
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useChangeContractState, useGetContrat, useRenewContrat, useValidateContrats } from 'services/contrats.service';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';
import PieChartCard from '../clients/list/charts/PieChartCard';
import ClientDataCard from '../clients/list/ClientDataCard';
import ContractDataCard from './ContractDataCard';
import axiosClient from 'axiosClient';
import useAuth from 'hooks/useAuth';
import { LoadingButton } from '@mui/lab';
import renderArrayMultiline from 'utilities/utilities';
import ContentPasteRoundedIcon from '@mui/icons-material/ContentPasteRounded';
import ContentPasteOffRoundedIcon from '@mui/icons-material/ContentPasteOffRounded';
import { useGetStateByModel } from 'services/state.service';
import Avatar from 'ui-component/avatar';
import IconifyIcon from 'ui-component/icon';
import { useConfirm } from 'material-ui-confirm';
// import { Document, Page, pdfjs } from 'react-pdf/dist/esm/entry.webpack';

const ContratDetailsPage = () => {
  // useEffect(() => {
  //   pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  //   return () => {};
  // }, []);
  const [etat, setEtat] = useState('');
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { contratId } = useParams();
  // const [numPages, setNumPages] = useState(null);
  // const [pageNumber, setPageNumber] = useState(1);

  // function onDocumentLoadSuccess({ numPages }) {
  //   setNumPages(numPages);
  // }
  const getStatusQuery = useGetStateByModel('DContrat');
  const statusData = getStatusQuery?.data;

  const getContratQuery = useGetContrat(contratId);
  const contratData = getContratQuery.data;
  const chantierStatsData = getContratQuery.data?.chantierStatsArray;
  const changeContractStateMutation = useChangeContractState(contratId);
  const renewContractMutation = useRenewContrat(contratId);
  // diloag state

  // const [fetchedRapport, setFetchedRapport] = useState('');

  useEffect(() => {
    if ((statusData, contratData)) {
      const state = statusData?.find((item) => item?.etat === contratData?.state);
      setEtat(state);
    }
  }, [statusData, contratData]);

  const [activeTab, setActiveTab] = useState(0);
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const confirm = useConfirm();

  return (
    <MainCard
      headerColor={true}
      title={`Contrat ${contratData?.reference ? '- ' + contratData?.reference : ''}`}
      backButton
      goBackLink="/contrats/list"
      secondary={
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5
          }}
        >
          {contratData?.state !== 0 && !((contratData?.state === 4 || contratData?.state === 2) && contratData?.has_clone === 0) && (
            <Avatar sx={{ width: 30, height: 30 }} skin="light" color={etat?.couleur} variant="rounded">
              <IconifyIcon icon={etat?.icon} />
            </Avatar>
          )}
          {user?.role.includes('admin') && contratData?.state === 0 && (
            <>
              <LoadingButton
                sx={{
                  backgroundColor: '#07bc0c'
                }}
                loadingPosition="end"
                // endIcon={<AssignmentReturnedIcon />}
                loading={changeContractStateMutation.isLoading}
                onClick={() =>
                  confirm({
                    description: `Êtes-vous sûr de vouloir Valider: ${contratData?.reference}.`,
                    title: `Veuillez confirmer la vadilation`
                  })
                    .then(async () => {
                      try {
                        await changeContractStateMutation.mutateAsync({ state: 1 });
                      } catch (error) {}
                    })
                    .catch(() => console.log('Utilisateur supprimé avec succès.'))
                }
                variant="contained"
              >
                Valider Contrat
              </LoadingButton>
              <LoadingButton
                sx={{
                  backgroundColor: 'rgb(239, 68, 68)'
                }}
                loadingPosition="end"
                // endIcon={<AssignmentReturnedIcon />}
                loading={changeContractStateMutation.isLoading}
                onClick={() =>
                  confirm({
                    description: `Êtes-vous sûr de vouloir annuler: ${contratData?.reference}.`,
                    title: `Veuillez confirmer l'annulation`
                  })
                    .then(async () => {
                      try {
                        await changeContractStateMutation.mutateAsync({ state: 3 });
                      } catch (error) {}
                    })
                    .catch(() => console.log('Utilisateur supprimé avec succès.'))
                }
                variant="contained"
              >
                Annuler Contrat
              </LoadingButton>
            </>
          )}

          {user?.role.includes('admin') && (contratData?.state === 2 || contratData?.state === 4) && (
            <LoadingButton
              sx={{
                backgroundColor: '#07bc0c'
              }}
              loadingPosition="end"
              // endIcon={<AssignmentReturnedIcon />}
              loading={renewContractMutation.isLoading}
              onClick={() =>
                confirm({
                  description: `Êtes-vous sûr de vouloir renouveler: ${contratData?.reference}.`,
                  title: `Veuillez confirmer la renouvellement`
                })
                  .then(async () => {
                    try {
                      const response = await renewContractMutation.mutateAsync();
                      navigate(`/contrats/create`, {
                        state: { contratId: response?.data?.id }
                      });
                    } catch (error) {}
                  })
                  .catch(() => console.log('Utilisateur supprimé avec succès.'))
              }
              variant="contained"
            >
              renouveler Contrat
            </LoadingButton>
          )}
          {user?.role.includes('admin') && contratData?.state === 0 && (
            <IconButton
              color="text"
              size="large"
              onClick={(e) => {
                navigate(`/contrats/create`, {
                  state: { contratId: contratId }
                });
              }}
            >
              <EditIcon sx={{ fontSize: '1.3rem' }} />
            </IconButton>
          )}
        </div>
      }
    >
      <div>
        <Tabs
          value={activeTab}
          indicatorColor="primary"
          onChange={handleTabChange}
          sx={{
            mb: 3,
            minHeight: 'auto',
            '& button': {
              minWidth: 100
            },
            '& a': {
              minHeight: 'auto',
              minWidth: 10,
              py: 1.5,
              px: 1,
              mr: 2.25,
              color: 'grey.600'
            },
            '& a.Mui-selected': {
              color: 'primary.main'
            }
          }}
          variant="scrollable"
        >
          <Tab to="#" label="Contrat" />
          <Tab to="#" label="Document" />
        </Tabs>

        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
            <Grid item xs={12}>
              <Grid container spacing={gridSpacing}>
                <Grid item xs={12} sm={6} md={4}>
                  <ContractDataCard contratData={contratData} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <MainCard
                    title="Opérations"
                    style={{
                      height: 320,
                      overflow: 'auto',
                      minHeight: '100%'
                    }}
                  >
                    <Stack spacing={2}>
                      {/* <Typography variant="h4">Opérations</Typography> */}
                      <Stack spacing={0}>
                        <ul
                          style={{
                            // padding: 0,
                            margin: 0
                          }}
                        >
                          {contratData?.operations_json?.map((e) => (
                            <li>
                              <Stack direction="row" spacing={1}>
                                <Typography variant="subtitle1">Référence :</Typography>
                                <Typography variant="body2">{e}</Typography>
                              </Stack>
                            </li>
                          ))}
                        </ul>
                      </Stack>
                    </Stack>
                  </MainCard>
                </Grid>

                <Grid item sm={6} md={4}>
                  <PieChartCard
                    chartDataa={[
                      { name: 'Proposer', data: 25 },
                      { name: 'Planifié', data: 50 },
                      { name: 'Effectué', data: 75 }
                    ]}
                    title="Interventions"
                  />
                  {/* <SatisfactionChartCard chartData={chartData.SatisfactionChartCardData} title="Inspections" /> */}
                </Grid>
                <Grid item xs={12}>
                  <ClientDataCard clientData={contratData?.user} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          {/* <div>
            <Document file="somefile.pdf" onLoadSuccess={onDocumentLoadSuccess}>
              <Page pageNumber={pageNumber} />
            </Document>
            <p>
              Page {pageNumber} of {numPages}
            </p>
          </div> */}
          <iframe
            style={{
              borderRadius: 10,
              borderColor: '#90caf975',
              boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
              border: '0px solid'
            }}
            title="contrat-pdf"
            // srcDoc={fetchedRapport}
            src={contratData?.pdf_download_link}
            width="100%"
            height="900px"
          ></iframe>
        </TabPanel>

        <div
          style={{
            display: 'flex',
            justifyContent: 'end',
            marginTop: 40
          }}
        >
          <Typography variant="h5">Créé le {contratData?.created_at}</Typography>
        </div>
      </div>
    </MainCard>
  );
};

ContratDetailsPage.propTypes = {
  open: PropTypes.bool,
  handleCloseDialog: PropTypes.func
};

export default ContratDetailsPage;

function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}
const ConfirmDialog = (props) => {
  const { open, setOpen, formInput, formErrors, setFormInput, handleSubmit } = props;
  const handleChange = (e) => {
    setFormInput({
      ...formInput,
      [e.target.name]: e.target.value
    });
  };
  return (
    <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby="confirm-dialog">
      <div style={{ maxWidth: '37rem', width: '37rem' }}>
        <DialogTitle id="confirm-dialog">Confirmeé</DialogTitle>
        <DialogContent>
          <TextField
            multiline
            rows={4}
            variant="standard"
            fullWidth
            label="commentaire"
            value={formInput?.comment || ''}
            name="comment"
            onChange={handleChange}
            error={!!formErrors?.comment}
            helperText={renderArrayMultiline(formErrors?.comment)}
          />
        </DialogContent>
        <DialogActions>
          <LoadingButton variant="contained" onClick={() => setOpen(false)}>
            Non
          </LoadingButton>
          <LoadingButton variant="contained" onClick={handleSubmit}>
            Oui
          </LoadingButton>
        </DialogActions>
      </div>
    </Dialog>
  );
};
