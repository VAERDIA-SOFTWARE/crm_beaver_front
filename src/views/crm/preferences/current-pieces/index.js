import * as React from 'react';
// material-ui
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import {
  DataGrid,
  frFR,
  GridToolbar,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarQuickFilter
} from '@mui/x-data-grid';
import { useGetSettingsCurrentPieces, useGetSettingsPreferences, useUpdateSettingsCurrentPiecesDetails } from 'services/settings.service';
import { useQueryClient } from '@tanstack/react-query';

const ClientsList = () => {
  const [page, setPage] = React.useState(1);
  const [searchFilter, setSearchFilter] = React.useState('');
  const getSettingsCurrentPiecesQuery = useGetSettingsCurrentPieces({ page });
  return (
    <MainCard title="Liste des Références" content={false}>
      <TableDataGrid getSettingsCurrentPiecesQuery={getSettingsCurrentPiecesQuery} setPage={setPage} setSearchFilter={setSearchFilter} />
    </MainCard>
  );
};
export default ClientsList;
// function EditCell({ params }) {
//   const navigate = useNavigate();
//   return (
//     <div>
//       <IconButton
//         color="secondary"
//         size="large"
//         onClick={(e) => {
//           navigate(`/settings/current-pieces/${params?.row?.id}`);
//         }}
//       >
//         <VisibilityRoundedIcon sx={{ fontSize: '1.3rem' }} />
//       </IconButton>
//     </div>
//   );
// }

function TableDataGrid({ setSearchFilter, getSettingsCurrentPiecesQuery, setPage }) {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const updateSettingsCurrentPiecesMutation = useUpdateSettingsCurrentPiecesDetails();
  const useGetSettingsPreferencesQuery = useGetSettingsPreferences();

  const columns = [
    { field: 'type', headerName: 'Type', sortable: false, filterable: false, minWidth: 100, flex: 1 },
    {
      field: 'prefix',
      headerName: 'Prefix',
      sortable: false,
      filterable: false,
      minWidth: 100,
      flex: 1,
      editable: true,
      valueGetter: (params) => {
        return params.row.prefix || '';
      },
      valueSetter: async (params) => {
        try {
          await updateSettingsCurrentPiecesMutation.mutateAsync({
            id: params.row?.id,
            values: { prefix: params.value, format: params.row?.format }
          });
          queryClient.invalidateQueries();
          return { ...params.row, prefix: params.value };
        } catch (error) {
          return { ...params.row, prefix: params.row?.prefix };
        } finally {
        }
      }
    },
    { field: 'format', headerName: 'Format', sortable: false, filterable: false, minWidth: 100, flex: 1 },
    { field: 'updated_at', headerName: 'Modifié le', sortable: false, filterable: false, minWidth: 100, flex: 1 }
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
        rows={getSettingsCurrentPiecesQuery.data?.data || getSettingsCurrentPiecesQuery.data || []}
        columns={columns}
        pageSize={parseInt(useGetSettingsPreferencesQuery?.data?.default_pagination) || 10}
        rowsPerPageOptions={[parseInt(useGetSettingsPreferencesQuery?.data?.default_pagination) || 10]}
        onPageSizeChange={(e) => console.log(e)}
        checkboxSelection={false}
        disableSelectionOnClick={true}
        rowCount={getSettingsCurrentPiecesQuery.data?.total || 0}
        loading={getSettingsCurrentPiecesQuery.isLoading || getSettingsCurrentPiecesQuery.isFetching}
        pagination
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
