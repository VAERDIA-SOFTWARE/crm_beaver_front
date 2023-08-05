import { useQuery } from '@tanstack/react-query';
import axiosClient from 'axiosClient';

export const useGetWidgetsDashboard = () => {
  return useQuery(['widget-stats'], () => axiosClient.get(`/dashboard/widget-stats`).then((res) => res.data), {});
};

export const useGetChartsDashboard = () => {
  return useQuery(['chart-stats'], () => axiosClient.get(`/dashboard/chart-stats`).then((res) => res.data), {});
};
export const useGetStatsDashboard = () => {
  return useQuery(['stats'], () => axiosClient.get(`/dashboard/stats`).then((res) => res.data), {});
};
