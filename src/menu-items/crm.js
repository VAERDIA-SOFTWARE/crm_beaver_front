// assets
import { DescriptionRounded, HistoryRounded } from '@mui/icons-material';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import EngineeringOutlinedIcon from '@mui/icons-material/EngineeringOutlined';
import ReceiptRoundedIcon from '@mui/icons-material/ReceiptRounded';
import { IconDashboard } from '@tabler/icons';
import { FormattedMessage } from 'react-intl';
const Crm = {
  id: 'crm',
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
    // {
    //   id: 'leads-group',
    //   title: 'Leads',
    //   type: 'collapse',
    //   icon: AccountCircleOutlinedIcon,
    //   // url: '/leads/list',
    //   breadcrumbs: false,
    //   children: [
    //     {
    //       id: 'lot-leads',
    //       title: 'Lot-Leads',
    //       type: 'item',
    //       url: '/lot-leads/list',
    //       breadcrumbs: false
    //     },
    //     {
    //       id: 'leads',
    //       title: 'Nouveau Leads',
    //       type: 'item',
    //       url: '/leads/create',
    //       breadcrumbs: false
    //     }
    //   ]
    // },
    {
      id: 'clients-group',
      title: 'CRM BEAVER',
      type: 'collapse',
      icon: AccountCircleOutlinedIcon,
      // url: '/clients/list',
      breadcrumbs: false,
      children: [
        {
          id: 'lot-leads',
          title: 'Lot-Leads',
          type: 'item',
          url: '/lot-leads/list',
          breadcrumbs: false
        },
        {
          id: 'leads',
          title: 'Nouveau Leads',
          type: 'item',
          url: '/leads/create',
          breadcrumbs: false
        },
        {
          id: 'clients',
          title: 'Client',
          type: 'item',
          url: '/clients/list',
          breadcrumbs: false
        },
        {
          id: 'contrats',
          title: 'Contrats',
          type: 'item',
          url: '/contrats/list',
          breadcrumbs: false
        },
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
        }
      ]
    },
    // {
    //   id: 'techniciens-group',
    //   title: 'Collaborateurs',
    //   type: 'collapse',
    //   icon: EngineeringOutlinedIcon,
    //   // url: '/techniciens/list',
    //   breadcrumbs: false,
    //   children: [
    //     {
    //       id: 'techniciens',
    //       title: 'Collaborateurs',
    //       type: 'item',
    //       url: '/techniciens/list',
    //       breadcrumbs: false
    //     },
    //     {
    //       id: 'techniciens',
    //       title: 'Pointage',
    //       type: 'item',
    //       url: '/techniciens/list',
    //       breadcrumbs: false
    //     },
    //     {
    //       id: 'techniciens',
    //       title: 'Maps',
    //       type: 'item',
    //       url: '/techniciens/list',
    //       breadcrumbs: false
    //     }
    //   ]
    // },

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
          id: 'interventions',
          title: 'Interventions',
          type: 'item',
          url: '/interventions/list',
          breadcrumbs: false
        },
        {
          id: 'calendrier',
          title: 'Calendrier',
          type: 'item',
          url: '/interventions/calendar',
          breadcrumbs: false
        },
        {
          id: 'commandes',
          title: 'Devis',
          type: 'item',
          url: '/devis/list',
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
  ]
};

export default Crm;
