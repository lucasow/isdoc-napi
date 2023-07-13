/// <reference types="node" />
import PDFDocument from 'pdf-lib/cjs/api/PDFDocument';
import Invoice from 'isdoc';
export default function extractISDOC(pdf: Buffer | PDFDocument): Promise<Invoice | null>;
export declare const hasISDOC: (pdf: Buffer | PDFDocument) => Promise<boolean>;
