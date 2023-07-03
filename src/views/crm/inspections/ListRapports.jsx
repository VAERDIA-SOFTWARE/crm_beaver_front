import * as React from 'react';

// material-ui
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import { Box, Button, IconButton, Menu, MenuItem, SwipeableDrawer, Tab, Tabs } from '@mui/material';
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
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeleteInspection, useGenererInspectionsRapport, useGetInspections, useValidateInspections } from 'services/inspections.service';
import EtatStaus from 'ui-component/cards/EtatStatus';
import InfoIcon from '@mui/icons-material/Info';
import { useGetSettingsPreferences } from 'services/settings.service';
const ListRappot = ({ title, userId = '', overrideData }) => {
  const [page, setPage] = React.useState(1);
  const [searchFilter, setSearchFilter] = React.useState('');
  const [etat, setEtat] = useState(3);

  const getInspectionsQuery = useGetInspections({ searchFilter, userId, page, etat });
  const [togleState, setTogleState] = React.useState(false);
  const inspectionsEtatData = getInspectionsQuery.data?.etats;
  const inspectionsStatutData = getInspectionsQuery.data?.status;

  // const getInspectionsProposesQuery = useGetInspectionsProposes({ searchFilter, userId, page });
  // const inspectionsProposesEtatData = getInspectionsProposesQuery.data?.etats;

  const toggleDrawer = (open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setTogleState(open);
  };
  return (
    <MainCard>
      <div>
        <MainCard title={title ?? 'Liste des rapports'} content={false}>
          <TableDataGrid
            inspectionsStatusData={inspectionsStatutData}
            disableEtat
            inspectionsEtatData={inspectionsEtatData}
            getInspectionsQuery={getInspectionsQuery}
            setPage={setPage}
            setSearchFilter={setSearchFilter}
          />
        </MainCard>
      </div>
    </MainCard>
  );
};

export default ListRappot;

function EditCell({ params }) {
  const deleteInspectionMutation = useDeleteInspection();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleMenuClick = (event) => {
    setAnchorEl(event?.currentTarget);
  };
  const generateInspectionsRapportMutation = useGenererInspectionsRapport();
  const validateInspectionsMutation = useValidateInspections();

  return (
    <div>
      {/* <IconButton
        color="secondary"
        size="large"
        onClick={async (e) => {
          await deleteInspectionMutation.mutateAsync({ inspectionId: params?.row?.id });
        }}
      >
        <DeleteIcon sx={{ fontSize: '1.3rem' }} />
      </IconButton> */}
      <IconButton
        color="secondary"
        size="large"
        onClick={(e) => {
          navigate(`/inspections/${params?.row?.id}/details`);
        }}
      >
        <VisibilityRoundedIcon sx={{ fontSize: '1.3rem' }} />
      </IconButton>
      {params?.row?.etat === 1 && (
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
            <MenuItem
              onClick={(e) => {
                validateInspectionsMutation.mutate({ inspectionId: params?.row?.id });
              }}
            >
              Valider Inspection
            </MenuItem>
          </Menu>
        </>
      )}
      {params?.row?.etat === 2 && (
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
            <MenuItem
              onClick={(e) => {
                generateInspectionsRapportMutation.mutate({ inspectionId: params?.row?.id });
              }}
            >
              Générer rapport
            </MenuItem>
          </Menu>
        </>
      )}
      {params?.row?.etat === 3 && (
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
              <a
                style={{
                  textDecoration: 'none',
                  color: 'inherit'
                }}
                href={`${process.env.REACT_APP_API_URL}rapports/${params.row?.id}/download-pdf`}
                target="_blank"
                rel="noreferrer"
              >
                Voir rapport
              </a>
            </MenuItem>
          </Menu>
        </>
      )}
    </div>
  );
}

function TableDataGrid({
  overrideData,
  setSearchFilter,
  getInspectionsQuery,
  setPage,
  inspectionsEtatData,
  inspectionsStatusData,
  disableStatut,
  disableEtat
}) {
  const useGetSettingsPreferencesQuery = useGetSettingsPreferences();

  const theme = useTheme();
  const inspectionsData = getInspectionsQuery.data?.listInspections;
  let columns = [
    !disableEtat && {
      field: 'etat_detaille',
      headerName: 'Etat',
      sortable: false,
      hideable: true,
      filterable: false,
      renderCell: (params) => {
        const currentEtat = inspectionsEtatData?.find((e) => params?.row?.etat === e?.etat);
        return (
          <div>
            <div style={{ width: 10, height: 10, backgroundColor: currentEtat?.couleur, borderRadius: 9999 }} />
          </div>
        );
      }
    },
    {
      field: 'reference',
      headerName: 'Référence',
      sortable: false,
      hideable: false,
      minWidth: 100,
      flex: 1,
      filterable: false,
      renderCell: (params) => {
        return <div>{params?.row?.reference}</div>;
      }
    },
    !disableStatut && {
      field: 'statut',
      headerName: 'Statut',
      sortable: false,
      filterable: false,
      minWidth: 50,
      flex: 1,
      renderCell: (params) => {
        if (![3].includes(params?.row?.etat)) {
          return 'N/A';
        }

        const currentStatut = inspectionsStatusData?.find((e) => {
          return params?.row?.statut === e?.status;
        });

        return (
          <div>
            <div style={{ width: 10, height: 10, backgroundColor: currentStatut?.couleur, borderRadius: 9999 }} />
          </div>
        );
      }
    },
    {
      field: 'reference_chantier',
      headerName: 'Intitulé Client',
      sortable: false,
      hideable: true,
      minWidth: 100,
      flex: 1,
      filterable: false,
      renderCell: (params) => {
        return <div>{params?.row?.technicien?.name}</div>;
      }
    },
    // {
    //   field: 'chantier_beneficiaire',
    //   headerName: 'Contrat Bénéficiaire',
    //   sortable: false,
    //   hideable: true,
    //   minWidth: 100,
    //   flex: 1,
    //   filterable: false,
    //   renderCell: (params) => {
    //     return <div>{params?.row?.chantier?.nom_benificiaire + params?.row?.chantier?.prenom_benificiary}</div>;
    //   }
    // },
    {
      field: 'operation',
      headerName: 'Opération',
      sortable: false,
      hideable: true,
      minWidth: 100,
      flex: 1,
      filterable: false,
      renderCell: (params) => {
        return <div>{params?.row?.operation?.reference}</div>;
      }
    },
    {
      field: 'addresse',
      headerName: 'Adresse',
      sortable: false,
      filterable: false,
      minWidth: 100,
      flex: 1,
      renderCell: (params) => {
        return <div>{params?.row?.chantier?.code_postal + ' - ' + params?.row?.chantier?.ville}</div>;
      }
    },
    // {
    //   field: 'date_prevu',
    //   headerName: 'Date Prévu',
    //   sortable: false,
    //   filterable: false,
    //   minWidth: 100,
    //   flex: 1,
    //   renderCell: (params) => {
    //     return <div>{params?.row?.date}</div>;
    //   }
    // },
    {
      field: 'date',
      headerName: "Date d'affectation",
      sortable: false,
      filterable: false,
      minWidth: 100,
      flex: 1,
      renderCell: (params) => {
        return <div>{params?.row?.debut}</div>;
      }
    },
    {
      field: 'date_realise',
      headerName: 'Date Réalisé',
      sortable: false,
      filterable: false,
      minWidth: 100,
      flex: 1,
      renderCell: (params) => {
        return <div>{params?.row?.fin}</div>;
      }
    },
    // {
    //   field: 'technicien_name',
    //   headerName: 'Collaborateur',
    //   sortable: false,
    //   hideable: true,
    //   minWidth: 100,
    //   flex: 1,
    //   filterable: false,
    //   renderCell: (params) => {
    //     return <div>{params?.row?.technicien?.name}</div>;
    //   }
    // },
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

  columns = columns.filter((i) => !!i);

  return (
    <Box
      sx={{
        paddingLeft: 1,
        paddingRight: 1,

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
        disableColumnSelector={false}
        components={{
          Toolbar: CustomToolbar || GridToolbar
        }}
        rows={overrideData?.data || inspectionsData?.data || []}
        columns={columns}
        pageSize={parseInt(useGetSettingsPreferencesQuery?.data?.default_pagination) || 10}
        rowsPerPageOptions={[parseInt(useGetSettingsPreferencesQuery?.data?.default_pagination) || 10]}
        onPageSizeChange={(e) => console.log(e)}
        checkboxSelection={false}
        disableSelectionOnClick={true}
        rowCount={overrideData?.total || inspectionsData?.total || 0}
        loading={getInspectionsQuery.isLoading || getInspectionsQuery.isFetching}
        pagination
        filterMode="server"
        onFilterModelChange={(e) => {
          setSearchFilter(e?.quickFilterValues);
        }}
        paginationMode="server"
        onPageChange={(newPage) => setPage(newPage + 1)}
        keepNonExistentRowsSelected
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

// function TabPanel({ children, value, index, ...other }) {
//   return (
//     <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
//       {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
//     </div>
//   );
// }
