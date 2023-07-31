import { AssignmentTurnedInOutlined, PendingActionsOutlined } from '@mui/icons-material';
import { Button, Fab, Grid, IconButton, TextField, Tooltip } from '@mui/material';
import { Box } from '@mui/system';
import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarQuickFilter,
  frFR
} from '@mui/x-data-grid';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainCard from 'ui-component/cards/MainCard';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import AddIcon from '@mui/icons-material/AddTwoTone';
import { LoadingButton } from '@mui/lab';
import SendIcon from '@mui/icons-material/Send';
import { useLeadsToClients } from 'services/users.service';

function EditCell({ params }) {
  const navigate = useNavigate();
  return (
    <div>
      <IconButton
        color="secondary"
        size="large"
        onClick={(e) => {
          navigate(params?.row?.type === 0 ? `/leads/${params?.row?.id}/details` : `/clients/${params?.row?.id}/details`);
        }}
      >
        <VisibilityRoundedIcon sx={{ fontSize: '1.3rem' }} />
      </IconButton>
    </div>
  );
}
const columns = [
  {
    field: 'type',
    headerName: 'Status',
    sortable: false,
    hideable: false,
    filterable: false,
    disableExport: true,
    width: 55,

    renderCell: (params) => {
      return (
        <>
          {params?.row?.type === 0 ? (
            <PendingActionsOutlined
              sx={{
                color: '#f1c40f'
              }}
            />
          ) : (
            <AssignmentTurnedInOutlined
              sx={{
                color: '#16a34a'
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
    width: 100,
    editable: true
  },
  {
    field: 'name',
    headerName: 'Nom et Prénom',
    width: 200,
    editable: true
  },
  {
    field: 'address',
    headerName: 'Adresse',
    sortable: false,
    width: 350
  },
  {
    field: 'code_postal',
    headerName: 'Code Postal',
    sortable: false,
    width: 80
  },
  {
    field: 'societe',
    headerName: 'Société',
    sortable: false,
    width: 110
  },
  {
    field: 'category',
    headerName: 'catégorie',
    sortable: false,
    width: 140,
    renderCell: (params) => {
      return <>{params?.row?.category?.intitule}</>;
    }
  },
  {
    field: 'phone_number',
    headerName: 'N° téléphone',
    sortable: false,
    width: 160
  },
  {
    field: 'email',
    headerName: 'Email',
    sortable: false,
    width: 160
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

function LeadsDataGrid({ query, leadsData, title, generate, page, setPage, pageSize, setPageSize, searchFilter, setSearchFilter }) {
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const leadsToClientMutation = useLeadsToClients();
  return (
    <MainCard
      title={title}
      secondary={
        <Grid item xs={12} sm={12} sx={{ textAlign: 'start' }}>
          {generate && (
            <LoadingButton
              disabled={rowSelectionModel?.length === 0}
              loadingPosition="end"
              endIcon={<SendIcon />}
              loading={leadsToClientMutation?.isLoading}
              variant="contained"
              onClick={async () => {
                await leadsToClientMutation.mutateAsync({ team_leads: rowSelectionModel });
              }}
            >
              Convert
            </LoadingButton>
          )}
        </Grid>
      }
    >
      <Box sx={{ height: 650, width: '100%' }}>
        <DataGrid
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
          density="compact"
          paginationMode="server"
          filterMode="server"
          rows={leadsData?.data || []}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10
              }
            }
          }}
          rowsPerPageOptions={[5, 10, 25]}
          checkboxSelection={generate}
          disableSelectionOnClick
          onSelectionModelChange={(newRowSelectionModel) => {
            setRowSelectionModel(newRowSelectionModel);
          }}
          onFilterModelChange={(e) => {
            setSearchFilter(e?.quickFilterValues);
          }}
          loading={query?.isLoading || query?.isFetching}
          selectionModel={rowSelectionModel}
          onPageChange={(newPage) => setPage(newPage + 1)}
          pageSize={parseInt(leadsData?.per_page) || 10}
          components={{
            Toolbar: () => <CustomToolbar page={page} searchFilter={searchFilter} />
          }}
          rowCount={leadsData?.total || 0}
        />
      </Box>
    </MainCard>
  );
}

export default LeadsDataGrid;

function CustomToolbar({ searchFilter, page }) {
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

        {/* <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
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
        </div> */}
      </div>
    </GridToolbarContainer>
  );
}
