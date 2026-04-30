const fs = require('fs');
const PDFParser = require("pdf2json");

function parsePDF(filePath, outPath) {
    return new Promise((resolve, reject) => {
        const pdfParser = new PDFParser(this, 1);
        pdfParser.on("pdfParser_dataError", errData => reject(errData.parserError));
        pdfParser.on("pdfParser_dataReady", pdfData => {
            fs.writeFileSync(outPath, pdfParser.getRawTextContent());
            resolve();
        });
        pdfParser.loadPDF(filePath);
    });
}

async function extract() {
    await parsePDF('300사업계획서_ver2.pdf', '300사업계획서_ver2.txt');
    await parsePDF('사업계획서 양식.pdf', '사업계획서 양식.txt');
}

extract().catch(console.error);
