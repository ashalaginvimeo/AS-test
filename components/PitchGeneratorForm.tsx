import React, { useState, FormEvent } from 'react';
import type { Tool, OutreachInput, ObjectionInput, DiscoveryInput, QAInput, ProspectInput, CallCoachInput, AllInputs } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';

interface PitchGeneratorFormProps {
  activeTool: Tool;
  onSubmit: (data: AllInputs) => void;
  isLoading: boolean;
}

const commonInputClass = "w-full bg-slate-700/50 border border-slate-600 rounded-md p-3 text-sm text-slate-200 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all";
const commonLabelClass = "block text-xs font-medium text-slate-400 mb-1";
const commonTextareaClass = `${commonInputClass} min-h-[80px]`;

const SubmitButton: React.FC<{ isLoading: boolean; text: string }> = ({ isLoading, text }) => (
    <button type="submit" disabled={isLoading} className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-wait">
        {isLoading ? (
            <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Analyzing...</span>
            </>
        ) : (
            <>
                <SparklesIcon className="w-5 h-5" />
                <span>{text}</span>
            </>
        )}
    </button>
);

const CallCoachForm: React.FC<{ onSubmit: (data: CallCoachInput) => void; isLoading: boolean }> = ({ onSubmit, isLoading }) => {
    const [formData, setFormData] = useState<CallCoachInput>({
        transcript: `>>Arthur Shalagin\t00:00
Hello? Who is this? Hey, Alex. It's Arthur with Vimeo.

>>Customer\t00:07
Hi, Arthur. Yeah, I've got a packed schedule. What's this about?

>>Arthur Shalagin\t00:13
So, I saw that you're heading up digital content at Upfaith and Family. I was wondering how you guys are thinking about monetizing it.

>>Customer\t00:24
We're on Vimeo OTT. We've had good subscriber growth, so that side's under control. Sorry, can you get to the point? I just don't have much time right now.

>>Arthur Shalagin\t00:34
I see that you're on our self -serve product, which puts you into some limitations. I wanted to set up a call because as you guys scale, I want to make sure that you can take full advantage of the platform and scale for growth. Is this something you might be open to?

>>Customer\t00:55
Honestly, I'm not sure. We already have a pretty heavy investment in our current setup. And unless you've got something that solves a really pressing issue, I don't know if this is a priority. Can you just tell me what exactly you're offering? I really can't do another call unless it's absolutely necessary.
`
    });

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="transcript" className={commonLabelClass}>Sales Call Transcript</label>
                <textarea id="transcript" name="transcript" value={formData.transcript} onChange={handleChange} className={`${commonTextareaClass} min-h-[300px] font-mono text-xs`} placeholder="Paste the full call transcript here..." required />
            </div>
            <SubmitButton isLoading={isLoading} text="Coach My Call" />
        </form>
    );
};

const ProspectForm: React.FC<{ onSubmit: (data: ProspectInput) => void; isLoading: boolean }> = ({ onSubmit, isLoading }) => {
    const [formData, setFormData] = useState<ProspectInput>({
        profileText: `Agatha Asch
CMO of Marketing Dream Teams Award-Winning Marketing That Grows Business & Brands
New York City Metropolitan Area

Summary
Creative, agile CMO and servant-leader with a passion for building high-trust teams and bold marketing that moves brands—and industries—forward.
As a marketing executive and ad agency veteran with two decades of leadership, I'm passionate about helping fast-growing companies scale through omnichannel programs that drive brand affinity, customer advocacy, and revenue growth.
As Chief Marketing Officer at DoorLoop, I lead a global marketing team spanning brand, demand, product marketing, content, and communications—partnering closely with product, sales, and customer success to drive sustainable growth and long-term customer love.
Previously, I held global marketing leadership roles at iCIMS and ABC Fitness, where I built and scaled regional teams, repositioned brands, and launched integrated programs that fueled growth across enterprise and midmarket segments. Earlier in my career, I worked in brand strategy at leading ad agencies—shaping how I approach storytelling, differentiation, and emotional connection, even in performance-driven environments.

Experience
DoorLoop
Chief Marketing Officer
2025 - Present (less than a year)
Leading DoorLoop's global marketing team, supporting brand, demand, performance, product marketing, content, and communications professionals.

ABC Fitness
Global Marketing Vice President
2023 - 2025 (2 years)
Led the global marketing and communications team for the world's largest fitness technology provider.

iCIMS
Vice President, Global Brand & Growth Marketing
2021 - 2023 (2 years)
Led a team of 20+ marketers across North America and Europe for a global, PE-backed tech leader. Evolving the HR SaaS company's brand, content marketing, and web performance departments.

Awards:
Cannes Cyber Lion Award - Old Spice Marketing Campaign
Finalist @ Shorty Awards - Oreo Superbowl Marketing Campaign
`,
    });

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="profileText" className={commonLabelClass}>Prospect's LinkedIn Profile or Resume Text</label>
                <textarea id="profileText" name="profileText" value={formData.profileText} onChange={handleChange} className={`${commonTextareaClass} min-h-[300px]`} placeholder="Paste the full text from a prospect's LinkedIn profile or resume here..." required />
            </div>
            <SubmitButton isLoading={isLoading} text="Analyze Prospect" />
        </form>
    );
};


const QAForm: React.FC<{ onSubmit: (data: QAInput) => void; isLoading: boolean }> = ({ onSubmit, isLoading }) => {
    const [formData, setFormData] = useState<QAInput>({
        question: 'What are the exact video and audio bitrate limits for Vimeo OTT streaming?',
    });

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="question" className={commonLabelClass}>Your Technical Question</label>
                <textarea id="question" name="question" value={formData.question} onChange={handleChange} className={`${commonTextareaClass} min-h-[120px]`} placeholder="e.g., How does domain restriction work for embedded videos in Vimeo Enterprise?" required />
            </div>
            <SubmitButton isLoading={isLoading} text="Get Answer" />
        </form>
    );
};

const OutreachForm: React.FC<{ onSubmit: (data: OutreachInput) => void; isLoading: boolean }> = ({ onSubmit, isLoading }) => {
    const [formData, setFormData] = useState<OutreachInput>({
        role: 'Marketing Manager',
        company: 'InnovateCorp',
        product: 'Vimeo Enterprise',
        painPoint: 'low employee engagement on internal video communications',
        valueProp: 'securely centralizing all video content to boost collaboration and knowledge sharing',
        recipientEmail: 'sarah.d@innovatecorp.com'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="role" className={commonLabelClass}>Prospect's Role</label>
                    <input type="text" id="role" name="role" value={formData.role} onChange={handleChange} className={commonInputClass} required />
                </div>
                 <div>
                    <label htmlFor="company" className={commonLabelClass}>Prospect's Company</label>
                    <input type="text" id="company" name="company" value={formData.company} onChange={handleChange} className={commonInputClass} required />
                </div>
            </div>
             <div>
                <label htmlFor="recipientEmail" className={commonLabelClass}>Recipient Email (Optional)</label>
                <input type="email" id="recipientEmail" name="recipientEmail" value={formData.recipientEmail} onChange={handleChange} className={commonInputClass} />
            </div>
            <div>
                <label htmlFor="product" className={commonLabelClass}>Your Product/Service</label>
                <input type="text" id="product" name="product" value={formData.product} onChange={handleChange} className={commonInputClass} required />
            </div>
            <div>
                <label htmlFor="painPoint" className={commonLabelClass}>Pain Point You Solve</label>
                <textarea id="painPoint" name="painPoint" value={formData.painPoint} onChange={handleChange} className={commonTextareaClass} required />
            </div>
            <div>
                <label htmlFor="valueProp" className={commonLabelClass}>Key Value Proposition</label>
                <textarea id="valueProp" name="valueProp" value={formData.valueProp} onChange={handleChange} className={commonTextareaClass} required />
            </div>
            <SubmitButton isLoading={isLoading} text="Generate Outreach Kit" />
        </form>
    );
};

const ObjectionForm: React.FC<{ onSubmit: (data: ObjectionInput) => void; isLoading: boolean }> = ({ onSubmit, isLoading }) => {
    const [formData, setFormData] = useState<ObjectionInput>({
        objection: 'We already use another video platform and we\'re happy with it.',
        context: 'This was said during an initial discovery call after I introduced Vimeo as a potential solution for their internal training videos.'
    });

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="objection" className={commonLabelClass}>Prospect's Objection</label>
                <textarea id="objection" name="objection" value={formData.objection} onChange={handleChange} className={commonTextareaClass} required />
            </div>
            <div>
                <label htmlFor="context" className={commonLabelClass}>Conversation Context</label>
                <textarea id="context" name="context" value={formData.context} onChange={handleChange} className={commonTextareaClass} required />
            </div>
            <SubmitButton isLoading={isLoading} text="Generate Response" />
        </form>
    );
};

const DiscoveryForm: React.FC<{ onSubmit: (data: DiscoveryInput) => void; isLoading: boolean }> = ({ onSubmit, isLoading }) => {
    const [formData, setFormData] = useState<DiscoveryInput>({
        company: 'Global Solutions Inc.',
        role: 'VP of Human Resources',
        goals: 'Looking to improve their onboarding process for remote employees and create a more consistent training experience.'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="company" className={commonLabelClass}>Prospect's Company</label>
                <input type="text" id="company" name="company" value={formData.company} onChange={handleChange} className={commonInputClass} required />
            </div>
            <div>
                <label htmlFor="role" className={commonLabelClass}>Prospect's Role</label>
                <input type="text" id="role" name="role" value={formData.role} onChange={handleChange} className={commonInputClass} required />
            </div>
            <div>
                <label htmlFor="goals" className={commonLabelClass}>Their Stated Goals/Interests</label>
                <textarea id="goals" name="goals" value={formData.goals} onChange={handleChange} className={commonTextareaClass} required />
            </div>
            <SubmitButton isLoading={isLoading} text="Prepare for Call" />
        </form>
    );
};

export const PitchGeneratorForm: React.FC<PitchGeneratorFormProps> = ({ activeTool, onSubmit, isLoading }) => {
    const renderForm = () => {
        switch (activeTool) {
            case 'prospect':
                return <ProspectForm onSubmit={onSubmit as (data: ProspectInput) => void} isLoading={isLoading} />;
            case 'qa':
                return <QAForm onSubmit={onSubmit as (data: QAInput) => void} isLoading={isLoading} />;
            case 'outreach':
                return <OutreachForm onSubmit={onSubmit as (data: OutreachInput) => void} isLoading={isLoading} />;
            case 'objection':
                return <ObjectionForm onSubmit={onSubmit as (data: ObjectionInput) => void} isLoading={isLoading} />;
            case 'discovery':
                return <DiscoveryForm onSubmit={onSubmit as (data: DiscoveryInput) => void} isLoading={isLoading} />;
            case 'call-coach':
                return <CallCoachForm onSubmit={onSubmit as (data: CallCoachInput) => void} isLoading={isLoading} />;
            default:
                return null;
        }
    };

    return (
        <div className="animate-fade-in">
            {renderForm()}
        </div>
    );
};