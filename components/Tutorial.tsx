import React from 'react';

interface TutorialProps {
  onDismiss: () => void;
}

const TutorialStep: React.FC<{ icon: JSX.Element; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="flex-1 flex flex-col items-center text-center px-4">
    <div className="bg-zinc-700 p-4 rounded-full mb-3 text-amber-400">
      {icon}
    </div>
    <h3 className="font-semibold text-white mb-1">{title}</h3>
    <p className="text-zinc-400 text-sm">{description}</p>
  </div>
);

export const Tutorial: React.FC<TutorialProps> = ({ onDismiss }) => {
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 mb-8 relative">
      <button 
        onClick={onDismiss} 
        className="absolute top-3 right-3 text-zinc-500 hover:text-white transition-colors"
        aria-label="Dismiss tutorial"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <h2 className="text-2xl font-bold text-center text-white mb-6">How It Works</h2>
      <div className="flex flex-col md:flex-row justify-between items-start space-y-6 md:space-y-0 md:space-x-6">
        <TutorialStep
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
          title="1. Upload Your Photo"
          description="Start with a clear, full-body photo or a headshot. Our AI will prepare your virtual model."
        />
        <TutorialStep
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          title="2. Add Clothing Items"
          description="Upload images of clothes you want to try on. Give each item a simple description."
        />
        <TutorialStep
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>}
          title="3. Fit The Look"
          description="Click the button and watch the AI create your new look. It's that simple!"
        />
      </div>
    </div>
  );
};
