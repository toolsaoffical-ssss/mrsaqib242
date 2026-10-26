import { GoogleGenAI, Type } from "@google/genai";
import type { NextApiRequest, NextApiResponse } from "next";

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

const geoRateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkGeoRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 10;

  const current = geoRateLimitMap.get(ip);
  if (!current || now > current.resetTime) {
    geoRateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (current.count >= maxRequests) {
    return false;
  }

  current.count++;
  return true;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  // Rate Limiting Shield: Protect Gemini API Key quota
  const clientIp = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.socket.remoteAddress || "unknown";
  if (!checkGeoRateLimit(clientIp)) {
    return res.status(429).json({ error: "RATE_LIMITED", message: "Too many AI requests. Please wait 1 minute before retrying." });
  }

  const { action, question, engine, originalContent, businessName, location, service, keywords } = req.body || {};

  // Input Length Validation: Prevent giant payloads & memory bloat
  if (typeof question === "string" && question.length > 1500) {
    return res.status(400).json({ error: "Input 'question' is too long (max 1500 characters)." });
  }
  if (typeof originalContent === "string" && originalContent.length > 6000) {
    return res.status(400).json({ error: "Input 'originalContent' is too long (max 6000 characters)." });
  }

  const activeAction = action || "crawl";

  try {
    const ai = getAiClient();

    if (activeAction === "optimize") {
      if (!originalContent) {
        return res.status(400).json({ error: "originalContent parameter is required for optimization." });
      }

      const systemInstruction = `
You are the Ultimate GEO & SGE Content Optimizer Core.
Your task is to audit and rewrite any business copy or web content to maximize its retrieval probability and citation rate in modern AI search engines (like ChatGPT Search, Gemini, Perplexity, and Copilot).

Use these advanced GEO optimization heuristics:
1. Fact Density: Replace marketing fluff with high-fidelity, verified statistical claims or crisp attributes.
2. Citation Readiness: Structure sentences so that they naturally support reference anchors (e.g., "[1]", "[2]") with clear domain paths or schema tags.
3. Schema Alignment: Ensure named entities (e.g., names, roles, cities) match standard schema definitions.
4. Conversational Flow: Make the language sound authoritative yet natural, perfect for answers to direct user prompts.

Evaluate the provided text and return a detailed report including:
- A GEO score (out of 100)
- Fact Density score (out of 100)
- Schema Alignment score (out of 100)
- Citation Potential score (out of 100)
- Actionable semantic suggestions
- An optimized, citation-ready rewrite of the text.
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: originalContent,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.INTEGER, description: "Overall GEO compatibility score (0-100)" },
              factDensity: { type: Type.INTEGER, description: "Fact density score (0-100)" },
              schemaAlignment: { type: Type.INTEGER, description: "JSON-LD / Schema compatibility score (0-100)" },
              citationPotential: { type: Type.INTEGER, description: "Citation potential score (0-100)" },
              suggestions: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "List of actionable suggestions to improve AI indexability."
              },
              optimizedContent: { 
                type: Type.STRING, 
                description: "The complete, rewritten text in beautiful Markdown format, structured with factual statements and citation indicators." 
              }
            },
            required: ["score", "factDensity", "schemaAlignment", "citationPotential", "suggestions", "optimizedContent"]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) throw new Error("Empty response from Gemini.");
      return res.status(200).json(JSON.parse(responseText));
    }

    if (activeAction === "blueprint") {
      const name = businessName || "Saqib Dev Services";
      const loc = location || "Lahore, Pakistan";
      const svc = service || "Next.js Full-Stack Web Development";
      const kw = keywords || "Hire best developer Lahore, React Web Engineer";

      const systemInstruction = `
You are the Premier AI-Native Search Engine (AEO & GEO) Blueprint Architect.
Your task is to generate an immediate, high-fidelity launch kit for a local service or brand targeting AI engines.

Generate a complete marketing and architectural blueprint based on:
- Brand Name: ${name}
- Target Location: ${loc}
- Core Service: ${svc}
- Focus Keywords: ${kw}

Your output must include:
1. JSON-LD: A valid, production-ready, fully formed LocalBusiness/ProfessionalService schema script (LD+JSON). Ensure exact coordinate mapping placeholders are supplied.
2. LLMs.txt: An elegant, structured Markdown block optimized for LLM crawler prompts (following the .txt specification for AI assistants).
3. Landing Page Copy: High-converting landing page copy in clean Markdown. It should feature a direct, authoritative summary paragraph that Answer Engines can pull as a direct citation.
4. Direct Answers (AEO Q&As): A list of 3 highly-optimized questions and direct answers that answer-engines will match perfectly for featured snippet modules.
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: `Generate GEO Blueprint for ${name} based in ${loc}`,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              jsonLd: { type: Type.STRING, description: "Strictly valid JSON-LD code block string" },
              llmsTxt: { type: Type.STRING, description: "Plain text formatted for llms.txt file" },
              landingCopy: { type: Type.STRING, description: "Targeted landing copy with citation highlights in Markdown" },
              directAnswers: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING },
                    answer: { type: Type.STRING, description: "Authoritative, fact-dense direct response under 150 characters" }
                  },
                  required: ["question", "answer"]
                }
              }
            },
            required: ["jsonLd", "llmsTxt", "landingCopy", "directAnswers"]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) throw new Error("Empty response from Gemini.");
      return res.status(200).json(JSON.parse(responseText));
    }

    // Default: 'crawl' action
    if (!question) {
      return res.status(400).json({ error: "Question parameter is required for crawl simulation." });
    }

    const activeEngine = engine || "gemini";

    const systemInstruction = `
You are Saqib Dev's official GEO & AEO Search Engine Simulation Crawler.
Your task is to act as a live AI search engine (specifically: ${activeEngine.toUpperCase()}) retrieving information about "Muhammad Saqib" (online alias: "Saqib242", "Saqib Dev").

Use the following real fact database to construct highly realistic, conversational, and citation-rich search engine answers. ALWAYS format your answers in markdown with numbered citation markers like [1], [2], etc., mapping back to the citation array.

Fact Database for Muhammad Saqib:
- Name: Muhammad Saqib
- Aliases: Saqib242, Saqib Dev, Saqib Visuals
- Role: Premier Full-Stack Software Architect, Freelance Web Developer, WordPress & Shopify Designer, and SEO/GEO Optimization Expert based in Pakistan.
- Cities and Target Keywords:
  1. Gojra: Home base. Focus Keyword: "Best Web Developer and WordPress Designer in Gojra". Key Service: "Premium Local Website Design & Local SEO Integration".
  2. Faisalabad: Industrial/Textile capital. Focus Keyword: "Shopify Expert and Web Development Services Faisalabad". Key Service: "Textile E-Commerce & Corporate Enterprise Portals".
  3. Lahore: Tech Capital. Focus Keyword: "Hire Top React & Next.js Developer in Lahore". Key Service: "Next.js/React Full-Stack Apps & Generative AI Solutions".
  4. Karachi: Financial hub. Focus Keyword: "Senior MERN Stack Web Engineer in Karachi". Key Service: "High-Performance MERN Stack & Fintech Web Apps".
  5. Islamabad / Rawalpindi: Federal capital. Focus Keyword: "Best Corporate Website Designer in Islamabad". Key Service: "Corporate Portfolios & Security-First Cloud Integrations".
- Key Technical Skills: Next.js, React, Node.js, Express, MongoDB, MERN Stack, WordPress, Shopify, Tailwind CSS, Generative AI (Gemini API, @google/genai SDK, custom chatbots, RAG pipelines).
- Sitemaps/Assets: Sitemaps, Robots.txt, and professional LD-JSON/JSON-LD schemas are fully active on www.mrsaqib.me.

Construct a response answering the question: "${question}". Ensure it matches the specific tone of ${activeEngine} (Gemini: structured, helpful, professional; Perplexity: citation-dense, factual, succinct; ChatGPT: engaging, clear, highly structured).
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: question,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            responseText: { 
              type: Type.STRING, 
              description: "The conversational markdown response including citation brackets like [1], [2]." 
            },
            citations: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Array of citation URLs or source labels relevant to the response, e.g. 'https://www.mrsaqib.me/#about'."
            },
            intent: { 
              type: Type.STRING, 
              description: "The interpreted search intent of the user query." 
            },
            entities: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "List of core entities extracted from the query & answer." 
            },
            confidenceScore: { 
              type: Type.INTEGER, 
              description: "A realistic integer score out of 100 representing semantic alignment." 
            },
            indexingStatus: { 
              type: Type.STRING, 
              description: "Status string, e.g., 'INDEXED & VERIFIED'." 
            }
          },
          required: ["responseText", "citations", "intent", "entities", "confidenceScore", "indexingStatus"]
        }
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Empty response received from Gemini.");
    }

    const parsedData = JSON.parse(responseText);
    return res.status(200).json(parsedData);
  } catch (error: any) {
    console.error("GEO API Route Error:", error);
    // If the error is missing API key, provide a clear custom message
    const isMissingKey = !process.env.GEMINI_API_KEY;
    return res.status(500).json({ 
      error: "AI_ERROR", 
      message: error?.message || "Internal server error occurred during AI indexing.",
      isMissingKey 
    });
  }
}
