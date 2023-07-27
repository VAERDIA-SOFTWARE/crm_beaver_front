import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosClient from 'axiosClient';
import { toast } from 'react-toastify';

export function useCreateArticleContrat(contratId) {
  const queryClient = useQueryClient();

  return useMutation(
    async (values) => {
      const res = await axiosClient.post(`contrats/${contratId}/articles`, values);
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

export const useGetNewArticles = (id) => {
  return useQuery(['contracts-new-articles'], () => axiosClient.get(`contrats/${id}/new-articles`).then((res) => res.data), {});
};
export const useGetArticles = () => {
  return useQuery(['operations'], () => axiosClient.get(`operations`).then((res) => res.data), {});
};

export const useGetArticle = (articleId = '') => {
  return useQuery(['operation', articleId], () => axiosClient.get(`operations/${articleId}`).then((res) => res.data), {
    enabled: !!articleId
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

export function useToggleArticleStatus(articleId = '') {
  const queryClient = useQueryClient();

  return useMutation(
    async (values) => {
      const res = await axiosClient.put(`operations/${articleId}/toggle`, values);
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

export function useUpdateArticle(articleId) {
  const queryClient = useQueryClient();

  return useMutation(
    async (values) => {
      const res = await axiosClient.post(`operations/${articleId}?_method=put`, values);
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
export function useDeleteArticle(articleId) {
  return useMutation(
    async () => {
      const res = await axiosClient.delete(`operations/${articleId}`);
      return res.data;
    },
    {
      onSuccess: (data) => {
        toast.success(data?.message);
      }
    }
  );
}
