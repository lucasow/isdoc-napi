"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const fs_1 = require("fs");
const mocha_1 = require("mocha");
const chai_1 = require("chai");
const createISDOCX_1 = __importDefault(require("../lib/createISDOCX"));
const jszip_1 = __importDefault(require("jszip"));
const test0 = (0, fs_1.readFileSync)(__dirname + '/test000.pdf'), test1 = (0, fs_1.readFileSync)(__dirname + '/test001.isdoc.pdf'), test2 = (0, fs_1.readFileSync)(__dirname + '/test002.isdoc.pdf'), invoice = (0, fs_1.readFileSync)(__dirname + '/invoice.isdoc'), template = {
    DocumentType: 'invoice',
    ID: 1,
    IssuingSystem: 'ΔO Delta Zero',
    IssueDate: new Date(),
    TaxPointDate: new Date(),
    VATApplicable: true,
    AccountingSupplierParty: {
        Party: {
            PartyIdentification: { ID: '12345678' },
            PartyName: { Name: 'Test s.r.o.' },
            PostalAddress: {
                StreetName: 'Dodavatelská',
                BuildingNumber: '1',
                CityName: 'Dodavatelov',
                PostalZone: '12345',
                Country: { IdentificationCode: 'CZ', Name: '' }
            },
            PartyTaxScheme: {
                CompanyID: 'CZ12345678',
                TaxScheme: 'VAT'
            },
            Contact: {
                Telephone: '222111000',
                ElectronicMail: 'dodavatel@posta.cz'
            }
        }
    },
    AccountingCustomerParty: {
        Party: {
            PartyIdentification: { ID: '12345678' },
            PartyName: { Name: 'Test s.r.o.' },
            PostalAddress: {
                StreetName: 'Dodavatelská',
                BuildingNumber: '1',
                CityName: 'Dodavatelov',
                PostalZone: '12345',
                Country: { IdentificationCode: 'CZ', Name: '' }
            },
            PartyTaxScheme: {
                CompanyID: 'CZ12345678',
                TaxScheme: 'VAT'
            },
            Contact: {
                Telephone: '222111000',
                ElectronicMail: 'dodavatel@posta.cz'
            }
        }
    },
    InvoiceLines: {
        InvoiceLine: [
            {
                ID: '10001',
                InvoicedQuantity: 1,
                LineExtensionAmount: 100,
                LineExtensionAmountTaxInclusive: 121,
                LineExtensionTaxAmount: 21,
                UnitPrice: 100,
                UnitPriceTaxInclusive: 121,
                ClassifiedTaxCategory: { Percent: 21, VATCalculationMethod: 0, VATApplicable: true },
                Item: { Description: 'Zboží 10001' }
            },
        ]
    },
    TaxTotal: {
        TaxSubTotal: {
            TaxableAmount: 100,
            TaxAmount: 21,
            TaxInclusiveAmount: 121,
            AlreadyClaimedTaxableAmount: 0,
            AlreadyClaimedTaxAmount: 0,
            AlreadyClaimedTaxInclusiveAmount: 0,
            DifferenceTaxableAmount: 100,
            DifferenceTaxAmount: 21,
            DifferenceTaxInclusiveAmount: 121,
            TaxCategory: {
                Percent: 21,
                VATApplicable: true,
            }
        },
        TaxAmount: 21
    },
    LegalMonetaryTotal: {
        TaxExclusiveAmount: 5500,
        TaxInclusiveAmount: 6655,
        AlreadyClaimedTaxExclusiveAmount: 0,
        AlreadyClaimedTaxInclusiveAmount: 0,
        DifferenceTaxExclusiveAmount: 5500,
        DifferenceTaxInclusiveAmount: 6655,
        PayableRoundingAmount: 0,
        PaidDepositsAmount: 0,
        PayableAmount: 6655
    },
    PaymentMeans: {
        Payment: {
            PaidAmount: 6655,
            PaymentMeansCode: 42,
            Details: {
                PaymentDueDate: new Date(),
                ID: 1234567890,
                BankCode: 1234,
                Name: 'BANKA',
                IBAN: '',
                BIC: '',
                VariableSymbol: 10111,
                ConstantSymbol: '',
                SpecificSymbol: ''
            }
        }
    }
};
describe('Extracting ISDOCs', () => {
    it('test000.pdf -> false', async () => {
        (0, chai_1.expect)(await (0, __1.hasISDOC)(test0)).to.be.false;
    });
    it('test001.isdoc.pdf -> true', async () => {
        (0, chai_1.expect)(await (0, __1.hasISDOC)(test1)).to.be.true;
        const isdoc = await (0, __1.extractISDOC)(test1);
        (0, chai_1.expect)(isdoc).to.be.instanceof(__1.Invoice);
        (0, chai_1.expect)(isdoc?.ID).to.be.eq('FV-1/2021');
        (0, chai_1.expect)(isdoc?.UUID).to.be.eq('AEC4791C-4BA1-451E-A1DC-2BF634B1C29D');
        (0, chai_1.expect)(isdoc?.['$_version']).to.be.eq('6.0.2');
    });
    it('test002.isdoc.pdf -> true', async () => {
        (0, chai_1.expect)(await (0, __1.hasISDOC)(test2)).to.be.true;
        const isdoc = await (0, __1.extractISDOC)(test2);
        (0, chai_1.expect)(isdoc).to.be.instanceof(__1.Invoice);
        (0, chai_1.expect)(isdoc?.ID).to.be.eq('FV-2/2021');
        (0, chai_1.expect)(isdoc?.UUID).to.be.eq('A34D00BF-FFB3-445B-BA1F-C5764B89409E');
        (0, chai_1.expect)(isdoc?.['$_version']).to.be.eq('6.0.2');
    });
});
describe('Attaching ISDOC', () => {
    it('test000.pdf -> test000.isdoc.pdf', async () => {
        const test0isdoc = await (0, __1.attachISDOC)(test0, template);
        (0, chai_1.expect)(test0isdoc).to.be.instanceof(Buffer);
        (0, fs_1.writeFileSync)(__dirname + '/test000.isdoc.pdf', test0isdoc);
    });
    it('test000.isdoc.pdf is valid', async () => {
        const test0i = (0, fs_1.readFileSync)(__dirname + '/test000.isdoc.pdf');
        (0, chai_1.expect)(await (0, __1.hasISDOC)(test0i)).to.be.true;
        const isdoc = await (0, __1.extractISDOC)(test0i);
        (0, chai_1.expect)(isdoc).to.be.instanceof(__1.Invoice);
        (0, chai_1.expect)(isdoc?.ID?.toString()).to.be.eq('1');
        (0, chai_1.expect)(isdoc?.UUID).to.be.match(/[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}/);
        (0, chai_1.expect)(isdoc?.['$_version']).to.be.eq('6.0.1');
    });
    it('test001.isdoc.pdf -> throws that it already has one', async () => {
        (0, chai_1.expect)(await (0, __1.attachISDOC)(test1, invoice).catch(e => e.message)).to.be.include('This PDF Already Has an ISDOC Attachment');
    });
});
describe('Creating ISDOCX archive', () => {
    it('test000.pdf + invoice.isdoc -> test000.isdox', async () => {
        const isdocx = await (0, createISDOCX_1.default)(test0, invoice);
        (0, chai_1.expect)(isdocx).to.be.instanceof(Buffer);
        (0, fs_1.writeFileSync)(__dirname + '/test000.isdocx', isdocx);
    });
    it('test001.isdoc.pdf + invoice.isdoc -> throws ', async () => {
        (0, chai_1.expect)(await (0, createISDOCX_1.default)(test1, invoice).catch(e => e.message)).to.be.include('This PDF Already Has an ISDOC Attachment');
    });
});
describe('Validating created ISDOCX archive', () => {
    let zip;
    (0, mocha_1.before)(async () => {
        zip = await new jszip_1.default().loadAsync((0, fs_1.readFileSync)(__dirname + '/test000.isdocx'));
    });
    it('test000.isdox is readable', async () => {
        (0, chai_1.expect)(zip.files).to.be.an('object');
        (0, chai_1.expect)(Object.keys(zip.files)).to.be.an('Array');
    });
    it('test000.isdox has 3 files', async () => {
        (0, chai_1.expect)(Object.keys(zip.files).length).to.be.eq(3);
    });
    it('test000.isdox has a .pdf', async () => {
        (0, chai_1.expect)(Object.keys(zip.files).find(r => r.match(/\.pdf$/i))).to.be.a('string');
    });
    it('test000.isdox has a .isdoc', async () => {
        (0, chai_1.expect)(Object.keys(zip.files).find(r => r.match(/\.isdoc$/i))).to.be.a('string');
    });
    it('test000.isdox has a valid .isdoc', async () => {
        const name = Object.keys(zip.files).find(r => r.match(/\.isdoc$/i)), file = await zip.file(name)?.async('nodebuffer'), isdoc = new __1.Invoice(file);
        (0, chai_1.expect)(isdoc?.['$_version']).to.be.eq('6.0.1');
    });
    it('test000.isdox has a manifest.xml', async () => {
        (0, chai_1.expect)(Object.keys(zip.files).find(r => r.toLowerCase() === 'manifest.xml')).to.be.a('string');
    });
});
// describe('Clean Up', () => {
//   it ('Clean Up', () => {
//     expect((() => {
//       rmSync(__dirname + '/test000.isdoc.pdf')
//       rmSync(__dirname + '/test000.isdocx')
//       return true
//     })()).not.to.throw
//   })
// })
