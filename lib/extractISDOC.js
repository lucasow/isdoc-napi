"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasISDOC = void 0;
const PDFDocument_1 = __importDefault(require("pdf-lib/cjs/api/PDFDocument"));
const PDFAttachments_1 = require("./PDFAttachments");
const isdoc_1 = __importDefault(require("@deltazero/isdoc"));
async function extractISDOC(pdf) {
    const document = !(pdf instanceof PDFDocument_1.default)
        ? await PDFDocument_1.default.load(pdf)
        : pdf;
    const isdoc = (0, PDFAttachments_1.PDFExtractAttachments)(document)
        .find(r => r.name.match(/isdoc$/));
    if (!isdoc)
        return null;
    return new isdoc_1.default(Buffer.from(isdoc.data));
}
exports.default = extractISDOC;
const hasISDOC = async (pdf) => {
    const document = !(pdf instanceof PDFDocument_1.default)
        ? await PDFDocument_1.default.load(pdf)
        : pdf;
    return !!(0, PDFAttachments_1.PDFExtractAttachments)(document).find(r => r.name.match(/isdoc$/));
};
exports.hasISDOC = hasISDOC;
