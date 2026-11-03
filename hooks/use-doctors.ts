import { useCallback, useEffect, useState } from 'react';
import { patientService } from '@/services';
import type { Doctor } from '@/types';
import { PATIENT_STRINGS } from '@/utils';

export function useDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await patientService.getDoctors();
      setDoctors(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : PATIENT_STRINGS.failedToLoadDoctors);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isSubscribed = true;

    patientService
      .getDoctors()
      .then((response) => {
        if (!isSubscribed) return;
        setDoctors(response.data);
        setLoading(false);
      })
      .catch((err) => {
        if (!isSubscribed) return;
        setError(err instanceof Error ? err.message : PATIENT_STRINGS.failedToLoadDoctors);
        setLoading(false);
      });

    return () => {
      isSubscribed = false;
    };
  }, []);

  return {
    doctors,
    loading,
    error,
    refetch: fetchDoctors,
  };
}

