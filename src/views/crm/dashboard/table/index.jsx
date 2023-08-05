import { CardContent, Checkbox, Dialog, DialogContent, DialogTitle, Fade, FormControlLabel, Grid, IconButton } from '@mui/material';
import { Box, styled } from '@mui/system';
import MainCard from 'ui-component/cards/MainCard';
import EditIcon from '@mui/icons-material/Edit';
import { gridSpacing } from 'store/constant';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NoAccountsIcon from '@mui/icons-material/NoAccounts';
import { DataGrid, frFR } from '@mui/x-data-grid';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import SignalCellularNoSimOutlinedIcon from '@mui/icons-material/SignalCellularNoSimOutlined';
const TablesDashboard = ({
  open,
  handleOpenDialog,
  handleCloseDialog,
  reportCard,
  setReportCard,
  cardInformation,
  setCardInformation,
  theme
}) => {
  return (
    <MainCard
      sx={{ boxShadow: 'unset' }}
      settingsIcon={true}
      handleOpenDialog={handleOpenDialog}
      boxShadow={false}
      shadow={false}
      border={false}
      title="Listes des ressources par jour"
    >
      {open && open == true && (
        <CustomizedDialogs
          open={open}
          onClose={handleCloseDialog}
          reportCard={reportCard}
          setReportCard={setReportCard}
          cardInformation={cardInformation}
          setCardInformation={setCardInformation}
        />
      )}

      <Grid container spacing={gridSpacing}>
        <Grid item xs={12} lg={12} md={12}>
          {cardInformation
            .filter((element) => element.default)
            .map((element) => (
              <Fade in={true} out={true} timeout={500} key={element.id}>
                <Grid item xs={12} lg={12} sm={12}>
                  <TableDataGrid theme={theme} articlesData={element} id={element?.id} />
                </Grid>
              </Fade>
            ))}
        </Grid>
      </Grid>
    </MainCard>
  );
};
export default TablesDashboard;

// Modal Parts
const CustomizedDialogs = ({ open, onClose, reportCard, setReportCard, cardInformation, setCardInformation }) => {
  return (
    <BootstrapDialog open={open} onClose={onClose} aria-labelledby="customized-dialog-title">
      <BootstrapDialogTitle open={open} onClose={onClose} id="customized-dialog-title">
        Statistiques disponibles
      </BootstrapDialogTitle>
      <DialogContent dividers>
        <ModalContent
          reportCard={reportCard}
          setReportCard={setReportCard}
          cardInformation={cardInformation}
          setCardInformation={setCardInformation}
        />
      </DialogContent>
    </BootstrapDialog>
  );
};
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuDialogContent-root': {
    padding: theme.spacing(2)
  },
  '& .MuDialogActions-root': {
    padding: theme.spacing(1)
  }
}));
const BootstrapDialogTitle = ({ children, onClose, ...other }) => (
  <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
    {children}
    {onClose ? (
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 10,
          top: 10,
          color: (theme) => theme.palette.grey[500]
        }}
      >
        <CloseIcon />
      </IconButton>
    ) : null}
  </DialogTitle>
);

const ModalContent = ({ cardInformation, setCardInformation }) => {
  const handleChangeState = (event) => {
    const { name, checked } = event.target;
    const updatedCardInfo = cardInformation.map((item) => {
      if (item.id === Number(name)) {
        return { ...item, default: checked };
      }
      return item;
    });
    const selectedItems = updatedCardInfo.filter((item) => item.default);
    if (selectedItems.length <= 1) {
      setCardInformation(updatedCardInfo);
    } else {
      toast.error("Vous ne pouvez pas choisir plus qu'une liste");
    }
  };

  return (
    <CardContent>
      {cardInformation.length > 0 && (
        <Grid container spacing={0}>
          {cardInformation.map((item) => (
            <Grid item xs={12} key={item.id}>
              <FormControlLabel
                control={<Checkbox checked={item.default} onChange={handleChangeState} name={item.id} color="primary" />}
                label={item.title}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </CardContent>
  );
};

function TableDataGrid({ setPageSize, articlesData, setPage, theme, id }) {
  const articlesColumns = [
    {
      field: 'active',
      headerName: 'Statut',
      sortable: false,
      hideable: false,
      filterable: false,
      disableExport: true,
      renderCell: (params) => {
        return (
          <>
            {params?.row?.active ? (
              <ArticleOutlinedIcon
                sx={{
                  color: '#16a34a'
                }}
              />
            ) : (
              <SignalCellularNoSimOutlinedIcon
                sx={{
                  color: '#dc2626'
                }}
              />
            )}
          </>
        );
      }
    },
    { field: 'reference', headerName: 'Référence', sortable: false, filterable: false, minWidth: 100, flex: 1 },
    { field: 'nom', headerName: 'Intitulé', sortable: false, filterable: false, minWidth: 100, flex: 1 },
    { field: 'prix_unitaire', headerName: 'Prix Unitaire', sortable: false, filterable: false, minWidth: 100, flex: 1 },
    { field: 'remise', headerName: 'Remise', sortable: false, filterable: false, minWidth: 100, flex: 1 },
    {
      field: 'unite_id',
      headerName: 'Unité',
      sortable: false,
      filterable: false,
      minWidth: 100,
      flex: 1,
      renderCell: (params) => {
        return <>{params?.row?.unite?.intitule}</>;
      }
    },
    {
      field: 'p_category_article_id',
      headerName: 'Catégorie',
      sortable: false,
      filterable: false,
      minWidth: 100,
      flex: 1,
      renderCell: (params) => {
        return <>{params?.row?.category?.intitule}</>;
      }
    }
  ];
  const TechnicientsColumns = [
    {
      field: 'couleur',
      headerName: '',
      sortable: false,
      filterable: false,
      hideable: false,
      width: 40,
      renderCell: (params) => {
        return (
          <div>
            <div style={{ width: 10, height: 10, backgroundColor: params?.row?.couleur, borderRadius: 9999 }} />
          </div>
        );
      }
    },
    {
      field: 'active_status',
      headerName: 'Statut',
      sortable: false,
      hideable: false,
      filterable: false,
      disableExport: true,
      renderCell: (params) => {
        return (
          <>
            {params?.row?.active_status ? (
              <AccountCircleIcon
                sx={{
                  color: '#16a34a'
                }}
              />
            ) : (
              <NoAccountsIcon
                sx={{
                  color: '#dc2626'
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
      sortable: false,
      filterable: false
    },
    { field: 'name', headerName: 'Intitulé', sortable: false, filterable: false, minWidth: 100, flex: 1 },
    { field: 'email', headerName: 'E-mail', sortable: false, filterable: false, minWidth: 100, flex: 1 },
    {
      field: 'phone_number',
      headerName: 'Numéro de téléphone',
      sortable: false,
      filterable: false,

      minWidth: 100,
      flex: 1
    },
    {
      field: 'address',
      headerName: 'Addresse',
      sortable: false,
      filterable: false,
      minWidth: 100,
      flex: 1
    },
    {
      field: 'fax',
      headerName: 'Fax',
      sortable: false,
      filterable: false,

      minWidth: 100,
      flex: 1
    }
  ];
  let columns = [
    {
      field: 'etat_detaille',
      headerName: 'Etat',
      sortable: false,
      hideable: true,
      filterable: false
    },
    {
      field: 'reference',
      headerName: 'Référence',
      sortable: false,
      hideable: false,
      minWidth: 100,
      flex: 1,
      filterable: false,
      renderCell: (params) => {
        return <div>{params?.row?.reference}</div>;
      }
    },
    {
      field: 'statut',
      headerName: 'Statut',
      sortable: false,
      filterable: false,
      minWidth: 50,
      flex: 1
    },
    {
      field: 'reference_chantier',
      headerName: 'Intitulé Client',
      sortable: false,
      hideable: true,
      minWidth: 100,
      flex: 1,
      filterable: false,
      renderCell: (params) => {
        return (
          <div
            style={{
              cursor: 'pointer'
            }}
          >
            {params?.row?.client?.name}
          </div>
        );
      }
    },
    {
      field: 'collaborator',
      headerName: 'Collaborator',
      sortable: false,
      hideable: true,
      minWidth: 100,
      flex: 1,
      filterable: false,
      renderCell: (params) => {
        return <div>{params?.row?.collaborator?.name}</div>;
      }
    },
    {
      field: 'operation',
      headerName: 'Opération',
      sortable: false,
      hideable: true,
      minWidth: 100,
      flex: 1,
      filterable: false,
      renderCell: (params) => {
        return <div>{params?.row?.operation?.reference}</div>;
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
        return <div>{params?.row?.chantier?.code_postal + ' - ' + params?.row?.chantier?.ville}</div>;
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
        return <div>{params?.row?.debut}</div>;
      }
    },
    {
      field: 'date_realise',
      headerName: 'Date Réalisé',
      sortable: false,
      filterable: false,
      minWidth: 100,
      flex: 1,
      renderCell: (params) => {
        return <div>{params?.row?.fin}</div>;
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
        rows={articlesData?.data || []}
        columns={id == 2 ? TechnicientsColumns : id == 3 ? articlesColumns : id == 1 ? columns : []}
        rowsPerPageOptions={[5, 10, 25]}
        paginationMode="server"
        filterMode="server"
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        pageSize={parseInt(articlesData?.per_page) || 10}
        pagination
        checkboxSelection={false}
        rowCount={articlesData?.total || 0}
        onPageChange={(newPage) => setPage(newPage + 1)}
        initialState={[]}
      />
    </Box>
  );
}
