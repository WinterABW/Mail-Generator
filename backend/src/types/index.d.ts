export interface User {
  id: string;
  username: string;
  password: string;
  createdAt: Date;
}

export interface UserEmail {
  id: string;
  userId: string;
  email: string;
  username: string;
  domain: string;
  sidToken: string;
  createdAt: Date;
  expiresAt: Date;
}

export interface GuerrillaEmail {
  email: string;
  username: string;
  domain: string;
  sid_token: string;
  timestamp: number;
}

export interface GuerrillaMessage {
  mail_id: string;
  mail_from: string;
  mail_subject: string;
  mail_preview: string;
  mail_date: string;
  mail_body: string;
  mail_read: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AuthPayload {
  userId: string;
  username: string;
}

export interface CreateEmailRequest {
  domain?: string;
  username?: string;
}
