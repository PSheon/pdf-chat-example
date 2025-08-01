import fs from "fs";
import path from "path";
import { createHash } from "crypto";

export interface PDFDocument {
  id: string;
  fileName: string;
  filePath: string;
  size: number;
  hash: string;
  uploadedAt: Date;
  base64Data?: string;
}

export class PDFManager {
  private documents = new Map<string, PDFDocument>();
  private storageDir: string;

  constructor(storageDir = "./pdf-storage") {
    this.storageDir = storageDir;
    this.ensureStorageDir();
  }

  private ensureStorageDir() {
    if (!fs.existsSync(this.storageDir)) {
      fs.mkdirSync(this.storageDir, { recursive: true });
    }
  }

  /**
   * 載入 PDF 檔案並返回文件資訊
   */
  async loadPDF(filePath: string): Promise<PDFDocument> {
    try {
      const absolutePath = path.resolve(filePath);
      const fileName = path.basename(absolutePath);
      const stats = fs.statSync(absolutePath);
      const buffer = fs.readFileSync(absolutePath);

      // 生成檔案雜湊值作為唯一識別
      const hash = createHash("sha256").update(buffer).digest("hex");

      // 檢查是否已經載入過相同檔案
      const existingDoc = this.findDocumentByHash(hash);
      if (existingDoc) {
        console.log(`PDF 已存在: ${fileName}`);
        return existingDoc;
      }

      const document: PDFDocument = {
        id: hash.substring(0, 12), // 使用前12位作為ID
        fileName,
        filePath: absolutePath,
        size: stats.size,
        hash,
        uploadedAt: new Date(),
        base64Data: buffer.toString("base64"),
      };

      this.documents.set(document.id, document);
      console.log(`PDF 載入成功: ${fileName} (${document.id})`);

      return document;
    } catch (error) {
      throw new Error(`載入 PDF 失敗: ${error}`);
    }
  }

  /**
   * 根據雜湊值查找文件
   */
  private findDocumentByHash(hash: string): PDFDocument | undefined {
    for (const doc of this.documents.values()) {
      if (doc.hash === hash) {
        return doc;
      }
    }
    return undefined;
  }

  /**
   * 獲取文件資訊
   */
  getDocument(id: string): PDFDocument | undefined {
    return this.documents.get(id);
  }

  /**
   * 獲取所有載入的文件
   */
  getAllDocuments(): PDFDocument[] {
    return Array.from(this.documents.values());
  }

  /**
   * 移除文件
   */
  removeDocument(id: string): boolean {
    return this.documents.delete(id);
  }

  /**
   * 清除所有文件
   */
  clearAll(): void {
    this.documents.clear();
  }

  /**
   * 獲取文件的 base64 資料
   */
  getBase64Data(id: string): string | undefined {
    const doc = this.documents.get(id);
    return doc?.base64Data;
  }

  /**
   * 獲取載入的文件摘要
   */
  getSummary(): string {
    const docs = this.getAllDocuments();
    if (docs.length === 0) {
      return "沒有載入任何 PDF 文件";
    }

    return docs
      .map(
        (doc) =>
          `📄 ${doc.fileName} (${doc.id}) - ${(doc.size / 1024).toFixed(1)}KB`
      )
      .join("\n");
  }
}
