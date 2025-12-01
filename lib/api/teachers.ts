import { apiRequest } from "./client";

export interface TeacherProfile {
  id: number;
  email: string;
  phone: string;
  name: string;
  role: string;
  dob: string | null;
  gender: string | null;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  phone_verified: boolean;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

export type TeacherStatus =
  | "APPROVED"
  | "PENDING"
  | "REJECTED"
  | "REVIEW_REQUESTED"
  | "DRAFT";

export interface TeacherRecord {
  id: number;
  profile: TeacherProfile;
  school: number | null;
  status: TeacherStatus;
  moderation_comment: string;
  created_at: string;
  updated_at: string;
}

export async function getTeachers(): Promise<TeacherRecord[]> {
  return apiRequest<TeacherRecord[]>("/content/teachers/");
}


