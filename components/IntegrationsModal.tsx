import React from 'react';
import type { ConnectedApp } from '../types';
import { SalesforceIcon } from './icons/SalesforceIcon';
import { OutreachIcon } from './icons/OutreachIcon';
import { LinkedInIcon } from './icons/LinkedInIcon';
import { ClariIcon } from './icons/ClariIcon';
import { GmailIcon } from './icons/GmailIcon';
import { XMarkIcon } from './icons/XMarkIcon';

interface IntegrationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apps: ConnectedApp[];
  onToggleConnection: (appId: string) => void;
}

const appIcons: { [key: string]: React.ReactNode } = {
  salesforce: <SalesforceIcon className="w-8 h-8" />,
  outreach: <OutreachIcon className="w-8 h-8" />,
  linkedin: <LinkedInIcon className="w-8 h-8 text-[#0A66C2]" />,
  clari: <ClariIcon className="w-8 h-8" />,
  gmail: <GmailIcon className="w-8 h-8" />,
};

const AppIntegrationCard: React.FC<{ app: ConnectedApp; onToggle: (id: string) => void; }> = ({ app, onToggle }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600">
      <div className="flex items-center gap-4">
        {appIcons[app.id]}
        <span className="font-semibold text-white">{app.name}</span>
      </div>
      <button
        onClick={() => onToggle(app.id)}
        className={`px-4 py-2 text-xs font-bold rounded-md transition-colors ${
          app.connected
            ? 'bg-red-600/50 text-red-200 hover:bg-red-600/80'
            : 'bg-green-600/50 text-green-200 hover:bg-green-600/80'
        }`}
      >
        {app.connected ? 'Disconnect' : 'Connect'}
      </button>
    </div>
  );
};

export const IntegrationsModal: React.FC<IntegrationsModalProps> = ({ isOpen, onClose, apps, onToggleConnection }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in-fast"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-md m-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h2 className="text-lg font-bold text-white">Manage Integrations</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          <p className="text-sm text-slate-400 mb-6">
            Connect your favorite apps to streamline your workflow. Note: These are for demonstration purposes only.
          </p>
          <div className="space-y-4">
            {apps.map((app) => (
              <AppIntegrationCard key={app.id} app={app} onToggle={onToggleConnection} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
