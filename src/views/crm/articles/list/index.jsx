import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import * as React from 'react';

// material-ui
import { Box, Fab, Grid, IconButton, Tooltip, Typography } from '@mui/material';
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
import { useGetSettingsPreferences } from 'services/settings.service';
import { useGetArticles } from 'services/articles.service';
import { AccountCircleOutlined, NoAccountsOutlined } from '@mui/icons-material';

const UsersList = () => {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [searchFilter, setSearchFilter] = React.useState('');

  const getArticlesQuery = useGetArticles();
  const articlesData = getArticlesQuery?.data;
  console.log('====================================');
  console.log(articlesData);
  console.log('====================================');
  const navigate = useNavigate();

  return (
    <MainCard
      title="Liste des Articles"
      content={false}
      secondary={
        <Grid item xs={12} sm={12} sx={{ textAlign: 'start' }}>
          <Tooltip title="Ajouter Article">
            <Fab
              color="primary"
              size="small"
              onClick={() => navigate(`/articles/create`)}
              sx={{ boxShadow: 'none', ml: 1, width: 32, height: 32, minHeight: 32 }}
            >
              <AddIcon fontSize="small" />
            </Fab>
          </Tooltip>
        </Grid>
      }
    >
      <TableDataGrid setPageSize={setPageSize} getusersQuery={articlesData} setPage={setPage} setSearchFilter={setSearchFilter} />
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
          navigate(`/articles/${params?.row?.id}/details`);
        }}
      >
        <VisibilityRoundedIcon sx={{ fontSize: '1.3rem' }} />
      </IconButton>
    </div>
  );
}

function TableDataGrid({ setSearchFilter, setPageSize, getusersQuery, setPage }) {
  const theme = useTheme();
  const useGetSettingsPreferencesQuery = useGetSettingsPreferences();

  const columns = [
    {
      field: 'active',
      headerName: 'Statut',
      sortable: false,
      hideable: false,
      filterable: false,
      disableExport: true,
      renderCell: (params) => {
        return (
          <>
            {params?.row?.active ? (
              <AccountCircleOutlined
                sx={{
                  color: '#16a34a'
                }}
              />
            ) : (
              <NoAccountsOutlined
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
    { field: 'nom', headerName: 'Intitulé', sortable: false, filterable: false, minWidth: 100, flex: 1 },
    { field: 'prix_unitaire', headerName: 'Prix Unitaire', sortable: false, filterable: false, minWidth: 100, flex: 1 },
    { field: 'remise', headerName: 'Remise', sortable: false, filterable: false, minWidth: 100, flex: 1 },
    {
      field: 'unite_id',
      headerName: 'Unité',
      sortable: false,
      filterable: false,
      minWidth: 100,
      flex: 1,
      renderCell: (params) => {
        return <>{params?.row?.unite?.intitule}</>;
      }
    },
    {
      field: 'p_category_article_id',
      headerName: 'Catégorie',
      sortable: false,
      filterable: false,
      minWidth: 100,
      flex: 1,
      renderCell: (params) => {
        return <>{params?.row?.unite?.intitule}</>;
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
        rows={getusersQuery || []}
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
