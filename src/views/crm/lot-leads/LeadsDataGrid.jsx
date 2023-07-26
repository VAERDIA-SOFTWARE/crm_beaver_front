import { AssignmentTurnedInOutlined, PendingActionsOutlined } from '@mui/icons-material';
import { Fab, Grid, IconButton, TextField, Tooltip } from '@mui/material';
import { Box } from '@mui/system';
import { DataGrid } from '@mui/x-data-grid';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainCard from 'ui-component/cards/MainCard';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import AddIcon from '@mui/icons-material/AddTwoTone';
import { LoadingButton } from '@mui/lab';
import SendIcon from '@mui/icons-material/Send';

function EditCell({ params }) {
  const navigate = useNavigate();
  return (
    <div>
      <IconButton
        color="secondary"
        size="large"
        onClick={(e) => {
          navigate(`/leads/${params?.row?.id}/details`);
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
  }
];

function LeadsDataGrid(leadsData) {
  const navigate = useNavigate();
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  return (
    <MainCard
      title={'Liste des Leads'}
      secondary={
        <Grid item xs={12} sm={12} sx={{ textAlign: 'start' }}>
          <LoadingButton
            disabled={rowSelectionModel?.length === 0}
            loadingPosition="end"
            endIcon={<SendIcon />}
            loading={''}
            variant="contained"
            type="submit"
          >
            Convert
          </LoadingButton>
        </Grid>
      }
    >
      <Box sx={{ height: 650, width: '100%' }}>
        <DataGrid
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
          rows={leadsData?.leadsData}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10
              }
            }
          }}
          rowsPerPageOptions={[5, 10, 25]}
          checkboxSelection
          disableRowSelectionOnClick
          onSelectionModelChange={(newRowSelectionModel) => {
            setRowSelectionModel(newRowSelectionModel);
          }}
          selectionModel={rowSelectionModel}
        />
      </Box>
    </MainCard>
  );
}

export default LeadsDataGrid;
