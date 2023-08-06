import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosClient from 'axiosClient';
import { toast } from 'react-toastify';

export const useGetFactures = ({ payed = null, paginated = false, page, searchFilter, clientId, type, status = null }) => {
  return useQuery(
    ['factures', page, payed, searchFilter, paginated, clientId, type, status],
    () => {
      return axiosClient
        .get(
          `factures?page=${page}&${searchFilter ? `search=${searchFilter}&` : ''}${clientId ? `clientId=${clientId}&` : ''}${
            paginated ? `paginated=${paginated}&` : ''
          }${type ? `type=${type}&` : ''}${status ? `status=${status}&` : ''}${payed ? `payed=${payed}&` : ''}`
        )
        .then((res) => res.data);
    },
    {}
  );
};

export const useGetFacture = (factureId = '') => {
  return useQuery(['factures', factureId], () => axiosClient.get(`factures/${factureId}`).then((res) => res.data), {
    enabled: !!factureId
  });
};
export const useGetInvoices = ({ paginated = false, user = false, search = false, pageSize, page }) => {
  return useQuery(
    ['invoices', paginated, user, search, pageSize, page],
    () =>
      axiosClient
        .get(
          `factures?${paginated ? `paginated=true&page_size=${pageSize}&page=${page}&` : ``}${user ? `user=${user}&` : ''}${
            search ? `search=${search}` : ''
          }`
        )
        .then((res) => res.data),
    {}
  );
};

export const useGetInvoiceById = (invoiceId = '') => {
  return useQuery(['factures', invoiceId], () => axiosClient.get(`factures/${invoiceId}`).then((res) => res.data), {});
};

export function useCreateInvoice(invoiceId = '') {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ values, invoiceId = '' }) => {
      const res = await axiosClient.post(`factures${invoiceId !== '' ? `/${invoiceId}` : ''}`, values);

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

export function useCreateInvoiceAvoir(invoiceId) {
  const queryClient = useQueryClient();

  return useMutation(
    async () => {
      const res = await axiosClient.post(`factures/${invoiceId}/avoir`);

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

export function useUpdateInvoice(invoiceId) {
  const queryClient = useQueryClient();

  return useMutation(
    async (values) => {
      const res = await axiosClient.put(`factures/${invoiceId}`, values);

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

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ id }) => {
      const res = await axiosClient.delete(`users/${id}`);

      return res.data;
    },
    {
      onSuccess: (data) => {
        toast.success(data?.message);
        queryClient.invalidateQueries();
      },
      onError: (data) => {
        toast.error(data?.message);
      }
    }
  );
}

export const useGetNextRefrence = (type) => {
  try {
    return useQuery(['factures-next-refrences'], () => axiosClient.get(`factures/next-reference/${type}`).then((res) => res.data), {});
  } catch (err) {
    console.log(err);
  }
};

export const useGetHeaderTotal = (lines) => {
  try {
    return useQuery(
      ['total-invoice-preview', lines],
      () => axiosClient.post(`factures/preview/total-invoice`, { lines: lines }).then((res) => res.data),
      {}
    );
  } catch (err) {
    console.log(err);
  }
};

export const useValidateInvoice = (invoiceId) => {
  const queryClient = useQueryClient();

  return useMutation(
    async () => {
      const res = await axiosClient.put(`factures/${invoiceId}/validate-facture`);

      return res.data;
    },
    {
      onSuccess: (data) => {
        toast.success(data?.message);
        queryClient.invalidateQueries();
      },
      onError: (data) => {
        toast.error(data?.message);
      }
    }
  );
};

export const useCancelInvoice = (invoiceId) => {
  const queryClient = useQueryClient();

  return useMutation(
    async () => {
      const res = await axiosClient.put(`factures/${invoiceId}/cancel-facture`);

      return res.data;
    },
    {
      onSuccess: (data) => {
        toast.success(data?.message);
        queryClient.invalidateQueries();
      },
      onError: (data) => {
        toast.error(data?.message);
      }
    }
  );
};
