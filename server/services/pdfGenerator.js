const PDFDocument = require('pdfkit');

function generatePdf(title, content, res) {
    const doc = new PDFDocument();

    doc.pipe(res);

    // Title
    doc.fontSize(20).text(title || 'Doubt Solution', { align: 'center' });
    doc.moveDown();

    // Content
    // PDFKit doesn't support Markdown directly, so we'll do basic text dump.
    // For a real app, we'd parse markdown or use headings. 
    // Here we just write the text cleanly.

    doc.fontSize(12).text(content, {
        align: 'left',
        paragraphGap: 5
    });

    doc.end();
}

module.exports = { generatePdf };
