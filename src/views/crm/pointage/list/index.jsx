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
import { useGetpointages } from 'services/rh.service';

const PointageListCol = () => {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [searchFilter, setSearchFilter] = React.useState('');

  const getArticlesQuery = useGetpointages();

  const Pointages = getArticlesQuery?.data;
  console.log('====================================');
  console.log(Pointages);
  console.log('====================================');
  const navigate = useNavigate();

  return (
    <MainCard
      title="Historique de Pointage des 
      Techniciens"
      content={false}
    >
      <TableDataGrid setPageSize={setPageSize} getusersQuery={Pointages} setPage={setPage} setSearchFilter={setSearchFilter} />
    </MainCard>
  );
};

export default PointageListCol;

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
          navigate(`/pointage/${params?.row?.id}/details`);
        }}
      >
        <VisibilityRoundedIcon sx={{ fontSize: '1.3rem' }} />
      </IconButton>
    </div>
  );
}

function TableDataGrid({ setSearchFilter, setPageSize, getusersQuery, setPage }) {
  const theme = useTheme();

  const columns = [
    { field: 'date_debut', headerName: 'Debut du journée ', sortable: false, filterable: false, minWidth: 100, flex: 1 },
    { field: 'date_fin', headerName: 'Fin du journée', sortable: false, filterable: false, minWidth: 100, flex: 1 },
    { field: 'description', headerName: 'Description', sortable: false, filterable: false, minWidth: 100, flex: 1 },
    { field: 'emplacement_debut', headerName: 'Emplacement Debut Journée', sortable: false, filterable: false, minWidth: 100, flex: 1 },
    { field: 'emplacement_end', headerName: 'Emplacement Fin Journée', sortable: false, filterable: false, minWidth: 100, flex: 1 },

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
          <GridToolbarColumnsButton />
          <GridToolbarDensitySelector />
        </div>
      </div>
    </GridToolbarContainer>
  );
}
