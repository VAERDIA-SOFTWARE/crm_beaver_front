import { useQuery } from '@tanstack/react-query';
import axiosClient from 'axiosClient';

export const useGetReglements = ({ paginated = false, searchFilter = '', page = 1 }) => {
  return useQuery(
    ['', searchFilter, page],
    () =>
      axiosClient
        .get(
          `reglements?${searchFilter ? `search=${searchFilter}&` : ''}${page ? `page=${page}&` : ''}${
            paginated ? `paginated=${paginated}&` : ''
          }`
        )
        .then((res) => res.data),
    {}
  );
};

export const useGetReglementsMode = () => {
  return useQuery(['mode-reglements'], () => {
    // Return the axios.get promise, which will be handled by useQuery
    return axiosClient.get('mode-reglements').then((res) => res.data);
  });
};

export const useGetFactures = () => {
  return useQuery(['factures'], () => {
    return axiosClient.get('factures').then((res) => res.data);
  });
};
