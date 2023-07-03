import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import * as React from 'react';

// material-ui

import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import {
  Box,
  Button,
  Fab,
  Grid,
  IconButton,
  LinearProgress,
  linearProgressClasses,
  Menu,
  MenuItem,
  Tab,
  Tabs,
  Tooltip,
  Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ContentPasteRoundedIcon from '@mui/icons-material/ContentPasteRounded';
import ContentPasteOffRoundedIcon from '@mui/icons-material/ContentPasteOffRounded';

// project imports
import MainCard from 'ui-component/cards/MainCard';

// assets
import AddIcon from '@mui/icons-material/AddTwoTone';
import { withStyles } from '@mui/styles';
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
import { Link, useNavigate } from 'react-router-dom';
import { useCreateLotChantiersExcel, useDeleteLot, useGetLotChantiers } from 'services/lot-chantiers.service';
import DeleteIcon from '@mui/icons-material/Delete';
import useAuth from 'hooks/useAuth';
import { useGetSettingsPreferences } from 'services/settings.service';
import { useGetCommandes } from '../../../services/commandes.service';

const CommandesList = ({ title, userId, disableTopBar, goBackLink = '/lot-chantier/list', clientId = null }) => {
  const [page, setPage] = React.useState(1);
  const [searchFilter, setSearchFilter] = React.useState('');
  const { logout, user } = useAuth();

  const navigate = useNavigate();
  const [tabValue, setTabValue] = React.useState(3);
  const [validated, setValidated] = React.useState(1);
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
  return (
    <>
      <MainCard
        title={title ?? 'Liste des Devis'}
        content={false}
        secondary={
          false && (
            <Grid item xs={12} sm={12} sx={{ textAlign: 'start' }}>
              <Tooltip title="Importer Commande">
                <Fab
                  color="primary"
                  size="small"
                  onClick={() =>
                    navigate(`/commande/create`, {
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
        // secondary={<SecondaryAction link="https://material-ui.com/components/data-grid/" />}
      >
        <TableDataGrid
          userId={userId}
          validated={validated}
          page={page}
          setPage={setPage}
          searchFilter={searchFilter}
          setSearchFilter={setSearchFilter}
        />
      </MainCard>
    </>
  );
};

export default CommandesList;

function EditCell({ params }) {
  const deleteLotMutation = useDeleteLot();

  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleMenuClick = (event) => {
    setAnchorEl(event?.currentTarget);
  };

  return (
    <div>
      <IconButton
        color="secondary"
        size="large"
        onClick={(e) => {
          navigate(`/commandes/${params?.row?.id}/details`);
        }}
      >
        <VisibilityRoundedIcon sx={{ fontSize: '1.3rem' }} />
      </IconButton>
      {/* {'params?.row?.nombre_chantiers == params?.row?.nb_rapports' && (
        <Button
          color="secondary"
          // size="large"
          // onClick={(e) => {
          //   navigate(`/lot-chantier/${params?.row?.id}/details`);
          // }}
        >
          Transformer
        </Button>
      )} */}
      {false && params?.row?.satisfied_command == 1 && (
        <>
          <IconButton onClick={handleMenuClick} size="large">
            <MoreHorizOutlinedIcon fontSize="small" aria-controls="menu-popular-card-1" aria-haspopup="true" sx={{ color: 'grey.500' }} />
          </IconButton>
          <Menu
            id="menu-popular-card-1"
            anchorEl={anchorEl}
            keepMounted={true}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            variant="selectedMenu"
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: '{{ righ }}t'
            }}
          >
            <MenuItem>
              <Button>Transformer</Button>
            </MenuItem>
          </Menu>
        </>
      )}
    </div>
  );
}

const BorderLinearProgress = withStyles(() => ({
  root: {
    height: 10,
    borderRadius: 5
  },
  bar: {
    borderRadius: 5
  }
}))(LinearProgress);

function TableDataGrid({
  setSearchFilter,
  setPage,
  validated,

  page,
  searchFilter,
  userId,
  paginated
}) {
  const theme = useTheme();
  const getCommandesQuery = useGetCommandes({ searchFilter, page });
  const useGetSettingsPreferencesQuery = useGetSettingsPreferences();
  const navigate = useNavigate();

  const columns = [
    {
      // field: 'state',
      // headerName: 'Etat',
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
                {params?.row?.validated ? (
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
      field: 'intitule_client',
      headerName: 'Intitulé Client',

      sortable: false,
      filterable: false,
      minWidth: 100,
      flex: 1,
      renderCell: (params) => {
        return <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{params?.row?.contrat?.user?.name}</div>;
      }
    },
    {
      field: 'reference',
      headerName: 'Nº Commande',
      minWidth: 100,
      flex: 1,

      sortable: false,
      filterable: false
    },
    {
      field: 'contrat',
      headerName: 'Référence Contrat',

      sortable: false,
      filterable: false,
      minWidth: 100,
      flex: 1,
      // valueGetter: (params) => `${params.row.firstName || ''} ${params.row.lastName || ''}`
      renderCell: (params) => {
        return (
          <Link
            to={`/contrats/${params?.row?.contrat?.id}/details`}
            target="_blank"
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {params?.row?.contrat?.reference}
          </Link>
        );
      }
    },

    {
      field: 'nombre_chantiers',
      headerName: 'Nombre des Contrats',
      sortable: false,
      filterable: false,
      minWidth: 100,
      flex: 1
    },
    {
      field: 'nb_chantiers_inspecte',
      headerName: 'Contrats Valide',
      sortable: false,
      filterable: false,
      minWidth: 100,
      flex: 1
    },
    {
      field: 'nb_rapports',
      headerName: 'Nombre des interventions',
      sortable: false,
      filterable: false,
      minWidth: 100,
      flex: 1
    },
    {
      field: 'created_at',
      headerName: 'Date Creation',

      sortable: false,
      filterable: false,
      minWidth: 100,
      flex: 1
    },
    // {
    //   field: 'inspections_progress',
    //   headerName: 'Inspections restantes',

    //   sortable: false,
    //   filterable: false,
    //   minWidth: 100,
    //   flex: 1,
    //   renderCell: (params) => {
    //     return (
    //       <Grid container spacing={2} alignItems="center" justifyContent="center">
    //         <Grid item xs>
    //           <BorderLinearProgress variant="determinate" color="primary" value={params?.row?.inspections_progress} />
    //         </Grid>
    //         <Grid item>
    //           <Typography variant="h6">{Math.round(params?.row?.inspections_progress)}%</Typography>
    //         </Grid>
    //       </Grid>
    //     );
    //   }
    // },
    // {
    //   field: 'completed_inspections_progress',
    //   headerName: 'Inspections terminées',

    //   sortable: false,
    //   filterable: false,
    //   minWidth: 100,
    //   flex: 1,
    //   renderCell: (params) => {
    //     return (
    //       <Grid container spacing={2} alignItems="center" justifyContent="center">
    //         <Grid item xs>
    //           <BorderLinearProgress
    //             variant="determinate"
    //             color="primary"
    //             value={params?.row?.completed_inspections_progress}
    //             sx={{
    //               backgroundColor: '#bbf7d0',
    //               [`& .${linearProgressClasses.bar}`]: {
    //                 borderRadius: 5,
    //                 backgroundColor: theme.palette.mode === 'light' ? '#4ade80' : '#4ade80'
    //               }
    //             }}
    //           />
    //         </Grid>
    //         <Grid item>
    //           <Typography variant="h6">{Math.round(params?.row?.completed_inspections_progress)}%</Typography>
    //         </Grid>
    //       </Grid>
    //     );
    //   }
    // },

    {
      field: 'action',
      headerName: 'Action',
      sortable: false,
      hideable: false,

      filterable: false,
      // minWidth: 100,
      // flex: 1,
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
        // localeText={{
        //   toolbarDensity: 'Densité',
        //   // toolbarDensityLabel: 'Densité',
        //   toolbarDensityCompact: 'Petite',
        //   toolbarDensityStandard: 'moyenne',
        //   toolbarDensityComfortable: 'Grande',

        //   toolbarExport: 'Exporter',

        //   toolbarColumns: 'Colonnes',

        //   toolbarFilters: 'Filtres',

        //   toolbarExportCSV: 'Télécharger comme CSV',

        //   toolbarExportPrint: 'Imprimer',
        //   filterPanelColumns: 'Colonnes',
        //   filterPanelOperators: 'Operateur',
        //   filterPanelInputLabel: 'Valeur',

        //   noRowsLabel: 'Pas de données',

        //   toolbarQuickFilterLabel: 'Recherche',
        //   toolbarQuickFilterPlaceholder: 'Recherche',

        //   columnsPanelHideAllButton: 'Cacher tout',
        //   columnsPanelShowAllButton: 'Afficher tout',
        //   columnsPanelTextFieldLabel: 'Rechercher la colonne',
        //   columnsPanelTextFieldPlaceholder: 'Titre de la colonne',

        //   checkboxSelectionHeaderName: 'Sélection de la case à cocher',

        //   filterOperatorContains: 'contient'

        //   // footerTotalVisibleRows: (a, b) => 'fgg',
        // }}
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
          Toolbar: () => <CustomToolbar page={page} searchFilter={searchFilter} userId={userId} paginated={paginated} /> || GridToolbar
        }}
        rows={getCommandesQuery.data?.data || []}
        columns={columns}
        pageSize={parseInt(useGetSettingsPreferencesQuery?.data?.default_pagination) || 10}
        rowsPerPageOptions={[parseInt(useGetSettingsPreferencesQuery?.data?.default_pagination) || 10]}
        onPageSizeChange={(e) => console.log(e)}
        checkboxSelection={false}
        disableSelectionOnClick={true}
        rowCount={getCommandesQuery.data?.total || 0}
        loading={getCommandesQuery.isLoading || getCommandesQuery.isFetching}
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

function CustomToolbar({ searchFilter, page, userId, paginated }) {
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
          <Button
            LinkComponent={'a'}
            target="_blank"
            href={`${process.env.REACT_APP_API_URL}commandes/export-excel?${paginated ? `paginated=${paginated}&` : ''}${
              searchFilter ? `search=${searchFilter}&` : ''
            }`}
          >
            Exporter
          </Button>

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
