/// <reference types="node" />
import PDFDocument from 'pdf-lib/cjs/api/PDFDocument';
import Invoice, { InvoiceType } from 'isdoc';
export default function attachISDOC(pdf: Buffer | PDFDocument, isdoc: string | Buffer | Invoice | InvoiceType, validate?: boolean): Promise<Buffer>;
