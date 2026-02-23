import { v4 as uuidv4 } from 'uuid';
import { guerrillaService } from '../../services/guerrilla.service.ts';
import { GUERRILLA_DOMAINS, appConfig } from '../../config/app.config.ts';
import type { UserEmail, GuerrillaMessage } from '../../types/index.d.ts';
import type { EmailResponse, MessageResponse } from './email.types.ts';
import { logInfo, logError } from '../../utils/logger.util.ts';

const userEmails: Map<string, UserEmail> = new Map();

export class EmailService {
  async createEmail(userId: string, domain?: string, username?: string): Promise<EmailResponse> {
    const validDomain = domain && GUERRILLA_DOMAINS.includes(domain as typeof GUERRILLA_DOMAINS[number])
      ? domain
      : appConfig.guerrilla.defaultDomain;

    let guerrillaEmail;

    if (username) {
      guerrillaEmail = await guerrillaService.setEmailUser(username, validDomain);
    } else {
      guerrillaEmail = await guerrillaService.getEmailAddress();
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 60 * 60 * 1000);

    const userEmail: UserEmail = {
      id: uuidv4(),
      userId,
      email: guerrillaEmail.email,
      username: guerrillaEmail.username,
      domain: guerrillaEmail.domain,
      sidToken: guerrillaEmail.sid_token,
      createdAt: now,
      expiresAt,
    };

    userEmails.set(userEmail.id, userEmail);

    logInfo('Email created', { emailId: userEmail.id, email: userEmail.email, userId });

    return {
      id: userEmail.id,
      email: userEmail.email,
      username: userEmail.username,
      domain: userEmail.domain,
      createdAt: userEmail.createdAt,
      expiresAt: userEmail.expiresAt,
    };
  }

  getUserEmails(userId: string): EmailResponse[] {
    return Array.from(userEmails.values())
      .filter((e) => e.userId === userId)
      .map((e) => ({
        id: e.id,
        email: e.email,
        username: e.username,
        domain: e.domain,
        createdAt: e.createdAt,
        expiresAt: e.expiresAt,
      }));
  }

  getEmailById(emailId: string, userId: string): UserEmail | undefined {
    const email = userEmails.get(emailId);
    if (!email || email.userId !== userId) {
      return undefined;
    }
    return email;
  }

  async getMessages(emailId: string, userId: string): Promise<MessageResponse[]> {
    const email = this.getEmailById(emailId, userId);
    if (!email) {
      throw new Error('Email not found');
    }

    const messages = await guerrillaService.getEmailList(email.sidToken);

    return messages.map((m: GuerrillaMessage) => ({
      id: m.mail_id,
      from: m.mail_from,
      subject: m.mail_subject,
      preview: m.mail_preview,
      date: m.mail_date,
      body: m.mail_body,
    }));
  }

  async getMessage(emailId: string, messageId: string, userId: string): Promise<MessageResponse> {
    const email = this.getEmailById(emailId, userId);
    if (!email) {
      throw new Error('Email not found');
    }

    const message = await guerrillaService.getMessage(email.sidToken, messageId);

    return {
      id: message.mail_id,
      from: message.mail_from,
      subject: message.mail_subject,
      preview: message.mail_preview,
      date: message.mail_date,
      body: message.mail_body,
    };
  }

  async deleteEmail(emailId: string, userId: string): Promise<void> {
    const email = this.getEmailById(emailId, userId);
    if (!email) {
      throw new Error('Email not found');
    }

    try {
      await guerrillaService.forget(email.sidToken);
    } catch (error) {
      logError('Failed to forget Guerrilla email', { error });
    }

    userEmails.delete(emailId);

    logInfo('Email deleted', { emailId, userId });
  }

  getDomains(): string[] {
    return [...GUERRILLA_DOMAINS];
  }
}

export const emailService = new EmailService();
