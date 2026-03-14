"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatepdf = void 0;
const pdfkit_1 = __importDefault(require("pdfkit"));
const AppError_1 = __importDefault(require("../errorHalper.ts/AppError"));
const generatepdf = (invoiceData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return new Promise((resolve, reject) => {
            const doc = new pdfkit_1.default({ size: "A4", margin: 50 });
            const buffer = [];
            doc.on("data", (chunk) => buffer.push(chunk));
            doc.on("end", () => resolve(Buffer.concat(buffer)));
            doc.on("error", (err) => reject(err));
            // Header
            doc
                .fillColor("#2E86C1")
                .fontSize(26)
                .text(" Tourify Travel Agency", { align: "center" })
                .moveDown(0.2);
            doc
                .fontSize(12)
                .fillColor("black")
                .text("123 Wanderlust Street, Sylhet, Bangladesh", { align: "center" })
                .text("Email: support@tourify.com | Phone: +880 1234 567 890", { align: "center" })
                .moveDown(2);
            // Invoice Title
            doc
                .fontSize(20)
                .fillColor("#333")
                .text("Invoice", { align: "left" })
                .moveDown(0.5);
            // Invoice Info Section
            doc
                .fontSize(12)
                .text(`Transaction ID: ${invoiceData.transactionId}`)
                .text(`Booking Date: ${invoiceData.bookingDate.toDateString()}`)
                .text(`Customer Name: ${invoiceData.userName}`)
                .moveDown(1.5);
            // Tour Info Box
            const boxStartY = doc.y;
            doc
                .lineWidth(1)
                .rect(50, boxStartY, 500, 90)
                .strokeColor("#2E86C1")
                .stroke();
            doc
                .fontSize(14)
                .fillColor("#000")
                .text(`Tour Title: ${invoiceData.tourTitle}`, 60, boxStartY + 10)
                .text(`Guest Count: ${invoiceData.guestCount}`, 60, boxStartY + 35);
            doc.text(`Total Amount: $${invoiceData.totalAmount.toFixed(2)}`);
            doc.moveDown(3);
            // Thank You Section
            doc
                .fontSize(14)
                .fillColor("#28B463")
                .text("Thank you for booking with Tourify!", { align: "center" })
                .fillColor("black")
                .text("We hope you have a wonderful experience.", { align: "center" })
                .moveDown(2);
            // Footer
            doc
                .fontSize(10)
                .fillColor("gray")
                .text("This invoice is generated automatically and does not require a signature.", {
                align: "center",
            });
            doc.end();
        });
    }
    catch (error) {
        throw new AppError_1.default(401, `PDF creation error: ${error.message}`);
    }
});
exports.generatepdf = generatepdf;
