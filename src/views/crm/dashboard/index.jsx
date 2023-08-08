import { useTheme } from '@mui/material/styles';
import MainCard from 'ui-component/cards/MainCard';
import React, { useEffect, useState } from 'react';
import WidgetDashboard from './widget';
import ChartDashboard from './chart';
import { useGetChartsDashboard, useGetStatsDashboard, useGetWidgetsDashboard } from 'services/dashboard.service';
import { useGetLoggedInUser } from 'services/auth.service';
import TablesDashboard from './table';

const Analytics = () => {
  const theme = useTheme();
  const getWidgetDashboardQuery = useGetWidgetsDashboard();
  const getChartsDashboardQuery = useGetChartsDashboard();
  const getStatsDashboardQuery = useGetStatsDashboard();
  const getLoggedUserQuery = useGetLoggedInUser();
  const loggedinUser = getLoggedUserQuery?.data;
  const [cardInformation, setCardInformation] = useState([]);
  const [chartsInformations, setChartsInformations] = useState([]);
  const [statsInformations, setStatsInformation] = useState([]);
  useEffect(() => {
    if (getWidgetDashboardQuery.isSuccess) {
      setCardInformation([...getWidgetDashboardQuery.data]);
    }
  }, [getWidgetDashboardQuery?.isSuccess, getWidgetDashboardQuery?.data]);

  useEffect(() => {
    if (getChartsDashboardQuery.isSuccess) {
      setChartsInformations([...getChartsDashboardQuery.data]);
    }
  }, [getChartsDashboardQuery?.isSuccess, getChartsDashboardQuery?.data]);

  useEffect(() => {
    if (getStatsDashboardQuery.isSuccess) {
      setStatsInformation([...getStatsDashboardQuery.data]);
    }
  }, [getStatsDashboardQuery?.isSuccess, getStatsDashboardQuery?.data]);

  const [open, setOpen] = useState(false);
  const [openCharts, setOpenChart] = useState(false);
  const [openStats, setOpenStats] = useState(false);
  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };
  const handleOpenChartDialog = () => {
    setOpenChart(true);
  };

  const handleCloseChartDialog = () => {
    setOpenChart(false);
  };
  const handleOpenstatsDialog = () => {
    setOpenStats(true);
  };

  const handleClosestatsDialog = () => {
    setOpenStats(false);
  };
  return (
    <MainCard>
      <WidgetDashboard
        handleOpenDialog={handleOpenDialog}
        handleCloseDialog={handleCloseDialog}
        open={open}
        cardInformation={cardInformation}
        setCardInformation={setCardInformation}
        theme={theme}
        loggedinUser={loggedinUser}
      />
      <ChartDashboard
        handleOpenChartDialog={handleOpenChartDialog}
        handleCloseChartDialog={handleCloseChartDialog}
        openCharts={openCharts}
        chartsInformations={chartsInformations}
        setChartsInformations={setChartsInformations}
        theme={theme}
        loggedinUser={loggedinUser}
      />
      <TablesDashboard
        handleOpenDialog={handleOpenstatsDialog}
        handleCloseDialog={handleClosestatsDialog}
        open={openStats}
        cardInformation={statsInformations}
        setCardInformation={setStatsInformation}
        loggedinUser={loggedinUser}
        theme={theme}
      />
    </MainCard>
  );
};

export default Analytics;

const staticTablesDashboardData = [
  {
    id: 1,
    default: false,
    title: "Liste des interventions pour aujourd'hui",
    data: []
  },
  {
    id: 2,
    default: true,
    title: "Liste des techniciens disponibles pour aujourd'hui",
    data: [
      {
        id: 17,
        reference: null,
        name: 'test',
        couleur: 'blue',
        email: 'dada@gmail.com',
        address: 'testt',
        code_postal: null,
        ville: null,
        sexe: null,
        phone_number: '534643634',
        fax: null,
        identifient_fiscal: null,
        identifient_tva: null,
        interlocuteur: null,
        interlocuteur_adresse: null,
        interlocuteur_fiscale: null,
        signature: null,
        nom_fichier: null,
        api_token: 'PnNqU4toViSwF9JaETR2DmgyzfD1MqM4o5RdulljagDeigMgAl3rZlMiEmcz',
        societe: null,
        active_status: 1,
        auth: 1,
        type: null,
        contact: null,
        marque_json: null,
        pointage_historique: null,
        p_category_client_id: null,
        d_lot_id: null,
        created_at: '04-08-2023 19:31:31',
        zone_villes: [],
        detail_ville: null,
        url_signature: null,
        category: null
      },
      {
        id: 16,
        reference: 'CLI00009',
        name: 'fbrhr',
        couleur: null,
        email: 'rtg@de.de',
        address: 'trrh',
        code_postal: '4070',
        ville: null,
        sexe: null,
        phone_number: '525353553',
        fax: null,
        identifient_fiscal: null,
        identifient_tva: null,
        interlocuteur: null,
        interlocuteur_adresse: null,
        interlocuteur_fiscale: null,
        signature: null,
        nom_fichier: null,
        api_token: 'cVwOEGZhDafEqsua5LFbZRM3nfroL3RzVQTNmShgzzGksrShXWrDVg59mPIL',
        societe: null,
        active_status: 1,
        auth: 0,
        type: 1,
        contact: null,
        marque_json: null,
        pointage_historique: null,
        p_category_client_id: 1,
        d_lot_id: 1,
        created_at: '04-08-2023 18:12:18',
        zone_villes: [],
        detail_ville: null,
        url_signature: null,
        category: {
          id: 1,
          intitule: 'Classique',
          created_at: null,
          updated_at: null
        }
      },
      {
        id: 15,
        reference: 'COL00001',
        name: 'bebe',
        couleur: 'blue',
        email: 'collaborator-gr@gmail.com',
        address: 'fzfz',
        code_postal: null,
        ville: null,
        sexe: null,
        phone_number: '25555640',
        fax: null,
        identifient_fiscal: null,
        identifient_tva: null,
        interlocuteur: null,
        interlocuteur_adresse: null,
        interlocuteur_fiscale: null,
        signature: null,
        nom_fichier: null,
        api_token: '0INMpkI6o8oZp6EOZtkftLACRyV9txdy9ptKvePsob6yo4uQd9o1pIkYUnBH',
        societe: null,
        active_status: 1,
        auth: 1,
        type: null,
        contact: null,
        marque_json: null,
        pointage_historique: null,
        p_category_client_id: null,
        d_lot_id: null,
        created_at: '04-08-2023 14:18:41',
        zone_villes: [],
        detail_ville: null,
        url_signature: null,
        category: null
      },
      {
        id: 14,
        reference: 'COM00004',
        name: 'bebe',
        couleur: 'blue',
        email: 'collaborator@gmail.com',
        address: 'fzfz',
        code_postal: null,
        ville: null,
        sexe: null,
        phone_number: '25555940',
        fax: null,
        identifient_fiscal: null,
        identifient_tva: null,
        interlocuteur: null,
        interlocuteur_adresse: null,
        interlocuteur_fiscale: null,
        signature: null,
        nom_fichier: null,
        api_token: 'oXeRv9jaWV3xYJcn8SuH6LplEu05rU3wSAiXa16DOUGlhBNmzh7nGGbuCiqK',
        societe: null,
        active_status: 1,
        auth: 1,
        type: null,
        contact: null,
        marque_json: null,
        pointage_historique: null,
        p_category_client_id: null,
        d_lot_id: null,
        created_at: '04-08-2023 14:13:51',
        zone_villes: [],
        detail_ville: null,
        url_signature: null,
        category: null
      },
      {
        id: 12,
        reference: 'CLI00008',
        name: 'mr mouti3',
        couleur: null,
        email: 'moutia@gmail.com',
        address: 'adress',
        code_postal: '5015',
        ville: null,
        sexe: null,
        phone_number: '859345684',
        fax: null,
        identifient_fiscal: null,
        identifient_tva: null,
        interlocuteur: null,
        interlocuteur_adresse: null,
        interlocuteur_fiscale: null,
        signature: null,
        nom_fichier: null,
        api_token: 'jGEqoQbhsHYz4axi86wvwUwXlbUhYNs1lXyfQwrgq23NhCqGEcZsWuEInOSs',
        societe: null,
        active_status: 1,
        auth: 0,
        type: 1,
        contact: null,
        marque_json: [
          {
            code: 'PAC',
            date: '2023-08-04'
          }
        ],
        pointage_historique: null,
        p_category_client_id: 3,
        d_lot_id: 1,
        created_at: '04-08-2023 09:34:46',
        zone_villes: [],
        detail_ville: null,
        url_signature: null,
        category: {
          id: 3,
          intitule: 'Inconnue',
          created_at: null,
          updated_at: null
        }
      }
    ]
  },
  {
    id: 3,
    default: false,
    title: "Liste des contrats \u00e9chou\u00e9s pour aujourd'hui",
    data: [
      {
        id: 2,
        nom: 'hhh',
        reference: 'hhh',
        prix_unitaire: 15,
        remise: 15,
        active: 1,
        unite_id: 7,
        parent: 1,
        p_category_article_id: 1,
        deleted_at: null,
        created_at: '04-08-2023 19:41:05',
        updated_at: '04-08-2023 19:41:05',
        unite: {
          id: 7,
          intitule: 'Pac',
          default: 0,
          horaire: 0,
          type: 1,
          created_at: null,
          updated_at: null
        },
        category: {
          id: 1,
          intitule: 'TEST',
          created_at: null,
          updated_at: null
        }
      },
      {
        id: 1,
        nom: 'ggggggg',
        reference: 'ggggg',
        prix_unitaire: 234324,
        remise: 23,
        active: 1,
        unite_id: 6,
        parent: 1,
        p_category_article_id: 1,
        deleted_at: null,
        created_at: '04-08-2023 09:33:52',
        updated_at: '04-08-2023 09:33:52',
        unite: {
          id: 6,
          intitule: 'jour',
          default: 0,
          horaire: 1,
          type: 0,
          created_at: null,
          updated_at: null
        },
        category: {
          id: 1,
          intitule: 'TEST',
          created_at: null,
          updated_at: null
        }
      }
    ]
  }
];
