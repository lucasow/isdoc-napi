"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PDFExtractRawAttachments = exports.PDFExtractAttachments = void 0;
const pdf_lib_1 = require("pdf-lib");
const PDFExtractAttachments = (pdfDoc) => {
    const rawAttachments = (0, exports.PDFExtractRawAttachments)(pdfDoc);
    return rawAttachments.map(({ fileName, fileSpec }) => {
        const stream = fileSpec
            .lookup(pdf_lib_1.PDFName.of('EF'), pdf_lib_1.PDFDict)
            .lookup(pdf_lib_1.PDFName.of('F'), pdf_lib_1.PDFStream);
        return {
            name: fileName.decodeText(),
            data: (0, pdf_lib_1.decodePDFRawStream)(stream).decode(),
        };
    });
};
exports.PDFExtractAttachments = PDFExtractAttachments;
const PDFExtractRawAttachments = (pdfDoc) => {
    if (!pdfDoc.catalog.has(pdf_lib_1.PDFName.of('Names')))
        return [];
    const Names = pdfDoc.catalog.lookup(pdf_lib_1.PDFName.of('Names'), pdf_lib_1.PDFDict);
    if (!Names.has(pdf_lib_1.PDFName.of('EmbeddedFiles')))
        return [];
    let EmbeddedFiles = Names.lookup(pdf_lib_1.PDFName.of('EmbeddedFiles'), pdf_lib_1.PDFDict);
    if (!EmbeddedFiles.has(pdf_lib_1.PDFName.of('Names')) && EmbeddedFiles.has(pdf_lib_1.PDFName.of('Kids')))
        EmbeddedFiles = EmbeddedFiles.lookup(pdf_lib_1.PDFName.of('Kids'), pdf_lib_1.PDFArray).lookup(0);
    if (!EmbeddedFiles.has(pdf_lib_1.PDFName.of('Names')))
        return [];
    const EFNames = EmbeddedFiles.lookup(pdf_lib_1.PDFName.of('Names'), pdf_lib_1.PDFArray);
    const rawAttachments = [];
    for (let idx = 0, len = EFNames.size(); idx < len; idx += 2) {
        const fileName = EFNames.lookup(idx);
        const fileSpec = EFNames.lookup(idx + 1, pdf_lib_1.PDFDict);
        rawAttachments.push({ fileName, fileSpec });
    }
    return rawAttachments;
};
exports.PDFExtractRawAttachments = PDFExtractRawAttachments;
