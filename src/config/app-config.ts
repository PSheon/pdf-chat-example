export interface AppConfig {
  // PDF 設定
  pdf: {
    maxFileSize: number;
    supportedTypes: string[];
    storageDir: string;
  };

  // Agent 設定
  agent: {
    model: string;
    maxTokens?: number;
    temperature?: number;
    systemPrompt?: string;
  };

  // 記憶體設定
  memory: {
    dbPath: string;
    maxSessions: number;
    sessionTimeoutHours: number;
  };

  // 聊天設定
  chat: {
    maxHistoryLength: number;
    enableAutoSave: boolean;
    responseDelay: number;
  };
}

export const defaultConfig: AppConfig = {
  pdf: {
    maxFileSize: 50 * 1024 * 1024, // 50MB
    supportedTypes: ["application/pdf"],
    storageDir: "./pdf-storage",
  },

  agent: {
    model: "gemini-2.0-flash-exp",
    maxTokens: 4096,
    temperature: 0.1,
    systemPrompt: `
      你是一個專業的 PDF 文件分析專家。
      請基於提供的 PDF 內容給出準確、詳細的回答。
      如果資訊不在文件中，請明確說明。
    `.trim(),
  },

  memory: {
    dbPath: "./mastra.db",
    maxSessions: 100,
    sessionTimeoutHours: 24,
  },

  chat: {
    maxHistoryLength: 50,
    enableAutoSave: true,
    responseDelay: 500,
  },
};

// 載入設定檔（可以從環境變數或檔案覆蓋）
export function loadConfig(): AppConfig {
  const config = { ...defaultConfig };

  // 從環境變數載入設定
  if (process.env.PDF_MAX_SIZE) {
    config.pdf.maxFileSize = parseInt(process.env.PDF_MAX_SIZE);
  }

  if (process.env.AGENT_MODEL) {
    config.agent.model = process.env.AGENT_MODEL;
  }

  if (process.env.MEMORY_DB_PATH) {
    config.memory.dbPath = process.env.MEMORY_DB_PATH;
  }

  return config;
}
