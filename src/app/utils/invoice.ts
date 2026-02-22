import PDFDocument from "pdfkit";
import AppError from "../errorHalper.ts/AppError";

export interface IInvoiceData {
    transactionId: string;
    bookingDate: Date;
    userName: string;
    tourTitle: string;
    guestCount: number;
    totalAmount: number;
}

export const generatepdf = async (invoiceData: IInvoiceData): Promise<Buffer> => {
    try {
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({ size: "A4", margin: 50 });
            const buffer: Uint8Array[] = [];

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
                .text(`Guest Count: ${invoiceData.guestCount}`, 60, boxStartY + 35)
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
    } catch (error: any) {
        throw new AppError(401, `PDF creation error: ${error.message}`);
    }
};