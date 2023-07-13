import { PDFDocument, PDFDict, PDFHexString, PDFString } from 'pdf-lib';
export declare const PDFExtractAttachments: (pdfDoc: PDFDocument) => {
    name: string;
    data: Uint8Array;
}[];
export declare const PDFExtractRawAttachments: (pdfDoc: PDFDocument) => {
    fileName: PDFHexString | PDFString;
    fileSpec: PDFDict;
}[];
