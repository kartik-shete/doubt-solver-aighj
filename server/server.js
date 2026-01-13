require('dotenv').config();
const express = require('express');
const cors = require('cors');
const geminiService = require('./services/gemini');
const pdfService = require('./services/pdfGenerator');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('Doubt Solver AI API is running');
});

// Doubt Solving Endpoint
app.post('/api/solve', async (req, res) => {
    try {
        const { question, context } = req.body;
        if (!question) {
            return res.status(400).json({ error: 'Question is required' });
        }
        const answer = await geminiService.solveDoubt(question, context);
        res.json({ answer });
    } catch (error) {
        console.error('Error in /api/solve:', error);
        res.status(500).json({ error: 'Failed to solve doubt' });
    }
});

// PDF Generation Endpoint
app.post('/api/generate-pdf', async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!content) {
            return res.status(400).json({ error: 'Content is required for PDF' });
        }

        // stream the PDF directly to the response
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${title || 'solution'}.pdf"`);

        pdfService.generatePdf(title, content, res);
    } catch (error) {
        console.error('Error in /api/generate-pdf:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Failed to generate PDF' });
        }
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
