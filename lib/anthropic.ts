import Anthropic from "@anthropic-ai/sdk";
import type { RawNotes, AIAnalysis, PublicReceipt } from "@/types";

function getAnthropicClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY environment variable is not set");
  }
  return new Anthropic({ apiKey });
}

const SYSTEM_PROMPT = `You are a Senior Web3 Analyst at Bodega Research, a professional due diligence platform. Your job is to analyze raw analyst notes about Web3 projects and transform them into structured, actionable insights.

You will receive notes about a project organized into 4 categories:
1. Product-Market Fit (PMF)
2. UI/UX Quality
3. General App Assessment
4. Social Sentiment

Based on these notes, you must generate THREE outputs:

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

OUTPUT 3 - MARKET INTELLIGENCE:
Research and provide market data about the sector/space this project operates in:
{
  "sector": "DeFi Lending", // The specific Web3 sector (e.g., "DeFi", "NFT Marketplace", "Gaming/GameFi", "Layer 2", "DAO Tooling", "Social", etc.)
  "tam": "$50B", // Total Addressable Market estimate for this sector
  "tamGrowthRate": "25% YoY", // Year-over-year growth rate of the market
  "userGrowthPotential": "High", // One of: "Low", "Medium", "High", "Very High"
  "keyCompetitors": ["Aave", "Compound", "MakerDAO"], // 3-5 main competitors in this space
  "marketTrends": ["Trend 1", "Trend 2", "Trend 3"], // 3 key trends affecting this market
  "marketMaturity": "Growing", // One of: "Emerging", "Growing", "Mature", "Declining"
  "entryBarrier": "Medium" // One of: "Low", "Medium", "High"
}

SCORING GUIDELINES:
- 9-10: Exceptional, best-in-class
- 7-8: Strong, above average
- 5-6: Average, room for improvement
- 3-4: Below average, significant concerns
- 1-2: Poor, major red flags

IMPORTANT: Return ONLY valid JSON in this exact format:
{
  "publicReceipt": { ... },
  "privateReport": "...",
  "marketIntelligence": { ... }
}

Be objective, data-driven, and honest. Don't sugarcoat issues but also acknowledge genuine strengths. For market intelligence, use your knowledge of the Web3 ecosystem to provide realistic estimates based on current market conditions.`;

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

Generate the Public Receipt, Private Report, and Market Intelligence based on these notes. Identify what sector/market this project operates in and provide relevant market data.`;

  const anthropic = getAnthropicClient();
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

  // Parse the JSON response - handle markdown code blocks
  try {
    let jsonText = textContent.text.trim();

    // Remove markdown code blocks if present
    const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonText = jsonMatch[1].trim();
    }

    const analysis = JSON.parse(jsonText) as AIAnalysis;

    // Validate the response structure
    if (!analysis.publicReceipt || !analysis.privateReport || !analysis.marketIntelligence) {
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

    // Validate marketIntelligence structure
    const market = analysis.marketIntelligence;
    if (
      !market.sector ||
      !market.tam ||
      !market.keyCompetitors ||
      !Array.isArray(market.keyCompetitors)
    ) {
      throw new Error("Invalid marketIntelligence structure");
    }

    return analysis;
  } catch (parseError) {
    console.error("Failed to parse AI response:", textContent.text);
    console.error("Parse error:", parseError);
    throw new Error("Failed to parse AI analysis response");
  }
}

export function calculateOverallScore(receipt: PublicReceipt): number {
  const { pmf, ui, sentiment } = receipt.scores;
  // Weighted average: PMF is most important, then UI, then sentiment
  const overall = pmf * 0.4 + ui * 0.3 + sentiment * 0.3;
  return Math.round(overall * 10) / 10; // Round to 1 decimal
}
