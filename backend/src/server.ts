import { app } from './app.js';
import { env } from './config/env.js';

const server = app.listen(env.PORT, () => {
  console.log(`[MediConnect Backend] API server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
  console.log(`[MediConnect Backend] Base URL: http://localhost:${env.PORT}/api/v1`);
  console.log(`[MediConnect Backend] Allowed CORS Origin: ${env.CORS_ORIGIN}`);
});

process.on('SIGTERM', () => {
  console.log('[MediConnect Backend] SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('[MediConnect Backend] Server closed.');
    process.exit(0);
  });
});

export default server;
