import { apiRequest } from './client';

export interface County {
  id: number;
  name: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED' | 'REVIEW_REQUESTED' | 'DRAFT';
  moderation_comment: string;
  created_at: string;
  updated_at: string;
}

export interface UpdateCountyRequest {
  name?: string;
  status: 'APPROVED' | 'REJECTED' | 'REVIEW_REQUESTED';
  moderation_comment?: string;
}

export interface CreateCountyRequest {
  name: string;
  status: 'APPROVED';
  moderation_comment?: string;
}

export async function getCounties(): Promise<County[]> {
  return apiRequest<County[]>('/admin/counties/');
}

export async function createCounty(
  data: CreateCountyRequest
): Promise<County> {
  return apiRequest<County>('/admin/counties/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateCounty(
  id: number,
  data: UpdateCountyRequest
): Promise<County> {
  return apiRequest<County>(`/admin/counties/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

