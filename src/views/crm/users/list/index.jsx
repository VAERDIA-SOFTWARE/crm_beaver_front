import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NoAccountsIcon from '@mui/icons-material/NoAccounts';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import * as React from 'react';

// material-ui
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import { Box, Fab, Grid, IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
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
import { useGetSettingsPreferences } from 'services/settings.service';
import { useGetUsers } from 'services/users.service';

const UsersList = () => {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [searchFilter, setSearchFilter] = React.useState('');

  const getusersQuery = useGetUsers({ paginated: true, pageSize: pageSize, page: page });

  const navigate = useNavigate();

  return (
    <MainCard
      title="Liste des utilisateurs"
      content={false}
      secondary={
        <Grid item xs={12} sm={12} sx={{ textAlign: 'start' }}>
          <Tooltip title="Ajouter Client">
            <Fab
              color="primary"
              size="small"
              onClick={() => navigate(`/users/create`)}
              sx={{ boxShadow: 'none', ml: 1, width: 32, height: 32, minHeight: 32 }}
            >
              <AddIcon fontSize="small" />
            </Fab>
          </Tooltip>
        </Grid>
      }
      // secondary={<SecondaryAction link="https://material-ui.com/components/data-grid/" />}
    >
      <TableDataGrid setPageSize={setPageSize} getusersQuery={getusersQuery} setPage={setPage} setSearchFilter={setSearchFilter} />
    </MainCard>
  );
};

export default UsersList;

function EditCell({ params }) {
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
          navigate(`/users/${params?.row?.id}/details`);
        }}
      >
        <VisibilityRoundedIcon sx={{ fontSize: '1.3rem' }} />
      </IconButton>
      {/* <IconButton onClick={handleMenuClick} size="large">
        <MoreHorizOutlinedIcon fontSize="small" aria-controls="menu-popular-card-1" aria-haspopup="true" sx={{ color: 'grey.500' }} />
      </IconButton> */}
      {/* <Menu
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
            navigate(`/users/${params.row?.id}/import-chantiers`);
          }}
        >
          Importer
        </MenuItem>
      </Menu> */}
    </div>
  );
}

function TableDataGrid({ setSearchFilter, setPageSize, getusersQuery, setPage }) {
  const theme = useTheme();
  const useGetSettingsPreferencesQuery = useGetSettingsPreferences();

  const columns = [
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
    { field: 'reference', headerName: 'Référence', sortable: false, filterable: false, minWidth: 100, flex: 1 },
    { field: 'name', headerName: 'Intitulé', sortable: false, filterable: false, minWidth: 100, flex: 1 },
    {
      field: 'phone_number',
      headerName: 'Téléphone',
      sortable: false,
      filterable: false,

      minWidth: 100,
      flex: 1
    },
    { field: 'email', headerName: 'E-mail', sortable: false, filterable: false, minWidth: 100, flex: 1 },
    {
      field: 'address',
      headerName: 'Addresse',
      sortable: false,
      filterable: false,
      minWidth: 100,
      flex: 1
    },
    { field: 'ville', headerName: 'Ville', sortable: false, filterable: false, minWidth: 100, flex: 1 },
    { field: 'code_postal', headerName: 'Code Postal', sortable: false, filterable: false, minWidth: 100, flex: 1 },

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
        rows={getusersQuery?.data?.data || []}
        columns={columns}
        loading={getusersQuery?.isLoading || getusersQuery?.isFetching}
        rowsPerPageOptions={[5, 10, 25]}
        paginationMode="server"
        filterMode="server"
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        pageSize={parseInt(getusersQuery?.data?.per_page) || 10}
        pagination
        checkboxSelection={false}
        rowCount={getusersQuery?.data?.total || 0}
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
