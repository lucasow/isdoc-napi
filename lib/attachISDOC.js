"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const isdoc_1 = __importDefault(require("@deltazero/isdoc"));
const pdf_lib_1 = require("pdf-lib");
const extractISDOC_1 = require("./extractISDOC");
const promises_1 = require("fs/promises");
const child_process_1 = require("child_process");
async function attachISDOC(pdf, isdoc) {
    if (await (0, extractISDOC_1.hasISDOC)(pdf))
        throw new Error('attachISDOC: This PDF Already Has an ISDOC Attachment');
    if (!(isdoc instanceof isdoc_1.default))
        isdoc = new isdoc_1.default(isdoc);
    if (pdf instanceof pdf_lib_1.PDFDocument)
        pdf = Buffer.from(await pdf.save());
    const bin = __dirname + '/../../isdoc-pdf-bash/isdoc-pdf';
  await (0, promises_1.stat)(bin)
        .catch(() => { throw new Error('attachISDOC: Cannot find [isdoc-pdf] executable'); });
    const [[inpdf], [inisdoc], [outpdf]] = await Promise.all([execute('mktemp'), execute('mktemp'), execute('mktemp')]);
    await Promise.all([
        (0, promises_1.writeFile)(inpdf, pdf),
        (0, promises_1.writeFile)(inisdoc, isdoc.toXML())
    ]);
    await execute(`${bin} ${inpdf} ${inisdoc} ${outpdf}`);
    const result = await (0, promises_1.readFile)(outpdf);
    // clean up
    await Promise.all([(0, promises_1.unlink)(inpdf), (0, promises_1.unlink)(inisdoc), (0, promises_1.unlink)(outpdf)]);
    return result;
}
exports.default = attachISDOC;
const execute = async (cmd, options = {}) => new Promise((resolve, reject) => (0, child_process_1.exec)(cmd, options, (e, stdout, stderr) => {
    if (e)
        return reject(e);
    resolve([stdout.toString().trim(), stderr?.toString().trim()]);
}));
