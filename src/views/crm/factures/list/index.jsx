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
  GridToolbarQuickFilter
} from '@mui/x-data-grid';
import { Link, useNavigate } from 'react-router-dom';
import { useGetFactures } from 'services/facture.service';
import { useGetSettingsPreferences } from 'services/settings.service';

const FacturesList = ({ commandeId = null }) => {
  const [page, setPage] = React.useState(1);
  const [searchFilter, setSearchFilter] = React.useState('');

  const getFacturesQuery = useGetFactures({ page, searchFilter, commandeId });
  console.log(getFacturesQuery, 'getFacturesQuery');

  const navigate = useNavigate();

  return (
    <MainCard
      title="Liste des Factures"
      content={false}
      secondary={
        <Grid item xs={12} sm={12} sx={{ textAlign: 'start' }}>
          <Tooltip title="Ajouter Facture">
            <Fab
              color="primary"
              size="small"
              onClick={() => {
                if (commandeId) {
                  navigate(`/commandes/${commandeId}/factures/create`);
                } else navigate(`/factures/create`);
              }}
              sx={{ boxShadow: 'none', ml: 1, width: 32, height: 32, minHeight: 32 }}
            >
              <AddIcon fontSize="small" />
            </Fab>
          </Tooltip>
        </Grid>
      }
      // secondary={<SecondaryAction link="https://material-ui.com/components/data-grid/" />}
    >
      <div
        style={{
          display: 'flex',
          gap: 14,
          alignItems: 'center',
          padding: 20,
          flexWrap: 'wrap'
        }}
      >
        {getFacturesQuery?.data?.status?.map((e) => (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <div style={{ width: 10, height: 10, backgroundColor: e?.couleur, borderRadius: 9999 }} />
            {e?.nom}
          </div>
        ))}
      </div>
      <TableDataGrid getFacturesQuery={getFacturesQuery} setPage={setPage} setSearchFilter={setSearchFilter} />
    </MainCard>
  );
};

export default FacturesList;

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
          navigate(`/factures/${params?.row?.id}`);
        }}
      >
        <VisibilityRoundedIcon sx={{ fontSize: '1.3rem' }} />
      </IconButton>
      {false && (
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
                navigate(`/clients/${params.row?.id}/import-chantiers`);
              }}
            >
              Importer
            </MenuItem>
          </Menu>
        </>
      )}
    </div>
  );
}

function TableDataGrid({ setSearchFilter, getFacturesQuery, setPage }) {
  const theme = useTheme();
  const useGetSettingsPreferencesQuery = useGetSettingsPreferences();

  const columns = [
    {
      field: 'status_detaille',
      headerName: 'Etat',
      sortable: false,
      hideable: false,
      filterable: false,
      disableExport: false,
      renderCell: (params) => {
        return (
          <div>
            <div style={{ width: 10, height: 10, backgroundColor: params?.row?.status_detaille?.couleur, borderRadius: 9999 }} />
          </div>
        );
      }
    },

    {
      field: 'client_ref',
      headerName: 'Référence Client',

      sortable: false,
      filterable: false,
      minWidth: 100,
      flex: 1,
      // valueGetter: (params) => `${params.row.firstName || ''} ${params.row.lastName || ''}`
      renderCell: (params) => {
        return (
          <Link
            to={`/clients/${params?.row?.user?.id}/details`}
            target="_blank"
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {params?.row?.user?.reference}
          </Link>
        );
      }
    },

    { field: 'reference', headerName: 'Référence', sortable: false, filterable: false, minWidth: 100, flex: 1 },
    { field: 'montant_total', headerName: 'Montant Total', sortable: false, filterable: false, minWidth: 100, flex: 1 },
    { field: 'montant_HT_total', headerName: 'Montant HT', sortable: false, filterable: false, minWidth: 100, flex: 1 },
    { field: 'montant_Remise', headerName: 'Montant Remise', sortable: false, filterable: false, minWidth: 100, flex: 1 },
    { field: 'montant_HTNet_total', headerName: 'Montant HTNet', sortable: false, filterable: false, minWidth: 100, flex: 1 },
    { field: 'montant_TVA_total', headerName: 'Montant TVA', sortable: false, filterable: false, minWidth: 100, flex: 1 },
    { field: 'montant_TTC_total', headerName: 'Montant TTC', sortable: false, filterable: false, minWidth: 100, flex: 1 },
    { field: 'montant_NetaPayer', headerName: 'Montant NET a payer', sortable: false, filterable: false, minWidth: 100, flex: 1 },

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
        rows={getFacturesQuery.data?.factures?.data || []}
        columns={columns}
        pageSize={parseInt(useGetSettingsPreferencesQuery?.data?.default_pagination) || 10}
        rowsPerPageOptions={[parseInt(useGetSettingsPreferencesQuery?.data?.default_pagination) || 10]}
        onPageSizeChange={(e) => console.log(e)}
        checkboxSelection={false}
        disableSelectionOnClick={true}
        rowCount={getFacturesQuery.data?.factures?.total || 0}
        loading={getFacturesQuery.isLoading || getFacturesQuery.isFetching}
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
