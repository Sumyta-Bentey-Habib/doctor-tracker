import { apiRequest } from '@/lib/api';
import type {
  DoctorListResponse,
  Patient,
  PatientListResponse,
  PatientPayload,
  PatientQueryParams,
} from '@/types';

export const patientService = {
  async getPatients(params: PatientQueryParams = {}): Promise<PatientListResponse> {
    const searchParams = new URLSearchParams({
      page: String(params.page ?? 1),
      limit: String(params.limit ?? 10),
    });

    if (params.search?.trim()) {
      searchParams.set('search', params.search.trim());
    }

    if (params.condition?.trim()) {
      searchParams.set('condition', params.condition.trim());
    }

    return apiRequest<PatientListResponse>(`/patients?${searchParams.toString()}`);
  },

  async getDoctors(): Promise<DoctorListResponse> {
    return apiRequest<DoctorListResponse>('/doctors?page=1&limit=100');
  },

  async createPatient(doctorId: string, payload: PatientPayload): Promise<{ success: boolean; data: Patient }> {
    return apiRequest<{ success: boolean; data: Patient }>(`/doctors/${doctorId}/patients`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updatePatient(patientId: string, payload: PatientPayload): Promise<{ success: boolean; data: Patient }> {
    return apiRequest<{ success: boolean; data: Patient }>(`/patients/${patientId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async deletePatient(patientId: string): Promise<{ success: boolean; message?: string }> {
    return apiRequest<{ success: boolean; message?: string }>(`/patients/${patientId}`, {
      method: 'DELETE',
    });
  },

  async logout(): Promise<void> {
    await apiRequest('/auth/logout', { method: 'POST' });
  },
};

