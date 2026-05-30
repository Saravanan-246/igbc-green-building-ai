import { getOpenAIClient, openaiModel } from "../../config/openai.js";

const parseJsonResponse = (content) => {
  try {
    return JSON.parse(content);
  } catch {
    return {
      summary: content,
      recommendations: [],
      validationResult: {
        rawResponse: content,
      },
    };
  }
};

const requestStructuredAnalysis = async (systemPrompt, userPrompt) => {
  const client = getOpenAIClient();
  const response = await client.responses.create({
    model: openaiModel,
    input: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: userPrompt,
      },
    ],
  });

  return parseJsonResponse(response.output_text || "{}");
};

const analyzeDocumentContent = async (documentContent, context = {}) =>
  requestStructuredAnalysis(
    "You analyze IGBC certification documents. Return strict JSON with summary, anomalies, confidenceScore, and recommendations.",
    JSON.stringify({
      task: "Analyze document content for IGBC certification relevance.",
      context,
      documentContent,
    })
  );

const generateRecommendations = async (projectContext) =>
  requestStructuredAnalysis(
    "You are an IGBC certification advisor. Return strict JSON with a recommendations array.",
    JSON.stringify({
      task: "Generate project improvement recommendations.",
      projectContext,
    })
  );

const validateIGBCCriteria = async (criteriaContext) =>
  requestStructuredAnalysis(
    "You validate IGBC criteria evidence. Return strict JSON with passed, failedCriteria, warnings, and confidenceScore.",
    JSON.stringify({
      task: "Validate IGBC criteria evidence.",
      criteriaContext,
    })
  );

export {
  analyzeDocumentContent,
  generateRecommendations,
  validateIGBCCriteria,
};
