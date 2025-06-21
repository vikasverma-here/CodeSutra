// // utils/gemini.js (optional utility file for Gemini AI logic)
// const  { GoogleGenerativeAI } = require("@google/generative-ai") ;
// const { config } = require("./src/config/config.js");

// const genAI = new GoogleGenerativeAI(config.GOOGLE_API);

// export async function getChatResponse(userMessage, history = []) {
//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
//     const chat = model.startChat({
//       history: history.map((msg) => ({
//         role: msg.role,
//         parts: [{ text: msg.text }],
//       })),
//       generationConfig: {
//         maxOutputTokens: 500,
//         temperature: 0.9,
//       },
//     });

//     const result = await chat.sendMessage(userMessage);
//     const response = await result.response;
//     return response.text();
//   } catch (error) {
//     console.error("Gemini AI Error:", error);
//     throw new Error("Failed to generate AI response");
//   }
// }


const { config } = require("../config/config")
const { GoogleGenerativeAI } = require("@google/generative-ai");
console.log(config)
const ai = new GoogleGenerativeAI(config.GOOGLE_API);

async function main(message) {
  const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(message);
  const response = await result.response;
  const text = await response.text();
  console.log("AI Response:", text); // Log the AI response for debugging
  return text;  // ✅ return the actual text
}

module.exports = { main };

