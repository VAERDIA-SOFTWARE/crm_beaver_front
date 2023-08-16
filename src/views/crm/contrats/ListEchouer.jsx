import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NoAccountsIcon from '@mui/icons-material/NoAccounts';
import * as React from 'react';

// material-ui
import { Autocomplete, Box, Fab, Grid, IconButton, Menu, MenuItem, TextField, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import DeleteIcon from '@mui/icons-material/Delete';
// assets
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
import { useGetContrats } from 'services/contrats.service';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/AddTwoTone';
import RunningWithErrorsOutlinedIcon from '@mui/icons-material/RunningWithErrorsOutlined';
import ContentPasteOffIcon from '@mui/icons-material/ContentPasteOff';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import { useGetStateByModel } from 'services/state.service';
import IconifyIcon from 'ui-component/icon';
import Avatar from 'ui-component/avatar';
const Contract = () => {
  const [page, setPage] = React.useState(1);
  const [etat, setEtat] = React.useState(null);
  const [searchFilter, setSearchFilter] = React.useState('');

  const navigate = useNavigate();
  const getContratQuery = useGetContrats({ page: page, searchFilter: searchFilter, paginated: true, state: '4,2' });
  const contratsData = getContratQuery?.data;
  const getStatusQuery = useGetStateByModel('DContrat');
  const statusData = getStatusQuery?.data;
  return (
    <MainCard headerColor={true} title="Liste des contrats échouer" content={false}>
      <TableDataGrid
        etat={etat}
        setEtat={setEtat}
        statusData={statusData}
        getContratQuery={getContratQuery}
        contratsData={contratsData}
        setPage={setPage}
        setSearchFilter={setSearchFilter}
      />
    </MainCard>
  );
};

export default Contract;

function TableDataGrid({ setEtat, etat, setSearchFilter, getContratQuery, contratsData, setPage, statusData }) {
  const theme = useTheme();
  const useGetSettingsPreferencesQuery = useGetSettingsPreferences();

  const columns = [
    {
      field: 'validated',
      headerName: 'Statut',
      sortable: false,
      hideable: false,
      filterable: false,
      disableExport: true,
      renderCell: ({ row }) => {
        if (statusData) {
          const state = statusData?.find((item) => item?.etat === row?.state);
          return (
            <Avatar sx={{ width: 30, height: 30 }} skin="light" color={state?.couleur} variant="rounded">
              <IconifyIcon icon={state?.icon} />
            </Avatar>
          );
        }
      }
    },
    { field: 'reference', headerName: 'Référence', sortable: false, filterable: false, minWidth: 100, flex: 1 },
    { field: 'date_debut', headerName: 'Date Debut', sortable: false, filterable: false, minWidth: 100, flex: 1 },
    {
      field: 'date_fin',
      headerName: 'Date Fin',
      sortable: false,
      filterable: false,

      minWidth: 100,
      flex: 1
    },

    {
      field: 'client',
      headerName: 'Client',
      sortable: false,
      filterable: false,
      minWidth: 100,
      flex: 1,
      renderCell: (params) => {
        return <div>{params?.row?.user?.name}</div>;
      }
    },
    {
      field: 'marque_pac_parents',
      headerName: 'Marque PAC',
      sortable: false,
      filterable: false,
      minWidth: 100,
      flex: 1,
      renderCell: (params) => {
        const marqueList = params?.row?.marque_pac_parents;
        const marqueText = marqueList?.join(', ');
        return <div>{marqueText}</div>;
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
          Toolbar: () => <CustomToolbar setEtat={setEtat} states={statusData} etat={etat} />
        }}
        rows={contratsData?.data || []}
        columns={columns}
        pageSize={parseInt(useGetSettingsPreferencesQuery?.data?.default_pagination) || 10}
        rowsPerPageOptions={[parseInt(useGetSettingsPreferencesQuery?.data?.default_pagination) || 10]}
        onPageSizeChange={(e) => console.log(e)}
        checkboxSelection={false}
        disableSelectionOnClick={true}
        rowCount={contratsData?.total || 0}
        loading={getContratQuery?.isLoading || getContratQuery?.isFetching}
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
function EditCell({ params }) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleModal = () => {
    setOpen(true);
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
          navigate(`/contrats/${params.row.id}/details`);
        }}
      >
        <VisibilityRoundedIcon sx={{ fontSize: '1.3rem' }} />
      </IconButton>
      <IconButton size="large" onClick={handleMenuClick}>
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
          <IconButton
            color="secondary"
            size="large"
            onClick={(e) => {
              navigate(`/contrats/${params.row.id}/update`);
            }}
          >
            <EditIcon sx={{ fontSize: '1.3rem' }} />
          </IconButton>
          Modifier Contrat
        </MenuItem>
        {/* <MenuItem> */}
        {/* <MenuItem onClick={handleModal}> */}
        <MenuItem>
          {/* <IconButton color="secondary" size="large">
            <VisibilityOffIcon sx={{ fontSize: '1.3rem' }} />{' '}
          </IconButton>
          Supprimer Contrat */}
        </MenuItem>
        {/* {setOpen && <DeleteContratDialog open={open} setOpen={setOpen} />} */}
      </Menu>
    </div>
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
          gap: 10
        }}
      >
        <GridToolbarQuickFilter />
        {/* {states && (
          <Autocomplete
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
                label="Statut*"
                sx={{
                  width: 200
                }}
              />
            )}
          />
        )} */}
        {/* <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <GridToolbarExport />
          <GridToolbarFilterButton />

          <GridToolbarDensitySelector />
          <GridToolbarColumnsButton />
          <div>
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
          </div>
        </div> */}
      </div>
    </GridToolbarContainer>
  );
}
