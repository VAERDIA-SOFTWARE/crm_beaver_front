// assets
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import EngineeringOutlinedIcon from '@mui/icons-material/EngineeringOutlined';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
const crm = {
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
          parentResource: 'lots',
          permission: 'view',
          id: 'lots-create',
          title: 'Importer Leads',
          type: 'item',
          url: '/lot-leads/list',
          breadcrumbs: false
        },
        {
          parentResource: 'clients',
          permission: 'create',
          id: 'lead-create',
          title: 'Ajouter Leads',
          type: 'item',
          url: '/leads/create',
          breadcrumbs: false
        },
        {
          parentResource: 'clients',
          permission: 'view',
          id: 'lead-view',
          title: 'List des Leads',
          type: 'item',
          url: '/leads/list',
          breadcrumbs: false
        }
      ]
    },
    {
      id: 'operations',
      title: 'Strecture',
      type: 'collapse',
      icon: GroupOutlinedIcon,
      breadcrumbs: false,
      children: [
        {
          parentResource: 'operations',
          permission: 'view',
          id: 'operations-view',
          title: 'List des articles',
          type: 'item',
          url: '/articles/list',
          breadcrumbs: false
        },
        {
          parentResource: 'clients',
          permission: 'view',
          id: 'clients-view',
          title: 'List des clients',
          type: 'item',
          url: '/clients/list',
          breadcrumbs: false
        },
        {
          parentResource: 'collaborators',
          permission: 'view',
          id: 'collaborators-view',
          title: 'List des collab',
          type: 'item',
          url: '/techniciens/list',
          breadcrumbs: false
        }
      ]
    },
    {
      id: 'contrats',
      title: 'Contrats',
      type: 'collapse',
      icon: GroupOutlinedIcon,
      breadcrumbs: false,
      children: [
        // {
        //   parentResource: 'clients',
        //   permission: 'create',
        //   id: 'clients-create',
        //   title: 'Ajouter Client',
        //   type: 'item',
        //   url: '/clients/create',
        //   breadcrumbs: false
        // },
        // {
        //   parentResource: 'clients',
        //   permission: 'view',
        //   id: 'clients-view',
        //   title: 'Clients',
        //   type: 'item',
        //   url: '/clients/list',
        //   breadcrumbs: false
        // },
        {
          parentResource: 'contrats',
          permission: 'create',
          id: 'contrats-create',
          title: 'Ajouter contrat',
          type: 'item',
          url: '/contrats/create',
          breadcrumbs: false
        },
        {
          parentResource: 'contrats',
          permission: 'view',
          id: 'contrats-view',
          title: 'List des Contrats',
          type: 'item',
          url: '/contrats/list',
          breadcrumbs: false
        },
        {
          parentResource: 'contrats',
          permission: 'view',
          id: 'contrats-view-echouer',
          title: 'List des Contrats échouer',
          type: 'item',
          url: '/contrats/list-echouer',
          breadcrumbs: false
        }
      ]
    },
    // {
    //   id: 'collaborators',
    //   title: 'Collaborateurs',
    //   type: 'collapse',
    //   icon: EngineeringOutlinedIcon,
    //   breadcrumbs: false,
    //   children: [
    //     {
    //       parentResource: 'collaborators',
    //       permission: 'create',
    //       id: 'collaborators-create',
    //       title: 'Ajouter Collaborateur',
    //       type: 'item',
    //       url: '/techniciens/create',
    //       breadcrumbs: false
    //     },
    //     {
    //       parentResource: 'collaborators',
    //       permission: 'view',
    //       id: 'collaborators-view',
    //       title: 'Collaborateurs',
    //       type: 'item',
    //       url: '/techniciens/list',
    //       breadcrumbs: false
    //     }
    //     // {
    //     //   id: 'list-pointage',
    //     //   title: 'Historique Pointage',
    //     //   type: 'item',
    //     //   url: '/pointage/list',
    //     //   breadcrumbs: false
    //     // },
    //     // {
    //     //   id: 'maps',
    //     //   title: 'Maps',
    //     //   type: 'item',
    //     //   url: '/maps',
    //     //   breadcrumbs: false
    //     // }
    //   ]
    // },
    {
      id: 'interventions',
      title: 'Intervention',
      type: 'collapse',
      icon: ContentPasteSearchIcon,
      breadcrumbs: false,
      children: [
        {
          parentResource: 'calendrier',
          permission: 'view',
          id: 'calendrier-view',
          title: 'Calendrier',
          type: 'item',
          url: '/interventions/calendar',
          breadcrumbs: false
        },
        {
          parentResource: 'interventions-proposer',
          permission: 'view',
          id: 'interventions-proposer-view',
          title: 'List des Propositions',
          type: 'item',
          url: '/propositions/list',
          breadcrumbs: false
        },
        {
          parentResource: 'interventions',
          permission: 'view',
          id: 'interventions-view',
          title: 'List des Interventions',
          type: 'item',
          url: '/interventions/list',
          breadcrumbs: false
        }
      ]
    },

    {
      id: 'commercial',
      title: 'Commercial',
      type: 'collapse',
      icon: ReceiptOutlinedIcon,
      breadcrumbs: false,
      children: [
        {
          parentResource: 'invoices',
          permission: 'view',
          id: 'devis-view',
          title: 'List des Devis',
          type: 'item',
          url: '/devis/list',
          breadcrumbs: false
        },
        {
          parentResource: 'invoices',
          permission: 'view',
          id: 'invoices-view',
          title: 'List des Factures',
          type: 'item',
          url: '/factures/list',
          breadcrumbs: false
        },
        {
          parentResource: 'regulations',
          permission: 'view',
          id: 'regulations-view',
          title: 'Liste des Reglements',
          type: 'item',
          url: '/reglements/list',
          breadcrumbs: false
        }
      ]
    }
    // {
    //   id: 'regulations',
    //   title: 'Reglements ',
    //   type: 'collapse',
    //   icon: ReceiptOutlinedIcon,
    //   breadcrumbs: false,
    //   children: [
    //     {
    //       parentResource: 'regulations',
    //       permission: 'create',
    //       id: 'regulations-create',
    //       title: 'Ajouter Reglements',
    //       type: 'item',
    //       url: '/reglement/create',
    //       breadcrumbs: false
    //     },
    //     {
    //       parentResource: 'regulations',
    //       permission: 'view',
    //       id: 'regulations-view',
    //       title: 'Liste des Reglements',
    //       type: 'item',
    //       url: '/reglements/list',
    //       breadcrumbs: false
    //     }
    //   ]
    // }
  ]
};

export default crm;
