const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-pro" });

async function solveDoubt(question, context = "") {
    try {
        const prompt = `
        You are an expert engineering tutor for B.Tech students. 
        Your goal is to provide clear, detailed, and technically accurate answers to student doubts.
        
        Context (if any): ${context}
        
        Question: ${question}
        
        Please provide a structured response with:
        1. Brief Introduction/Definition
        2. Detailed Explanation (use points, step-by-step logic)
        3. Examples or Equations if applicable
        4. Conclusion or Summary
        
        Format the output in clean Markdown.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        return text;
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw new Error("Failed to get response from Gemini AI");
    }
}

module.exports = { solveDoubt };
