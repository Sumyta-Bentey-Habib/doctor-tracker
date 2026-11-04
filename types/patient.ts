import type { Doctor } from './doctor';

export type Gender = 'Male' | 'Female' | 'Other';

export interface Patient {
  _id: string;
  name: string;
  age: number;
  gender: Gender;
  phone: string;
  condition: string;
  doctorId: Doctor | string;
  createdAt: string;
}

export interface PatientPagination {
  currentPage: number;
  limit: number;
  totalPatients: number;
  totalPages: number;
}

export interface PatientListResponse {
  success: boolean;
  data: Patient[];
  pagination: PatientPagination;
}

export interface PatientForm {
  name: string;
  age: string;
  gender: Gender;
  phone: string;
  condition: string;
  doctorId: string;
}

export interface PatientPayload {
  name: string;
  age: number;
  gender: Gender;
  phone: string;
  condition: string;
}

export interface PatientQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  condition?: string;
  startDate?: string;
  endDate?: string;
}
