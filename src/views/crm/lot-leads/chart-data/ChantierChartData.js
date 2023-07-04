// ==============================|| WIDGET - SATISFACTION CHART ||============================== //

const chartData = {
  height: 300,
  type: 'pie',
  options: {
    chart: {
      id: 'chantier-chart'
    },
    labels: ['Intervention Crée', 'Intervention terminée', 'Intervention Validée', 'Rapport Generé'],
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
      monochrome: {
        enabled: true
      }
    }
  },
  series: [66, 50, 40, 30]
};

export default chartData;
