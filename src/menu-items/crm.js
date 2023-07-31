// assets
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import EngineeringOutlinedIcon from '@mui/icons-material/EngineeringOutlined';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
const Crm = {
  id: 'crm',
  type: 'group',
  children: [
    {
      id: 'default',
      title: 'Tableau de bord',
      type: 'item',
      url: '/dashboard/default',
      icon: AnalyticsOutlinedIcon,
      breadcrumbs: false
    },

    {
      id: 'leads-group',
      title: 'Leads',
      type: 'collapse',
      icon: GroupAddOutlinedIcon,
      breadcrumbs: false,
      children: [
        {
          id: 'importer-lot-leads',
          title: 'Importer Lot-Leads',
          type: 'item',
          url: '/lot-leads/create',
          breadcrumbs: false
        },
        {
          id: 'lot-leads',
          title: 'Lot-Leads',
          type: 'item',
          url: '/lot-leads/list',
          breadcrumbs: false
        },
        {
          id: 'new-leads',
          title: 'Ajouter Leads',
          type: 'item',
          url: '/leads/create',
          breadcrumbs: false
        },
        {
          id: 'list-leads',
          title: 'List Leads',
          type: 'item',
          url: '/leads/list',
          breadcrumbs: false
        }
      ]
    },
    {
      id: 'articles-group',
      title: 'Articles',
      type: 'collapse',
      icon: GroupOutlinedIcon,
      breadcrumbs: false,
      children: [
        {
          id: 'new-articles',
          title: 'Ajouter Article',
          type: 'item',
          url: '/articles/create',
          breadcrumbs: false
        },
        {
          id: 'articles-list',
          title: 'List des articles',
          type: 'item',
          url: '/articles/list',
          breadcrumbs: false
        }
      ]
    },
    {
      id: 'client-group',
      title: 'Clients',
      type: 'collapse',
      icon: GroupOutlinedIcon,
      breadcrumbs: false,
      children: [
        {
          id: 'new-clients',
          title: 'Ajouter Client',
          type: 'item',
          url: '/clients/create',
          breadcrumbs: false
        },
        {
          id: 'clients-list',
          title: 'Clients',
          type: 'item',
          url: '/clients/list',
          breadcrumbs: false
        },
        {
          id: 'new-contrats',
          title: 'Ajouter contrat',
          type: 'item',
          url: '/contrats/create',
          breadcrumbs: false
        },
        {
          id: 'contrats-list',
          title: 'Contrats',
          type: 'item',
          url: '/contrats/list',
          breadcrumbs: false
        }
      ]
    },
    {
      id: 'techniciens-group',
      title: 'Collaborateurs',
      type: 'collapse',
      icon: EngineeringOutlinedIcon,
      breadcrumbs: false,
      children: [
        {
          id: 'new-techniciens',
          title: 'Ajouter Collaborateur',
          type: 'item',
          url: '/techniciens/create',
          breadcrumbs: false
        },
        {
          id: 'list-techniciens',
          title: 'Collaborateurs',
          type: 'item',
          url: '/techniciens/list',
          breadcrumbs: false
        },
        {
          id: 'list-pointage',
          title: 'Historique Pointage',
          type: 'item',
          url: '/pointage/list',
          breadcrumbs: false
        },
        {
          id: 'maps',
          title: 'Maps',
          type: 'item',
          url: '/maps',
          breadcrumbs: false
        }
      ]
    },
    {
      id: 'inspections-group',
      title: 'Intervention',
      type: 'collapse',
      icon: ContentPasteSearchIcon,
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
        }
      ]
    },

    {
      id: 'facturation-group',
      title: 'Facturations',
      type: 'collapse',
      icon: ReceiptOutlinedIcon,
      breadcrumbs: false,
      children: [
        {
          id: 'list-devis',
          title: 'Nouveau Devis',
          type: 'item',
          url: '/devis/list',
          breadcrumbs: false
        },
        {
          id: 'new-devis',
          title: 'Devis',
          type: 'item',
          url: '/devis/create',
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
