const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");

async function processMultipleDocuments(fileUris) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.API_KEY_GEMINI);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        maxOutputTokens: 4096,
        temperature: 0.4,
      },
    });

    const fileParts = await Promise.all(
      fileUris.map(async (uri, index) => {
        try {
          const fs = require("fs").promises;
          const fileBuffer = await fs.readFile(uri);
          const base64Data = fileBuffer.toString("base64");

          return {
            inlineData: {
              mimeType: "application/pdf",
              data: base64Data,
            },
          };
        } catch (error) {
          console.error(`Error processing file ${index + 1} (${uri}):`, error);
          throw error;
        }
      })
    );

    // Modified prompt to be more explicit about JSON format
    // For a more detailed response structure
    const prompt = `
Analyze and compare the following documents. 
First document is the answers and the second document 
is the questions. Evaluate the answers based on the questions 
and assign marks accordingly.

Respond with a JSON object in this exact format:
{
    "TotalMarks":number
    "ObtainedMarks": number,
    "evaluation": {
        "totalQuestions": number,
        "questionsAnswered": number,
        "detailedMarks": {
            "question1": {
            "awarded":"full/parial/none",
            "right answer":string
            "obtained answer":string
            },
            "question2": {
            "awarded":"full/parial/none",
            "right answer":string
            "obtained answer":string
            }
            // ... etc
        }
    }
}
`;
    const parts = [{ text: prompt }, ...fileParts];

    const result = await model.generateContent(parts);
    const responseText = result.response.text();

    try {
      // More robust response cleaning
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON object found in response");
      }

      const jsonStr = jsonMatch[0];
      console.log("Extracted JSON string:", jsonStr); // Debug log

      return JSON.parse(jsonStr);
    } catch (error) {
      console.error("Raw response:", responseText); // Debug log
      console.error("Error parsing response:", error);

      // Fallback parsing attempt
      try {
        // Try to extract just the number
        const marksMatch = responseText.match(/\d+/);
        if (marksMatch) {
          return { marks: parseInt(marksMatch[0]) };
        }
      } catch (fallbackError) {
        console.error("Fallback parsing also failed:", fallbackError);
      }

      throw error;
    }
  } catch (error) {
    console.error("Error in processMultipleDocuments:", error);
    throw error;
  }
}
function parseGeminiResponse(responseText) {
  try {
    // Remove markdown code block markers if present
    const cleanedResponse = responseText
      .replace(/^```json\s*/, "") // Remove ```json at the start
      .replace(/```\s*$/, "") // Remove ``` at the end
      .trim();

    // Parse the cleaned JSON
    const parsedResponse = JSON.parse(cleanedResponse);

    // Validate the structure
    if (
      Array.isArray(parsedResponse) &&
      parsedResponse.every(
        (item) =>
          item.hasOwnProperty("serial") && item.hasOwnProperty("content")
      )
    ) {
      return parsedResponse;
    } else {
      throw new Error("Invalid response format");
    }
  } catch (error) {
    console.error("Parsing Error:", error);
    console.log("Original Response:", responseText);

    // Fallback parsing strategies
    try {
      // Try parsing without code block removal
      return JSON.parse(responseText);
    } catch (fallbackError) {
      // Last resort: return as single item array
      return [
        {
          serial: 1,
          content: responseText,
        },
      ];
    }
  }
}

module.exports = {
  parseGeminiResponse,
  processMultipleDocuments,
};
