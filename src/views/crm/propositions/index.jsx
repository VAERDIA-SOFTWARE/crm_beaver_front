import DeleteIcon from '@mui/icons-material/Delete';
import * as React from 'react';

// material-ui
import SendIcon from '@mui/icons-material/Send';
import { Box, Grid, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';

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
import moment from 'moment';
import { useDeleteInspection, useDeleteProposition, useGetInspectionsProposes, useValiderPropositions } from 'services/inspections.service';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import useAuth from 'hooks/useAuth';
import { useGetSettingsPreferences } from 'services/settings.service';
import { useGetInterventionsProposes } from 'services/interventions.service';

const PropositionsList = ({ title, userId = '' }) => {
  const [page, setPage] = React.useState(1);
  const [searchFilter, setSearchFilter] = React.useState('');
  const [selectedRows, setSelectedRows] = React.useState([]);
  const { logout, user } = useAuth();

  const getInterventionsQuery = useGetInterventionsProposes({ searchFilter, userId, page, paginated: true });
  const propositionData = getInterventionsQuery?.data;

  const useValiderPropositionsMutation = useValiderPropositions();

  return (
    <MainCard
      headerColor={true}
      title={title ?? 'Liste des Propositions'}
      content={false}
      secondary={
        user?.role.includes('admin') && (
          <Grid item xs={12} sm={12} sx={{ textAlign: 'start' }}>
            <LoadingButton
              sx={{
                backgroundColor: '#efb816',
                color: 'white',
                '&:disabled': {
                  color: 'white'
                }
              }}
              disabled={!selectedRows?.length}
              loadingPosition="end"
              endIcon={<SendIcon />}
              loading={useValiderPropositionsMutation.isLoading}
              variant="contained"
              onClick={async () => {
                try {
                  await useValiderPropositionsMutation.mutateAsync({ propositions: selectedRows });
                  setSelectedRows([]);
                } catch (error) {}
              }}
            >
              Valider
            </LoadingButton>
          </Grid>
        )
      }
    >
      <TableDataGrid
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        getInspectionsQuery={getInterventionsQuery}
        propositionData={propositionData}
        setPage={setPage}
        setSearchFilter={setSearchFilter}
      />
    </MainCard>
  );
};

export default PropositionsList;

function EditCell({ params }) {
  // const deleteInspectionMutation = useDeleteInspection();
  const deletePropositionMutation = useDeleteProposition();
  const navigate = useNavigate();

  return (
    <div>
      <IconButton
        color="secondary"
        size="large"
        onClick={(e) => {
          navigate(`/propositions/${params?.row?.id}/details`);
        }}
      >
        <VisibilityRoundedIcon sx={{ fontSize: '1.3rem' }} />
      </IconButton>
      {/* <IconButton
        color="secondary"
        size="large"
        onClick={async (e) => {
          await deletePropositionMutation.mutateAsync({ inspectionId: params?.row?.id });
        }}
      >
        <DeleteIcon sx={{ fontSize: '1.3rem' }} />
      </IconButton> */}
    </div>
  );
}

function TableDataGrid({ setSearchFilter, propositionData, getInspectionsQuery, setPage, setSelectedRows, selectedRows }) {
  const theme = useTheme();
  // const inspectionsData = getInspectionsQuery?.data?.listInterventions;
  const navigate = useNavigate();
  const useGetSettingsPreferencesQuery = useGetSettingsPreferences();

  const columns = [
    {
      field: 'reference',
      headerName: 'Référence',
      sortable: false,
      hideable: false,
      minWidth: 100,
      flex: 1,
      filterable: false,
      disableExport: true,
      renderCell: (params) => {
        return <div>{params?.row?.reference}</div>;
      }
    },
    {
      field: 'chantier_reference',
      headerName: 'Intitulé Client',
      sortable: false,
      hideable: false,
      minWidth: 100,
      flex: 1,
      filterable: false,
      disableExport: true,
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
      field: 'date',
      headerName: "Date d'affectation",
      sortable: false,
      filterable: false,
      minWidth: 100,
      flex: 1,
      renderCell: (params) => {
        return <div>{moment(params?.row?.created_at).format('LL')}</div>;
      }
    },
    {
      field: 'debut',
      headerName: 'Début',
      sortable: false,
      filterable: false,
      minWidth: 100,
      flex: 1,
      renderCell: (params) => {
        return <div>{moment(params?.row?.debut).format('LLL')}</div>;
      }
    },
    {
      field: 'fin',
      headerName: 'Fin',
      sortable: false,
      filterable: false,
      minWidth: 100,
      flex: 1,
      renderCell: (params) => {
        return <div>{moment(params?.row?.fin).format('LLL')}</div>;
      }
    },
    {
      field: 'technicien_name',
      headerName: 'Collaborateur',
      sortable: false,
      hideable: false,
      minWidth: 100,
      flex: 1,
      filterable: false,
      disableExport: true,
      renderCell: (params) => {
        return <div>{params?.row?.collaborator?.name}</div>;
      }
    },
    {
      field: 'addresse',
      headerName: 'Adresse',
      sortable: false,
      filterable: false,
      minWidth: 100,
      flex: 1,
      renderCell: (params) => {
        return <div>{params?.row?.client?.address}</div>;
      }
    },
    // {
    //   field: 'operation',
    //   headerName: 'Opération',
    //   sortable: false,
    //   hideable: false,
    //   minWidth: 100,
    //   flex: 1,
    //   filterable: false,
    //   disableExport: true,
    //   renderCell: (params) => {
    //     return <div>{params?.row?.operation?.reference}</div>;
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
        rows={propositionData?.data || []}
        columns={columns}
        pageSize={parseInt(useGetSettingsPreferencesQuery?.data?.default_pagination) || 10}
        rowsPerPageOptions={[parseInt(useGetSettingsPreferencesQuery?.data?.default_pagination) || 10]}
        onPageSizeChange={(e) => console.log(e)}
        disableSelectionOnClick={true}
        rowCount={propositionData?.total || 0}
        loading={getInspectionsQuery.isLoading || getInspectionsQuery.isFetching}
        pagination
        filterMode="server"
        onFilterModelChange={(e) => {
          setSearchFilter(e?.quickFilterValues);
        }}
        paginationMode="server"
        onPageChange={(newPage) => setPage(newPage + 1)}
        // onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        initialState={[]}
        keepNonExistentRowsSelected
        checkboxSelection={true}
        onSelectionModelChange={(e) => {
          setSelectedRows(e);
        }}
        selectionModel={selectedRows}
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
