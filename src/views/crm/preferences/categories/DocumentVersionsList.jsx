import * as React from 'react';

// material-ui
import AddIcon from '@mui/icons-material/AddTwoTone';
import ContentPasteOffRoundedIcon from '@mui/icons-material/ContentPasteOffRounded';
import ContentPasteRoundedIcon from '@mui/icons-material/ContentPasteRounded';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import { Box, Fab, Grid, IconButton, Tab, Tabs, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project imports
import MainCard from 'ui-component/cards/MainCard';

// assets
import {
  DataGrid,
  frFR,
  GridToolbar,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarQuickFilter
} from '@mui/x-data-grid';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetDocuments, useGetDocumentVersions } from 'services/document.service';
import useAuth from 'hooks/useAuth';
import { useGetSettingsPreferences } from 'services/settings.service';
import { format } from 'date-fns';

const DocumentVersionsList = ({
  documentQueryData,
  documentId,
  userId,
  goBackLink = `/documents/list`,
  disableTopBar,
  clientId = null
}) => {
  const [page, setPage] = React.useState(1);
  const [searchFilter, setSearchFilter] = React.useState('');

  const navigate = useNavigate();

  const { logout, user } = useAuth();
  // const [state, setState] = React.useState(1);
  const [validated, setValidated] = React.useState(-1);
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setPage(1);
    setTabValue(newValue);
    if (newValue === 1) {
      setValidated(-1);
      return;
    }
    if (newValue === 2) {
      setValidated(0);

      return;
    }
    if (newValue === 3) {
      setValidated(1);

      return;
    }
    setValidated(-2);
  };

  React.useEffect(() => {
    if (user?.role.includes('admin')) {
      setTabValue(1);
      setValidated(-1);
    }
    if (user?.role.includes('client')) {
      setTabValue(3);
      setValidated(1);
    }
  }, [user]);

  // console.log(user?.role?.includes('admin'));

  return (
    <>
      <MainCard
        title={`Liste des versions ${documentQueryData?.intitule ? '- ' + documentQueryData?.intitule : ''}`}
        content={false}
        secondary={
          <>
            {/* {user?.role.includes('admin') && (
              <Grid item xs={12} sm={12} sx={{ textAlign: 'start' }}>
                <Tooltip title="Ajouter Document">
                  <Fab
                    color="primary"
                    size="small"
                    onClick={() =>
                      navigate(`/documents/create`, {
                        couleur: '',
                        state: {
                          goBackLink: goBackLink,
                          clientId: clientId
                        }
                      })
                    }
                    sx={{ boxShadow: 'none', ml: 1, width: 32, height: 32, minHeight: 32 }}
                  >
                    <AddIcon fontSize="small" />
                  </Fab>
                </Tooltip>
              </Grid>
            )} */}
          </>
        }
      >
        <TableDataGrid
          documentId={documentId}
          searchFilter={searchFilter}
          validated={validated}
          page={page}
          setPage={setPage}
          setSearchFilter={setSearchFilter}
        />
      </MainCard>
    </>
  );
};

export default DocumentVersionsList;

function EditCell({ params, documentId }) {
  const navigate = useNavigate();

  return (
    <div>
      <IconButton
        color="secondary"
        size="large"
        onClick={(e) => {
          navigate(`/documents/${params?.row?.id}/details`);
        }}
      >
        <VisibilityRoundedIcon sx={{ fontSize: '1.3rem' }} />
      </IconButton>
    </div>
  );
}

function TableDataGrid({ setSearchFilter, searchFilter, setPage, page, documentId }) {
  const theme = useTheme();
  const useGetSettingsPreferencesQuery = useGetSettingsPreferences();
  const getDocumentVersionsQuery = useGetDocumentVersions({ documentId, page, searchFilter });

  const columns = [
    {
      field: 'intitule',
      headerName: 'Intitule',
      sortable: false,
      filterable: false,
      width: 100,
      flex: 1
    },
    // {
    //   field: 'description',
    //   headerName: 'Description',
    //   sortable: false,
    //   filterable: false,
    //   width: 100,
    //   flex: 1
    // },
    {
      field: 'dernier_maj',
      headerName: 'Dernière mise à jour',
      sortable: false,
      filterable: false,
      width: 100,
      flex: 1,
      renderCell: (params) => {
        return <>{format(new Date(params?.row?.updated_at), 'dd/LL/yyyy hh:mm:ss')}</>;
      }
    },
    {
      field: 'version_download',
      headerName: 'Document',
      width: 100,
      flex: 1,
      sortable: false,
      hideable: false,
      filterable: false,
      disableExport: true,
      renderCell: (params) => {
        return (
          <>
            {' '}
            <a
              style={{
                textDecoration: 'none',
                color: 'inherit'
              }}
              href={`${process.env.REACT_APP_API_URL}documents/${params?.row?.d_document_id}/versions/${params?.row?.id}/download-pdf`}
              target="_blank"
              rel="noreferrer"
            >
              <IconButton
                color="secondary"
                size="large"
                // onClick={(e) => {
                //   navigate(`/documents/${params?.row?.id}/details`);
                // }}
              >
                <DownloadIcon sx={{ fontSize: '1.3rem' }} />
              </IconButton>
            </a>
          </>
        );
      }
    }

    // {
    //   field: 'action',
    //   headerName: 'Action',
    //   sortable: false,
    //   hideable: false,
    //   filterable: false,
    //   disableExport: true,
    //   renderCell: (params) => {
    //     return <EditCell params={params} documentId={documentId} />;
    //   }
    // }
  ];

  return (
    <Box
      sx={{
        paddingLeft: 2,
        paddingRight: 2,

        height: 650,
        // width: '100%',
        '& .MuiDataGrid-root': {
          border: 'none',
          '& .MuiDataGrid-cell': {
            borderColor: theme.palette.mode === 'dark' ? theme.palette.text.primary + 15 : 'grey.200'
          },
          '& .MuiDataGrid-columnsContainer': {
            color: theme.palette.mode === 'dark' ? 'grey.600' : 'grey.900',
            borderColor: theme.palette.mode === 'dark' ? theme.palette.text.primary + 15 : 'grey.200'
          },
          '& .MuiDataGrid-columnSeparator': {
            color: theme.palette.mode === 'dark' ? theme.palette.text.primary + 15 : 'grey.200'
          }
        }
      }}
    >
      <DataGrid
        density="compact"
        localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
        componentsProps={{
          columnsPanel: {
            sx: {
              '& .MuiDataGrid-panelFooter button:first-child': {
                display: 'none'
              }
            }
          },
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 300 }
          }
        }}
        components={{
          Toolbar: CustomToolbar || GridToolbar
        }}
        rows={getDocumentVersionsQuery.data?.data || []}
        columns={columns}
        pageSize={parseInt(useGetSettingsPreferencesQuery?.data?.default_pagination) || 10}
        rowsPerPageOptions={[parseInt(useGetSettingsPreferencesQuery?.data?.default_pagination) || 10]}
        onPageSizeChange={(e) => console.log(e)}
        checkboxSelection={false}
        disableSelectionOnClick={true}
        rowCount={getDocumentVersionsQuery.data?.total || 0}
        loading={getDocumentVersionsQuery.isLoading || getDocumentVersionsQuery.isFetching}
        pagination
        paginationMode="server"
        filterMode="server"
        onFilterModelChange={(e) => {
          setSearchFilter(e?.quickFilterValues);
        }}
        onPageChange={(newPage) => setPage(newPage + 1)}
        // onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        initialState={[]}
      />
    </Box>
  );
}

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <div
        style={{
          width: '100%',
          padding: 10,
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 10
        }}
      >
        <GridToolbarQuickFilter />

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {/* <GridToolbarExport /> */}
          {/* <GridToolbarFilterButton /> */}
          <GridToolbarColumnsButton />
          <GridToolbarDensitySelector />
          {/* <div>
            <Button onClick={handleClickOpenDialog}>
              <UploadFileIcon
                fontSize="small"
                sx={{
                  marginRight: '8px'
                }}
              />
              Importer
            </Button>
            <UploadExcel getZonesVillesQuery={getZonesVillesQuery} open={open} handleCloseDialog={handleCloseDialog} />
          </div> */}
        </div>
      </div>
    </GridToolbarContainer>
  );
}
function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}
