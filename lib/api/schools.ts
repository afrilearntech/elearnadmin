import { apiRequest } from './client';

export interface School {
  id: number;
  district: number;
  name: string;
  status: "APPROVED" | "PENDING" | "REJECTED" | "REQUEST_CHANGES" | "DRAFT";
  moderation_comment: string;
  created_at: string;
  updated_at: string;
}

export interface CreateSchoolRequest {
  district: number;
  name: string;
  status: "APPROVED";
  moderation_comment?: string;
}

export async function getSchools(): Promise<School[]> {
  return apiRequest<School[]>('/admin/schools/');
}

export async function createSchool(data: CreateSchoolRequest): Promise<School> {
  return apiRequest<School>('/admin/schools/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

