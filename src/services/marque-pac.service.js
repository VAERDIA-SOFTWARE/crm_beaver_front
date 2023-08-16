import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosClient from 'axiosClient';
import { toast } from 'react-toastify';
import { FALSE } from 'sass';

export const useGetMarquePacs = ({ page = 1, searchFilter = '', paginated = false }) => {
  return useQuery(
    ['parent-operations', page, searchFilter, paginated],
    () =>
      axiosClient
        .get(`parent-operations?page=${page}&search=${searchFilter}&${paginated ? `paginated=${paginated}&` : ''}`)
        .then((res) => res.data),
    {}
  );
};

export const useGetMarquePac = (MarquePacId = '') => {
  return useQuery(['parent-operation', MarquePacId], () => axiosClient.get(`parent-operations/${MarquePacId}`).then((res) => res.data), {
    enabled: !!MarquePacId
  });
};

export function useCreateMarquePac() {
  const queryClient = useQueryClient();

  return useMutation(
    async (values) => {
      const res = await axiosClient.post(`parent-operations`, values);
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

export function useToggleMarquePacStatus(MarquePacId = '') {
  const queryClient = useQueryClient();

  return useMutation(
    async (values) => {
      const res = await axiosClient.put(`parent-operations/${MarquePacId}/toggle`, values);
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

export function useUpdateMarquePac(MarquePacId) {
  const queryClient = useQueryClient();

  return useMutation(
    async (values) => {
      const res = await axiosClient.post(`parent-operations/${MarquePacId}?_method=put`, values);
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
export function useDeleteMarquePac(MarquePacId) {
  return useMutation(
    async () => {
      const res = await axiosClient.delete(`parent-operations/${MarquePacId}`);
      return res.data;
    },
    {
      onSuccess: (data) => {
        toast.success(data?.message);
      }
    }
  );
}
