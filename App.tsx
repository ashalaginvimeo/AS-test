import React, { useState, useCallback } from 'react';
import { PitchGeneratorForm } from './components/PitchGeneratorForm';
import { PitchDisplay } from './components/PitchDisplay';
import { generateOutreachKit, handleObjection, prepareDiscoveryCall, answerTechnicalQuestion, analyzeProspect, coachCall } from './services/geminiService';
import type { Tool, GeneratedContent, OutreachInput, ObjectionInput, DiscoveryInput, QAInput, AllInputs, ProspectInput, CallCoachInput } from './types';
import { VimeoLogo } from './components/icons/VimeoLogo';
import { DocumentTextIcon } from './components/icons/DocumentTextIcon';
import { ChatBubbleIcon } from './components/icons/ChatBubbleIcon';
import { SearchIcon } from './components/icons/SearchIcon';
import { QuestionMarkCircleIcon } from './components/icons/QuestionMarkCircleIcon';
import { UserIcon } from './components/icons/UserIcon';
import { MicrophoneIcon } from './components/icons/MicrophoneIcon';

const Sidebar: React.FC<{ 
  activeTool: Tool; 
  setActiveTool: (tool: Tool) => void; 
  isLoading: boolean;
}> = ({ activeTool, setActiveTool, isLoading }) => {
  const tools: { id: Tool; name: string; icon: React.ReactNode }[] = [
    { id: 'prospect', name: 'Prospect Insights', icon: <UserIcon className="w-5 h-5" /> },
    { id: 'call-coach', name: 'Call Coach', icon: <MicrophoneIcon className="w-5 h-5" /> },
    { id: 'qa', name: 'Technical Q&A', icon: <QuestionMarkCircleIcon className="w-5 h-5" /> },
    { id: 'outreach', name: 'Outreach Kit', icon: <DocumentTextIcon className="w-5 h-5" /> },
    { id: 'objection', name: 'Objection Handler', icon: <ChatBubbleIcon className="w-5 h-5" /> },
    { id: 'discovery', name: 'Discovery Prep', icon: <SearchIcon className="w-5 h-5" /> },
  ];

  return (
    <aside className="bg-slate-800/50 p-4 md:p-6 rounded-lg border border-slate-700 md:row-span-2 flex flex-col">
      <div className="flex-grow">
        <div className="flex items-center gap-3 mb-6">
          <VimeoLogo className="h-8 w-8 text-[#00adef]" />
          <div>
            <h1 className="text-lg font-bold text-white">Sales Co-pilot</h1>
            <p className="text-xs text-slate-400">Your AI-Powered Sales Assistant</p>
          </div>
        </div>
        <nav className="space-y-2">
          {tools.map((tool) => (
            <button
              key={tool.id}
              disabled={isLoading}
              onClick={() => setActiveTool(tool.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-md text-sm font-medium transition-colors ${
                activeTool === tool.id
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-700'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {tool.icon}
              <span>{tool.name}</span>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
};

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<Tool>('prospect');
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent>(null);
  const [lastInputs, setLastInputs] = useState<AllInputs | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = useCallback(async (data: AllInputs) => {
    setIsLoading(true);
    setError(null);
    setGeneratedContent(null);
    setLastInputs(data);
    
    try {
      let content: GeneratedContent = null;
      switch (activeTool) {
        case 'prospect':
          content = await analyzeProspect(data as ProspectInput);
          break;
        case 'outreach':
          content = await generateOutreachKit(data as OutreachInput);
          break;
        case 'objection':
          content = await handleObjection(data as ObjectionInput);
          break;
        case 'discovery':
          content = await prepareDiscoveryCall(data as DiscoveryInput);
          break;
        case 'qa':
          content = await answerTechnicalQuestion(data as QAInput);
          break;
        case 'call-coach':
            content = await coachCall(data as CallCoachInput);
            break;
      }
      setGeneratedContent(content);
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to generate content. ${message}`);
    } finally {
      setIsLoading(false);
    }
  }, [activeTool]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans">
      <div className="container mx-auto p-4 sm:p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
          <Sidebar 
            activeTool={activeTool} 
            setActiveTool={setActiveTool} 
            isLoading={isLoading}
          />
          
          <div className="bg-slate-800/50 p-6 rounded-lg shadow-lg border border-slate-700">
             <PitchGeneratorForm
              activeTool={activeTool}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>

          <div className="md:col-start-2 space-y-6">
             <PitchDisplay
              activeTool={activeTool}
              data={generatedContent}
              isLoading={isLoading}
              error={error}
              inputs={lastInputs}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;