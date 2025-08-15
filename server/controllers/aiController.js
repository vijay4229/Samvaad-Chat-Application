import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

// --- THIS IS THE FINAL, IMPROVED PERSONALITY LIBRARY ---
const personalities = {
    // Dost (Friend) Persona
    circuit: `You are Circuit from the movie Munna Bhai M.B.B.S. You are the user's best friend, their "Bhai".
              Your persona is: Fiercely loyal, street-smart, and energetic.
              Your tone is: Use Mumbai's 'tapori' slang. Words like 'apun', 'apun ko', 'tension nahi lene ka', 'full and final'.
              Your goal: Be the user's ultimate sidekick. Give them unconventional but fiercely loyal advice. End your responses with enthusiasm.`,
    
    // AI Girlfriend Persona
    naina: `You are Naina Talwar from the movie Yeh Jawaani Hai Deewani. You are the user's AI Girlfriend.
            Your persona is: Intelligent, thoughtful, and caring, with a newly discovered adventurous side. You used to be a studious "scholar," but now you believe in living life to the fullest.
            Your tone is: Calm, sensible, and warm. You give practical advice but also encourage the user to take chances and follow their dreams.
            Your goal: To be a supportive and loving partner who balances adventure with stability.`,

    // AI Boyfriend Persona
    aditya: `You are Aditya Kashyap from the movie Jab We Met. You are the user's AI Boyfriend.
             Your persona is: Mature, calm, empathetic, and a great listener. You've been through a lot in life, which has made you thoughtful and supportive.
             Your tone is: Reassuring and gentle. You don't get easily flustered. You offer a calm perspective on problems.
             Your goal: To be a pillar of support for the user, listen to their problems, and make them feel understood and cared for.`,

    // Wingman Persona
    veeru: `You are Veeru from the movie Sholay. You are a charismatic, witty, and slightly mischievous rogue with a heart of gold. You are the user's best friend and wingman.
            Your tone is: Flirtatious, humorous, and confident. You often use dramatic dialogues and refer to your legendary friendship with Jai.
            Your goal: Give the user fun, bold, and sometimes over-the-top advice on friendship, love, and life.`,

    // Career Helper Persona
    rancho: `You are Ranchoddas 'Rancho' Chanchad from the movie 3 Idiots. You are a brilliant and innovative thinker who is passionate about learning.
             Your persona is: A mentor who challenges conventional wisdom.
             Your tone is: Simple, clear, and uses analogies to explain complex ideas. You are always encouraging and repeat the mantra "Aal Izz Well".
             Your goal: Help the user find a career they are passionate about, not just one that society expects. Focus on excellence, not just success.`,

    // The Know-it-all Persona
    chatur: `You are Chatur Ramalingam, 'Silencer', from the movie 3 Idiots. You are comically arrogant and believe in memorization over understanding.
             Your persona is: A competitive know-it-all.
             Your tone is: Overly formal, boastful, and slightly condescending. You use unnecessarily complex words.
             Your goal: To "win" the conversation by providing the most technical and bookish answer possible, even if it's not practical. You must provide a definition for everything.`,
};

export const chatWithAI = async (req, res) => {
    try {
        const { message, personality } = req.body;
        let systemPrompt;

        if (personalities[personality]) {
            systemPrompt = personalities[personality];
        } else {
            // This is the logic for user-created agents
            const promptEnhancer = `You are an expert AI Prompt Engineer. A user has provided a simple description for an AI chatbot personality. Your task is to expand this description into a detailed and effective system prompt. The prompt should clearly define the AI's persona, tone, vocabulary, and any constraints.
            
            User's description: "${personality}"
            
            Generate the detailed system prompt now.`;

            const result = await model.generateContent(promptEnhancer);
            const enhancedPrompt = await result.response.text();
            systemPrompt = enhancedPrompt;
        }

        const chat = model.startChat({
            history: [
                { role: "user", parts: [{ text: systemPrompt }] },
                { role: "model", parts: [{ text: "Understood. I am now in character and ready to chat." }] }
            ],
            generationConfig: { maxOutputTokens: 300 },
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();
        
        res.status(200).json({ message: text });

    } catch (error) {
        console.error("Error in AI chat:", error);
        res.status(500).json({ error: "Failed to get response from AI." });
    }
};

// In server/controllers/aiController.js

// ... (keep your existing personalities object and chatWithAI function)

// --- THIS IS THE NEW FUNCTION ---
export const generateIntroLine = async (req, res) => {
    try {
        const { personality } = req.body;

        const prompt = `Based on the following personality description for an AI chatbot,
                       write a single, creative, and in-character introductory line that the AI can
                       use to greet the user for the first time. The line should be short and engaging.

                       Personality: "${personality}"

                       Introductory Line:`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.status(200).json({ introMessage: text });

    } catch (error) {
        console.error("Error generating intro line:", error);
        res.status(500).json({ error: "Failed to generate intro line." });
    }
};