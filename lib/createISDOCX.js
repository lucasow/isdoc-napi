"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createManifest = void 0;
const isdoc_1 = __importDefault(require("@deltazero/isdoc"));
const jszip_1 = __importDefault(require("jszip"));
const extractISDOC_1 = require("./extractISDOC");
async function createISDOCX(pdf, isdoc, name) {
    // noinspection SuspiciousTypeOfGuard
    if (!(pdf instanceof Buffer))
        throw new Error('createISDOCX: PDF Is Not an Instance of Buffer');
    if (await (0, extractISDOC_1.hasISDOC)(pdf))
        throw new Error('createISDOCX: This PDF Already Has an ISDOC Attachment');
    if (!(isdoc instanceof isdoc_1.default))
        isdoc = new isdoc_1.default(isdoc);
    name ?? (name = isdoc.ID?.replace(/[^\w.-]/gi, '_'));
    if (!name)
        throw new Error('createISDOCX: File Name Is Not Set');
    const zip = new jszip_1.default();
    zip.file(name + '.pdf', pdf);
    zip.file(name + '.isdoc', isdoc.toXML());
    zip.file('manifest.xml', (0, exports.createManifest)(name));
    return zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
}
exports.default = createISDOCX;
const createManifest = (name) => `<?xml version="1.0"?>
<manifest xmlns="http://isdoc.cz/namespace/2013/manifest">
  <maindocument filename="${name}.isdoc"/>
</manifest>
`;
exports.createManifest = createManifest;
