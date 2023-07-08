import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosClient from 'axiosClient';
import { toast } from 'react-toastify';

export function useCreateArticleContrat() {
  const queryClient = useQueryClient();

  return useMutation(
    async (values) => {
      const res = await axiosClient.post(`contrats/articles`, values);
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

export const useGetArticles = () => {
  return useQuery(['operations'], () => axiosClient.get(`operations`).then((res) => res.data), {});
};

export const useGetArticle = (ArticleId = '') => {
  return useQuery(['operations', ArticleId], () => axiosClient.get(`operations/${ArticleId}`).then((res) => res.data), {
    enabled: !!ArticleId
  });
};

export function useCreateArticle() {
  const queryClient = useQueryClient();

  return useMutation(
    async (values) => {
      const res = await axiosClient.post(`operations`, values);
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

export function useUpdateArticle() {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ ArticleId, values }) => {
      const res = await axiosClient.post(`operations/${ArticleId}?_method=put`, values);
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
export function useDeleteArticle() {
  const queryClient = useQueryClient();

  return useMutation(
    async (ArticleId) => {
      const res = await axiosClient.delete(`operations/${ArticleId}`);
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
