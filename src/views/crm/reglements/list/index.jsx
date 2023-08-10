import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NoAccountsIcon from '@mui/icons-material/NoAccounts';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import * as React from 'react';

// material-ui
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
  GridToolbarQuickFilter
} from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { useGetUsers } from 'services/users.service';
import { useGetSettingsPreferences } from 'services/settings.service';
import { useGetReglements } from 'services/reglements.service';

const ReglementsList = () => {
  const [page, setPage] = React.useState(1);
  const [searchFilter, setSearchFilter] = React.useState('');

  const getClientsQuery = useGetReglements({ page, searchFilter, paginated: true });

  const navigate = useNavigate();

  return (
    <MainCard
      headerColor={true}
      title="Liste des Reglements"
      content={false}
      secondary={
        <Grid item xs={12} sm={12} sx={{ textAlign: 'start' }}>
          <Tooltip title="Ajouter Reglement">
            <Fab
              color="primary"
              size="small"
              onClick={() => navigate(`/reglement/create`)}
              sx={{ boxShadow: 'none', ml: 1, width: 32, height: 32, minHeight: 32 }}
            >
              <AddIcon fontSize="small" />
            </Fab>
          </Tooltip>
        </Grid>
      }
    >
      <TableDataGrid getClientsQuery={getClientsQuery} setPage={setPage} setSearchFilter={setSearchFilter} />
    </MainCard>
  );
};

export default ReglementsList;

function EditCell({ params }) {
  const navigate = useNavigate();

  return (
    <div>
      <IconButton
        color="secondary"
        size="large"
        onClick={(e) => {
          navigate(`/reglement/${params?.row?.id}/update`);
        }}
      >
        <VisibilityRoundedIcon sx={{ fontSize: '1.3rem' }} />
      </IconButton>
    </div>
  );
}

function TableDataGrid({ setSearchFilter, getClientsQuery, setPage }) {
  const theme = useTheme();
  const useGetSettingsPreferencesQuery = useGetSettingsPreferences();

  const columns = [
    // {
    //   field: 'active_status',
    //   headerName: 'Statut',
    //   sortable: false,
    //   hideable: false,
    //   filterable: false,
    //   disableExport: true,
    //   renderCell: (params) => {
    //     return (
    //       <>
    //         {params?.row?.active_status ? (
    //           <AccountCircleIcon
    //             sx={{
    //               color: '#16a34a'
    //             }}
    //           />
    //         ) : (
    //           <NoAccountsIcon
    //             sx={{
    //               color: '#dc2626'
    //             }}
    //           />
    //         )}
    //       </>
    //     );
    //   }
    // },
    { field: 'reference', headerName: 'Référence', sortable: false, filterable: false, minWidth: 100, flex: 1 },
    { field: 'libelle', headerName: 'Libelle', sortable: false, filterable: false, minWidth: 100, flex: 1 },
    {
      field: 'montant',
      headerName: 'Montant',
      sortable: false,
      filterable: false,

      minWidth: 100,
      flex: 1
    },
    { field: 'date', headerName: 'Date', sortable: false, filterable: false, minWidth: 100, flex: 1 },
    {
      field: 'date_echeance',
      headerName: "date d'échéance",
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
        paddingLeft: 2,
        paddingRight: 2,

        height: 650,
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
        localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
        density="compact"
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
        rows={getClientsQuery?.data?.data || []}
        columns={columns}
        pageSize={parseInt(useGetSettingsPreferencesQuery?.data?.default_pagination) || 10}
        rowsPerPageOptions={[parseInt(useGetSettingsPreferencesQuery?.data?.default_pagination) || 10]}
        onPageSizeChange={(e) => console.log(e)}
        checkboxSelection={false}
        disableSelectionOnClick={true}
        rowCount={getClientsQuery.data?.total || 0}
        loading={getClientsQuery.isLoading || getClientsQuery.isFetching}
        pagination
        paginationMode="server"
        filterMode="server"
        onFilterModelChange={(e) => {
          setSearchFilter(e?.quickFilterValues);
        }}
        onPageChange={(newPage) => setPage(newPage + 1)}
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
          <GridToolbarColumnsButton />
          <GridToolbarDensitySelector />
        </div>
      </div>
    </GridToolbarContainer>
  );
}
