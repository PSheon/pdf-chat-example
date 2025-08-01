import fs from "fs";
import path from "path";

export const loadPdf = async (filePath: string) => {
  try {
    const pdfBuffer = fs.readFileSync(filePath);
    return {
      success: true,
      data: pdfBuffer.toString("base64"),
      size: pdfBuffer.length,
      fileName: path.basename(filePath),
    };
  } catch (error) {
    return {
      success: false,
      error: `無法載入 PDF 檔案: ${error}`,
    };
  }
};

export const searchPdfContent = async (query: string, context?: string) => {
  return {
    searchQuery: query,
    context: context || "無額外上下文",
    timestamp: new Date().toISOString(),
  };
};
