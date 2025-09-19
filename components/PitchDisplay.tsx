import React, { useState } from 'react';
import type { Tool, GeneratedContent, OutreachKit, ObjectionResponse, DiscoveryPrep, OutreachInput, QAResponse, ProspectAnalysis, AllInputs, OutreachStep, CallAnalysis, CallAnalysisMoment } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { CheckIcon } from './icons/CheckIcon';
import { EnvelopeIcon } from './icons/EnvelopeIcon';
import { LinkedInIcon } from './icons/LinkedInIcon';
import { PhoneIcon } from './icons/PhoneIcon';
import { LightBulbIcon } from './icons/LightBulbIcon';
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import { GmailIcon } from './icons/GmailIcon';
import { LinkIcon } from './icons/LinkIcon';
import { UserIcon } from './icons/UserIcon';
import { ChatBubbleIcon } from './icons/ChatBubbleIcon';
import { MicrophoneIcon } from './icons/MicrophoneIcon';


const useCopyToClipboard = (timeout = 2000) => {
  const [isCopied, setIsCopied] = useState(false);
  const [copiedText, setCopiedText] = useState('');

  const copy = (text: string, id: string) => {
    if (typeof window === 'undefined' || !navigator.clipboard?.writeText) {
      return;
    }
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      setCopiedText(id);
      setTimeout(() => {
        setIsCopied(false);
        setCopiedText('');
      }, timeout);
    });
  };

  return { isCopied, copy, copiedText };
};

const CallCoachDisplay: React.FC<{ data: CallAnalysis }> = ({ data }) => {
  const { overall_feedback, key_moments_analysis, actionable_improvements } = data;

  const getTacticColor = (tactic: string) => {
    if (tactic.toLowerCase().includes('missed')) {
      return 'border-amber-500/40 bg-amber-900/20';
    }
    if (tactic.toLowerCase().includes('good') || tactic.toLowerCase().includes('effective') || tactic.toLowerCase().includes('labeling') || tactic.toLowerCase().includes('mirroring')) {
      return 'border-green-500/40 bg-green-900/20';
    }
    return 'border-slate-600';
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
        <div className="flex items-center gap-3 mb-3">
          <SparklesIcon className="w-5 h-5 text-blue-400" />
          <h3 className="text-md font-semibold text-slate-200">Overall Feedback</h3>
        </div>
        <p className="text-slate-300 text-sm">{overall_feedback}</p>
      </div>

      <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
        <div className="flex items-center gap-3 mb-3">
          <MicrophoneIcon className="w-5 h-5 text-blue-400" />
          <h3 className="text-md font-semibold text-slate-200">Key Moments Analysis</h3>
        </div>
        <div className="space-y-4">
          {key_moments_analysis.map((moment, i) => (
            <div key={i} className={`p-3 rounded-md border ${getTacticColor(moment.tactic_used)}`}>
              <blockquote className="border-l-2 border-slate-500 pl-3 text-xs italic text-slate-400 font-mono mb-2">
                "{moment.transcript_snippet}"
              </blockquote>
              <p className="text-xs font-semibold text-slate-300 mb-1">{moment.tactic_used}</p>
              <p className="text-xs text-slate-400">{moment.feedback}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
          <div className="flex items-center gap-3 mb-3">
            <LightBulbIcon className="w-5 h-5 text-blue-400" />
            <h3 className="text-md font-semibold text-slate-200">Actionable Improvements</h3>
          </div>
          <ul className="list-disc list-inside space-y-2 text-slate-300 text-sm">
            {actionable_improvements.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>
    </div>
  );
};


const ProspectDisplay: React.FC<{ data: ProspectAnalysis }> = ({ data }) => {
  const { isCopied, copy, copiedText } = useCopyToClipboard();
  const { summary, vimeo_relevance, icebreakers, key_talking_points, suggested_outreach_email } = data;

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
        <div className="flex items-center gap-3 mb-3">
          <UserIcon className="w-5 h-5 text-blue-400" />
          <h3 className="text-md font-semibold text-slate-200">Professional Summary</h3>
        </div>
        <p className="text-slate-300 text-sm">{summary}</p>
      </div>
      
      <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
        <div className="flex items-center gap-3 mb-3">
          <SparklesIcon className="w-5 h-5 text-blue-400" />
          <h3 className="text-md font-semibold text-slate-200">Why Vimeo? (The Angle)</h3>
        </div>
        <p className="text-slate-300 text-sm">{vimeo_relevance}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
          <div className="flex items-center gap-3 mb-3">
            <ChatBubbleIcon className="w-5 h-5 text-blue-400" />
            <h3 className="text-md font-semibold text-slate-200">Icebreakers</h3>
          </div>
          <ul className="list-disc list-inside space-y-2 text-slate-300 text-sm">
            {icebreakers.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>
        <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
          <div className="flex items-center gap-3 mb-3">
            <LightBulbIcon className="w-5 h-5 text-blue-400" />
            <h3 className="text-md font-semibold text-slate-200">Key Talking Points</h3>
          </div>
          <ul className="list-disc list-inside space-y-2 text-slate-300 text-sm">
            {key_talking_points.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>
      </div>

      <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
        <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-3">
                <EnvelopeIcon className="w-5 h-5 text-blue-400" />
                <h3 className="text-md font-semibold text-slate-200">Suggested Outreach Email</h3>
            </div>
        </div>
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400 w-16">Subject:</span>
                <input readOnly value={suggested_outreach_email.subject} className="flex-1 bg-slate-800/60 border border-slate-700 rounded-md p-2 text-sm text-slate-200" />
                 <button onClick={() => copy(suggested_outreach_email.subject, 'subject')} className="text-slate-400 hover:text-white transition-colors text-xs flex items-center gap-1 p-1.5 rounded-md bg-slate-700/50 hover:bg-slate-700">
                    {copiedText === 'subject' ? <CheckIcon className="w-4 h-4 text-green-400" /> : <ClipboardIcon className="w-4 h-4" />}
                </button>
            </div>
            <div className="relative">
                <textarea readOnly value={suggested_outreach_email.body} className="w-full bg-slate-800/60 border border-slate-700 rounded-md p-3 text-sm text-slate-200 min-h-[150px] whitespace-pre-wrap font-sans" />
                <button onClick={() => copy(suggested_outreach_email.body, 'body')} className="absolute top-2 right-2 text-slate-400 hover:text-white transition-colors text-xs flex items-center gap-1.5 p-1.5 rounded-md bg-slate-700/50 hover:bg-slate-700">
                    {copiedText === 'body' ? <CheckIcon className="w-4 h-4 text-green-400" /> : <ClipboardIcon className="w-4 h-4" />}
                    <span>{copiedText === 'body' ? 'Copied' : 'Copy'}</span>
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};


const QADisplay: React.FC<{ data: QAResponse }> = ({ data }) => {
  const { isCopied, copy } = useCopyToClipboard();

  return (
    <div className="space-y-6">
        <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 transition-all hover:border-slate-600">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-md font-semibold text-slate-200">Answer</h3>
              <button
                onClick={() => copy(data.answer, 'answer')}
                className="text-slate-400 hover:text-white transition-colors text-xs flex items-center gap-1.5 p-1.5 rounded-md bg-slate-700/50 hover:bg-slate-700 border border-slate-600"
              >
                {isCopied ? <CheckIcon className="w-4 h-4 text-green-400" /> : <ClipboardIcon className="w-4 h-4" />}
                <span>{isCopied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <div className="text-slate-300 text-sm space-y-3 whitespace-pre-wrap font-sans prose prose-sm prose-invert max-w-none prose-p:my-0 prose-ul:my-0 prose-li:my-0" dangerouslySetInnerHTML={{ __html: data.answer.replace(/\n/g, '<br />') }} />
        </div>
      
      {data.sources && data.sources.length > 0 && (
        <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
          <h3 className="text-md font-semibold text-slate-200 mb-3">Sources</h3>
          <div className="space-y-2">
            {data.sources.map((source, index) => (
              <a 
                key={index} 
                href={source.uri} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-start gap-2 text-xs text-blue-400 hover:text-blue-300 hover:underline transition-colors p-2 bg-slate-800/50 rounded-md"
              >
                <LinkIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className="truncate">{source.title}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


const OutreachKitDisplay: React.FC<{ data: OutreachKit; inputs: OutreachInput }> = ({ data, inputs }) => {
  const { isCopied, copy, copiedText } = useCopyToClipboard();

  const getIconForStep = (type: string) => {
    switch (type) {
      case 'Email': return <EnvelopeIcon className="w-5 h-5 text-blue-400" />;
      case 'LinkedIn': return <LinkedInIcon className="w-5 h-5 text-blue-400" />;
      case 'Call': return <PhoneIcon className="w-5 h-5 text-blue-400" />;
      default: return <DocumentTextIcon className="w-5 h-5 text-blue-400" />;
    }
  };
  
  const createGmailLink = (step: OutreachStep) => {
    const subject = encodeURIComponent(step.title);
    const body = encodeURIComponent(step.content);
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${inputs.recipientEmail || ''}&su=${subject}&body=${body}`;
  };
  
  const createLinkedInSearchLink = () => {
     return `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(inputs.company)}`;
  };
  
  const copyActivityLog = (step: OutreachStep) => {
    const log = `Logged ${step.type}: Sent '${step.title}' to ${inputs.company}.`;
    copy(log, `log-${step.title}`);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-white mb-2">Your Outreach Sequence</h2>
      {data.sequence.map((step, index) => (
        <div key={index} className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 transition-all hover:border-slate-600">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-3">
              {getIconForStep(step.type)}
              <h3 className="text-md font-semibold text-slate-200">{step.title}</h3>
            </div>
          </div>
          <p className="text-sm text-slate-400 mb-4">{step.instructions}</p>
          <div className="bg-slate-800/50 p-3 rounded-md border border-slate-600">
             <p className="text-slate-300 text-sm whitespace-pre-wrap font-sans">{step.content}</p>
          </div>
           <div className="mt-4 flex flex-wrap items-center gap-2">
             {step.type === 'Email' && inputs.recipientEmail && (
                <a href={createGmailLink(step)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-3 rounded-md transition-colors">
                  <GmailIcon className="w-4 h-4" />
                  Compose in Gmail
                </a>
             )}
             {step.type === 'LinkedIn' && (
                <a href={createLinkedInSearchLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-3 rounded-md transition-colors">
                  <LinkedInIcon className="w-4 h-4" />
                  Find on LinkedIn
                </a>
             )}
              <button
                onClick={() => copy(step.content, `content-${step.title}`)}
                className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white font-semibold py-2 px-3 rounded-md transition-colors bg-slate-700 hover:bg-slate-600"
              >
                {isCopied && copiedText === `content-${step.title}` ? <CheckIcon className="w-4 h-4 text-green-400" /> : <ClipboardIcon className="w-4 h-4" />}
                {isCopied && copiedText === `content-${step.title}` ? 'Copied!' : 'Copy Content'}
              </button>
              <button
                onClick={() => copyActivityLog(step)}
                className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white font-semibold py-2 px-3 rounded-md transition-colors bg-slate-700 hover:bg-slate-600"
              >
                 {isCopied && copiedText === `log-${step.title}` ? <CheckIcon className="w-4 h-4 text-green-400" /> : <ClipboardIcon className="w-4 h-4" />}
                 {isCopied && copiedText === `log-${step.title}` ? 'Copied!' : 'Copy Activity Log'}
              </button>
           </div>
        </div>
      ))}
    </div>
  );
};


const ObjectionResponseDisplay: React.FC<{ data: ObjectionResponse }> = ({ data }) => {
  const { isCopied, copy } = useCopyToClipboard();
  return (
    <div className="space-y-4">
      <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 mb-4 transition-all hover:border-slate-600">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-3">
            <div className="text-blue-400"><LightBulbIcon className="w-5 h-5" /></div>
            <h3 className="text-md font-semibold text-slate-200">Suggested Response</h3>
          </div>
          <button
            onClick={() => copy(data.suggested_response, 'response')}
            className="text-slate-400 hover:text-white transition-colors text-xs flex items-center gap-1.5 p-1.5 rounded-md bg-slate-700/50 hover:bg-slate-700 border border-slate-600"
          >
            {isCopied ? <CheckIcon className="w-4 h-4 text-green-400" /> : <ClipboardIcon className="w-4 h-4" />}
            <span>{isCopied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
        <div className="text-slate-300 text-sm space-y-2 whitespace-pre-wrap font-sans"><p>{data.suggested_response}</p></div>
      </div>

      <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
        <h3 className="text-md font-semibold text-slate-200 mb-2">Key Talking Points</h3>
        <ul className="list-disc list-inside space-y-1 text-slate-300 text-sm">
          {data.talking_points.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const DiscoveryPrepDisplay: React.FC<{ data: DiscoveryPrep }> = ({ data }) => {
  const { isCopied, copy } = useCopyToClipboard();
  return (
    <div className="space-y-4">
      <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 mb-4 transition-all hover:border-slate-600">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-3">
            <div className="text-blue-400"><DocumentTextIcon className="w-5 h-5" /></div>
            <h3 className="text-md font-semibold text-slate-200">Company Research Summary</h3>
          </div>
          <button
            onClick={() => copy(data.research_summary, 'summary')}
            className="text-slate-400 hover:text-white transition-colors text-xs flex items-center gap-1.5 p-1.5 rounded-md bg-slate-700/50 hover:bg-slate-700 border border-slate-600"
          >
            {isCopied ? <CheckIcon className="w-4 h-4 text-green-400" /> : <ClipboardIcon className="w-4 h-4" />}
            <span>{isCopied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
        <div className="text-slate-300 text-sm space-y-2 whitespace-pre-wrap font-sans"><p>{data.research_summary}</p></div>
      </div>
      
      <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
        <h3 className="text-md font-semibold text-slate-200 mb-2">Key Discovery Questions</h3>
        <ul className="list-disc list-inside space-y-1 text-slate-300 text-sm">
          {data.key_questions.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
      </div>
      <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
        <h3 className="text-md font-semibold text-slate-200 mb-2">Potential Pain Points to Listen For</h3>
        <ul className="list-disc list-inside space-y-1 text-slate-300 text-sm">
          {data.potential_pain_points.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const LoadingState: React.FC = () => (
  <div className="flex flex-col items-center justify-center text-center text-slate-400 min-h-[200px]">
    <SparklesIcon className="w-10 h-10 text-blue-500 animate-pulse mb-4" />
    <p className="font-semibold text-slate-300">Generating insights...</p>
    <p className="text-xs mt-1">This might take a few seconds.</p>
  </div>
);

const ErrorState: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex flex-col items-center justify-center text-center text-red-400 bg-red-900/20 border border-red-500/30 p-4 rounded-lg min-h-[200px]">
    <p className="font-bold">An Error Occurred</p>
    <p className="text-sm mt-1">{message}</p>
  </div>
);

const WelcomeState: React.FC = () => (
    <div className="flex flex-col items-center justify-center text-center text-slate-400 min-h-[200px]">
        <SparklesIcon className="w-10 h-10 text-slate-500 mb-4" />
        <h3 className="text-lg font-bold text-slate-200">AI-Powered Content Awaits</h3>
        <p className="mt-1 text-sm">Select a tool and fill out the form to generate your sales assets.</p>
    </div>
);

interface PitchDisplayProps {
  activeTool: Tool;
  data: GeneratedContent;
  isLoading: boolean;
  error: string | null;
  inputs: AllInputs | null;
}

export const PitchDisplay: React.FC<PitchDisplayProps> = ({ activeTool, data, isLoading, error, inputs }) => {
  const renderContent = () => {
    if (isLoading) return <LoadingState />;
    if (error) return <ErrorState message={error} />;
    if (!data) return <WelcomeState />;

    return (
        <div className="animate-fade-in">
            {activeTool === 'prospect' && <ProspectDisplay data={data as ProspectAnalysis} />}
            {activeTool === 'qa' && <QADisplay data={data as QAResponse} />}
            {activeTool === 'outreach' && <OutreachKitDisplay data={data as OutreachKit} inputs={inputs as OutreachInput}/>}
            {activeTool === 'objection' && <ObjectionResponseDisplay data={data as ObjectionResponse} />}
            {activeTool === 'discovery' && <DiscoveryPrepDisplay data={data as DiscoveryPrep} />}
            {activeTool === 'call-coach' && <CallCoachDisplay data={data as CallAnalysis} />}
        </div>
    );
  };
  
  return (
      <div className="bg-slate-800/50 p-6 rounded-lg shadow-lg border border-slate-700 min-h-[300px]">
        {renderContent()}
      </div>
  );
};