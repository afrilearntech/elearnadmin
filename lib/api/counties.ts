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

export interface BulkUploadCountyResult {
  row?: number;
  status: string;
  county_id?: number;
  name?: string;
  errors?: Record<string, string[]>;
  [key: string]: any;
}

export interface BulkUploadCountyResponse {
  summary: {
    total_rows: number;
    created: number;
    failed: number;
  };
  results: BulkUploadCountyResult[];
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

export async function downloadCountyBulkTemplate(): Promise<Blob> {
  // Mirrors the pattern used in students/teachers/content-managers bulk template downloads
  const response = await apiRequest<Response>('/admin/counties/bulk-template/', {
    method: 'GET',
  } as any);

  if (!(response instanceof Response)) {
    // Fallback: when apiRequest is configured to return the raw body instead of Response
    // we throw a clear error since counties bulk template should return a file.
    throw new Error('Unexpected response type when downloading county bulk template.');
  }

  if (!response.ok) {
    throw new Error('Failed to download county bulk template.');
  }

  return await response.blob();
}

export async function bulkCreateCounties(file: File): Promise<BulkUploadCountyResponse> {
  const formData = new FormData();
  formData.append('file', file);

  return apiRequest<BulkUploadCountyResponse>('/admin/counties/bulk-create/', {
    method: 'POST',
    body: formData,
  });
}


