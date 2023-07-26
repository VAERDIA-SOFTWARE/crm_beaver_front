import React, { useEffect, useState } from 'react';

// material-ui
import { Grid, Typography, useMediaQuery, useTheme } from '@mui/material';
import EngineeringIcon from '@mui/icons-material/Engineering';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TaskIcon from '@mui/icons-material/Task';
// project imports

import { gridSpacing } from 'store/constant';
import { useGetDashboardStats } from 'services/settings.service';
import InspectionsBarChart from 'views/crm/clients/list/charts/InspectionsBarChart';
import { format } from 'date-fns';
import MainCard from 'ui-component/cards/MainCard';
import LatestInspectionsTableCard from './LatestInspectionsTableCard';
import RapportPieChartCard from './RapportPieChartCard';
import CustomerSatisfactionCard from 'views/widget/Statistics/CustomerSatisfactionCard';
import useAuth from 'hooks/useAuth';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
  const theme = useTheme();
  const matchDownXs = useMediaQuery(theme.breakpoints.down('sm'));

  const blockSX = {
    p: 2.5,
    borderLeft: '1px solid ',
    borderBottom: '1px solid ',
    borderLeftColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.grey[200],
    borderBottomColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.grey[200]
  };

  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, []);
  const { logout, user } = useAuth();
  const [totalInspectionsValue, setTotalInspectionsFilterValue] = React.useState(format(new Date(), 'yyyy-MM-dd'));

  const [inspectionFilterValue, setInspectionFilterValue] = React.useState('client');
  const dashboardStatsQuery = useGetDashboardStats({ inspectionFilterValue, totalInspectionsValue });
const data = [
  {
    reference: 'R53C46C2354',
    chantier: { reference: 'Intervention 1' },
    technicien: { name: 'John Doe' },
    fin: '2023-06-16'
  },
  {
    reference: '4G756SDFGB',
    chantier: { reference: 'Intervention 2' },
    technicien: { name: 'Tim Bradford' },
    fin: '2023-06-16'
  },
  {
    reference: 'FGYHJK',
    chantier: { reference: 'Intervention 3' },
    technicien: { name: 'Lucy Chen' },
    fin: '2023-06-16'
  },
  {
    reference: 'SFDGHJKL',
    chantier: { reference: 'Intervention 4' },
    technicien: { name: 'Nolan Jackson' },
    fin: '2023-06-16'
  }
  // ...
];

return (
  <Grid container alignItems="stretch" spacing={gridSpacing}>
    {dashboardStatsQuery.isSuccess && (
      <>
        <Grid item xs={12} md={8}>
          <Grid container spacing={gridSpacing}>
            {/* <Grid item xs={12} lg={dashboardStatsQuery?.data?.arrayChantiers !== null ? 6 : 12}>
                <CustomerSatisfactionCard
                  title="Interventions"
                  childStats={dashboardStatsQuery?.data?.arrayStates}
                  mainStats={dashboardStatsQuery?.data?.nbInspections}
                />
                <RevenueCard
              primary="Interventions"
              secondary={dashboardStatsQuery.data?.nbInspections}
              content="$50,032 Last Month"
              iconPrimary={ContentPasteSearchIcon}
              color={theme.palette.secondary.main}
            />
              </Grid> */}
            {/* <Grid item xs={12} lg={6}>
                <CustomerSatisfactionCard
                  title="Interventions"
                  childStats={[
                    { title: 'Proposer', count: 10 },
                    { title: 'Planifier', count: 5 },
                    { title: 'Effectué', count: 3 }
                  ]}
                  mainStats={18}
                />
                
              </Grid> */}
            {/* {dashboardStatsQuery?.data?.arrayChantiers !== null && (
                <Grid item xs={12} lg={6}>
                  <CustomerSatisfactionCard
                    title="Contrats"
                    childStats={[
                      { title: 'A Valider', count: 20 },
                      { title: 'Valide', count: 5 },
                      { title: 'échus', count: 3 }
                    ]}
                    mainStats={28}
                  />
                </Grid>
              )} */}

            {user?.role.includes('admin') ? (
              <Grid item xs={12}>
                <InspectionsBarChart
                  filterValue={inspectionFilterValue}
                  onFilterValueChange={setInspectionFilterValue}
                  filter={[
                    {
                      value: 'client',
                      label: 'Client'
                    },
                    {
                      value: 'technicien',
                      label: 'Technicien'
                    }
                  ]}
                  isLoading={isLoading}
                  title={`Interventions par ${inspectionFilterValue}s`}
                  chartDataa={dashboardStatsQuery.data?.grapheTechniciens}
                />
              </Grid>
            ) : (
              <Grid item xs={12}>
                <InspectionsBarChart
                  title={user?.role.includes('client') ? `Contrats` : `Interventions`}
                  filterValue={inspectionFilterValue}
                  onFilterValueChange={setInspectionFilterValue}
                  isLoading={isLoading}
                  chartDataa={dashboardStatsQuery.data?.barChart}
                />
              </Grid>
            )}
            {/* <Grid item lg={4} md={6} sm={6} xs={12}>
            <EarningCard
              isLoading={isLoading}
              data={dashboardStatsQuery.data?.nbInspections}
              filterValue={totalInspectionsValue}
              onFilterValueChange={setTotalInspectionsFilterValue}
            />
          </Grid>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <TotalOrderLineChartCard isLoading={isLoading} data={dashboardStatsQuery.data?.nbLots} />
          </Grid> */}

            {/* {false && (
                <Grid item lg={4} md={12} sm={12} xs={12}>
                  <Grid container spacing={gridSpacing}>
                    <Grid item sm={6} xs={12} md={6} lg={12}>
                      <TotalIncomeDarkCard isLoading={isLoading} data={dashboardStatsQuery.data?.nbChantiers} />
                    </Grid>
                    <Grid item sm={6} xs={12} md={6} lg={12}>
                      <TotalIncomeLightCard isLoading={isLoading} data={dashboardStatsQuery.data?.nbContract} />
                    </Grid>
                  </Grid>
                </Grid>
              )} */}

            <Grid item xs={12}>
              {/* <LatestInspectionsTableCard title="Derniers Interventions" data={dashboardStatsQuery.data?.Interventions} /> */}
              <LatestInspectionsTableCard title="Derniers Interventions" data={data} />

              {/* <InspectionsList
              title="Interventions"
              disableFilters
              disableCreate
              disableCheckboxSelection={true}
              overrideData={dashboardStatsQuery.data?.Interventions}
              disableAdresse
              disableEtat
              disableAffectationDate
            /> */}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={4}>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12} lg={6}>
              <CustomerSatisfactionCard
                title="Contrats"
                childStats={[
                  { title: 'A Valider', count: 20 },
                  { title: 'Valide', count: 5 },
                  { title: 'échus', count: 3 }
                ]}
                mainStats={28}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <CustomerSatisfactionCard
                title="Interventions"
                childStats={[
                  { title: 'Proposer', count: 10 },
                  { title: 'Planifier', count: 5 },
                  { title: 'Effectué', count: 3 }
                ]}
                mainStats={18}
              />
            </Grid>

            <Grid item xs={12}>
              <MainCard
                content={false}
                sx={{
                  '& svg': {
                    width: 50,
                    height: 50,
                    color: theme.palette.secondary.main,
                    borderRadius: '14px',
                    p: 1.25,
                    bgcolor: theme.palette.mode === 'dark' ? theme.palette.background.default : 'primary.light'
                  }
                }}
              >
                <Grid container alignItems="center" spacing={0}>
                  {dashboardStatsQuery.data?.nbChantiers !== null && (
                    <Grid item xs={12} sm={6} sx={blockSX}>
                      <Grid container alignItems="center" spacing={1} justifyContent={matchDownXs ? 'space-between' : 'center'} gap={2}>
                        <Grid item>
                          <EngineeringIcon sx={{ fill: '#195A82' }} stroke={1.5} />
                        </Grid>
                        <Grid item sm zeroMinWidth>
                          <Typography variant="h5" align="center">
                            {dashboardStatsQuery.data?.nbChantiers}
                          </Typography>
                          <Typography variant="subtitle2" align="center">
                            Interventions Effectué
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  )}
                  {dashboardStatsQuery.data?.nbContract !== null && (
                    <Grid item xs={12} sm={6} sx={blockSX}>
                      <Grid container alignItems="center" spacing={1} justifyContent={matchDownXs ? 'space-between' : 'center'} gap={2}>
                        <Grid item>
                          <AssignmentIcon sx={{ fill: '#195A82' }} stroke={1.5} />
                        </Grid>
                        <Grid item sm zeroMinWidth>
                          <Typography variant="h5" align="center">
                            {dashboardStatsQuery.data?.nbContract}
                          </Typography>
                          <Typography variant="subtitle2" align="center">
                            Contrats échus
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  )}
                  {dashboardStatsQuery.data?.satisfiedRapports !== null && (
                    <Grid item xs={12} sm={6} sx={blockSX}>
                      <Grid container alignItems="center" spacing={1} justifyContent={matchDownXs ? 'space-between' : 'center'} gap={2}>
                        <Grid item>
                          <TaskIcon sx={{ fill: '#195A82' }} stroke={1.5} />
                        </Grid>
                        <Grid item sm zeroMinWidth>
                          <Typography variant="h5" align="center">
                            {dashboardStatsQuery.data?.satisfiedRapports}
                          </Typography>
                          <Typography variant="subtitle2" align="center">
                            Rapport Générer
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  )}
                  {dashboardStatsQuery.data?.inspectionEtatTerminer !== null && (
                    <Grid item xs={12} sm={6} sx={blockSX}>
                      <Grid container alignItems="center" spacing={1} justifyContent={matchDownXs ? 'space-between' : 'center'} gap={2}>
                        <Grid item>
                          <AssignmentTurnedInIcon stroke={1.5} sx={{ fill: '#195A82' }} />
                        </Grid>
                        <Grid item sm zeroMinWidth>
                          <Typography variant="h5" align="center">
                            {dashboardStatsQuery.data?.inspectionEtatTerminer}
                          </Typography>
                          <Typography variant="subtitle2" align="center">
                            Factures Générer
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  )}
                  {dashboardStatsQuery.data?.nbInspectionsToDo !== null && (
                    <Grid item xs={12} sm={12} sx={blockSX}>
                      <Grid container alignItems="center" spacing={1} justifyContent={matchDownXs ? 'space-between' : 'center'} gap={2}>
                        <Grid item>
                          <EngineeringIcon stroke={1.5} sx={{ fill: '#195A82' }} />
                        </Grid>
                        <Grid item sm zeroMinWidth>
                          <Typography variant="h5" align="center">
                            {dashboardStatsQuery.data?.nbInspectionsToDo}
                          </Typography>
                          <Typography variant="subtitle2" align="center">
                            Interventions à faire
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  )}
                  {dashboardStatsQuery.data?.nbInspectionsValider !== null && (
                    <Grid item xs={12} sm={12} sx={blockSX}>
                      <Grid container alignItems="center" spacing={1} justifyContent={matchDownXs ? 'space-between' : 'center'} gap={2}>
                        <Grid item>
                          <EngineeringIcon stroke={1.5} sx={{ fill: '#195A82' }} />
                        </Grid>
                        <Grid item sm zeroMinWidth>
                          <Typography variant="h5" align="center">
                            {dashboardStatsQuery.data?.nbInspectionsValider}
                          </Typography>
                          <Typography variant="subtitle2" align="center">
                            Interventions Validées
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  )}
                  {dashboardStatsQuery.data?.nbInspectionsTerminer !== null && (
                    <Grid item xs={12} sm={12} sx={blockSX}>
                      <Grid container alignItems="center" spacing={1} justifyContent={matchDownXs ? 'space-between' : 'center'} gap={2}>
                        <Grid item>
                          <EngineeringIcon stroke={1.5} sx={{ fill: '#195A82' }} />
                        </Grid>
                        <Grid item sm zeroMinWidth>
                          <Typography variant="h5" align="center">
                            {dashboardStatsQuery.data?.nbInspectionsTerminer}
                          </Typography>
                          <Typography variant="subtitle2" align="center">
                            Interventions terminer
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  )}
                </Grid>
              </MainCard>
            </Grid>

            <Grid item xs={12} spacing={1} gap={2}>
              <div>
                <RapportPieChartCard
                  chartData={{
                    height: 300,
                    type: 'pie',
                    options: {
                      colors: dashboardStatsQuery.data?.inspectionsByEtat?.colors,
                      chart: {
                        id: 'chantier-chart'
                      },
                      labels: ['Intervention Crée', 'Intervention terminée', 'Intervention Validée', 'Rapport Generé'],
                      // labels: dashboardStatsQuery.data?.inspectionsByEtat?.labels,
                      legend: {
                        show: true,
                        position: 'bottom',
                        fontFamily: 'inherit',
                        labels: {
                          colors: 'inherit'
                        }
                      },

                      dataLabels: {
                        enabled: true,
                        dropShadow: {
                          enabled: false
                        }
                      }
                      // theme: {
                      //   monochrome: {
                      //     enabled: true
                      //   }
                      // }
                    },
                    // series: dashboardStatsQuery.data?.inspectionsByEtat?.series
                    series: [30, 40, 20, 10]
                  }}
                  title="Interventions"
                />
              </div>
              {/* <div style={{ marginTop: '2rem' }}>
                <RapportPieChartCard
                  chartData={{
                    height: 300,
                    type: 'pie',

                    options: {
                      colors: dashboardStatsQuery.data?.inspectionsByEtat?.colors,
                      chart: {
                        id: 'chantier-chart'
                      },
                      // labels: ['Intervention Crée', 'Intervention terminée', 'Intervention Validée', 'Rapport Generé'],
                      labels: dashboardStatsQuery.data?.inspectionsByStatus?.labels,
                      legend: {
                        show: true,
                        position: 'bottom',
                        fontFamily: 'inherit',
                        labels: {
                          colors: 'inherit'
                        }
                      },
                      dataLabels: {
                        enabled: true,
                        dropShadow: {
                          enabled: false
                        }
                      },
                      theme: {
                        mode: 'light',
                        palette: 'palette1',
                        monochrome: {
                          enabled: false,
                          color: '#255aee',
                          shadeTo: 'light',
                          shadeIntensity: 0.65
                        }
                      }
                    },
                    series: dashboardStatsQuery.data?.inspectionsByStatus?.series
                  }}
                  title="Interventions"
                />
              </div> */}
            </Grid>
            {/* <Grid item xs={12}>
                <UserCountCard
                  primary="Daily page view"
                  secondary="1K"
                  // iconPrimary={DescriptionTwoToneIcon}
                  color={theme.palette.primary.main}
                />
              </Grid> */}
            {/* <Grid item xs={12}>
                <PopularCard isLoading={isLoading} title={'Interventions'} data={dashboardStatsQuery.data?.Interventions} />
              </Grid> */}
          </Grid>
        </Grid>
      </>
    )}
  </Grid>
);
};

export default Dashboard;
