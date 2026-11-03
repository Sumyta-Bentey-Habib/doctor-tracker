import { useCallback, useEffect, useState } from 'react';
import { patientService } from '@/services';
import type { Patient } from '@/types';
import { PATIENT_STRINGS } from '@/utils';

interface UsePatientsOptions {
  initialPage?: number;
  limit?: number;
}

export function usePatients({ initialPage = 1, limit = 10 }: UsePatientsOptions = {}) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [condition, setCondition] = useState('');
  const [page, setPage] = useState(initialPage);
  const [totalPatients, setTotalPatients] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await patientService.getPatients({
        page,
        limit,
        search,
        condition,
      });

      setPatients(response.data);
      setTotalPatients(response.pagination.totalPatients);
      setTotalPages(response.pagination.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : PATIENT_STRINGS.failedToLoadPatients);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, condition]);

  useEffect(() => {
    let isSubscribed = true;

    patientService
      .getPatients({ page, limit, search, condition })
      .then((response) => {
        if (!isSubscribed) return;
        setPatients(response.data);
        setTotalPatients(response.pagination.totalPatients);
        setTotalPages(response.pagination.totalPages);
        setLoading(false);
      })
      .catch((err) => {
        if (!isSubscribed) return;
        setError(err instanceof Error ? err.message : PATIENT_STRINGS.failedToLoadPatients);
        setLoading(false);
      });

    return () => {
      isSubscribed = false;
    };
  }, [page, limit, search, condition]);

  const handleSearchChange = (value: string) => {
    setLoading(true);
    setSearch(value);
    setPage(1);
  };

  const handleConditionChange = (value: string) => {
    setLoading(true);
    setCondition(value);
    setPage(1);
  };

  const deletePatient = async (patient: Patient): Promise<boolean> => {
    const confirmed = window.confirm(PATIENT_STRINGS.deleteConfirmation(patient.name));
    if (!confirmed) return false;

    setDeletingId(patient._id);
    setError('');

    try {
      await patientService.deletePatient(patient._id);

      if (patients.length === 1 && page > 1) {
        setPage((current) => current - 1);
      } else {
        await fetchPatients();
      }
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : PATIENT_STRINGS.failedToDeletePatient);
      return false;
    } finally {
      setDeletingId(null);
    }
  };

  return {
    patients,
    loading,
    error,
    search,
    condition,
    page,
    totalPatients,
    totalPages,
    deletingId,
    setPage,
    handleSearchChange,
    handleConditionChange,
    refetch: fetchPatients,
    deletePatient,
  };
}

