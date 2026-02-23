import type { CreateEmailRequest } from '../../types/index.d.ts';

export interface EmailResponse {
  id: string;
  email: string;
  username: string;
  domain: string;
  createdAt: Date;
  expiresAt: Date;
}

export interface MessageResponse {
  id: string;
  from: string;
  subject: string;
  preview: string;
  date: string;
  body: string;
}
