import { useCallback, useEffect, useState } from 'react';
import { doctorService } from '@/services';
import type { Doctor } from '@/types';
import { DOCTOR_STRINGS } from '@/utils';

interface UseDoctorListOptions {
  initialPage?: number;
  limit?: number;
}

export function useDoctorList({ initialPage = 1, limit = 10 }: UseDoctorListOptions = {}) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [search, setSearch] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [hospital, setHospital] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [page, setPage] = useState(initialPage);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await doctorService.getDoctors({
        page,
        limit,
        search,
        specialization,
        hospital,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });

      setDoctors(response.data);
      setTotalDoctors(response.pagination.totalDoctors);
      setTotalPages(Math.max(1, response.pagination.totalPages));
    } catch (err) {
      setDoctors([]);
      setError(err instanceof Error ? err.message : DOCTOR_STRINGS.unableToLoadDoctors);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, specialization, hospital, startDate, endDate]);

  useEffect(() => {
    let isSubscribed = true;

    doctorService
      .getDoctors({
        page,
        limit,
        search,
        specialization,
        hospital,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      })
      .then((response) => {
        if (!isSubscribed) return;
        setDoctors(response.data);
        setTotalDoctors(response.pagination.totalDoctors);
        setTotalPages(Math.max(1, response.pagination.totalPages));
        setLoading(false);
      })
      .catch((err) => {
        if (!isSubscribed) return;
        setDoctors([]);
        setError(err instanceof Error ? err.message : DOCTOR_STRINGS.unableToLoadDoctors);
        setLoading(false);
      });

    return () => {
      isSubscribed = false;
    };
  }, [page, limit, search, specialization, hospital, startDate, endDate]);

  const handleSearchChange = (value: string) => {
    setLoading(true);
    setSearch(value);
    setPage(1);
  };

  const handleSpecializationChange = (value: string) => {
    setLoading(true);
    setSpecialization(value);
    setPage(1);
  };

  const handleHospitalChange = (value: string) => {
    setLoading(true);
    setHospital(value);
    setPage(1);
  };

  const handleStartDateChange = (value: string) => {
    setLoading(true);
    setStartDate(value);
    setPage(1);
  };

  const handleEndDateChange = (value: string) => {
    setLoading(true);
    setEndDate(value);
    setPage(1);
  };

  const clearFilters = () => {
    setLoading(true);
    setSearch('');
    setSpecialization('');
    setHospital('');
    setStartDate('');
    setEndDate('');
    setPage(1);
  };

  const deleteDoctor = async (doctor: Doctor): Promise<boolean> => {
    const confirmed = window.confirm(DOCTOR_STRINGS.deleteConfirmation(doctor.name));
    if (!confirmed) return false;

    setError('');
    setSuccess('');

    try {
      await doctorService.deleteDoctor(doctor._id);
      setSuccess(DOCTOR_STRINGS.doctorDeletedSuccess(doctor.name));

      if (doctors.length === 1 && page > 1) {
        setPage((current) => current - 1);
      } else {
        await fetchDoctors();
      }
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : DOCTOR_STRINGS.unableToDeleteDoctor);
      return false;
    }
  };

  return {
    doctors,
    loading,
    error,
    success,
    setError,
    setSuccess,
    search,
    specialization,
    hospital,
    startDate,
    endDate,
    page,
    totalDoctors,
    totalPages,
    setPage,
    handleSearchChange,
    handleSpecializationChange,
    handleHospitalChange,
    handleStartDateChange,
    handleEndDateChange,
    clearFilters,
    refetch: fetchDoctors,
    deleteDoctor,
  };
}

