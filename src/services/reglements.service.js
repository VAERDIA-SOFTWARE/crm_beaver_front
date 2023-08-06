import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosClient from 'axiosClient';
import { toast } from 'react-toastify';

export const useGetReglements = ({ paginated = true, searchFilter = '', page = 1 }) => {
  return useQuery(
    ['reglements', searchFilter, page],
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

export const useGetFactures = ({ paginate = false }) => {
  return useQuery(['factures', paginate], () => {
    return axiosClient.get(`factures?${paginate !== false ? 'paginate=true&' : ''}`).then((res) => res.data);
  });
};
export function useCreateReglement() {
  const queryClient = useQueryClient();

  return useMutation(
    async (values) => {
      const res = await axiosClient.post(`reglements`, values);
      return res.data;
    },
    {
      onSuccess: (data) => {
        toast.success(data?.message);
        queryClient.invalidateQueries();
      }
    }
  );
}

export const useGetReglement = (reglementId = '') => {
  return useQuery(['reglements', reglementId], () => axiosClient.get(`reglements/${reglementId}`).then((res) => res.data));
};
export function useDeleteReglementMutation(id = '') {
  const queryClient = useQueryClient();

  return useMutation(
    async (values) => {
      const res = await axiosClient.delete(`reglements/${id}`, values);
      return res.data;
    },
    {
      onSuccess: (data) => {
        toast.success(data?.message);
        // queryClient.invalidateQueries();
      }
    }
  );
}

export function useUpdateReglement(id = '') {
  return useMutation(
    async (values) => {
      const res = await axiosClient.put(`reglements/${id}`, values);
      return res.data;
    },
    {
      onSuccess: (data) => {
        toast.success(data?.message);
      }
    }
  );
}
