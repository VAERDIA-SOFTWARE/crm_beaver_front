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
  Tooltip,
  Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

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
  GridToolbarQuickFilter
} from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import { useGetSettingsPreferences } from 'services/settings.service';
import { useDeleteLot, useGetLotLeads } from 'services/lot-leads.service';

const LotChantierList = ({ title, userId, disableTopBar, goBackLink = '/lot-leads/list', clientId = null }) => {
  const [page, setPage] = React.useState(1);
  const [searchFilter, setSearchFilter] = React.useState('');

  const navigate = useNavigate();
  const [validated, setValidated] = React.useState(1);

  return (
    <>
      <MainCard
        title={title ?? 'Liste des Leads'}
        content={false}
        secondary={
          <Grid item xs={12} sm={12} sx={{ textAlign: 'start' }}>
            <Tooltip title="Importer Leads">
              <Fab
                color="primary"
                size="small"
                onClick={() =>
                  navigate(`/lot-leads/create`, {
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
        }
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

export default LotChantierList;

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
          navigate(`/lot-leads/${params?.row?.id}/details`);
        }}
      >
        <VisibilityRoundedIcon sx={{ fontSize: '1.3rem' }} />
      </IconButton>
      {params?.row?.validated === 1 ? (
        <></>
      ) : (
        // <>
        //   <IconButton onClick={handleMenuClick} size="large">
        //     <MoreHorizOutlinedIcon fontSize="small" aria-controls="menu-popular-card-1" aria-haspopup="true" sx={{ color: 'grey.500' }} />
        //   </IconButton>
        //   <Menu
        //     id="menu-popular-card-1"
        //     anchorEl={anchorEl}
        //     keepMounted={true}
        //     open={Boolean(anchorEl)}
        //     onClose={handleClose}
        //     variant="selectedMenu"
        //     anchorOrigin={{
        //       vertical: 'bottom',
        //       horizontal: 'right'
        //     }}
        //     transformOrigin={{
        //       vertical: 'top',
        //       horizontal: 'right'
        //     }}
        //   >
        //     <MenuItem>
        //       <a
        //         target={'_blank'}
        //         style={{
        //           textDecoration: 'none',
        //           color: 'inherit'
        //         }}
        //         href={params?.row?.excel_download_link}
        //         rel="noreferrer"
        //       >
        //         Exporter Excel
        //       </a>
        //     </MenuItem>
        //   </Menu>
        // </>
        <IconButton
          color="secondary"
          size="large"
          onClick={async (e) => {
            await deleteLotMutation.mutateAsync(params?.row?.id);
          }}
        >
          <DeleteIcon sx={{ fontSize: '1.3rem' }} />
        </IconButton>
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

function TableDataGrid({ setSearchFilter, setPage, validated, page, searchFilter, userId, paginated }) {
  const theme = useTheme();
  const getLotsLeadsQuery = useGetLotLeads({ searchFilter, userId, page, validated });
  const useGetSettingsPreferencesQuery = useGetSettingsPreferences();

  const lotleadsArray = getLotsLeadsQuery.isSuccess && getLotsLeadsQuery?.data;
  const pinnedLot = getLotsLeadsQuery.isSuccess && lotleadsArray[lotleadsArray?.length - 1];
  const lotLeadsRows = [pinnedLot];
  for (let i = 0; i < lotleadsArray?.length - 1; i++) {
    lotLeadsRows.push(lotleadsArray[i]);
  }

  const columns = [
    {
      field: 'reference',
      headerName: 'Référence Lot',

      sortable: false,
      filterable: false,
      width: 130
    },
    {
      field: 'created_at',
      headerName: "Date d'import",
      sortable: false,
      filterable: false,
      width: 150
    },
    {
      field: 'nombre_all_clients',
      headerName: 'Nombre des Leads',
      sortable: false,
      filterable: false,
      width: 150
    },
    {
      field: 'percentage_clients_on_lot',
      headerName: 'Transfert en Client',

      sortable: false,
      filterable: false,
      width: 100,
      flex: 1,
      renderCell: (params) => {
        return (
          <Grid container spacing={2} alignItems="center" justifyContent="center">
            <Grid item xs>
              <BorderLinearProgress
                variant="determinate"
                color="primary"
                value={params?.row?.percentage_clients_on_lot}
                sx={{
                  backgroundColor: '#bbf7d0',
                  [`& .${linearProgressClasses.bar}`]: {
                    borderRadius: 5,
                    backgroundColor: theme.palette.mode === 'light' ? '#4ade80' : '#4ade80'
                  }
                }}
              />
            </Grid>
            <Grid item>
              <Typography variant="h6">{Math.round(params?.row?.percentage_clients_on_lot)}%</Typography>
            </Grid>
          </Grid>
        );
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
        components={{
          Toolbar: () => <CustomToolbar page={page} searchFilter={searchFilter} userId={userId} paginated={paginated} /> || GridToolbar
        }}
        // rows={getLotsLeadsQuery?.data || []}
        rows={(getLotsLeadsQuery.isSuccess && lotLeadsRows) || []}
        columns={columns}
        pageSize={parseInt(useGetSettingsPreferencesQuery?.data?.default_pagination) || 10}
        rowsPerPageOptions={[parseInt(useGetSettingsPreferencesQuery?.data?.default_pagination) || 10]}
        onPageSizeChange={(e) => console.log(e)}
        checkboxSelection={false}
        disableSelectionOnClick={true}
        rowCount={getLotsLeadsQuery?.data?.total || 0}
        loading={getLotsLeadsQuery?.isLoading || getLotsLeadsQuery?.isFetching}
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
          <Button
            LinkComponent={'a'}
            target="_blank"
            href={`${process.env.REACT_APP_API_URL}lot-leads/export-excel?${paginated ? `paginated=${paginated}&` : ''}${
              searchFilter ? `search=${searchFilter}&` : ''
            }${userId ? `userId=${userId}&` : ''}`}
          >
            Exporter
          </Button>

          <GridToolbarColumnsButton />
          <GridToolbarDensitySelector />
        </div>
      </div>
    </GridToolbarContainer>
  );
}
