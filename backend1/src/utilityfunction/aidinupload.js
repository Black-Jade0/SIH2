const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");

async function processMultipleDocuments(fileUris) {
    try {
        // Initialize Gemini API and FileManager
        const genAI = new GoogleGenerativeAI(process.env.API_KEY_GEMINI);
        const fileManager = new GoogleAIFileManager(process.env.API_KEY_GEMINI);
        
        // Initialize model
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            generationConfig: {
                maxOutputTokens: 4096,
                temperature: 0.4,
            }
        });

        // Process each file URI and create file parts
        const fileParts = await Promise.all(fileUris.map(async (uri) => {
            try {
                return {
                    fileData: {
                        mimeType: 'application/pdf',
                        uri: uri
                    }
                };
            } catch (error) {
                console.error(`Error processing file URI ${uri}:`, error);
                throw error;
            }
        }));

        // Your prompt for comparing documents
        const prompt = `
            Analyze and compare the following documents. 
            First document is the answers and the second document 
            is the questions evaluate the answers on the basis of 
            questions and give marks accordingly, assume the marks
            of questions by yourself
            Format the response with json object with marks as the key and it's value as its value.
        `;

        // Generate content with all documents
        const result = await model.generateContent([prompt, ...fileParts]);
        const responseText = result.response.text();

        // Parse the response (using the parsing function we created earlier)
        try {
            // Remove markdown code block if present
            const cleanedResponse = responseText
                .replace(/^```json\s*/, '')
                .replace(/```\s*$/, '')
                .trim();

            return JSON.parse(cleanedResponse);
        } catch (error) {
            console.error('Error parsing response:', error);
            throw error;
        }

    } catch (error) {
        console.error('Error in processMultipleDocuments:', error);
        throw error;
    }
}

function parseGeminiResponse(responseText) {
    try {
        // Remove markdown code block markers if present
        const cleanedResponse = responseText
            .replace(/^```json\s*/, '')  // Remove ```json at the start
            .replace(/```\s*$/, '')      // Remove ``` at the end
            .trim();

        // Parse the cleaned JSON
        const parsedResponse = JSON.parse(cleanedResponse);

        // Validate the structure
        if (
            Array.isArray(parsedResponse) && 
            parsedResponse.every(item => 
                item.hasOwnProperty('serial') && 
                item.hasOwnProperty('content')
            )
        ) {
            return parsedResponse;
        } else {
            throw new Error('Invalid response format');
        }
    } catch (error) {
        console.error('Parsing Error:', error);
        console.log('Original Response:', responseText);

        // Fallback parsing strategies
        try {
            // Try parsing without code block removal
            return JSON.parse(responseText);
        } catch (fallbackError) {
            // Last resort: return as single item array
            return [{
                serial: 1,
                content: responseText
            }];
        }
    }
}

module.exports = {
    parseGeminiResponse,
    processMultipleDocuments
  };