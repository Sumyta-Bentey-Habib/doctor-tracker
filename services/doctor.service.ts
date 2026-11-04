import { apiRequest } from '@/lib/api';
import type {
  Doctor,
  DoctorForm,
  DoctorListResponse,
  DoctorQueryParams,
  Patient,
  PatientListResponse,
  PatientPayload,
} from '@/types';

export const doctorService = {
  async getDoctors(params: DoctorQueryParams = {}): Promise<DoctorListResponse> {
    const searchParams = new URLSearchParams({
      page: String(params.page ?? 1),
      limit: String(params.limit ?? 10),
    });

    if (params.search?.trim()) {
      searchParams.set('search', params.search.trim());
    }

    if (params.specialization?.trim()) {
      searchParams.set('specialization', params.specialization.trim());
    }

    if (params.hospital?.trim()) {
      searchParams.set('hospital', params.hospital.trim());
    }

    if (params.startDate?.trim()) {
      searchParams.set('startDate', params.startDate.trim());
    }

    if (params.endDate?.trim()) {
      searchParams.set('endDate', params.endDate.trim());
    }

    return apiRequest<DoctorListResponse>(`/doctors?${searchParams.toString()}`);
  },

  async getDoctorPatients(
    doctorId: string,
    params: { page?: number; limit?: number } = {}
  ): Promise<PatientListResponse> {
    const searchParams = new URLSearchParams({
      page: String(params.page ?? 1),
      limit: String(params.limit ?? 50),
    });

    return apiRequest<PatientListResponse>(
      `/doctors/${doctorId}/patients?${searchParams.toString()}`
    );
  },

  async addDoctorPatient(
    doctorId: string,
    payload: PatientPayload
  ): Promise<{ success: boolean; data: Patient }> {
    return apiRequest<{ success: boolean; data: Patient }>(
      `/doctors/${doctorId}/patients`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    );
  },

  async deleteDoctorPatient(
    doctorId: string,
    patientId: string
  ): Promise<{ success: boolean; message?: string }> {
    return apiRequest<{ success: boolean; message?: string }>(
      `/doctors/${doctorId}/patients/${patientId}`,
      {
        method: 'DELETE',
      }
    );
  },

  async createDoctor(form: DoctorForm): Promise<{ success: boolean; data: Doctor }> {
    return apiRequest<{ success: boolean; data: Doctor }>('/doctors', {
      method: 'POST',
      body: JSON.stringify(form),
    });
  },

  async updateDoctor(
    id: string,
    form: DoctorForm
  ): Promise<{ success: boolean; data: Doctor }> {
    return apiRequest<{ success: boolean; data: Doctor }>(`/doctors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(form),
    });
  },

  async deleteDoctor(id: string): Promise<{ success: boolean; message?: string }> {
    return apiRequest<{ success: boolean; message?: string }>(`/doctors/${id}`, {
      method: 'DELETE',
    });
  },

  async logout(): Promise<void> {
    await apiRequest('/auth/logout', { method: 'POST' });
  },
};

