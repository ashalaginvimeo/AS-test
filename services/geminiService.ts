import { GoogleGenAI, Type } from "@google/genai";
import type {
  OutreachInput,
  ObjectionInput,
  DiscoveryInput,
  QAInput,
  ProspectInput,
  CallCoachInput,
  OutreachKit,
  ObjectionResponse,
  DiscoveryPrep,
  QAResponse,
  ProspectAnalysis,
  CallAnalysis,
  GroundingSource,
} from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-2.5-flash';

const KNOWLEDGE_PREAMBLE = `You are an expert sales AI and strategic coach for Vimeo. Your knowledge base is exclusively trained on Vimeo's internal sales strategies, which are heavily based on Chris Voss's "Never Split the Difference" negotiation framework (emphasizing Tactical Empathy, Labeling, Mirroring, and Calibrated Questions). You also have deep knowledge of Vimeo's customer success stories (e.g., Santander, Rite Aid, Starbucks, Wise), recent Q3'24 win/loss reports, product deep-dives, and official sales glossaries. Your responses must reflect this specific training, providing strategic, empathetic, and actionable advice.`;

async function generateJson<T>(prompt: string, schema: any): Promise<T> {
  const fullPrompt = `${KNOWLEDGE_PREAMBLE}\n\n${prompt}`;
  const response = await ai.models.generateContent({
    model: model,
    contents: fullPrompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: schema,
    },
  });

  const text = response.text;
  
  try {
    return JSON.parse(text) as T;
  } catch (e) {
    console.error("Failed to parse JSON response:", text, e);
    throw new Error("The response from the AI was not valid JSON.");
  }
}

export const coachCall = async (data: CallCoachInput): Promise<CallAnalysis> => {
    const { transcript } = data;
    const prompt = `
      Analyze the following sales call transcript. Provide actionable feedback to the sales rep based on the Voss negotiation framework and Vimeo's sales playbook.

      **Call Transcript:**
      ---
      ${transcript}
      ---

      Generate a JSON object with your analysis. For 'key_moments_analysis', identify specific parts of the transcript, classify the tactic used (or missed), and provide concise feedback. For 'actionable_improvements', suggest 3 concrete steps the rep can take in their next call.
    `;
    const schema = {
        type: Type.OBJECT,
        properties: {
            overall_feedback: { type: Type.STRING, description: "A high-level summary of the rep's performance on the call, highlighting strengths and key areas for improvement based on the Voss method." },
            key_moments_analysis: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        transcript_snippet: { type: Type.STRING, description: "An exact, brief quote from the transcript illustrating the point." },
                        tactic_used: { type: Type.STRING, description: "The name of the tactic used or missed (e.g., 'Labeling', 'Missed Mirroring Opportunity', 'Calibrated Question')." },
                        feedback: { type: Type.STRING, description: "Concise analysis of why this moment was effective or how it could have been improved." }
                    },
                     required: ["transcript_snippet", "tactic_used", "feedback"]
                },
                description: "An array analyzing 3-4 key moments from the call."
            },
            actionable_improvements: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "A list of 3 specific, actionable recommendations for the rep's next call, referencing the Voss framework."
            }
        },
        required: ["overall_feedback", "key_moments_analysis", "actionable_improvements"]
    };
    return generateJson<CallAnalysis>(prompt, schema);
}

export const analyzeProspect = async (data: ProspectInput): Promise<ProspectAnalysis> => {
  const { profileText } = data;
  const prompt = `
    Analyze the following resume/LinkedIn profile text to generate a concise, actionable sales briefing. Focus on identifying opportunities where Vimeo's products would be a strong fit, and craft outreach materials that align with the Voss negotiation method.

    **Prospect's Profile Text:**
    ---
    ${profileText}
    ---

    Generate a JSON object. The outreach email should be framed to start a conversation and uncover pain points, rather than a hard pitch. Use a 'No-oriented' question if appropriate.
  `;
  
  const schema = {
    type: Type.OBJECT,
    properties: {
      summary: { type: Type.STRING, description: "A 2-3 sentence professional summary of the person." },
      vimeo_relevance: { type: Type.STRING, description: "A paragraph explaining why this person and their company are a strong potential fit for Vimeo, referencing specific experiences or roles. Use insights from customer stories (e.g., linking marketing leadership to Santander's use case)." },
      icebreakers: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "An array of 3 personalized conversation starters specific to their profile."
      },
      key_talking_points: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "An array of 3 bullet points connecting the prospect's likely challenges to specific Vimeo solutions, informed by our win/loss data."
      },
      suggested_outreach_email: {
        type: Type.OBJECT,
        properties: {
          subject: { type: Type.STRING, description: "A compelling and personalized subject line for a cold outreach email." },
          body: { type: Type.STRING, description: "The full body of a personalized, concise email that uses Voss tactics like labeling or calibrated questions to start a conversation." }
        },
         required: ["subject", "body"]
      }
    },
    required: ["summary", "vimeo_relevance", "icebreakers", "key_talking_points", "suggested_outreach_email"]
  };
  
  return generateJson<ProspectAnalysis>(prompt, schema);
};


export const answerTechnicalQuestion = async (data: QAInput): Promise<QAResponse> => {
    const { question } = data;
    const prompt = `
    You are a senior Vimeo Solutions Engineer. Answer the sales rep's question based *only* on information from the provided Google Search results, which are restricted to official Vimeo domains. Use terminology from the internal Vimeo glossary where appropriate. If the answer isn't in the search results, state that.

    Here is the question:
    "${question}"
    `;

    const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
            tools: [{googleSearch: {}}],
        },
    });

    const answer = response.text;
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    const sources: GroundingSource[] = groundingChunks
      .map((chunk: any) => ({
        uri: chunk.web?.uri || '',
        title: chunk.web?.title || 'Unknown Source',
      }))
      .filter(source => source.uri);

    return { answer, sources };
};

export const generateOutreachKit = async (data: OutreachInput): Promise<OutreachKit> => {
  const { role, company, product, painPoint, valueProp } = data;
  const prompt = `
    Create a 3-step outreach sequence for a prospect based on the Voss method. The goal is to start a conversation and secure a meeting by building trust and uncovering needs.

    **Prospect Details:**
    - Title: ${role}
    - Company: ${company}

    **Vimeo's Solution:**
    - Product/Feature: ${product}
    - Pain Point It Solves: ${painPoint}
    - Key Value Proposition: ${valueProp}

    Generate a sequence with 'Email', 'LinkedIn', and 'Call' steps. Emails should use labels or calibrated questions. LinkedIn steps should focus on rapport-building. Call scripts should be concise openers.
    `;

  const schema = {
    type: Type.OBJECT,
    properties: {
      sequence: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING, description: "Type of outreach: 'Email', 'LinkedIn', or 'Call'." },
            title: { type: Type.STRING, description: "The title of the step (e.g., 'Initial Cold Email', 'LinkedIn Connection Request')." },
            instructions: { type: Type.STRING, description: "A brief one-sentence instruction for the sales rep." },
            content: { type: Type.STRING, description: "The actual content (email body, LinkedIn message, call script)." }
          },
          required: ["type", "title", "instructions", "content"]
        }
      }
    }
  };
  
  return generateJson<OutreachKit>(prompt, schema);
};

export const handleObjection = async (data: ObjectionInput): Promise<ObjectionResponse> => {
  const { objection, context } = data;
  const prompt = `
    A prospect has raised an objection. Generate a strategy based on the Chris Voss framework to handle it.

    **Prospect's Objection:**
    "${objection}"

    **Conversation Context:**
    ${context}

    Provide a JSON object with:
    1.  **Talking Points:** 3-4 bullet points that use Tactical Empathy and Labeling to reframe the objection.
    2.  **Suggested Response:** A single paragraph for the rep that is empathetic, uses a Label to validate the prospect's feeling, and ends with a Calibrated Question to regain control of the conversation. Reference customer stories (e.g., Rite Aid increasing town hall attendance by 142%) or win/loss data as proof points where relevant.
    `;
    
  const schema = {
    type: Type.OBJECT,
    properties: {
      talking_points: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'Key points to address the objection using Voss tactics.',
      },
      suggested_response: {
        type: Type.STRING,
        description: 'A polished, ready-to-use response for the sales rep.',
      },
    },
  };

  return generateJson<ObjectionResponse>(prompt, schema);
};

export const prepareDiscoveryCall = async (data: DiscoveryInput): Promise<DiscoveryPrep> => {
  const { company, role, goals } = data;
  const prompt = `
    Create a discovery call prep sheet for a Vimeo AE.

    **Prospect Information:**
    - Company: ${company}
    - Contact Role: ${role}
    - Stated Goals/Interests: ${goals}

    Provide a JSON object with:
    1.  **Research Summary:** A brief summary of ${company} to use as an opener.
    2.  **Key Questions:** 5 powerful, Calibrated Questions (starting with 'What' or 'How') to uncover deep needs related to video.
    3.  **Potential Pain Points:** 3-4 common challenges for this role/industry that Vimeo solves, based on our customer stories and win/loss data (e.g., 'Consolidating multiple point solutions like Wistia and Frame.io').
    `;
    
  const schema = {
    type: Type.OBJECT,
    properties: {
      research_summary: {
        type: Type.STRING,
        description: "A brief summary of the prospect's company.",
      },
      key_questions: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "A list of probing, Calibrated Questions for the discovery call.",
      },
      potential_pain_points: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "Potential issues the prospect might be facing, based on internal Vimeo data.",
      },
    },
  };

  return generateJson<DiscoveryPrep>(prompt, schema);
};