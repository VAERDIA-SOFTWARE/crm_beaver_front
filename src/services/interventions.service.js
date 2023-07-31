import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosClient from 'axiosClient';
import { toast } from 'react-toastify';

export const useGetModeInterventions = () => {
  return useQuery(['mode-interventions'], () => axiosClient.get(`/mode-interventions`).then((res) => res.data), {});
};

export const useGetInterventionsProposes = ({ paginated = false, searchFilter = '', userId = '', page = 1 }) => {
  return useQuery(
    ['interventions-proposer', searchFilter, userId, page],
    () =>
      axiosClient
        .get(
          `interventions-proposer?${searchFilter ? `search=${searchFilter}&` : ''}${userId ? `userId=${userId}&` : ''}${
            page ? `page=${page}&` : ''
          }${paginated ? `paginated=${paginated}&` : ''}`
        )
        .then((res) => res.data),
    {}
  );
};
