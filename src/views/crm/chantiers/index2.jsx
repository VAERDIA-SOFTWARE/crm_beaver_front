import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import * as React from 'react';

// material-ui
import SendIcon from '@mui/icons-material/Send';
import { Box, Button, Grid, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project imports
import MainCard from 'ui-component/cards/MainCard';

// assets
import { LoadingButton } from '@mui/lab';
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
import { useLocation, useNavigate } from 'react-router-dom';
import { useGetChantiers } from 'services/chantier.service';
import { useEchantionner, useGenerateInspections } from 'services/lot-chantiers.service';
import { useGetSettingsPreferences } from 'services/settings.service';
import axiosClient from 'axiosClient';

const LeadsList = ({
  title,
  a_inspecterFilter,
  disableCheckboxSelection,
  disableFilters = false,
  etatFilter = 'false',
  disableCreate = false,
  LotChantierId,
  userId,
  genererInspections = false,
  genererFakeInspections = false,
  echantionnerButton = false
}) => {
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  const [searchFilter, setSearchFilter] = React.useState('');
  const location = useLocation();
  const data = location.state;

  const [selectedRows, setSelectedRows] = React.useState([]);

  const getChantiersQuery = useGetChantiers({
    LotChantierId: LotChantierId || data?.LotChantierId,
    a_inspecterFilter: a_inspecterFilter,
    page,
    etatFilter,
    searchFilter,
    userId
  });

  const chantiersData = getChantiersQuery.data?.listChantier?.data;

  const useGenerateInspectionsMutation = useGenerateInspections();

  const useEchantionnerMutation = useEchantionner();

  return (
    <MainCard
      title={title ?? ''}
      content={false}
      secondary={
        <>
          {echantionnerButton && (
            <Grid item xs={12} sm={12} sx={{ textAlign: 'start' }}>
              <LoadingButton
                disabled={!chantiersData?.length}
                loadingPosition="end"
                endIcon={<SendIcon />}
                loading={useEchantionnerMutation.isLoading}
                variant="contained"
                onClick={async () => {
                  try {
                    await useEchantionnerMutation.mutateAsync({
                      values: { chantiers: selectedRows },
                      LotChantierId: LotChantierId
                    });
                    setSelectedRows([]);
                  } catch (error) {}
                }}
              >
                {selectedRows?.length ? 'Echantionner' : 'Echantionner tout'}
              </LoadingButton>
            </Grid>
          )}
          {genererInspections && (
            <Grid item xs={12} sm={12} sx={{ textAlign: 'start' }}>
              <LoadingButton
                disabled={!chantiersData?.length}
                loadingPosition="end"
                endIcon={<SendIcon />}
                loading={useGenerateInspectionsMutation.isLoading}
                variant="contained"
                onClick={async () => {
                  try {
                    await useGenerateInspectionsMutation.mutateAsync({
                      LotChantierId,
                      values: { chantiers: selectedRows }
                    });
                    navigate('/propositions/list');
                  } catch (error) {}
                }}
              >
                {selectedRows?.length ? 'Générer Interventions' : 'Générer tout les Interventions'}
              </LoadingButton>
            </Grid>
          )}
          {genererFakeInspections && (
            <Grid item xs={12} sm={12} sx={{ textAlign: 'start' }}>
              <LoadingButton
                loadingPosition="end"
                endIcon={<SendIcon />}
                loading={useGenerateInspectionsMutation.isLoading}
                variant="contained"
              >
                Générer Interventions
              </LoadingButton>
            </Grid>
          )}
        </>
      }
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
        {/* {getChantiersQuery?.data?.etats?.map((e) => (
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
        ))} */}
      </div>
      <TableDataGrid
        getChantiersQuery={getChantiersQuery}
        setPage={setPage}
        disableFilters={disableFilters}
        disableCheckboxSelection={disableCheckboxSelection}
        setSearchFilter={setSearchFilter}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        LotChantierId={LotChantierId || data?.LotChantierId}
        a_inspecterFilter={a_inspecterFilter}
        page={page}
        etatFilter={etatFilter}
        searchFilter={searchFilter}
        userId={userId}
      />
    </MainCard>
  );
};

export default LeadsList;

function EditCell({ params }) {
  const navigate = useNavigate();

  return (
    <div>
      <IconButton
        color="secondary"
        size="large"
        onClick={(e) => {
          navigate(`/chantiers/${params?.row?.id}/details`);
        }}
      >
        <VisibilityRoundedIcon sx={{ fontSize: '1.3rem' }} />
      </IconButton>
    </div>
  );
}

function TableDataGrid({
  setSelectedRows,
  selectedRows,
  setSearchFilter,
  getChantiersQuery,
  setPage,
  disableFilters,
  disableCheckboxSelection = true,

  LotChantierId,
  a_inspecterFilter,
  page,
  etatFilter,
  searchFilter,
  userId,
  paginated
}) {
  const theme = useTheme();
  const useGetSettingsPreferencesQuery = useGetSettingsPreferences();

  const rows = getChantiersQuery.data?.listChantier;

  const columns = [
    // {
    //   field: 'etat_detaille',
    //   headerName: 'Etat',
    //   sortable: false,
    //   hideable: false,
    //   filterable: false,
    //   disableExport: false,
    //   renderCell: (params) => {
    //     return (
    //       <div>
    //         <div style={{ width: 10, height: 10, backgroundColor: params?.row?.etat_detaille?.couleur, borderRadius: 9999 }} />
    //       </div>
    //     );
    //   }
    // },
    // {
    //   field: 'reference',
    //   headerName: 'Référence',
    //   sortable: false,
    //   filterable: false
    // },
    {
      field: 'nom_client',
      headerName: 'Intitulé Client',
      sortable: false,
      hideable: false,
      filterable: false,
      disableExport: false,
      minWidth: 100,
      flex: 1,
      renderCell: (params) => {
        return <div>{params?.row?.lot_chantier?.contrat?.user?.name}</div>;
      }
    },
    {
      field: 'ville',
      headerName: 'Adresse',
      sortable: false,
      hideable: false,
      filterable: false,
      disableExport: false,
      minWidth: 100,
      flex: 1,
      renderCell: (params) => {
        return <>{params?.row?.ville}</>;
      }
    },
    {
      field: 'ref_contrat',
      headerName: 'Numéro Téléphone',
      sortable: false,
      hideable: false,
      filterable: false,
      disableExport: false,
      minWidth: 100,
      flex: 1,
      renderCell: (params) => {
        return <div>{params?.row?.lot_chantier?.contrat?.reference}</div>;
      }
    },
    {
      field: 'ref_lot',
      headerName: 'Catégorie',
      sortable: false,
      hideable: false,
      filterable: false,
      disableExport: false,
      minWidth: 100,
      flex: 1,
      renderCell: (params) => {
        return <div>{params?.row?.lot_chantier?.reference}</div>;
      }
    },
    {
      field: 'Bénéficiaire',
      headerName: 'Société',
      sortable: false,
      hideable: false,
      filterable: false,
      disableExport: false,
      minWidth: 100,
      flex: 1,
      renderCell: (params) => {
        return (
          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {params?.row?.nom_benificiaire + ' ' + params?.row?.prenom_benificiary}
          </div>
        );
      }
    },
    {
      field: 'collaborateur',
      headerName: 'Status',
      sortable: false,
      hideable: false,
      filterable: false,
      disableExport: false,
      minWidth: 100,
      flex: 1,
      renderCell: (params) => {
        const name = params?.row?.inspections[0]?.technicien?.name;
        const isNameLong = name && name.length > 4;

        return (
          <div>
            <div className={`circle ${isNameLong ? 'red' : 'green'}`}></div>
            <div>{name || 'N/A'}</div>
          </div>
        );
      }
    },
    {
      field: 'action',
      headerName: 'Action',
      sortable: false,
      filterable: false,
      disableExport: true,
      hideable: false,
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
          Toolbar: () =>
            (
              <CustomToolbar
                LotChantierId={LotChantierId}
                a_inspecterFilter={a_inspecterFilter}
                page={page}
                etatFilter={etatFilter}
                searchFilter={searchFilter}
                userId={userId}
                paginated={paginated}
              />
            ) || GridToolbar
        }}
        rows={rows?.data || []}
        columns={columns}
        pageSize={parseInt(useGetSettingsPreferencesQuery?.data?.default_pagination) || 10}
        rowsPerPageOptions={[parseInt(useGetSettingsPreferencesQuery?.data?.default_pagination) || 10]}
        onPageSizeChange={(e) => console.log(e)}
        checkboxSelection={disableCheckboxSelection ? false : true}
        onSelectionModelChange={(e) => {
          setSelectedRows(e);
        }}
        selectionModel={selectedRows}
        disableSelectionOnClick={true}
        rowCount={rows?.total || 0}
        loading={getChantiersQuery.isLoading || getChantiersQuery.isFetching}
        pagination
        paginationMode="server"
        filterMode="server"
        onFilterModelChange={(e) => {
          setSearchFilter(e?.quickFilterValues);
        }}
        onPageChange={(newPage) => {
          setPage(newPage + 1);
        }}
        keepNonExistentRowsSelected
        // onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        initialState={[]}
      />
    </Box>
  );
}

function CustomToolbar({ searchFilter, page, userId, LotChantierId, a_inspecterFilter, paginated, etatFilter }) {
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
          <Button
            LinkComponent={'a'}
            target="_blank"
            href={`${process.env.REACT_APP_API_URL}chantiers/export-excel?${paginated ? `paginated=${paginated}&` : ''}${
              LotChantierId ? `LotChantierId=${LotChantierId}&` : ''
            }${[0, 1].includes(a_inspecterFilter) ? `InspectionChantier=${a_inspecterFilter}&` : ''}${
              etatFilter !== 'false' ? ([1].includes(etatFilter) ? `etat=1,2&` : `etat=${etatFilter}&`) : ''
            }${searchFilter ? `search=${searchFilter}&` : ''}${userId ? `userId=${userId}&` : ''}`}
          >
            Exporter
          </Button>
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

function NoFilterToolbar({ disableFilters }) {
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

        {false && (
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
        )}
      </div>
    </GridToolbarContainer>
  );
}
