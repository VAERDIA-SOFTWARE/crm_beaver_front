import * as React from 'react';

// material-ui
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import { Autocomplete, Avatar, Box, Button, IconButton, Menu, MenuItem, SwipeableDrawer, Tab, Tabs, TextField } from '@mui/material';
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
import useAuth from 'hooks/useAuth';
import { useGetSettingsPreferences } from 'services/settings.service';
import { useGetStateByModel } from 'services/state.service';
import IconifyIcon from 'ui-component/icon';

const InspectionsList = ({ title, userId = '', overrideData, disableAdresse, disableEtat, disableAffectationDate }) => {
  const [page, setPage] = React.useState(1);
  const [searchFilter, setSearchFilter] = React.useState('');
  const [etat, setEtat] = useState('');
  const { logout, user } = useAuth();

  const getInspectionsQuery = useGetInspections({ searchFilter, userId, page, etat, paginated: true });
  const inspectionsEtatData = getInspectionsQuery.data?.etats;
  const inspectionsStatutData = getInspectionsQuery.data?.status;
  const inspectionsData = getInspectionsQuery?.data;
  const getStatusQuery = useGetStateByModel('DIntervention');
  const statusData = getStatusQuery?.data;
  // const getInspectionsProposesQuery = useGetInspectionsProposes({ searchFilter, userId, page });
  // const inspectionsProposesEtatData = getInspectionsProposesQuery.data?.etats;

  React.useEffect(() => {
    // if (user?.role.includes('admin')) {
    //   setTabValue(2);
    //   setEtat(1);
    // }
    // if (user?.role.includes('technicien')) {
    //   setTabValue(1);
    //   setEtat(0);
    // }
  }, [user]);

  return (
    <MainCard>
      <MainCard title={title ?? 'Liste des Interventions'} content={false}>
        <TableDataGrid
          disableEtat={disableEtat}
          disableAdresse={disableAdresse}
          disableAffectationDate={disableAffectationDate}
          overrideData={overrideData}
          disableStatut
          inspectionsStatusData={inspectionsStatutData}
          inspectionsEtatData={inspectionsEtatData}
          getInspectionsQuery={getInspectionsQuery}
          inspectionsData={inspectionsData}
          setPage={setPage}
          setSearchFilter={setSearchFilter}
          setEtat={setEtat}
          etat={etat}
          statusData={statusData}
        />
      </MainCard>
    </MainCard>
  );
};

export default InspectionsList;

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
  const { logout, user } = useAuth();

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
          navigate(`/interventions/${params?.row?.id}/details`, { test: 'test' });
        }}
      >
        <VisibilityRoundedIcon sx={{ fontSize: '1.3rem' }} />
      </IconButton>
      {params?.row?.etat === 1 && (
        <>
          {user?.role.includes('admin') && (
            <>
              <IconButton onClick={handleMenuClick} size="large">
                <MoreHorizOutlinedIcon
                  fontSize="small"
                  aria-controls="menu-popular-card-1"
                  aria-haspopup="true"
                  sx={{ color: 'grey.500' }}
                />
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
        </>
      )}
      {params?.row?.etat === 2 && (
        <>
          {user?.role.includes('admin') && (
            <>
              <IconButton onClick={handleMenuClick} size="large">
                <MoreHorizOutlinedIcon
                  fontSize="small"
                  aria-controls="menu-popular-card-1"
                  aria-haspopup="true"
                  sx={{ color: 'grey.500' }}
                />
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
  disableAdresse,
  disableEtat,
  disableAffectationDate,
  inspectionsData,
  setEtat,
  etat,
  statusData
}) {
  const useGetSettingsPreferencesQuery = useGetSettingsPreferences();
  const navigate = useNavigate();
  const theme = useTheme();

  let columns = [
    !disableEtat && {
      field: 'etat_detaille',
      headerName: 'Etat',
      sortable: false,
      hideable: true,
      filterable: false,
      renderCell: ({ row }) => {
        const state = statusData?.find((item) => item?.etat === row?.etat);
        console.log(state);
        return (
          <Avatar sx={{ width: 30, height: 30 }} skin="light" color={state?.couleur} variant="rounded">
            <IconifyIcon icon={state?.icon} />
          </Avatar>
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
        return (
          <div
            style={{
              cursor: 'pointer'
            }}
            onClick={(e) => {
              navigate(`/chantiers/${params?.row?.chantier?.id}/details`);
            }}
          >
            {params?.row?.technicien?.name}
          </div>
        );
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
    !disableAdresse && {
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
    !disableAffectationDate && {
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
    // {
    //   field: 'status',
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
          Toolbar: () => <CustomToolbar setEtat={setEtat} states={statusData} etat={etat} />
        }}
        rows={inspectionsData?.data || []}
        columns={columns}
        pageSize={parseInt(useGetSettingsPreferencesQuery?.data?.default_pagination) || 10}
        rowsPerPageOptions={[parseInt(useGetSettingsPreferencesQuery?.data?.default_pagination) || 10]}
        onPageSizeChange={(e) => console.log(e)}
        checkboxSelection={false}
        disableSelectionOnClick={true}
        rowCount={inspectionsData?.total || 0}
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

function CustomToolbar({ setEtat, states, etat }) {
  return (
    <GridToolbarContainer>
      <div
        style={{
          width: '100%',
          padding: 10,
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 10,
          alignItems: 'center'
        }}
      >
        <GridToolbarQuickFilter />
        {states && (
          <Autocomplete
            sx={{ marginBottom: 2 }}
            onChange={(event, newValue) => {
              setEtat(newValue?.etat);
            }}
            options={[{ id: '', nom: 'Tous' }, ...states] || []}
            getOptionLabel={(option) => option.nom}
            defaultValue={[{ id: '', nom: 'Tous' }, ...states]?.find((item) => item?.etat === etat)}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label="Etat*"
                sx={{
                  width: 200
                }}
              />
            )}
          />
        )}
        {/* <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}> */}
        {/* <GridToolbarExport /> */}
        {/* <GridToolbarFilterButton /> */}
        {/* <GridToolbarColumnsButton />
          <GridToolbarDensitySelector /> */}
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
        {/* </div> */}
      </div>
    </GridToolbarContainer>
  );
}
