import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosClient from 'axiosClient';
import { toast } from 'react-toastify';

export const useGetUsers = ({ role = '', lot = '', type = '', page = 1, searchFilter = '', paginated = true }) => {
  return useQuery(
    ['users', role, type, page, searchFilter],
    () =>
      axiosClient
        .get(
          `users?role_user=${role}${type !== '' ? `&type=${type}` : ''}${
            lot !== '' ? `&lot=${lot}` : ''
          }&page=${page}&search=${searchFilter}&${paginated ? `paginated=${paginated}&` : ''}`
        )
        .then((res) => res.data),
    {}
  );
};

export const useGetUser = (userId = '') => {
  return useQuery(['users', 'user', userId], () => axiosClient.get(`users/${userId}`).then((res) => res.data), {});
};

export const useGetUserPermissions = (clientId = '') => {
  return useQuery(
    ['users-permissions', 'user', clientId],
    () => axiosClient.get(`users/${clientId}/authorized-permissions`).then((res) => res.data),
    {}
  );
};

export const useGetColors = () => {
  return useQuery(['techniciens-colors'], () => axiosClient.get(`technicien/colors`).then((res) => res.data), {});
};

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation(
    async (values) => {
      const res = await axiosClient.post(`users`, values);
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

export function useChangeLeadToClient(userId) {
  const queryClient = useQueryClient();

  return useMutation(
    async () => {
      const res = await axiosClient.post(`users/${userId}/lead-to-client?method=put`);
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

export function useUpdateUser(id = '') {
  return useMutation(
    async (values) => {
      const res = await axiosClient.post(`users/${id}?_method=PUT`, values);
      return res.data;
    },
    {
      onSuccess: (data) => {
        toast.success(data?.message);
      }
    }
  );
}

export function useDeleteUser(id = '') {
  return useMutation(
    async (values) => {
      const res = await axiosClient.delete(`users/${id}`, values);
      return res.data;
    },
    {
      onSuccess: (data) => {
        toast.success(data?.message);
      }
    }
  );
}

export function useToggleUserStatus(id = '') {
  const queryClient = useQueryClient();

  return useMutation(
    async (values) => {
      const res = await axiosClient.put(`users/${id}/toggle-active-status`, values);
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
export function useToggleUserAuth(id = '') {
  const queryClient = useQueryClient();

  return useMutation(
    async (values) => {
      const res = await axiosClient.put(`users/${id}/auth`, values);
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
export function useChangeLoginCredentials(id = '') {
  const queryClient = useQueryClient();

  return useMutation(
    async (values) => {
      const res = await axiosClient.put(`users/${id}/set-login-credentials`, values);
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
export function useChangeMyLoginCredentials() {
  const queryClient = useQueryClient();

  return useMutation(
    async (values) => {
      const res = await axiosClient.post(`user/credentials`, values);
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
export function useLeadsToClients() {
  const queryClient = useQueryClient();

  return useMutation(
    async (values) => {
      const res = await axiosClient.put(`users/leads-to-clients`, values);
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

export function useDeleteUserMutation(id = '') {
  const queryClient = useQueryClient();

  return useMutation(
    async (values) => {
      const res = await axiosClient.delete(`users/${id}`, values);
      return res.data;
    },
    {
      onSuccess: (data) => {
        toast.success(data?.message);
        // queryClient.invalidateQueries();
      }
    }
  );
}

export function useSyncUserPermissions() {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ id, values }) => {
      const res = await axiosClient.post(`users/${id}/sync-permissions?_method=put`, values);
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

export const useGetNotifications = () => {
  return useQuery(['notifications'], () => axiosClient.get(`/user-notifications`).then((res) => res.data), {});
};

export const useMarkNotificationAsRead = () => {
  return useMutation(({ id }) => axiosClient.post(`/notifications/${id}/vue`).then((res) => res.data), {});
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation(() => axiosClient.post(`/notifications/vue`).then((res) => res.data), {
    onSuccess: () => {
      queryClient.invalidateQueries();
    }
  });
};
