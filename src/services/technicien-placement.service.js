import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosClient from 'axiosClient';
import { toast } from 'react-toastify';

export const useGetTechnicienPLacement = (technicientId = '') => {
  return useQuery(['technicien-placment', technicientId], () =>
    axiosClient.get(`positions-technicien/${technicientId}`).then((res) => res.data)
  );
};

export function useEvent(technicientId = '') {
  const queryClient = useQueryClient();

  return useMutation(
    async (values) => {
      const res = await axiosClient.get(`event/${technicientId}`, values);
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
