const Excel = require('exceljs');
const workbook = new Excel.Workbook();

const getWorksheet = async(filePath, sheetNo) => {
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.worksheets[sheetNo];
    return worksheet;
}

module.exports = {
    getWorksheet
}
