
import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { pdfAgent } from './agents/pdf-agent';

export const mastra = new Mastra({
  agents: { pdfAgent },
  storage: new LibSQLStore({
    // stores telemetry, evals, ... into file storage for persistence
    url: "file:./mastra.db",
  }),
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
});
