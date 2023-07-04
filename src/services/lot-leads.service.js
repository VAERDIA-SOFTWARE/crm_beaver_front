import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosClient from 'axiosClient';
import { toast } from 'react-toastify';

export const useGetLotLeads = ({ searchFilter = '', userId = '', page = 1, validated }) => {
  return useQuery(['lots', searchFilter, userId, page, validated], () => axiosClient.get(`lots`).then((res) => res.data), {});
};

export const useCreateLotLeadsExcel = ({ searchFilter = '', userId = '', page = 1, validated }) => {
  return useQuery(
    ['lots', searchFilter, userId, page, validated],
    () =>
      axiosClient
        .get(
          `lots/export-excel?${page ? `page=${page}&` : ''}${searchFilter ? `search=${searchFilter}&` : ''}${
            validated !== -2 ? `validated=${validated}&` : ''
          }${userId ? `userId=${userId}&` : ''}`
        )
        .then((res) => res.data),
    {}
  );
};

export const useGetLotLead = (lotLeadId = '') => {
  return useQuery(['lot-lead', lotLeadId], () => axiosClient.get(`lots/${lotLeadId}`).then((res) => res.data), {
    enabled: !!lotLeadId
  });
};

export function useCreateLotLead() {
  const queryClient = useQueryClient();

  return useMutation(
    async (values) => {
      const res = await axiosClient.post(`lots`, values);
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

export function useGenerateInspections() {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ LotLeadId, values }) => {
      const res = await axiosClient.post(`lots/${LotLeadId}/generate-inspection`, values);
      return res.data;
    },
    {
      onSuccess: (data) => {
        toast.success(data?.message);
        queryClient.invalidateQueries();
      },
      onError: (data) => {
        // toast.error(data?.response?.data?.message);
      }
    }
  );
}
export function useValidateLot(LotLeadId = '') {
  const queryClient = useQueryClient();

  return useMutation(
    async (values) => {
      const res = await axiosClient.put(`lots/${LotLeadId}/validate`, values);
      return res.data;
    },
    {
      onSuccess: (data) => {
        toast.success(data?.message);
        queryClient.invalidateQueries();
      },
      onError: (data) => {
        // toast.error(data?.response?.data?.message);
      }
    }
  );
}

export function useDeleteLot() {
  const queryClient = useQueryClient();

  return useMutation(
    async (LotLeadId) => {
      const res = await axiosClient.delete(`lots/${LotLeadId}`);
      return res.data;
    },
    {
      onSuccess: (data) => {
        toast.success(data?.message);
        queryClient.invalidateQueries();
      },
      onError: (data) => {
        toast.error(data?.response?.data?.message);
      }
    }
  );
}
