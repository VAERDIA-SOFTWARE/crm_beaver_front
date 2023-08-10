import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosClient from 'axiosClient';
import { toast } from 'react-toastify';

export const useGetInspections = ({ paginated = false, searchFilter = '', userId = '', page = 1, etat = '' }) => {
  return useQuery(
    ['interventions', searchFilter, userId, page, etat, paginated],
    () =>
      axiosClient
        .get(
          `interventions?${searchFilter ? `search=${searchFilter}&` : ''}${userId ? `collaborator=${userId}&` : ''}${
            page ? `page=${page}&` : ''
          }${etat !== -1 ? `etat=${etat}&` : ''}${paginated !== -1 ? `paginated=${paginated}&` : ''}`
        )
        .then((res) => res.data),
    {}
  );
};

export const useGetInspectionsProposes = ({ searchFilter = '', userId = '', page = 1 }) => {
  return useQuery(
    ['inspections-proposer', searchFilter, userId, page],
    () =>
      axiosClient
        .get(
          `inspections-proposer?${searchFilter ? `search=${searchFilter}&` : ''}${userId ? `userId=${userId}&` : ''}${
            page ? `page=${page}&` : ''
          }`
        )
        .then((res) => res.data),
    {}
  );
};

export const useGetInspection = (inspectionId = '', isInspection, isChantierFetching) => {
  return useQuery(
    ['interventions', inspectionId, isInspection, isChantierFetching],
    () => axiosClient.get(`interventions/${inspectionId}`).then((res) => res.data),
    {
      enabled: !!inspectionId
      // enabled: !!inspectionId && !!isInspection && !isChantierFetching
    }
  );
};

export const useGetProposition = (propositionId = '') => {
  return useQuery(['interventions-proposer', propositionId], () =>
    axiosClient.get(`interventions-proposer/${propositionId}`).then((res) => res.data)
  );
};

export function useUpdateInspection() {
  return useMutation(
    async ({ id = '', values }) => {
      const res = await axiosClient.put(`interventions/${id}`, values);
      return res.data;
    },
    {
      onSuccess: (data) => {
        toast.success(data?.message);
      }
    }
  );
}
export function useUpdateProposition() {
  return useMutation(
    async ({ id = '', values }) => {
      const res = await axiosClient.put(`interventions-proposer/${id}`, values);
      return res.data;
    },
    {
      onSuccess: (data) => {
        toast.success(data?.message);
      }
    }
  );
}

export function useCreateInspection() {
  const queryClient = useQueryClient();

  return useMutation(
    async (values) => {
      const res = await axiosClient.post(`interventions`, values);
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

export function useDeleteInspection() {
  const queryClient = useQueryClient();

  return useMutation(
    async (values) => {
      const res = await axiosClient.delete(`interventions/${values?.inspectionId}`);
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
export function useDeleteProposition() {
  const queryClient = useQueryClient();

  return useMutation(
    async (values) => {
      const res = await axiosClient.delete(`inspections-proposer/${values?.inspectionId}`);
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

export const useGetInspectionsStatistics = ({ yearFilter = 0, userId = 1 }) => {
  return useQuery(['inspections-statistics', yearFilter, userId], () =>
    axiosClient.get(`inspections/statistics/users/${userId}?${yearFilter ? `year=${yearFilter}&` : ''}`).then((res) => res.data)
  );
};

export const useGetInspectionsTechniciens = ({ interventionId = '' }) => {
  return useQuery(['inspections-techniciens', interventionId], () =>
    axiosClient.get(`interventions/${interventionId}/collaborators-disponibles`).then((res) => res.data)
  );
};
export const useGetPropositionsTechniciens = ({ reference = '', date }) => {
  return useQuery(['inspections-techniciens', reference, date], () =>
    axiosClient.get(`users/free-collaborators-intervention-proposer?date=${date}&reference=${reference}`).then((res) => res.data)
  );
};
export const useGetInspectionsStatsByCommande = (commandeId = '') => {
  return useQuery(
    ['inspections-stats-commande', commandeId],
    () => axiosClient.get(`inspections/statistics/commande/${commandeId}`).then((res) => res.data),
    {
      enabled: !!commandeId
    }
  );
};

export function useValiderPropositions() {
  const queryClient = useQueryClient();

  return useMutation(
    async (values) => {
      const res = await axiosClient.post(`interventions-proposer/propositions-to-interventions`, values);
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

export function useGenererInspectionsRapport() {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ values, inspectionId }) => {
      const res = await axiosClient.post(`rapports/${inspectionId}/generate-pdf`, values);
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
export function useValidateInspections() {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ inspectionId }) => {
      const res = await axiosClient.put(`interventions/${inspectionId}/validate`);
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

export const useGetInspectionFormulaire = ({ inspectionId = '' }) => {
  return useQuery(['inspections', 'formulaire', inspectionId], () =>
    axiosClient.get(`inspections/${inspectionId}/formulaire`).then((res) => res.data)
  );
};
