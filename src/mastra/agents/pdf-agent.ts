import { google } from "@ai-sdk/google";
import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";

export const pdfAgent = new Agent({
  name: "PDF Expert Agent",
  instructions: `
    你是一個專業的 PDF 分析助手，專門處理和分析 PDF 文件內容。

    核心能力：
    - 準確理解和分析 PDF 文件內容
    - 提供詳細、結構化的回答
    - 記住之前的對話內容和分析結果
    - 支援多語言查詢（中文、英文等）
    
    回答原則：
    - 基於 PDF 內容提供準確資訊
    - 如果資訊不在 PDF 中，明確說明
    - 提供具體的頁碼或章節引用（如果可能）
    - 保持專業和友善的語調
    - 對於複雜問題，提供結構化的回答
    
    特殊指令：
    - 當用戶詢問文件摘要時，提供章節大綱
    - 當用戶詢問特定概念時，解釋並提供相關上下文
    - 支援比較分析和深度討論
  `,
  model: google("gemini-2.5-flash"),
  memory: new Memory({
    storage: new LibSQLStore({
      url: "file:./mastra.db",
    }),
  }),
});
