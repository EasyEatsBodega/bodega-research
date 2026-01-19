import Anthropic from "@anthropic-ai/sdk";
import type { RawNotes, AIAnalysis, PublicReceipt } from "@/types";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are a Senior Web3 Analyst at Bodega Research, a professional due diligence platform. Your job is to analyze raw analyst notes about Web3 projects and transform them into structured, actionable insights.

You will receive notes about a project organized into 4 categories:
1. Product-Market Fit (PMF)
2. UI/UX Quality
3. General App Assessment
4. Social Sentiment

Based on these notes, you must generate TWO outputs:

OUTPUT 1 - PUBLIC RECEIPT (for social sharing):
A JSON object with the following structure:
{
  "theAlpha": ["point 1", "point 2", "point 3"], // Exactly 3 bullet points highlighting the best aspects
  "theFriction": ["point 1", "point 2", "point 3"], // Exactly 3 bullet points highlighting concerns or red flags
  "recommendations": ["rec 1", "rec 2", "rec 3"], // Exactly 3 actionable recommendations
  "scores": {
    "pmf": 7.5, // Product-Market Fit score from 1-10
    "ui": 8.0, // UI/UX score from 1-10
    "sentiment": 6.5, // Social sentiment score from 1-10
    "overall": 7.3 // Overall score (weighted average)
  }
}

OUTPUT 2 - PRIVATE ANALYST REPORT:
A professional 500-word consulting document that provides a deep-dive analysis. This should be written in a professional tone suitable for institutional clients and include:
- Executive summary
- Detailed analysis of each category
- Risk assessment
- Investment considerations
- Recommended next steps

SCORING GUIDELINES:
- 9-10: Exceptional, best-in-class
- 7-8: Strong, above average
- 5-6: Average, room for improvement
- 3-4: Below average, significant concerns
- 1-2: Poor, major red flags

IMPORTANT: Return ONLY valid JSON in this exact format:
{
  "publicReceipt": { ... },
  "privateReport": "..."
}

Be objective, data-driven, and honest. Don't sugarcoat issues but also acknowledge genuine strengths.`;

export async function generateAnalysis(
  projectName: string,
  rawNotes: RawNotes
): Promise<AIAnalysis> {
  const userPrompt = `Analyze this Web3 project: ${projectName}

AISLE 1 - PRODUCT-MARKET FIT:
${rawNotes.aisle1_pmf}

AISLE 2 - UI/UX QUALITY:
${rawNotes.aisle2_uiux}

AISLE 3 - GENERAL APP ASSESSMENT:
${rawNotes.aisle3_general}

AISLE 4 - SOCIAL SENTIMENT:
${rawNotes.aisle4_sentiment}

Generate the Public Receipt and Private Report based on these notes.`;

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: userPrompt,
      },
    ],
    system: SYSTEM_PROMPT,
  });

  // Extract the text content from the response
  const textContent = message.content.find((block) => block.type === "text");
  if (!textContent || textContent.type !== "text") {
    throw new Error("No text content in response");
  }

  // Parse the JSON response
  try {
    const analysis = JSON.parse(textContent.text) as AIAnalysis;

    // Validate the response structure
    if (!analysis.publicReceipt || !analysis.privateReport) {
      throw new Error("Invalid response structure");
    }

    // Validate publicReceipt structure
    const receipt = analysis.publicReceipt;
    if (
      !Array.isArray(receipt.theAlpha) ||
      !Array.isArray(receipt.theFriction) ||
      !Array.isArray(receipt.recommendations) ||
      !receipt.scores
    ) {
      throw new Error("Invalid publicReceipt structure");
    }

    return analysis;
  } catch {
    console.error("Failed to parse AI response:", textContent.text);
    throw new Error("Failed to parse AI analysis response");
  }
}

export function calculateOverallScore(receipt: PublicReceipt): number {
  const { pmf, ui, sentiment } = receipt.scores;
  // Weighted average: PMF is most important, then UI, then sentiment
  const overall = pmf * 0.4 + ui * 0.3 + sentiment * 0.3;
  return Math.round(overall * 10) / 10; // Round to 1 decimal
}
