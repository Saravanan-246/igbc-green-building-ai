import fs from "fs/promises";
import { PDFParse } from "pdf-parse";

const extractPDFText = async (filePath) => {
  if (!filePath) {
    const error = new Error("PDF file path is required");
    error.statusCode = 400;
    throw error;
  }

  const buffer = await fs.readFile(filePath);
  const parser = new PDFParse({ data: buffer });

  try {
    const result = await parser.getText();

    return {
      text: result.text || "",
      pages: result.total || result.pages?.length || 0,
      metadata: {},
    };
  } finally {
    await parser.destroy();
  }
};

export { extractPDFText };
