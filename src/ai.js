const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. You don't need to use every ingredient they mention in your recipe. The recipe can include additional ingredients they didn't mention, but try not to include too many extra ingredients. Format your response in markdown.
`;

const GOOGLE_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function getRecipeFromGemini(ingredientsArr) {
  const ingredientsString = ingredientsArr.join(", ");
  const userPrompt = `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: userPrompt }],
            },
          ],
          systemInstruction: {
            parts: [{ text: SYSTEM_PROMPT }],
          },
        }),
      }
    );

    const data = await response.json();
    console.log("Gemini API response:", data);

    if (!response.ok) {
      throw new Error(
        data.error
          ? data.error.message
          : "Error generating content with Gemini API"
      );
    }

    // Check if candidate content is available and combine all parts
    if (
      data.candidates &&
      data.candidates.length > 0 &&
      data.candidates[0].content &&
      data.candidates[0].content.parts
    ) {
      const fullText = data.candidates[0].content.parts
        .map((part) => part.text)
        .join("");
      return fullText || "No recipe text was generated. Please try again.";
    } else {
      console.error("No output received from Gemini API:", data);
      return "No recipe was generated. Please try again.";
    }
  } catch (err) {
    console.error("Gemini API error:", err.message);
    return "An error occurred while fetching the recipe. Please try again later.";
  }
}
