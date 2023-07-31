import { useQuery } from '@tanstack/react-query';
import axiosClient from 'axiosClient';
export const useGetStateByModel = (model) => {
  return useQuery(['state-model'], () => axiosClient.get(`settings/etats?model=${model}`).then((res) => res.data), {});
};
