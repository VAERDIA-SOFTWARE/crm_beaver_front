import { AssignmentTurnedInOutlined, PendingActionsOutlined } from '@mui/icons-material';
import { Fab, Grid, IconButton, Tooltip } from '@mui/material';
import { Box } from '@mui/system';
import { DataGrid } from '@mui/x-data-grid';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainCard from 'ui-component/cards/MainCard';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import AddIcon from '@mui/icons-material/AddTwoTone';

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
    field: 'status',
    headerName: 'Status',
    sortable: false,
    hideable: false,
    filterable: false,
    disableExport: true,
    width: 80,

    renderCell: (params) => {
      return (
        <>
          {params?.row?.status === 'Active' ? (
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
    width: 150,
    editable: true
  },
  {
    field: 'name',
    headerName: 'Nom et Prénom',
    width: 150,
    editable: true
  },
  {
    field: 'address',
    headerName: 'Adresse',
    sortable: false,
    width: 160
  },
  {
    field: 'code_postal',
    headerName: 'Code Postale',
    sortable: false,
    width: 160
  },
  {
    field: 'category',
    headerName: 'catégorie',
    sortable: false,
    width: 160
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

const rows = [
  {
    id: 1,
    status: 'Active',
    reference: 'ABC12345',
    fullname: 'John Doe',
    adresse: '123 Main St',
    zip_code: '12345',
    category: 'Category 1',
    phone_number: '555-123-4567',
    email: 'johndoe@example.com'
  },
  {
    id: 2,
    status: 'Inactive',
    reference: 'DEF67890',
    fullname: 'Jane Smith',
    adresse: '456 Elm St',
    zip_code: '67890',
    category: 'Category 2',
    phone_number: '555-987-6543',
    email: 'janesmith@example.com'
  },
  {
    id: 1,
    status: 'Active',
    reference: 'ABC12345',
    fullname: 'John Doe',
    adresse: '123 Main St',
    zip_code: '12345',
    category: 'Category 1',
    phone_number: '555-123-4567',
    email: 'johndoe@example.com'
  },
  {
    id: 2,
    status: 'Inactive',
    reference: 'DEF67890',
    fullname: 'Jane Smith',
    adresse: '456 Elm St',
    zip_code: '67890',
    category: 'Category 2',
    phone_number: '555-987-6543',
    email: 'janesmith@example.com'
  },
  {
    id: 1,
    status: 'Active',
    reference: 'ABC12345',
    fullname: 'John Doe',
    adresse: '123 Main St',
    zip_code: '12345',
    category: 'Category 1',
    phone_number: '555-123-4567',
    email: 'johndoe@example.com'
  },
  {
    id: 2,
    status: 'Inactive',
    reference: 'DEF67890',
    fullname: 'Jane Smith',
    adresse: '456 Elm St',
    zip_code: '67890',
    category: 'Category 2',
    phone_number: '555-987-6543',
    email: 'janesmith@example.com'
  },
  {
    id: 1,
    status: 'Active',
    reference: 'ABC12345',
    fullname: 'John Doe',
    adresse: '123 Main St',
    zip_code: '12345',
    category: 'Category 1',
    phone_number: '555-123-4567',
    email: 'johndoe@example.com'
  },
  {
    id: 2,
    status: 'Inactive',
    reference: 'DEF67890',
    fullname: 'Jane Smith',
    adresse: '456 Elm St',
    zip_code: '67890',
    category: 'Category 2',
    phone_number: '555-987-6543',
    email: 'janesmith@example.com'
  },
  {
    id: 1,
    status: 'Active',
    reference: 'ABC12345',
    fullname: 'John Doe',
    adresse: '123 Main St',
    zip_code: '12345',
    category: 'Category 1',
    phone_number: '555-123-4567',
    email: 'johndoe@example.com'
  },
  {
    id: 2,
    status: 'Inactive',
    reference: 'DEF67890',
    fullname: 'Jane Smith',
    adresse: '456 Elm St',
    zip_code: '67890',
    category: 'Category 2',
    phone_number: '555-987-6543',
    email: 'janesmith@example.com'
  },
  {
    id: 1,
    status: 'Active',
    reference: 'ABC12345',
    fullname: 'John Doe',
    adresse: '123 Main St',
    zip_code: '12345',
    category: 'Category 1',
    phone_number: '555-123-4567',
    email: 'johndoe@example.com'
  },
  {
    id: 2,
    status: 'Inactive',
    reference: 'DEF67890',
    fullname: 'Jane Smith',
    adresse: '456 Elm St',
    zip_code: '67890',
    category: 'Category 2',
    phone_number: '555-987-6543',
    email: 'janesmith@example.com'
  },
  {
    id: 1,
    status: 'Active',
    reference: 'ABC12345',
    fullname: 'John Doe',
    adresse: '123 Main St',
    zip_code: '12345',
    category: 'Category 1',
    phone_number: '555-123-4567',
    email: 'johndoe@example.com'
  },
  {
    id: 2,
    status: 'Inactive',
    reference: 'DEF67890',
    fullname: 'Jane Smith',
    adresse: '456 Elm St',
    zip_code: '67890',
    category: 'Category 2',
    phone_number: '555-987-6543',
    email: 'janesmith@example.com'
  },
  {
    id: 1,
    status: 'Active',
    reference: 'ABC12345',
    fullname: 'John Doe',
    adresse: '123 Main St',
    zip_code: '12345',
    category: 'Category 1',
    phone_number: '555-123-4567',
    email: 'johndoe@example.com'
  },
  {
    id: 2,
    status: 'Inactive',
    reference: 'DEF67890',
    fullname: 'Jane Smith',
    adresse: '456 Elm St',
    zip_code: '67890',
    category: 'Category 2',
    phone_number: '555-987-6543',
    email: 'janesmith@example.com'
  },
  {
    id: 1,
    status: 'Active',
    reference: 'ABC12345',
    fullname: 'John Doe',
    adresse: '123 Main St',
    zip_code: '12345',
    category: 'Category 1',
    phone_number: '555-123-4567',
    email: 'johndoe@example.com'
  },
  {
    id: 2,
    status: 'Inactive',
    reference: 'DEF67890',
    fullname: 'Jane Smith',
    adresse: '456 Elm St',
    zip_code: '67890',
    category: 'Category 2',
    phone_number: '555-987-6543',
    email: 'janesmith@example.com'
  },
  {
    id: 1,
    status: 'Active',
    reference: 'ABC12345',
    fullname: 'John Doe',
    adresse: '123 Main St',
    zip_code: '12345',
    category: 'Category 1',
    phone_number: '555-123-4567',
    email: 'johndoe@example.com'
  },
  {
    id: 2,
    status: 'Inactive',
    reference: 'DEF67890',
    fullname: 'Jane Smith',
    adresse: '456 Elm St',
    zip_code: '67890',
    category: 'Category 2',
    phone_number: '555-987-6543',
    email: 'janesmith@example.com'
  }
];
function LeadsDataGrid(leadsData) {
  const navigate = useNavigate();
  return (
    <MainCard
      title={'Liste des Leads'}
      secondary={
        <Grid item xs={12} sm={12} sx={{ textAlign: 'start' }}>
          <Tooltip title="Ajouter Leads">
            <Fab
              color="primary"
              size="small"
              onClick={() => navigate(`/leads/create`)}
              sx={{ boxShadow: 'none', ml: 1, width: 32, height: 32, minHeight: 32 }}
            >
              <AddIcon fontSize="small" />
            </Fab>
          </Tooltip>
        </Grid>
      }
    >
      <Box sx={{ height: 800, width: '100%' }}>
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
          rows={leadsData || rows}
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
        />
      </Box>
    </MainCard>
  );
}

export default LeadsDataGrid;
