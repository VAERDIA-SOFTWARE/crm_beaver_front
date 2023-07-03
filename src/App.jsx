// routing
import Routes from 'routes';

import './index.css';

import 'react-toastify/dist/ReactToastify.css';

// project imports
import Locales from 'ui-component/Locales';
import NavigationScroll from 'layout/NavigationScroll';
import RTLLayout from 'ui-component/RTLLayout';
import Snackbar from 'ui-component/extended/Snackbar';
import ThemeCustomization from 'themes';

// auth provider
import { TokenProvider as AuthProvider } from 'contexts/TokenContext';
// import { FirebaseProvider as AuthProvider } from 'contexts/FirebaseContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ToastContainer } from 'react-toastify';
import { ConfirmProvider } from 'material-ui-confirm';
import useAxiosInterceptors from 'utilities/useAxiosInterceptors';
// import { AWSCognitoProvider as AuthProvider } from 'contexts/AWSCognitoContext';
// import { JWTProvider as AuthProvider } from 'contexts/JWTContext';
// import { Auth0Provider as AuthProvider } from 'contexts/Auth0Context';

// ==============================|| APP ||============================== //

const queryClient = new QueryClient();

queryClient.setDefaultOptions({
  queries: {
    refetchOnWindowFocus: false,
    retry: false
  },
  mutations: {
    onSuccess: () => {
      queryClient.invalidateQueries();
    }
  }
});

const App = () => {
  useAxiosInterceptors();

  return (
    <ConfirmProvider
      defaultOptions={{
        cancellationText: 'Annuler'
      }}
    >
      <QueryClientProvider client={queryClient}>
        <ThemeCustomization>
          <RTLLayout>
            <Locales>
              <NavigationScroll>
                <AuthProvider>
                  <>
                    <Routes />
                    <Snackbar />
                  </>
                </AuthProvider>
              </NavigationScroll>
            </Locales>
          </RTLLayout>
        </ThemeCustomization>
        <ReactQueryDevtools initialIsOpen={false} />
        <ToastContainer
          style={{
            fontFamily: 'Inter'
          }}
          bodyStyle={{
            fontFamily: 'Inter'
          }}
          toastStyle={{
            fontFamily: 'Inter'
          }}
          limit={3}
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </QueryClientProvider>
    </ConfirmProvider>
  );
};

export default App;
