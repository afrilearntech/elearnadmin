import { apiRequest } from './client';

export interface District {
  id: number;
  county: number;
  name: string;
  status: "APPROVED" | "PENDING" | "REJECTED" | "REVIEW_REQUESTED" | "DRAFT";
  moderation_comment: string;
  created_at: string;
  updated_at: string;
}

export interface UpdateDistrictRequest {
  county?: number;
  name?: string;
  status: "APPROVED" | "REJECTED" | "REVIEW_REQUESTED";
  moderation_comment?: string;
}

export interface CreateDistrictRequest {
  county: number;
  name: string;
  status: "APPROVED";
  moderation_comment?: string;
}

export async function getDistricts(): Promise<District[]> {
  return apiRequest<District[]>('/admin/districts/');
}

export async function getApprovedDistricts(): Promise<District[]> {
  const districts = await getDistricts();
  return districts.filter(district => district.status === "APPROVED");
}

export async function updateDistrict(id: number, data: UpdateDistrictRequest): Promise<District> {
  return apiRequest<District>(`/admin/districts/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function createDistrict(data: CreateDistrictRequest): Promise<District> {
  return apiRequest<District>('/admin/districts/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}


