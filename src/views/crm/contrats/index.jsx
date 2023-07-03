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
import { useNavigate } from 'react-router-dom';
import { useGetContrats } from 'services/contrats.service';
import useAuth from 'hooks/useAuth';
import { useGetSettingsPreferences } from 'services/settings.service';
import FormDataTable from './FormDataTable';

// ==============================|| PRODUCT LIST ||============================== //

const ContratsList = ({ goBackLink = `/contrats/list`, disableTopBar, userId = null }) => {
  const [page, setPage] = React.useState(1);
  const [searchFilter, setSearchFilter] = React.useState('');

  const navigate = useNavigate();

  const { logout, user } = useAuth();
  // const [state, setState] = React.useState(1);
  const [validated, setValidated] = React.useState(-2);
  const [tabValue, setTabValue] = React.useState(0);
  const getContratsQuery = useGetContrats({ userId, page, searchFilter, validated });

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
      console.log(userId);
      if (!userId) {
        setTabValue(1);
        setValidated(-1);
      }
    } else if (user?.role.includes('client')) {
      setTabValue(3);
      setValidated(1);
    }
  }, [user, userId]);

  const [tableData, setTableData] = React.useState([]);

React.useEffect(() => {
  const data = localStorage.getItem('myData');
  if (data) {
    setTableData(JSON.parse(data));
  }
}, []);

  return (
    <>
      {disableTopBar ? (
        <MainCard
          title={'Liste des Propositions'}
          content={false}
          secondary={
            user?.role.includes('client') && (
              <Grid item xs={12} sm={12} sx={{ textAlign: 'start' }}>
                <Tooltip title="Ajouter Contrat">
                  <Fab
                    color="primary"
                    size="small"
                    onClick={() =>
                      navigate(`/contrats/create`, {
                        couleur: ''
                        // state: {
                        //   goBackLink: goBackLink,
                        //   clientId: userId
                        // }
                      })
                    }
                    sx={{ boxShadow: 'none', ml: 1, width: 32, height: 32, minHeight: 32 }}
                  >
                    <AddIcon fontSize="small" />
                  </Fab>
                </Tooltip>
              </Grid>
            )
          }
        >
          <TableDataGrid
            data={tableData}
            userId={userId}
            searchFilter={searchFilter}
            validated={validated}
            page={page}
            setPage={setPage}
            setSearchFilter={setSearchFilter}
          />
        </MainCard>
      ) : (
        <>
          <MainCard
            title={'Liste des Contrats'}
            // secondary={<SecondaryAction link="https://material-ui.com/components/data-grid/" />}
          >
            <div style={{ display: 'flex', alignContent: 'center', justifyContent: 'space-between' }}>
              <Tabs
                style={{ display: 'flex' }}
                value={tabValue}
                indicatorColor="primary"
                onChange={handleTabChange}
                sx={{
                  display: 'flex',
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
                aria-label="simple tabs example"
                variant="scrollable"
              >
                <Tab to="#" label="Propositions" />
                {/* {user?.role.includes('admin') ? <Tab to="#" label="Contrats à validées" /> : <Tab to="#" label="Nouveaux contrats" />}
                <Tab to="#" label="Contrats non validées" /> */}
                <Tab to="#" label="Contrats" />
                {/* <Tab to="#" label="Rapport géneré" /> */}
              </Tabs>
            </div>
            <MainCard
              title={'Liste des Contrats'}
              content={false}
              secondary={
                user?.role.includes('admin') && (
                  <Grid item xs={12} sm={12} sx={{ textAlign: 'start' }}>
                    <Tooltip title="Ajouter Contrat">
                      <Fab
                        color="primary"
                        size="small"
                        onClick={() =>
                          navigate(`/contrats/create`, {
                            couleur: '',
                            state: {
                              goBackLink: goBackLink
                            }
                          })
                        }
                        sx={{ boxShadow: 'none', ml: 1, width: 32, height: 32, minHeight: 32 }}
                      >
                        <AddIcon fontSize="small" />
                      </Fab>
                    </Tooltip>
                  </Grid>
                )
              }
            >
              <TabPanel value={tabValue} index={0}>
                <TablePropositionsGrid
                  getContratsQuery={getContratsQuery}
                  userId={userId}
                  searchFilter={searchFilter}
                  validated={validated}
                  page={page}
                  setPage={setPage}
                  setSearchFilter={setSearchFilter}
                />
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <TableContractsGrid
                  getContratsQuery={getContratsQuery}
                  userId={userId}
                  searchFilter={searchFilter}
                  validated={validated}
                  page={page}
                  setPage={setPage}
                  setSearchFilter={setSearchFilter}
                />
              </TabPanel>
              {/* <TabPanel value={tabValue} index={2}>
                <TableDataGrid
                  getContratsQuery={getContratsQuery}
                  userId={userId}
                  searchFilter={searchFilter}
                  validated={validated}
                  page={page}
                  setPage={setPage}
                  setSearchFilter={setSearchFilter}
                />
              </TabPanel> */}
              {/* <TabPanel value={tabValue} index={3}>
                <TableDataGrid
                  getContratsQuery={getContratsQuery}
                  userId={userId}
                  searchFilter={searchFilter}
                  validated={validated}
                  page={page}
                  setPage={setPage}
                  setSearchFilter={setSearchFilter}
                />
              </TabPanel> */}
            </MainCard>
          </MainCard>
        </>
      )}
    </>
  );
};

export default ContratsList;

function EditCell({ params }) {
  const navigate = useNavigate();

  return (
    <div>
      <IconButton
        color="secondary"
        size="large"
        onClick={(e) => {
          navigate(`/contrats/${params?.row?.id}/details`);
        }}
      >
        <VisibilityRoundedIcon sx={{ fontSize: '1.3rem' }} />
      </IconButton>
    </div>
  );
}

function TableDataGrid({ getContratsQuery, setSearchFilter, disableFilters, searchFilter, userId, setPage, page, validated }) {
  const theme = useTheme();
  const useGetSettingsPreferencesQuery = useGetSettingsPreferences();
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

  const columns = [
    {
      field: 'state',
      headerName: 'Etat',
      sortable: false,
      hideable: false,
      filterable: false,
      disableExport: true,
      renderCell: (params) => {
        return (
          <>
            {params?.row?.validated === -1 ? (
              <>
                <ContentPasteRoundedIcon
                  sx={{
                    color: '#ffa500'
                  }}
                />
              </>
            ) : (
              <>
                {params?.row?.state && params?.row?.validated ? (
                  <ContentPasteRoundedIcon
                    sx={{
                      color: '#16a34a'
                    }}
                  />
                ) : (
                  <ContentPasteOffRoundedIcon
                    sx={{
                      color: '#dc2626'
                    }}
                  />
                )}
              </>
            )}
          </>
        );
      }
    },
    {
      field: 'reference',
      headerName: 'Référence',
      sortable: false,
      filterable: false
    },
    {
      field: 'titre',
      headerName: 'Titre',

      sortable: false,
      filterable: false,
      width: 100,
      flex: 1
    },
    { field: 'date_debut', headerName: 'Date Début', sortable: false, filterable: false, minWidth: 100, flex: 1 },
    {
      field: 'date_fin',
      headerName: 'Date Fin',
      sortable: false,
      filterable: false,
      minWidth: 100,
      flex: 1
    },
    {
      field: 'clientName',
      headerName: 'Intitulé client',
      width: 100,
      flex: 1,
      sortable: false,
      hideable: false,
      filterable: false,
      disableExport: true,
      renderCell: (params) => {
        return <>{params?.row?.user?.name}</>;
      }
    },

    {
      field: 'pdf_download_link',
      headerName: 'Contrat',
      sortable: false,
      filterable: false,
      minWidth: 100,
      flex: 1,
      renderCell: (params) => {
        return (
          <a
            style={{
              textDecoration: 'none',
              color: 'inherit'
            }}
            target="_blank"
            href={params?.row?.pdf_download_link}
            rel="noreferrer"
            // download={contratData?.reference}
          >
            <IconButton
              color="secondary"
              size="large"
              onClick={(e) => {
                // handleOpenEditDialog(e);
              }}
            >
              <DownloadIcon sx={{ fontSize: '1.3rem' }} />
            </IconButton>
          </a>

          // <Button>
          //   <a
          //     style={{
          //       textDecoration: 'none',
          //       color: 'inherit'
          //     }}
          //     href={params?.row?.pdf_download_link}
          //   >
          //     Télécharger
          //   </a>
          // </Button>
        );
      }
    },
    {
      field: 'action',
      headerName: 'Action',
      sortable: false,
      hideable: false,
      filterable: false,
      disableExport: true,
      renderCell: (params) => {
        return <EditCell params={params} />;
      }
    }
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
        rows={getContratsQuery?.data?.data || []}
        columns={columns}
        pageSize={parseInt(useGetSettingsPreferencesQuery?.data?.default_pagination) || 10}
        rowsPerPageOptions={[parseInt(useGetSettingsPreferencesQuery?.data?.default_pagination) || 10]}
        onPageSizeChange={(e) => console.log(e)}
        checkboxSelection={false}
        disableSelectionOnClick={true}
        rowCount={getContratsQuery?.data?.total || 0}
        loading={getContratsQuery?.isLoading || getContratsQuery?.isFetching}
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
function TablePropositionsGrid({ getContratsQuery, setSearchFilter, disableFilters, searchFilter, userId, setPage, page, validated }) {
  const theme = useTheme();
  const useGetSettingsPreferencesQuery = useGetSettingsPreferences();
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

  const columns = [
    {
      field: 'state',
      headerName: 'Etat',
      sortable: false,
      hideable: false,
      filterable: false,
      disableExport: true,
      renderCell: (params) => {
        return (
          <>
            {params?.row?.validated === -1 ? (
              <>
                <ContentPasteRoundedIcon
                  sx={{
                    color: '#ffa500'
                  }}
                />
              </>
            ) : (
              <>
                {params?.row?.state && params?.row?.validated ? (
                  <ContentPasteRoundedIcon
                    sx={{
                      color: '#16a34a'
                    }}
                  />
                ) : (
                  <ContentPasteOffRoundedIcon
                    sx={{
                      color: '#dc2626'
                    }}
                  />
                )}
              </>
            )}
          </>
        );
      }
    },
    // {
    //   field: 'reference',
    //   headerName: 'Référence',
    //   sortable: false,
    //   filterable: false
    // },
    {
      field: 'clientName',
      headerName: 'Client / Leads',
      width: 100,
      flex: 1,
      sortable: false,
      hideable: false,
      filterable: false,
      disableExport: true,
      renderCell: (params) => {
        return <>{params?.row?.user?.name}</>;
      }
    },
    {
      field: 'titre',
      headerName: 'Marque PAC',

      sortable: false,
      filterable: false,
      width: 100,
      flex: 1
    },
    {
      field: 'date_mise',
      headerName: 'Date 1er Mise En Place',
      sortable: false,
      filterable: false,
      minWidth: 100,
      flex: 1,
      renderCell: (params) => {
        const newDate = new Date(); // Replace this with your new date

        return (
          <>
            <div>{newDate.toString()}</div>
          </>
        );
      }
    },
    { field: 'date_debut', headerName: 'Date Début', sortable: false, filterable: false, minWidth: 100, flex: 1 },
    {
      field: 'date_fin',
      headerName: 'Date Fin',
      sortable: false,
      filterable: false,
      minWidth: 100,
      flex: 1
    },

    {
      field: 'pdf_download_link',
      headerName: 'Contrat',
      sortable: false,
      filterable: false,
      minWidth: 100,
      flex: 1,
      renderCell: (params) => {
        return (
          <a
            style={{
              textDecoration: 'none',
              color: 'inherit'
            }}
            target="_blank"
            href={params?.row?.pdf_download_link}
            rel="noreferrer"
            // download={contratData?.reference}
          >
            <IconButton
              color="secondary"
              size="large"
              onClick={(e) => {
                // handleOpenEditDialog(e);
              }}
            >
              <DownloadIcon sx={{ fontSize: '1.3rem' }} />
            </IconButton>
          </a>

          // <Button>
          //   <a
          //     style={{
          //       textDecoration: 'none',
          //       color: 'inherit'
          //     }}
          //     href={params?.row?.pdf_download_link}
          //   >
          //     Télécharger
          //   </a>
          // </Button>
        );
      }
    },
    {
      field: 'action',
      headerName: 'Action',
      sortable: false,
      hideable: false,
      filterable: false,
      disableExport: true,
      renderCell: (params) => {
        return <EditCell params={params} />;
      }
    }
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
        rows={getContratsQuery?.data?.data || []}
        columns={columns}
        pageSize={parseInt(useGetSettingsPreferencesQuery?.data?.default_pagination) || 10}
        rowsPerPageOptions={[parseInt(useGetSettingsPreferencesQuery?.data?.default_pagination) || 10]}
        onPageSizeChange={(e) => console.log(e)}
        checkboxSelection={false}
        disableSelectionOnClick={true}
        rowCount={getContratsQuery?.data?.total || 0}
        loading={getContratsQuery?.isLoading || getContratsQuery?.isFetching}
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

function TableContractsGrid({ getContratsQuery, setSearchFilter, disableFilters, searchFilter, userId, setPage, page, validated }) {
  const theme = useTheme();
  const useGetSettingsPreferencesQuery = useGetSettingsPreferences();
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
  const data = localStorage.getItem('formData');

  const formData = JSON.parse(data);

  const columns = [
    {
      field: 'state',
      headerName: 'Etat',
      sortable: false,
      hideable: false,
      filterable: false,
      disableExport: true,
      renderCell: (params) => {
        return (
          <>
            {params?.row?.validated === -1 ? (
              <>
                <ContentPasteRoundedIcon
                  sx={{
                    color: '#ffa500'
                  }}
                />
              </>
            ) : (
              <>
                {params?.row?.state && params?.row?.validated ? (
                  <ContentPasteRoundedIcon
                    sx={{
                      color: '#16a34a'
                    }}
                  />
                ) : (
                  <ContentPasteOffRoundedIcon
                    sx={{
                      color: '#dc2626'
                    }}
                  />
                )}
              </>
            )}
          </>
        );
      }
    },
    {
      field: 'clientName',
      headerName: 'Client / Leads',
      width: 100,
      flex: 1,
      sortable: false,
      hideable: false,
      filterable: false,
      disableExport: true,
      renderCell: (params) => {
        // Use formData.clientLead to access the corresponding value
        const clientLead = formData.clientLead;

        // Render the cell with the clientLead value
        return <div>{clientLead}</div>;
      }
    },
    {
      field: 'titre',
      headerName: 'Marque PAC',

      sortable: false,
      filterable: false,
      width: 100,
      flex: 1,
      renderCell: (params) => {
        // Use formData.marquePac to access the corresponding value
        const marquePac = formData.marquePac;

        // Render the cell with the marquePac value
        return <div>{marquePac}</div>;
      }
    },
    {
      field: 'date_mise',
      headerName: 'Date 1er Mise En Place',
      sortable: false,
      filterable: false,
      minWidth: 100,
      flex: 1,
      renderCell: (params) => {
        // Use formData.firstMiseEnPlaceDate to access the corresponding value
        const firstMiseEnPlaceDate = formData.firstMiseEnPlaceDate;

        // Render the cell with the firstMiseEnPlaceDate value
        return <div>{firstMiseEnPlaceDate}</div>;
      }
    },
    {
      field: 'date_debut',
      headerName: 'Date Début',
      sortable: false,
      filterable: false,
      minWidth: 100,
      flex: 1,
      renderCell: (params) => {
        // Use formData.contratStartDate to access the corresponding value
        const contratStartDate = formData.contratStartDate;

        // Render the cell with the contratStartDate value
        return <div>{contratStartDate}</div>;
      }
    },
    {
      field: 'date_fin',
      headerName: 'Date Fin',
      sortable: false,
      filterable: false,
      minWidth: 100,
      flex: 1,
      renderCell: (params) => {
        // Use formData.contratEndDate to access the corresponding value
        const contratEndDate = formData.contratEndDate;

        // Render the cell with the contratEndDate value
        return <div>{contratEndDate}</div>;
      }
    },

    {
      field: 'pdf_download_link',
      headerName: 'Contrat',
      sortable: false,
      filterable: false,
      minWidth: 100,
      flex: 1,
      renderCell: (params) => {
        // Use formData.duration to access the corresponding value
        const duration = formData.duration;

        // Render the cell with the duration value
        return <div>{duration}</div>;
      }
      // renderCell: (params) => {
      //   return (
      //     <a
      //       style={{
      //         textDecoration: 'none',
      //         color: 'inherit'
      //       }}
      //       target="_blank"
      //       href={params?.row?.pdf_download_link}
      //       rel="noreferrer"
      //       // download={contratData?.reference}
      //     >
      //       <IconButton
      //         color="secondary"
      //         size="large"
      //         onClick={(e) => {
      //           // handleOpenEditDialog(e);
      //         }}
      //       >
      //         <DownloadIcon sx={{ fontSize: '1.3rem' }} />
      //       </IconButton>
      //     </a>

      //     // <Button>
      //     //   <a
      //     //     style={{
      //     //       textDecoration: 'none',
      //     //       color: 'inherit'
      //     //     }}
      //     //     href={params?.row?.pdf_download_link}
      //     //   >
      //     //     Télécharger
      //     //   </a>
      //     // </Button>
      //   );
      // }
    },
    {
      field: 'action',
      headerName: 'Action',
      sortable: false,
      hideable: false,
      filterable: false,
      disableExport: true,
      renderCell: (params) => {
        return <EditCell params={params} />;
      }
    }
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
      <FormDataTable formData={formData} />
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
