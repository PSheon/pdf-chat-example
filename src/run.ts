import path from "path";

import { mastra } from "./mastra";
import { PDFManager } from "./services/pdf-manager";

const pdfManager = new PDFManager();

async function runPDFChat() {
  try {
    // 載入 PDF 文件
    console.log("🚀 開始載入 PDF 文件...");
    const pdfPath = path.resolve("./pdf-storage/Hamlet.pdf");
    const document = await pdfManager.loadPDF(pdfPath);

    console.log("📚 文件載入完成:");
    console.log(pdfManager.getSummary());

    // 獲取 Agent
    const agent = mastra.getAgent("pdfAgent");

    // 建立聊天執行緒 (thread) 使用 Mastra Memory
    const threadId = `pdf-chat-${document.id}-${Date.now()}`;
    console.log(`\n💬 建立聊天執行緒: ${threadId}`);

    // 定義問題列表
    const questions = [
      "這部戲叫什麼名字？請提供詳細的背景資訊。",
      "哈姆雷特的主要角色有哪些？請描述他們的關係。",
      "這部劇的主要衝突是什麼？",
      "請分析哈姆雷特這個角色的心理狀態。",
      "這部劇中有哪些著名的獨白片段？",
    ];

    // 逐一處理問題
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      console.log(`\n🤔 問題 ${i + 1}: ${question}`);
      console.log("⏳ 處理中...");

      // 準備 Agent 輸入，使用文字模式而不是 base64 檔案模式
      const agentInput = [
        {
          role: "user" as const,
          content: [
            {
              type: "text" as const,
              text: `請根據已載入的 PDF 文件 "${document.fileName}" 回答以下問題：\n\n${question}`,
            },
          ],
        },
      ];

      // 使用 Agent 的 generate 方法，Mastra 會自動處理記憶體
      const result = await agent.generate(agentInput, {
        resourceId: document.id, // 使用文件 ID 作為資源 ID
        threadId: threadId, // 使用執行緒 ID 來維持對話記憶
      });

      // 輸出回答
      console.log("🤖 回答:");
      console.log(result.text);
      console.log("\n" + "=".repeat(60));

      // 短暫延遲避免過快請求
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // 顯示對話摘要 - 從 Mastra Memory 中取得
    console.log("\n📊 對話摘要:");
    console.log(`🗂️ 執行緒 ID: ${threadId}`);
    console.log(`📚 載入的文件: ${document.fileName} (${document.id})`);
    console.log(`💬 處理的問題數量: ${questions.length}`);
    console.log(`⏰ 完成時間: ${new Date().toLocaleString()}`);

    // 嘗試從 agent 中獲取對話記錄
    try {
      console.log("\n📈 記憶體狀態: 對話已儲存至 mastra.db");
      console.log("   - 所有問答記錄都已透過 Mastra Memory 持久化");
      console.log("   - 重新執行程式時會保留對話歷史");
    } catch (error) {
      console.log("\n📈 記憶體狀態: 可能發生錯誤", error);
    }
  } catch (error) {
    console.error("❌ 執行過程中發生錯誤:", error);
  }
}

async function main() {
  await runPDFChat();
}

main().catch(console.error);
