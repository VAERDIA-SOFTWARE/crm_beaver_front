import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosClient from 'axiosClient';
import { toast } from 'react-toastify';
import { FALSE } from 'sass';

export const useGetNewArticles = (id) => {
  return useQuery(['contracts-new-articles'], () => axiosClient.get(`contrats/${id}/new-articles`).then((res) => res.data), {});
};
export const useGetModeFacturations = ({ page = 1, searchFilter = '', paginated = false }) => {
  return useQuery(
    ['mode-facturation-list', page, searchFilter, paginated],
    () =>
      axiosClient
        .get(`mode-factures?page=${page}&search=${searchFilter}&${paginated ? `paginated=${paginated}&` : ''}`)
        .then((res) => res.data),
    {}
  );
};

export const useGetModeFacturation = (ModeFacturationId = '') => {
  return useQuery(
    ['mode-facturation', ModeFacturationId],
    () => axiosClient.get(`mode-factures/${ModeFacturationId}`).then((res) => res.data),
    {
      enabled: !!ModeFacturationId
    }
  );
};

export function useCreateModeFacturation() {
  const queryClient = useQueryClient();

  return useMutation(
    async (values) => {
      const res = await axiosClient.post(`mode-factures`, values);
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

export function useToggleModeFacturationStatus(ModeFacturationId = '') {
  const queryClient = useQueryClient();

  return useMutation(
    async (values) => {
      const res = await axiosClient.put(`mode-factures/${ModeFacturationId}/toggle`, values);
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

export function useUpdateModeFacturation(ModeFacturationId) {
  const queryClient = useQueryClient();

  return useMutation(
    async (values) => {
      const res = await axiosClient.post(`mode-factures/${ModeFacturationId}?_method=put`, values);
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
export function useDeleteModeFacturation(ModeFacturationId) {
  return useMutation(
    async () => {
      const res = await axiosClient.delete(`mode-factures/${ModeFacturationId}`);
      return res.data;
    },
    {
      onSuccess: (data) => {
        toast.success(data?.message);
      }
    }
  );
}
