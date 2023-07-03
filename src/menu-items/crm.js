// assets
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import EngineeringOutlinedIcon from '@mui/icons-material/EngineeringOutlined';
import FoundationOutlinedIcon from '@mui/icons-material/FoundationOutlined';
import ReceiptRoundedIcon from '@mui/icons-material/ReceiptRounded';
import { IconDashboard, IconDeviceAnalytics } from '@tabler/icons';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';
import PostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined';
const Crm = {
  id: 'crm',
  // title: <FormattedMessage id="Navigation" />,
  type: 'group',
  children: [
    {
      id: 'default',
      title: 'Tableau de bord',
      type: 'item',
      url: '/dashboard/default',
      icon: IconDashboard,
      breadcrumbs: false
    },
    {
      id: 'lot-chantiers',
      title: 'Leads',
      type: 'item',
      url: '/lot-chantier/list',
      icon: PostAddOutlinedIcon,
      breadcrumbs: false
    },
    {
      id: 'clients-group',
      title: 'Clients',
      type: 'collapse',
      icon: AccountCircleOutlinedIcon,
      url: '/clients/list',
      breadcrumbs: false,
      children: [
        {
          id: 'chantiers',
          title: 'Client',
          type: 'item',
          url: '/chantiers/list',
          breadcrumbs: false
        },
        // {
        //   id: 'clients',
        //   title: 'Clients',
        //   type: 'item',
        //   url: '/clients/list',
        //   breadcrumbs: false
        // },
        {
          id: 'contrats',
          title: 'Contrats',
          type: 'item',
          // icon: icons.IconBasket,
          url: '/contrats/list',
          breadcrumbs: false
        }
      ]
    },
    // {
    //   id: 'chantiers-group',
    //   title: 'Clients',
    //   type: 'collapse',
    //   url: '/chantiers/list',
    //   icon: FoundationOutlinedIcon,
    //   breadcrumbs: false,
    //   children: [
    //     {
    //       id: 'chantiers',
    //       title: 'Client',
    //       type: 'item',
    //       url: '/chantiers/list',
    //       breadcrumbs: false
    //     }
    //     // {
    //     //   id: 'lot-chantiers',
    //     //   title: 'Leads',
    //     //   type: 'item',
    //     //   url: '/lot-chantier/list',
    //     //   breadcrumbs: false
    //     // }
    //   ]
    // },

    {
      id: 'techniciens-group',
      title: 'Collaborateurs',
      type: 'collapse',
      icon: EngineeringOutlinedIcon,
      url: '/techniciens/list',
      breadcrumbs: false,
      children: [
        {
          id: 'techniciens',
          title: 'Collaborateurs',
          type: 'item',
          url: '/techniciens/list',
          breadcrumbs: false
        },
        {
          id: 'techniciens',
          title: 'Pointage',
          type: 'item',
          url: '/techniciens/list',
          breadcrumbs: false
        },
        {
          id: 'techniciens',
          title: 'Maps',
          type: 'item',
          url: '/techniciens/list',
          breadcrumbs: false
        },
        {
          id: 'calendrier',
          title: 'Calendrier',
          type: 'item',
          url: '/inspections/calendar',
          breadcrumbs: false
        }
      ]
    },

    {
      id: 'inspections-group',
      title: 'Intervention',
      type: 'collapse',
      icon: ContentPasteSearchIcon,
      // url: '/inspections/inspections',
      breadcrumbs: false,
      children: [
        {
          id: 'inspections-proposer',
          title: 'Propositions',
          type: 'item',
          url: '/propositions/list',
          breadcrumbs: false
        },
        {
          id: 'inspections',
          title: 'Interventions',
          type: 'item',
          url: '/inspections/list',
          breadcrumbs: false
        }
        // {
        //   id: 'rapports',
        //   title: 'Rapports',
        //   type: 'item',
        //   url: '/inspections/rapports',
        //   breadcrumbs: false
        // }
      ]
    },

    {
      id: 'facturation-group',
      title: 'Facturations',
      type: 'collapse',
      icon: ReceiptRoundedIcon,
      // url: '/techniciens/list',
      breadcrumbs: false,
      children: [
        {
          id: 'commandes',
          title: 'Devis',
          type: 'item',
          url: '/commandes/list',
          breadcrumbs: false
        },
        {
          id: 'nouvelle-facture',
          title: 'Nouvelle Facture',
          type: 'item',
          url: '/factures/create',
          breadcrumbs: false
        },
        {
          id: 'factures',
          title: 'Factures',
          type: 'item',
          url: '/factures/list',
          breadcrumbs: false
        }
      ]
    }

    // {
    //   id: 'logs-group',
    //   title: 'Historique',
    //   type: 'collapse',
    //   icon: HistoryRoundedIcon,
    //   // url: '/inspections/inspections',
    //   breadcrumbs: false,
    //   children: [
    //     {
    //       id: 'logs',
    //       title: 'Logs',
    //       type: 'item',
    //       url: '/logs',
    //       breadcrumbs: false
    //     }
    //   ]
    // },
    // {
    //   id: 'documents-group',
    //   title: 'Documents',
    //   type: 'collapse',
    //   icon: DescriptionRoundedIcon,
    //   // url: '/inspections/inspections',
    //   breadcrumbs: false,
    //   children: [
    //     {
    //       id: 'document',
    //       title: 'Documents',
    //       type: 'item',
    //       url: '/documents',
    //       breadcrumbs: false
    //     }
    //   ]
    // }
    // {
    //   id: 'users-group',
    //   title: <FormattedMessage id="Users" />,
    //   type: 'collapse',
    //   // icon: icons.IconBasket,
    //   url: '/users/list',
    //   breadcrumbs: false,
    //   children: [
    //     {
    //       id: 'users',
    //       title: <FormattedMessage id="Utilisateurs" />,
    //       type: 'item',
    //       url: '/users/list',
    //       breadcrumbs: false
    //     }
    //   ]
    // }
    // {
    //   id: 'settings',
    //   title: <FormattedMessage id="Paramètres" />,
    //   type: 'collapse',
    //   // icon: icons.IconBasket,
    //   // url: '/inspections/inspections',
    //   breadcrumbs: false,
    //   children: [
    //     {
    //       id: 'calendrier',
    //       title: <FormattedMessage id="Calendrier" />,
    //       type: 'item',
    //       url: '/settings/calendrier',
    //       breadcrumbs: false
    //     },
    //     {
    //       id: 'current-piece',
    //       title: <FormattedMessage id="Références" />,
    //       type: 'item',
    //       url: '/settings/current-pieces',
    //       breadcrumbs: false
    //     },
    //     {
    //       id: 'jour-ferie',
    //       title: <FormattedMessage id="Jours Fériés" />,
    //       type: 'item',
    //       url: '/settings/jour-ferie',
    //       breadcrumbs: false
    //     },
    //     {
    //       id: 'preferences',
    //       title: <FormattedMessage id="Préférences" />,
    //       type: 'item',
    //       url: '/settings/preferences',
    //       breadcrumbs: false
    //     }
    //   ]
    // }
  ]
};

export default Crm;
