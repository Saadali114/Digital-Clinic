import type { Request, Response } from 'express';
import { prisma } from '../../config/db.js';

export async function getHealth(_req: Request, res: Response): Promise<void> {
  const timestamp = new Date().toISOString();
  let dbStatus: 'connected' | 'disconnected' = 'disconnected';

  try {
    // Attempt a quick query to test database connectivity
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = 'connected';
  } catch {
    dbStatus = 'disconnected';
  }

  if (dbStatus === 'connected') {
    res.status(200).json({
      status: 'ok',
      timestamp,
      services: {
        api: 'healthy',
        database: 'connected',
      },
    });
  } else {
    // Distinguish API process availability from database availability
    res.status(200).json({
      status: 'degraded',
      timestamp,
      services: {
        api: 'healthy',
        database: 'disconnected',
      },
      message: 'Express API is running normally. PostgreSQL connection is offline or unreachable.',
    });
  }
}
