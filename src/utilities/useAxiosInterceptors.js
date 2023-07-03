import axiosClient from 'axiosClient';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

const useAxiosInterceptors = () => {
  useEffect(() => {
    axiosClient.interceptors.response.use(
      function (response) {
        return response;
      },
      function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        if (error.response?.status === 401) {
          // toast.info('Connectez-vous pour continuer', {
          //   toastId: 'edrfgsegdrf'
          // });
        } else if (error.response?.status >= 400 && error.response?.status < 500) {
          if (error?.response?.data?.message !== 'Inspection non trouvé.') {
            toast.error(error?.response?.data?.message);
          }
        }

        return Promise.reject(error);
      }
    );
  }, []);
};

export default useAxiosInterceptors;
