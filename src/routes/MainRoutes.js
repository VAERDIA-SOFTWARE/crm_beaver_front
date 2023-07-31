import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';
import LogsList from 'views/crm/logs';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));
const DashboardAnalytics = Loadable(lazy(() => import('views/dashboard/Analytics')));

// widget routing
const WidgetStatistics = Loadable(lazy(() => import('views/widget/Statistics')));
const WidgetData = Loadable(lazy(() => import('views/widget/Data')));
const WidgetChart = Loadable(lazy(() => import('views/widget/Chart')));

// application - user social & account profile routing
const AppUserSocialProfile = Loadable(lazy(() => import('views/application/users/social-profile')));
const AppUserAccountProfile1 = Loadable(lazy(() => import('views/application/users/account-profile/Profile1')));
const AppUserAccountProfile2 = Loadable(lazy(() => import('views/application/users/account-profile/Profile2')));
const AppUserAccountProfile3 = Loadable(lazy(() => import('views/application/users/account-profile/Profile3')));

// application - user cards & list variant routing
const AppProfileCardStyle1 = Loadable(lazy(() => import('views/application/users/card/CardStyle1')));
const AppProfileCardStyle2 = Loadable(lazy(() => import('views/application/users/card/CardStyle2')));
const AppProfileCardStyle3 = Loadable(lazy(() => import('views/application/users/card/CardStyle3')));
const AppProfileListStyle1 = Loadable(lazy(() => import('views/application/users/list/Style1')));
const AppProfileListStyle2 = Loadable(lazy(() => import('views/application/users/list/Style2')));

// application - customer routing
const AppCustomerList = Loadable(lazy(() => import('views/application/customer/CustomerList')));
const AppCustomerOrderList = Loadable(lazy(() => import('views/application/customer/OrderList')));
const AppCustomerCreateInvoice = Loadable(lazy(() => import('views/application/customer/CreateInvoice')));
const AppCustomerOrderDetails = Loadable(lazy(() => import('views/application/customer/OrderDetails')));
const AppCustomerProduct = Loadable(lazy(() => import('views/application/customer/Product')));
const AppCustomerProductReview = Loadable(lazy(() => import('views/application/customer/ProductReview')));

// application routing
const AppChat = Loadable(lazy(() => import('views/application/chat')));
const AppKanban = Loadable(lazy(() => import('views/application/kanban')));
const AppKanbanBacklogs = Loadable(lazy(() => import('views/application/kanban/Backlogs')));
const AppKanbanBoard = Loadable(lazy(() => import('views/application/kanban/Board')));
const AppMail = Loadable(lazy(() => import('views/application/mail')));
const AppCalendar = Loadable(lazy(() => import('views/application/calendar')));
const AppContactCard = Loadable(lazy(() => import('views/application/contact/Card')));
const AppContactList = Loadable(lazy(() => import('views/application/contact/List')));

// application crm pages
const AppCrmTechniciensList = Loadable(lazy(() => import('views/crm/techniciens/list/index')));
const AppCrmTechniciensUpdate = Loadable(lazy(() => import('views/crm/techniciens/list/UpdatePage')));
const AppCrmTechniciensDetails = Loadable(lazy(() => import('views/crm/techniciens/list/DetailsPage')));
const AppCrmTechnicienCreate = Loadable(lazy(() => import('views/crm/techniciens/list/CreatePage')));

const AppCrmClientsList = Loadable(lazy(() => import('views/crm/clients/list/index')));
const AppCrmClientUpdate = Loadable(lazy(() => import('views/crm/leads/list/UpdatePage')));
const AppCrmClientDetails = Loadable(lazy(() => import('views/crm/clients/list/DetailsPage')));
const AppCrmClientCreate = Loadable(lazy(() => import('views/crm/clients/list/CreatePage')));
const AppCrmClientImportChantiers = Loadable(lazy(() => import('views/crm/clients/list/UploadChantiersPage')));

const AppCrmUsersList = Loadable(lazy(() => import('views/crm/users/list/index')));
const AppCrmUsersUpdate = Loadable(lazy(() => import('views/crm/users/list/UpdatePage')));
const AppCrmUsersDetails = Loadable(lazy(() => import('views/crm/users/list/DetailsPage')));
const AppCrmUsersCreate = Loadable(lazy(() => import('views/crm/users/list/CreatePage')));
const AppCrmUserCredentials = Loadable(lazy(() => import('views/crm/users/list/Credentials')));

const AppCrmArticlesList = Loadable(lazy(() => import('views/crm/articles/list/index')));
const AppCrmArticlesUpdate = Loadable(lazy(() => import('views/crm/articles/list/UpdatePage')));
const AppCrmArticlesDetails = Loadable(lazy(() => import('views/crm/articles/list/DetailsPage')));
const AppCrmArticlesCreate = Loadable(lazy(() => import('views/crm/articles/list/CreatePage')));

const AppCrmContratDetails = Loadable(lazy(() => import('views/crm/contrats/DetailsPage')));
const AppCrmContratUpdate = Loadable(lazy(() => import('views/crm/contrats/UpdatePage')));
const AppCrmContratCreate = Loadable(lazy(() => import('views/crm/contrats/FormStepper/index')));
const AppCrmContratsList = Loadable(lazy(() => import('views/crm/contrats/index')));

const AppCrmLotLeadsList = Loadable(lazy(() => import('views/crm/lot-leads/index')));
const AppCrmLotLeadsDetails = Loadable(lazy(() => import('views/crm/lot-leads/DetailsPage')));

const AppCrmLotLeadsCreate = Loadable(lazy(() => import('views/crm/lot-leads/CreatePage')));

const AppCrmLeadDetails = Loadable(lazy(() => import('views/crm/leads/list/DetailsPage')));
const AppCrmLeadUpdate = Loadable(lazy(() => import('views/crm/leads/list/UpdatePage')));
const AppCrmLeadCreate = Loadable(lazy(() => import('views/crm/leads/list/CreatePage')));
const AppCrmLeadsList = Loadable(lazy(() => import('views/crm/leads/list/index')));

const AppCrmDevisDetails = Loadable(lazy(() => import('views/crm/devis/list/DetailsPage')));
const AppCrmDevisUpdate = Loadable(lazy(() => import('views/crm/devis/list/UpdatePage')));
const AppCrmDevisCreate = Loadable(lazy(() => import('views/crm/devis/list/CreatePage')));
const AppCrmDevisList = Loadable(lazy(() => import('views/crm/devis/list/index')));

const AppCrmPointageDetails = Loadable(lazy(() => import('views/crm/pointage/list/DetailsPage')));
const AppCrmPointageList = Loadable(lazy(() => import('views/crm/pointage/list/index')));

const AppCrmFacturesList = Loadable(lazy(() => import('views/crm/factures/list/index')));
const AppCrmFacturesDetails = Loadable(lazy(() => import('views/crm/factures/list/DetailsPage')));
const AppCrmCreateFacture = Loadable(lazy(() => import('views/crm/factures/list/CreateFacture')));

const AppCrmReglementsList = Loadable(lazy(() => import('views/crm/reglements/list/index')));
const AppCrmReglementsCreate = Loadable(lazy(() => import('views/crm/reglements/list/createReglement')));
const AppCrmReglementsUpdate = Loadable(lazy(() => import('views/crm/reglements/list/updateReglement')));

const AppCrmCalendar = Loadable(lazy(() => import('views/crm/calendar')));

const AppCrmInterventionsList = Loadable(lazy(() => import('views/crm/interventions/index')));
const AppCrmInterventionsListRapports = Loadable(lazy(() => import('views/crm/interventions/ListRapports')));
const AppCrmInterventionDetails = Loadable(lazy(() => import('views/crm/interventions/DetailsPage')));
const AppCrmInterventionUpdate = Loadable(lazy(() => import('views/crm/interventions/UpdatePage')));
const AppCrmInterventionFormulaire = Loadable(lazy(() => import('views/crm/interventions/Formulaire')));
const AppCrmInterventionsCreate = Loadable(lazy(() => import('views/crm/interventions/CreatePage')));

const AppCrmPropositionsList = Loadable(lazy(() => import('views/crm/propositions/index')));
const AppCrmPropositionsDetails = Loadable(lazy(() => import('views/crm/propositions/DetailsPage')));
const AppCrmPropositionsUpdate = Loadable(lazy(() => import('views/crm/propositions/UpdatePage')));

const AppCrmCategorieArticleList = Loadable(lazy(() => import('views/crm/preferences/categories-articles/index')));
const AppCrmCategorieArticleCreate = Loadable(lazy(() => import('views/crm/preferences/categories-articles/CreatePage')));
const AppCrmCategorieArticleDetails = Loadable(lazy(() => import('views/crm/preferences/categories-articles/DetailsPage')));
const AppCrmCategorieArticleUpdate = Loadable(lazy(() => import('views/crm/preferences/categories-articles/UpdatePage')));

const AppCrmCategorieClientsList = Loadable(lazy(() => import('views/crm/preferences/categories-clients/index')));
const AppCrmCategorieClientsCreate = Loadable(lazy(() => import('views/crm/preferences/categories-clients/CreatePage')));
const AppCrmCategorieClientsDetails = Loadable(lazy(() => import('views/crm/preferences/categories-clients/DetailsPage')));
const AppCrmCategorieClientsUpdate = Loadable(lazy(() => import('views/crm/preferences/categories-clients/UpdatePage')));

const AppCrmPreferencesUpdate = Loadable(lazy(() => import('views/crm/preferences/SettingsPreferencesPage')));

const AppCrmMailerUpdate = Loadable(lazy(() => import('views/crm/preferences/SettingsMailerPage')));

const AppCrmCurrentPieceUpdate = Loadable(lazy(() => import('views/crm/preferences/current-pieces/UpdatePage')));
const AppCrmCurrentPieceList = Loadable(lazy(() => import('views/crm/preferences/current-pieces/index')));

const AppCrmCalendrierList = Loadable(lazy(() => import('views/crm/preferences/calendrier/index')));
const AppCrmCalendrierEmploiList = Loadable(lazy(() => import('views/crm/preferences/calendrier/EmploiList')));
const AppCrmCalendrierEmploi = Loadable(lazy(() => import('views/crm/preferences/calendrier/UpdatePage')));

const AppCrmPreferencesJourFerieList = Loadable(lazy(() => import('views/crm/preferences/jour-ferie/index')));

const AppCrmJourFerieCreate = Loadable(lazy(() => import('views/crm/preferences/jour-ferie/CreatePage')));
const AppCrmJourFerieUpdate = Loadable(lazy(() => import('views/crm/preferences/jour-ferie/UpdatePage')));

const AppCrmPreferencesJourFerieChildrenList = Loadable(lazy(() => import('views/crm/preferences/jour-ferie/child/index')));
const AppCrmPreferencesJourFerieChildCreate = Loadable(lazy(() => import('views/crm/preferences/jour-ferie/child/CreatePage')));
const AppCrmPreferencesJourFerieChildUpdate = Loadable(lazy(() => import('views/crm/preferences/jour-ferie/child/UpdatePage')));

const AppCrmSocieteDetails = Loadable(lazy(() => import('views/crm/preferences/societe/DetailsPage')));
const AppCrmSocieteUpdate = Loadable(lazy(() => import('views/crm/preferences/societe/UpdatePage')));

// application e-commerce pages
const AppECommProducts = Loadable(lazy(() => import('views/application/e-commerce/Products')));
const AppECommProductDetails = Loadable(lazy(() => import('views/application/e-commerce/ProductDetails')));
const AppECommProductList = Loadable(lazy(() => import('views/application/e-commerce/ProductList')));
const AppECommCheckout = Loadable(lazy(() => import('views/application/e-commerce/Checkout')));

// forms component routing
const FrmComponentsTextfield = Loadable(lazy(() => import('views/forms/components/TextField')));
const FrmComponentsButton = Loadable(lazy(() => import('views/forms/components/Button')));
const FrmComponentsCheckbox = Loadable(lazy(() => import('views/forms/components/Checkbox')));
const FrmComponentsRadio = Loadable(lazy(() => import('views/forms/components/Radio')));
const FrmComponentsSwitch = Loadable(lazy(() => import('views/forms/components/Switch')));
const FrmComponentsAutoComplete = Loadable(lazy(() => import('views/forms/components/AutoComplete')));
const FrmComponentsSlider = Loadable(lazy(() => import('views/forms/components/Slider')));
const FrmComponentsDateTime = Loadable(lazy(() => import('views/forms/components/DateTime')));

// forms plugins layout
const FrmLayoutLayout = Loadable(lazy(() => import('views/forms/layouts/Layouts')));
const FrmLayoutMultiColumnForms = Loadable(lazy(() => import('views/forms/layouts/MultiColumnForms')));
const FrmLayoutActionBar = Loadable(lazy(() => import('views/forms/layouts/ActionBar')));
const FrmLayoutStickyActionBar = Loadable(lazy(() => import('views/forms/layouts/StickyActionBar')));

// forms plugins routing
const FrmAutocomplete = Loadable(lazy(() => import('views/forms/plugins/AutoComplete')));
const FrmMask = Loadable(lazy(() => import('views/forms/plugins/Mask')));
const FrmClipboard = Loadable(lazy(() => import('views/forms/plugins/Clipboard')));
const FrmRecaptcha = Loadable(lazy(() => import('views/forms/plugins/Recaptcha')));
const FrmWysiwugEditor = Loadable(lazy(() => import('views/forms/plugins/WysiwugEditor')));
const FrmModal = Loadable(lazy(() => import('views/forms/plugins/Modal')));
const FrmTooltip = Loadable(lazy(() => import('views/forms/plugins/Tooltip')));

// table routing
const TableBasic = Loadable(lazy(() => import('views/forms/tables/TableBasic')));
const TableDense = Loadable(lazy(() => import('views/forms/tables/TableDense')));
const TableEnhanced = Loadable(lazy(() => import('views/forms/tables/TableEnhanced')));
const TableData = Loadable(lazy(() => import('views/forms/tables/TableData')));
const TableCustomized = Loadable(lazy(() => import('views/forms/tables/TablesCustomized')));
const TableStickyHead = Loadable(lazy(() => import('views/forms/tables/TableStickyHead')));
const TableCollapsible = Loadable(lazy(() => import('views/forms/tables/TableCollapsible')));

// forms validation
const FrmFormsValidation = Loadable(lazy(() => import('views/forms/forms-validation')));
const FrmFormsWizard = Loadable(lazy(() => import('views/forms/forms-wizard')));

// chart routing
const ChartApexchart = Loadable(lazy(() => import('views/forms/chart/Apexchart')));
const OrgChartPage = Loadable(lazy(() => import('views/forms/chart/OrgChart')));

// basic ui-elements routing
const BasicUIAccordion = Loadable(lazy(() => import('views/ui-elements/basic/UIAccordion')));
const BasicUIAvatar = Loadable(lazy(() => import('views/ui-elements/basic/UIAvatar')));
const BasicUIBadges = Loadable(lazy(() => import('views/ui-elements/basic/UIBadges')));
const BasicUIBreadcrumb = Loadable(lazy(() => import('views/ui-elements/basic/UIBreadcrumb')));
const BasicUICards = Loadable(lazy(() => import('views/ui-elements/basic/UICards')));
const BasicUIChip = Loadable(lazy(() => import('views/ui-elements/basic/UIChip')));
const BasicUIList = Loadable(lazy(() => import('views/ui-elements/basic/UIList')));
const BasicUITabs = Loadable(lazy(() => import('views/ui-elements/basic/UITabs')));

// advance ui-elements routing
const AdvanceUIAlert = Loadable(lazy(() => import('views/ui-elements/advance/UIAlert')));
const AdvanceUIDialog = Loadable(lazy(() => import('views/ui-elements/advance/UIDialog')));
const AdvanceUIPagination = Loadable(lazy(() => import('views/ui-elements/advance/UIPagination')));
const AdvanceUIProgress = Loadable(lazy(() => import('views/ui-elements/advance/UIProgress')));
const AdvanceUIRating = Loadable(lazy(() => import('views/ui-elements/advance/UIRating')));
const AdvanceUISnackbar = Loadable(lazy(() => import('views/ui-elements/advance/UISnackbar')));
const AdvanceUISkeleton = Loadable(lazy(() => import('views/ui-elements/advance/UISkeleton')));
const AdvanceUISpeeddial = Loadable(lazy(() => import('views/ui-elements/advance/UISpeeddial')));
const AdvanceUITimeline = Loadable(lazy(() => import('views/ui-elements/advance/UITimeline')));
const AdvanceUIToggleButton = Loadable(lazy(() => import('views/ui-elements/advance/UIToggleButton')));
const AdvanceUITreeview = Loadable(lazy(() => import('views/ui-elements/advance/UITreeview')));

// pricing page routing
const PagesPrice1 = Loadable(lazy(() => import('views/pages/pricing/Price1')));
const PagesPrice2 = Loadable(lazy(() => import('views/pages/pricing/Price2')));

// utilities routing
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));
const UtilsMaterialIcons = Loadable(lazy(() => import('views/utilities/MaterialIcons')));
const UtilsTablerIcons = Loadable(lazy(() => import('views/utilities/TablerIcons')));
const UtilsAnimation = Loadable(lazy(() => import('views/utilities/Animation')));
const UtilsGrid = Loadable(lazy(() => import('views/utilities/Grid')));

// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));

// ==============================|| MAIN ROUTING ||============================== //

let devRoutes = [];

if (process.env.NODE_ENV === 'development') {
  devRoutes = [
    {
      path: '/dashboard/analytics',
      element: <DashboardAnalytics />
    },
    {
      path: '/widget/statistics',
      element: <WidgetStatistics />
    },
    {
      path: '/widget/data',
      element: <WidgetData />
    },
    {
      path: '/widget/chart',
      element: <WidgetChart />
    },

    {
      path: '/user/social-profile/:tab',
      element: <AppUserSocialProfile />
    },
    {
      path: '/user/account-profile/profile1',
      element: <AppUserAccountProfile1 />
    },
    {
      path: '/user/account-profile/profile2',
      element: <AppUserAccountProfile2 />
    },
    {
      path: '/user/account-profile/profile3',
      element: <AppUserAccountProfile3 />
    },

    {
      path: '/user/card/card1',
      element: <AppProfileCardStyle1 />
    },
    {
      path: '/user/card/card2',
      element: <AppProfileCardStyle2 />
    },
    {
      path: '/user/card/card3',
      element: <AppProfileCardStyle3 />
    },
    {
      path: '/user/list/list1',
      element: <AppProfileListStyle1 />
    },
    {
      path: '/user/list/list2',
      element: <AppProfileListStyle2 />
    },

    {
      path: '/customer/customer-list',
      element: <AppCustomerList />
    },
    {
      path: '/customer/order-list',
      element: <AppCustomerOrderList />
    },
    {
      path: '/customer/create-invoice',
      element: <AppCustomerCreateInvoice />
    },
    {
      path: '/customer/order-details',
      element: <AppCustomerOrderDetails />
    },
    {
      path: '/customer/product',
      element: <AppCustomerProduct />
    },
    {
      path: '/customer/product-review',
      element: <AppCustomerProductReview />
    },

    {
      path: '/app/chat',
      element: <AppChat />
    },
    {
      path: '/app/mail',
      element: <AppMail />
    },
    {
      path: '/app/kanban',
      element: <AppKanban />,
      children: [
        {
          path: 'backlogs',
          element: <AppKanbanBacklogs />
        },
        {
          path: 'board',
          element: <AppKanbanBoard />
        }
      ]
    },
    {
      path: '/app/calendar',
      element: <AppCalendar />
    },
    {
      path: '/app/contact/c-card',
      element: <AppContactCard />
    },
    {
      path: '/app/contact/c-list',
      element: <AppContactList />
    },

    {
      path: '/e-commerce/products',
      element: <AppECommProducts />
    },
    {
      path: '/e-commerce/product-details/:id',
      element: <AppECommProductDetails />
    },
    {
      path: '/e-commerce/product-list',
      element: <AppECommProductList />
    },

    {
      path: '/e-commerce/checkout',
      element: <AppECommCheckout />
    },

    {
      path: '/components/text-field',
      element: <FrmComponentsTextfield />
    },
    {
      path: '/components/button',
      element: <FrmComponentsButton />
    },
    {
      path: '/components/checkbox',
      element: <FrmComponentsCheckbox />
    },
    {
      path: '/components/radio',
      element: <FrmComponentsRadio />
    },
    {
      path: '/components/autocomplete',
      element: <FrmComponentsAutoComplete />
    },
    {
      path: '/components/slider',
      element: <FrmComponentsSlider />
    },
    {
      path: '/components/switch',
      element: <FrmComponentsSwitch />
    },
    {
      path: '/components/date-time',
      element: <FrmComponentsDateTime />
    },

    {
      path: '/forms/layouts/layouts',
      element: <FrmLayoutLayout />
    },
    {
      path: '/forms/layouts/multi-column-forms',
      element: <FrmLayoutMultiColumnForms />
    },
    {
      path: '/forms/layouts/action-bar',
      element: <FrmLayoutActionBar />
    },
    {
      path: '/forms/layouts/sticky-action-bar',
      element: <FrmLayoutStickyActionBar />
    },

    {
      path: '/forms/frm-autocomplete',
      element: <FrmAutocomplete />
    },
    {
      path: '/forms/frm-mask',
      element: <FrmMask />
    },
    {
      path: '/forms/frm-clipboard',
      element: <FrmClipboard />
    },
    {
      path: '/forms/frm-recaptcha',
      element: <FrmRecaptcha />
    },
    {
      path: '/forms/frm-wysiwug',
      element: <FrmWysiwugEditor />
    },
    {
      path: '/forms/frm-modal',
      element: <FrmModal />
    },
    {
      path: '/forms/frm-tooltip',
      element: <FrmTooltip />
    },

    {
      path: '/tables/tbl-basic',
      element: <TableBasic />
    },
    {
      path: '/tables/tbl-dense',
      element: <TableDense />
    },
    {
      path: '/tables/tbl-enhanced',
      element: <TableEnhanced />
    },
    {
      path: '/tables/tbl-data',
      element: <TableData />
    },
    {
      path: '/tables/tbl-customized',
      element: <TableCustomized />
    },
    {
      path: '/tables/tbl-sticky-header',
      element: <TableStickyHead />
    },
    {
      path: '/tables/tbl-collapse',
      element: <TableCollapsible />
    },

    {
      path: 'forms/charts/apexchart',
      element: <ChartApexchart />
    },
    {
      path: '/forms/charts/orgchart',
      element: <OrgChartPage />
    },
    {
      path: '/forms/forms-validation',
      element: <FrmFormsValidation />
    },
    {
      path: '/forms/forms-wizard',
      element: <FrmFormsWizard />
    },

    {
      path: '/basic/accordion',
      element: <BasicUIAccordion />
    },
    {
      path: '/basic/avatar',
      element: <BasicUIAvatar />
    },
    {
      path: '/basic/badges',
      element: <BasicUIBadges />
    },
    {
      path: '/basic/breadcrumb',
      element: <BasicUIBreadcrumb />
    },
    {
      path: '/basic/cards',
      element: <BasicUICards />
    },
    {
      path: '/basic/chip',
      element: <BasicUIChip />
    },
    {
      path: '/basic/list',
      element: <BasicUIList />
    },
    {
      path: '/basic/tabs',
      element: <BasicUITabs />
    },

    {
      path: '/advance/alert',
      element: <AdvanceUIAlert />
    },
    {
      path: '/advance/dialog',
      element: <AdvanceUIDialog />
    },
    {
      path: '/advance/pagination',
      element: <AdvanceUIPagination />
    },
    {
      path: '/advance/progress',
      element: <AdvanceUIProgress />
    },
    {
      path: '/advance/rating',
      element: <AdvanceUIRating />
    },
    {
      path: '/advance/snackbar',
      element: <AdvanceUISnackbar />
    },
    {
      path: '/advance/skeleton',
      element: <AdvanceUISkeleton />
    },
    {
      path: '/advance/speeddial',
      element: <AdvanceUISpeeddial />
    },
    {
      path: '/advance/timeline',
      element: <AdvanceUITimeline />
    },
    {
      path: '/advance/toggle-button',
      element: <AdvanceUIToggleButton />
    },
    {
      path: '/advance/treeview',
      element: <AdvanceUITreeview />
    },

    {
      path: '/pages/price/price1',
      element: <PagesPrice1 />
    },
    {
      path: '/pages/price/price2',
      element: <PagesPrice2 />
    },

    {
      path: '/utils/util-typography',
      element: <UtilsTypography />
    },
    {
      path: '/utils/util-color',
      element: <UtilsColor />
    },
    {
      path: '/utils/util-shadow',
      element: <UtilsShadow />
    },
    {
      path: '/icons/tabler-icons',
      element: <UtilsTablerIcons />
    },
    {
      path: '/icons/material-icons',
      element: <UtilsMaterialIcons />
    },
    {
      path: '/utils/util-animation',
      element: <UtilsAnimation />
    },
    {
      path: '/utils/util-grid',
      element: <UtilsGrid />
    },
    {
      path: '/sample-page',
      element: <SamplePage />
    }
  ];
}

const MainRoutes = {
  path: '/',
  element: (
    <>
      <AuthGuard>
        <MainLayout />
      </AuthGuard>
    </>
  ),
  children: [
    {
      // path: '/dashboard/default',
      element: <DashboardDefault />,
      index: true
    },
    {
      path: '/dashboard/default',
      element: <DashboardDefault />
    },

    {
      path: '/techniciens/list',
      element: <AppCrmTechniciensList />
    },
    {
      path: '/techniciens/:technicienId/update',
      element: <AppCrmTechniciensUpdate />
    },
    {
      path: '/techniciens/:technicienId/details',
      element: <AppCrmTechniciensDetails />
    },
    {
      path: '/clients/list',
      element: <AppCrmClientsList />
    },
    {
      path: '/clients/:clientId/details',
      element: <AppCrmClientDetails />
    },
    {
      path: '/clients/:leadsId/update',
      element: <AppCrmClientUpdate />
    },
    {
      path: '/clients/create',
      element: <AppCrmClientCreate />
    },
    {
      path: '/clients/:clientId/import-chantiers',
      element: <AppCrmClientImportChantiers />
    },
    {
      path: '/users/list',
      element: <AppCrmUsersList />
    },
    {
      path: '/users/:userId/details',
      element: <AppCrmUsersDetails />
    },
    {
      path: '/users/:userId/update',
      element: <AppCrmUsersUpdate />
    },
    {
      path: '/users/create',
      element: <AppCrmUsersCreate />
    },
    {
      path: '/user/credentials',
      element: <AppCrmUserCredentials />
    },
    {
      path: '/articles/list',
      element: <AppCrmArticlesList />
    },
    {
      path: '/articles/:articleId/details',
      element: <AppCrmArticlesDetails />
    },
    {
      path: '/articles/:articleId/update',
      element: <AppCrmArticlesUpdate />
    },
    {
      path: '/articles/create',
      element: <AppCrmArticlesCreate />
    },
    {
      path: '/techniciens/create',
      element: <AppCrmTechnicienCreate />
    },
    {
      path: '/contrats/list',
      element: <AppCrmContratsList />
    },
    {
      path: '/contrats/create',
      element: <AppCrmContratCreate />
    },
    {
      path: '/contrats/:contratId/details',
      element: <AppCrmContratDetails />
    },
    {
      path: '/contrats/:contratId/update',
      element: <AppCrmContratUpdate />
    },

    // BEAVER CRM
    {
      path: '/lot-leads/list',
      element: <AppCrmLotLeadsList />
    },
    {
      path: '/lot-leads/:lotLeadsId/details',
      element: <AppCrmLotLeadsDetails />
    },

    {
      path: '/lot-leads/create',
      element: <AppCrmLotLeadsCreate />
    },
    {
      path: '/leads/list',
      element: <AppCrmLeadsList />
    },
    {
      path: '/leads/create',
      element: <AppCrmLeadCreate />
    },
    {
      path: '/leads/:leadsId/details',
      element: <AppCrmLeadDetails />
    },
    {
      path: '/leads/:leadsId/update',
      element: <AppCrmLeadUpdate />
    },
    {
      path: '/devis/list',
      element: <AppCrmDevisList />
    },
    {
      path: '/devis/create',
      element: <AppCrmDevisCreate />
    },
    {
      path: '/devis/:devisId/details',
      element: <AppCrmDevisDetails />
    },
    {
      path: '/devis/:devisId/update',
      element: <AppCrmDevisUpdate />
    },
    {
      path: '/pointage/list',
      element: <AppCrmPointageList />
    },
    {
      path: '/pointage/:pointageId/details',
      element: <AppCrmPointageDetails />
    },
    {
      path: '/commandes/:commandeId/factures/create',
      element: <AppCrmCreateFacture />
    },

    {
      path: '/factures/list',
      element: <AppCrmFacturesList />
    },
    {
      path: '/factures/:commandeId/details',
      element: <AppCrmFacturesDetails />
    },
    {
      path: '/factures/:factureId',
      element: <AppCrmFacturesDetails />
    },
    {
      path: '/factures/:factureId/generer-avoir',
      element: <AppCrmCreateFacture />
    },
    {
      path: '/factures/:factureId/update',
      element: <AppCrmCreateFacture />
    },
    {
      path: '/factures/create',
      element: <AppCrmCreateFacture />
    },
    {
      path: '/reglements/list',
      element: <AppCrmReglementsList />
    },
    {
      path: '/reglement/create',
      element: <AppCrmReglementsCreate />
    },
    {
      path: '/reglement/:id/update',
      element: <AppCrmReglementsUpdate />
    },

    {
      path: '/interventions/list',
      element: <AppCrmInterventionsList />
    },
    {
      path: '/interventions/rapports',
      element: <AppCrmInterventionsListRapports />
    },
    {
      path: '/interventions/:interventionId/details',
      element: <AppCrmInterventionDetails />
    },
    {
      path: '/interventions/:interventionId/update',
      element: <AppCrmInterventionUpdate />
    },
    {
      path: '/interventions/:interventionId/formulaire',
      element: <AppCrmInterventionFormulaire />
    },
    {
      path: '/interventions/create',
      element: <AppCrmInterventionsCreate />
    },
    {
      path: '/interventions/calendar',
      element: <AppCrmCalendar />
    },
    {
      path: '/propositions/list',
      element: <AppCrmPropositionsList />
    },
    {
      path: '/propositions/:propositionId/update',
      element: <AppCrmPropositionsUpdate />
    },
    {
      path: '/propositions/:propositionId/details',
      element: <AppCrmPropositionsDetails />
    },

    {
      path: '/calendar',
      element: <AppCrmCalendar />
    },
    {
      path: '/settings/preferences',
      element: <AppCrmPreferencesUpdate />
    },
    {
      path: '/settings/mail',
      element: <AppCrmMailerUpdate />
    },
    {
      path: '/logs',
      element: <LogsList />
    },
    {
      path: '/admin/categories-articles',
      element: <AppCrmCategorieArticleList />
    },
    {
      path: '/admin/categories-articles/create',
      element: <AppCrmCategorieArticleCreate />
    },
    {
      path: '/admin/categories-articles/:categorieId/details',
      element: <AppCrmCategorieArticleDetails />
    },
    {
      path: '/admin/categories-articles/:categorieId/update',
      element: <AppCrmCategorieArticleUpdate />
    },
    {
      path: '/admin/categories-clients',
      element: <AppCrmCategorieClientsList />
    },
    {
      path: '/admin/categories-clients/create',
      element: <AppCrmCategorieClientsCreate />
    },
    {
      path: '/admin/categories-clients/:categorieId/details',
      element: <AppCrmCategorieClientsDetails />
    },
    {
      path: '/admin/categories-clients/:categorieId/update',
      element: <AppCrmCategorieClientsUpdate />
    },

    {
      path: '/settings/current-pieces/:currentPieceId',
      element: <AppCrmCurrentPieceUpdate />
    },
    {
      path: '/settings/current-pieces',
      element: <AppCrmCurrentPieceList />
    },
    {
      path: '/settings/calendrier',
      element: <AppCrmCalendrierList />
    },
    {
      path: '/settings/calendrier/emploi/list/:calendrierId',
      element: <AppCrmCalendrierEmploiList />
    },
    {
      path: '/settings/calendrier/emploi/:calendrierId',
      element: <AppCrmCalendrierEmploi />
    },
    {
      path: '/settings/jour-ferie',
      element: <AppCrmPreferencesJourFerieList />
    },
    {
      path: '/settings/jour-ferie/create',
      element: <AppCrmJourFerieCreate />
    },
    {
      path: '/settings/jour-ferie/:jourFerieId/update',
      element: <AppCrmJourFerieUpdate />
    },

    {
      path: '/settings/jour-ferie/:parentId/jour-ferie-children/list',
      element: <AppCrmPreferencesJourFerieChildrenList />
    },
    {
      path: '/settings/jour-ferie/:parentId/jour-ferie-child/create',
      element: <AppCrmPreferencesJourFerieChildCreate />
    },
    {
      path: '/settings/jour-ferie/:parentId/jour-ferie-child/:jourFerieChildId/update',
      element: <AppCrmPreferencesJourFerieChildUpdate />
    },
    {
      path: '/settings/societe',
      element: <AppCrmSocieteDetails />
    },
    {
      path: '/settings/societe/:societeId/update',
      element: <AppCrmSocieteUpdate />
    },
    ...devRoutes
  ]
};

export default MainRoutes;
