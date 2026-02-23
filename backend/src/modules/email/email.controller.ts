import type { Request, Response } from 'express';
import { emailService } from './email.service.ts';
import { successResponse, errorResponse, notFoundResponse } from '../../utils/response.util.ts';
import type { CreateEmailRequest } from '../../types/index.d.ts';

export class EmailController {
  async create(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const { domain, username } = req.body as CreateEmailRequest;

      const email = await emailService.createEmail(userId, domain, username);

      res.status(201).json(successResponse(email, 'Email created successfully'));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create email';
      res.status(400).json(errorResponse(message));
    }
  }

  async list(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const emails = emailService.getUserEmails(userId);

      res.json(successResponse(emails));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to list emails';
      res.status(500).json(errorResponse(message));
    }
  }

  async getMessages(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const { emailId } = req.params;

      const messages = await emailService.getMessages(emailId, userId);

      res.json(successResponse(messages));
    } catch (error) {
      if (error instanceof Error && error.message === 'Email not found') {
        res.status(404).json(notFoundResponse('Email'));
        return;
      }
      const message = error instanceof Error ? error.message : 'Failed to get messages';
      res.status(500).json(errorResponse(message));
    }
  }

  async getMessage(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const { emailId, messageId } = req.params;

      const message = await emailService.getMessage(emailId, messageId, userId);

      res.json(successResponse(message));
    } catch (error) {
      if (error instanceof Error && error.message === 'Email not found') {
        res.status(404).json(notFoundResponse('Email'));
        return;
      }
      const message = error instanceof Error ? error.message : 'Failed to get message';
      res.status(500).json(errorResponse(message));
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const { emailId } = req.params;

      await emailService.deleteEmail(emailId, userId);

      res.json(successResponse(null, 'Email deleted successfully'));
    } catch (error) {
      if (error instanceof Error && error.message === 'Email not found') {
        res.status(404).json(notFoundResponse('Email'));
        return;
      }
      const message = error instanceof Error ? error.message : 'Failed to delete email';
      res.status(500).json(errorResponse(message));
    }
  }

  listDomains(req: Request, res: Response) {
    const domains = emailService.getDomains();
    res.json(successResponse(domains));
  }
}

export const emailController = new EmailController();
