import { appConfig } from '../config/app.config.ts';
import type { GuerrillaEmail, GuerrillaMessage } from '../types/index.d.ts';
import { logInfo, logError } from '../utils/logger.util.ts';

interface GuerrillaApiResponse {
  email: string;
  email_username: string;
  email_domain: string;
  sid_token: string;
  timestamp: number;
}

interface GuerrillaListResponse {
  list: GuerrillaMessage[];
  count: number;
}

export class GuerrillaService {
  private apiUrl: string;
  private userAgent: string;

  constructor() {
    this.apiUrl = appConfig.guerrilla.apiUrl;
    this.userAgent = 'TempMailAPI/1.0';
  }

  private async apiCall<T>(params: Record<string, string>): Promise<T> {
    const urlParams = new URLSearchParams({
      ...params,
      ip: '127.0.0.1',
      agent: this.userAgent,
    });

    const response = await fetch(`${this.apiUrl}?${urlParams.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Guerrilla API error: ${response.status}`);
    }

    const text = await response.text();
    try {
      return JSON.parse(text) as T;
    } catch {
      throw new Error(`Failed to parse Guerrilla response: ${text}`);
    }
  }

  async getEmailAddress(): Promise<GuerrillaEmail> {
    try {
      const result = await this.apiCall<GuerrillaApiResponse>({
        f: 'get_email_address',
      });

      logInfo('Created new Guerrilla email', { email: result.email });

      return {
        email: result.email,
        username: result.email_username,
        domain: result.email_domain,
        sid_token: result.sid_token,
        timestamp: result.timestamp,
      };
    } catch (error) {
      logError('Failed to get email address', { error });
      throw error;
    }
  }

  async setEmailUser(username: string, domain: string): Promise<GuerrillaEmail> {
    try {
      const result = await this.apiCall<GuerrillaApiResponse>({
        f: 'set_email_user',
        email_user: username,
        domain: domain,
      });

      logInfo('Created custom Guerrilla email', { email: result.email });

      return {
        email: result.email,
        username: result.email_username,
        domain: result.email_domain,
        sid_token: result.sid_token,
        timestamp: result.timestamp,
      };
    } catch (error) {
      logError('Failed to set email user', { error, username, domain });
      throw error;
    }
  }

  async getEmailList(sidToken: string): Promise<GuerrillaMessage[]> {
    try {
      const result = await this.apiCall<GuerrillaListResponse & { sid_token: string }>({
        f: 'get_email_list',
        sid_token: sidToken,
      });

      return result.list || [];
    } catch (error) {
      logError('Failed to get email list', { error });
      throw error;
    }
  }

  async getMessage(sidToken: string, messageId: string): Promise<GuerrillaMessage> {
    try {
      const result = await this.apiCall<GuerrillaMessage & { sid_token: string }>({
        f: 'fetch_email',
        email_id: messageId,
        sid_token: sidToken,
      });

      return result;
    } catch (error) {
      logError('Failed to get message', { error, messageId });
      throw error;
    }
  }

  async forget(sidToken: string): Promise<void> {
    try {
      await this.apiCall({
        f: 'forget',
        sid_token: sidToken,
      });

      logInfo('Email session forgotten', { sidToken });
    } catch (error) {
      logError('Failed to forget email', { error });
      throw error;
    }
  }

  async checkEmail(sidToken: string): Promise<boolean> {
    try {
      const result = await this.apiCall<{ email: string }>({
        f: 'check_email',
        sid_token: sidToken,
      });

      return !!result.email;
    } catch {
      return false;
    }
  }
}

export const guerrillaService = new GuerrillaService();
