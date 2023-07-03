import EditIcon from '@mui/icons-material/Edit';
import PropTypes from 'prop-types';

// material-ui
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Tab, Tabs, TextField, Typography } from '@mui/material';

// project imports
import ContentPasteOffRoundedIcon from '@mui/icons-material/ContentPasteOffRounded';
import ContentPasteRoundedIcon from '@mui/icons-material/ContentPasteRounded';
import { LoadingButton } from '@mui/lab';
import { format } from 'date-fns';
import useAuth from 'hooks/useAuth';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import renderArrayMultiline from 'utilities/utilities';
import CategorieDataCard from './CategorieDataCard';
import DocumentVersionsList from './DocumentVersionsList';
import { useGetCategorie } from 'services/categorie.service';
// import { Document, Page, pdfjs } from 'react-pdf/dist/esm/entry.webpack';

const CategorieDetailsPage = () => {
  // useEffect(() => {
  //   pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  //   return () => {};
  // }, []);

  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { categorieId } = useParams();
  // const [numPages, setNumPages] = useState(null);
  // const [pageNumber, setPageNumber] = useState(1);

  // function onDocumentLoadSuccess({ numPages }) {
  //   setNumPages(numPages);
  // }

  const getCategorieQuery = useGetCategorie(categorieId);
  const categorieQueryData = getCategorieQuery.data;

  const [activeTab, setActiveTab] = useState(0);
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  const circle = (item, title) => {
    return (
      <div>
        <div
          style={{
            width: 'auto',
            height: 'auto',
            padding: '0.2rem',
            paddingLeft: '0.4rem',
            paddingRight: '0.4rem',
            color: 'white',
            backgroundColor: item,
            borderRadius: 9999
          }}
        >
          {title}
        </div>
      </div>
    );
  };
  return (
    <MainCard
      title={`Catégorie ${categorieQueryData?.intitule ? '- ' + categorieQueryData?.intitule : ''}`}
      backButton
      goBackLink="/categories"
      secondary={
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5
          }}
        >
          {user?.role.includes('admin') && categorieQueryData?.validated === -1 && (
            <>
              {/* <LoadingButton
                loadingPosition="end"
                // endIcon={<AssignmentReturnedIcon />}
                loading={validateLotMutation.isLoading}
                onClick={() => validateLotMutation.mutate({ validated: 1 })}
                variant="contained"
                type="submit"
              >
                Valider Document
              </LoadingButton>
              <LoadingButton
                sx={{
                  backgroundColor: 'rgb(239, 68, 68)'
                }}
                loadingPosition="end"
                // endIcon={<AssignmentReturnedIcon />}
                loading={validateLotMutation.isLoading}
                onClick={
                  () => setConfirmOpen(true)
                  // confirm({
                  //   description: `Êtes-vous sûr de vouloir supprimer .`,
                  //   title: `Veuillez confirmer la suppression`
                  // })
                  //   .then(async () => {
                  //     await validateLotMutation.mutate({ validated: 0 });
                  //   })
                  //   .catch(() => console.log('Utilisateur supprimé avec succès.'))
                }
                variant="contained"
                type="submit"
              >
                Non-Valider Document
              </LoadingButton>
              <ConfirmDialog
                setValidated={setValidated}
                setFormInput={setFormInput}
                formInput={formInput}
                formErrors={formErrors}
                handleSubmit={handleSubmit}
                open={confirmOpen}
                setOpen={setConfirmOpen}
              ></ConfirmDialog> */}
            </>
          )}
          {!user?.role.includes('admin') && categorieQueryData?.validated === -1 && <ContentPasteRoundedIcon sx={{ color: '#ffa500' }} />}
          {categorieQueryData?.validated !== -1 && (
            <div style={{ marginRight: '2rem' }}>
              {categorieQueryData?.validated === 1 && <ContentPasteRoundedIcon sx={{ color: '#16a34a' }} />}
              {categorieQueryData?.validated === 0 && <ContentPasteOffRoundedIcon sx={{ color: '#dc2626' }} />}
            </div>
          )}
          {user?.role.includes('admin') && (
            <IconButton
              color="secondary"
              size="large"
              onClick={(e) => {
                navigate(`/admin/categories/${categorieId}/update`);
              }}
            >
              <EditIcon sx={{ fontSize: '1.3rem' }} />
            </IconButton>
          )}
        </div>
      }
    >
      <div>
        {false && (
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
            <Tab to="#" label="Informations" />
            {/* <Tab to="#" label="PDF" /> */}
            <Tab to="#" label="Versions" />
          </Tabs>
        )}

        {/* <TabPanel value={activeTab} index={0}> */}
        <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
          <Grid item xs={12}>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12} sm={12} md={12}>
                <CategorieDataCard data={categorieQueryData} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {/* </TabPanel> */}
        {false && (
          <TabPanel value={activeTab} index={1}>
            <DocumentVersionsList categorieId={categorieId} categorieQueryData={categorieQueryData} />
          </TabPanel>
        )}
        {false && (
          <TabPanel value={activeTab} index={2}>
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
              title="categorie-pdf"
              // srcDoc={fetchedRapport}
              src={`${process.env.REACT_APP_API_URL}categories/${categorieId}/download-pdf`}
              width="100%"
              height="900px"
            ></iframe>
          </TabPanel>
        )}

        <div
          style={{
            display: 'flex',
            justifyContent: 'end',
            marginTop: 40
          }}
        >
          <Typography variant="h5">
            Créé le {categorieQueryData?.created_at && format(new Date(categorieQueryData?.created_at), 'dd/LL/yyyy hh:mm:ss')}
          </Typography>
        </div>
      </div>
    </MainCard>
  );
};

CategorieDetailsPage.propTypes = {
  open: PropTypes.bool,
  handleCloseDialog: PropTypes.func
};

export default CategorieDetailsPage;

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
