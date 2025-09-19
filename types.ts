export type Tool = 'outreach' | 'objection' | 'discovery' | 'qa' | 'prospect' | 'call-coach';

// Input types for the forms
export interface OutreachInput {
  role: string;
  company: string;
  product: string;
  painPoint: string;
  valueProp: string;
  recipientEmail?: string;
}

export interface ObjectionInput {
  objection: string;
  context: string;
}

export interface DiscoveryInput {
  company: string;
  role: string;
  goals: string;
}

export interface QAInput {
  question: string;
}

export interface ProspectInput {
  profileText: string;
}

export interface CallCoachInput {
  transcript: string;
}


export type AllInputs = OutreachInput | ObjectionInput | DiscoveryInput | QAInput | ProspectInput | CallCoachInput;

// Fix: Add ConnectedApp type for IntegrationsModal.
export interface ConnectedApp {
  id: string;
  name: string;
  connected: boolean;
}


// Output types from the Gemini API
export type OutreachStepType = 'Email' | 'LinkedIn' | 'Call';

export interface OutreachStep {
  type: OutreachStepType;
  title: string;
  instructions: string;
  content: string;
}

export interface OutreachKit {
  sequence: OutreachStep[];
}


export interface ObjectionResponse {
  talking_points: string[];
  suggested_response: string;
}

export interface DiscoveryPrep {
  key_questions: string[];
  potential_pain_points: string[];
  research_summary: string;
}

export interface GroundingSource {
  uri: string;
  title: string;
}

export interface QAResponse {
  answer: string;
  sources: GroundingSource[];
}

export interface ProspectAnalysis {
    summary: string;
    vimeo_relevance: string;
    icebreakers: string[];
    key_talking_points: string[];
    suggested_outreach_email: {
        subject: string;
        body: string;
    };
}

export interface CallAnalysisMoment {
    transcript_snippet: string;
    tactic_used: string;
    feedback: string;
}

export interface CallAnalysis {
    overall_feedback: string;
    key_moments_analysis: CallAnalysisMoment[];
    actionable_improvements: string[];
}


// Union type for the generated content state
export type GeneratedContent = OutreachKit | ObjectionResponse | DiscoveryPrep | QAResponse | ProspectAnalysis | CallAnalysis | null;