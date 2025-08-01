import { PDFManager } from "./pdf-manager";

export interface ChatSession {
  id: string;
  documents: string[]; // PDF document IDs
  messages: ChatMessage[];
  createdAt: Date;
  lastActivity: Date;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  documentContext?: string; // 相關的 PDF document ID
}

export class ChatManager {
  private sessions = new Map<string, ChatSession>();
  private pdfManager: PDFManager;

  constructor(pdfManager: PDFManager) {
    this.pdfManager = pdfManager;
  }

  /**
   * 建立新的聊天會話
   */
  createSession(documentIds: string[] = []): ChatSession {
    const sessionId = this.generateSessionId();
    const session: ChatSession = {
      id: sessionId,
      documents: documentIds,
      messages: [],
      createdAt: new Date(),
      lastActivity: new Date(),
    };

    this.sessions.set(sessionId, session);
    return session;
  }

  /**
   * 添加訊息到會話
   */
  addMessage(
    sessionId: string,
    role: "user" | "assistant",
    content: string,
    documentContext?: string
  ): ChatMessage {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`找不到會話: ${sessionId}`);
    }

    const message: ChatMessage = {
      id: this.generateMessageId(),
      role,
      content,
      timestamp: new Date(),
      documentContext,
    };

    session.messages.push(message);
    session.lastActivity = new Date();

    return message;
  }

  /**
   * 獲取會話
   */
  getSession(sessionId: string): ChatSession | undefined {
    return this.sessions.get(sessionId);
  }

  /**
   * 獲取會話的對話記錄
   */
  getConversationHistory(sessionId: string, limit?: number): ChatMessage[] {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return [];
    }

    const messages = session.messages;
    if (limit && messages.length > limit) {
      return messages.slice(-limit);
    }

    return messages;
  }

  /**
   * 獲取會話的上下文摘要
   */
  getSessionContext(sessionId: string): string {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return "無效的會話";
    }

    const docInfo = session.documents
      .map((id) => {
        const doc = this.pdfManager.getDocument(id);
        return doc ? `📄 ${doc.fileName}` : `❌ 未找到文件 ${id}`;
      })
      .join(", ");

    return `
🗂️ 當前會話: ${session.id}
📚 載入的文件: ${docInfo || "無"}
💬 訊息數量: ${session.messages.length}
⏰ 最後活動: ${session.lastActivity.toLocaleString()}
    `.trim();
  }

  /**
   * 為會話添加 PDF 文件
   */
  addDocumentToSession(sessionId: string, documentId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return false;
    }

    if (!session.documents.includes(documentId)) {
      session.documents.push(documentId);
      session.lastActivity = new Date();
    }

    return true;
  }

  /**
   * 清理過期會話
   */
  cleanupOldSessions(maxAgeHours = 24): number {
    const cutoffTime = new Date();
    cutoffTime.setHours(cutoffTime.getHours() - maxAgeHours);

    let cleanedCount = 0;
    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.lastActivity < cutoffTime) {
        this.sessions.delete(sessionId);
        cleanedCount++;
      }
    }

    return cleanedCount;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  }
}
