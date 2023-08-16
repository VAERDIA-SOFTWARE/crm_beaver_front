import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosClient from 'axiosClient';
import { toast } from 'react-toastify';

export function usePostForm() {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ id = '', values }) => {
      const res = await axiosClient.post(`formulaire-intervention/${id}`, values);
      return res.data;
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries();
        toast.success(data?.message);
      }
    }
  );
}
export function useStoreImage() {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ id = '', values }) => {
      const res = await axiosClient.post(`formulaire-intervention/${id}/store-image`, values);
      return res.data;
    },
    {
      onSuccess: (data) => {
        // queryClient.invalidateQueries();
        toast.success(data?.message);
      }
    }
  );
}
