import PropTypes from 'prop-types';

// material-ui
import AssignmentReturnedIcon from '@mui/icons-material/AssignmentReturned';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import EditIcon from '@mui/icons-material/Edit';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Box, Button, Grid, IconButton, SwipeableDrawer, Tab, Tabs, Tooltip, Typography } from '@mui/material';

// project imports
import { LoadingButton } from '@mui/lab';
import { useState, Fragment, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useGenererInspectionsRapport,
  useGetInspection,
  useGetInspectionFormulaire,
  useValidateInspections
} from 'services/inspections.service';
import { gridSpacing } from 'store/constant';
import EtatStaus from 'ui-component/cards/EtatStatus';
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';
import TechnicienDataCard from '../techniciens/list/TechnicienDataCard';
import FormulaireCard from './FormulaireCard';
import InspectionDataCard from './InspectionDataCard';
import InfoIcon from '@mui/icons-material/Info';
import useAuth from 'hooks/useAuth';

const InspectionDetailsPage = () => {
  const { inspectionId } = useParams();

  const getInspectionFormulaireQuery = useGetInspectionFormulaire({ inspectionId });
  const inspectionFormulaireData = getInspectionFormulaireQuery.data;

  const getInspectionQuery = useGetInspection(inspectionId);
  const inspectionData = getInspectionQuery.data?.inspection;
  const [pdfPath, setPdfPath] = useState(`${process.env.REACT_APP_API_URL}rapports/default`);

  const inspectionsEtatData = getInspectionQuery.data?.etats;
  const inspectionsStatutData = getInspectionQuery.data?.status;
  const { user } = useAuth();
  useEffect(() => {
    setPdfPath(
      inspectionData?.etat !== 3
        ? `${process.env.REACT_APP_API_URL}rapports/default`
        : `${process.env.REACT_APP_API_URL}rapports/${inspectionData?.id}/download-pdf`
    );
  }, [inspectionData]);
  console.log(pdfPath);
  // const [fetchedRapport, setFetchedRapport] = useState(null);

  // useEffect(() => {
  //   async function fetchRapport(params) {
  //     const res = await axiosClient.get(`${process.env.REACT_APP_API_URL}rapports/${inspectionData?.id}/download-pdf`);
  //     return res.data;
  //   }
  //   // Fetch the content using the method of your choice
  //   const fetchedContent = fetchRapport().then((e) => setFetchedRapport(fetchedContent));
  // }, [inspectionData?.id]);

  const navigate = useNavigate();
  const generateInspectionsRapportMutation = useGenererInspectionsRapport();
  const validateInspectionsMutation = useValidateInspections();
  const [togleState, setTogleState] = useState(false);

  const [activeTab, setActiveTab] = useState(0);
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const [activeRapportTab, setActiveRapportTab] = useState(0);
  const handleRapportTabChange = (event, newValue) => {
    setActiveRapportTab(newValue);
  };
  const toggleDrawer = (open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setTogleState(open);
  };

  return (
    <MainCard
      title={`Inspection ${inspectionData?.reference ? '- ' + inspectionData?.reference : ''}`}
      backButton
      goBackLink="/inspections/list"
      secondary={
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5
          }}
        >
          {inspectionData?.etat !== 0 ? (
            <>
              {inspectionData?.etat === 2 && (
                <>
                  {user?.role.includes('admin') && (
                    <LoadingButton
                      loadingPosition="end"
                      endIcon={<AssignmentReturnedIcon />}
                      loading={generateInspectionsRapportMutation.isLoading}
                      onClick={() => generateInspectionsRapportMutation.mutate({ inspectionId })}
                      variant="contained"
                      type="submit"
                    >
                      Générer rapport
                    </LoadingButton>
                  )}

                  {/* <Tooltip title="Générer rapport">
                  <IconButton
                    color="secondary"
                    size="large"
                    onClick={(e) => {
                      generateInspectionsRapportMutation.mutate({ inspectionId: inspectionId });
                    }}
                  >
                    <AssignmentReturnedIcon sx={{ fontSize: '1.3rem' }} />
                  </IconButton>
                </Tooltip> */}
                </>
              )}
              {inspectionData?.etat === 1 && (
                <>
                  {user?.role.includes('admin') && (
                    <LoadingButton
                      loadingPosition="start"
                      startIcon={<AssignmentTurnedInIcon />}
                      loading={validateInspectionsMutation.isLoading}
                      onClick={() => validateInspectionsMutation.mutate({ inspectionId })}
                      variant="contained"
                      type="submit"
                    >
                      Valider Interventions
                    </LoadingButton>
                  )}

                  {/* <Tooltip title="Vérifier inspection">
                  <IconButton
                    color="secondary"
                    size="large"
                    onClick={(e) => {
                      // generateInspectionsRapportMutation.mutate({ inspectionId: inspectionId });
                    }}
                  >
                    <AssignmentTurnedInIcon sx={{ fontSize: '1.3rem' }} />
                  </IconButton>
                </Tooltip> */}
                </>
              )}
              {inspectionData?.etat === 3 && (
                <Tooltip title="Télécharger rapport">
                  <a
                    style={{
                      textDecoration: 'none',
                      color: 'inherit'
                    }}
                    href={`${process.env.REACT_APP_API_URL}rapports/${inspectionData?.id}/download-pdf`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <IconButton color="secondary" size="large" onClick={(e) => {}}>
                      <FileDownloadIcon sx={{ fontSize: '1.3rem' }} />
                    </IconButton>
                    {/* <Button size="small" variant="outlined" startIcon={<DownloadIcon />}>
                Télécharger comme PDF
              </Button> */}
                  </a>
                </Tooltip>
              )}{' '}
            </>
          ) : (
            <>
              {(user?.role.includes('admin') || user?.role.includes('technicien')) && (
                <LoadingButton
                  loadingPosition="end"
                  // endIcon={<AssignmentReturnedIcon />}
                  onClick={(e) => {
                    navigate(`/inspections/${inspectionId}/formulaire`);
                  }}
                  variant="contained"
                  type="subnmit"
                >
                  Remplir formulaire
                </LoadingButton>
              )}
            </>
          )}
          {inspectionData?.etat === 0 && user?.role.includes('admin') && (
            <IconButton
              color="secondary"
              size="large"
              onClick={(e) => {
                navigate(`/inspections/${inspectionId}/update`);
              }}
            >
              <EditIcon sx={{ fontSize: '1.3rem' }} />
            </IconButton>
          )}
        </div>
      }
    >
      <div style={{ display: 'flex', alignContent: 'center', justifyContent: 'space-between' }}>
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
          <Tab to="#" label="Interventions" />
          <Tab to="#" label="Rapport" />
        </Tabs>
        <Fragment key="right">
          <Button
            sx={{
              alignSelf: 'center',
              marginBottom: '24px'
            }}
            onClick={toggleDrawer(true)}
          >
            <InfoIcon />
          </Button>
          <SwipeableDrawer anchor="right" open={togleState} onClose={toggleDrawer(false)} onOpen={toggleDrawer(true)}>
            <EtatStaus inspectionsStatutData={inspectionsStatutData} inspectionsEtatData={inspectionsEtatData} />
          </SwipeableDrawer>
        </Fragment>
      </div>
      <TabPanel value={activeTab} index={0}>
        <Grid container spacing={gridSpacing} rowSpacing={5}>
          <Grid item xs={12}>
            {/* <EtatStaus inspectionsStatutData={inspectionsStatutData} inspectionsEtatData={inspectionsEtatData} /> */}
            <InspectionDataCard
              data={inspectionData}
              inspectionsStatutData={inspectionsStatutData}
              inspectionsEtatData={inspectionsEtatData}
            />
          </Grid>
          {/* <Grid
          container
          item
          md={12}
          spacing={gridSpacing}
          style={{
            width: '100%'
          }}
        >
          <Grid item md={4}>
            <HoverDataCard
              title="Nombre des inspections validées"
              iconPrimary={ArrowUpwardIcon}
              primary={32}
              secondary="6% depuis les 3 derniers mois"
            />
          </Grid>
          <Grid item md={4}>
            <HoverDataCard
              title="Nombre des inspections rapportées"
              iconPrimary={ArrowUpwardIcon}
              primary={28}
              secondary="6% depuis les 3 derniers mois"
            />
          </Grid>
          <Grid item md={4}>
            <HoverDataCard
              title="Nombre des Contrats"
              iconPrimary={ArrowUpwardIcon}
              primary={45}
              secondary="6% depuis les 3 derniers mois"
            />
          </Grid>
        </Grid> */}
          {/* {getChantierQuery.isSuccess && (
            <Grid item xs={12}>
              <ChantierDataCard data={chantierData} showButton />
            </Grid>
          )} */}

          <Grid item xs={12}>
            <TechnicienDataCard data={inspectionData?.technicien} />
          </Grid>
          {/* <Grid item xs={12}>
          <LotChantierDataCard lotChantierData={formInput?.lot_chantier} />
        </Grid>
        <Grid item md={4}>
          <SatisfactionChartCard chartData={chartData.SatisfactionChartCardData} title="Inspections" />
        </Grid>
        */}
        </Grid>
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <Tabs
          value={activeRapportTab}
          indicatorColor="primary"
          onChange={handleRapportTabChange}
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
          <Tab to="#" label="Détails" />
          <Tab to="#" label="Document" />
        </Tabs>
        <TabPanel value={activeRapportTab} index={0}>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12} md={7}>
              {/* <HistoriqueCard title="Historique" data={getChantierHistoriqueQuery?.data} chantierData={chantierData} map /> */}
            </Grid>

            <Grid item xs={12} md={5}>
              <FormulaireCard title="Formulaire" data={inspectionFormulaireData} />
            </Grid>
          </Grid>
        </TabPanel>
        <TabPanel value={activeRapportTab} index={1}>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12} md={12}>
              <SubCard>
                <iframe
                  title="document rapport"
                  // srcDoc={fetchedRapport}
                  src={pdfPath}
                  width="100%"
                  height="900px"
                  style={{
                    borderRadius: 10,
                    borderColor: '#90caf975',
                    boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
                    border: '0px solid'
                  }}
                ></iframe>
              </SubCard>
            </Grid>
          </Grid>
        </TabPanel>
      </TabPanel>

      <div
        style={{
          display: 'flex',
          justifyContent: 'end',
          marginTop: 40
        }}
      >
        <Typography variant="h5">Créé le {inspectionData?.created_at}</Typography>
      </div>
    </MainCard>
  );
};

InspectionDetailsPage.propTypes = {
  open: PropTypes.bool,
  handleCloseDialog: PropTypes.func
};

export default InspectionDetailsPage;

function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}
