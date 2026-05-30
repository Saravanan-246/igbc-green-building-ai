import XLSX from "xlsx";

const extractExcelData = async (filePath) => {
  if (!filePath) {
    const error = new Error("Excel file path is required");
    error.statusCode = 400;
    throw error;
  }

  const workbook = XLSX.readFile(filePath, {
    cellDates: true,
  });

  const sheets = workbook.SheetNames.map((sheetName) => {
    const worksheet = workbook.Sheets[sheetName];

    return {
      sheetName,
      rows: XLSX.utils.sheet_to_json(worksheet, {
        defval: null,
        raw: false,
      }),
    };
  });

  return {
    sheetCount: workbook.SheetNames.length,
    sheetNames: workbook.SheetNames,
    sheets,
  };
};

export { extractExcelData };
