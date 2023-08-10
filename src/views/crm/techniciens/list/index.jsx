import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import * as React from 'react';

// material-ui
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NoAccountsIcon from '@mui/icons-material/NoAccounts';
import { Box, Fab, Grid, IconButton, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project imports
import MainCard from 'ui-component/cards/MainCard';

// assets
import AddIcon from '@mui/icons-material/AddTwoTone';
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
import { useGetUsers } from 'services/users.service';
import { useGetSettingsPreferences } from 'services/settings.service';

const TechniciensList = () => {
  const [page, setPage] = React.useState(1);
  const [searchFilter, setSearchFilter] = React.useState('');

  const getTechniciensQuery = useGetUsers({ role: 'technicien', page, searchFilter });

  const navigate = useNavigate();

  return (
    <>
      <MainCard
        headerColor={true}
        title="Liste des Collaborateurs"
        content={false}
        secondary={
          <Grid item xs={12} sm={12} sx={{ textAlign: 'start' }}>
            <Tooltip title="Ajouter Collaborateur">
              <Fab
                color="primary"
                size="small"
                onClick={() => navigate(`/techniciens/create`)}
                // onClick={handleClickOpenDialog}
                sx={{ boxShadow: 'none', ml: 1, width: 32, height: 32, minHeight: 32 }}
              >
                <AddIcon fontSize="small" />
              </Fab>
            </Tooltip>
          </Grid>
        }
        // secondary={<SecondaryAction link="https://material-ui.com/components/data-grid/" />}
      >
        <TableDataGrid getTechniciensQuery={getTechniciensQuery} setPage={setPage} setSearchFilter={setSearchFilter} />
      </MainCard>
    </>
  );
};

export default TechniciensList;

function EditCell({ params }) {
  const navigate = useNavigate();

  return (
    <div>
      <IconButton
        color="secondary"
        size="large"
        onClick={(e) => {
          navigate(`/techniciens/${params?.row?.id}/details`);
        }}
      >
        <VisibilityRoundedIcon sx={{ fontSize: '1.3rem' }} />
      </IconButton>
    </div>
  );
}

function TableDataGrid({ setSearchFilter, getTechniciensQuery, setPage }) {
  const theme = useTheme();
  const useGetSettingsPreferencesQuery = useGetSettingsPreferences();

  const columns = [
    {
      field: 'couleur',
      headerName: '',
      sortable: false,
      filterable: false,
      hideable: false,
      width: 40,
      renderCell: (params) => {
        return (
          <div>
            <div style={{ width: 10, height: 10, backgroundColor: params?.row?.couleur, borderRadius: 9999 }} />
          </div>
        );
      }
    },
    {
      field: 'active_status',
      headerName: 'Statut',
      sortable: false,
      hideable: false,
      filterable: false,
      disableExport: true,
      renderCell: (params) => {
        return (
          <>
            {params?.row?.active_status ? (
              <AccountCircleIcon
                sx={{
                  color: '#16a34a'
                }}
              />
            ) : (
              <NoAccountsIcon
                sx={{
                  color: '#dc2626'
                }}
              />
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
    { field: 'name', headerName: 'Intitulé', sortable: false, filterable: false, minWidth: 100, flex: 1 },
    { field: 'email', headerName: 'E-mail', sortable: false, filterable: false, minWidth: 100, flex: 1 },
    {
      field: 'phone_number',
      headerName: 'Numéro de téléphone',
      sortable: false,
      filterable: false,

      minWidth: 100,
      flex: 1
    },
    {
      field: 'address',
      headerName: 'Addresse',
      sortable: false,
      filterable: false,
      minWidth: 100,
      flex: 1
    },
    {
      field: 'fax',
      headerName: 'Fax',
      sortable: false,
      filterable: false,

      minWidth: 100,
      flex: 1
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
        rows={getTechniciensQuery.data?.data || []}
        columns={columns}
        pageSize={parseInt(useGetSettingsPreferencesQuery?.data?.default_pagination) || 10}
        rowsPerPageOptions={[parseInt(useGetSettingsPreferencesQuery?.data?.default_pagination) || 10]}
        onPageSizeChange={(e) => console.log(e)}
        checkboxSelection={false}
        disableSelectionOnClick={true}
        rowCount={getTechniciensQuery.data?.total || 0}
        loading={getTechniciensQuery.isLoading || getTechniciensQuery.isFetching}
        pagination
        filterMode="server"
        onFilterModelChange={(e) => {
          setSearchFilter(e?.quickFilterValues);
        }}
        paginationMode="server"
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
