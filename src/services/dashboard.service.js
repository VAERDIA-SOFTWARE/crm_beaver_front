import { useMutation, useQuery } from '@tanstack/react-query';
import axiosClient from 'axiosClient';
import { toast } from 'react-toastify';

export const useGetWidgetsDashboard = () => {
  return useQuery(['widget-stats'], () => axiosClient.get(`/dashboard/widget-stats`).then((res) => res.data), {});
};

export const useGetChartsDashboard = () => {
  return useQuery(['chart-stats'], () => axiosClient.get(`/dashboard/chart-stats`).then((res) => res.data), {});
};
export const useGetStatsDashboard = () => {
  return useQuery(['stats'], () => axiosClient.get(`/dashboard/stats`).then((res) => res.data), {});
};

export function useUpdateDashboard({ idClient, idBlock }) {
  return useMutation(
    async (values) => {
      const res = await axiosClient.put(`stats-history/${idClient}/${idBlock}`, values);
      return res.data;
    },
    {
      onSuccess: (data) => {
        toast.success(data?.message);
      }
    }
  );
}
