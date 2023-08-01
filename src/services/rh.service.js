import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosClient from 'axiosClient';
import { toast } from 'react-toastify';

export const useGetpointages = ({ date_debut, date_fin }) => {
  return useQuery(
    ['pointages', date_debut, date_fin],
    () => axiosClient.get(`/pointages?between=${date_debut}-${date_fin}`).then((res) => res.data),
    {}
  );
};
