export interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
  createdAt: string;
}

export interface DoctorPagination {
  currentPage: number;
  limit: number;
  totalDoctors: number;
  totalPages: number;
}

export interface DoctorListResponse {
  success: boolean;
  data: Doctor[];
  pagination: DoctorPagination;
}

export interface DoctorForm {
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
}

export interface DoctorQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  specialization?: string;
  hospital?: string;
  startDate?: string;
  endDate?: string;
}

