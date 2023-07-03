import dashboard from './dashboard';
import widget from './widget';
import application from './application';
import forms from './forms';
import elements from './elements';
import pages from './pages';
import utilities from './utilities';
import support from './support';
import other from './other';
import Crm from './crm';

// ==============================|| MENU ITEMS ||============================== //

let menuItems = { items: [] };

if (process.env.NODE_ENV !== 'development') {
  menuItems.items = [Crm];
} else {
  // menuItems.items = [Crm, dashboard, application, widget, forms, elements, pages, utilities, support, other];
  menuItems.items = [Crm];
}

// menuItems = {
//   items: [application, dashboard, widget, forms, elements, pages, utilities, support, other]
// };

export default menuItems;
