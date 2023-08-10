import EditIcon from '@mui/icons-material/Edit';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import { Autocomplete, Avatar, Box, Grid, IconButton, Menu, MenuItem, Tab, Tabs, TextField, Typography } from '@mui/material';

// project imports
import { useNavigate, useParams } from 'react-router-dom';
import { useGetUser, useGetUserPermissions } from 'services/users.service';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import ClientDataCard from 'views/crm/clients/list/ClientDataCard';
import AuthToggleCard from 'views/crm/users/list/AuthToggleCard';
import AccessDataCard from 'views/crm/users/list/AccessDataCard';
import PointageList from 'views/crm/pointage/list/PointageDataCard';
import PointageListCol from 'views/crm/pointage/list';
import PointageMaps from 'views/crm/pointage/maps';
import moment from 'moment/moment';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';

import { useGetpointages } from 'services/rh.service';
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
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import { useTheme } from '@mui/material/styles';
import IconifyIcon from 'ui-component/icon';
import useAuth from 'hooks/useAuth';
import { useDeleteInspection, useGenererInspectionsRapport, useGetInspections, useValidateInspections } from 'services/inspections.service';
import { useGetStateByModel } from 'services/state.service';
import { useGetSettingsPreferences } from 'services/settings.service';

const TechnicienDetailsPage = () => {
  const { technicienId } = useParams();

  const getTechnicienQuery = useGetUser(technicienId);
  const technicienData = getTechnicienQuery.data?.user;

  const navigate = useNavigate();
  // itnervention componeent
  const [page, setPage] = useState(1);
  const [searchFilter, setSearchFilter] = useState('');
  const [etat, setEtat] = useState('');
  const { logout, user } = useAuth();

  const getInspectionsQuery = useGetInspections({
    searchFilter: searchFilter,
    userId: technicienId,
    page: page,
    etat: etat,
    paginated: true
  });
  const inspectionsEtatData = getInspectionsQuery.data?.etats;
  const inspectionsStatutData = getInspectionsQuery.data?.status;
  const inspectionsData = getInspectionsQuery?.data;
  const getStatusQuery = useGetStateByModel('DIntervention');
  const statusData = getStatusQuery?.data;

  const [toggleAuth, setToggleAuth] = useState(false);
  const [value, setValue] = useState(0);
  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };
  const pointageList = [
    {
      id: 12,
      status: 0,
      date_debut: '2023-07-27 08:53:17',
      date_fin: '2023-07-27 18:58:17',
      emplacement: 'Sousse , Msaken',
      emplacement_fin: 'Sousse , Msaken',
      description: 'D\u00e9but de travail',
      created_at: '2023-07-27T08:53:17.000000Z',
      updated_at: '2023-07-27T08:53:17.000000Z'
    },
    {
      id: 11,
      status: 0,
      date_debut: '2023-07-28 08:00:17',
      date_fin: '2023-07-28 18:05:17',
      emplacement: 'Sousse , Msaken',
      emplacement_fin: 'Sousse , Msaken',
      description: 'D\u00e9but de travail',
      created_at: '2023-07-27T08:53:17.000000Z',
      updated_at: '2023-07-27T08:53:17.000000Z'
    }
  ];
  const getUserPermissionsQuery = useGetUserPermissions(technicienId);
  useEffect(() => {
    setToggleAuth(technicienData?.auth);
  }, [technicienData, getTechnicienQuery.isSuccess]);

  const userPermissionsData = getUserPermissionsQuery?.data;
  // const [searchFilter, setSearchFilter] = useState({
  //   date_debut: moment().subtract(6, 'days').format('YYYY/MM/DD'),
  //   date_fin: moment().format('YYYY/MM/DD')
  // });
  console.log(searchFilter);
  const getArticlesQuery = useGetpointages({ date_debut: searchFilter?.date_debut, date_fin: searchFilter?.date_fin });

  const pointages = getArticlesQuery?.data;
  return (
    <MainCard
      headerColor={true}
      title={`Collaborateur ${technicienData?.reference ? '- ' + technicienData?.reference : ''}`}
      circle={technicienData?.couleur}
      backButton
      goBackLink="/techniciens/list"
      secondary={
        <IconButton
          color="text"
          size="large"
          onClick={(e) => {
            // handleOpenEditDialog(e);
            navigate(`/techniciens/${technicienId}/update`);
          }}
        >
          <EditIcon sx={{ fontSize: '1.3rem' }} />
        </IconButton>
      }
    >
      <div>
        <Tabs
          value={value}
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
          <Tab to="#" label="Collaborateur" {...a11yProps(0)} />
          <Tab to="#" label="Chantiers" {...a11yProps(1)} />
          <Tab to="#" label="Interventions" {...a11yProps(2)} />
          <Tab to="#" label="Accès" {...a11yProps(3)} />
          <Tab to="#" label="Historique de pointage" {...a11yProps(4)} />
          <Tab to="#" label="Maps" {...a11yProps(5)} />
        </Tabs>

        <TabPanel value={value} index={0}>
          <>
            <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
              <Grid item xs={12}>
                <ClientDataCard clientData={technicienData} title="Informations du contact" />
              </Grid>

              <Grid item md={4}>
                {/* <HistoriqueCard
                  isLoading={false}
                  title="Qualifications"
                  data={technicienData?.operations}
                  style={{
                    height: 400
                  }}
                /> */}
              </Grid>
              <Grid item md={4}>
                {/* <HistoriqueCard
                  isLoading={false}
                  title="Zones de travail"
                  data={technicienData?.zone_villes}
                  style={{
                    height: 400
                  }}
                /> */}
              </Grid>
            </Grid>
          </>
        </TabPanel>

        <TabPanel value={value} index={1}>
          <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
            <Grid item xs={12}>
              {/* <ChantierList
                title=""
                // inspectionChantierFilter={1}
                // etatFilter={0}
                disableFilters
                disableCreate
                disableCheckboxSelection={true}
                userId={technicienId}
                genererInspections
              /> */}
            </Grid>
          </Grid>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
            <Grid item xs={12}>
              <TableDataGrid
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
            </Grid>
          </Grid>
        </TabPanel>
        <TabPanel value={value} index={3}>
          <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
            <Grid item xs={12} sx={{ marginBottom: '2rem' }}>
              <AuthToggleCard toggleAuth={toggleAuth} setToggleAuth={setToggleAuth} userData={technicienData} userId={technicienId} />
            </Grid>
          </Grid>

          <Grid item xs={12}>
            {Array.isArray(userPermissionsData) && <AccessDataCard userPermissionsData={userPermissionsData} userId={technicienId} />}
          </Grid>
        </TabPanel>
        <TabPanel value={value} index={4}>
          <PointageList searchFilter={searchFilter} setSearchFilter={setSearchFilter} pointages={pointages} />
        </TabPanel>
        <TabPanel value={value} index={5}>
          <PointageMaps />
        </TabPanel>
        <div
          style={{
            display: 'flex',
            justifyContent: 'end',
            marginTop: 40
          }}
        >
          <Typography variant="h5">Créé le {technicienData?.created_at}</Typography>
        </div>
      </div>
    </MainCard>
  );
};

TechnicienDetailsPage.propTypes = {
  open: PropTypes.bool,
  handleCloseDialog: PropTypes.func
};

export default TechnicienDetailsPage;

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
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
              navigate(`/clients/${params?.row?.client?.id}/details`);
            }}
          >
            {params?.row?.client?.name}
          </div>
        );
      }
    },
    {
      field: 'collaborator',
      headerName: 'Collaborator',
      sortable: false,
      hideable: true,
      minWidth: 100,
      flex: 1,
      filterable: false,
      renderCell: (params) => {
        return <div>{params?.row?.collaborator?.name}</div>;
      }
    },
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
function EditCell({ params }) {
  const deleteInspectionMutation = useDeleteInspection();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
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
